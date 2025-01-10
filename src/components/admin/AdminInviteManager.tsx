import { Clock, Copy, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { ADMIN_INVITE_CONFIG, AdminInviteService } from '@/services/adminInviteService';
import { useAuthStore } from '@/stores/authStore';

// Type for displaying invite codes
interface DisplayInvite {
  code: string;
  createdAt: Date;
  usedCount: number;
  maxUses: number;
  expiresAt: Date;
  notes?: string;
}

export const AdminInviteManager: React.FC = () => {
  const { user } = useAuthStore();
  const [inviteCodes, setInviteCodes] = useState<DisplayInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newInviteOptions, setNewInviteOptions] = useState({
    maxUses: 3,
    expiryDays: 14,
    assignedTo: '',
    notes: '',
  });

  // Fetch existing invite codes
  const fetchInviteCodes = async () => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can manage invite codes');
      return;
    }

    setIsLoading(true);
    try {
      const codes = await AdminInviteService.getAdminInviteCodes({
        createdBy: user.uid,
        activeOnly: true,
      });

      // Transform Firestore timestamps to Date objects
      const displayCodes = codes.map((code) => ({
        ...code,
        createdAt: code.createdAt.toDate(),
        expiresAt: code.expiresAt.toDate(),
      }));

      setInviteCodes(displayCodes);
    } catch (error) {
      console.error('Failed to fetch invite codes:', error);
      toast.error('Could not retrieve invite codes');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new invite code
  const generateInviteCode = async () => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can generate invite codes');
      return;
    }

    try {
      const newCode = await AdminInviteService.generateAdminInviteCode(user.uid, {
        maxUses: newInviteOptions.maxUses,
        expiryDays: newInviteOptions.expiryDays,
        ...(newInviteOptions.assignedTo && {
          assignedTo: newInviteOptions.assignedTo,
        }),
        ...(newInviteOptions.notes && {
          notes: newInviteOptions.notes,
        }),
      });

      // Copy to clipboard
      navigator.clipboard.writeText(newCode);

      toast.success(`Invite Code Generated: ${newCode}`, {
        icon: '🔑',
        duration: 5000,
      });

      // Refresh the list of invite codes
      await fetchInviteCodes();
    } catch (error) {
      console.error('Failed to generate invite code:', error);
      toast.error('Could not generate invite code');
    }
  };

  // Revoke an invite code
  const revokeInviteCode = async (code: string) => {
    try {
      await AdminInviteService.revokeInviteCode(code);
      toast.success(`Invite code ${code} revoked`);

      // Refresh the list of invite codes
      await fetchInviteCodes();
    } catch (error) {
      console.error('Failed to revoke invite code:', error);
      toast.error('Could not revoke invite code');
    }
  };

  // Copy invite code to clipboard
  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Invite code copied to clipboard');
  };

  // Fetch codes on component mount
  useEffect(() => {
    fetchInviteCodes();
  }, [user]);

  // Only render for admins
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Admin Invite Management</h2>

      {/* Invite Code Generation Form */}
      <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='text-lg font-semibold mb-3'>Generate New Invite Code</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Max Uses
              <input
                type='number'
                value={newInviteOptions.maxUses}
                onChange={(e) =>
                  setNewInviteOptions((prev) => ({
                    ...prev,
                    maxUses: parseInt(e.target.value),
                  }))
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
                min='1'
                max='10'
              />
            </label>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Expiry Days
              <input
                type='number'
                value={newInviteOptions.expiryDays}
                onChange={(e) =>
                  setNewInviteOptions((prev) => ({
                    ...prev,
                    expiryDays: parseInt(e.target.value),
                  }))
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
                min='1'
                max='90'
              />
            </label>
          </div>
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Assigned To (Optional)
              <input
                type='text'
                value={newInviteOptions.assignedTo}
                onChange={(e) =>
                  setNewInviteOptions((prev) => ({
                    ...prev,
                    assignedTo: e.target.value,
                  }))
                }
                placeholder='User ID or Email'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              />
            </label>
          </div>
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Notes (Optional)
              <input
                type='text'
                value={newInviteOptions.notes}
                onChange={(e) =>
                  setNewInviteOptions((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder='Additional information'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              />
            </label>
          </div>
        </div>
        <button
          onClick={generateInviteCode}
          className='mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'
        >
          Generate Invite Code
        </button>
      </div>

      {/* Existing Invite Codes */}
      <div>
        <h3 className='text-lg font-semibold mb-3'>Active Invite Codes</h3>
        {isLoading ? (
          <div className='text-center text-gray-500'>Loading invite codes...</div>
        ) : inviteCodes.length === 0 ? (
          <div className='text-center text-gray-500'>No active invite codes</div>
        ) : (
          <div className='space-y-4'>
            {inviteCodes.map((invite) => (
              <div
                key={invite.code}
                className='bg-gray-100 p-4 rounded-lg flex items-center justify-between'
              >
                <div>
                  <div className='flex items-center'>
                    <span className='font-mono font-bold mr-2'>{invite.code}</span>
                    <button
                      onClick={() => copyInviteCode(invite.code)}
                      className='text-gray-500 hover:text-blue-500'
                      title='Copy Code'
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className='text-xs text-gray-600 mt-1'>
                    <p>Created: {invite.createdAt.toLocaleString()}</p>
                    <p>Expires: {invite.expiresAt.toLocaleString()}</p>
                    <p>
                      Uses: {invite.usedCount}/{invite.maxUses}
                    </p>
                    {invite.notes && <p className='italic'>Notes: {invite.notes}</p>}
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => revokeInviteCode(invite.code)}
                    className='text-red-500 hover:text-red-700'
                    title='Revoke Invite'
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInviteManager;
