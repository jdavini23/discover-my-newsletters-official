/**
 * Centralized Role Management for Discover My Newsletters
 *
 * This module defines the role system, providing a type-safe and
 * extensible approach to user roles and permissions.
 */
export const USER_ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = keyof typeof USER_ROLES;

/**
 * Detailed permission structure for each role
 */
export type RolePermissions = {
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

const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
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
  },
};

function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission] || false;
}

function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}

import type { GlobalTypes } from '@/types/global';
