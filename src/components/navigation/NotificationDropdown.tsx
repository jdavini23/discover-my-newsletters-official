import React, { useState, useRef, useEffect } from 'react';
import { Bell as BellIcon, Check as CheckIcon } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    // Mock notifications for development
    { 
      id: '1', 
      message: 'Welcome to Discover My Newsletters!', 
      type: 'success', 
      timestamp: Date.now() 
    },
    { 
      id: '2', 
      message: 'You have a new newsletter recommendation', 
      type: 'info', 
      timestamp: Date.now() - 3600000 
    }
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    const iconClasses = 'w-4 h-4 mr-2';
    switch(type) {
      case 'success': return <CheckIcon className={`${iconClasses} text-green-500`} />;
      case 'warning': return <BellIcon className={`${iconClasses} text-yellow-500`} />;
      case 'error': return <BellIcon className={`${iconClasses} text-red-500`} />;
      default: return <BellIcon className={`${iconClasses} text-blue-500`} />;
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 rounded-full hover:bg-gray-100'
      >
        <BellIcon className='w-6 h-6 text-gray-600' />
        {notifications.length > 0 && (
          <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50'>
          <div className='flex justify-between items-center p-4 border-b'>
            <h3 className='text-lg font-semibold'>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={markAllAsRead}
                className='text-sm text-blue-600 hover:underline'
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className='p-4 text-center text-gray-500'>
              No new notifications
            </div>
          ) : (
            <ul className='max-h-64 overflow-y-auto'>
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className='px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 flex items-start'
                >
                  {getNotificationIcon(notification.type)}
                  <div>
                    <p className='text-sm text-gray-800'>{notification.message}</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
