import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  disableNetwork,
  enableNetwork,
  Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore';

/**
 * Firebase configuration
 * Uses environment variables for security
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

/**
 * Validate Firebase configuration
 */
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(
    field => !firebaseConfig[field as keyof typeof firebaseConfig]
  );

  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration:', missingFields);
    console.error(
      'Please check your .env file and ensure all required Firebase credentials are set.'
    );
    throw new Error(
      `Missing Firebase configuration: ${missingFields.join(', ')}`
    );
  }
};

/**
 * App initialization (safe for Fast Refresh)
 */
validateFirebaseConfig();
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Firebase Auth
 * Using getAuth - Firebase automatically handles persistence in React Native
 */
export const auth = getAuth(app);

/**
 * ✅ Firestore with offline persistence
 */
let db: Firestore;

try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
  });
} catch {
  db = getFirestore(app);
}

export { db };

/**
 * Optional helpers
 */
export const enableOfflineMode = async () => {
  try {
    await disableNetwork(db);
  } catch (error) {
    console.error('Failed to enable offline mode:', error);
  }
};

export const enableOnlineMode = async () => {
  try {
    await enableNetwork(db);
  } catch (error) {
    console.error('Failed to enable online mode:', error);
  }
};
