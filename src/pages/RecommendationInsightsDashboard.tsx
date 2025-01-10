import { BarChart, Star, TrendingUp, Zap } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
// Conditionally import recharts
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ABTestingService, RecommendationAlgorithmVariant } from '@/ml/abTestingFramework';
import { recommendationService } from '@/services/recommendationService';
import { useAuthStore } from '@/stores/authStore';
import { recommendationTracker } from '@/utils/analytics';

// Color palette for visualizations
const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F43F5E', // Red
  '#8B5CF6', // Purple
];

// Mock data generation for demonstration
const generateMockInsightsData = () => {
  return {
    algorithmPerformance: [
      { variant: 'Baseline', score: Math.random() * 100 },
      { variant: 'ML Scorer V1', score: Math.random() * 100 },
      { variant: 'ML Scorer V2', score: Math.random() * 100 },
      { variant: 'Collaborative Filtering', score: Math.random() * 100 },
    ],
    userInteractions: {
      totalRecommendations: Math.floor(Math.random() * 1000),
      positiveInteractions: Math.floor(Math.random() * 500),
      negativeInteractions: Math.floor(Math.random() * 200),
    },
    timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      recommendations: Math.floor(Math.random() * 50),
      interactions: Math.floor(Math.random() * 30),
    })),
  };
};

const RecommendationInsightsDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [insightsData, setInsightsData] = useState(generateMockInsightsData());
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        setLoading(true);

        // TODO: Implement actual data fetching
        // const data = await recommendationService.fetchRecommendationInsights();
        const data = generateMockInsightsData();
        setInsightsData(data);

        // Fetch active A/B tests
        // const activeTests = await ABTestingService.getActiveTests();
        // setActiveTest(activeTests[0]?.id || null);
      } catch (error) {
        console.error('Failed to fetch recommendation insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsightsData();
  }, [user]);

  const interactionRatio = useMemo(() => {
    const { totalRecommendations, positiveInteractions } = insightsData.userInteractions;
    return totalRecommendations > 0
      ? ((positiveInteractions / totalRecommendations) * 100).toFixed(2)
      : '0.00';
  }, [insightsData]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-primary-500'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Recommendation Insights</h1>
        <p className='text-gray-600'>
          Comprehensive analytics of our newsletter recommendation system
        </p>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {/* Algorithm Performance Card */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <BarChart className='w-8 h-8 text-primary-500' />
            <h3 className='text-xl font-bold text-gray-900'>Algorithm Performance</h3>
          </div>
          {/* Fallback to simple div if PieChart fails */}
          <div className='h-[200px] overflow-auto'>
            {insightsData.algorithmPerformance.map((perf, index) => (
              <div
                key={perf.variant}
                className='flex items-center mb-2'
                style={{ color: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
              >
                <div
                  className='w-4 h-4 mr-2 rounded-full'
                  style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
                />
                <span>
                  {perf.variant}: {perf.score.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Interactions Card */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <Star className='w-8 h-8 text-primary-500' />
            <h3 className='text-xl font-bold text-gray-900'>User Interactions</h3>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Total Recommendations</p>
              <p className='text-2xl font-bold text-primary-600'>
                {insightsData.userInteractions.totalRecommendations}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Interaction Ratio</p>
              <p className='text-2xl font-bold text-green-600'>{interactionRatio}%</p>
            </div>
          </div>
        </div>

        {/* Performance Trend Card */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <Zap className='w-8 h-8 text-primary-500' />
            <h3 className='text-xl font-bold text-gray-900'>Performance Trend</h3>
          </div>
          <div className='h-[200px] overflow-auto'>
            {insightsData.timeSeriesData.map((data) => (
              <div key={data.day} className='flex justify-between mb-1'>
                <span>Day {data.day}</span>
                <span>Recommendations: {data.recommendations}</span>
                <span>Interactions: {data.interactions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active A/B Test Section */}
      {activeTest && (
        <div className='bg-white rounded-xl shadow-lg p-6 mt-8'>
          <h2 className='text-2xl font-bold mb-4'>Active A/B Test</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <p className='font-semibold'>Test ID</p>
              <p>{activeTest}</p>
            </div>
            {/* Add more A/B test details */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationInsightsDashboard;
