import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

function diagnoseFirebaseConfig() {
  console.log('🔍 Firebase Configuration Diagnostic Tool 🔍');

  // Check environment variables
  console.log('\n📋 Environment Variables:');
  const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];

  let allEnvVarsPresent = true;
  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    console.log(`- ${varName}: ${value ? 'PRESENT' : 'MISSING'}`);
    if (!value) {
      allEnvVarsPresent = false;
      console.error(`❌ Missing required environment variable: ${varName}`);
    }
  });

  // Exit if any required env vars are missing
  if (!allEnvVarsPresent) {
    console.error('❌ Not all required environment variables are set');
    process.exit(1);
  }

  // Check Firebase Admin initialization
  console.log('\n🔥 Firebase Admin Initialization:');
  console.log('Number of initialized apps:', admin.apps.length);

  // Attempt to initialize Firebase Admin
  try {
    if (!admin.apps.length) {
      const serviceAccountConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      console.log('\n🚀 Attempting to initialize Firebase Admin:');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountConfig),
      });

      console.log('✅ Firebase Admin successfully initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
  }

  // Check Firebase configuration file
  console.log('\n📄 Firebase Admin Configuration File:');
  const configPath = path.resolve(__dirname, '../src/config/firebaseAdmin.ts');
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    console.log('Configuration file found and readable');
    console.log('File contents:\n', configContent);
  } catch (error) {
    console.error('❌ Error reading Firebase Admin configuration file:', error);
  }
}

diagnoseFirebaseConfig();
