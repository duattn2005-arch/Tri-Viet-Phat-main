import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import {defineConfig} from 'vite';
import {seoPlugin, SITE_URL} from './seo-plugin';
import {newsIndexPlugin} from './news-index-plugin';

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), newsIndexPlugin(), seoPlugin()],
    // Canonical/Open Graph URLs use the same domain at runtime as the build-time sitemap
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(SITE_URL),
    },
    resolve: {
      alias: {
        '@': ROOT_DIR,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
