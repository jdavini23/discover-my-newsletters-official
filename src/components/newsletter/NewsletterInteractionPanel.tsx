import React, { useMemo, useCallback } from 'react';
import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { toast } from 'react-hot-toast';

interface NewsletterInteractionPanelProps {
  newsletterId: string;
  isInFavorites: boolean;
  isFavoriting: boolean;
  isSubscribed: boolean;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  subscribeNewsletter: (id: string) => void;
  unsubscribeNewsletter: (id: string) => void;
}

const NewsletterInteractionPanel: React.FC<NewsletterInteractionPanelProps> = ({
  newsletterId,
  isInFavorites,
  isFavoriting,
  isSubscribed,
  addToFavorites,
  removeFromFavorites,
  subscribeNewsletter,
  unsubscribeNewsletter,
}) => {
  const favoriteIcon = useMemo(() => (isInFavorites ? HeartIcon : HeartIcon), [isInFavorites]);

  const handleFavoriteToggle = useCallback(() => {
    if (isInFavorites) {
      removeFromFavorites(newsletterId);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(newsletterId);
      toast.success('Added to favorites');
    }
  }, [isInFavorites, addToFavorites, removeFromFavorites, newsletterId]);

  const handleSubscriptionToggle = useCallback(() => {
    if (isSubscribed) {
      unsubscribeNewsletter(newsletterId);
      toast.success('Unsubscribed');
    } else {
      subscribeNewsletter(newsletterId);
      toast.success('Subscribed');
    }
  }, [isSubscribed, subscribeNewsletter, unsubscribeNewsletter, newsletterId]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(`https://discovermynewsletters.com/newsletters/${newsletterId}`);
    toast.success('Newsletter link copied to clipboard');
  }, [newsletterId]);

  return (
    <div className='flex space-x-4 items-center'>
      <button
        onClick={handleFavoriteToggle}
        disabled={isFavoriting}
        className={`hover:text-red-500 transition-colors ${
          isInFavorites ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        {React.createElement(favoriteIcon, { className: 'w-6 h-6' })}
      </button>
      <button
        onClick={handleSubscriptionToggle}
        className={`hover:text-blue-500 transition-colors ${
          isSubscribed ? 'text-blue-500' : 'text-gray-500'
        }`}
      >
        <ShareIcon className='w-6 h-6' />
      </button>
      <button
        onClick={handleShare}
        className='text-gray-500 hover:text-green-500 transition-colors'
      >
        <ShareIcon className='w-6 h-6' />
      </button>
    </div>
  );
};

export default NewsletterInteractionPanel;
