import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

console.log('Loader script started');

try {
  register('ts-node/esm', pathToFileURL('./'));
  console.log('TypeScript loader registered successfully');
} catch (error) {
  console.error('Error registering TypeScript loader:', error);
  process.exit(1);
}
