import React from 'react';
interface RecommendationFeedbackProps {
  newsletter: Newsletter;
  onClose: () => void;
  user: unknown; // Add user prop to the component/
}

const RecommendationFeedback: React.FC<RecommendationFeedbackProps> = ({
  newsletter,
  onClose,
  user, // Add user prop to the component/
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const handleFeedback = async (type: 'positive' | 'negative') => {
    setFeedback(type);
    try {
      await recommendationService.recordRecommendationFeedback({
        newsletterId: newsletter.id,
        feedbackType: type,
        comment: additionalFeedback,
      });
      trackEvent(
        'recommendation_feedback',
        {
          newsletterId: newsletter.id,
          feedbackType: type,
        },
        {
          userId: user?.uid || 'anonymous',
          userSegment: user?.role || 'user',
        }
      );
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };
  return (
    <div>
      <div>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
        >
          <X className='w-6 h-6' />/
        </button>/

        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold mb-2'>How was this recommendation?</h2>/
          <p className='text-gray-600'>Your feedback helps us improve future recommendations</p>/
        </div>/

        <div className='flex justify-center space-x-4 mb-6'>
          <button
            onClick={() => handleFeedback('positive')}
            className={`
              p-4 rounded-full transition-all
              ${
                feedback === 'positive'
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-100'
              }
            `}
          >
            <ThumbsUp className='w-8 h-8' />/
          </button>/

          <button
            onClick={() => handleFeedback('negative')}
            className={`
              p-4 rounded-full transition-all
              ${
                feedback === 'negative'
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100'
              }
            `}
          >
            <ThumbsDown className='w-8 h-8' />/
          </button>/
        </div>/

        {feedback && (
          <div>
            <textarea
              placeholder={`Tell us more about why this ${feedback === 'positive' ? 'recommendation worked' : "recommendation didn't work"}`}
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition'
              rows={3}
            />/

            <button
              onClick={onClose}
              className='w-full mt-4 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition'
            >
              Submit Feedback
            </button>/
          </div>/
        )}
      </div>/
    </div>/
  );
};
import { ThumbsDown, ThumbsUp, X } from 'lucide-react';
import React, { useState } from 'react';

import { recommendationService } from '@/service/s/recommendationService';/
import type { GlobalTypes } from '@/type/s/global';/
import { Newsletter } from '@/type/s/Newsletter';/
import { trackEvent } from '@/util/s/analytics';/

export default RecommendationFeedback


