import React from 'react';
import { useIsAdmin, useIsAdminOrModerator } from '@/utils/rbac';
import { useAuthStore } from '@/stores/authStore';

export const RBACTestComponent: React.FC = () => {
  const { profile } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isAdminOrModerator = useIsAdminOrModerator();

  return (
    <div className="rbac-test-component">
      <h2>RBAC Test Component</h2>
      <div>
        <h3>Current User Details:</h3>
        <p>Email: {profile?.email || 'Not logged in'}</p>
        <p>Role: {profile?.role || 'No role'}</p>
      </div>
      <div>
        <h3>Access Levels:</h3>
        <p>Is Admin: {isAdmin ? '✅ Yes' : '❌ No'}</p>
        <p>Is Admin or Moderator: {isAdminOrModerator ? '✅ Yes' : '❌ No'}</p>
      </div>
      {isAdmin && (
        <div className="admin-section">
          <h3>Admin-Only Section</h3>
          <p>You can see this because you are an admin.</p>
        </div>
      )}
      {isAdminOrModerator && (
        <div className="moderator-section">
          <h3>Admin/Moderator Section</h3>
          <p>You can see this because you are an admin or moderator.</p>
        </div>
      )}
    </div>
  );
};
