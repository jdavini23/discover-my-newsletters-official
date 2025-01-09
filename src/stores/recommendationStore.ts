import { create } from 'zustand';

import { Newsletter } from '@/types';

export interface RecommendationState {
  recommendations: Newsletter[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  isLoading: false,
  error: null,
  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual recommendation service call
      const mockRecommendations: Newsletter[] = [];
      set({ recommendations: mockRecommendations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
        isLoading: false,
      });
    }
  },
}));
