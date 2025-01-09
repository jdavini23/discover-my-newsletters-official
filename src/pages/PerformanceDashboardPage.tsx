import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Flame, LightningZap, TrendingUp } from 'lucide-react';

import { performanceTracker } from '@/utils/analytics';
import { recommendationService } from '@/services/recommendationService';
import { useAuthStore } from '@/stores/authStore';

// Mock data generation for demonstration
const generateMockPerformanceData = () => {
  return {
    recommendationAccuracy: Math.random() * 100,
    userEngagement: {
      averageInteractions: Math.floor(Math.random() * 10),
      positiveRecommendations: Math.floor(Math.random() * 100),
      negativeRecommendations: Math.floor(Math.random() * 50),
    },
    systemPerformance: {
      averageResponseTime: Math.random() * 500, // ms
      recommendationGenerationTime: Math.random() * 200, // ms
    },
  };
};

const PerformanceMetricCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ icon: Icon, title, value, subtext, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all'
    >
      <div className='flex justify-between items-center mb-4'>
        <Icon className='w-8 h-8 text-primary-500' />
        {trend && (
          <div
            className={`
            flex items-center
            ${
              trend === 'up'
                ? 'text-green-500'
                : trend === 'down'
                  ? 'text-red-500'
                  : 'text-gray-500'
            }
          `}
          >
            <TrendingUp
              className={`w-5 h-5 mr-1 ${trend === 'down' ? 'transform rotate-180' : ''}`}
            />
            <span className='text-sm'>
              {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
            </span>
          </div>
        )}
      </div>
      <h3 className='text-xl font-bold text-gray-900 mb-2'>{title}</h3>
      <div className='flex justify-between items-end'>
        <span className='text-3xl font-extrabold text-primary-600'>{value}</span>
        {subtext && <span className='text-sm text-gray-500'>{subtext}</span>}
      </div>
    </motion.div>
  );
};

const PerformanceDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [performanceData, setPerformanceData] = useState(generateMockPerformanceData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        performanceTracker.markStart('performance_dashboard_load');

        // In a real implementation, fetch actual performance data
        const data = generateMockPerformanceData();
        setPerformanceData(data);

        performanceTracker.markEnd('performance_dashboard_load', {
          userId: user?.uid,
        });
      } catch (error) {
        console.error('Performance dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [user]);

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
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Performance Dashboard</h1>
        <p className='text-gray-600'>Insights into your newsletter discovery experience</p>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <PerformanceMetricCard
          icon={BarChart}
          title='Recommendation Accuracy'
          value={`${performanceData.recommendationAccuracy.toFixed(2)}%`}
          trend={performanceData.recommendationAccuracy > 75 ? 'up' : 'down'}
        />

        <PerformanceMetricCard
          icon={Flame}
          title='User Engagement'
          value={performanceData.userEngagement.averageInteractions}
          subtext='Avg. Interactions per Session'
          trend={performanceData.userEngagement.averageInteractions > 5 ? 'up' : 'neutral'}
        />

        <PerformanceMetricCard
          icon={LightningZap}
          title='System Performance'
          value={`${performanceData.systemPerformance.recommendationGenerationTime.toFixed(2)} ms`}
          subtext='Recommendation Generation Time'
          trend={
            performanceData.systemPerformance.recommendationGenerationTime < 100 ? 'up' : 'down'
          }
        />
      </div>

      <div className='mt-8 bg-white rounded-xl shadow-lg p-6'>
        <h2 className='text-2xl font-bold mb-4'>Recommendation Insights</h2>
        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <h3 className='font-semibold mb-2'>Positive Recommendations</h3>
            <div className='bg-green-50 p-4 rounded-lg'>
              <span className='text-2xl font-bold text-green-600'>
                {performanceData.userEngagement.positiveRecommendations}
              </span>
            </div>
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Negative Recommendations</h3>
            <div className='bg-red-50 p-4 rounded-lg'>
              <span className='text-2xl font-bold text-red-600'>
                {performanceData.userEngagement.negativeRecommendations}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboardPage;
