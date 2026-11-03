#!/usr/bin/env node
/**
 * AdSense / SEO readiness audit for a prerendered Vite SPA.
 *
 * Usage:
 *   node scripts/audit-adsense.mjs "D:\path\to\project"
 *
 * Reads <root>/public/sitemap.xml and <root>/dist/, then verifies that every
 * URL in the sitemap has a prerendered HTML file with a proper title,
 * description, canonical, single H1, and enough body text for an AdSense
 * reviewer to consider it substantive.
 *
 * Exit code 1 = at least one MUST-FIX failure.
 */

import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve(process.argv[2] || '.');
const DIST = join(root, 'dist');
const PUBLIC = join(root, 'public');

const MUST_FIX = [];
const WARN = [];
const PASS = [];

const ok = (m) => PASS.push(m);
const fail = (m) => MUST_FIX.push(m);
const warn = (m) => WARN.push(m);

// ---------------------------------------------------------------- helpers

async function readMaybe(path) {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ');
}

/**
 * Drop HTML comments before parsing. index.html carries a long comment block
 * that literally contains `<title>` and `<meta name="description">` as prose,
 * which otherwise matches before the real tags.
 */
function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function words(text) {
  return text.split(/\s+/).filter((w) => w.length > 1).length;
}

function pick(re, html) {
  const m = html.match(re);
  return m ? m[m.length - 1].trim() : null;
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function urlToFile(u) {
  const p = new URL(u).pathname;
  if (p === '/') return join(DIST, 'index.html');
  return join(DIST, p.replace(/^\/|\/$/g, ''), 'index.html');
}

// ---------------------------------------------------------------- checks

const SITE = new URL('https://www.geo-server-data-downloader.com');

// 1. ads.txt
const adsTxt = await readMaybe(join(PUBLIC, 'ads.txt'));
if (!adsTxt) {
  fail('public/ads.txt is missing');
} else if (!/google\.com,\s*pub-\d+,\s*DIRECT/i.test(adsTxt)) {
  fail('ads.txt does not contain a valid google.com publisher line');
} else {
  ok(`ads.txt present and valid (${adsTxt.trim().split(',')[1].trim()})`);
}

// 2. robots.txt
const robots = await readMaybe(join(PUBLIC, 'robots.txt'));
if (!robots) {
  fail('public/robots.txt is missing');
} else {
  if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) {
    fail('robots.txt blocks the entire site (Disallow: /)');
  } else if (!/Sitemap:/i.test(robots)) {
    warn('robots.txt has no Sitemap: line');
  } else {
    ok('robots.txt allows crawling and declares the sitemap');
  }
}

// 3. sitemap
const sitemap = await readMaybe(join(PUBLIC, 'sitemap.xml'));
if (!sitemap) {
  fail('public/sitemap.xml is missing');
}

const urls = sitemap
  ? [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])
  : [];

if (urls.length === 0) {
  fail('sitemap.xml contains no <loc> entries');
} else {
  ok(`sitemap.xml lists ${urls.length} URLs`);
}

// 4. per-page checks
const titles = new Map();
const missing = [];
let thin = 0;

for (const url of urls) {
  const file = urlToFile(url);
  const html = await readMaybe(file);

  if (!html) {
    missing.push(url);
    continue;
  }

  const clean = stripComments(html);
  const title = decode(pick(/<title[^>]*>([\s\S]*?)<\/title>/i, clean) || '');
  const desc = decode(
    pick(
      /<meta[^>]+name=["']description["'][^>]*?content=(["'])([\s\S]*?)\1/i,
      clean
    ) || ''
  );
  const canonical = pick(
    /<link[^>]+rel=["']canonical["'][^>]*?href=(["'])([^"']*)\1/i,
    clean
  );
  const h1s = (clean.match(/<h1[\s>]/gi) || []).length;
  const bodyWords = words(stripHtml(clean));

  if (!title) fail(`${url} — missing <title>`);
  else {
    if (title.length < 15 || title.length > 70) {
      warn(`${url} — title length ${title.length} (aim 15-70)`);
    }
    titles.set(title, (titles.get(title) || 0) + 1);
  }

  if (!desc) fail(`${url} — missing meta description`);
  else if (desc.length < 50 || desc.length > 170) {
    warn(`${url} — meta description length ${desc.length} (aim 50-170)`);
  }

  if (!canonical) fail(`${url} — missing canonical link`);

  if (h1s !== 1) warn(`${url} — ${h1s} H1 elements (expected 1)`);

  if (bodyWords < 300) {
    thin++;
    warn(`${url} — only ${bodyWords} words of visible text`);
  }
}

if (missing.length) {
  fail(
    `${missing.length} sitemap URL(s) have no prerendered HTML in dist/ — ` +
      `crawlers see an empty SPA shell:\n    ` +
      missing.slice(0, 12).join('\n    ') +
      (missing.length > 12 ? `\n    ...and ${missing.length - 12} more` : '')
  );
} else if (urls.length) {
  ok('every sitemap URL has a prerendered HTML file');
}

for (const [t, n] of titles) {
  if (n > 1) warn(`duplicate <title> used ${n}×: ${t.slice(0, 60)}`);
}

if (thin) warn(`${thin} page(s) under 300 words of visible text`);

// 5. AdSense loader present anywhere?
const indexHtml = await readMaybe(join(DIST, 'index.html'));
if (indexHtml) {
  const hasLoader =
    /googlesyndication\.com\/pagead\/js\/adsbygoogle/i.test(indexHtml) ||
    /pagead2\.googlesyndication/i.test(indexHtml);
  if (hasLoader) ok('AdSense loader script found in built index.html');
  else
    warn(
      'no AdSense loader in built index.html — if you inject it from a React ' +
        'component this is expected; confirm it loads in the browser Network tab'
    );
}

// ---------------------------------------------------------------- report

console.log('\n\x1b[1mAdSense readiness audit\x1b[0m — ' + root + '\n');

for (const p of PASS) console.log('  \x1b[32m✓\x1b[0m ' + p);
for (const w of WARN) console.log('  \x1b[33m!\x1b[0m ' + w);
for (const f of MUST_FIX) console.log('  \x1b[31m✗\x1b[0m ' + f);

console.log(
  `\n${PASS.length} passed · ${WARN.length} warnings · ${MUST_FIX.length} must-fix\n`
);

if (MUST_FIX.length) {
  console.log('\x1b[31mNOT READY for resubmission.\x1b[0m Fix the ✗ items first.\n');
  process.exit(1);
}

console.log('\x1b[32mNo blocking issues found.\x1b[0m Warnings are quality improvements.\n');
