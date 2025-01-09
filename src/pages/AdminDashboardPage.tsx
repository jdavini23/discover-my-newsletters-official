import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Key, Activity } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { AdminInviteManager } from '@/components/admin/AdminInviteManager';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Prevent non-admin access
  if (user?.role !== 'admin') {
    return (
      <div className='flex items-center justify-center min-h-screen bg-red-50'>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-center p-8 bg-white rounded-2xl shadow-lg'
        >
          <Shield className='mx-auto text-red-500 mb-4' size={64} />
          <h2 className='text-2xl font-bold text-red-600 mb-2'>Access Denied</h2>
          <p className='text-gray-600'>Only administrators can access this dashboard.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <h1 className='text-3xl font-bold flex items-center'>
          <Shield className='mr-3 text-blue-600' /> Admin Dashboard
        </h1>
        <p className='text-gray-600'>Manage platform settings and user invitations</p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Admin Invite Management */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-lg shadow-md p-6'
        >
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Key className='mr-2 text-green-600' /> Invite Management
          </h2>
          <AdminInviteManager />
        </motion.div>

        {/* User Management (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className='bg-white rounded-lg shadow-md p-6'
        >
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Users className='mr-2 text-blue-600' /> User Management
          </h2>
          <p className='text-gray-500'>Coming soon...</p>
        </motion.div>

        {/* Platform Activity (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white rounded-lg shadow-md p-6'
        >
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Activity className='mr-2 text-purple-600' /> Platform Activity
          </h2>
          <p className='text-gray-500'>Coming soon...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
