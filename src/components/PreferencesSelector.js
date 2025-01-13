import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNewsletters } from '../contexts/NewsletterContext';
const ALL_CATEGORIES = [
    'Technology', 'Design', 'Startup', 'Programming', 'Marketing',
    'Finance', 'Science', 'Art', 'Writing', 'Entrepreneurship',
    'Personal Development', 'Health', 'Travel', 'Food', 'Music',
    'Sports', 'Politics', 'Environment', 'Education'
];
const READING_FREQUENCIES = [
    'Daily', 'Weekly', 'Bi-Weekly', 'Monthly'
];
export const PreferencesSelector = () => {
    const { userPreferences, setUserPreferences, updatePreferredCategories, fetchRecommendations } = useNewsletters();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState('Weekly');
    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev => prev.includes(category)
            ? prev.filter(cat => cat !== category)
            : [...prev, category]);
    };
    // Save preferences
    const savePreferences = () => {
        if (selectedCategories.length === 0) {
            alert('Please select at least one category');
            return;
        }
        const newPreferences = {
            userId: 'current-user',
            preferredCategories: selectedCategories,
            readingFrequency: selectedFrequency
        };
        setUserPreferences(newPreferences);
        updatePreferredCategories(selectedCategories);
        fetchRecommendations();
    };
    return (_jsxs("div", { className: "preferences-selector", children: [_jsx("h2", { children: "Select Your Newsletter Interests" }), _jsxs("div", { className: "category-selection", children: [_jsx("h3", { children: "Choose Categories" }), _jsx("div", { className: "category-grid", children: ALL_CATEGORIES.map(category => (_jsx("button", { onClick: () => toggleCategory(category), className: `category-button ${selectedCategories.includes(category) ? 'selected' : ''}`, children: category }, category))) })] }), _jsxs("div", { className: "frequency-selection", children: [_jsx("h3", { children: "Reading Frequency" }), READING_FREQUENCIES.map(frequency => (_jsxs("label", { className: "frequency-option", children: [_jsx("input", { type: "radio", name: "readingFrequency", value: frequency, checked: selectedFrequency === frequency, onChange: () => setSelectedFrequency(frequency) }), frequency] }, frequency)))] }), _jsx("button", { onClick: savePreferences, className: "save-preferences-button", disabled: selectedCategories.length === 0, children: "Save Preferences" })] }));
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
