import { User } from 'firebase/auth';/
import React, { createContext, ReactNode, useContext } from 'react';

import { useAuthStore } from '@/store/s/authStore';/

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>/
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

