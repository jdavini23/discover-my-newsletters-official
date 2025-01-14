import React, { useState, useEffect } from 'react';
import { rssFeedService } from '../services/rssFeedService';
import { errorLoggingService } from '../services/errorLoggingService';

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
}

export const RSSFeedDemo: React.FC = () => {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Predefined RSS sources for demonstration
  const RSS_SOURCES = [
    { 
      url: 'https://www.techmeme.com/feed.xml', 
      category: 'Technology' 
    },
    { 
      url: 'https://news.ycombinator.com/rss', 
      category: 'Startup' 
    }
  ];

  useEffect(() => {
    const fetchRSSFeeds = async () => {
      try {
        setLoading(true);
        
        // Fetch multiple RSS feeds
        const results = await rssFeedService.fetchMultipleRSSFeeds(RSS_SOURCES);
        
        setFeeds(results);
        
        // Log successful feed retrieval
        results.forEach((feed, index) => {
          errorLoggingService.logEvent('rss_feed_retrieved', {
            source: RSS_SOURCES[index].url,
            itemCount: feed.items?.length || 0
          });
        });
      } catch (err) {
        // Log and display any errors
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        
        errorLoggingService.logError(err as Error, {
          context: 'RSS Feed Retrieval Demo',
          sources: RSS_SOURCES.map(source => source.url)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRSSFeeds();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="rss-feed-demo">
        <h2>Loading RSS Feeds...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="rss-feed-demo error">
        <h2>Error Retrieving RSS Feeds</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Render feeds
  return (
    <div className="rss-feed-demo">
      <h2>Latest Newsletter Sources</h2>
      {feeds.map((feed, feedIndex) => (
        <div key={feedIndex} className="feed-source">
          <h3>{feed.title || `Feed ${feedIndex + 1}`}</h3>
          <p>{feed.description}</p>
          <ul className="feed-items">
            {feed.items && feed.items.slice(0, 5).map((item: RSSItem, itemIndex: number) => (
              <li key={itemIndex}>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
                {item.pubDate && (
                  <span className="item-date">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RSSFeedDemo;
