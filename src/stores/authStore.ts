import { User } from 'firebase/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AuthService } from '@/services/authService';
import { UserProfile } from '@/types/firestore';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    additionalData?: Partial<UserProfile>
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      immer((set) => {
        // Create an instance of AuthService
        const authService = AuthService.getInstance();

        return {
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
          error: null,

          login: async (email, password) => {
            set({ loading: true, error: null });
            try {
              const user = await authService.signIn(email, password);
              set({
                user,
                profile: authService.formatUserProfile(user),
                isAuthenticated: true,
                loading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Login failed',
                loading: false,
                isAuthenticated: false,
              });
            }
          },

          register: async (email, password, additionalData = {}) => {
            set({ loading: true, error: null });
            try {
              const user = await authService.signUp(email, password, additionalData.displayName);
              set({
                user,
                profile: authService.formatUserProfile(user),
                isAuthenticated: true,
                loading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Registration failed',
                loading: false,
                isAuthenticated: false,
              });
            }
          },

          logout: async () => {
            set({ loading: true, error: null });
            try {
              await authService.signOut();
              set({
                user: null,
                profile: null,
                isAuthenticated: false,
                loading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Logout failed',
                loading: false,
              });
            }
          },

          resetPassword: async (email) => {
            set({ loading: true, error: null });
            try {
              await authService.sendPasswordResetCode(email);
              set({ loading: false });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Password reset failed',
                loading: false,
              });
            }
          },

          updateProfile: async (updates) => {
            set({ loading: true, error: null });
            try {
              const updatedProfile = await authService.updateProfile(updates);
              set((state) => {
                state.profile = updatedProfile;
                state.loading = false;
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Profile update failed',
                loading: false,
              });
            }
          },

          refreshUser: async () => {
            set({ loading: true, error: null });
            try {
              const token = await authService.getCurrentUserToken();
              const currentUser = authService.getCurrentUser();

              set({
                user: currentUser,
                profile: currentUser ? authService.formatUserProfile(currentUser) : null,
                isAuthenticated: !!currentUser,
                loading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'User refresh failed',
                loading: false,
                isAuthenticated: false,
              });
            }
          },
        };
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          profile: state.profile,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export { useAuthStore };
export default useAuthStore;
