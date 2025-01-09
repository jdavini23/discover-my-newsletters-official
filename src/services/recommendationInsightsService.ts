import { firestore } from '@/config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  addDoc,
} from 'firebase/firestore';

import { Newsletter } from '@/types/Newsletter';
import { UserProfile } from '@/types/profile';
import { RecommendationAlgorithmVariant, ABTestConfiguration } from '@/ml/abTestingFramework';

export enum RecommendationAlgorithmVariant {
  ContentBased = 'content_based',
  CollaborativeFiltering = 'collaborative_filtering',
  HybridApproach = 'hybrid_approach',
  PopularityBased = 'popularity_based',
}

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
        algorithmVariant,
      } = options;

      console.log('Fetching recommendation insights with options:', {
        startDate,
        endDate,
        userId,
        algorithmVariant,
      });

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

      const insights = insightsSnapshot.docs.map((doc) => {
        const data = doc.data() as RecommendationInsight;
        console.log('Individual Insight:', data);
        return data;
      });

      console.log('Total insights found:', insights.length);

      return insights;
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
        totalRecommendations > 0 ? (totalPositiveInteractions / totalRecommendations) * 100 : 0;

      // Calculate performance by algorithm variant
      const algorithmPerformance = insights.reduce(
        (acc, insight) => {
          if (!acc[insight.algorithmVariant]) {
            acc[insight.algorithmVariant] = {
              totalScore: 0,
              count: 0,
            };
          }

          acc[insight.algorithmVariant].totalScore += insight.averageScore;
          acc[insight.algorithmVariant].count++;

          return acc;
        },
        {} as Record<RecommendationAlgorithmVariant, { totalScore: number; count: number }>
      );

      const topPerformingAlgorithms = Object.entries(algorithmPerformance)
        .map(([variant, performance]) => ({
          variant: variant as RecommendationAlgorithmVariant,
          performanceScore: performance.totalScore / performance.count,
        }))
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 3);

      return {
        totalRecommendations,
        positiveInteractionRate,
        topPerformingAlgorithms,
      };
    } catch (error) {
      console.error('Failed to calculate overall recommendation performance:', error);
      throw error;
    }
  }

  // Generate periodic recommendation performance report
  static async generatePerformanceReport(abTestId: string): Promise<ABTestConfiguration> {
    try {
      // Fetch A/B test configuration
      const testDoc = await firestore.collection('abTests').doc(abTestId).get();

      if (!testDoc.exists) {
        throw new Error('A/B Test not found');
      }

      const testConfig = testDoc.data() as ABTestConfiguration;

      // Calculate performance for each variant
      const variantPerformance = await Promise.all(
        Object.keys(testConfig.variants).map(async (variant) => {
          const insights = await this.fetchRecommendationInsights({
            algorithmVariant: variant as RecommendationAlgorithmVariant,
          });

          const totalInteractions = insights.reduce(
            (sum, insight) => sum + insight.positiveInteractions,
            0
          );

          return {
            variant,
            interactions: totalInteractions,
          };
        })
      );

      // Determine winning variant
      const winningVariant = variantPerformance.reduce((max, current) =>
        current.interactions > max.interactions ? current : max
      ).variant;

      // Update test configuration with performance insights
      return {
        ...testConfig,
        winningVariant,
      };
    } catch (error) {
      console.error('Failed to generate performance report:', error);
      throw error;
    }
  }

  // Method to seed recommendation insights for testing
  static async seedRecommendationInsights() {
    try {
      const insightsRef = collection(firestore, 'recommendationInsights');

      const sampleInsights = [
        {
          date: Timestamp.fromDate(new Date('2024-12-15')),
          algorithmVariant: RecommendationAlgorithmVariant.ContentBased,
          totalRecommendations: 500,
          positiveInteractions: 350,
          negativeInteractions: 150,
          averageScore: 0.7,
          userId: 'test_user_1',
        },
        {
          date: Timestamp.fromDate(new Date('2024-12-20')),
          algorithmVariant: RecommendationAlgorithmVariant.CollaborativeFiltering,
          totalRecommendations: 600,
          positiveInteractions: 450,
          negativeInteractions: 150,
          averageScore: 0.75,
          userId: 'test_user_1',
        },
        {
          date: Timestamp.fromDate(new Date('2024-12-25')),
          algorithmVariant: RecommendationAlgorithmVariant.HybridApproach,
          totalRecommendations: 700,
          positiveInteractions: 525,
          negativeInteractions: 175,
          averageScore: 0.85,
          userId: 'test_user_1',
        },
        {
          date: Timestamp.fromDate(new Date('2024-12-30')),
          algorithmVariant: RecommendationAlgorithmVariant.PopularityBased,
          totalRecommendations: 400,
          positiveInteractions: 250,
          negativeInteractions: 150,
          averageScore: 0.6,
          userId: 'test_user_1',
        },
      ];

      // Add sample insights
      for (const insight of sampleInsights) {
        await addDoc(insightsRef, insight);
      }

      console.log('Seeded recommendation insights successfully');
    } catch (error) {
      console.error('Failed to seed recommendation insights:', error);
      throw error;
    }
  }
}
