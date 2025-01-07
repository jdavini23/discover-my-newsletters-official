const fs = require('fs');
const path = require('path');

function setupFirebaseEnv() {
  const envExamplePath = path.resolve(__dirname, '../.env.example');
  const envPath = path.resolve(__dirname, '../.env');

  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env file from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
  }

  console.log('Firebase setup instructions:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project');
  console.log('3. Go to Project Settings > Service Accounts');
  console.log('4. Click "Generate new private key"');
  console.log('5. Open the downloaded JSON file');
  console.log('6. Update the following in your .env file:');
  console.log('   - FIREBASE_PROJECT_ID');
  console.log('   - FIREBASE_CLIENT_EMAIL');
  console.log('   - FIREBASE_PRIVATE_KEY (replace newlines with \\n)');
}

setupFirebaseEnv();
