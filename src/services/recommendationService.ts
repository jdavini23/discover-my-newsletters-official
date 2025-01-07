import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { User, Newsletter, UserNewsletterInteraction, NewsletterFilter } from '@/types/firestore';

const db = getFirestore();

// Record user interaction with a newsletter
export const recordNewsletterInteraction = async (
  newsletterId: string,
  interactionType: UserNewsletterInteraction['interactionType'],
  duration?: number
) => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const interactionRef = collection(db, 'userNewsletterInteractions');

  const interaction: UserNewsletterInteraction = {
    id: '', // Firestore will generate this
    userId: auth.currentUser.uid,
    newsletterId,
    interactionType,
    timestamp: Timestamp.now(),
    duration,
  };

  // Add interaction record
  const docRef = await addDoc(interactionRef, interaction);

  // Update user's recommendation profile
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, {
    'recommendationProfile.viewedNewsletters':
      interactionType === 'view' ? { $addToSet: newsletterId } : undefined,
    'recommendationProfile.subscribedNewsletters':
      interactionType === 'subscribe' ? { $addToSet: newsletterId } : undefined,
    [`recommendationProfile.interactionScores.${newsletterId}`]:
      interactionType === 'view'
        ? { $inc: 1 }
        : interactionType === 'subscribe'
          ? { $inc: 5 }
          : interactionType === 'read'
            ? { $inc: 3 }
            : undefined,
  });

  return docRef.id;
};

// Generate personalized recommendations
export const generatePersonalizedRecommendations = async (
  user: User,
  filters: NewsletterFilter = {}
) => {
  const {
    topics = user.newsletterPreferences.interestedTopics,
    pageSize = 12,
    sortBy = 'recommended',
  } = filters;

  // Ensure we have a non-empty array for 'not-in' filter
  const excludedNewsletters =
    (user.recommendationProfile.subscribedNewsletters || []).length > 0
      ? user.recommendationProfile.subscribedNewsletters
      : ['__no_match__']; // Use a placeholder that won't match any real ID

  // Base recommendation query
  let recommendationQuery = query(
    collection(db, 'newsletters'),
    // Exclude already subscribed newsletters
    where('id', 'not-in', excludedNewsletters)
  );

  // Filter by user's interested topics
  if (topics && topics.length > 0) {
    recommendationQuery = query(
      recommendationQuery,
      where('topics', 'array-contains-any', topics),
      orderBy('averageRating', 'desc')
    );
  }

  // Sort based on selected option
  switch (sortBy) {
    case 'popularity':
      recommendationQuery = query(recommendationQuery, orderBy('subscriberCount', 'desc'));
      break;
    case 'rating':
      recommendationQuery = query(recommendationQuery, orderBy('averageRating', 'desc'));
      break;
    case 'recent':
      recommendationQuery = query(recommendationQuery, orderBy('createdAt', 'desc'));
      break;
    case 'recommended':
    default:
      // Use a simpler sorting for recommended to avoid complex indexing
      recommendationQuery = query(recommendationQuery, orderBy('averageRating', 'desc'));
  }

  // Add limit to all queries
  recommendationQuery = query(recommendationQuery, limit(pageSize));

  const recommendationSnapshot = await getDocs(recommendationQuery);

  return recommendationSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Newsletter
  );
};

// Update newsletter recommendation metadata
export const updateNewsletterRecommendationMetadata = async (newsletterId: string) => {
  const newsletterRef = doc(db, 'newsletters', newsletterId);

  // Fetch interaction data
  const interactionsQuery = query(
    collection(db, 'userNewsletterInteractions'),
    where('newsletterId', '==', newsletterId)
  );
  const interactionsSnapshot = await getDocs(interactionsQuery);

  // Calculate recommendation metadata
  const interactions = interactionsSnapshot.docs.map(
    (doc) => doc.data() as UserNewsletterInteraction
  );

  const topicWeights: Record<string, number> = {};
  let totalInteractions = 0;
  let contentQualityScore = 0;

  interactions.forEach((interaction) => {
    totalInteractions++;

    // Weight interactions differently
    const interactionWeight =
      interaction.interactionType === 'subscribe'
        ? 5
        : interaction.interactionType === 'read'
          ? 3
          : interaction.interactionType === 'view'
            ? 1
            : 0;

    // Accumulate topic weights
    // In a real scenario, you'd fetch the newsletter's topics
    // For this example, we'll simulate it
    const newsletterTopics = ['Technology', 'Business']; // Placeholder
    newsletterTopics.forEach((topic) => {
      topicWeights[topic] = (topicWeights[topic] || 0) + interactionWeight;
    });

    // Calculate content quality based on interaction duration
    if (interaction.duration) {
      contentQualityScore += interaction.duration;
    }
  });

  // Normalize scores
  Object.keys(topicWeights).forEach((topic) => {
    topicWeights[topic] /= totalInteractions;
  });
  contentQualityScore /= totalInteractions;

  // Update newsletter metadata
  await updateDoc(newsletterRef, {
    'recommendationMetadata.topicWeights': topicWeights,
    'recommendationMetadata.contentQualityScore': contentQualityScore,
  });
};

