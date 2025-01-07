import React from 'react';
import { UserProfile } from '../../types/profile';

const DEFAULT_AVATAR = '/src/assets/images/default-avatar.svg';

const ActivityTypeLabels = {
  newsletter_view: 'Viewed Newsletter',
  newsletter_subscribe: 'Subscribed to Newsletter',
  newsletter_like: 'Liked Newsletter',
};

interface InteractionInsightsSectionProps {
  profile: UserProfile;
}

const InteractionInsightsSection: React.FC<InteractionInsightsSectionProps> = ({ profile }) => {
  const sortedActivities = [...(profile.activityLog || [])]
    .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
    .slice(0, 10); // Show last 10 activities

  const activityCounts = profile.activityLog?.reduce(
    (acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className='bg-neutralBackground-100 shadow-soft rounded-xl p-6'>
      <div className='flex items-center mb-6'>
        <img
          src={profile.photoURL || DEFAULT_AVATAR}
          alt='Profile'
          className='w-16 h-16 rounded-full object-cover mr-4 border-4 border-primary-100'
        />
        <div>
          <h2 className='text-2xl font-bold text-neutralText-500'>
            {profile.displayName || 'User'}
          </h2>
          <p className='text-neutralText-500'>{profile.email}</p>
        </div>
      </div>

      <h3 className='text-xl font-semibold mb-6 text-neutralText-700'>Interaction Insights</h3>

      <div className='grid md:grid-cols-3 gap-4 mb-6'>
        {Object.entries(activityCounts || {}).map(([type, count]) => (
          <div
            key={type}
            className='bg-neutralBackground-50 p-4 rounded-md text-center border border-neutralBackground-500'
          >
            <p className='text-xl font-bold text-primary-500'>{count}</p>
            <p className='text-sm text-neutralText-700'>
              {ActivityTypeLabels[type as keyof typeof ActivityTypeLabels]}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h4 className='text-lg font-semibold mb-4 text-neutralText-700'>Recent Activity</h4>
        {sortedActivities.length === 0 ? (
          <p className='text-neutralText-500'>No recent activities</p>
        ) : (
          <ul className='divide-y divide-neutralBackground-500'>
            {sortedActivities.map((activity, index) => (
              <li key={index} className='py-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-sm font-medium text-neutralText-700'>
                      {ActivityTypeLabels[activity.type as keyof typeof ActivityTypeLabels]}
                    </p>
                    <p className='text-sm text-neutralText-500'>
                      {new Date(activity.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                  {activity.details && (
                    <span className='text-sm text-accent1-500'>{activity.details}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InteractionInsightsSection;
