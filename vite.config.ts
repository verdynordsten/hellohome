import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        'buffer': 'buffer',
      },
    },
    define: {
      global: 'globalThis',
      'Buffer': 'globalThis.Buffer',
      'process.env': JSON.stringify({
        NODE_ENV: env.NODE_ENV || 'production',
        DATABASE_URL: env.DATABASE_URL || '',
        VITE_APP_NAME: env.VITE_APP_NAME || '',
        VITE_APP_URL: env.VITE_APP_URL || '',
      }),
      __APP_ENV__: JSON.stringify(env),
    },
    optimizeDeps: {
      include: ['postgres', 'drizzle-orm', 'buffer'],
      force: true,
    },
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
