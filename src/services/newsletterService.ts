import { 
  Newsletter, 
  NEWSLETTER_CATEGORIES, 
  UserPreferences, 
  NewsletterFilter,
  UserInteraction 
} from '../types/newsletter';
import { db } from '../firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  getDoc,
  deleteDoc,
  limit,
  orderBy
} from 'firebase/firestore';

export const newsletterService = {
  // Fetch newsletters with optional filtering
  async fetchNewsletters(filter?: NewsletterFilter): Promise<Newsletter[]> {
    try {
      const newslettersRef = collection(db, 'newsletters');
      let q = query(newslettersRef);

      // Apply filters
      if (filter) {
        if (filter.category) {
          q = query(q, where('categories', 'array-contains', filter.category));
        }
        if (filter.tags && filter.tags.length > 0) {
          q = query(q, where('tags', 'array-contains-any', filter.tags));
        }
        if (filter.minSubscribers) {
          q = query(q, where('subscriberCount', '>=', filter.minSubscribers));
        }
        if (filter.searchTerm) {
          // Basic text search (Firestore doesn't support full-text search natively)
          q = query(q, 
            where('title', '>=', filter.searchTerm),
            where('title', '<=', filter.searchTerm + '\uf8ff')
          );
        }
      }

      // Optional: limit results
      q = query(q, limit(50));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Newsletter));
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      return [];
    }
  },

  // Get a single newsletter by ID
  async getNewsletterById(id: string): Promise<Newsletter | null> {
    try {
      const docRef = doc(db, 'newsletters', id);
      const docSnap = await getDoc(docRef);
      
      return docSnap.exists() 
        ? { id: docSnap.id, ...docSnap.data() } as Newsletter 
        : null;
    } catch (error) {
      console.error('Error getting newsletter:', error);
      return null;
    }
  },

  // Record user interaction with a newsletter
  async recordUserInteraction(interaction: UserInteraction): Promise<void> {
    try {
      await addDoc(collection(db, 'user_interactions'), {
        ...interaction,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error recording user interaction:', error);
    }
  },

  // Get recommended newsletters based on user preferences
  async getRecommendedNewsletters(
    userPreferences: UserPreferences
  ): Promise<Newsletter[]> {
    try {
      // Basic recommendation logic
      const recommendedNewsletters = await this.fetchNewsletters({
        category: userPreferences.preferredCategories[0]
      });

      // Filter out excluded newsletters
      return recommendedNewsletters.filter(
        newsletter => !userPreferences.excludedNewsletters?.includes(newsletter.id)
      );
    } catch (error) {
      console.error('Error getting recommended newsletters:', error);
      return [];
    }
  },

  // Get recently viewed newsletters for a user
  async getRecentlyViewedNewsletters(userId: string): Promise<Newsletter[]> {
    try {
      // Query user interactions sorted by timestamp, most recent first
      const interactionsRef = collection(db, 'user_interactions');
      const q = query(
        interactionsRef, 
        where('userId', '==', userId),
        where('interactionType', '==', 'view'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );

      const interactionsSnapshot = await getDocs(q);
      
      // If no interactions, return empty array
      if (interactionsSnapshot.empty) {
        return [];
      }

      // Get unique newsletter IDs from interactions
      const newsletterIds = [...new Set(interactionsSnapshot.docs
        .map(doc => doc.data().newsletterId))];

      // Fetch the actual newsletters
      const newslettersRef = collection(db, 'newsletters');
      const newsletterPromises = newsletterIds.map(async (id) => {
        const docRef = doc(newslettersRef, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() 
          ? { id: docSnap.id, ...docSnap.data() } as Newsletter 
          : null;
      });

      // Filter out any null results
      const newsletters = await Promise.all(newsletterPromises);
      return newsletters.filter(nl => nl !== null) as Newsletter[];
    } catch (error) {
      console.error('Error fetching recently viewed newsletters:', error);
      throw error;
    }
  }
};

export default newsletterService;
