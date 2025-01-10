import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

import { auth, firestore } from '@/config/firebase';
import { Newsletter, NewsletterEngagement, NewsletterFilters } from '@/types/Newsletter';

export interface NewsletterApiResponse {
  newsletters: Newsletter[];
  total: number;
  nextCursor?: string;
}

export class NewsletterService {
  private static newsletterCollection = collection(firestore, 'newsletters');

  static async fetchNewsletters(filters: NewsletterFilters = {}): Promise<NewsletterApiResponse> {
    try {
      const baseQuery = this.newsletterCollection;
      const conditions = [];

      if (filters.category) {
        conditions.push(where('category', '==', filters.category));
      }

      if (filters.tags && filters.tags.length > 0) {
        conditions.push(where('tags', 'array-contains-any', filters.tags));
      }

      if (filters.frequency) {
        conditions.push(where('frequency', '==', filters.frequency));
      }

      if (filters.minSubscribers) {
        conditions.push(where('subscribers', '>=', filters.minSubscribers));
      }

      // Construct the query with conditions
      const combinedQuery = query(
        baseQuery,
        ...conditions,
        orderBy('subscribers', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(combinedQuery);
      const newsletters = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Newsletter
      );

      return {
        newsletters,
        total: newsletters.length,
      };
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      throw error;
    }
  }

  static async searchNewsletters(filters: NewsletterFilters): Promise<NewsletterApiResponse> {
    try {
      const baseQuery = this.newsletterCollection;
      const conditions = [];

      if (filters.searchTerm) {
        // Implement text search across multiple fields
        const searchTerm = filters.searchTerm.toLowerCase();
        conditions.push(
          where('title', '>=', searchTerm),
          where('title', '<=', searchTerm + '\uf8ff')
        );
      }

      // Add other filter conditions similar to fetchNewsletters
      if (filters.category) {
        conditions.push(where('category', '==', filters.category));
      }

      const combinedQuery = query(
        baseQuery,
        ...conditions,
        orderBy('subscribers', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(combinedQuery);
      const newsletters = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Newsletter
      );

      return {
        newsletters,
        total: newsletters.length,
      };
    } catch (error) {
      console.error('Error searching newsletters:', error);
      throw error;
    }
  }

  static async subscribeToNewsletter(newsletterId: string): Promise<boolean> {
    try {
      const newsletterRef = doc(firestore, 'newsletters', newsletterId);

      // Increment subscribers count
      await updateDoc(newsletterRef, {
        subscribers: increment(1),
      });

      // Log engagement
      await this.logNewsletterEngagement(newsletterId, 'subscribe');

      return true;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return false;
    }
  }

  static async unsubscribeFromNewsletter(newsletterId: string): Promise<boolean> {
    try {
      const newsletterRef = doc(firestore, 'newsletters', newsletterId);

      // Decrement subscribers count
      await updateDoc(newsletterRef, {
        subscribers: increment(-1),
      });

      // Log engagement
      await this.logNewsletterEngagement(newsletterId, 'unsubscribe');

      return true;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return false;
    }
  }

  private static async logNewsletterEngagement(
    newsletterId: string,
    interactionType: NewsletterEngagement['interactionType']
  ): Promise<void> {
    try {
      const engagementsCollection = collection(firestore, 'newsletter_engagements');

      const engagement: NewsletterEngagement = {
        newsletterId,
        userId: auth.currentUser?.uid || 'anonymous',
        interactionType,
        timestamp: new Date(),
      };

      await addDoc(engagementsCollection, engagement);
    } catch (error) {
      console.error('Error logging newsletter engagement:', error);
    }
  }
}
