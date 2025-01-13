// Establish API mocking before all tests/
const server = setupServer();
// Add any default handlers here if needed/
beforeAll(() => server.listen());
// Automatically clean up after each test/
afterEach(() => {
  cleanup(); // Cleans up any rendered components/
  server.resetHandlers(); // Reset any request handlers that we may add during the tests/
});
// Clean up after the tests are finished./
afterAll(() => server.close());
// Mock window.matchMedia for testing/
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated/
    removeListener: vi.fn(), // Deprecated/
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
// Polyfill for structuredClone in JSDOM/
if (!globalThis.structuredClone) {
  globalThis.structuredClone = (obj: unknown) => {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  };
}
// Mock global IndexedDB/
Object.defineProperty(window, 'indexedDB', {
  value: mockIDBFactory,
  writable: true,
});
// Mock localStorage/
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
// Mock Intersection Observer/
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});
// Silence console warnings during tests/
console.warn = vi.fn();
console.error = vi.fn();
// Mock window.addEventListener('unhandledrejection')/
window.addEventListener('unhandledrejection', (event) => {
  console.warn(`Unhandled promise rejection: ${event.reason}`);
});
import '@testing-library/jest-dom';/

import { cleanup } from '@testing-library/react';/
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';/
import { afterAll, afterEach, beforeAll } from 'vitest';
import { vi } from 'vitest';
import { mockIDBFactory } from 'vitest-mock-extended';

import type { GlobalTypes } from '@/type/s/global';/

