/**
 * Tells Bing (and other IndexNow search engines: Yandex, Seznam, Naver) which URLs exist or changed.
 * Runs at the END of "npm run build". It is optional and can NEVER fail your build.
 *  - Only runs on a production deploy on Vercel (VERCEL_ENV=production), or when you run it by hand with FORCE=1.
 *  - DRY=1 prints what it would send without sending anything.
 * The key file public/6c0be139d268b2b06fc0b2010487ac47.txt proves to the search engines that you own the site.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const KEY = '6c0be139d268b2b06fc0b2010487ac47';
const HOST = 'www.geo-server-data-downloader.com';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

try {
  const isProd = process.env.VERCEL_ENV === 'production';
  if (!isProd && !process.env.FORCE && !process.env.DRY) {
    console.log('indexnow: skipped (not a production deploy)');
    process.exit(0);
  }
  const file = existsSync('dist/sitemap.xml') ? 'dist/sitemap.xml' : 'public/sitemap.xml';
  const xml = await readFile(file, 'utf8');
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes(HOST));
  if (!urls.length) { console.log('indexnow: no URLs found in ' + file); process.exit(0); }
  const body = { host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls.slice(0, 9000) };
  if (process.env.DRY) { console.log('indexnow DRY RUN: would send ' + urls.length + ' URLs from ' + file); process.exit(0); }
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
  console.log('indexnow: sent ' + urls.length + ' URLs, response ' + res.status + (res.status === 200 || res.status === 202 ? ' (accepted)' : ' (not accepted, build continues)'));
} catch (e) {
  console.log('indexnow: skipped (' + (e && e.message ? e.message : e) + ')');
}