// Find similar newsletters
export const findSimilarNewsletters = async (newsletterId: string) => {
  const newsletterRef = doc(db, 'newsletters', newsletterId);

  // In a real-world scenario, this would use more sophisticated
  // similarity algorithms like collaborative filtering or
  // content-based filtering
  const similarNewslettersQuery = query(
    collection(db, 'newsletters'),
    where('topics', 'array-contains-any', ['Technology', 'Business']), // Placeholder
    limit(5)
  );

  const similarNewslettersSnapshot = await getDocs(similarNewslettersQuery);

  const similarNewsletters = similarNewslettersSnapshot.docs
    .filter((doc) => doc.id !== newsletterId)
    .map((doc) => doc.id);

  // Update newsletter with similar newsletters
  await updateDoc(newsletterRef, {
    'recommendationMetadata.similarNewsletters': similarNewsletters,
  });

  return similarNewsletters;
};

import { User, UserNewsletterInteraction, NewsletterFilter } from '../types/firestore';

import { RecommendationEngine } from '../types/recommendation';

class RecommendationService implements RecommendationEngine {
  private calculateContentBasedScore(
    newsletter: Newsletter,
    context: RecommendationContext
  ): number {
    let score = 0;
    const preferences = context.preferences;

    // Match categories
    preferences.categories.forEach((category) => {
      if (newsletter.categories.includes(category)) {
        score += 0.3;
      }
    });

    // Match topics
    if (context.currentInterests) {
      context.currentInterests.forEach((interest) => {
        if (newsletter.tags.includes(interest)) {
          score += 0.2;
        }
      });
    }

    // Frequency matching
    if (newsletter.frequency === preferences?.readingFrequency) {
      score += 0.2;
    }

    return score;
  }

  private async fetchUserInteractionHistory(userId: string): Promise<UserNewsletterInteraction[]> {
    const interactionsRef = collection(db, 'userNewsletterInteractions');
    const q = query(
      interactionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as UserNewsletterInteraction);
  }

  private async calculateCollaborativeScore(
    newsletter: Newsletter,
    userId: string
  ): Promise<number> {
    try {
      // Find similar users based on newsletter interactions
      const interactionsRef = collection(db, 'userNewsletterInteractions');

      // Find users who have interacted with this newsletter
      const similarUsersQuery = query(
        interactionsRef,
        where('newsletterId', '==', newsletter.id),
        limit(50)
      );

      const similarUsersSnapshot = await getDocs(similarUsersQuery);
      const similarUserIds = similarUsersSnapshot.docs
        .map((doc) => doc.data().userId)
        .filter((id) => id !== userId);

      // If no similar users, return minimal score
      if (similarUserIds.length === 0) return 0.1;

      // Find interactions of similar users
      const similarUsersInteractionsQuery = query(
        interactionsRef,
        where('userId', 'in', similarUserIds),
        where('interactionType', 'in', ['subscribe', 'view'])
      );

      const similarInteractionsSnapshot = await getDocs(similarUsersInteractionsQuery);

      // Calculate collaborative score based on similar users' interactions
      const totalInteractions = similarInteractionsSnapshot.docs.length;
      const newsletterInteractions = similarInteractionsSnapshot.docs.filter(
        (doc) => doc.data().newsletterId === newsletter.id
      ).length;

      // Normalize score
      return Math.min(0.4, (newsletterInteractions / totalInteractions) * 0.4);
    } catch (error) {
      console.error('Collaborative Filtering Error:', error);
      return 0.1; // Minimal fallback score
    }
  }

