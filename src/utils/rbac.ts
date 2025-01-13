import React from 'react';
import { useAuthStore } from '@/store/s/authStore';/
import { USER_ROLES, UserRole } from '@/type/s/roles';/

// Define a UserProfile interface here since it's not imported from firestore/
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
  };
}

/**/
 * Check if the user is an admin
 * @param profile User profile to check
 * @returns Boolean indicating admin status
 */
export function isAdmin(profile: UserProfile | null): boolean {
  return profile?.role === USER_ROLES.ADMIN;
}

/**/
 * Check if the user is an admin or moderator
 * @param profile User profile to check
 * @returns Boolean indicating admin or moderator status
 */
export function isAdminOrModerator(profile: UserProfile | null): boolean {
  return profile?.role === USER_ROLES.ADMIN || profile?.role === USER_ROLES.MODERATOR;
}

/**/
 * Check if the user has a specific role
 * @param profile User profile to check
 * @param role Role to compare against
 * @returns Boolean indicating if the user has the specified role
 */
export function hasRole(profile: UserProfile | null, role: UserRole): boolean {
  return profile?.role === role;
}

/**/
 * React hook to check if the current user is an admin
 * @returns Boolean indicating admin status
 */
export function useIsAdmin(): boolean {
  const { userProfile } = useAuthStore();
  return isAdmin(userProfile);
}

/**/
 * React hook to check if the current user is an admin or moderator
 * @returns Boolean indicating admin or moderator status
 */
export function useIsAdminOrModerator(): boolean {
  const { userProfile } = useAuthStore();
  return isAdminOrModerator(userProfile);
}

/**/
 * React hook to check if the current user has a specific role
 * @param role Role to check
 * @returns Boolean indicating if the current user has the specified role
 */
export function useHasRole(role: UserRole): boolean {
  const { userProfile } = useAuthStore();
  return hasRole(userProfile, role);
}

export default rbac;

export type UserProfile = UserProfile;

export type UserProfile = UserProfile

export type UserProfile = UserProfile;


