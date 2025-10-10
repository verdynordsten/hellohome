declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: {
      env: {
        NODE_ENV: string;
        DATABASE_URL?: string;
        [key: string]: string | undefined;
      };
      version?: string;
      platform?: string;
      [key: string]: string | number | boolean | undefined | null;
    };
  }
}

export {};