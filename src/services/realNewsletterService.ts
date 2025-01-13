import axios from 'axios';
import { Newsletter, NewsletterCategory, NewsletterFilter } from '../types/newsletter';
import { rssFeedService } from './rssFeedService';

// Hardcoded mock newsletters for development
const MOCK_NEWSLETTERS: Newsletter[] = [
  {
    id: 'tech-crunch-newsletter',
    title: 'TechCrunch Daily',
    description: 'The latest technology news and startup insights',
    author: 'TechCrunch Team',
    websiteUrl: 'https://techcrunch.com',
    subscribeUrl: 'https://techcrunch.com/newsletter',
    categories: ['Technology', 'Startup'],
    tags: ['tech', 'startup', 'innovation'],
    subscriberCount: 500000,
    coverImageUrl: 'https://example.com/techcrunch-logo.png'
  },
  {
    id: 'morning-brew',
    title: 'Morning Brew',
    description: 'Daily business newsletter with top headlines',
    author: 'Morning Brew',
    websiteUrl: 'https://morningbrew.com',
    subscribeUrl: 'https://morningbrew.com/subscribe',
    categories: ['Business', 'Finance', 'Entrepreneurship'],
    tags: ['business', 'finance', 'economy'],
    subscriberCount: 2500000,
    coverImageUrl: 'https://example.com/morning-brew-logo.png'
  },
  {
    id: 'dev-bytes',
    title: 'Dev Bytes',
    description: 'Weekly programming and software development insights',
    author: 'Dev Community',
    websiteUrl: 'https://devbytes.com',
    subscribeUrl: 'https://devbytes.com/subscribe',
    categories: ['Programming', 'Technology'],
    tags: ['coding', 'software', 'development'],
    subscriberCount: 250000,
    coverImageUrl: 'https://example.com/dev-bytes-logo.png'
  }
];

export class RealNewsletterService {
  private apiKey?: string;

  constructor() {
    // Note: In a real app, use environment variables or secure key management
    this.apiKey = import.meta.env.VITE_RAPID_API_KEY;
  }

  async fetchNewsletters(filter?: NewsletterFilter): Promise<Newsletter[]> {
    try {
      // Fetch newsletters from RSS feeds
      let newsletters = await rssFeedService.fetchNewsletters(filter?.category);

      // Apply additional client-side filtering
      return newsletters.filter(newsletter => {
        // Category filter
        if (filter?.category && !newsletter.categories.includes(filter.category)) return false;

        // Tags filter
        if (filter?.tags && !filter.tags.some(tag => 
          newsletter.tags.includes(tag) || 
          newsletter.title.toLowerCase().includes(tag.toLowerCase())
        )) return false;

        // Search term filter
        if (filter?.searchTerm) {
          const searchTerm = filter.searchTerm.toLowerCase();
          return (
            newsletter.title.toLowerCase().includes(searchTerm) ||
            newsletter.description.toLowerCase().includes(searchTerm)
          );
        }

        return true;
      });
    } catch (error) {
      console.error('Error fetching real newsletters:', error);
      return [];
    }
  }

  async getNewsletterById(id: string): Promise<Newsletter | null> {
    try {
      return await rssFeedService.getNewsletterById(id);
    } catch (error) {
      console.error(`Error fetching newsletter ${id}:`, error);
      return null;
    }
  }

  // Optional: Implement actual API call when RapidAPI key is available
  private async fetchFromRapidAPI(filter?: NewsletterFilter): Promise<Newsletter[]> {
    try {
      if (!this.apiKey) {
        console.warn('No RapidAPI key provided. Using mock data.');
        return this.fetchNewsletters(filter);
      }

      const response = await axios.get('https://newsletter-api.p.rapidapi.com/newsletters', {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'newsletter-api.p.rapidapi.com'
        },
        params: {
          category: filter?.category,
          tags: filter?.tags?.join(','),
          minSubscribers: filter?.minSubscribers,
          search: filter?.searchTerm
        }
      });

      return response.data.newsletters.map(this.mapToInternalNewsletter);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      return [];
    }
  }

  private mapToInternalNewsletter(externalNewsletter: any): Newsletter {
    return {
      id: externalNewsletter.id || crypto.randomUUID(),
      title: externalNewsletter.name,
      description: externalNewsletter.description || '',
      author: externalNewsletter.author || 'Unknown',
      websiteUrl: externalNewsletter.websiteUrl || '',
      subscribeUrl: externalNewsletter.subscribeUrl,
      categories: this.mapCategories(externalNewsletter.categories),
      tags: externalNewsletter.tags || [],
      subscriberCount: externalNewsletter.subscriberCount,
      coverImageUrl: externalNewsletter.coverImageUrl
    };
  }

  private mapCategories(externalCategories: string[]): NewsletterCategory[] {
    const CATEGORY_MAPPING: Record<string, NewsletterCategory> = {
      'Technology': 'Technology',
      'Startup': 'Startup',
      'Business': 'Entrepreneurship',
      'Programming': 'Programming',
      'Design': 'Design',
      'Marketing': 'Marketing',
      'Finance': 'Finance',
      'Science': 'Science',
      'Writing': 'Writing',
      'Health': 'Health',
      'Politics': 'Politics',
      'Other': 'Other'
    };

    if (!externalCategories) return ['Other'];
    
    return externalCategories
      .map(cat => CATEGORY_MAPPING[cat] || 'Other')
      .filter((cat, index, self) => self.indexOf(cat) === index);
  }
}

export const realNewsletterService = new RealNewsletterService();
