import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, AlertCircle } from 'lucide-react';

const Login = () => {
  const { signIn, signUp, isSupabaseReady } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          full_name: email.split('@')[0],
          email: email
        });
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
         <div className="text-center mb-8">
           <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Briefcase className="w-8 h-8 text-white" />
           </div>
          <h1 className="text-2xl font-bold text-gray-900">Project Manager</h1>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
         </div>

         {!isSupabaseReady && (
           <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
             <div className="flex items-center">
               <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
               <div>
                <p className="text-sm text-amber-800 font-medium">Demo Mode Active</p>
                <p className="text-xs text-amber-700 mt-1">
                  Supabase is not configured. Using demo data.
                </p>
               </div>
             </div>
           </div>
         )}

       {error && (
         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
           <p className="text-sm text-red-700">{error}</p>
         </div>
       )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-500 font-medium"
              disabled={loading}
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </div>
       </div>
     </div>
   );
};

export default Login;