import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { realNewsletterService } from '../services/realNewsletterService';
import { newsletterService } from '../services/newsletterService';
import { Newsletter, NewsletterFilter } from '../types/newsletter';
import { NewsletterCategory, NEWSLETTER_CATEGORIES } from '../constants/categories';

const NEWSLETTERS_PER_PAGE = 10;

const NewsletterDiscovery: React.FC = () => {
  const [newsletters, setNewsletters] = React.useState<Newsletter[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = React.useState<Newsletter[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState<NewsletterFilter>({
    category: undefined,
    searchTerm: ''
  });
  const [loading, setLoading] = React.useState(true);
  const { currentUser } = useAuth();

  // Pagination logic
  const totalPages = Math.ceil(filteredNewsletters.length / NEWSLETTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * NEWSLETTERS_PER_PAGE;
  const endIndex = startIndex + NEWSLETTERS_PER_PAGE;

  React.useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        // First, try to get real newsletters
        const realNewsletters = await realNewsletterService.fetchNewsletters(filter);
        
        // If no real newsletters, fall back to mock data
        if (realNewsletters.length === 0) {
          const mockNewsletters = await newsletterService.fetchNewsletters(filter);
          setNewsletters(mockNewsletters);
        } else {
          setNewsletters(realNewsletters);
        }
        applyFilters(newsletters);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
        // Fallback to local newsletters if real newsletter fetch fails
        const mockNewsletters = await newsletterService.fetchNewsletters(filter);
        setNewsletters(mockNewsletters);
        applyFilters(mockNewsletters);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [filter]);

  const applyFilters = (newsletterList: Newsletter[]) => {
    let result = newsletterList;

    if (filter.category) {
      result = result.filter(newsletter => 
        newsletter.categories.includes(filter.category!)
      );
    }

    if (filter.searchTerm) {
      result = result.filter(newsletter => 
        newsletter.title.toLowerCase().includes(filter.searchTerm!.toLowerCase()) ||
        newsletter.description.toLowerCase().includes(filter.searchTerm!.toLowerCase())
      );
    }

    setFilteredNewsletters(result);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: NewsletterCategory) => {
    setFilter(prev => ({ 
      ...prev, 
      category: prev.category === category ? undefined : category 
    }));
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, searchTerm: event.target.value }));
  };

  const handleSubscribe = async (newsletter: Newsletter) => {
    if (!currentUser) {
      // TODO: Implement login prompt or redirect
      return;
    }

    try {
      // Record user interaction
      await newsletterService.recordUserInteraction({
        newsletterId: newsletter.id,
        userId: currentUser.uid,
        interactionType: 'subscribe',
        timestamp: new Date()
      });

      // Optional: Open subscribe URL
      if (newsletter.subscribeUrl) {
        window.open(newsletter.subscribeUrl, '_blank');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  if (loading) {
    return <div>Loading newsletters...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Discover Newsletters</h1>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search newsletters..." 
          value={filter.searchTerm || ''} 
          onChange={handleSearchTermChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {NEWSLETTER_CATEGORIES.map(category => (
          <button 
            key={category} 
            onClick={() => handleCategoryFilter(category)}
            className={`px-3 py-1 rounded ${
              filter.category === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNewsletters.slice(startIndex, endIndex).map(newsletter => (
          <div 
            key={newsletter.id} 
            className="border rounded p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            {newsletter.coverImageUrl && (
              <img 
                src={newsletter.coverImageUrl} 
                alt={`${newsletter.title} logo`} 
                className="w-full h-40 object-cover mb-4 rounded" 
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{newsletter.title}</h2>
            <p className="text-gray-600 mb-2">{newsletter.description}</p>
            <div className="text-sm text-gray-500 mb-2">
              <div>Subscribers: {newsletter.subscriberCount?.toLocaleString() || 'N/A'}</div>
              <div>Categories: {newsletter.categories.join(', ')}</div>
            </div>
            <button 
              onClick={() => handleSubscribe(newsletter)}
              disabled={!currentUser}
              className={`w-full py-2 rounded ${
                currentUser 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentUser ? 'Subscribe' : 'Login to Subscribe'}
            </button>
          </div>
        ))}
      </div>

      {filteredNewsletters.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No newsletters found. Try adjusting your filters.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsletterDiscovery;
