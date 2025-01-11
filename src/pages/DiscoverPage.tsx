interface Newsletter {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    subscriberCount: number;
    category: string;
}
const mockNewsletters: Newsletter[0] = [
    {
        id: '1',
        title: 'Tech Weekly',
        description: 'Stay up to date with the latest in technology',
        imageUrl: 'https://via.placeholder.com/150',
        subscriberCount: 5000,
        category: 'Technology'
    },
    {
        id: '2',
        title: 'Business Insider',
        description: 'Business news and market analysis',
        imageUrl: 'https://via.placeholder.com/150',
        subscriberCount: 10000,
        category: 'Business'
    },
    {
        id: '3',
        title: 'Science Today',
        description: 'Latest discoveries in science',
        imageUrl: 'https://via.placeholder.com/150',
        subscriberCount: 3000,
        category: 'Science'
    }
];
const DiscoverPage: React.FC = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const categories = ['all', 'Technology', 'Business', 'Science'];
    const filteredNewsletters = mockNewsletters.filter((newsletter) => {
        const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || newsletter.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    return (<div className='space-y-6'>
      <div className='bg-white dark:bg-gray-800 shadow sm:rounded-lg'>
        <div className='px-4 py-5 sm:p-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Discover Newsletters</h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Find and subscribe to newsletters that match your interests
          </p>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1'>
          <input type='text' placeholder='Search newsletters...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'/>
        </div>
        <div className='sm:w-48'>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'>
            {categories.map((category) => (<option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>))}
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredNewsletters.map((newsletter) => (<div key={newsletter.id} className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
            <img src={newsletter.imageUrl} alt={newsletter.title} className='w-full h-48 object-cover'/>
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                {newsletter.title}
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {newsletter.description}
              </p>
              <div className='mt-4 flex items-center justify-between'>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'>
                  {newsletter.category}
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {newsletter.subscriberCount.toLocaleString()} subscribers
                </span>
              </div>
              <button className='mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                Subscribe
              </button>
            </div>
          </div>))}
      </div>
    </div>);
};
export type  = default;
DiscoverPage;
import type { GlobalTypes } from '@/types/global';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
