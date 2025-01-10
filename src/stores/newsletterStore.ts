import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { NewsletterService } from '@/services/newsletterService';
import { Newsletter, NewsletterFilters } from '@/types/Newsletter';

export interface NewsletterStore {
  newsletters: Newsletter[];
  loading: boolean;
  error: string | null;
  filters: NewsletterFilters;
  fetchNewsletters: (filters?: NewsletterFilters) => Promise<void>;
  searchNewsletters: (query: string) => Promise<void>;
  resetFilters: () => void;
}

const useNewsletterStore = create<NewsletterStore>()(
  persist(
    immer(
      subscribeWithSelector((set, get) => ({
        newsletters: [],
        loading: false,
        error: null,
        filters: {},

        fetchNewsletters: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const newsletters = await NewsletterService.fetchNewsletters(filters);
            set((state) => {
              state.newsletters = newsletters;
              state.filters = filters;
              state.loading = false;
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            });
          }
        },

        searchNewsletters: async (query) => {
          set({ loading: true, error: null });
          try {
            const newsletters = await NewsletterService.searchNewsletters(query);
            set((state) => {
              state.newsletters = newsletters;
              state.loading = false;
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              loading: false,
            });
          }
        },

        resetFilters: () => {
          set((state) => {
            state.filters = {};
          });
        },
      }))
    ),
    {
      name: 'newsletter-storage',
      partialize: (state) => ({
        newsletters: state.newsletters,
        filters: state.filters,
      }),
    }
  )
);

export default useNewsletterStore;
