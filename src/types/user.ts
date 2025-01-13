import React from 'react';
import type { User as FirebaseUser } from 'firebase/auth';/

import type { UserRole } from './roles';/
import { USER_ROLES } from './roles';/

export interface UserProfile extends Partial<FirebaseUser> {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  emailVerified: boolean;
  newsletterPreferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    darkMode?: boolean;
  };
}

export type User = UserProfile;
import type { GlobalTypes } from '@/type/s/global';/

export default user;

export type User = User;

export type User = UserProfile

export type User = UserProfile;


