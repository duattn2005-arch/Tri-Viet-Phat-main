import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import {defineConfig} from 'vite';
import {seoPlugin, SITE_URL} from './seo-plugin';
import {newsIndexPlugin} from './news-index-plugin';
import {adminSchemaPlugin} from './admin-schema-plugin';

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  // `vite build --mode wp` (npm run build:wp): the app for the WordPress theme in wordpress/. Only the website
  // page, with relative asset URLs (the theme folder's address is only known on the WordPress site); the
  // theme's PHP writes the <head>, the SEO and the content (src/wp.ts), so the SEO plugin and public/ are left out.
  const wp = mode === 'wp';
  return {
    base: wp ? './' : '/',
    publicDir: wp ? false : 'public',
    plugins: [react(), tailwindcss(), newsIndexPlugin(), ...(wp ? [] : [seoPlugin(), adminSchemaPlugin()])],
    // Canonical/Open Graph URLs use the same domain at runtime as the build-time sitemap
    // (in WordPress, the site's own domain: App.tsx falls back to window.location.origin)
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(wp ? '' : SITE_URL),
    },
    // Two pages: the website, and the WordPress-style admin at /admin/ (src/admin/)
    build: wp
      ? {
          outDir: path.resolve(ROOT_DIR, 'wordpress/.build/app'),
          emptyOutDir: true,
          manifest: 'manifest.json',
          rollupOptions: { input: { main: path.resolve(ROOT_DIR, 'index.html') } },
        }
      : {
          rollupOptions: {
            input: {
              main: path.resolve(ROOT_DIR, 'index.html'),
              admin: path.resolve(ROOT_DIR, 'admin/index.html'),
            },
          },
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
