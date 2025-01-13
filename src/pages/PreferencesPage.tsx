import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewsletterCategory } from '../types/newsletter';

const PreferencesPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<NewsletterCategory[]>([]);
  const navigate = useNavigate();

  const categories: NewsletterCategory[] = [
    'Technology', 'Design', 'Startup', 'Programming', 'Marketing', 
    'Finance', 'Science', 'Art', 'Writing', 'Entrepreneurship'
  ];

  const toggleCategory = (category: NewsletterCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    // TODO: Save preferences to Firestore
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select Your Newsletter Interests
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`py-2 px-4 rounded transition ${
                selectedCategories.includes(category)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selectedCategories.length === 0}
          className="w-full mt-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;
