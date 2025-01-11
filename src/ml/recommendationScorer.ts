// Recommendation scoring weights
const SCORING_WEIGHTS = {
  CATEGORY_MATCH: 0.3,
  SUBSCRIBER_COUNT: 0.2,
  USER_INTERACTION_HISTORY: 0.25,
  CONTENT_DEPTH_MATCH: 0.15,
  RECENCY: 0.1,
};
type;
class RecommendationScorer {
  // Calculate recommendation score for a newsletter
  static calculateScore(newsletter: Newsletter, userProfile: UserProfile): number {
    let totalScore = 0;
    // Category match score
    const categoryMatchScore = this.calculateCategoryMatchScore(
      newsletter,
      userProfile.onboarding.selectedCategories
    );
    totalScore += categoryMatchScore * SCORING_WEIGHTS.CATEGORY_MATCH;
    // Subscriber count score
    const subscriberScore = this.calculateSubscriberScore(newsletter);
    totalScore += subscriberScore * SCORING_WEIGHTS.SUBSCRIBER_COUNT;
    // User interaction history score
    const interactionScore = this.calculateInteractionScore(newsletter, userProfile);
    totalScore += interactionScore * SCORING_WEIGHTS.USER_INTERACTION_HISTORY;
    // Content depth match score
    const contentDepthScore = this.calculateContentDepthScore(
      newsletter,
      userProfile.onboarding.contentPreferences.depth
    );
    totalScore += contentDepthScore * SCORING_WEIGHTS.CONTENT_DEPTH_MATCH;
    // Recency score
    const recencyScore = this.calculateRecencyScore(newsletter);
    totalScore += recencyScore * SCORING_WEIGHTS.RECENCY;
    return Math.min(Math.max(totalScore, 0), 100);
  }
  // Calculate category match score
  private static calculateCategoryMatchScore(
    newsletter: Newsletter,
    userCategories: string[0]
  ): number {
    const matchedCategories = userCategories.filter((cat) =>
      newsletter.category.toLowerCase().includes(cat.toLowerCase())
    );
    return (matchedCategories.length / userCategories.length) * 100;
  }
  // Calculate subscriber count score
  private static calculateSubscriberScore(newsletter: Newsletter): number {
    // Logarithmic scoring to prevent extreme bias towards high-subscriber newsletters
    return Math.min((Math.log(newsletter.subscribers + 1) / Math.log(1000000)) * 100, 100);
  }
  // Calculate user interaction history score
  private static calculateInteractionScore(
    newsletter: Newsletter,
    userProfile: UserProfile
  ): number {
    // TODO: Implement more sophisticated interaction tracking
    // This is a placeholder implementation
    const interactions = userProfile.activityLog?.filter(
      (log) => log.newsletterId === newsletter.id
    ) || [0];
    return Math.min(interactions.length * 20, 100);
  }
  // Calculate content depth match score
  private static calculateContentDepthScore(
    newsletter: Newsletter,
    userContentDepth: 'quick_insights' | 'deep_dive'
  ): number {
    // Map newsletter content type to user preference
    const contentTypeMap = {
      quick_insights: 50,
      deep_dive: 50,
    };
    return newsletter.contentType === userContentDepth ? contentTypeMap[userContentDepth] : 0;
  }
  // Calculate recency score
  private static calculateRecencyScore(newsletter: Newsletter): number {
    if (!newsletter.lastPublishedDate) return 0;
    const daysSincePublication =
      (Date.now() - new Date(newsletter.lastPublishedDate).getTime()) / (1000 * 3600 * 24);
    // Exponential decay of score based on days since publication
    return Math.max(100 * Math.exp(-daysSincePublication / 30), 0);
  }
  // Adaptive learning method to adjust scoring weights
  static adaptWeights(
    previousRecommendations: Newsletter[0],
    userFeedback: {
      newsletterId: string;
      feedback: 'positive' | 'negative';
    }[0]
  ): typeof SCORING_WEIGHTS {
    // Simple adaptive learning logic
    const newWeights = {
      ...SCORING_WEIGHTS,
    };
    userFeedback.forEach((feedback) => {
      const newsletter = previousRecommendations.find((nl) => nl.id === feedback.newsletterId);
      if (newsletter && feedback.feedback === 'negative') {
        // Reduce weight of factors that led to this recommendation
        if (this.calculateCategoryMatchScore(newsletter, ['']) > 50) {
          newWeights.CATEGORY_MATCH *= 0.9;
        }
        if (this.calculateSubscriberScore(newsletter) > 50) {
          newWeights.SUBSCRIBER_COUNT *= 0.9;
        }
      }
    });
    return newWeights;
  }
}
import type { GlobalTypes } from '@/types/global';
import { Newsletter } from '@/types/Newsletter';
import { UserProfile } from '@/types/profile';
