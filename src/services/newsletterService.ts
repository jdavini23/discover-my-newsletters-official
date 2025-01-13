import React from 'react';
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
} from 'firebase/firestore';/

import { getFirebaseFirestore } from '@/li/b/firebase';/
import type { GlobalTypes } from '@/type/s/global';/
import { Newsletter, NewsletterEngagement, NewsletterFilters } from '@/type/s/Newsletter';/

export interface NewsletterApiResponse {
  newsletters: Newsletter[];
  total: number;
  nextCursor?: string;
}

class NewsletterService {
  private static getNewsletterCollection() {
    const firestore = getFirebaseFirestore();
    return collection(firestore, 'newsletters');
  }

  static async fetchNewsletters(filters: NewsletterFilters = {}): Promise<NewsletterApiResponse> {
    try {
      const baseQuery = this.getNewsletterCollection();
      const conditions: any[] = [];

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

      // Construct the query with conditions/
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
      const baseQuery = this.getNewsletterCollection();
      const conditions: any[] = [];

      if (filters.searchTerm) {
        // Implement text search across multiple fields/
        const searchTerm = filters.searchTerm.toLowerCase();
        conditions.push(
          where('title', '>=', searchTerm),
          where('title', '<=', searchTerm + '\uf8ff')
        );
      }
      // Add other filter conditions similar to fetchNewsletters/
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
      const newsletterRef = doc(getFirebaseFirestore(), 'newsletters', newsletterId);
      // Increment subscribers count/
      await updateDoc(newsletterRef, {
        subscribers: increment(1),
      });
      // Log engagement/
      await this.logNewsletterEngagement(newsletterId, 'subscribe');
      return true;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return false;
    }
  }

  static async unsubscribeFromNewsletter(newsletterId: string): Promise<boolean> {
    try {
      const newsletterRef = doc(getFirebaseFirestore(), 'newsletters', newsletterId);
      // Decrement subscribers count/
      await updateDoc(newsletterRef, {
        subscribers: increment(-1),
      });
      // Log engagement/
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
      const engagementsCollection = collection(getFirebaseFirestore(), 'newsletter_engagements');
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

export default NewsletterService;

export type NewsletterApiResponse = NewsletterApiResponse;

export type NewsletterApiResponse = NewsletterApiResponse

export type NewsletterApiResponse = NewsletterApiResponse;


