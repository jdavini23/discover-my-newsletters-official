/**
 * Centralized Role Management for Discover My Newsletters
 * 
 * This module defines the role system, providing a type-safe and 
 * extensible approach to user roles and permissions.
 */

export const USER_ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Detailed permission structure for each role
 */
export interface RolePermissions {
  canAccessInsights: boolean;
  canManageInsights: boolean;
  canCreateNewsletters: boolean;
  canEditNewsletters: boolean;
  canDeleteNewsletters: boolean;
  canManageUsers: boolean;
  canSuspendUsers: boolean;
  canManageRecommendations: boolean;
  canModerateContent: boolean;
}

/**
 * Comprehensive permission mapping for each role
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [USER_ROLES.USER]: {
    canAccessInsights: false,
    canManageInsights: false,
    canCreateNewsletters: false,
    canEditNewsletters: false,
    canDeleteNewsletters: false,
    canManageUsers: false,
    canSuspendUsers: false,
    canManageRecommendations: false,
    canModerateContent: false,
  },
  [USER_ROLES.MODERATOR]: {
    canAccessInsights: true,
    canManageInsights: false,
    canCreateNewsletters: true,
    canEditNewsletters: true,
    canDeleteNewsletters: false,
    canManageUsers: false,
    canSuspendUsers: false,
    canManageRecommendations: false,
    canModerateContent: true,
  },
  [USER_ROLES.ADMIN]: {
    canAccessInsights: true,
    canManageInsights: true,
    canCreateNewsletters: true,
    canEditNewsletters: true,
    canDeleteNewsletters: true,
    canManageUsers: true,
    canSuspendUsers: true,
    canManageRecommendations: true,
    canModerateContent: true,
  }
};

/**
 * Utility function to check specific permissions for a given role
 * @param role The user's role
 * @param permission The specific permission to check
 * @returns Boolean indicating whether the role has the specified permission
 */
export function hasPermission(
  role: UserRole, 
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[role][permission] || false;
}

/**
 * Utility function to get all permissions for a specific role
 * @param role The user's role
 * @returns An object containing all permissions for the role
 */
export function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}
