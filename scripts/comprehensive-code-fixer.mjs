import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Color utility for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

// Logging utility
function log(message, color = colors.green) {
  console.log(`${color}${message}${colors.reset}`);
}

// Function to install missing dependencies
function installDependencies() {
  log('Installing missing dependencies...');
  const dependencies = [
    'eslint-plugin-prettier',
    'eslint-plugin-simple-import-sort',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
  ];

  try {
    execSync(`npm install ${dependencies.join(' ')} --save-dev --legacy-peer-deps`, {
      stdio: 'inherit',
    });
    log('Dependencies installed successfully!', colors.green);
  } catch (error) {
    log('Error installing dependencies', colors.red);
    console.error(error);
  }
}

// Function to update ESLint configuration
function updateESLintConfig() {
  const eslintConfigPath = path.resolve(process.cwd(), '.eslintrc.json');

  try {
    const eslintConfigRaw = fs.readFileSync(eslintConfigPath, 'utf8');

    // More robust JSON parsing with additional error handling
    let eslintConfig;
    try {
      eslintConfig = JSON.parse(
        eslintConfigRaw.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2":')
      );
    } catch (parseError) {
      // Fallback to manual parsing if JSON.parse fails
      eslintConfig = eval(`(${eslintConfigRaw})`);
    }

    // Ensure arrays are properly initialized
    eslintConfig.extends = eslintConfig.extends || [];
    eslintConfig.plugins = eslintConfig.plugins || [];
    eslintConfig.rules = eslintConfig.rules || {};

    // Enhance ESLint configuration
    eslintConfig.extends = [
      ...new Set([
        ...eslintConfig.extends,
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ]),
    ];

    eslintConfig.plugins = [
      ...new Set([
        ...(eslintConfig.plugins || []),
        '@typescript-eslint',
        'simple-import-sort',
        'prettier',
      ]),
    ];

    eslintConfig.rules = {
      ...eslintConfig.rules,
      'no-console': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      'max-lines-per-function': ['warn', { max: 50 }],
      complexity: ['warn', { max: 10 }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    };

    // Write with proper JSON formatting
    fs.writeFileSync(eslintConfigPath, JSON.stringify(eslintConfig, null, 2), 'utf8');
    log('ESLint configuration updated successfully!', colors.green);
  } catch (error) {
    log('Error updating ESLint configuration', colors.red);
    console.error(error);
  }
}

// Function to update TypeScript configuration
function updateTSConfig() {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');

  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    // Enhance TypeScript configuration
    tsconfig.compilerOptions = {
      ...(tsconfig.compilerOptions || {}),
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      alwaysStrict: true,
    };

    // Write with proper JSON formatting
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
    log('TypeScript configuration updated successfully!', colors.green);
  } catch (error) {
    log('Error updating TypeScript configuration', colors.red);
    console.error(error);
  }
}

// Main function to run all fixes
function runCodeFix() {
  log('Starting comprehensive code fix...', colors.yellow);

  installDependencies();
  updateESLintConfig();
  updateTSConfig();

  // Run ESLint auto-fix
  try {
    log('Running ESLint auto-fix...', colors.yellow);
    execSync('npm run lint:fix', { stdio: 'inherit' });
    log('ESLint auto-fix completed successfully!', colors.green);
  } catch (error) {
    log('Error running ESLint auto-fix', colors.red);
    console.error(error);
  }

  // Type checking
  try {
    log('Running TypeScript type check...', colors.yellow);
    execSync('npm run typecheck', { stdio: 'inherit' });
    log('TypeScript type check completed successfully!', colors.green);
  } catch (error) {
    log('TypeScript type check found issues', colors.yellow);
    console.error(error);
  }

  log('Comprehensive code fix completed!', colors.green);
}

// Execute the fix
runCodeFix();
