import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { 
  Newsletter, 
  UserPreferences, 
  NewsletterCategory, 
  ReadingFrequency, 
  NewsletterRecommendation 
} from '../types/newsletter';
import { mockNewsletters } from '../data/mockNewsletters';

interface NewsletterContextType {
  newsletters: Newsletter[];
  userPreferences: UserPreferences | null;
  recommendations: NewsletterRecommendation[];
  
  setUserPreferences: (preferences: UserPreferences) => void;
  updatePreferredCategories: (categories: NewsletterCategory[]) => void;
  updateReadingFrequency: (frequency: ReadingFrequency) => void;
  fetchRecommendations: () => void;
  searchNewsletters: (query: string) => Newsletter[];
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const NewsletterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<NewsletterRecommendation[]>([]);

  // Load mock newsletters on initial render
  useEffect(() => {
    setNewsletters(mockNewsletters);
  }, []);

  // Placeholder implementations - these would be replaced with actual logic
  const setUserPreferences = useCallback((preferences: UserPreferences) => {
    setUserPreferencesState(preferences);
  }, []);

  const updatePreferredCategories = useCallback((categories: NewsletterCategory[]) => {
    if (userPreferences) {
      const updatedPreferences = {
        ...userPreferences,
        preferredCategories: categories
      };
      setUserPreferencesState(updatedPreferences);
      
      // Automatically fetch recommendations when categories change
      const newRecommendations: NewsletterRecommendation[] = newsletters
        .filter(newsletter => 
          newsletter.categories.some(cat => 
            categories.includes(cat)
          )
        )
        .map(newsletter => ({
          newsletter,
          matchScore: Math.random(), // Placeholder scoring
          matchReasons: ['Category Match']
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      setRecommendations(newRecommendations);
    }
  }, [newsletters, userPreferences]);

  const updateReadingFrequency = useCallback((frequency: ReadingFrequency) => {
    if (userPreferences) {
      setUserPreferencesState({
        ...userPreferences,
        readingFrequency: frequency
      });
    }
  }, [userPreferences]);

  const fetchRecommendations = useCallback(() => {
    // If no preferences set, return random newsletters
    if (!userPreferences || !userPreferences.preferredCategories.length) {
      const randomRecommendations: NewsletterRecommendation[] = newsletters
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map(newsletter => ({
          newsletter,
          matchScore: Math.random(),
          matchReasons: ['Random Recommendation']
        }));
      
      setRecommendations(randomRecommendations);
      return;
    }

    // Recommendations based on user preferences
    const categoryRecommendations: NewsletterRecommendation[] = newsletters
      .filter(newsletter => 
        newsletter.categories.some(cat => 
          userPreferences.preferredCategories.includes(cat)
        )
      )
      .map(newsletter => ({
        newsletter,
        matchScore: Math.random(), // Placeholder scoring
        matchReasons: ['Category Match']
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    setRecommendations(categoryRecommendations);
  }, [newsletters, userPreferences]);

  const searchNewsletters = useCallback((query: string): Newsletter[] => {
    if (!query.trim()) return newsletters;

    return newsletters.filter(newsletter => 
      newsletter.title.toLowerCase().includes(query.toLowerCase()) ||
      newsletter.description.toLowerCase().includes(query.toLowerCase()) ||
      newsletter.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }, [newsletters]);

  return (
    <NewsletterContext.Provider value={{
      newsletters,
      userPreferences,
      recommendations,
      setUserPreferences,
      updatePreferredCategories,
      updateReadingFrequency,
      fetchRecommendations,
      searchNewsletters
    }}>
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletters = () => {
  const context = useContext(NewsletterContext);
  if (context === undefined) {
    throw new Error('useNewsletters must be used within a NewsletterProvider');
  }
  return context;
};
