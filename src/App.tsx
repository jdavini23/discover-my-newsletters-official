import React from 'react';
import { NewsletterProvider } from './contexts/NewsletterContext';
import PreferencesSelector from './components/PreferencesSelector';
import RecommendationsPage from './components/RecommendationsPage';

const App: React.FC = () => {
  return (
    <NewsletterProvider>
      <div className="app-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>
          Newsletter Discovery Platform
        </h1>
        <PreferencesSelector />
        <RecommendationsPage />
      </div>
    </NewsletterProvider>
  );
};

export default App;
