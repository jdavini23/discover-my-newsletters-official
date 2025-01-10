import { Bookmark, RefreshCw, Share, Star } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RecommendationFeedback } from '@/components/recommendations/RecommendationFeedback';
import { recommendationService } from '@/services/recommendationService';
import { useAuthStore } from '@/stores/authStore';
import { Newsletter } from '@/types/Newsletter';
import { trackEvent } from '@/utils/analytics';

const RecommendationCard: React.FC<{
  newsletter: Newsletter;
  onInteract: (type: 'like' | 'save' | 'share') => void;
}> = ({ newsletter, onInteract }) => {
  return (
    <div>
      <div className='p-6'>
        <div className='flex items-start mb-4'>
          <img
            src={newsletter.imageUrl || '/default-newsletter-icon.svg'}
            alt={`${newsletter.title} logo`}
            className='w-16 h-16 rounded-lg mr-4 object-cover'
          />
          <div>
            <h3 className='text-xl font-bold text-gray-900'>{newsletter.title}</h3>
            <p className='text-sm text-gray-500'>{newsletter.author}</p>
          </div>
        </div>

        <p className='text-gray-600 mb-4 line-clamp-3'>{newsletter.description}</p>

        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2 text-gray-600'>
            <Star className='w-5 h-5 text-yellow-500' />
            <span>{newsletter.rating !== undefined ? newsletter.rating.toFixed(1) : 'N/A'}</span>
            <span>•</span>
            <span>
              {newsletter.subscribers !== undefined
                ? newsletter.subscribers.toLocaleString()
                : 'N/A'}{' '}
              subscribers
            </span>
          </div>

          <div className='flex space-x-2'>
            <button
              onClick={() => onInteract('like')}
              className='p-2 hover:bg-gray-100 rounded-full transition'
            >
              <Star className='w-5 h-5 text-gray-500 hover:text-yellow-500' />
            </button>
            <button
              onClick={() => onInteract('save')}
              className='p-2 hover:bg-gray-100 rounded-full transition'
            >
              <Bookmark className='w-5 h-5 text-gray-500 hover:text-primary-500' />
            </button>
            <button
              onClick={() => onInteract('share')}
              className='p-2 hover:bg-gray-100 rounded-full transition'
            >
              <Share className='w-5 h-5 text-gray-500 hover:text-green-500' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendationsPage = () => {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setError('Please log in to see recommendations');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const initialRecommendations = await recommendationService.generateRecommendations({
          userId: user.uid,
          limit: 10,
        });

        setRecommendations(initialRecommendations);
        trackEvent(
          'recommendations_loaded',
          { count: initialRecommendations.length },
          {
            userId: user.uid,
            userSegment: user.role || 'user',
          }
        );
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        setError('Unable to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleInteraction = (newsletter: Newsletter, type: 'like' | 'save' | 'share') => {
    trackEvent(`newsletter_${type}`, { newsletterId: newsletter.id });
    setSelectedNewsletter(newsletter);
    setFeedbackModalOpen(true);
  };

  const handleRefreshRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const refreshedRecommendations = await recommendationService.generateRecommendations({
        userId: user.uid,
        limit: 10,
        forceRefresh: true,
      });

      setRecommendations(refreshedRecommendations);
      trackEvent('recommendations_refreshed');
    } catch (err) {
      console.error('Failed to refresh recommendations:', err);
      setError('Unable to refresh recommendations.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-primary-500'></div>
      </div>
    );
  }

  if (error) {
    return <div className='flex justify-center items-center h-screen text-red-500'>{error}</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Your Recommendations</h1>
          <button
            onClick={handleRefreshRecommendations}
            className='flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition'
          >
            <RefreshCw className='w-5 h-5' />
            <span>Refresh</span>
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div>
            <p className='text-xl text-gray-600'>
              No recommendations found. Try adjusting your preferences!
            </p>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recommendations.map((newsletter, index) => (
              <RecommendationCard
                key={newsletter.id || `newsletter-${index}`}
                newsletter={newsletter}
                onInteract={(type) => handleInteraction(newsletter, type)}
              />
            ))}
          </div>
        )}

        {feedbackModalOpen && selectedNewsletter && (
          <RecommendationFeedback
            newsletter={selectedNewsletter}
            onClose={() => setFeedbackModalOpen(false)}
            user={user}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default RecommendationsPage;
