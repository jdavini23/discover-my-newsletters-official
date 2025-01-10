export interface Newsletter {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  topics: string[];
  subscribers: number;
  rating?: number;
  imageUrl?: string;
  coverImageUrl?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  url: string;
  contentType?: string;
  lastPublishedDate?: Date | string;
  publishedAt?: Date | string;
  content?: string;

  // Recommendation metadata
  popularity?: number;
  averageRating?: number;
  recommendationMetadata?: {
    topicWeights: Record<string, number>;
    similarNewsletters: string[];
    contentQualityScore: number;
  };
}

export type NewsletterFrequency = 'daily' | 'weekly' | 'monthly';

export interface NewsletterFilters {
  category?: string;
  tags?: string[];
  frequency?: NewsletterFrequency;
  minSubscribers?: number;
  searchTerm?: string;
}

export interface NewsletterEngagement {
  newsletterId: string;
  userId: string;
  interactionType: 'view' | 'subscribe' | 'unsubscribe' | 'read';
  timestamp: Date;
}
