import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import LoadingSpinner from './LoadingSpinner';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return isLoginMode ? (
      <LoginForm onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <SignUpForm onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;