import { USER_ROLES, UserRole } from '@/types/roles';

// Define a UserProfile interface here since it's not imported from firestore
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  emailVerified: boolean;
  newsletterPreferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    darkMode?: boolean;
  }
}

/**
 * Role-Based Access Control (RBAC) Utility
 * Provides methods for checking user roles and permissions
 */
export class RBAC {
  /**
   * Check if the user is an admin
   * @param profile User profile to check
   * @returns Boolean indicating admin status
   */
  static isAdmin(profile: UserProfile | null): boolean {
    return profile?.role === USER_ROLES.ADMIN;
  }

  /**
   * Check if the user is an admin or moderator
   * @param profile User profile to check
   * @returns Boolean indicating admin or moderator status
   */
  static isAdminOrModerator(profile: UserProfile | null): boolean {
    return profile?.role === USER_ROLES.ADMIN || 
           profile?.role === USER_ROLES.MODERATOR;
  }

  /**
   * Check if the current user has admin or moderator permissions
   * This method uses the auth store to get the current user's profile
   * @returns Boolean indicating if the current user is an admin or moderator
   */
  static useCurrentUserIsAdminOrModerator(): boolean {
    // Placeholder for auth store hook
    // In a real implementation, this would use the actual auth store
    return false;
  }

  /**
   * Check if the current user has admin permissions
   * This method uses the auth store to get the current user's profile
   * @returns Boolean indicating if the current user is an admin
   */
  static useCurrentUserIsAdmin(): boolean {
    // Placeholder for auth store hook
    // In a real implementation, this would use the actual auth store
    return false;
  }

  /**
   * Check if the user has a specific role
   * @param profile User profile to check
   * @param role Role to compare against
   * @returns Boolean indicating if the user has the specified role
   */
  static hasRole(profile: UserProfile | null, role: UserRole): boolean {
    return profile?.role === role;
  }
}
