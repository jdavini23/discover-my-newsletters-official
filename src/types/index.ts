// User Types
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// Newsletter Types
export interface Newsletter {
  id: string;
  title: string;
  description: string;
  category: string;
  subscribers: number;
  url?: string;
  tags?: string[];
}

// Feedback Types
export interface Feedback {
  id?: string;
  userId: string;
  message: string;
  category?: 'bug' | 'suggestion' | 'other';
  timestamp: Date;
}

// Authentication Types
export interface AuthContextType {
  currentUser: UserProfile | null;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Utility Types
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export type AsyncFunction<T, U> = (arg: T) => Promise<U>;
