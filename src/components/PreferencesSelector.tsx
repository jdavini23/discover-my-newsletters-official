import React, { useState, useEffect } from 'react';
import { NewsletterCategory, ReadingFrequency, UserPreferences } from '../types/newsletter';
import { useNewsletters } from '../contexts/NewsletterContext';

const ALL_CATEGORIES: NewsletterCategory[] = [
  'Technology', 'Design', 'Startup', 'Programming', 'Marketing', 
  'Finance', 'Science', 'Art', 'Writing', 'Entrepreneurship', 
  'Personal Development', 'Health', 'Travel', 'Food', 'Music', 
  'Sports', 'Politics', 'Environment', 'Education'
];

const READING_FREQUENCIES: ReadingFrequency[] = [
  'Daily', 'Weekly', 'Bi-Weekly', 'Monthly'
];

export const PreferencesSelector: React.FC = () => {
  const { 
    userPreferences, 
    setUserPreferences, 
    updatePreferredCategories,
    fetchRecommendations 
  } = useNewsletters();

  const [selectedCategories, setSelectedCategories] = useState<NewsletterCategory[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<ReadingFrequency>('Weekly');

  // Toggle category selection
  const toggleCategory = (category: NewsletterCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  // Save preferences
  const savePreferences = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    const newPreferences: UserPreferences = {
      userId: 'current-user', // TODO: Replace with actual user ID
      preferredCategories: selectedCategories,
      readingFrequency: selectedFrequency
    };

    setUserPreferences(newPreferences);
    updatePreferredCategories(selectedCategories);
    fetchRecommendations();
  };

  return (
    <div className="preferences-selector">
      <h2>Select Your Newsletter Interests</h2>
      
      <div className="category-selection">
        <h3>Choose Categories</h3>
        <div className="category-grid">
          {ALL_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`category-button ${
                selectedCategories.includes(category) ? 'selected' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="frequency-selection">
        <h3>Reading Frequency</h3>
        {READING_FREQUENCIES.map(frequency => (
          <label key={frequency} className="frequency-option">
            <input
              type="radio"
              name="readingFrequency"
              value={frequency}
              checked={selectedFrequency === frequency}
              onChange={() => setSelectedFrequency(frequency)}
            />
            {frequency}
          </label>
        ))}
      </div>

      <button 
        onClick={savePreferences}
        className="save-preferences-button"
        disabled={selectedCategories.length === 0}
      >
        Save Preferences
      </button>
    </div>
  );
};

// Optional: Add some basic CSS for the component
const styles = `
<style>
.preferences-selector {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.category-button {
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f4f4f4;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button.selected {
  background-color: #007bff;
  color: white;
}

.frequency-selection {
  margin-top: 20px;
}

.frequency-option {
  margin-right: 15px;
}

.save-preferences-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

.save-preferences-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
`;

// Inject styles into the document
if (!document.getElementById('preferences-selector-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'preferences-selector-styles';
  styleEl.textContent = styles.replace('<style>', '').replace('</style>', '');
  document.head.appendChild(styleEl);
}
