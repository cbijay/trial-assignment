import { useAuthStore } from '@/features/auth/state/authStore';
import React from 'react';

export const useAuth = () => {
  const {
    user,
    isLoading,
    isAuthenticating,
    error,
    signIn,
    signUp,
    signOut,
    initializeAuth,
  } = useAuthStore();

  React.useEffect(() => {
    // Initialize auth and set up cleanup
    const unsubscribe = initializeAuth();
    return () => {
      unsubscribe?.();
    };
  }, [initializeAuth]);

  return {
    user,
    isLoading,
    isAuthenticating,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
};
