import { ReadingFrequency } from './profile';

export interface NewsletterFilter {
  topics?: string[];
  pageSize?: number;
  sortBy?: 'popularity' | 'rating' | 'recent' | 'recommended';
  readingFrequency?: ReadingFrequency;
}
