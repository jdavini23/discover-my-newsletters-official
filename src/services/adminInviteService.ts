import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_INVITE_CONFIG = {
  MASTER_INVITE_CODE: 'DISCOVER_ADMIN_2025',
  MAX_INVITE_USES: 5
};

export class AdminInviteService {
  // Generate a new admin invite code
  static async generateAdminInviteCode(): Promise<string> {
    try {
      const inviteCode = uuidv4().split('-')[0].toUpperCase();
      
      await setDoc(doc(firestore, 'adminInvites', inviteCode), {
        code: inviteCode,
        createdAt: new Date(),
        usedCount: 0,
        maxUses: ADMIN_INVITE_CONFIG.MAX_INVITE_USES
      });

      return inviteCode;
    } catch (error) {
      console.error('Failed to generate admin invite code:', error);
      throw error;
    }
  }

  // Validate and use an admin invite code
  static async validateAdminInviteCode(
    userId: string, 
    inviteCode: string
  ): Promise<boolean> {
    try {
      // Check for master invite code first
      if (inviteCode === ADMIN_INVITE_CONFIG.MASTER_INVITE_CODE) {
        await this.promoteUserToAdmin(userId);
        return true;
      }

      // Check custom invite code
      const inviteDoc = await getDoc(doc(firestore, 'adminInvites', inviteCode));
      
      if (!inviteDoc.exists()) {
        console.error('Invite code not found');
        return false;
      }

      const inviteData = inviteDoc.data();
      
      if (
        inviteData.usedCount >= inviteData.maxUses
      ) {
        console.error('Invite code has reached maximum uses');
        return false;
      }

      // Promote user and update invite usage
      await this.promoteUserToAdmin(userId);
      
      await updateDoc(doc(firestore, 'adminInvites', inviteCode), {
        usedCount: inviteData.usedCount + 1
      });

      return true;
    } catch (error) {
      console.error('Admin invite validation failed:', error);
      throw error;
    }
  }

  // Promote a user to admin role
  private static async promoteUserToAdmin(userId: string): Promise<void> {
    try {
      const userRef = doc(firestore, 'users', userId);
      
      await updateDoc(userRef, {
        role: 'admin'
      });
    } catch (error) {
      console.error('Failed to promote user to admin:', error);
      throw error;
    }
  }

  // Get admin invite codes (for admin management)
  static async getAdminInviteCodes(): Promise<Array<{
    code: string;
    createdAt: Date;
    usedCount: number;
    maxUses: number;
  }>> {
    try {
      const invitesQuery = collection(firestore, 'adminInvites');
      const snapshot = await getDocs(invitesQuery);

      return snapshot.docs.map(doc => ({
        code: doc.data().code,
        createdAt: doc.data().createdAt.toDate(),
        usedCount: doc.data().usedCount,
        maxUses: doc.data().maxUses
      }));
    } catch (error) {
      console.error('Failed to retrieve admin invite codes:', error);
      throw error;
    }
  }
}
