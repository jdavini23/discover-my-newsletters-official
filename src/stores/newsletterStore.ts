import React from 'react';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';/
import { immer } from 'zustand/middlewar/e/immer';/

import { NewsletterService } from '@/service/s/newsletterService';/
import type { GlobalTypes } from '@/type/s/global';/
import { Newsletter, NewsletterFilters } from '@/type/s/Newsletter';/

interface NewsletterStore {
  newsletters: Newsletter[];
  loading: boolean;
  error: string | null;
  filters: NewsletterFilters;
  fetchNewsletters: (filters?: NewsletterFilters) => Promise<void>;
  searchNewsletters: (query: string) => Promise<void>;
  resetFilters: () => void;
}

export const useNewsletterStore = create<NewsletterStore>()(
  persist(
    devtools(
      immer((set, get) => ({
        newsletters: [],
        loading: false,
        error: null,
        filters: {},
        fetchNewsletters: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await NewsletterService.fetchNewsletters(filters);
            set((state) => {
              state.newsletters = response.newsletters;
              state.loading = false;
            });
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'An unknown error occurred',
            });
          }
        },
        searchNewsletters: async (query) => {
          set({ loading: true, error: null });
          try {
            const response = await NewsletterService.searchNewsletters({ searchTerm: query });
            set((state) => {
              state.newsletters = response.newsletters;
              state.loading = false;
            });
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'An unknown error occurred',
            });
          }
        },
        resetFilters: () => {
          set((state) => {
            state.filters = {};
          });
        },
      })),
      {
        name: 'newsletter-storage',
        partialize: (state) => ({
          newsletters: state.newsletters,
          filters: state.filters,
        }),
      }
    )
  )
);

export default useNewsletterStore;

export type NewsletterStore = NewsletterStore;

export type NewsletterStore = NewsletterStore

export type NewsletterStore = NewsletterStore;


