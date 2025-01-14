import { Newsletter, NewsletterCategory } from '../types/newsletter';
import { errorLoggingService } from './errorLoggingService';

// Mock data for development
const MOCK_SUBSTACK_NEWSLETTERS: Newsletter[] = [
  {
    id: 'pragmatic-engineer',
    title: 'The Pragmatic Engineer',
    description: 'Deep dives into engineering topics, from scaling systems to growing engineering teams.',
    author: 'Gergely Orosz',
    websiteUrl: 'https://newsletter.pragmaticengineer.com',
    subscribeUrl: 'https://newsletter.pragmaticengineer.com/subscribe',
    categories: ['Technology', 'Programming'],
    tags: ['engineering', 'software development', 'career'],
    subscriberCount: 85000,
    coverImageUrl: 'https://placehold.co/400x400/2196f3/white/png?text=PE'
  },
  {
    id: 'stratechery',
    title: 'Stratechery',
    description: 'Analysis of the strategy and business side of technology and media.',
    author: 'Ben Thompson',
    websiteUrl: 'https://stratechery.com',
    subscribeUrl: 'https://stratechery.com/subscribe',
    categories: ['Technology', 'Business'],
    tags: ['strategy', 'analysis', 'tech industry'],
    subscriberCount: 150000,
    coverImageUrl: 'https://placehold.co/400x400/4caf50/white/png?text=ST'
  },
  {
    id: 'not-boring',
    title: 'Not Boring',
    description: 'Business strategy and trends explained in an entertaining way.',
    author: 'Packy McCormick',
    websiteUrl: 'https://www.notboring.co',
    subscribeUrl: 'https://www.notboring.co/subscribe',
    categories: ['Business', 'Startup'],
    tags: ['strategy', 'startups', 'innovation'],
    subscriberCount: 110000,
    coverImageUrl: 'https://placehold.co/400x400/ff9800/white/png?text=NB'
  },
  {
    id: 'lenny',
    title: "Lenny's Newsletter",
    description: 'A weekly newsletter packed with advice for product, growth, and career builders.',
    author: 'Lenny Rachitsky',
    websiteUrl: 'https://www.lennysnewsletter.com',
    subscribeUrl: 'https://www.lennysnewsletter.com/subscribe',
    categories: ['Startup', 'Personal Development'],
    tags: ['product management', 'growth', 'career'],
    subscriberCount: 200000,
    coverImageUrl: 'https://placehold.co/400x400/9c27b0/white/png?text=LN'
  }
];

class SubstackService {
  private static CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private cache: Map<string, { data: Newsletter[], timestamp: number }> = new Map();

  async getTrendingNewsletters(category?: NewsletterCategory): Promise<Newsletter[]> {
    try {
      const cacheKey = `trending_${category || 'all'}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < SubstackService.CACHE_DURATION) {
        return cached.data;
      }

      // Filter newsletters based on category
      let newsletters = [...MOCK_SUBSTACK_NEWSLETTERS];
      if (category) {
        newsletters = newsletters.filter(newsletter => 
          newsletter.categories.includes(category)
        );
      }

      // Sort by subscriber count
      newsletters.sort((a, b) => 
        (b.subscriberCount || 0) - (a.subscriberCount || 0)
      );

      this.cache.set(cacheKey, {
        data: newsletters,
        timestamp: Date.now()
      });

      return newsletters;
    } catch (error) {
      errorLoggingService.logError('Failed to fetch trending Substack newsletters', error);
      return [];
    }
  }
}

export const substackService = new SubstackService();
export default substackService;
