import React from 'react';
import { useIsAdminOrModerator } from '@/utils/rbac';

const AdminDashboard: React.FC = () => {
  const isAdminOrModerator = useIsAdminOrModerator();

  if (!isAdminOrModerator) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You do not have permission to view the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <section>
        <h2>System Overview</h2>
        {/* Basic admin dashboard content */}
        <p>Welcome to the administrative area.</p>
      </section>
    </div>
  );
};

export default AdminDashboard;
