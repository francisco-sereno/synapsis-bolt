import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  institution: string | null;
  department: string | null;
  position: string | null;
  orcid: string | null;
  role: 'admin' | 'researcher' | 'collaborator';
  avatar_url: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  isAdmin: boolean;
  isSupabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initAuth = async () => {
      try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          // Use demo mode
          const demoUser = {
            id: 'demo-user-123',
            email: 'demo@synapsis.edu'
          } as User;
          
          const demoProfile: Profile = {
            id: 'demo-user-123',
            email: 'demo@synapsis.edu',
            full_name: 'Dr. Demo Rodriguez',
            institution: 'Universidad Demo',
            department: 'Facultad de Educación',
            position: 'Profesor Titular',
            orcid: '0000-0000-0000-0000',
            role: 'researcher',
            avatar_url: null,
            preferences: {},
            created_at: '',
            updated_at: ''
          };
          
          if (mounted) {
            setUser(demoUser);
            setProfile(demoProfile);
            setIsSupabaseReady(false);
            setLoading(false);
          }
          return;
        }

        setIsSupabaseReady(true);

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }

        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
              setLoading(false);
            }
          }
        });
        
        authSubscription = data.subscription;

      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Try to fetch the profile directly
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST205') {
          // Table doesn't exist, use demo mode silently
          console.warn('Profiles table not found, using demo mode');
          setLoading(false);
          return null;
        }
        
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: user?.email?.split('@')[0] || 'Usuario',
              email: user?.email || '',
              role: 'researcher',
              institution: null,
              department: null,
              avatar_url: null
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }
          return newProfile;
        }
        console.error('Error fetching profile:', profileError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    if (!isSupabaseReady) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) return { error };

      if (data.user) {
        // Profile will be created automatically via trigger or auth state change
        const profileData = {
          id: data.user.id,
          email: data.user.email!,
          full_name: userData.full_name || null,
          institution: userData.institution || null,
          department: userData.department || null,
          position: userData.position || null,
          orcid: userData.orcid || null,
          role: (email === 'francisco.sereno.a@gmail.com' ? 'admin' : 'researcher') as 'admin' | 'researcher' | 'collaborator',
          avatar_url: null,
          preferences: {}
        } as Profile;

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError && profileError.code === 'PGRST205') {
          // Table doesn't exist, use demo mode
          console.warn('Profiles table not found, using demo mode');
          setLoading(false);
          return null;
        }
        
        if (profileError && profileError.code === 'PGRST205') {
          // Table doesn't exist, use demo mode
          console.log('Profiles table not found, using demo mode');
          return null;
        } else if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseReady) return;
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Handle session_not_found error gracefully - user is effectively logged out
      if (error && typeof error === 'object' && 'message' in error && 
          error.message?.includes('Session from session_id claim in JWT does not exist')) {
        console.warn('Session already expired during logout - treating as successful logout');
      } else {
        console.error('Sign out error:', error);
      }
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user logged in or Supabase not configured') };
    }

    if (!isSupabaseReady) {
      // In demo mode, just update local state
      if (profile) {
        setProfile({ ...profile, ...updates });
      }
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error && profile) {
        setProfile({ ...profile, ...updates });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const isAdmin = profile?.role === 'admin' || 
                  profile?.email === 'francisco.sereno.a@gmail.com' ||
                  user?.email === 'francisco.sereno.a@gmail.com';

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    isSupabaseReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};