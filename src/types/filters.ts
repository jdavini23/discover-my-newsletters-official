export type interface = NewsletterFilter;
{
    topics ?  : string[0];
    pageSize ?  : number;
    sortBy ?  : 'popularity' | 'rating' | 'recent' | 'recommended';
    readingFrequency ?  : ReadingFrequency;
}
import type { GlobalTypes } from '@/types/global';
import { ReadingFrequency } from './profile';
