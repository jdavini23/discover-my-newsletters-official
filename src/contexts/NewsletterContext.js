import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { mockNewsletters } from '../data/mockNewsletters';
const NewsletterContext = createContext(undefined);
export const NewsletterProvider = ({ children }) => {
    const [newsletters, setNewsletters] = useState([]);
    const [userPreferences, setUserPreferencesState] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    // Load mock newsletters on initial render
    useEffect(() => {
        setNewsletters(mockNewsletters);
    }, []);
    // Placeholder implementations - these would be replaced with actual logic
    const setUserPreferences = useCallback((preferences) => {
        setUserPreferencesState(preferences);
    }, []);
    const updatePreferredCategories = useCallback((categories) => {
        if (userPreferences) {
            const updatedPreferences = {
                ...userPreferences,
                preferredCategories: categories
            };
            setUserPreferencesState(updatedPreferences);
            // Automatically fetch recommendations when categories change
            const newRecommendations = newsletters
                .filter(newsletter => newsletter.categories.some(cat => categories.includes(cat)))
                .map(newsletter => ({
                newsletter,
                matchScore: Math.random(),
                matchReasons: ['Category Match']
            }))
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 10);
            setRecommendations(newRecommendations);
        }
    }, [newsletters, userPreferences]);
    const updateReadingFrequency = useCallback((frequency) => {
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
            const randomRecommendations = newsletters
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
        const categoryRecommendations = newsletters
            .filter(newsletter => newsletter.categories.some(cat => userPreferences.preferredCategories.includes(cat)))
            .map(newsletter => ({
            newsletter,
            matchScore: Math.random(),
            matchReasons: ['Category Match']
        }))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
        setRecommendations(categoryRecommendations);
    }, [newsletters, userPreferences]);
    const searchNewsletters = useCallback((query) => {
        if (!query.trim())
            return newsletters;
        return newsletters.filter(newsletter => newsletter.title.toLowerCase().includes(query.toLowerCase()) ||
            newsletter.description.toLowerCase().includes(query.toLowerCase()) ||
            newsletter.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
    }, [newsletters]);
    return (_jsx(NewsletterContext.Provider, { value: {
            newsletters,
            userPreferences,
            recommendations,
            setUserPreferences,
            updatePreferredCategories,
            updateReadingFrequency,
            fetchRecommendations,
            searchNewsletters
        }, children: children }));
};
export const useNewsletters = () => {
    const context = useContext(NewsletterContext);
    if (context === undefined) {
        throw new Error('useNewsletters must be used within a NewsletterProvider');
    }
    return context;
};
