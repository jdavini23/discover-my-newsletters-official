import React, { useState, useEffect } from 'react';
import { useNewsletters } from '../contexts/NewsletterContext';
import { Newsletter, NewsletterRecommendation } from '../types/newsletter';
import { PreferencesSelector } from './PreferencesSelector';

export const RecommendationsPage: React.FC = () => {
  const { 
    userPreferences, 
    recommendations, 
    fetchRecommendations,
    newsletters 
  } = useNewsletters();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecommendations, setFilteredRecommendations] = useState<NewsletterRecommendation[]>([]);

  // Fetch recommendations on component mount or when preferences change
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Filter recommendations based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecommendations(recommendations);
      return;
    }

    const filtered = recommendations.filter(rec => 
      rec.newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.newsletter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.newsletter.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setFilteredRecommendations(filtered);
  }, [searchQuery, recommendations]);

  // If no preferences set, show preferences selector
  if (!userPreferences || userPreferences.preferredCategories.length === 0) {
    return (
      <div className="recommendations-page">
        <h1>Let's Personalize Your Newsletter Experience</h1>
        <PreferencesSelector />
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <h1>Your Newsletter Recommendations</h1>
      
      <div className="search-container">
        <input 
          type="text"
          placeholder="Search newsletters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredRecommendations.length === 0 ? (
        <div className="no-recommendations">
          <p>No newsletters match your search or preferences.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="reset-search-button"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="recommendations-grid">
          {filteredRecommendations.map((rec, index) => (
            <NewsletterCard 
              key={rec.newsletter.id} 
              recommendation={rec}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface NewsletterCardProps {
  recommendation: NewsletterRecommendation;
  rank: number;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({ recommendation, rank }) => {
  const { newsletter, matchScore, matchReasons } = recommendation;

  return (
    <div className="newsletter-card">
      <div className="card-header">
        <span className="rank">#{rank}</span>
        <h3>{newsletter.title}</h3>
      </div>
      
      <div className="card-body">
        {newsletter.coverImageUrl && (
          <img 
            src={newsletter.coverImageUrl} 
            alt={`${newsletter.title} cover`} 
            className="newsletter-cover"
          />
        )}
        
        <p className="newsletter-description">{newsletter.description}</p>
        
        <div className="newsletter-details">
          <div className="categories">
            {newsletter.categories.map(category => (
              <span key={category} className="category-tag">{category}</span>
            ))}
          </div>
          
          <div className="newsletter-stats">
            {newsletter.subscriberCount && (
              <span>
                📧 {newsletter.subscriberCount.toLocaleString()} subscribers
              </span>
            )}
            {newsletter.averageReadTime && (
              <span>⏱️ {newsletter.averageReadTime} min read</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="match-reasons">
          <strong>Why we think you'll like this:</strong>
          <ul>
            {matchReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
        
        <div className="newsletter-actions">
          <a 
            href={newsletter.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="website-link"
          >
            Visit Website
          </a>
          <a 
            href={newsletter.subscribeUrl || newsletter.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="subscribe-link"
          >
            Subscribe
          </a>
        </div>
      </div>
    </div>
  );
};

// Inject styles
const styles = `
<style>
.recommendations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.newsletter-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.newsletter-card:hover {
  transform: scale(1.03);
}

.card-header {
  display: flex;
  align-items: center;
  background-color: #f4f4f4;
  padding: 10px;
}

.rank {
  font-weight: bold;
  margin-right: 10px;
  color: #666;
}

.newsletter-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 15px;
}

.newsletter-description {
  color: #333;
  margin-bottom: 15px;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.category-tag {
  background-color: #e0e0e0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.newsletter-stats {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9em;
}

.card-footer {
  padding: 15px;
  background-color: #f9f9f9;
}

.match-reasons ul {
  padding-left: 20px;
  color: #555;
}

.newsletter-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.website-link, .subscribe-link {
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.website-link {
  color: #007bff;
  border: 1px solid #007bff;
}

.subscribe-link {
  color: white;
  background-color: #28a745;
}

.no-recommendations {
  text-align: center;
  padding: 50px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.reset-search-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
`;

// Inject styles into the document
if (!document.getElementById('recommendations-page-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'recommendations-page-styles';
  styleEl.textContent = styles.replace('<style>', '').replace('</style>', '');
  document.head.appendChild(styleEl);
}
