import { Buffer as BufferPolyfill } from 'buffer';

if (typeof window !== 'undefined') {
  (window as Window & { Buffer?: typeof BufferPolyfill; global?: typeof globalThis }).Buffer = BufferPolyfill;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as typeof globalThis & { Buffer?: typeof BufferPolyfill; global?: typeof globalThis }).Buffer = BufferPolyfill;
  (globalThis as typeof globalThis & { Buffer?: typeof BufferPolyfill; global?: typeof globalThis }).global = globalThis;
}

export { BufferPolyfill as Buffer };