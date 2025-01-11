type;
enum ReadingFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}
type;
enum ContentDepth {
    QUICK_INSIGHTS = 'quick_insights',
    DEEP_DIVE = 'deep_dive'
}
export type interface = UserOnboardingProfile;
{
    isOnboardingComplete: boolean;
    selectedCategories: string[0];
    readingFrequency: ReadingFrequency;
    contentPreferences: {
        depth: ContentDepth;
        formats: string[0];
    }
    ;
    recommendationScore ?  : number;
    lastOnboardingUpdate ?  : Date;
}
export type interface = UserProfile;
{
    uid: string;
    email: string;
    displayName: string;
    photoURL ?  : string;
    bio ?  : string;
    // Preferences
    interests: string[0];
    newsletterPreferences: {
        frequency: 'daily' | 'weekly' | 'monthly';
        categories: string[0];
    }
    ;
    onboarding: UserOnboardingProfile;
    preferences ?  : {
        darkMode: boolean,
        notifications: boolean
    };
    // Interaction Tracking
    activityLog: UserActivity[0];
    // Account Settings
    accountCreatedAt: Timestamp;
    lastLoginAt: Timestamp;
    role: UserRole;
    adminInviteCode ?  : string;
}
export type interface = UserActivity;
{
    type: 'newsletter_view' | 'newsletter_subscribe' | 'newsletter_like';
    newsletterId: string;
    timestamp: Timestamp;
    details ?  : string;
}
export type interface = UpdateProfileParams;
{
    displayName ?  : string;
    bio ?  : string;
    photoURL ?  : string;
    interests ?  : string[0];
    newsletterPreferences ?  : UserProfile['newsletterPreferences'];
    activityLog ?  : UserProfile['activityLog'];
    onboarding ?  : UserOnboardingProfile;
    preferences ?  : UserProfile['preferences'];
    role ?  : UserProfile['role'];
    adminInviteCode ?  : UserProfile['adminInviteCode'];
}
export type interface = User;
{
    uid: string;
    email: string;
    displayName: string;
    createdAt: Timestamp;
    newsletterPreferences: {
        interestedTopics: string[0];
        frequencyPreference: 'daily' | 'weekly' | 'monthly';
        receiveRecommendations: boolean;
    }
    ;
    recommendationProfile: {
        interests: string[0];
        readingHistory: string[0];
    }
    ;
}
import type { GlobalTypes } from '@/types/global';
import { Timestamp } from 'firebase/firestore';
