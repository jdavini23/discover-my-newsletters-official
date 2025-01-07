import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { firebaseAdmin } from '../src/config/firebaseAdmin';

// Load environment variables
dotenv.config();

async function testFirebaseAdmin() {
  try {
    console.log('🔥 Testing Firebase Admin Initialization 🔥');

    // Ensure Firebase Admin is initialized
    if (admin.apps.length === 0) {
      console.error('❌ Firebase Admin not initialized');
      process.exit(1);
    }

    // Log the number of initialized apps from imported firebaseAdmin
    console.log('Initialized Apps:', firebaseAdmin.apps.length);

    // Verify environment variables
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('Private Key Length:', process.env.FIREBASE_PRIVATE_KEY?.length);

    // Try to get the current user (this will test authentication)
    try {
      // List users and log the first user's information if available
      const listUsersResult = await admin.auth().listUsers(1);
      if (listUsersResult.users.length > 0) {
        console.log('First user found:', listUsersResult.users[0].uid);
      } else {
        console.log('No users found in the Firebase project');
      }
      console.log('✅ Successfully connected to Firebase Authentication');
    } catch (error) {
      console.error('❌ Error connecting to Firebase Authentication:', error);
      process.exit(1);
    }

    console.log('🎉 Firebase Admin configuration is SUCCESSFUL! 🎉');
  } catch (error) {
    console.error('❌ Error testing Firebase Admin:', error);
    process.exit(1);
  }
}

testFirebaseAdmin();
