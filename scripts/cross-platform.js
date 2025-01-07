const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isWindows = os.platform() === 'win32';

function runCommand(command, args, options = {}) {
  const cmd = isWindows && command === 'npm' ? 'npm.cmd' : command;
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', ...options });

    proc.on('error', error => {
      reject(new Error(`Failed to start command: ${error.message}`));
    });

    proc.on('close', code => {
      // For npm audit, we don't want to fail if vulnerabilities are found
      if (args[0] === 'audit' && code === 1) {
        console.log('⚠️  Vulnerabilities found, but continuing...');
        resolve();
        return;
      }

      // For npm outdated, exit code 1 means outdated packages found
      if (args[0] === 'outdated' && code === 1) {
        console.log('⚠️  Outdated packages found, but continuing...');
        resolve();
        return;
      }

      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
        return;
      }
      resolve();
    });
  });
}

async function diagnoseNpm() {
  console.log('🔍 Running npm diagnostics...');
  let hasErrors = false;

  try {
    // Check npm version
    console.log('\n📊 Checking npm version...');
    await runCommand('npm', ['--version']);

    // Verify cache
    console.log('\n📦 Verifying npm cache...');
    try {
      await runCommand('npm', ['cache', 'verify']);
    } catch (error) {
      console.log('⚠️  Cache verification failed, but continuing...');
      hasErrors = true;
    }

    // Check for outdated packages
    console.log('\n🔄 Checking for outdated packages...');
    try {
      await runCommand('npm', ['outdated']);
    } catch (error) {
      console.log('⚠️  Some packages are outdated, but continuing...');
      hasErrors = true;
    }

    // Audit dependencies
    console.log('\n🛡️ Running security audit...');
    try {
      await runCommand('npm', ['audit']);
    } catch (error) {
      console.log('⚠️  Security audit found issues, but continuing...');
      hasErrors = true;
    }

    if (hasErrors) {
      console.log(
        '\n⚠️  Some non-critical issues were found. Run `npm run fix` to attempt to resolve them.'
      );
    } else {
      console.log('\n✅ All checks passed successfully!');
    }
  } catch (error) {
    console.error('\n❌ Critical error:', error.message);
    process.exit(1);
  }
}

async function fixNpm() {
  console.log('🔧 Attempting to fix npm issues...');

  try {
    // Clean npm cache
    console.log('\n🧹 Cleaning npm cache...');
    try {
      await runCommand('npm', ['cache', 'clean', '--force']);
    } catch (error) {
      console.log('⚠️  Cache cleaning failed, but continuing...');
    }

    // Remove node_modules and package-lock.json
    console.log('\n🗑️ Removing node_modules and package-lock.json...');
    if (fs.existsSync('node_modules')) {
      fs.rmSync('node_modules', { recursive: true, force: true });
    }
    if (fs.existsSync('package-lock.json')) {
      fs.unlinkSync('package-lock.json');
    }

    // Reinstall dependencies
    console.log('\n📥 Reinstalling dependencies...');
    await runCommand('npm', ['install']);

    // Run audit fix
    console.log('\n🛠️ Running audit fix...');
    try {
      await runCommand('npm', ['audit', 'fix']);
    } catch (error) {
      console.log('⚠️  Some vulnerabilities could not be fixed automatically.');
      console.log('   Please review the audit report and fix critical issues manually.');
    }

    console.log('\n✅ Fix completed! Run `npm run diagnose` to verify the results.');
  } catch (error) {
    console.error('\n❌ Critical error:', error.message);
    process.exit(1);
  }
}

const command = process.argv[2];
switch (command) {
  case 'diagnose':
    diagnoseNpm();
    break;
  case 'fix':
    fixNpm();
    break;
  default:
    console.error('Unknown command. Use "diagnose" or "fix"');
    process.exit(1);
}
