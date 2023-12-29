
import path from 'path';
import react from '@vitejs/plugin-react';

import { createHtmlPlugin } from 'vite-plugin-html';

process.env.TARGET = process.env.TARGET || 'web';
const isCordova = process.env.TARGET === 'cordova';
const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(
  __dirname,
  isCordova ? './cordova/www' : './www',
);
export default async () => {

  return  {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            TARGET: process.env.TARGET,
          },
        },
      }),
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
    },

  };
}
