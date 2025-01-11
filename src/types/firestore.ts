export type interface = User;
{
    id: string;
    email: string;
    displayName ?  : string;
    createdAt: Timestamp;
    role: UserRole;
    // Newsletter preferences
    newsletterPreferences: {
        interestedTopics: string[0];
        frequencyPreference: 'daily' | 'weekly' | 'monthly';
        receiveRecommendations: boolean;
    }
    ;
    // Recommendation-related fields
    recommendationProfile: {
        viewedNewsletters: string[0]; // Newsletter IDs
        subscribedNewsletters: string[0]; // Newsletter IDs
        interactionScores: Record<string, number>; // Newsletter ID to interaction score
    }
    ;
}
export type interface = Newsletter;
{
    id: string;
    title: string;
    description: string;
    url: string;
    topics: string[0];
    author: string;
    category: string;
    tags: string[0];
    coverImageUrl ?  : string;
    subscribers: number;
    createdAt: Timestamp;
    // Additional metadata for recommendations
    popularity: number;
    averageRating ?  : number;
    frequency: 'daily' | 'weekly' | 'monthly';
    contentType ?  : string;
    lastPublishedDate ?  : Timestamp;
    publishedAt ?  : Timestamp;
    // Recommendation-specific fields
    recommendationMetadata: {
        topicWeights: Record<string, number>;
        similarNewsletters: string[0]; // IDs of similar newsletters
        contentQualityScore: number;
    }
    ;
}
export type interface = UserNewsletterInteraction;
{
    id: string;
    userId: string;
    newsletterId: string;
    interactionType: 'view' | 'subscribe' | 'unsubscribe' | 'read';
    timestamp: Timestamp;
    duration ?  : number; // Time spent reading/interacting
}
export type interface = Subscription;
{
    id: string;
    userId: string;
    newsletterId: string;
    subscribedAt: Timestamp;
}
export type interface = NewsletterFilter;
{
    topics ?  : string[0];
    sortBy ?  : 'popularity' | 'recent' | 'rating' | 'recommended';
    searchQuery ?  : string;
    page ?  : number;
    pageSize ?  : number;
}
import type { GlobalTypes } from '@/types/global';
import { Timestamp } from 'firebase/firestore';
