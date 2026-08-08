import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  setLogLevel,
  Firestore 
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getAnalytics, Analytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import rawConfig from '../../firebase-applet-config.json';

// Construct dynamic configuration with environment variable overrides if provided
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain || 'halqa-e-usmania-official.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId || 'halqa-e-usmania-official',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket || 'halqa-e-usmania-official.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || rawConfig.measurementId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId || ''
};

// Mute non-fatal connection logging warnings in browser console
try {
  setLogLevel('silent');
} catch {}

// Initialize Firebase App safely
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore targeting the custom databaseId if configured with offline cache and forced long polling
let db: Firestore;
try {
  const settings = {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    experimentalForceLongPolling: true
  };
  const customDbId = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') 
    ? firebaseConfig.firestoreDatabaseId 
    : undefined;
  if (customDbId) {
    db = initializeFirestore(app, settings, customDbId);
  } else {
    db = initializeFirestore(app, settings);
  }
} catch {
  db = getFirestore(app);
}

// Initialize Authentication
const auth: Auth = getAuth(app);

// Initialize Storage
const storage: FirebaseStorage = getStorage(app);

// Initialize Messaging safely
let messaging: Messaging | null = null;
if (typeof window !== 'undefined') {
  isMessagingSupported().then((supported) => {
    if (supported) {
      try {
        messaging = getMessaging(app);
      } catch (err) {
        console.warn('FCM Messaging initialization note:', err);
      }
    }
  }).catch(() => {});
}

// Initialize Analytics safely
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn('Analytics initialization note:', err);
      }
    }
  }).catch(() => {});
}

export { app, auth, db, storage, messaging, analytics };
