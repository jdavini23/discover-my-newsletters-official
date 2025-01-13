import * as React from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../firebaseConfig';
import { FirebaseError } from 'firebase/app';

interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, displayName?: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  loading: boolean;
}

const defaultSignup = async () => {
  throw new Error('signup not implemented');
};

const defaultLogin = async () => {
  throw new Error('login not implemented');
};

const defaultLogout = async () => {
  throw new Error('logout not implemented');
};

const defaultResetPassword = async () => {
  throw new Error('resetPassword not implemented');
};

const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  signup: defaultSignup,
  login: defaultLogin,
  logout: defaultLogout,
  resetPassword: defaultResetPassword,
  loading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  console.log('[AuthProvider] Mounting provider...');

  const signup = React.useCallback(async (email: string, password: string, displayName?: string): Promise<User> => {
    console.log('[AuthProvider] signup called with:', { email, displayName });
    try {
      const { user } = await authService.createUserWithEmailAndPassword(email, password);
      
      if (displayName) {
        await authService.updateProfile(user, { displayName });
      }
      
      await userService.createUserProfile(user.uid, {
        displayName: displayName || user.displayName,
        email: user.email,
      });
      
      return user;
    } catch (error) {
      console.error('[AuthProvider] Sign Up Error:', error);
      throw error;
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string): Promise<User> => {
    console.log('[AuthProvider] login called with:', { email });
    try {
      const { user } = await authService.signInWithEmailAndPassword(email, password);
      return user;
    } catch (error) {
      console.error('[AuthProvider] Login Error:', error);
      throw error;
    }
  }, []);

  const logout = React.useCallback(async () => {
    console.log('[AuthProvider] logout called');
    try {
      await authService.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/');
    } catch (error) {
      console.error('[AuthProvider] Logout Error:', error);
      throw error;
    }
  }, [navigate]);

  const resetPassword = React.useCallback(async (email: string) => {
    return authService.resetPassword(email);
  }, []);

  React.useEffect(() => {
    console.log('[AuthProvider] Setting up auth state listener');
    const unsubscribe = authService.auth.onAuthStateChanged(async (user) => {
      console.log('[AuthProvider] Auth state changed:', { user: user?.email });
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('[AuthProvider] Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
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
      logout,
      resetPassword,
      loading
    };
    console.log('[AuthProvider] Context value created:', {
      hasCurrentUser: !!currentUser,
      hasUserProfile: !!userProfile,
      signupType: typeof signup,
      loginType: typeof login,
      logoutType: typeof logout,
      resetPasswordType: typeof resetPassword,
      loading
    });
    return value;
  }, [currentUser, userProfile, signup, login, logout, resetPassword, loading]);

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
