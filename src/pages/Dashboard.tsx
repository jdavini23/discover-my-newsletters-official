import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { currentUser, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const handleSignOut = async () => {
    try {
      await signOut();
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome, {userProfile?.displayName || currentUser?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search newsletters..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>
        </div>

        {/* Newsletters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNewsletters.map(newsletter => (
            <div key={newsletter.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{newsletter.title}</h3>
              <p className="text-gray-600 mb-4">{newsletter.description}</p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {newsletter.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {newsletter.subscribers.toLocaleString()} subscribers
                </span>
              </div>
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                Subscribe
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/preferences')}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Update Preferences
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              Discover New Newsletters
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
              View Subscriptions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
