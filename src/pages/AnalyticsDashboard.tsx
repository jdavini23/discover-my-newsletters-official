import * as React from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
  totalUsers: number;
  newsletterInteractions: {
    views: number;
    subscribes: number;
  };
  userFeedback: {
    total: number;
    byType: Record<string, number>;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Fetch user interactions
        const interactionsQuery = query(
          collection(db, 'user_interactions'),
          where('timestamp', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
        );
        const interactionsSnapshot = await getDocs(interactionsQuery);

        // Fetch feedback
        const feedbackQuery = query(
          collection(db, 'feedback'),
          where('timestamp', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        );
        const feedbackSnapshot = await getDocs(feedbackQuery);

        // Aggregate data
        const interactions = interactionsSnapshot.docs;
        const feedback = feedbackSnapshot.docs;

        const analyticsData: AnalyticsData = {
          totalUsers: 0, // This would typically come from Firebase Authentication
          newsletterInteractions: {
            views: interactions.filter(doc => doc.data().interactionType === 'view').length,
            subscribes: interactions.filter(doc => doc.data().interactionType === 'subscribe').length
          },
          userFeedback: {
            total: feedback.length,
            byType: feedback.reduce((acc, doc) => {
              const type = doc.data().type;
              acc[type] = (acc[type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          }
        };

        setAnalyticsData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in to view analytics</div>;
  }

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Newsletter Interactions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Newsletter Interactions</h2>
          <div className="space-y-2">
            <p>Views: {analyticsData?.newsletterInteractions.views}</p>
            <p>Subscribes: {analyticsData?.newsletterInteractions.subscribes}</p>
          </div>
        </div>

        {/* User Feedback */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
          <div className="space-y-2">
            <p>Total Feedback: {analyticsData?.userFeedback.total}</p>
            {Object.entries(analyticsData?.userFeedback.byType || {}).map(([type, count]) => (
              <p key={type}>{type}: {count}</p>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="space-y-2">
            <p>Total Users: {analyticsData?.totalUsers}</p>
            {/* Add more metrics as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
