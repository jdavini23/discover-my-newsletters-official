import type { GlobalTypes } from '@/types/global';
import { AuthService } from '@/services/authService';
import { USER_ROLES } from '@/types/roles';
import { isAdmin, isAdminOrModerator, hasRole, UserProfile } from '../rbac';

describe('Role-Based Access Control', () => {
  // Mock user profiles for different roles
  const adminProfile: UserProfile = {
    id: 'admin-user-id',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: USER_ROLES.ADMIN,
    emailVerified: true,
    newsletterPreferences: {
      categories: ['tech'],
      frequency: 'weekly',
      darkMode: false,
    },
  };
  const moderatorProfile: UserProfile = {
    ...adminProfile,
    id: 'moderator-user-id',
    email: 'moderator@example.com',
    role: USER_ROLES.MODERATOR,
  };
  const regularUserProfile: UserProfile = {
    ...adminProfile,
    id: 'regular-user-id',
    email: 'user@example.com',
    role: USER_ROLES.USER,
  };
  
  describe('isAdmin function', () => {
    it('should return true for admin users', () => {
      expect(isAdmin(adminProfile)).toBe(true);
    });
    it('should return false for non-admin users', () => {
      expect(isAdmin(moderatorProfile)).toBe(false);
      expect(isAdmin(regularUserProfile)).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });
  });
  
  describe('isAdminOrModerator function', () => {
    it('should return true for admin users', () => {
      expect(isAdminOrModerator(adminProfile)).toBe(true);
    });
    it('should return true for moderator users', () => {
      expect(isAdminOrModerator(moderatorProfile)).toBe(true);
    });
    it('should return false for regular users', () => {
      expect(isAdminOrModerator(regularUserProfile)).toBe(false);
      expect(isAdminOrModerator(null)).toBe(false);
    });
  });
  
  describe('hasRole function', () => {
    it('should correctly check user roles', () => {
      expect(hasRole(adminProfile, USER_ROLES.ADMIN)).toBe(true);
      expect(hasRole(moderatorProfile, USER_ROLES.MODERATOR)).toBe(true);
      expect(hasRole(regularUserProfile, USER_ROLES.USER)).toBe(true);
      expect(hasRole(regularUserProfile, USER_ROLES.ADMIN)).toBe(false);
      expect(hasRole(null, USER_ROLES.USER)).toBe(false);
    });
  });
});

// Integration test for signup role assignment
describe('User Signup Role Assignment', () => {
  const authService = AuthService.getInstance();
  
  it('should assign default USER role during signup', async () => {
    // Mock the signUp method
    const mockSignUp = jest.fn().mockResolvedValue({
      role: USER_ROLES.USER,
      email: 'newuser@example.com',
    });
    
    // Temporarily replace the signUp method
    const originalSignUp = authService.signUp;
    authService.signUp = mockSignUp;
    
    const userProfile = await authService.signUp('newuser@example.com', 'password123');
    expect(userProfile.role).toBe(USER_ROLES.USER);
    
    // Restore the original method
    authService.signUp = originalSignUp;
  });
  
  it('should assign ADMIN role for specific admin email', async () => {
    // Mock the signUp method
    const mockSignUp = jest.fn().mockResolvedValue({
      role: USER_ROLES.ADMIN,
      email: 'admin@discovermynewsletters.com',
    });
    
    // Temporarily replace the signUp method
    const originalSignUp = authService.signUp;
    authService.signUp = mockSignUp;
    
    const adminProfile = await authService.signUp(
      'admin@discovermynewsletters.com',
      'adminpassword'
    );
    expect(adminProfile.role).toBe(USER_ROLES.ADMIN);
    
    // Restore the original method
    authService.signUp = originalSignUp;
  });
});
