import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNewsletters } from '../contexts/NewsletterContext';
import { PreferencesSelector } from './PreferencesSelector';
export const RecommendationsPage = () => {
    const { userPreferences, recommendations, fetchRecommendations, newsletters } = useNewsletters();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecommendations, setFilteredRecommendations] = useState([]);
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
        const filtered = recommendations.filter(rec => rec.newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.newsletter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.newsletter.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
        setFilteredRecommendations(filtered);
    }, [searchQuery, recommendations]);
    // If no preferences set, show preferences selector
    if (!userPreferences || userPreferences.preferredCategories.length === 0) {
        return (_jsxs("div", { className: "recommendations-page", children: [_jsx("h1", { children: "Let's Personalize Your Newsletter Experience" }), _jsx(PreferencesSelector, {})] }));
    }
    return (_jsxs("div", { className: "recommendations-page", children: [_jsx("h1", { children: "Your Newsletter Recommendations" }), _jsx("div", { className: "search-container", children: _jsx("input", { type: "text", placeholder: "Search newsletters...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }) }), filteredRecommendations.length === 0 ? (_jsxs("div", { className: "no-recommendations", children: [_jsx("p", { children: "No newsletters match your search or preferences." }), _jsx("button", { onClick: () => setSearchQuery(''), className: "reset-search-button", children: "Reset Search" })] })) : (_jsx("div", { className: "recommendations-grid", children: filteredRecommendations.map((rec, index) => (_jsx(NewsletterCard, { recommendation: rec, rank: index + 1 }, rec.newsletter.id))) }))] }));
};
const NewsletterCard = ({ recommendation, rank }) => {
    const { newsletter, matchScore, matchReasons } = recommendation;
    return (_jsxs("div", { className: "newsletter-card", children: [_jsxs("div", { className: "card-header", children: [_jsxs("span", { className: "rank", children: ["#", rank] }), _jsx("h3", { children: newsletter.title })] }), _jsxs("div", { className: "card-body", children: [newsletter.coverImageUrl && (_jsx("img", { src: newsletter.coverImageUrl, alt: `${newsletter.title} cover`, className: "newsletter-cover" })), _jsx("p", { className: "newsletter-description", children: newsletter.description }), _jsxs("div", { className: "newsletter-details", children: [_jsx("div", { className: "categories", children: newsletter.categories.map(category => (_jsx("span", { className: "category-tag", children: category }, category))) }), _jsxs("div", { className: "newsletter-stats", children: [newsletter.subscriberCount && (_jsxs("span", { children: ["\uD83D\uDCE7 ", newsletter.subscriberCount.toLocaleString(), " subscribers"] })), newsletter.averageReadTime && (_jsxs("span", { children: ["\u23F1\uFE0F ", newsletter.averageReadTime, " min read"] }))] })] })] }), _jsxs("div", { className: "card-footer", children: [_jsxs("div", { className: "match-reasons", children: [_jsx("strong", { children: "Why we think you'll like this:" }), _jsx("ul", { children: matchReasons.map((reason, index) => (_jsx("li", { children: reason }, index))) })] }), _jsxs("div", { className: "newsletter-actions", children: [_jsx("a", { href: newsletter.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "website-link", children: "Visit Website" }), _jsx("a", { href: newsletter.subscribeUrl || newsletter.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "subscribe-link", children: "Subscribe" })] })] })] }));
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
