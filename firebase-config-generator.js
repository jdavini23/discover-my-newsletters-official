const fs = require('fs');
const path = require('path');

function generateFirebaseConfig() {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  // Frontend config
  const frontendConfigPath = path.resolve(
    __dirname,
    'newsletter-frontend',
    'src',
    'firebaseConfig.ts'
  );
  const frontendConfigContent = `export const firebaseConfig = ${JSON.stringify(config, null, 2)};`;

  // Backend config
  const backendConfigPath = path.resolve(
    __dirname,
    'newsletter-backend',
    'src',
    'firebaseConfig.ts'
  );
  const backendConfigContent = `export const firebaseConfig = ${JSON.stringify(config, null, 2)};`;

  fs.writeFileSync(frontendConfigPath, frontendConfigContent);
  fs.writeFileSync(backendConfigPath, backendConfigContent);

  console.log('Firebase configs generated successfully!');
}

generateFirebaseConfig();
