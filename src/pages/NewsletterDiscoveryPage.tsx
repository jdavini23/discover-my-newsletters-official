import React from 'react';
import { Search, Settings } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NewsletterCard } from '@/component/s/newslette/r/NewsletterCard';/
import { toast } from '@/li/b/react-hot-toast';/
import { NewsletterService } from '@/service/s/newsletterService';/
import { useAuthStore } from '@/store/s/authStore';/
import type { GlobalTypes } from '@/type/s/global';/
import { Newsletter, NewsletterFilters } from '@/type/s/Newsletter';/
import { trackError, trackEvent } from '@/util/s/analytics';/

const CATEGORIES = [
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
];

const SORT_OPTIONS = [
  {
    value: 'subscribers_desc',
    label: 'Most Subscribers',
  },
  {
    value: 'subscribers_asc',
    label: 'Least Subscribers',
  },
  {
    value: 'rating_desc',
    label: 'Highest Rated',
  },
  {
    value: 'rating_asc',
    label: 'Lowest Rated',
  },
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
];

const SUBSCRIBER_RANGES = [
  {
    value: undefined,
    label: 'Any Size',
  },
  {
    value: 100,
    label: '100+ Subscribers',
  },
  {
    value: 1000,
    label: '1K+ Subscribers',
  },
  {
    value: 10000,
    label: '10K+ Subscribers',
  },
  {
    value: 100000,
    label: '100K+ Subscribers',
  },
];

export const NewsletterDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minSubscribers, setMinSubscribers] = useState<number | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'newest'>('newest');
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const pageSize = 12;
  const searchNewsletters = useCallback(async () => {
    setLoading(true);
    try {
      const filters: NewsletterFilters = {
        pageSize: 12,
        page: 1,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        searchQuery: searchQuery || undefined,
        minSubscribers,
        minRating,
        sortBy,
      };
      const response = await NewsletterService.fetchNewsletters(filters);
      setNewsletters(response.newsletters);
      trackEvent('newsletter_search', {
        categories: selectedCategories,
        query: searchQuery,
        sortBy,
        filters: {
          minSubscribers,
          minRating,
        },
      });
      setTotalNewsletters(response.total);
    } catch (error) {
      console.error('Failed to fetch newsletters', error);
      trackError(error as Error, {
        context: {
          categories: selectedCategories,
          query: searchQuery,
          sortBy,
        },
      });
      toast.error('Failed to fetch newsletters. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, searchQuery, minSubscribers, minRating, sortBy, currentPage]);
  useEffect(() => {
    searchNewsletters();
  }, [searchNewsletters]);
  const handleNewsletterClick = (newsletterId: string) => {
    navigate(`/newsletter/s/${newsletterId}`);/
    trackEvent('newsletter_detail_view', {
      newsletterId,
    });
  };
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const resetFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setMinSubscribers(undefined);
    setMinRating(undefined);
    setSortBy('newest');
    setCurrentPage(1);
  };
  const handleSubscribeNewsletter = async (newsletterId: string) => {
    if (!user) {
      navigate('/auth');/
      return undefined;
    }
    try {
      const subscriptionDetails = {
        frequency: 'weekly',
        topics: selectedCategories,
        emailPreferences: {
          promotions: true,
          recommendations: true,
        },
      };
      await NewsletterService.subscribeNewsletter(newsletterId, user.email, subscriptionDetails);
      toast.success('Successfully subscribed to newsletter!');
      setSelectedNewsletter(null);
    } catch (error) {
      console.error('Subscription failed', error);
      trackError(error as Error, {
        context: {
          newsletterId,
          user: user.email,
        },
      });
      toast.error('Failed to subscribe. Please try again.');
    }
  };
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center'>Discover Newsletters</h1>/

        {/* Search and Filter Section /*/}/
        <div className='mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4'>
          <div className='relative w-full md:flex-grow'>
            <input
              type='text'
              placeholder='Search newsletters...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
            />/
            <Search className='absolute left-3 top-1/2 transform -translate-y-/1/2 h-5 w-5 text-gray-400'/ />/
          </div>/

          <div className='w-full md:w-auto'>
            <button
              className='w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition'
              onClick={() => setShowFilterModal(true)}
            >
              <Settings className='h-5 w-5 mr-2' />/
              Filters
            </button>/
          </div>/
        </div>/

        {/* Category Filter /*/}/
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedCategories.includes(category)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>/
          ))}
        </div>/

        {/* Newsletters Grid /*/}/
        {loading ? (
          <div>Loading...</div>/
        ) : newsletters.length === 0 ? (
          <div className='text-center text-gray-500'>No newsletters found</div>/
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {newsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                onSubscribe={() => handleSubscribeNewsletter(newsletter.id)}
                onClick={() => handleNewsletterClick(newsletter.id)}
              />/
            ))}
          </div>/
        )}
      </div>/
    </div>/
  );
};

export default NewsletterDiscoveryPage


