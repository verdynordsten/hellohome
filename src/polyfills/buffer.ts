// Buffer polyfill for browser environment
import { Buffer as BufferPolyfill } from 'buffer';

// Set Buffer globally in multiple ways to ensure it's accessible
if (typeof window !== 'undefined') {
  (window as Window & { Buffer?: typeof BufferPolyfill; global?: typeof globalThis }).Buffer = BufferPolyfill;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as typeof globalThis & { Buffer?: typeof BufferPolyfill; global?: typeof globalThis }).Buffer = BufferPolyfill;
  (globalThis as typeof globalThis & { Buffer?: typeof BufferPolyfill; global?: typeof globalThis }).global = globalThis;
}

// Export for TypeScript
export { BufferPolyfill as Buffer };