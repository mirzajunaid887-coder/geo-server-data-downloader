/**
 * Writes public/sitemap.xml from the real blog data.
 *  - only indexable posts are listed (thin and merged posts are excluded),
 *  - <lastmod> is the post's real dateModified (core pages omit it rather than lie),
 *  - fails the build if vercel.json redirects are out of sync with REDIRECTED_SLUGS.
 * Runs automatically before `vite build` (see package.json).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { loadBlog, CORE_ROUTES, SITE_URL } from './seo-data.mjs';

const { DATA_TOPICS, BLOG_POSTS, isIndexable, REDIRECTED_SLUGS, MIN_INDEXABLE_WORDS } = await loadBlog();

// ---- keep vercel.json redirects in sync -------------------------------------------------
const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
const have = new Map((vercel.redirects ?? []).map((r) => [r.source, r.destination]));
const problems = [];
if (have.get('/downloader') !== '/download') problems.push('/downloader -> /download');
for (const [from, to] of Object.entries(REDIRECTED_SLUGS)) {
  if (have.get(`/blog/${from}`) !== `/blog/${to}`) problems.push(`/blog/${from} -> /blog/${to}`);
}
if (problems.length) {
  console.error('vercel.json is missing these redirects:\n  ' + problems.join('\n  '));
  process.exit(1);
}

// ---- sitemap ---------------------------------------------------------------------------
const posts = BLOG_POSTS.filter(isIndexable).sort(
  (a, b) => new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
);
const newest = posts[0]?.dateModified;

const url = (path, lastmod) =>
  `  <url>\n    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}  </url>`;

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...CORE_ROUTES.map((r) => url(r, r === '/blog' ? newest : undefined)),
  ...DATA_TOPICS.map((t) => url(`/data/${t.slug}`, t.dateModified)),
  ...posts.map((p) => url(`/blog/${p.slug}`, p.dateModified)),
  '</urlset>',
  '',
].join('\n');

await writeFile('public/sitemap.xml', xml);
console.log(
  `sitemap.xml: ${CORE_ROUTES.length} core pages + ${posts.length} indexable posts ` +
    `(${BLOG_POSTS.length - posts.length} posts excluded: merged or under ${MIN_INDEXABLE_WORDS} words)`
);
