import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/lib/credential';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: process.cwd() + '/.env' });

// Ensure the app is only initialized once
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || '';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  console.log('Firebase Config:', {
    projectId: !!projectId,
    clientEmail: !!clientEmail,
    privateKeyLength: privateKey.length,
  });

  // Validate service account config
  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase service account configuration');
    console.error('Environment Variables:', {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length,
    });
    throw new Error('Firebase service account configuration is incomplete');
  }

  const serviceAccountConfig: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
    // Optional: Add other configuration like database URL if needed
  });
}

export const firebaseAdmin = admin;

// Utility functions for admin operations
export const verifyIdToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    return await firebaseAdmin.auth().verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying token', error);
    throw error;
  }
};

export const createAdminUser = async (
  email: string,
  password: string
): Promise<admin.auth.UserRecord> => {
  try {
    const user = await firebaseAdmin.auth().createUser({
      email,
      password,
      emailVerified: false,
    });

    // Optional: Set custom claims for admin
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, { admin: true });

    return user;
  } catch (error) {
    console.error('Error creating admin user', error);
    throw error;
  }
};
