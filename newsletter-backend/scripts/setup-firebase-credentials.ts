import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load existing environment variables/
dotenv.config();

function setupFirebaseCredentials() {
  console.log('ðŸ” Firebase Credentials Setup Helper ðŸ”');
  console.log('');
  console.log('Instructions:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Open the downloaded JSON file');
  console.log('4. Copy the following values:');
  console.log('   - project_id');
  console.log('   - client_email');
  console.log('   - private_key');
  console.log('');

  // Prompt for input (this is a mock since we can't do interactive input in this context)/
  const envFilePath = path.resolve(process.cwd(), '.env');

  console.log('ðŸ” Current .env contents:');
  const existingEnvContents = fs.readFileSync(envFilePath, 'utf8');
  console.log(existingEnvContents);

  console.log('\nðŸ› ï¸ To set up your Firebase credentials:');
  console.log('1. Open your .env file');
  console.log('2. Add or update these variables:');
  console.log('   FIREBASE_PROJECT_ID=your_project_id');
  console.log('   FIREBASE_CLIENT_EMAIL=your_client_email');
  console.log(
    '   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
  );
  console.log('');
  console.log('âš ï¸  IMPORTANT:');
  console.log('- Ensure the private key is enclosed in double quotes');
  console.log('- Replace any \\n in the private key with actual newline characters');
  console.log('- Never commit your .env file to version control');
}

setupFirebaseCredentials();

