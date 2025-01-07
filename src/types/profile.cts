import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;

  // Preferences
  interests: string[];
  newsletterPreferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
  };

  // Interaction Tracking
  activityLog: UserActivity[];

  // Account Settings
  accountCreatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface UserActivity {
  type: 'newsletter_view' | 'newsletter_subscribe' | 'newsletter_like';
  newsletterId: string;
  timestamp: Timestamp;
  details?: string;
}

export interface UpdateProfileParams {
  displayName?: string;
  bio?: string;
  photoURL?: string;
  interests?: string[];
  newsletterPreferences?: UserProfile['newsletterPreferences'];
  activityLog?: UserProfile['activityLog'];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  newsletterPreferences: {
    interestedTopics: string[];
    frequencyPreference: 'daily' | 'weekly' | 'monthly';
    receiveRecommendations: boolean;
  };
  recommendationProfile: {
    interests: string[];
    readingHistory: string[];
  };
}
