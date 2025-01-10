import { Activity, Key, Shield, Users } from 'lucide-react';
import React from 'react';

import { AdminInviteManager } from '@/components/admin/AdminInviteManager';
import { useAuthStore } from '@/stores/authStore';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Prevent non-admin access
  if (user?.role !== 'admin') {
    return (
      <div className='flex items-center justify-center min-h-screen bg-red-50'>
        <div>
          <Shield className='mx-auto text-red-500 mb-4' size={64} />
          <h2 className='text-2xl font-bold text-red-600 mb-2'>Access Denied</h2>
          <p className='text-gray-600'>Only administrators can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div>
        <h1 className='text-3xl font-bold flex items-center'>
          <Shield className='mr-3 text-blue-600' /> Admin Dashboard
        </h1>
        <p className='text-gray-600'>Manage platform settings and user invitations</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Admin Invite Management */}
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Key className='mr-2 text-green-600' /> Invite Management
          </h2>
          <AdminInviteManager />
        </div>

        {/* User Management (Placeholder) */}
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Users className='mr-2 text-blue-600' /> User Management
          </h2>
          <p className='text-gray-500'>Coming soon...</p>
        </div>

        {/* Platform Activity (Placeholder) */}
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Activity className='mr-2 text-purple-600' /> Platform Activity
          </h2>
          <p className='text-gray-500'>Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
