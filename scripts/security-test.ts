import axios from 'axios';
import chalk from 'chalk';

const API_URL = process.env.API_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  success: boolean;
  message?: string;
  error?: any;
}

async function testSecurityHeaders() {
  try {
    const response = await axios.get(`${API_URL}/health`);
    const headers = response.headers;

    const results: TestResult[] = [
      {
        name: 'Content-Security-Policy',
        success: !!headers['content-security-policy'],
        message: 'CSP header is present',
      },
      {
        name: 'X-Frame-Options',
        success: headers['x-frame-options'] === 'DENY',
        message: 'X-Frame-Options is set to DENY',
      },
      {
        name: 'X-Content-Type-Options',
        success: headers['x-content-type-options'] === 'nosniff',
        message: 'X-Content-Type-Options is set correctly',
      },
      {
        name: 'Strict-Transport-Security',
        success: !!headers['strict-transport-security'],
        message: 'HSTS is enabled',
      },
      {
        name: 'X-XSS-Protection',
        success: headers['x-xss-protection'] === '1; mode=block',
        message: 'XSS Protection is enabled',
      },
    ];

    return results;
  } catch (error) {
    return [
      {
        name: 'Security Headers',
        success: false,
        error: error.message,
      },
    ];
  }
}

async function testCsrfProtection() {
  try {
    // Try to make a POST request without CSRF token
    try {
      await axios.post(`${API_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'password123',
      });
      return {
        name: 'CSRF Protection',
        success: false,
        message: 'POST request without CSRF token was allowed',
      };
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          name: 'CSRF Protection',
          success: true,
          message: 'CSRF protection is working correctly',
        };
      }
      throw error;
    }
  } catch (error) {
    return {
      name: 'CSRF Protection',
      success: false,
      error: error.message,
    };
  }
}

async function testRateLimiting() {
  try {
    const requests = Array(11)
      .fill(null)
      .map(() => axios.get(`${API_URL}/health`));

    try {
      await Promise.all(requests);
      return {
        name: 'Rate Limiting',
        success: false,
        message: 'Rate limiting is not working',
      };
    } catch (error) {
      if (error.response?.status === 429) {
        return {
          name: 'Rate Limiting',
          success: true,
          message: 'Rate limiting is working correctly',
        };
      }
      throw error;
    }
  } catch (error) {
    return {
      name: 'Rate Limiting',
      success: false,
      error: error.message,
    };
  }
}

async function runSecurityTests() {
  console.log(chalk.blue('🔒 Starting Security Tests...\n'));

  // Test Security Headers
  console.log(chalk.yellow('Testing Security Headers...'));
  const headerResults = await testSecurityHeaders();
  headerResults.forEach((result) => {
    if (result.success) {
      console.log(chalk.green(`✓ ${result.name}: ${result.message}`));
    } else {
      console.log(chalk.red(`✗ ${result.name}: ${result.error || 'Failed'}`));
    }
  });

  // Test CSRF Protection
  console.log(chalk.yellow('\nTesting CSRF Protection...'));
  const csrfResult = await testCsrfProtection();
  if (csrfResult.success) {
    console.log(chalk.green(`✓ ${csrfResult.name}: ${csrfResult.message}`));
  } else {
    console.log(chalk.red(`✗ ${csrfResult.name}: ${csrfResult.error || csrfResult.message}`));
  }

  // Test Rate Limiting
  console.log(chalk.yellow('\nTesting Rate Limiting...'));
  const rateLimitResult = await testRateLimiting();
  if (rateLimitResult.success) {
    console.log(chalk.green(`✓ ${rateLimitResult.name}: ${rateLimitResult.message}`));
  } else {
    console.log(
      chalk.red(`✗ ${rateLimitResult.name}: ${rateLimitResult.error || rateLimitResult.message}`)
    );
  }

  console.log(chalk.blue('\n🔒 Security Tests Completed'));
}

// Run the tests
runSecurityTests().catch(console.error);
