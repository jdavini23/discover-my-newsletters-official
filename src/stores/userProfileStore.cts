import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/profile';
import {
  fetchUserProfile,
  updateUserProfile,
  updateNewsletterPreferences,
  fetchAvailableTopics,
} from '@/services/firestore';

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  availableTopics: string[];

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'uid'>>) => Promise<void>;
  updateNewsletterPrefs: (preferences: UserProfile['newsletterPreferences']) => Promise<void>;
  loadAvailableTopics: () => Promise<void>;
  addActivityLog: (activity: UserProfile['activityLog'][0]) => Promise<void>;
  resetProfile: () => void;
}

const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      availableTopics: [],

      fetchProfile: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const profile = await fetchUserProfile(userId);
          set({ profile, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch profile',
            isLoading: false,
          });
        }
      },

      updateProfile: async (updates) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No profile to update');
        }

        set({ isLoading: true, error: null });
        try {
          const updatedProfile = await updateUserProfile(profile.uid, updates);
          set({ profile: updatedProfile, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false,
          });
        }
      },

      updateNewsletterPrefs: async (preferences) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No profile to update newsletter preferences');
        }

        set({ isLoading: true, error: null });
        try {
          const updatedProfile = await updateNewsletterPreferences(profile.uid, preferences);
          set({ profile: updatedProfile, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Failed to update newsletter preferences',
            isLoading: false,
          });
        }
      },

      loadAvailableTopics: async () => {
        set({ isLoading: true, error: null });
        try {
          const topics = await fetchAvailableTopics();
          set({
            availableTopics: topics.map((topic) => topic.id),
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load topics',
            isLoading: false,
          });
        }
      },

      addActivityLog: async (activity) => {
        const { profile } = get();
        if (!profile) {
          throw new Error('No profile to update activity log');
        }

        try {
          const updatedProfile = await updateUserProfile(profile.uid, {
            activityLog: [...(profile.activityLog || []), activity],
          });
          set({ profile: updatedProfile });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add activity log',
          });
        }
      },

      resetProfile: () => {
        set({ profile: null, isLoading: false, error: null, availableTopics: [] });
      },
    }),
    {
      name: 'user-profile-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

// Export both default and named exports
export { useUserProfileStore };
export default useUserProfileStore;
