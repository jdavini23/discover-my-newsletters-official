const mockGetAuth = jest.fn(() => ({}));
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockConfirmPasswordReset = jest.fn();
const mockVerifyPasswordResetCode = jest.fn();
const mockOnAuthStateChanged = jest.fn();
const mockGoogleAuthProvider = jest.fn(() => ({}));
const mockGithubAuthProvider = jest.fn(() => ({}));
const mockSignInWithPopup = jest.fn();

module.exports = {
  getAuth: mockGetAuth,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  confirmPasswordReset: mockConfirmPasswordReset,
  verifyPasswordResetCode: mockVerifyPasswordResetCode,
  onAuthStateChanged: mockOnAuthStateChanged,
  GoogleAuthProvider: mockGoogleAuthProvider,
  GithubAuthProvider: mockGithubAuthProvider,
  signInWithPopup: mockSignInWithPopup,
};
