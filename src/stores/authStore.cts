import { create } from 'zustand';
import { User, UserCredential } from 'firebase/auth';
import { signIn, signUp, logOut, onAuthChange } from '@/config/firebase';
import { createUserProfile } from '@/services/firestore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;

  // Authentication state management
  initializeAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await signIn(email, password);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential: UserCredential = await signUp(email, password);

      // Create user profile
      await createUserProfile(userCredential.user.uid, {
        email: userCredential.user.email || '',
        displayName: name || userCredential.user.displayName || '',
      });

      set({
        user: userCredential.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
      });
      throw error;
    }
  },

  initializeAuth: () => {
    console.log('Initializing authentication...');
    onAuthChange((user) => {
      console.log('Auth state changed:', user);
      if (user) {
        console.log('User authenticated:', user.email);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('No user authenticated');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
  },
}));

// Export both default and named exports
export { useAuthStore };
export default useAuthStore;
