import { Bookmark, Flame, Share } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from '@/lib/react-hot-toast';
import { NewsletterService } from '@/services/newsletterService';
import { useAuthStore } from '@/stores/authStore';
import { Newsletter } from '@/types';
import { trackEvent } from '@/utils/analytics';

const NewsletterDetailPage: React.FC = () => {
  const { newsletterId } = useParams<{ newsletterId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      if (!newsletterId) {
        setError('No newsletter ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedNewsletters = await NewsletterService.fetchNewsletters({
          searchQuery: newsletterId,
        });

        if (fetchedNewsletters.newsletters.length > 0) {
          setNewsletter(fetchedNewsletters.newsletters[0]);
          trackEvent('newsletter_view', { newsletterId });
        } else {
          setError('Newsletter not found');
          toast.error('Newsletter not found');
          navigate('/newsletters');
        }
      } catch (err) {
        console.error('Error fetching newsletter:', err);
        setError('Failed to fetch newsletter');
        toast.error('Failed to load newsletter');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [newsletterId, navigate]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div>Loading newsletter details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500'>{error}</div>
    );
  }

  if (!newsletter) {
    return null;
  }

  const handleBookmark = () => {
    // Implement bookmark functionality
    toast.success('Newsletter bookmarked');
  };

  const handleShare = () => {
    // Implement share functionality
    toast.success('Newsletter link copied');
  };

  return (
    <div>
      <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden'>
        {/* Newsletter header */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            {newsletter.title}
          </h1>
          <div className='flex items-center space-x-4 text-gray-600 dark:text-gray-400'>
            <span>{newsletter.author}</span>
            <span>•</span>
            <span>{new Date(newsletter.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Newsletter content */}
        <div className='p-6'>
          <div
            className='prose dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: newsletter.content || '' }}
          />
        </div>

        {/* Actions */}
        <div className='p-6 bg-gray-50 dark:bg-gray-900 flex justify-between items-center'>
          <div className='flex space-x-4'>
            <button
              onClick={handleBookmark}
              className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500'
            >
              <Bookmark className='h-5 w-5' />
              <span>Bookmark</span>
            </button>
            <button
              onClick={handleShare}
              className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500'
            >
              <Share className='h-5 w-5' />
              <span>Share</span>
            </button>
          </div>
          <button
            onClick={() => {}}
            className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500'
          >
            <Flame className='h-5 w-5' />
            <span>Trending</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterDetailPage;
