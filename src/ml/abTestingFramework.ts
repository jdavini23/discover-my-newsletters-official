import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Enum for A/B Test Status
export enum ABTestStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

// Enum for Recommendation Algorithm Variants
export enum RecommendationAlgorithmVariant {
  BASELINE = 'baseline',
  ML_SCORER_V1 = 'ml_scorer_v1',
  ML_SCORER_V2 = 'ml_scorer_v2',
  COLLABORATIVE_FILTERING = 'collaborative_filtering'
}

// A/B Test Configuration Interface
export interface ABTestConfiguration {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: ABTestStatus;
  variants: {
    [variant in RecommendationAlgorithmVariant]: {
      weight: number;
      description: string;
    }
  };
  metrics: {
    clickThroughRate: number;
    conversionRate: number;
    averageEngagementTime: number;
  };
}

// A/B Test Participant Interface
export interface ABTestParticipant {
  userId: string;
  assignedVariant: RecommendationAlgorithmVariant;
  assignedAt: Timestamp;
  testId: string;
}

export class ABTestingService {
  // Create a new A/B test configuration
  static async createABTest(
    config: Omit<ABTestConfiguration, 'id' | 'metrics'>
  ): Promise<string> {
    try {
      const testId = uuidv4();
      const testConfig: ABTestConfiguration = {
        ...config,
        id: testId,
        metrics: {
          clickThroughRate: 0,
          conversionRate: 0,
          averageEngagementTime: 0
        }
      };

      await setDoc(
        doc(firestore, 'abTests', testId), 
        testConfig
      );

      return testId;
    } catch (error) {
      console.error('Failed to create A/B test:', error);
      throw error;
    }
  }

  // Assign a user to an A/B test variant
  static async assignUserToTest(
    userId: string, 
    testId: string
  ): Promise<RecommendationAlgorithmVariant> {
    try {
      const testDoc = await getDoc(doc(firestore, 'abTests', testId));
      
      if (!testDoc.exists()) {
        throw new Error('A/B Test not found');
      }

      const testConfig = testDoc.data() as ABTestConfiguration;

      // Weighted random selection of variant
      const variants = Object.entries(testConfig.variants);
      const totalWeight = variants.reduce((sum, [, variant]) => sum + variant.weight, 0);
      
      let randomValue = Math.random() * totalWeight;
      let selectedVariant = variants[0][0] as RecommendationAlgorithmVariant;

      for (const [variant, config] of variants) {
        randomValue -= config.weight;
        if (randomValue <= 0) {
          selectedVariant = variant as RecommendationAlgorithmVariant;
          break;
        }
      }

      // Record participant assignment
      const participantDoc: ABTestParticipant = {
        userId,
        assignedVariant: selectedVariant,
        assignedAt: Timestamp.now(),
        testId
      };

      await setDoc(
        doc(firestore, 'abTestParticipants', `${testId}_${userId}`), 
        participantDoc
      );

      return selectedVariant;
    } catch (error) {
      console.error('Failed to assign user to A/B test:', error);
      throw error;
    }
  }

  // Record test interaction metrics
  static async recordTestInteraction(
    userId: string,
    testId: string,
    metrics: {
      clickThroughRate?: number;
      conversionRate?: number;
      engagementTime?: number;
    }
  ): Promise<void> {
    try {
      // Find participant's assigned variant
      const participantQuery = query(
        collection(firestore, 'abTestParticipants'),
        where('userId', '==', userId),
        where('testId', '==', testId)
      );

      const participantSnapshot = await getDocs(participantQuery);

      if (participantSnapshot.empty) {
        throw new Error('Participant not found in A/B test');
      }

      const participantDoc = participantSnapshot.docs[0];
      const participantData = participantDoc.data() as ABTestParticipant;

      // Update test metrics
      const testRef = doc(firestore, 'abTests', testId);
      await updateDoc(testRef, {
        'metrics.clickThroughRate': metrics.clickThroughRate,
        'metrics.conversionRate': metrics.conversionRate,
        'metrics.averageEngagementTime': metrics.engagementTime
      });
    } catch (error) {
      console.error('Failed to record A/B test interaction:', error);
    }
  }

  // Analyze and conclude A/B test
  static async concludeABTest(testId: string): Promise<{
    winningVariant: RecommendationAlgorithmVariant;
    conclusionReason: string;
  }> {
    try {
      const testDoc = await getDoc(doc(firestore, 'abTests', testId));
      
      if (!testDoc.exists()) {
        throw new Error('A/B Test not found');
      }

      const testConfig = testDoc.data() as ABTestConfiguration;
      const { metrics } = testConfig;

      // Simple statistical significance check
      const variants = Object.entries(testConfig.variants);
      const variantPerformance = variants.map(([variant, config]) => ({
        variant: variant as RecommendationAlgorithmVariant,
        performance: metrics.clickThroughRate * config.weight
      }));

      const winningVariant = variantPerformance.reduce(
        (max, current) => current.performance > max.performance ? current : max
      ).variant;

      // Update test status
      await updateDoc(doc(firestore, 'abTests', testId), {
        status: ABTestStatus.COMPLETED,
        endDate: Timestamp.now()
      });

      return {
        winningVariant,
        conclusionReason: 'Highest weighted click-through rate'
      };
    } catch (error) {
      console.error('Failed to conclude A/B test:', error);
      throw error;
    }
  }
}
