import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mocking Firebase to prevent actual initialization during tests
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([]),
  getApp: jest.fn()
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
  signInWithPopup: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn()
}));

// Mock analytics to prevent actual tracking during tests
jest.mock('@/utils/analytics', () => ({
  trackEvent: jest.fn(),
  trackError: jest.fn(),
  trackPageView: jest.fn()
}));

// Silence console warnings during tests
console.warn = jest.fn();
console.error = jest.fn();
