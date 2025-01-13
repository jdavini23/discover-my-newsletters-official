import React from 'react';

export type NewsletterCategory = 
  | 'Technology'
  | 'Design'
  | 'Startup'
  | 'Programming'
  | 'Marketing'
  | 'Finance'
  | 'Science'
  | 'Art'
  | 'Writing'
  | 'Entrepreneurship'
  | 'Personal Development'
  | 'Health'
  | 'Travel'
  | 'Food'
  | 'Music'
  | 'Sports'
  | 'Politics'
  | 'Environment'
  | 'Education'
  | 'Other'

export type ReadingFrequency = 
  | 'Daily'
  | 'Weekly'
  | 'Bi-Weekly'
  | 'Monthly'

export interface Newsletter {
  id: string;
  title: string;
  description: string;
  author: string;
  websiteUrl: string;
  subscribeUrl?: string;
  categories: NewsletterCategory[];
  tags: string[];
  averageReadTime?: number; // in minutes
  subscriberCount?: number;
  coverImageUrl?: string;
}

export interface UserPreferences {
  id?: string;
  userId: string;
  preferredCategories: NewsletterCategory[];
  readingFrequency: ReadingFrequency;
  excludedNewsletters?: string[];
}

export interface NewsletterRecommendation {
  newsletter: Newsletter;
  matchScore: number;
  matchReasons: string[];
}

export interface NewsletterFilter {
  category?: string;
  tags?: string[];
  frequency?: ReadingFrequency;
  minSubscribers?: number;
  searchTerm?: string;
}

export interface UserInteraction {
  newsletterId: string;
  userId: string;
  interactionType: 'view' | 'subscribe' | 'unsubscribe' | 'read';
  timestamp: Date;
}

import type { GlobalTypes } from '@/type/s/global';

export default Newsletter
