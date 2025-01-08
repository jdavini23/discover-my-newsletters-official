import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { 
  ABTestingService, 
  RecommendationAlgorithmVariant,
  ABTestStatus 
} from '@/ml/abTestingFramework';

// Custom hook for A/B testing integration
export const useABTesting = (testId: string) => {
  const { user } = useAuthStore();
  const [assignedVariant, setAssignedVariant] = useState<RecommendationAlgorithmVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const assignUserToTest = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const variant = await ABTestingService.assignUserToTest(user.uid, testId);
        setAssignedVariant(variant);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    assignUserToTest();
  }, [user, testId]);

  // Record interaction metrics
  const recordInteraction = async (metrics: {
    clickThroughRate?: number;
    conversionRate?: number;
    engagementTime?: number;
  }) => {
    if (!user) return;

    try {
      await ABTestingService.recordTestInteraction(
        user.uid, 
        testId, 
        metrics
      );
    } catch (err) {
      console.error('Failed to record A/B test interaction:', err);
    }
  };

  return {
    assignedVariant,
    isLoading,
    error,
    recordInteraction
  };
};

// Utility hook for creating A/B tests
export const useCreateABTest = () => {
  const [testId, setTestId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTest = async (config: Parameters<typeof ABTestingService.createABTest>[0]) => {
    try {
      setIsCreating(true);
      const newTestId = await ABTestingService.createABTest(config);
      setTestId(newTestId);
      return newTestId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTest,
    testId,
    isCreating,
    error
  };
};

// Utility function to create a recommendation A/B test
export const createRecommendationABTest = async () => {
  const { createTest } = useCreateABTest();

  return createTest({
    name: 'Recommendation Algorithm Comparison',
    description: 'Compare different recommendation algorithm variants',
    startDate: new Date(),
    status: ABTestStatus.DRAFT,
    variants: {
      [RecommendationAlgorithmVariant.BASELINE]: {
        weight: 0.25,
        description: 'Original recommendation algorithm'
      },
      [RecommendationAlgorithmVariant.ML_SCORER_V1]: {
        weight: 0.25,
        description: 'Machine Learning Scorer V1'
      },
      [RecommendationAlgorithmVariant.ML_SCORER_V2]: {
        weight: 0.25,
        description: 'Machine Learning Scorer V2'
      },
      [RecommendationAlgorithmVariant.COLLABORATIVE_FILTERING]: {
        weight: 0.25,
        description: 'Collaborative Filtering Algorithm'
      }
    }
  });
};
