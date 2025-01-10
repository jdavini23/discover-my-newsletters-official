import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createUserProfile, fetchUserProfile, updateUserProfile } from '@/services/firestore';
import { UserProfile } from '@/types/profile';
import { getAuth } from 'firebase/auth';

type UserProfileState = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (userId?: string) => Promise<void>;
  createProfile: (initialData?: Partial<UserProfile>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetProfile: () => void;
};

export const useUserProfileStore = create<UserProfileState>(
  devtools((set, get) => ({
    profile: null,
    loading: false,
    error: null,

    fetchProfile: async (userId?: string) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        set({
          profile: null,
          loading: false,
          error: 'No authenticated user',
        });
        return;
      }

      const targetUserId = userId || currentUser.uid;

      set({ loading: true, error: null });
      try {
        const profile = await fetchUserProfile(targetUserId);
        set({
          profile,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Profile fetch error:', error);

        // If the error is a permissions issue, try to create the profile
        if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
          try {
            const newProfile = await createUserProfile(targetUserId, {
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
            });
            set({
              profile: newProfile,
              loading: false,
              error: null,
            });
          } catch (createError) {
            console.error('Failed to create profile:', createError);
            set({
              profile: null,
              loading: false,
              error: createError instanceof Error ? createError.message : 'Failed to create profile',
            });
          }
        } else {
          set({
            profile: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    },

    createProfile: async (initialData = {}) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        set({
          profile: null,
          loading: false,
          error: 'No authenticated user',
        });
        return;
      }

      set({ loading: true, error: null });
      try {
        const profile = await createUserProfile(currentUser.uid, {
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
          ...initialData,
        });
        set({
          profile,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Profile creation error:', error);
        set({
          profile: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },

    updateProfile: async (updates) => {
      const { profile } = get();

      if (!profile) {
        set({
          error: 'No profile to update',
        });
        return;
      }

      set({ loading: true, error: null });
      try {
        const updatedProfile = await updateUserProfile(profile.uid, updates);
        set({
          profile: updatedProfile,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Profile update error:', error);
        set({
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },

    resetProfile: () => {
      set({
        profile: null,
        loading: false,
        error: null,
      });
    },
  }))
);

export default useUserProfileStore;
