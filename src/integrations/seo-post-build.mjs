// Runs after @astrojs/sitemap:
// 1) removes any page carrying <meta name="robots" content="noindex"> from the sitemap
// 2) on Vercel production builds, pings IndexNow (Bing, Yandex, and partners) with the indexable URLs
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const INDEXNOW_KEY = '60d20ce8da00b0a5c2ff537232ffa082';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

export default function seoPostBuild({ site }) {
  return {
    name: 'seo-post-build',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const noindex = new Set();
        for (const file of await walk(root)) {
          const html = await readFile(file, 'utf8');
          if (/<meta name="robots" content="noindex/.test(html)) {
            const rel = path.relative(root, path.dirname(file)).split(path.sep).join('/');
            noindex.add(new URL(rel ? rel + '/' : '', site).href);
          }
        }
        const kept = [];
        for (const f of (await readdir(root)).filter((n) => /^sitemap-\d+\.xml$/.test(n))) {
          const p = path.join(root, f);
          let xml = await readFile(p, 'utf8');
          xml = xml.replace(/<url><loc>([^<]+)<\/loc>.*?<\/url>/g, (m, loc) => (noindex.has(loc) ? '' : (kept.push(loc), m)));
          await writeFile(p, xml);
        }
        logger.info(`sitemap: ${kept.length} indexable URLs, ${noindex.size} noindex pages removed`);

        if (process.env.VERCEL_ENV === 'production' && kept.length) {
          try {
            const host = new URL(site).host;
            const res = await fetch('https://api.indexnow.org/indexnow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: new URL(`/${INDEXNOW_KEY}.txt`, site).href, urlList: kept }),
            });
            logger.info(`IndexNow ping: ${res.status}`);
          } catch (err) {
            logger.warn(`IndexNow ping failed: ${err}`);
          }
        }
      },
    },
  };
}
