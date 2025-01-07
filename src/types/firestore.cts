import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;

  // Newsletter preferences
  newsletterPreferences: {
    interestedTopics: string[];
    frequencyPreference: 'daily' | 'weekly' | 'monthly';
    receiveRecommendations: boolean;
  };

  // Recommendation-related fields
  recommendationProfile: {
    viewedNewsletters: string[]; // Newsletter IDs
    subscribedNewsletters: string[]; // Newsletter IDs
    interactionScores: Record<string, number>; // Newsletter ID to interaction score
  };
}

export interface Newsletter {
  id: string;
  title: string;
  description: string;
  url: string;
  topics: string[];
  author: string;
  coverImageUrl?: string;
  subscriberCount: number;
  createdAt: Timestamp;

  // Additional metadata for recommendations
  popularity: number;
  averageRating?: number;

  // Recommendation-specific fields
  recommendationMetadata: {
    topicWeights: Record<string, number>;
    similarNewsletters: string[]; // IDs of similar newsletters
    contentQualityScore: number;
  };
}

export interface UserNewsletterInteraction {
  id: string;
  userId: string;
  newsletterId: string;
  interactionType: 'view' | 'subscribe' | 'unsubscribe' | 'read';
  timestamp: Timestamp;
  duration?: number; // Time spent reading/interacting
}

export interface Subscription {
  id: string;
  userId: string;
  newsletterId: string;
  subscribedAt: Timestamp;
}

export interface NewsletterFilter {
  topics?: string[];
  sortBy?: 'popularity' | 'recent' | 'rating' | 'recommended';
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}
