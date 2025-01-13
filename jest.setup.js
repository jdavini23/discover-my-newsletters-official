import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock import.meta.env for testing
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_FIREBASE_API_KEY: 'test-api-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
        VITE_FIREBASE_PROJECT_ID: 'test-project-id',
        VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
        VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-messaging-sender-id',
        VITE_FIREBASE_APP_ID: 'test-app-id',
        VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
        VITE_API_URL: 'http://test-api-url',
      },
    },
  },
  configurable: true,
});

// Mocking Firebase to prevent actual initialization during tests
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([]),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  verifyPasswordResetCode: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({})),
  GithubAuthProvider: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock analytics to prevent actual tracking during tests
jest.mock('@/utils/analytics', () => ({
  trackEvent: jest.fn(),
  trackError: jest.fn(),
  trackPageView: jest.fn(),
}));

// Silence console warnings during tests
console.warn = jest.fn();
console.error = jest.fn();
