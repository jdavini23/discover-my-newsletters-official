import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, Globe } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { RecommendationInsightsService } from '@/services/recommendationInsightsService';

const InsightsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [insights, setInsights] = useState<{
    totalSubscribers: number;
    topCategories: { name: string; count: number }[];
    globalTrends: { topic: string; popularity: number }[];
    userEngagement: {
      averageReadTime: number;
      newslettersPerUser: number;
    };
  }>({
    totalSubscribers: 0,
    topCategories: [],
    globalTrends: [],
    userEngagement: {
      averageReadTime: 0,
      newslettersPerUser: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);

        // First, check if there are any insights
        const insights = await RecommendationInsightsService.fetchRecommendationInsights();

        // If no insights exist, seed some sample data
        if (insights.length === 0) {
          console.log('No insights found. Seeding sample data...');
          await RecommendationInsightsService.seedRecommendationInsights();
        }

        const performanceData = await RecommendationInsightsService.calculateOverallPerformance();
        console.log('Performance Data:', performanceData);

        setInsights({
          totalSubscribers: performanceData.totalRecommendations,
          topCategories: performanceData.topPerformingAlgorithms.map((algo) => ({
            name: algo.variant,
            count: algo.performanceScore,
          })),
          globalTrends: [],
          userEngagement: {
            averageReadTime: 0,
            newslettersPerUser: performanceData.positiveInteractionRate,
          },
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch insights:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className='flex justify-center items-center h-screen'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-center p-8 bg-white rounded-xl shadow-lg'
        >
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Access Denied</h2>
          <p className='text-gray-600'>
            You do not have permission to view administrative insights.
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className='w-16 h-16 border-4 border-t-4 border-primary-500 rounded-full'
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center p-8 bg-white rounded-xl shadow-lg'
        >
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Error</h2>
          <p className='text-gray-600'>{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-8'
      >
        <h1 className='text-3xl font-bold text-gray-800 flex items-center'>
          <BarChart className='h-8 w-8 mr-3 text-primary-500' />
          Administrative Insights
        </h1>
      </motion.div>

      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Total Subscribers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-xl shadow-lg p-6'
        >
          <div className='flex items-center mb-4'>
            <Users className='h-8 w-8 text-primary-500 mr-3' />
            <h2 className='text-xl font-semibold text-gray-700'>Total Subscribers</h2>
          </div>
          <p className='text-3xl font-bold text-gray-900'>
            {insights.totalSubscribers.toLocaleString()}
          </p>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className='bg-white rounded-xl shadow-lg p-6'
        >
          <div className='flex items-center mb-4'>
            <TrendingUp className='h-8 w-8 text-primary-500 mr-3' />
            <h2 className='text-xl font-semibold text-gray-700'>Top Categories</h2>
          </div>
          <ul className='space-y-2'>
            {insights.topCategories.map((category, index) => (
              <li key={index} className='flex justify-between'>
                <span>{category.name}</span>
                <span className='font-bold'>{category.count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Global Trends */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className='bg-white rounded-xl shadow-lg p-6'
        >
          <div className='flex items-center mb-4'>
            <Globe className='h-8 w-8 text-primary-500 mr-3' />
            <h2 className='text-xl font-semibold text-gray-700'>Global Trends</h2>
          </div>
          <ul className='space-y-2'>
            {insights.globalTrends.map((trend, index) => (
              <li key={index} className='flex justify-between'>
                <span>{trend.topic}</span>
                <span className='font-bold'>{trend.popularity}%</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* User Engagement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className='bg-white rounded-xl shadow-lg p-6'
        >
          <div className='flex items-center mb-4'>
            <BarChart className='h-8 w-8 text-primary-500 mr-3' />
            <h2 className='text-xl font-semibold text-gray-700'>User Engagement</h2>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Avg. Read Time</span>
              <span className='font-bold'>{insights.userEngagement.averageReadTime} min</span>
            </div>
            <div className='flex justify-between'>
              <span>Newsletters/User</span>
              <span className='font-bold'>
                {insights.userEngagement.newslettersPerUser.toFixed(1)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsightsPage;
