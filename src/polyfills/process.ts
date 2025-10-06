// Process polyfill for browser environment
// This is needed for libraries that expect Node.js process object

// Create a minimal process object
const processPolyfill = {
  env: {
    NODE_ENV: import.meta.env.MODE,
    // Add any environment variables that might be needed
    VITE_DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  },
  // Add other process properties if needed
  version: '',
  platform: 'browser',
  // Add any other process methods/properties that might be accessed
};

// Set process globally in multiple ways to ensure it's accessible
if (typeof window !== 'undefined') {
  (window as unknown as { process?: typeof processPolyfill }).process = processPolyfill;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { process?: typeof processPolyfill }).process = processPolyfill;
}

// Export for TypeScript
export default processPolyfill;