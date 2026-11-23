/**
 * Shared build-time access to the blog data (TypeScript) from plain Node scripts.
 * Used by generate-sitemap.mjs and prerender.mjs so the sitemap, the prerendered pages
 * and the app itself always agree about which posts exist and which are indexable.
 */
import { build } from 'esbuild';
import { resolve } from 'node:path';

const ROOT = resolve('.');

export const SITE_URL = 'https://www.geo-server-data-downloader.com';

export const CORE_ROUTES = [
  '/',
  '/download',
  '/converter',
  '/geopdf-to-geotiff',
  '/discover',
  '/data',
  '/documentation',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export async function loadBlog() {
  const result = await build({
    stdin: {
      contents: [
        "export { BLOG_POSTS } from './src/data/blogPosts';",
        "export { DATA_TOPICS } from './src/data/dataTopics';",
        "export { isIndexable, countWords, REDIRECTED_SLUGS, MIN_INDEXABLE_WORDS } from './src/data/blogSeo';",
      ].join('\n'),
      resolveDir: ROOT,
      loader: 'ts',
      sourcefile: 'seo-entry.ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
