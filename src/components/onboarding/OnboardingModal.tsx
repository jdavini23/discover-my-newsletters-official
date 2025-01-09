import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Heart, UserGroupIcon, CheckIcon } from 'lucide-react';

import { ReadingFrequency, ContentDepth } from '@/types/profile';

import { useAuthStore } from '@/stores/authStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { recommendationService } from '@/services/recommendationService';

const NEWSLETTER_CATEGORIES = [
  'Technology',
  'Science',
  'Business',
  'Design',
  'Health',
  'Finance',
  'Environment',
  'AI',
  'Startups',
  'Innovation',
  'Culture',
  'Politics',
];

const READING_FREQUENCIES = [
  { value: ReadingFrequency.DAILY, label: 'Daily' },
  { value: ReadingFrequency.WEEKLY, label: 'Weekly' },
  { value: ReadingFrequency.MONTHLY, label: 'Monthly' },
];

const CONTENT_DEPTHS = [
  {
    value: ContentDepth.QUICK_INSIGHTS,
    label: 'Quick Insights',
    description: 'Summaries and key takeaways',
  },
  {
    value: ContentDepth.DEEP_DIVE,
    label: 'Deep Dive',
    description: 'Comprehensive, in-depth content',
  },
];

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const { updateUserProfile } = useUserProfileStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [readingFrequency, setReadingFrequency] = useState<ReadingFrequency | null>(null);
  const [contentDepth, setContentDepth] = useState<ContentDepth | null>(null);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission
      if (user && selectedCategories.length && readingFrequency && contentDepth) {
        updateUserProfile({
          onboarding: {
            isOnboardingComplete: true,
            selectedCategories,
            readingFrequency,
            contentPreferences: {
              depth: contentDepth,
              formats: ['newsletter'],
            },
            lastOnboardingUpdate: new Date(),
          },
        });

        // Generate initial recommendations
        recommendationService.generateInitialRecommendations(user.uid, {
          categories: selectedCategories,
          readingFrequency,
          contentDepth,
        });

        onClose();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-4'>Welcome to Newsletter Discovery</h2>
            <p className='text-gray-600 mb-6'>Let's personalize your newsletter experience</p>
            <div className='flex justify-center space-x-4'>
              {[Sparkles, Search, Heart, UserGroupIcon].map((Icon, idx) => (
                <Icon key={idx} className='w-12 h-12 text-primary-500 opacity-50' />
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className='text-2xl font-bold mb-4'>Select Your Interests</h2>
            <div className='grid grid-cols-3 gap-2'>
              {NEWSLETTER_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`
                    px-3 py-2 rounded-lg transition-all
                    ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className='text-2xl font-bold mb-4'>Reading Frequency</h2>
            <div className='space-y-2'>
              {READING_FREQUENCIES.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setReadingFrequency(freq.value)}
                  className={`
                    w-full px-4 py-3 rounded-lg text-left transition-all
                    ${
                      readingFrequency === freq.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className='text-2xl font-bold mb-4'>Content Depth Preference</h2>
            <div className='space-y-2'>
              {CONTENT_DEPTHS.map((depth) => (
                <button
                  key={depth.value}
                  onClick={() => setContentDepth(depth.value)}
                  className={`
                    w-full px-4 py-3 rounded-lg text-left transition-all
                    ${
                      contentDepth === depth.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <div className='font-semibold'>{depth.label}</div>
                      <div className='text-sm opacity-70'>{depth.description}</div>
                    </div>
                    {contentDepth === depth.value && <CheckIcon className='w-6 h-6' />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className='bg-white rounded-xl p-8 w-full max-w-md shadow-2xl'
      >
        <div className='mb-6'>{renderStep()}</div>

        <div className='flex justify-between mt-6'>
          {currentStep > 0 && (
            <button onClick={handleBack} className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg'>
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && selectedCategories.length === 0) ||
              (currentStep === 2 && !readingFrequency) ||
              (currentStep === 3 && !contentDepth)
            }
            className={`
              px-4 py-2 rounded-lg transition-all
              ${
                (currentStep === 1 && selectedCategories.length === 0) ||
                (currentStep === 2 && !readingFrequency) ||
                (currentStep === 3 && !contentDepth)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }
            `}
          >
            {currentStep < 3 ? 'Next' : 'Complete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
