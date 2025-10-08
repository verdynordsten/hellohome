const processPolyfill = {
  env: {
    NODE_ENV: import.meta.env.MODE,
    VITE_DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  },
  version: '',
  platform: 'browser'
};

if (typeof window !== 'undefined') {
  (window as unknown as { process?: typeof processPolyfill }).process = processPolyfill;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { process?: typeof processPolyfill }).process = processPolyfill;
}

export default processPolyfill;