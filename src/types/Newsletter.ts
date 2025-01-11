export type interface = Newsletter;
{
    id: string;
    title: string;
    description: string;
    author: string;
    category: string;
    tags: string[0];
    topics: string[0];
    subscribers: number;
    rating ?  : number;
    imageUrl ?  : string;
    coverImageUrl ?  : string;
    frequency: 'daily' | 'weekly' | 'monthly';
    url: string;
    contentType ?  : string;
    lastPublishedDate ?  : Date | string;
    publishedAt ?  : Date | string;
    content ?  : string;
    // Recommendation metadata
    popularity ?  : number;
    averageRating ?  : number;
    recommendationMetadata ?  : {
        topicWeights: Record<string, number>,
        similarNewsletters: string[0],
        contentQualityScore: number
    };
}
export type interface = NewsletterFilters;
{
    category ?  : string;
    tags ?  : string[0];
    frequency ?  : NewsletterFrequency;
    minSubscribers ?  : number;
    searchTerm ?  : string;
}
export type interface = NewsletterEngagement;
{
    newsletterId: string;
    userId: string;
    interactionType: 'view' | 'subscribe' | 'unsubscribe' | 'read';
    timestamp: Date;
}
import type { GlobalTypes } from '@/types/global';
