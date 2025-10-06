import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // Add logging to identify when postgres package is being imported
      {
        name: 'postgres-import-logger',
        resolveId(id: string) {
          if (id.includes('postgres') || id.includes('bytes.js')) {
            // Debug logging removed
          }
          return null;
        },
        load(id: string) {
          if (id.includes('postgres') || id.includes('bytes.js')) {
            // Debug logging removed
          }
          return null;
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Add Buffer polyfill
        'buffer': 'buffer',
      },
    },
    define: {
      // Add global flag to track if Buffer is available
      global: 'globalThis',
      // Add Buffer polyfill
      'Buffer': 'globalThis.Buffer',
      // Add process polyfill with proper fallback
      'process': 'globalThis.process || { env: {} }',
      // Make environment variables available
      __APP_ENV__: JSON.stringify(env),
    },
    optimizeDeps: {
      // Force Vite to pre-bundle these dependencies to see the error earlier
      include: ['postgres', 'drizzle-orm', 'buffer'],
      force: true,
    },
    // Add build configuration to handle Buffer
    build: {
      rollupOptions: {
        output: {
          globals: {
            buffer: 'Buffer',
          },
        },
      },
    },
  };
});
