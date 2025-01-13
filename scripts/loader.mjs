import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

console.log('Loader script started');

try {
  const loaderPath = import.meta.url;
  const baseUrl = new URL('../', loaderPath);

  console.log('Loader path:', loaderPath);
  console.log('Base URL:', baseUrl.href);

  // Use register() directly
  register('ts-node/esm', baseUrl);
  console.log('TypeScript loader registered successfully');
} catch (error) {
  console.error('Error registering TypeScript loader:', error);
  process.exit(1);
}
