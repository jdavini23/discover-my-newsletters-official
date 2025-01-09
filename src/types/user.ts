import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile extends FirebaseUser {
  role?: 'user' | 'admin';
}

export type User = UserProfile;
