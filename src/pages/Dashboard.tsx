import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from '../components/FeedbackModal';
import FeedbackWidget from '../components/FeedbackWidget';
import newsletterService from '../services/newsletterService';
import { Newsletter } from '../types/newsletter';

interface Newsletter {
  id: string;
  title: string;
  description: string;
  category: string;
  subscribers: number;
}

const SAMPLE_NEWSLETTERS: Newsletter[] = [
  {
    id: '1',
    title: 'Tech Weekly',
    description: 'Latest updates in technology and software development',
    category: 'Technology',
    subscribers: 15000
  },
  {
    id: '2',
    title: 'Finance Insights',
    description: 'Expert analysis on markets and investments',
    category: 'Finance',
    subscribers: 12000
  },
  {
    id: '3',
    title: 'Health & Wellness',
    description: 'Tips for healthy living and wellness practices',
    category: 'Health',
    subscribers: 8000
  }
];

const Dashboard: React.FC = () => {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [recentNewsletters, setRecentNewsletters] = React.useState<Newsletter[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecentNewsletters = async () => {
      try {
        // Fetch recently viewed newsletters (mock implementation for now)
        const newsletters = await newsletterService.getRecentlyViewedNewsletters(
          currentUser?.uid || ''
        );
        setRecentNewsletters(newsletters);
      } catch (error) {
        console.error('Failed to fetch recent newsletters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchRecentNewsletters();
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const filteredNewsletters = SAMPLE_NEWSLETTERS.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || newsletter.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 w-full sm:w-auto">
          Welcome, {userProfile?.displayName || currentUser?.email}
        </h1>
        <button 
          className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded transition duration-300"
          onClick={handleSignOut}
        >
          Log Out
        </button>
      </div>

      <div className="space-y-6">
        {/* Search and Filter - Responsive Layout */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Search and Filter
          </h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input 
              type="text" 
              placeholder="Search newsletters..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Health">Health</option>
            </select>
          </div>
        </div>

        {/* Recent Newsletters - Responsive Layout */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Newsletters
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : recentNewsletters.length > 0 ? (
            <div className="space-y-4">
              {recentNewsletters.map(newsletter => (
                <div 
                  key={newsletter.id} 
                  className="p-4 border border-gray-200 rounded-md hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{newsletter.title}</h3>
                  <p className="text-gray-600 mt-2">{newsletter.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
                    <span className="text-sm text-gray-500">{newsletter.category}</span>
                    <button 
                      onClick={() => navigate(`/newsletter/${newsletter.id}`)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent newsletters found.</p>
          )}
        </div>

        {/* Newsletters - Responsive Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Newsletters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredNewsletters.map(newsletter => (
              <div 
                key={newsletter.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition duration-300 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-800">{newsletter.title}</h3>
                <p className="text-gray-600 mt-2 flex-grow">{newsletter.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">{newsletter.category}</span>
                  <span className="text-sm text-gray-600">
                    {newsletter.subscribers.toLocaleString()} subscribers
                  </span>
                </div>
                <button 
                  className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - Responsive Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/discover')}
              className="px-4 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
            >
              <span className="text-sm sm:text-base">Discover</span>
            </button>
            <button 
              onClick={() => navigate('/analytics')}
              className="px-4 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
            >
              <span className="text-sm sm:text-base">Analytics</span>
            </button>
            <button 
              onClick={() => navigate('/preferences')}
              className="px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
            >
              <span className="text-sm sm:text-base">Preferences</span>
            </button>
            <button 
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
            >
              <span className="text-sm sm:text-base">Feedback</span>
            </button>
          </div>
        </div>
      </div>

      <FeedbackWidget />

      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
