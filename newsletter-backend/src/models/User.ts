import { Interest } from './Interest';
import { Subscription } from './Subscription';
import { UserInteraction } from './UserInteraction';

export class User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isEmailVerified: boolean;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  emailVerificationToken?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
  firebaseUid?: string | null;
  authProvider: 'local' | 'google' | 'facebook' | 'firebase';
  interests?: Interest[];
  subscriptions?: Subscription[];
  interactions?: UserInteraction[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
    this.role = data?.role || 'user';
    this.isEmailVerified = data?.isEmailVerified || false;
    this.authProvider = data?.authProvider || 'local';
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isEmailVerified: this.isEmailVerified,
      passwordResetToken: this.passwordResetToken,
      passwordResetExpires: this.passwordResetExpires,
      emailVerificationToken: this.emailVerificationToken,
      googleId: this.googleId,
      facebookId: this.facebookId,
      firebaseUid: this.firebaseUid,
      authProvider: this.authProvider,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
