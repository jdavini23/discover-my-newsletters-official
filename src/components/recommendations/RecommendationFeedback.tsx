import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ThumbUpIcon, 
  ThumbDownIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

import { Newsletter } from '@/types/Newsletter';
import { recommendationService } from '@/services/recommendationService';
import { trackEvent } from '@/utils/analytics';

interface RecommendationFeedbackProps {
  newsletter: Newsletter;
  onClose: () => void;
}

export const RecommendationFeedback: React.FC<RecommendationFeedbackProps> = ({ 
  newsletter, 
  onClose 
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const handleFeedback = async (type: 'positive' | 'negative') => {
    setFeedback(type);
    
    try {
      await recommendationService.recordRecommendationFeedback({
        newsletterId: newsletter.id,
        feedbackType: type,
        comment: additionalFeedback
      });

      trackEvent('recommendation_feedback', { 
        newsletterId: newsletter.id, 
        feedbackType: type 
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">How was this recommendation?</h2>
          <p className="text-gray-600">Your feedback helps us improve future recommendations</p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleFeedback('positive')}
            className={`
              p-4 rounded-full transition-all
              ${feedback === 'positive' 
                ? 'bg-green-500 text-white scale-110' 
                : 'bg-gray-100 text-gray-600 hover:bg-green-100'}
            `}
          >
            <ThumbUpIcon className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => handleFeedback('negative')}
            className={`
              p-4 rounded-full transition-all
              ${feedback === 'negative' 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-gray-100 text-gray-600 hover:bg-red-100'}
            `}
          >
            <ThumbDownIcon className="w-8 h-8" />
          </button>
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <textarea
              placeholder={`Tell us more about why this ${feedback === 'positive' ? 'recommendation worked' : 'recommendation didn\'t work'}`}
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition"
              rows={3}
            />
            
            <button
              onClick={onClose}
              className="w-full mt-4 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition"
            >
              Submit Feedback
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
