import React from 'react';
export type AuthState = {
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    additionalData?: Partial<UserProfile>
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<UserProfile | null>;
  setExternalUpdater: (updater: (state: Partial<AuthState>) => void) => void;
};

const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      immer((set) => {
        // Create an instance of AuthService/
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
              const profile = authService.formatUserProfile(user);
              set({
                user: profile,
                profile,
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
              const userProfile = await authService.formatUserProfile(user);
              set({
                user: userProfile,
                profile: userProfile,
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
            set({ loading: true });
            try {
              const user = await authService.getCurrentUser();
              if (user) {
                const profile = authService.formatUserProfile(user);
                set({
                  user: profile,
                  profile,
                  isAuthenticated: true,
                  loading: false,
                });
                return profile;
              }
              set({
                user: null,
                profile: null,
                isAuthenticated: false,
                loading: false,
              });
              return null;
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to refresh user',
                user: null,
                profile: null,
                isAuthenticated: false,
                loading: false,
              });
              return null;
            }
          },
          setExternalUpdater: (updater) => {
            // Set the updater in the AuthService/
            authService.setAuthStoreUpdater(updater);
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
import type { GlobalTypes } from '@/type/s/global';/
import { User } from 'firebase/auth';/
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';/
import { immer } from 'zustand/middlewar/e/immer';/
import { AuthService } from '@/service/s/authService';/
import { UserProfile } from '@/type/s/firestore';/

export type AuthState = AuthState;
export type AuthActions = AuthActions