  private async calculateContentBasedScoreEnhanced(
    newsletter: Newsletter,
    context: RecommendationContext
  ): Promise<number> {
    let score = 0;
    const preferences = context.preferences;

    // Weighted category matching
    const categoryWeights: { [key: string]: number } = {
      Technology: 0.3,
      Business: 0.25,
      Science: 0.2,
      Culture: 0.15,
      Politics: 0.1,
    };

    preferences.categories.forEach((category) => {
      const matchedCategories = newsletter.categories.filter((nc) =>
        nc.toLowerCase().includes(category.toLowerCase())
      );

      matchedCategories.forEach((matchedCategory) => {
        score += categoryWeights[matchedCategory] || 0.1;
      });
    });

    // Advanced topic matching with fuzzy logic
    if (context.currentInterests) {
      context.currentInterests.forEach((interest) => {
        const topicMatch = newsletter.tags.some((tag) =>
          tag.toLowerCase().includes(interest.toLowerCase())
        );

        if (topicMatch) {
          score += 0.2;
        }
      });
    }

    // Frequency and reading time matching
    if (newsletter.frequency === preferences?.readingFrequency) {
      score += 0.15;
    }

    // Recency bonus
    const newsletterAge = this.calculateNewsletterAge(newsletter);
    score += this.calculateRecencyBonus(newsletterAge);

    return Math.min(0.6, score); // Cap content-based score
  }

  private calculateNewsletterAge(newsletter: Newsletter): number {
    if (!newsletter.createdAt) return 12; // Default to 1-year-old if no date

    const createdDate = newsletter.createdAt.toDate();
    const currentDate = new Date();

    const monthsDiff =
      (currentDate.getFullYear() - createdDate.getFullYear()) * 12 +
      (currentDate.getMonth() - createdDate.getMonth());

    return monthsDiff;
  }

  private calculateRecencyBonus(ageInMonths: number): number {
    // Newer newsletters get higher bonus
    if (ageInMonths <= 3) return 0.2; // Very new
    if (ageInMonths <= 6) return 0.15; // Relatively new
    if (ageInMonths <= 12) return 0.1; // Somewhat new
    return 0.05; // Older newsletters
  }

  private getFallbackRecommendations(context: RecommendationContext): RecommendationScore[] {
    const fallbackNewsletters: Newsletter[] = [
      {
        id: 'fallback1',
        title: 'Tech Innovators Weekly',
        description: 'Cutting-edge insights into the latest technology trends and innovations',
        categories: ['Technology'],
        tags: ['AI', 'Startups', 'Innovation'],
        frequency: 'weekly',
        createdAt: Timestamp.now(),
        coverImage: 'https://example.com/tech-innovators.jpg',
      },
      {
        id: 'fallback2',
        title: 'Startup Insider',
        description: 'In-depth stories and strategies from successful entrepreneurs',
        categories: ['Business'],
        tags: ['Entrepreneurship', 'Funding', 'Growth'],
        frequency: 'weekly',
        createdAt: Timestamp.now(),
        coverImage: 'https://example.com/startup-insider.jpg',
      },
      {
        id: 'fallback3',
        title: 'AI and Machine Learning Digest',
        description: 'Comprehensive overview of the latest advancements in AI and ML',
        categories: ['Technology', 'Science'],
        tags: ['AI', 'Machine Learning', 'Research'],
        frequency: 'weekly',
        createdAt: Timestamp.now(),
        coverImage: 'https://example.com/ai-digest.jpg',
      },
    ];

    return fallbackNewsletters.map((newsletter) => ({
      newsletter,
      newsletterId: newsletter.id,
      score: 0.7, // High default score for fallback
      reasons: ['Recommended based on trending topics'],
    }));
  }

