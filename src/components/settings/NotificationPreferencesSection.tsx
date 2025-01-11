const NotificationPreferencesSection: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newsletterRecommendations, setNewsletterRecommendations] = useState(true);
    return (<div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Notification Settings</h2>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-700 dark:text-gray-300'>Email Notifications</span>
          <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
            <input type='checkbox' name='toggle' id='emailNotifications' checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer'/>
            <label htmlFor='emailNotifications' className='toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer'/>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-700 dark:text-gray-300'>Newsletter Recommendations</span>
          <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
            <input type='checkbox' name='toggle' id='newsletterRecommendations' checked={newsletterRecommendations} onChange={() => setNewsletterRecommendations(!newsletterRecommendations)} className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer'/>
            <label htmlFor='newsletterRecommendations' className='toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer'/>
          </div>
        </div>
      </div>
    </div>);
};
export type  = default;
NotificationPreferencesSection;
import type { GlobalTypes } from '@/types/global';
import React, { useState } from 'react';
