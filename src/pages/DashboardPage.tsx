import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  TrendingUp, 
  Bell, 
  Filter 
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

// Mock data types
interface Newsletter {
  id: string;
  title: string;
  description: string;
  category: string;
  subscribers: number;
}

interface Insight {
  id: string;
  metric: string;
  value: number;
  trend: 'up' | 'down';
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchDashboardData = async () => {
      try {
        // Mock newsletter data
        const mockNewsletters: Newsletter[] = [
          {
            id: '1',
            title: 'Tech Innovations Weekly',
            description: 'Latest trends in technology and innovation',
            category: 'Technology',
            subscribers: 5420
          },
          {
            id: '2',
            title: 'Startup Insider',
            description: 'Insights into emerging startups and entrepreneurs',
            category: 'Business',
            subscribers: 3210
          }
        ];

        // Mock insights data
        const mockInsights: Insight[] = [
          {
            id: '1',
            metric: 'Total Subscribers',
            value: 12345,
            trend: 'up'
          },
          {
            id: '2',
            metric: 'Newsletter Opens',
            value: 8765,
            trend: 'up'
          }
        ];

        setNewsletters(mockNewsletters);
        setInsights(mockInsights);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome, {user?.displayName || 'User'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's an overview of your newsletter insights
        </p>
      </header>

      {/* Insights Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="mr-2 text-primary-500" />
              Performance Insights
            </h2>
            <Filter className="text-gray-500" size={20} />
          </div>
          
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="flex justify-between items-center py-3 border-b last:border-b-0 dark:border-dark-border"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {insight.metric}
              </span>
              <div className="flex items-center">
                <span className="font-bold mr-2">
                  {insight.value.toLocaleString()}
                </span>
                {insight.trend === 'up' ? (
                  <TrendingUp className="text-green-500" size={16} />
                ) : (
                  <TrendingUp className="text-red-500 rotate-180" size={16} />
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Newsletters Section */}
        <motion.div 
          className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Newspaper className="mr-2 text-primary-500" />
              Your Newsletters
            </h2>
            <Bell className="text-gray-500" size={20} />
          </div>
          
          {newsletters.map((newsletter) => (
            <div 
              key={newsletter.id} 
              className="py-4 border-b last:border-b-0 dark:border-dark-border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {newsletter.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {newsletter.category}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary-600">
                  {newsletter.subscribers.toLocaleString()} Subscribers
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default DashboardPage;