  async generateRecommendations(context: RecommendationContext): Promise<RecommendationScore[]> {
    try {
      // Validate input context
      if (!context || !context.userId) {
        console.error('RECOMMENDATION_SERVICE: Invalid recommendation context:', context);
        return this.getFallbackRecommendations(context);
      }

      console.log('RECOMMENDATION_SERVICE: Generating recommendations...', {
        userId: context.userId,
        preferences: JSON.stringify(context.preferences),
        currentInterests: context.currentInterests,
      });

      // Ensure preferences exist with default values
      const preferences = context.preferences || {
        categories: [],
        readingFrequency: 'weekly',
        excludedNewsletters: [],
      };

      // Fetch user's interaction history
      const interactions = await this.fetchUserInteractionHistory(context.userId);
      console.log('RECOMMENDATION_SERVICE: User Interactions', {
        userId: context.userId,
        interactionsCount: interactions.length,
      });

      // Fetch newsletters
      const newslettersRef = collection(db, 'newsletters');
      const q = query(
        newslettersRef,
        where('status', '==', 'active'), // Only active newsletters
        limit(100) // Increased limit for more diverse recommendations
      );
      const querySnapshot = await getDocs(q);

      const newsletters = await Promise.all(
        querySnapshot.docs
          .map(async (doc) => {
            const data = doc.data() as Newsletter;
            if (!data || !data.title) return null;

            // Collaborative and content-based scoring
            const [collaborativeScore, contentScore] = await Promise.all([
              this.calculateCollaborativeScore(data, context.userId),
              this.calculateContentBasedScoreEnhanced(data, context),
            ]);

            return {
              newsletter: {
                id: doc.id,
                ...data,
              },
              newsletterId: doc.id,
              score: Math.min(1, collaborativeScore + contentScore),
              reasons: [], // TODO: Add specific recommendation reasons
            };
          })
          .filter(Boolean)
      );

      // If no newsletters found, return fallback recommendations
      if (newsletters.length === 0) {
        console.warn('RECOMMENDATION_SERVICE: No newsletters found, using fallback');
        return this.getFallbackRecommendations(context);
      }

      // Advanced sorting with diversity
      const recommendations = newsletters
        .filter((rec) => !context.preferences.excludedNewsletters?.includes(rec.newsletterId))
        .sort((a, b) => b.score - a.score)
        .slice(0, 15) // Increased to 15 for more variety
        .sort(() => 0.5 - Math.random()) // Add some randomness
        .slice(0, 10); // Take top 10 with some randomness

      // If no recommendations after filtering, use fallback
      if (recommendations.length === 0) {
        console.warn('RECOMMENDATION_SERVICE: No recommendations after filtering, using fallback');
        return this.getFallbackRecommendations(context);
      }

      console.log('RECOMMENDATION_SERVICE: Generated Recommendations', {
        count: recommendations.length,
        recommendationDetails: recommendations.map((rec) => ({
          title: rec.newsletter.title,
          score: rec.score,
        })),
      });

      return recommendations;
    } catch (error) {
      console.error('RECOMMENDATION_SERVICE: Advanced Error', error);
      // Provide fallback recommendations on any error
      return this.getFallbackRecommendations(context);
    }
  }

  async updateUserPreferences(
    userId: string,
    newPreferences: Partial<UserPreference>
  ): Promise<void> {
    try {
      console.log('Updating user preferences...', { userId });
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { preferences: newPreferences });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async trackUserInteraction(
    userId: string,
    newsletterId: string,
    interactionType: 'view' | 'subscribe' | 'dismiss'
  ): Promise<void> {
    try {
      console.log('Tracking user interaction:', {
        userId,
        newsletterId,
        interactionType,
      });
      const interactionsRef = collection(db, 'userNewsletterInteractions');
      await addDoc(interactionsRef, {
        userId,
        newsletterId,
        interactionType,
        timestamp: Timestamp.now(),
      });

      // Potentially update recommendation metadata
      await this.updateNewsletterRecommendationMetadata(newsletterId);
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  async updateNewsletterRecommendationMetadata(newsletterId: string): Promise<void> {
    try {
      console.log('Updating newsletter recommendation metadata...', { newsletterId });
      const newsletterRef = doc(db, 'newsletters', newsletterId);

      // Fetch interaction data
      const interactionsRef = collection(db, 'userNewsletterInteractions');
      const q = query(interactionsRef, where('newsletterId', '==', newsletterId));

      const snapshot = await getDocs(q);
      const interactions = snapshot.docs.map((doc) => doc.data() as UserNewsletterInteraction);

      // Calculate engagement metrics
      const viewCount = interactions.filter((i) => i.interactionType === 'view').length;
      const subscribeCount = interactions.filter((i) => i.interactionType === 'subscribe').length;

      await updateDoc(newsletterRef, {
        recommendationScore: {
          viewCount,
          subscribeCount,
          lastUpdated: Timestamp.now(),
        },
      });
    } catch (error) {
      console.error('Error updating newsletter recommendation metadata:', error);
    }
  }

  async fetchTrendingNewsletters(): Promise<Newsletter[]> {
    try {
      console.log('Fetching trending newsletters...');
      const newslettersRef = collection(db, 'newsletters');
      const q = query(newslettersRef, orderBy('subscriberCount', 'desc'), limit(10));

      const querySnapshot = await getDocs(q);

      console.log('Query Snapshot Details:', {
        empty: querySnapshot.empty,
        size: querySnapshot.size,
      });

      const trendingNewsletters = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Newsletter;
        console.log('Trending Newsletter Document:', {
          id: doc.id,
          title: data.title,
          category: data.category,
          subscriberCount: data.subscriberCount,
        });
        return {
          id: doc.id,
          ...data,
        };
      });

      console.log(`Fetched ${trendingNewsletters.length} trending newsletters`);
      console.log(
        'Trending Newsletter Titles:',
        trendingNewsletters.map((nl) => nl.title)
      );

      return trendingNewsletters;
    } catch (error) {
      console.error('Error fetching trending newsletters:', error);
      return []; // Return empty array instead of throwing
    }
  }
}

export const recommendationService = new RecommendationService();
