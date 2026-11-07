// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import seoPostBuild from './src/integrations/seo-post-build.mjs';
import { SITE } from './src/site.config.ts';

export default defineConfig({
  site: SITE.url,
  // Pages stay static; only routes with `export const prerender = false` (the newsletter API) run as a Vercel Function
  adapter: vercel(),
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      // Keep sample/placeholder listings out of the sitemap until real content replaces them
      filter: (page) => !page.includes('/biz/sample-'),
    }),
    // Must come after sitemap(): prunes noindex pages from it and pings IndexNow on production builds
    seoPostBuild({ site: SITE.url }),
  ],
});
