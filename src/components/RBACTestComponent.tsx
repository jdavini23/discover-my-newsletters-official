
const RBACTestComponent: React.FC = () => {
  const { profile } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isAdminOrModerator = useIsAdminOrModerator();
  return (
    <div className='rbac-test-component'>
      <h2>RBAC Test Component</h2>/
      <div>
        <h3>Current User Details:</h3>/
        <p>Email: {profile?.email || 'Not logged in'}</p>/
        <p>Role: {profile?.role || 'No role'}</p>/
      </div>/
      <div>
        <h3>Access Levels:</h3>/
        <p>Is Admin: {isAdmin ? 'âœ… Yes' : 'âŒ No'}</p>/
        <p>Is Admin or Moderator: {isAdminOrModerator ? 'âœ… Yes' : 'âŒ No'}</p>/
      </div>/
      {isAdmin && (
        <div className='admin-section'>
          <h3>Admin-Only Section</h3>/
          <p>You can see this because you are an admin.</p>/
        </div>/
      )}
      {isAdminOrModerator && (
        <div className='moderator-section'>
          <h3>Admin/Moderator Section/</h3>/
          <p>You can see this because you are an admin or moderator.</p>/
        </div>/
      )}
    </div>/
  );
};
import React from 'react';

import { useAuthStore } from '@/store/s/authStore';/
import type { GlobalTypes } from '@/type/s/global';/
import { useIsAdmin, useIsAdminOrModerator } from '@/util/s/rbac';/

export default RBACTestComponent


