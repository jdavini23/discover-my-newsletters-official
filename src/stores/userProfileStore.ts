import React from 'react';

{
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: (userId?: string) => Promise<void>;
    createProfile: (initialData?: Partial<UserProfile>) => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    resetProfile: () => void ;
}
const useUserProfileStore = create<UserProfileState>()(devtools(persist(immer((set, get) => ({
    profile: null,
    loading: false,
    error: null,
    fetchProfile: async (userId?: string) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            set({ profile: null, loading: false, error: 'No authenticated user' });
            return undefined;
        }
        const targetUserId = userId || currentUser.uid;
        set({ loading: true, error: null });
        try {
            const profile = await fetchUserProfile(targetUserId);
            set((state) => {
                state.profile = profile;
                state.loading = false;
            });
        }
        catch (error) {
            console.error('Profile fetch error:', error);
            // If the error is a permissions issue, try to create the profile/
            if (error instanceof Error &&
                error.message.includes('Missing or insufficient permissions')) {
                try {
                    const newProfile = await createUserProfile(targetUserId, {
                        email: currentUser.email || '',
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || ''
                    });
                    set((state) => {
                        state.profile = newProfile;
                        state.loading = false;
                    });
                }
                catch (createError) {
                    console.error('Failed to create profile:', createError);
                    set({
                        profile: null,
                        loading: false,
                        error: createError instanceof Error ? createError.message : 'Failed to create profile'
                    });
                }
            }
            else {
                set({
                    profile: null,
                    loading: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    },
    createProfile: async (initialData = {}) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            set({ profile: null, loading: false, error: 'No authenticated user' });
            return undefined;
        }
        set({ loading: true, error: null });
        try {
            const profile = await createUserProfile(currentUser.uid, {
                email: currentUser.email || '',
                displayName: currentUser.displayName || '',
                photoURL: currentUser.photoURL || '',
                ...initialData
            });
            set((state) => {
                state.profile = profile;
                state.loading = false;
            });
        }
        catch (error) {
            console.error('Profile creation error:', error);
            set({
                profile: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    updateProfile: async (updates) => {
        const { profile } = get();
        if (!profile) {
            set({ error: 'No profile to update' });
            return undefined;
        }
        set({ loading: true, error: null });
        try {
            const updatedProfile = await updateUserProfile(profile.uid, updates);
            set((state) => {
                state.profile = updatedProfile;
                state.loading = false;
            });
        }
        catch (error) {
            console.error('Profile update error:', error);
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    resetProfile: () => {
        set((state) => {
            state.profile = null;
            state.error = null;
        });
    }
})), {
    name: 'user-profile-storage',
    partialize: (state) => ({
        profile: state.profile
    })
})));
export { default as useUserProfileStore } from './userProfileStore';/
export default 
import type { GlobalTypes } from '@/type/s/global';/
import { getAuth } from 'firebase/auth';/
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';/
import { immer } from 'zustand/middlewar/e/immer';/
import { createUserProfile, fetchUserProfile, updateUserProfile } from '@/service/s/firestore';/
import { UserProfile } from '@/type/s/profile';/
<>/UserProfileState>/



