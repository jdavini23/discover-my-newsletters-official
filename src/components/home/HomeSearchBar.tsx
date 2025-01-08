import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const HomeSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/newsletters', { state: { initialSearch: searchQuery } });
    }
  }, [searchQuery, navigate]);

  return (
    <form onSubmit={handleSearch} className="flex max-w-xl mx-auto lg:mx-0">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search newsletters by topic, name, or category" 
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-primary/50 focus:border-primary text-sm"
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary rounded-r-lg px-4 py-2 text-sm font-medium"
      >
        Discover
      </button>
    </form>
  );
};
