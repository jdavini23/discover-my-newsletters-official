import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Technology', 'Business', 'Science', 'Health', 
  'Sports', 'Entertainment', 'Politics', 'Finance', 
  'Travel', 'Food', 'Art', 'Music'
];

const PreferencesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserPreferences = async () => {
      if (currentUser) {
        try {
          const profile = await userService.getUserProfile(currentUser.uid);
          setSelectedCategories(profile?.preferences?.categories || []);
        } catch (error) {
          console.error('Error fetching preferences:', error);
        }
      }
    };

    fetchUserPreferences();
  }, [currentUser]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const savePreferences = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await userService.updateUserProfile(currentUser.uid, {
        preferences: { categories: selectedCategories }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
              Select Your Interests
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                    selectedCategories.includes(category)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={savePreferences}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
