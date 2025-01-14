import axios from 'axios';
import { Newsletter, NewsletterCategory } from '../types/newsletter';
import { errorLoggingService } from './errorLoggingService';
import { analyticsService } from '../firebaseConfig';

// Interface definitions
interface RSSSource {
  url: string;
  category: string;
  backupUrls?: string[];
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

interface RSSFeed {
  items: RSSItem[];
}

interface ParsedRSSFeed {
  title: string;
  description: string;
  items: RSSItem[];
}

class RSSFeedService {
  private PROXY_URLS = [
    'https://api.allorigins.win/raw',
    'https://cors-anywhere.herokuapp.com/'
  ];
  static RSS_SOURCES: any;

  private async fetchWithProxy(url: string, proxyIndex = 0): Promise<string> {
    if (proxyIndex >= this.PROXY_URLS.length) {
      throw new Error('All proxy services failed');
    }

    try {
      const response = await axios.get(`${this.PROXY_URLS[proxyIndex]}?url=${encodeURIComponent(url)}`, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8'
        },
        timeout: 15000 // Increased timeout to 15 seconds
      });

      return response.data;
    } catch (error) {
      console.warn(`Proxy ${this.PROXY_URLS[proxyIndex]} failed for ${url}:`, error);
      return this.fetchWithProxy(url, proxyIndex + 1);
    }
  }

  async fetchRSSFeed(source: RSSSource): Promise<ParsedRSSFeed | null> {
    // Validate and sanitize URL
    const sanitizedUrl = this.sanitizeUrl(source.url);
    if (!sanitizedUrl) {
      console.error(`Invalid URL: ${source.url}`);
      return null;
    }

    const urlsToTry = [sanitizedUrl, ...(source.backupUrls || []).map(this.sanitizeUrl).filter(Boolean)];

    for (const url of urlsToTry) {
      try {
        const rawXml = await this.fetchWithProxy(url);
        
        // Basic XML parsing
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rawXml, 'text/xml');
        
        const title = xmlDoc.querySelector('title')?.textContent || 'Untitled Feed';
        const description = xmlDoc.querySelector('description')?.textContent || '';
        const items: RSSItem[] = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || 'Untitled',
          link: item.querySelector('link')?.textContent || '',
          description: item.querySelector('description')?.textContent || 'No description',
          pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString()
        })).slice(0, 5); // Limit to first 5 items

        const filteredItems = items.filter(item => 
          item.title !== 'Untitled' && 
          item.link && 
          item.title.length > 0
        );

        if (filteredItems.length > 0) {
          return { 
            title,
            description,
            items: filteredItems
          };
        }
      } catch (error) {
        console.error(`Error fetching RSS feed from ${url}:`, error);
        // Continue to next URL if available
        continue;
      }
    }

    // Log if all URLs failed
    console.error(`Failed to fetch RSS feed for source: ${source.url}`);
    return null;
  }

  private sanitizeUrl(url?: string): string | null {
    if (!url) return null;

    // Remove any interpolated strings or unexpected characters
    const cleanUrl = url.replace(/\[.*?\]/g, '').trim();

    // Basic URL validation
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch {
      console.error(`Invalid URL: ${cleanUrl}`);
      return null;
    }
  }

  async fetchMultipleRSSFeeds(sources: RSSSource[]): Promise<ParsedRSSFeed[]> {
    const fetchPromises = sources.map(source => this.fetchRSSFeed(source));
    
    const results = await Promise.allSettled(fetchPromises);
    
    const validFeeds = results
      .filter((result): result is PromiseFulfilledResult<ParsedRSSFeed> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    if (validFeeds.length === 0) {
      await errorLoggingService.logError(
        new Error('No RSS feeds could be retrieved'), 
        { context: 'RSS Feed Retrieval', sources }
      );
    }

    return validFeeds;
  }

  async fetchNewsletters(category?: NewsletterCategory): Promise<Newsletter[]> {
    try {
      // If a category is specified, filter newsletters
      const sources = category
        ? RSSFeedService.RSS_SOURCES.filter(source => source.category === category)
        : RSSFeedService.RSS_SOURCES;

      const feeds = await this.fetchMultipleRSSFeeds(
        sources.map(source => ({ url: source.url, category: source.category, backupUrls: source.backupUrls }))
      );

      return feeds.map(feed => ({
        id: feed.items[0].title,
        title: feed.title,
        description: feed.description,
        author: feed.title, // Use feed title as author for now
        websiteUrl: feed.items[0].link,
        categories: ['Technology'], // Default to Technology category
        tags: [], // No tags for now
        coverImageUrl: '', // Optional, can be updated later
        subscribeUrl: feed.items[0].link
      }));
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      return [];
    }
  }

  async getNewsletterById(id: string): Promise<Newsletter | null> {
    const sources = RSSFeedService.RSS_SOURCES;
    const source = sources.find((s: { url: string; }) => s.url === id);
    if (!source) return null;

    const feed = await this.fetchRSSFeed(source);
    if (!feed) return null;

    return {
      id: feed.items[0].title,
      title: feed.title,
      description: feed.description,
      author: feed.title, // Use feed title as author for now
      websiteUrl: feed.items[0].link,
      categories: [source.category as NewsletterCategory], // Use source category
      tags: [], // No tags for now
      coverImageUrl: '', // Optional, can be updated later
      subscribeUrl: feed.items[0].link
    };
  }

  private async logRSSSourceIssues(url: string, category: string, error: any): Promise<void> {
    await errorLoggingService.logError(error, {
      context: 'RSS Feed Fetch',
      url,
      category,
      errorType: error.name,
      errorMessage: error.message
    });
  }
}

// Newsletter RSS sources
RSSFeedService.RSS_SOURCES = [
  {
    url: 'https://blog.pragmaticengineer.com/rss/',
    category: 'Technology',
    backupUrls: ['https://blog.pragmaticengineer.com/rss/backup']
  },
  {
    url: 'https://jamesclear.com/feed',
    category: 'Productivity'
  },
  {
    url: 'https://stratechery.com/feed/',
    category: 'Technology'
  },
  {
    url: 'https://fs.blog/feed/',
    category: 'Productivity'
  },
  {
    url: 'https://medium.com/feed/@copyconstruct',
    category: 'Technology'
  }
];

export { RSSFeedService };
export const rssFeedService = new RSSFeedService();
export default rssFeedService;
