import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  Newsletter, 
  NewsletterCategory, 
  UserPreferences,
  NewsletterRecommendation,
  NewsletterFilter 
} from '../types/newsletter';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebaseService';

interface NewsletterState {
  newsletters: Newsletter[];
  userPreferences: UserPreferences | null;
  recommendations: NewsletterRecommendation[];
  currentFilter: NewsletterFilter;
  loading: boolean;
  error: string | null;
}

interface NewsletterActions {
  fetchNewsletters: () => Promise<void>;
  updateUserPreferences: (preferences: UserPreferences) => Promise<void>;
  updateFilter: (filter: Partial<NewsletterFilter>) => void;
  generateRecommendations: () => void;
}

const useNewsletterStore = create<NewsletterState & NewsletterActions>()(
  immer((set, get) => ({
    newsletters: [],
    userPreferences: null,
    recommendations: [],
    currentFilter: {},
    loading: false,
    error: null,

    fetchNewsletters: async () => {
      set({ loading: true, error: null });
      try {
        const newslettersRef = collection(db, 'newsletters');
        const querySnapshot = await getDocs(newslettersRef);
        const newsletters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Newsletter[];
        
        set({ newsletters, loading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch newsletters',
          loading: false 
        });
      }
    },

    updateUserPreferences: async (preferences: UserPreferences) => {
      set({ loading: true, error: null });
      try {
        // TODO: Save preferences to Firestore
        set({ userPreferences: preferences, loading: false });
        get().generateRecommendations();
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update preferences',
          loading: false 
        });
      }
    },

    updateFilter: (filter: Partial<NewsletterFilter>) => {
      set(state => {
        state.currentFilter = { ...state.currentFilter, ...filter };
      });
      get().generateRecommendations();
    },

    generateRecommendations: () => {
      const { newsletters, userPreferences, currentFilter } = get();
      
      if (!userPreferences) {
        set({ recommendations: [] });
        return;
      }

      const filteredNewsletters = newsletters.filter(newsletter => {
        if (currentFilter.category && !newsletter.categories.includes(currentFilter.category as NewsletterCategory)) {
          return false;
        }
        if (currentFilter.tags && !currentFilter.tags.some(tag => newsletter.tags.includes(tag))) {
          return false;
        }
        if (currentFilter.minSubscribers && newsletter.subscriberCount && 
            newsletter.subscriberCount < currentFilter.minSubscribers) {
          return false;
        }
        if (currentFilter.searchTerm && !newsletter.title.toLowerCase().includes(currentFilter.searchTerm.toLowerCase()) &&
            !newsletter.description.toLowerCase().includes(currentFilter.searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });

      const recommendations = filteredNewsletters.map(newsletter => {
        const matchScore = calculateMatchScore(newsletter, userPreferences);
        const matchReasons = generateMatchReasons(newsletter, userPreferences);
        return { newsletter, matchScore, matchReasons };
      }).sort((a, b) => b.matchScore - a.matchScore);

      set({ recommendations });
    }
  }))
);

function calculateMatchScore(newsletter: Newsletter, preferences: UserPreferences): number {
  let score = 0;
  
  // Category match
  const categoryMatches = newsletter.categories.filter(
    category => preferences.preferredCategories.includes(category)
  ).length;
  score += categoryMatches * 10;

  // Subscriber count bonus (if available)
  if (newsletter.subscriberCount) {
    score += Math.min(newsletter.subscriberCount / 1000, 20);
  }

  return score;
}

function generateMatchReasons(newsletter: Newsletter, preferences: UserPreferences): string[] {
  const reasons: string[] = [];

  const matchingCategories = newsletter.categories.filter(
    category => preferences.preferredCategories.includes(category)
  );

  if (matchingCategories.length > 0) {
    reasons.push(`Matches your interests in ${matchingCategories.join(', ')}`);
  }

  if (newsletter.subscriberCount && newsletter.subscriberCount > 10000) {
    reasons.push('Popular newsletter with many subscribers');
  }

  return reasons;
}

export default useNewsletterStore;
