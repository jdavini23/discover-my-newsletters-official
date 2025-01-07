import React, { useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ONBOARDING_STEPS = [
  {
    icon: SparklesIcon,
    title: 'Welcome to Newsletter Discovery',
    description: 'Find the most interesting newsletters tailored to your interests.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Discover Unique Content',
    description: 'Search and filter newsletters across various categories and topics.',
  },
  {
    icon: HeartIcon,
    title: 'Save Your Favorites',
    description: 'Bookmark and track newsletters you love.',
  },
  {
    icon: UserGroupIcon,
    title: 'Join a Community',
    description: 'Connect with other newsletter enthusiasts and get recommendations.',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const CurrentStep = ONBOARDING_STEPS[currentStep];

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
        exit={{ scale: 0.9 }}
        className='bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl'
      >
        <CurrentStep.icon className='mx-auto h-16 w-16 text-primary-600 mb-6' />
        <h2 className='text-2xl font-bold mb-4'>{CurrentStep.title}</h2>
        <p className='text-gray-600 mb-8'>{CurrentStep.description}</p>

        <div className='flex justify-center space-x-4'>
          {currentStep < ONBOARDING_STEPS.length - 1 && (
            <button
              onClick={handleSkip}
              className='px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-full'
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className='px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition'
          >
            {currentStep < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>

        <div className='flex justify-center mt-4 space-x-2'>
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
