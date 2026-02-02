import {
  onAuthStateChanged,
  signIn as signInService,
  signInWithGoogle as signInWithGoogleService,
  signOutUser,
  signUp,
} from '@/features/auth/services/authService';
import { User } from 'firebase/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => (() => void) | void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticating: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isAuthenticating: true, error: null });
        try {
          const user = await signInService(email, password);
          set({ user, isAuthenticating: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isAuthenticating: false,
          });
          throw error;
        }
      },

      signInWithGoogle: async (idToken: string) => {
        set({ isAuthenticating: true, error: null });
        try {
          const user = await signInWithGoogleService(idToken);
          set({ user, isAuthenticating: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Google login failed',
            isAuthenticating: false,
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isAuthenticating: true, error: null });
        try {
          await signUp(email, password);
          // Don't set user state after signup - let user manually sign in
          set({ isAuthenticating: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Signup failed',
            isAuthenticating: false,
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await signOutUser();
          set({ user: null, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign out failed',
            isLoading: false,
          });
        }
      },

      initializeAuth: () => {
        const currentState = get();

        // If we already have a user in the store, don't show loading
        if (currentState.user) {
          return;
        }

        set({ isLoading: true });
        // Firebase Auth automatically persists sessions and restores them on app start
        // onAuthStateChanged will be called immediately with the persisted user (or null)
        const unsubscribe = onAuthStateChanged(user => {
          set({ user, isLoading: false });
        });

        // Return cleanup function
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(
        () => require('@react-native-async-storage/async-storage').default
      ),
      partialize: state => ({ user: state.user }),
    }
  )
);
