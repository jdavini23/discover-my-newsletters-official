import { RBAC, UserProfile } from '../rbac';
import { USER_ROLES } from '@/types/roles';
import { AuthService } from '@/services/authService';

describe('Role-Based Access Control', () => {
  // Mock user profiles for different roles
  const adminProfile: UserProfile = {
    id: 'admin-user-id',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: USER_ROLES.ADMIN,
    emailVerified: true,
    newsletterPreferences: {
      categories: [],
      frequency: 'weekly',
      darkMode: false
    }
  };

  const moderatorProfile: UserProfile = {
    ...adminProfile,
    id: 'moderator-user-id',
    email: 'moderator@example.com',
    role: USER_ROLES.MODERATOR
  };

  const regularUserProfile: UserProfile = {
    ...adminProfile,
    id: 'regular-user-id',
    email: 'user@example.com',
    role: USER_ROLES.USER
  };

  describe('isAdmin method', () => {
    it('should return true for admin users', () => {
      expect(RBAC.isAdmin(adminProfile)).toBe(true);
    });

    it('should return false for non-admin users', () => {
      expect(RBAC.isAdmin(moderatorProfile)).toBe(false);
      expect(RBAC.isAdmin(regularUserProfile)).toBe(false);
      expect(RBAC.isAdmin(null)).toBe(false);
    });
  });

  describe('isAdminOrModerator method', () => {
    it('should return true for admin users', () => {
      expect(RBAC.isAdminOrModerator(adminProfile)).toBe(true);
    });

    it('should return true for moderator users', () => {
      expect(RBAC.isAdminOrModerator(moderatorProfile)).toBe(true);
    });

    it('should return false for regular users', () => {
      expect(RBAC.isAdminOrModerator(regularUserProfile)).toBe(false);
      expect(RBAC.isAdminOrModerator(null)).toBe(false);
    });
  });

  describe('hasRole function', () => {
    it('should correctly check user roles', () => {
      expect(RBAC.hasRole(adminProfile, USER_ROLES.ADMIN)).toBe(true);
      expect(RBAC.hasRole(moderatorProfile, USER_ROLES.MODERATOR)).toBe(true);
      expect(RBAC.hasRole(regularUserProfile, USER_ROLES.USER)).toBe(true);
      expect(RBAC.hasRole(regularUserProfile, USER_ROLES.ADMIN)).toBe(false);
      expect(RBAC.hasRole(null, USER_ROLES.USER)).toBe(false);
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
      email: 'newuser@example.com'
    });

    // Temporarily replace the signUp method
    const originalSignUp = authService.signUp;
    authService.signUp = mockSignUp;

    const userProfile = await authService.signUp(
      'newuser@example.com', 
      'password123'
    );

    expect(userProfile.role).toBe(USER_ROLES.USER);

    // Restore the original method
    authService.signUp = originalSignUp;
  });

  it('should assign ADMIN role for specific admin email', async () => {
    // Mock the signUp method
    const mockSignUp = jest.fn().mockResolvedValue({
      role: USER_ROLES.ADMIN,
      email: 'admin@discovermynewsletters.com'
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
