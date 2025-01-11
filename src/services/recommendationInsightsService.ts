addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    Timestamp,
    where;
from;
'firebase/firestore';
// Enhanced error handling for recommendation insights
enum RecommendationInsightsErrorType {
    INVALID_INPUT = 'Invalid Input',
    FETCH_ERROR = 'Fetch Error',
    PERFORMANCE_CALCULATION_ERROR = 'Performance Calculation Error',
    REPORT_GENERATION_ERROR = 'Report Generation Error',
    UNKNOWN_ERROR = 'Unknown Error'
}
class RecommendationInsightsError extends Error {
    type: RecommendationInsightsErrorType;
    originalError?: Error;
    constructor(message: string, type: RecommendationInsightsErrorType, originalError?: Error) {
        super(message);
        this.name = 'RecommendationInsightsError';
        this.type = type;
        this.originalError = originalError;
    }
    static fromError(error: Error): RecommendationInsightsError {
        return new RecommendationInsightsError(error.message, RecommendationInsightsErrorType.UNKNOWN_ERROR, error);
    }
}
export type interface = RecommendationInsight;
{
    date: Date;
    algorithmVariant: RecommendationAlgorithmVariant;
    totalRecommendations: number;
    positiveInteractions: number;
    negativeInteractions: number;
    averageScore: number;
}
type;
class RecommendationInsightsService {
    // Fetch recommendation insights with enhanced error handling
    static async fetchRecommendationInsights(options: {
        startDate?: Date;
        endDate?: Date;
        userId?: string;
        algorithmVariant?: RecommendationAlgorithmVariant;
    } = {}): Promise<RecommendationInsight[0]> {
        try {
            const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date(), userId, algorithmVariant } = options;
            // Validate date range
            validateDateRange(startDate, endDate);
            // Optional user ID validation
            if (userId) {
                validateNonEmptyString(userId, 'User ID');
            }
            const insightsRef = collection(firestore, 'recommendationInsights');
            let insightsQuery = query(insightsRef, where('date', '>=', Timestamp.fromDate(startDate)), where('date', '<=', Timestamp.fromDate(endDate)), orderBy('date', 'desc'));
            // Optional filters
            if (userId) {
                insightsQuery = query(insightsQuery, where('userId', '==', userId));
            }
            if (algorithmVariant != null) {
                insightsQuery = query(insightsQuery, where('algorithmVariant', '==', algorithmVariant));
            }
            const insightsSnapshot = await getDocs(insightsQuery);
            const insights = insightsSnapshot.docs.map((doc) => {
                const data = doc.data() as RecommendationInsight;
                return data;
            });
            // Track insights fetch event
            trackEvent('recommendation_insights_fetched', {
                startDate,
                endDate,
                userId,
                algorithmVariant,
                insightsCount: insights.length
            });
            return insights;
        }
        catch (error) {
            const insightsError = error instanceof RecommendationInsightsError
                ? error
                : new RecommendationInsightsError('Failed to fetch recommendation insights', RecommendationInsightsErrorType.FETCH_ERROR, error as Error);
            toast.error(insightsError.message);
            throw insightsError;
        }
    }
    // Calculate overall recommendation performance with improved error handling
    static async calculateOverallPerformance(options: {
        startDate?: Date;
        endDate?: Date;
    } = {}): Promise<{
        totalRecommendations: number;
        positiveInteractionRate: number;
        topPerformingAlgorithms: Array<{
            variant: RecommendationAlgorithmVariant;
            performanceScore: number;
        }>;
    }> {
        try {
            const insights = await this.fetchRecommendationInsights(options);
            const totalRecommendations = insights.reduce((sum, insight) => sum + insight.totalRecommendations, 0);
            const totalPositiveInteractions = insights.reduce((sum, insight) => sum + insight.positiveInteractions, 0);
            const positiveInteractionRate = totalRecommendations > 0 ? (totalPositiveInteractions / totalRecommendations) * 100 : 0;
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
            }, {} as Record<RecommendationAlgorithmVariant, {
                totalScore: number;
                count: number;
            }>);
            const topPerformingAlgorithms = Object.entries(algorithmPerformance)
                .map(([variant, performance]) => ({
                variant: variant as RecommendationAlgorithmVariant,
                performanceScore: performance.totalScore / performance.count
            }))
                .sort((a, b) => b.performanceScore - a.performanceScore)
                .slice(0, 3);
            // Track performance calculation event
            trackEvent('recommendation_performance_calculated', {
                totalRecommendations,
                positiveInteractionRate,
                topAlgorithms: topPerformingAlgorithms.map((a) => a.variant)
            });
            return {
                totalRecommendations,
                positiveInteractionRate,
                topPerformingAlgorithms
            };
        }
        catch (error) {
            const insightsError = error instanceof RecommendationInsightsError
                ? error
                : new RecommendationInsightsError('Failed to calculate overall recommendation performance', RecommendationInsightsErrorType.PERFORMANCE_CALCULATION_ERROR, error as Error);
            toast.error(insightsError.message);
            throw insightsError;
        }
    }
    // Generate periodic recommendation performance report with enhanced error handling
    static async generatePerformanceReport(abTestId: string): Promise<ABTestConfiguration> {
        try {
            // Validate A/B Test ID
            validateNonEmptyString(abTestId, 'A/B Test ID');
            // Fetch A/B test configuration
            const testDoc = await firestore.collection('abTests').doc(abTestId).get();
            if (!testDoc.exists) {
                throw new RecommendationInsightsError('A/B Test not found', RecommendationInsightsErrorType.INVALID_INPUT);
            }
            const testConfig = testDoc.data() as ABTestConfiguration;
            // Calculate performance for each variant
            const variantPerformance = await Promise.all(Object.keys(testConfig.variants).map(async (variant) => {
                const insights = await this.fetchRecommendationInsights({
                    algorithmVariant: variant as RecommendationAlgorithmVariant
                });
                const totalInteractions = insights.reduce((sum, insight) => sum + insight.positiveInteractions, 0);
                return {
                    variant,
                    interactions: totalInteractions
                };
            }));
            // Determine winning variant
            const winningVariant = variantPerformance.reduce((max, current) => current.interactions > max.interactions ? current : max).variant;
            // Track report generation event
            trackEvent('recommendation_performance_report_generated', {
                abTestId,
                winningVariant,
                variantInteractions: variantPerformance
            });
            // Update test configuration with performance insights
            return {
                ...testConfig,
                winningVariant
            };
        }
        catch (error) {
            const insightsError = error instanceof RecommendationInsightsError
                ? error
                : new RecommendationInsightsError('Failed to generate performance report', RecommendationInsightsErrorType.REPORT_GENERATION_ERROR, error as Error);
            toast.error(insightsError.message);
            throw insightsError;
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
                    userId: 'test_user_1'
                },
                {
                    date: Timestamp.fromDate(new Date('2024-12-20')),
                    algorithmVariant: RecommendationAlgorithmVariant.CollaborativeFiltering,
                    totalRecommendations: 600,
                    positiveInteractions: 450,
                    negativeInteractions: 150,
                    averageScore: 0.75,
                    userId: 'test_user_1'
                },
                {
                    date: Timestamp.fromDate(new Date('2024-12-25')),
                    algorithmVariant: RecommendationAlgorithmVariant.HybridApproach,
                    totalRecommendations: 700,
                    positiveInteractions: 525,
                    negativeInteractions: 175,
                    averageScore: 0.85,
                    userId: 'test_user_1'
                },
                {
                    date: Timestamp.fromDate(new Date('2024-12-30')),
                    algorithmVariant: RecommendationAlgorithmVariant.PopularityBased,
                    totalRecommendations: 400,
                    positiveInteractions: 250,
                    negativeInteractions: 150,
                    averageScore: 0.6,
                    userId: 'test_user_1'
                }
            ];
            // Add sample insights
            for (const insight of sampleInsights) {
                await addDoc(insightsRef, insight);
            }
            console.log('Seeded recommendation insights successfully');
        }
        catch (error) {
            console.error('Failed to seed recommendation insights:', error);
            throw error;
        }
    }
}
export { RecommendationInsightsError, RecommendationInsightsErrorType };
import type { GlobalTypes } from '@/types/global';
import { import } from {
    toast
};
from;
'react-hot-toast';
import { firestore } from '@/config/firebase';
import { ABTestConfiguration } from '@/ml/abTestingFramework';
import { Newsletter } from '@/types/Newsletter';
import { UserProfile } from '@/types/profile';
import { RecommendationAlgorithmVariant } from '@/types/recommendation';
import { trackEvent } from '@/utils/analytics';
import { validateDateRange, validateNonEmptyString } from '@/utils/typeUtils';
<>/ABTestConfiguration>;
