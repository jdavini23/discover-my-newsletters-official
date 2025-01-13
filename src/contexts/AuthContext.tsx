import * as React from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

// Extend UserProfile to include interests and metrics
export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  interests?: string[];
  viewedNewsletters?: Record<string, number>;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, displayName?: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUserInterests: (interests: string[]) => Promise<void>;
  trackNewsletterView: (newsletterId: string) => Promise<void>;
  loading: boolean;
}

const defaultSignup = async () => {
  throw new Error('signup not implemented');
};

const defaultLogin = async () => {
  throw new Error('login not implemented');
};

const defaultSignIn = async () => {
  throw new Error('signIn not implemented');
};

const defaultLogout = async () => {
  throw new Error('logout not implemented');
};

const defaultResetPassword = async () => {
  throw new Error('resetPassword not implemented');
};

const defaultUpdateUserInterests = async () => {
  throw new Error('updateUserInterests not implemented');
};

const defaultTrackNewsletterView = async () => {
  throw new Error('trackNewsletterView not implemented');
};

const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  signup: defaultSignup,
  login: defaultLogin,
  signIn: defaultSignIn,
  logout: defaultLogout,
  resetPassword: defaultResetPassword,
  updateUserInterests: defaultUpdateUserInterests,
  trackNewsletterView: defaultTrackNewsletterView,
  loading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  console.log('[AuthProvider] Mounting provider...');

  const signup = React.useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user profile in Firestore
      await userService.updateUserProfile(user.uid, { 
        displayName: displayName || user.displayName, 
        email: user.email 
      });

      return user;
    } catch (error) {
      console.error('[AuthProvider] Signup Error:', error);
      throw error;
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('[AuthProvider] Login Error:', error);
      throw error;
    }
  }, []);

  const signIn = login;

  const logout = React.useCallback(async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/'); 
    } catch (error) {
      console.error('[AuthProvider] Logout Error:', error);
      throw error;
    }
  }, [navigate]);

  // Password reset method
  const resetPassword = React.useCallback(async (email: string) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      console.log('[AuthProvider] Password reset email sent');
      return true;
    } catch (error) {
      console.error('[AuthProvider] Password reset error:', error);
      throw error;
    }
  }, []);

  const updateUserInterests = React.useCallback(async (interests: string[]) => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      await userService.updateUserInterests(currentUser.uid, interests);
      
      // Optimistically update local state
      setUserProfile(prev => prev ? { ...prev, interests } : null);
    } catch (error) {
      console.error('[AuthProvider] Update User Interests Error:', error);
      throw error;
    }
  }, [currentUser]);

  const trackNewsletterView = React.useCallback(async (newsletterId: string) => {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      await userService.trackNewsletterView(currentUser.uid, newsletterId);
      
      // Optimistically update local state
      setUserProfile(prev => {
        if (!prev) return null;
        const viewedNewsletters = { 
          ...prev.viewedNewsletters, 
          [newsletterId]: (prev.viewedNewsletters?.[newsletterId] || 0) + 1 
        };
        return { ...prev, viewedNewsletters };
      });
    } catch (error) {
      console.error('[AuthProvider] Track Newsletter View Error:', error);
      throw error;
    }
  }, [currentUser]);

  React.useEffect(() => {
    console.log('[AuthProvider] Setting up auth state listener');
    const unsubscribe = authService.auth.onAuthStateChanged(async (user) => {
      console.log('[AuthProvider] Auth state changed:', { 
        user: user ? {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        } : null 
      });

      // Debugging: Check Firebase authentication state
      const currentAuthUser = authService.getCurrentUser();
      console.log('[AuthProvider] Current Auth User:', currentAuthUser ? {
        uid: currentAuthUser.uid,
        email: currentAuthUser.email,
        displayName: currentAuthUser.displayName
      } : null);

      setCurrentUser(user);
      
      if (user) {
        try {
          let profile = await userService.getUserProfile(user.uid);
          
          // If no profile exists, create one
          if (!profile) {
            console.log('[AuthProvider] No profile found, creating new profile');
            await userService.updateUserProfile(user.uid, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              interests: [],
              viewedNewsletters: {}
            });
            
            // Fetch the newly created profile
            profile = await userService.getUserProfile(user.uid);
          }

          const userProfile: UserProfile = {
            uid: user.uid,
            displayName: profile?.displayName || user.displayName || '',
            email: profile?.email || user.email || '',
            interests: profile?.interests || [],
            viewedNewsletters: profile?.viewedNewsletters || {}
          };

          console.log('[AuthProvider] Setting User Profile:', userProfile);
          setUserProfile(userProfile);
        } catch (error) {
          console.error('[AuthProvider] Error fetching/creating user profile:', error);
          // Fallback to creating a minimal profile
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            interests: [],
            viewedNewsletters: {}
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('[AuthProvider] Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = React.useMemo(() => {
    console.log('[AuthProvider] Creating context value');
    const value = {
      currentUser,
      userProfile,
      signup,
      login,
      signIn,
      logout,
      resetPassword,
      updateUserInterests,
      trackNewsletterView,
      loading
    };
    console.log('[AuthProvider] Context value created:', {
      hasCurrentUser: !!currentUser,
      hasUserProfile: !!userProfile,
      signupType: typeof signup,
      loginType: typeof login,
      logoutType: typeof logout,
      resetPasswordType: typeof resetPassword,
      updateUserInterestsType: typeof updateUserInterests,
      trackNewsletterViewType: typeof trackNewsletterView,
      loading
    });
    return value;
  }, [currentUser, userProfile, signup, login, logout, resetPassword, updateUserInterests, trackNewsletterView, loading]);

  console.log('[AuthProvider] Rendering provider with value:', {
    signupExists: typeof contextValue.signup === 'function'
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  console.log('[useAuth] Getting auth context:', {
    hasContext: !!context,
    signupType: typeof context.signup,
    signupExists: typeof context.signup === 'function',
    methods: {
      signup: !!context.signup,
      login: !!context.login,
      logout: !!context.logout
    }
  });
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
