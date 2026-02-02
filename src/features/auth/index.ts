export { useAuth } from '@/features/auth/hooks/useAuth';
export { LoginScreen } from '@/features/auth/screens/LoginScreen';
export { SignupScreen } from '@/features/auth/screens/SignupScreen';
export {
  getCurrentUser,
  onAuthStateChanged,
  signIn,
  signOutUser,
  signUp,
} from '@/features/auth/services/authService';
export { useAuthStore } from '@/features/auth/state/authStore';
export type { AuthError, User } from '@/features/auth/types';
