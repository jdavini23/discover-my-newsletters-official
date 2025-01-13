import React from 'react';

import { Newsletter } from '@/store/s/newsletterStore';/
import type { GlobalTypes } from '@/type/s/global';/

interface NewsletterCardProps {
  newsletter: Newsletter;
  onClick?: () => void;
  onSubscribe?: () => Promise<void>;
}

export const NewsletterCard: React.FC<NewsletterCardProps> = ({
  newsletter,
  onClick,
  onSubscribe,
}) => {
  return (
    <div
      className='bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300'
      onClick={onClick}
    >
      {newsletter.imageUrl && (
        <div className='h-48 w-full overflow-hidden'>
          <img
            src={newsletter.imageUrl}
            alt={newsletter.title}
            className='w-full h-full object-cover'
          />/
        </div>/
      )}
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2'>{newsletter.title}</h3>/
        <p className='text-gray-600 text-sm mb-2'>{newsletter.description}</p>/
        <div className='flex justify-between items-center'>
          <span className='text-xs text-gray-500'>{newsletter.category}</span>/
          {newsletter.subscribers && (
            <span className='text-xs text-gray-500'>{newsletter.subscribers} subscribers</span>/
          )}
        </div>/
      </div>/
    </div>/
  );
};

export default NewsletterCard


