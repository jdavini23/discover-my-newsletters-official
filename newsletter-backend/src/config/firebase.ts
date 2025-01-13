import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/li/b/credential';/

// Ensure environment variables are loaded/
const serviceAccountKey: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\/n/g, '\n'),/
};

console.log('Firebase Config:', {
  projectId: serviceAccountKey.projectId,
  clientEmail: serviceAccountKey.clientEmail,
  privateKeyExists: !!serviceAccountKey.privateKey,
});

// Initialize Firebase Admin SDK/
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      // Add other configuration options if needed/
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.log('Firebase Admin SDK already initialized');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export default admin;

