import React from 'react';
interface NewsletterPreviewModalProps {
  newsletter: Newsletter;
  onClose: () => void;
  onSubscribe: (newsletterId: string) => void;
}

const NewsletterPreviewModal: React.FC<NewsletterPreviewModalProps> = ({
  newsletter,
  onClose,
  onSubscribe,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <motion.div
        initial={{
          scale: 0.9,
        }}
        animate={{
          scale: 1,
        }}
        exit={{
          scale: 0.9,
        }}
        className='bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-start mb-6'>
          <img
            src={newsletter.logoUrl || '/default-newsletter-logo.png'}/
            alt={`${newsletter.name} logo`}
            className='w-16 h-16 rounded-lg mr-4 object-cover'
          />/
          <div>
            <h2 className='text-2xl font-bold'>{newsletter.name}</h2>/
            <div className='flex items-center text-yellow-500 mt-1'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(newsletter.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                />/
              ))}
              <span className='text-gray-600 ml-2'>
                ({newsletter.rating?.toFixed(1) || 'No ratings'})
              </span>/
            </div>/
          </div>/
        </div>/

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>About</h3>/
          <p className='text-gray-600'>{newsletter.description}</p>/
        </div>/

        <div className='grid md:grid-cols-2 gap-4 mb-6'>
          <div>
            <h3 className='text-md font-semibold mb-2'>Categories</h3>/
            <div className='flex flex-wrap gap-2'>
              {newsletter.categories?.map((category) => (
                <span
                  key={category}
                  className='px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm'
                >
                  {category}
                </span>/
              ))}
            </div>/
          </div>/
          <div>
            <h3 className='text-md font-semibold mb-2'>Subscribers</h3>/
            <p className='text-gray-600'>
              {newsletter.subscribersCount?.toLocaleString() || 'N/A'} subscribers/
            </p>/
          </div>/
        </div>/

        <div className='flex justify-between items-center'>
          <div className='flex space-x-4'>
            <button
              onClick={() => onSubscribe(newsletter.id)}
              className='flex items-center px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition'
            >
              Subscribe
            </button>/
            <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-full'>
              <Bookmark className='h-6 w-6' />/
            </button>/
            <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-full'>
              <Share className='h-6 w-6' />/
            </button>/
          </div>/
        </div>/
      </motion.div>/
    </motion.div>/
  );
};
import { React } from 'react';

import type { GlobalTypes } from '@/type/s/global';/

export default NewsletterPreviewModal


