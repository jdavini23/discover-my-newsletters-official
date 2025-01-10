const fs = require('fs');
const path = require('path');
const readline = require('readline');

function loadEnvFile(filePath) {
  const envContents = fs.readFileSync(filePath, 'utf8');
  const envLines = envContents.split('\n');
  const envConfig = {};

  envLines.forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      envConfig[key.trim()] = value.trim();
    }
  });

  return envConfig;
}

function updateEnvFile(filePath, updates) {
  let envContents = fs.readFileSync(filePath, 'utf8');

  Object.entries(updates).forEach(([key, value]) => {
    const keyRegex = new RegExp(`^${key}=.*$`, 'm');

    if (envContents.match(keyRegex)) {
      // Replace existing key
      envContents = envContents.replace(keyRegex, `${key}=${value}`);
    } else {
      // Add new key at the end
      envContents += `\n${key}=${value}`;
    }
  });

  fs.writeFileSync(filePath, envContents);
}

async function promptForFirebaseConfig() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = (question) =>
    new Promise((resolve) => {
      rl.question(question, resolve);
    });

  console.log('\n🔥 Firebase Configuration Setup 🔥');
  console.log('-----------------------------------');
  console.log('Before you begin, make sure you have:');
  console.log('1. Generated a Firebase service account key');
  console.log('2. Downloaded the JSON file from Firebase Console');
  console.log('\nLocate the JSON file and copy the following values:');

  const projectId = await prompt('\nEnter Firebase Project ID: ');
  const clientEmail = await prompt('Enter Firebase Client Email: ');
  const privateKey = await prompt(
    'Enter Firebase Private Key (paste entire key, including BEGIN and END lines): '
  );

  rl.close();

  return {
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: `"${privateKey.replace(/\n/g, '\\n')}"`, // Escape newlines
  };
}

async function main() {
  const envExamplePath = path.resolve(__dirname, '../.env.example');
  const envPath = path.resolve(__dirname, '../.env');

  // Ensure .env file exists
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
  }

  // Prompt for Firebase configuration
  const firebaseConfig = await promptForFirebaseConfig();

  // Update .env file
  updateEnvFile(envPath, firebaseConfig);

  console.log('\n✅ Firebase configuration successfully added to .env file!');
  console.log('\n🔒 Important security notes:');
  console.log('1. NEVER commit your .env file to version control');
  console.log('2. Keep your service account key confidential');
  console.log('3. Add .env to your .gitignore file');
}

main().catch(console.error);
