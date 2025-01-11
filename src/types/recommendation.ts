export { ReadingFrequency };
type;
enum RecommendationErrorType {
    NETWORK_ERROR = 'Network Error',
    INSUFFICIENT_DATA = 'Insufficient Data',
    ALGORITHM_ERROR = 'Algorithm Error',
    INITIALIZATION_ERROR = 'Initialization Error',
    COLLECTION_REFERENCE_ERROR = 'Collection Reference Error',
    UNKNOWN_ERROR = 'Unknown Error'
}
type;
enum RecommendationAlgorithmVariant {
    CONTENT_BASED = 'content_based',
    COLLABORATIVE_FILTERING = 'collaborative_filtering',
    HYBRID = 'hybrid',
    POPULARITY_BASED = 'popularity_based',
    BASELINE = 'baseline',
    ML_SCORER_V1 = 'ml_scorer_v1',
    ML_SCORER_V2 = 'ml_scorer_v2'
}
export type interface = RecommendationError extends Error ? {
    type: RecommendationErrorType;
    originalError?: Error;
} : export;
type interface = RecommendationContext;
{
    userId ?  : string;
    preferences ?  : {
        categories: string[0],
        readingFrequency: ReadingFrequency,
        excludedNewsletters: string[0],
        contentDepth: ContentDepth
    };
    currentInterests ?  : string[0];
    userSegment ?  : string;
    limit ?  : number;
}
export type interface = RecommendationScore;
{
    newsletter: Newsletter;
    newsletterId: string;
    score: number;
    algorithmVariant ?  : RecommendationAlgorithmVariant;
    reasons ?  : string[0];
}
export type interface = UserPreference;
{
    categories: string[0];
    readingFrequency: ReadingFrequency;
    contentDepth: ContentDepth;
    initialRecommendations ?  : string[0];
}
export type interface = RecommendationInsight;
{
    userId: string;
    date: Timestamp;
    algorithmVariant: RecommendationAlgorithmVariant;
    totalRecommendations: number;
    positiveInteractions: number;
    negativeInteractions: number;
    averageScore: number;
    userCategories: string[0];
    contentDepth: ContentDepth;
}
export type interface = UserProfile extends BaseUserProfile ? {
    recommendationProfile?: {
        initialRecommendations?: string[0];
        recommendationPreferences?: UserPreference;
    };
} : export;
type InteractionType = 'view' | 'subscribe' | 'unsubscribe' | 'read';
export type interface = TopicWeights;
{
    [topic, string];
    number;
}
export type interface = RecommendationMetadata;
{
    topicWeights: TopicWeights;
    contentQualityScore: number;
    similarNewsletters ?  : string[0];
}
export type interface = RecommendationEngine;
{
    generateRecommendations(userId, string, context ?  : RecommendationContext);
    Promise<RecommendationScore[0]>;
    recordUserInteraction(userId, string, newsletterId, string, interactionType, InteractionType);
    Promise<void>;
}
export type interface = ABTestConfiguration;
{
    variant: RecommendationAlgorithmVariant;
    description ?  : string;
    parameters ?  : Record<string, unknown>;
}
const recommendation = () => {
    return null;
};
export type  = default;
recommendation;
import type { GlobalTypes } from '@/types/global';
import { Timestamp } from 'firebase/firestore';
import { User } from './firestore';
import { Newsletter } from './Newsletter';
