import { Timestamp } from 'firebase/firestore';

export enum ReadingFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum ContentDepth {
  QUICK_INSIGHTS = 'quick_insights',
  DEEP_DIVE = 'deep_dive'
}

export interface UserOnboardingProfile {
  isOnboardingComplete: boolean;
  selectedCategories: string[];
  readingFrequency: ReadingFrequency;
  contentPreferences: {
    depth: ContentDepth;
    formats: string[];
  };
  recommendationScore?: number;
  lastOnboardingUpdate?: Date;
}

export type UserRole = 'user' | 'admin' | 'moderator';

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
  onboarding: UserOnboardingProfile;
  preferences?: {
    darkMode?: boolean;
    notifications?: boolean;
  };

  // Interaction Tracking
  activityLog: UserActivity[];

  // Account Settings
  accountCreatedAt: Timestamp;
  lastLoginAt: Timestamp;

  role: UserRole;
  adminInviteCode?: string;
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
  onboarding?: UserOnboardingProfile;
  preferences?: UserProfile['preferences'];
  role?: UserProfile['role'];
  adminInviteCode?: UserProfile['adminInviteCode'];
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
