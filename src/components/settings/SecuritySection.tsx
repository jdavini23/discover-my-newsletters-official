import React, { useState } from 'react';
import { Lock, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { AuthService } from '@/services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SecuritySection: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = () => {
    // Implement password reset logic
    toast.success('Password reset email sent');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
      <div className="space-y-4">
        <button 
          className="w-full py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition flex items-center justify-center"
          onClick={handlePasswordReset}
        >
          <Lock className="mr-2" /> Reset Password
        </button>
        <button 
          className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center justify-center"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : (
            <>
              <LogOut className="mr-2" /> Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;
