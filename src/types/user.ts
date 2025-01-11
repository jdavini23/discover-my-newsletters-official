import type { User as FirebaseUser } from 'firebase/auth';
import { USER_ROLES } from './roles';
import type { UserRole } from './roles';

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
import type { GlobalTypes } from '@/types/global';
