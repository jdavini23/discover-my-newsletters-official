import React, { useState } from 'react';
import { UserProfile } from '../../types/profile';
import { useUserProfileStore } from '@/stores/userProfileStore';

const NEWSLETTER_TOPICS = [
  'Technology',
  'Science',
  'Business',
  'Startups',
  'Design',
  'Programming',
  'Entrepreneurship',
  'AI',
  'Crypto',
  'Marketing',
];

interface PreferencesSectionProps {
  profile: UserProfile;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ profile }) => {
  const { updateProfile } = useUserProfileStore();
  const [interests, setInterests] = useState(profile.interests || []);
  const [newsletterFrequency, setNewsletterFrequency] = useState(
    profile.newsletterPreferences?.frequency || 'weekly'
  );

  const handleTopicToggle = (topic: string) => {
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSavePreferences = async () => {
    try {
      await updateProfile({
        interests,
        newsletterPreferences: {
          frequency: newsletterFrequency,
          categories: interests,
        },
      });
    } catch (error) {
      console.error('Failed to update preferences', error);
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-6'>Newsletter Preferences</h2>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>Interested Topics</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
          {NEWSLETTER_TOPICS.map((topic) => (
            <label
              key={topic}
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                interests.includes(topic)
                  ? 'bg-blue-100 border border-blue-500'
                  : 'bg-white border border-gray-300'
              }`}
            >
              <input
                type='checkbox'
                checked={interests.includes(topic)}
                onChange={() => handleTopicToggle(topic)}
                className='text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm'>{topic}</span>
            </label>
          ))}
        </div>
        <p className='text-sm text-gray-500 mt-2'>Select up to 5 topics</p>
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>Newsletter Frequency</h3>
        <div className='flex space-x-4'>
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <button
              key={freq}
              onClick={() => setNewsletterFrequency(freq as 'daily' | 'weekly' | 'monthly')}
              className={`px-4 py-2 rounded-md capitalize ${
                newsletterFrequency === freq
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          onClick={handleSavePreferences}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesSection;
