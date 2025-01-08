import { firestore } from '@/config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

import { Newsletter } from '@/types/Newsletter';
import { UserProfile } from '@/types/profile';
import { 
  RecommendationAlgorithmVariant,
  ABTestConfiguration 
} from '@/ml/abTestingFramework';

export interface RecommendationInsight {
  date: Date;
  algorithmVariant: RecommendationAlgorithmVariant;
  totalRecommendations: number;
  positiveInteractions: number;
  negativeInteractions: number;
  averageScore: number;
}

export class RecommendationInsightsService {
  // Fetch recommendation insights for a specific time range
  static async fetchRecommendationInsights(
    options: {
      startDate?: Date;
      endDate?: Date;
      userId?: string;
      algorithmVariant?: RecommendationAlgorithmVariant;
    } = {}
  ): Promise<RecommendationInsight[]> {
    try {
      const { 
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
        endDate = new Date(),
        userId,
        algorithmVariant
      } = options;

      const insightsRef = collection(firestore, 'recommendationInsights');
      
      let insightsQuery = query(
        insightsRef,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );

      // Optional filters
      if (userId) {
        insightsQuery = query(insightsQuery, where('userId', '==', userId));
      }

      if (algorithmVariant) {
        insightsQuery = query(insightsQuery, where('algorithmVariant', '==', algorithmVariant));
      }

      const insightsSnapshot = await getDocs(insightsQuery);

      return insightsSnapshot.docs.map(doc => doc.data() as RecommendationInsight);
    } catch (error) {
      console.error('Failed to fetch recommendation insights:', error);
      throw error;
    }
  }

  // Calculate overall recommendation performance
  static async calculateOverallPerformance(
    options: {
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<{
    totalRecommendations: number;
    positiveInteractionRate: number;
    topPerformingAlgorithms: Array<{
      variant: RecommendationAlgorithmVariant;
      performanceScore: number;
    }>;
  }> {
    try {
      const insights = await this.fetchRecommendationInsights(options);

      const totalRecommendations = insights.reduce(
        (sum, insight) => sum + insight.totalRecommendations, 
        0
      );

      const totalPositiveInteractions = insights.reduce(
        (sum, insight) => sum + insight.positiveInteractions, 
        0
      );

      const positiveInteractionRate = 
        totalRecommendations > 0 
          ? (totalPositiveInteractions / totalRecommendations) * 100 
          : 0;

      // Calculate performance by algorithm variant
      const algorithmPerformance = insights.reduce((acc, insight) => {
        if (!acc[insight.algorithmVariant]) {
          acc[insight.algorithmVariant] = {
            totalScore: 0,
            count: 0
          };
        }

        acc[insight.algorithmVariant].totalScore += insight.averageScore;
        acc[insight.algorithmVariant].count++;

        return acc;
      }, {} as Record<RecommendationAlgorithmVariant, { totalScore: number; count: number }>);

      const topPerformingAlgorithms = Object.entries(algorithmPerformance)
        .map(([variant, performance]) => ({
          variant: variant as RecommendationAlgorithmVariant,
          performanceScore: performance.totalScore / performance.count
        }))
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 3);

      return {
        totalRecommendations,
        positiveInteractionRate,
        topPerformingAlgorithms
      };
    } catch (error) {
      console.error('Failed to calculate overall recommendation performance:', error);
      throw error;
    }
  }

  // Generate periodic recommendation performance report
  static async generatePerformanceReport(
    abTestId: string
  ): Promise<ABTestConfiguration> {
    try {
      // Fetch A/B test configuration
      const testDoc = await firestore
        .collection('abTests')
        .doc(abTestId)
        .get();

      if (!testDoc.exists) {
        throw new Error('A/B Test not found');
      }

      const testConfig = testDoc.data() as ABTestConfiguration;

      // Calculate performance for each variant
      const variantPerformance = await Promise.all(
        Object.keys(testConfig.variants).map(async (variant) => {
          const insights = await this.fetchRecommendationInsights({
            algorithmVariant: variant as RecommendationAlgorithmVariant
          });

          const totalInteractions = insights.reduce(
            (sum, insight) => sum + insight.positiveInteractions, 
            0
          );

          return {
            variant,
            interactions: totalInteractions
          };
        })
      );

      // Determine winning variant
      const winningVariant = variantPerformance.reduce(
        (max, current) => 
          current.interactions > max.interactions ? current : max
      ).variant;

      // Update test configuration with performance insights
      return {
        ...testConfig,
        winningVariant
      };
    } catch (error) {
      console.error('Failed to generate performance report:', error);
      throw error;
    }
  }
}
