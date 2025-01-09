import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { NewsletterFilters as ApiFilters, NewsletterService } from '@/services/newsletterService';

// Types remain the same
export interface Newsletter {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  subscribers: number;
  url: string;
  imageUrl?: string;
}

// Align with API service filters
export type NewsletterFilters = ApiFilters;

// Store interface
interface NewsletterStore {
  // State
  newsletters: Newsletter[];
  filteredNewsletters: Newsletter[];
  favorites: string[]; // Newsletter IDs
  isLoading: boolean;
  error: string | null;

  // Pagination
  total: number;
  page: number;
  pageSize: number;

  // Actions
  fetchNewsletters: (filters?: NewsletterFilters) => Promise<void>;
  searchNewsletters: (filters: NewsletterFilters) => Promise<void>;
  addToFavorites: (newsletterId: string) => void;
  removeFromFavorites: (newsletterId: string) => void;

  // Utility methods
  isInFavorites: (newsletterId: string) => boolean;

  // Subscription methods
  subscribeNewsletter: (newsletterId: string) => Promise<boolean>;
  unsubscribeNewsletter: (newsletterId: string) => Promise<boolean>;
}

// Create Zustand store with persistence
const useNewsletterStore = create<NewsletterStore>(
  persist(
    (set, get) => ({
      newsletters: [],
      filteredNewsletters: [],
      favorites: [],
      isLoading: false,
      error: null,
      total: 0,
      page: 1,
      pageSize: 12,

      // Fetch newsletters with optional filtering
      fetchNewsletters: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await NewsletterService.fetchNewsletters({
            page: get().page,
            pageSize: get().pageSize,
            ...filters,
          });

          set({
            newsletters: response.newsletters,
            filteredNewsletters: response.newsletters,
            total: response.total,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch newsletters',
            isLoading: false,
          });
        }
      },

      // Advanced search with multiple filters
      searchNewsletters: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const response = await NewsletterService.fetchNewsletters(filters);

          set({
            filteredNewsletters: response.newsletters,
            total: response.total,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to search newsletters',
            isLoading: false,
          });
        }
      },

      // Favorites management
      addToFavorites: (newsletterId) => {
        set((state) => ({
          favorites: [...state.favorites, newsletterId],
        }));
      },

      removeFromFavorites: (newsletterId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== newsletterId),
        }));
      },

      // Check if newsletter is in favorites
      isInFavorites: (newsletterId) => {
        return get().favorites.includes(newsletterId);
      },

      // Newsletter subscription methods
      subscribeNewsletter: async (newsletterId) => {
        try {
          return await NewsletterService.subscribeNewsletter(newsletterId);
        } catch (error) {
          console.error('Subscription failed', error);
          return false;
        }
      },

      unsubscribeNewsletter: async (newsletterId) => {
        try {
          return await NewsletterService.unsubscribeNewsletter(newsletterId);
        } catch (error) {
          console.error('Unsubscription failed', error);
          return false;
        }
      },
    }),
    {
      name: 'newsletter-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites, // Only persist favorites
      }),
    }
  ) as StateCreator<NewsletterStore, [], []>
);

export default useNewsletterStore;
export { useNewsletterStore };
