import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function validateFirebaseCredentials() {
  console.log('🔍 Firebase Credentials Validation Tool 🔍');
  console.log('');

  // Check environment variables
  const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];

  let isValid = true;
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}: ${value ? 'PRESENT' : 'MISSING'}`);
    if (!value) isValid = false;
  });

  if (!isValid) {
    console.error('\n❌ Invalid Firebase Credentials Configuration');
    console.error('Please ensure all required environment variables are set correctly.');
    process.exit(1);
  }

  // Validate private key format
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  if (
    !privateKey.startsWith('-----BEGIN PRIVATE KEY-----') ||
    !privateKey.endsWith('-----END PRIVATE KEY-----\n')
  ) {
    console.error('\n❌ Invalid Private Key Format');
    console.error('The private key should start with "-----BEGIN PRIVATE KEY-----"');
    console.error('and end with "-----END PRIVATE KEY-----\n"');
    process.exit(1);
  }

  // Attempt to initialize Firebase Admin
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    console.log('\n✅ Firebase Credentials are VALID');
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('Private Key Length:', process.env.FIREBASE_PRIVATE_KEY?.length);
  } catch (error) {
    console.error('\n❌ Failed to initialize Firebase Admin:', error);
    process.exit(1);
  }
}

validateFirebaseCredentials();
