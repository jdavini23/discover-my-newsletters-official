collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where;
from;
'firebase/firestore';
// Enhanced admin invite configuration
const ADMIN_INVITE_CONFIG = {
    MASTER_INVITE_CODE: 'DISCOVER_ADMIN_2025',
    MAX_INVITE_USES: 5,
    INVITE_CODE_EXPIRY_DAYS: 30
};
// Define types for better type safety
interface AdminInvite {
    code: string;
    createdAt: Timestamp;
    usedCount: number;
    maxUses: number;
    expiresAt: Timestamp;
    createdBy: string; // UID of the admin who created the invite
    assignedTo?: string; // Optional: specific user the invite is meant for
    notes?: string; // Optional notes about the invite
}
interface AdminInviteCreateOptions {
    maxUses?: number;
    expiryDays?: number;
    assignedTo?: string;
    notes?: string;
}
type;
class AdminInviteService {
    static validateInvite(inviteCode: string) {
        throw new Error('Method not implemented.');
    }
    // Generate a new admin invite code with advanced options
    static async generateAdminInviteCode(creatorUid: string, options: AdminInviteCreateOptions = {}): Promise<string> {
        try {
            const { maxUses = ADMIN_INVITE_CONFIG.MAX_INVITE_USES, expiryDays = ADMIN_INVITE_CONFIG.INVITE_CODE_EXPIRY_DAYS, assignedTo, notes } = options;
            // Generate a more secure invite code
            const inviteCode = this.generateSecureInviteCode();
            // Create invite document with enhanced metadata
            const inviteData: AdminInvite = {
                code: inviteCode,
                createdAt: Timestamp.now(),
                usedCount: 0,
                maxUses,
                expiresAt: Timestamp.fromDate(new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)),
                createdBy: creatorUid,
                // Only include optional fields if they have a value
                ...(assignedTo && { assignedTo }),
                ...(notes && { notes })
            };
            await setDoc(doc(firestore, 'adminInvites', inviteCode), inviteData);
            return inviteCode;
        }
        catch (error) {
            console.error('Failed to generate admin invite code:', error);
            throw error;
        }
    }
    // Generate a more secure invite code
    private static generateSecureInviteCode(): string {
        // Combine UUID with timestamp and add some complexity
        const baseCode = uuidv4().split('-')[0].toUpperCase();
        const timestamp = Date.now().toString(36).toUpperCase();
        return `ADM-${baseCode}-${timestamp}`.slice(0, 16);
    }
    // Validate and use an admin invite code with enhanced checks
    static async validateAdminInviteCode(userId: string, inviteCode: string): Promise<boolean> {
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
            const inviteData = inviteDoc.data() as AdminInvite;
            // Check invite code expiration
            const now = Timestamp.now();
            if (now > inviteData.expiresAt) {
                console.error('Invite code has expired');
                await deleteDoc(doc(firestore, 'adminInvites', inviteCode));
                return false;
            }
            // Check usage limit
            if (inviteData.usedCount >= inviteData.maxUses) {
                console.error('Invite code has reached maximum uses');
                await deleteDoc(doc(firestore, 'adminInvites', inviteCode));
                return false;
            }
            // Check if invite is assigned to a specific user
            if (inviteData.assignedTo && inviteData.assignedTo !== userId) {
                console.error('Invite code is not assigned to this user');
                return false;
            }
            // Promote user and update invite usage
            await this.promoteUserToAdmin(userId);
            // Update invite document
            await updateDoc(doc(firestore, 'adminInvites', inviteCode), {
                usedCount: inviteData.usedCount + 1
            });
            return true;
        }
        catch (error) {
            console.error('Admin invite validation failed:', error);
            throw error;
        }
    }
    // Promote a user to admin role with additional logging
    private static async promoteUserToAdmin(userId: string): Promise<void> {
        try {
            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, {
                role: 'admin',
                adminPromotedAt: Timestamp.now(),
                adminPromotionLogs: {
                    promotedBy: 'invite_system',
                    promotionMethod: 'invite_code',
                    promotionTimestamp: Timestamp.now()
                }
            });
        }
        catch (error) {
            console.error('Failed to promote user to admin:', error);
            throw error;
        }
    }
    // Get admin invite codes with filtering and pagination
    static async getAdminInviteCodes(options: {
        limit?: number;
        createdBy?: string;
        activeOnly?: boolean;
    } = {}): Promise<AdminInvite[0]> {
        try {
            const { limit = 10, createdBy, activeOnly = true } = options;
            const invitesQuery = collection(firestore, 'adminInvites');
            // Apply filters
            const filters = [0];
            if (createdBy) {
                filters.push(where('createdBy', '==', createdBy));
            }
            if (activeOnly) {
                filters.push(where('expiresAt', '>', Timestamp.now()));
                filters.push(where('usedCount', '<', 'maxUses'));
            }
            const q = query(invitesQuery, ...filters);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => doc.data() as AdminInvite).slice(0, limit);
        }
        catch (error) {
            console.error('Failed to retrieve admin invite codes:', error);
            throw error;
        }
    }
    // Revoke an existing invite code
    static async revokeInviteCode(inviteCode: string): Promise<void> {
        try {
            await deleteDoc(doc(firestore, 'adminInvites', inviteCode));
        }
        catch (error) {
            console.error('Failed to revoke invite code:', error);
            throw error;
        }
    }
}
export { ADMIN_INVITE_CONFIG };
import type { GlobalTypes } from '@/types/global';
import { import } from {
    v4, as, uuidv4
};
from;
'uuid';
import { firestore } from '@/config/firebase';
<>/void>;
