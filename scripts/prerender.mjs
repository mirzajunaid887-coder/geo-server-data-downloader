import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { createServer } from 'node:http';
import { loadBlog, CORE_ROUTES } from './seo-data.mjs';

const DIST = resolve('dist');
const IS_LINUX = process.platform === 'linux';

// Routes come from the blog data: every post that still has a page (merged posts are
// 301-redirected by vercel.json). Thin posts ARE prerendered so their noindex tag is in the
// static HTML and old links keep working. '/__not-found' becomes dist/404.html.
const NOT_FOUND_ROUTE = '/__not-found';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

/** Local Chrome/Edge paths used when not running on Linux. */
const LOCAL_BROWSERS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

async function launchBrowser() {
  // Vercel / CI runs on Linux, where the bundled @sparticuz Chromium works.
  if (IS_LINUX) {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  // Windows / macOS: use an already-installed browser.
  const executablePath = LOCAL_BROWSERS.find((p) => existsSync(p));
  if (!executablePath) {
    throw new Error(
      'No local Chrome or Edge found for prerendering. Install Chrome, or set ' +
        'CHROME_PATH to a browser executable and re-run.'
    );
  }

  console.log(`Using local browser: ${executablePath}`);
  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
}

async function startStaticServer(fallbackHtml) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const filePath = resolve(DIST, urlPath.slice(1));

      if (!filePath.startsWith(DIST)) {
        res.writeHead(403);
        res.end();
        return;
      }

      const st = await stat(filePath).catch(() => null);
      if (st && st.isFile()) {
        const ext = extname(filePath);
        const body = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(body);
        return;
      }

      // SPA fallback
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fallbackHtml);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });

  return new Promise((resolveServer) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolveServer({ server, port: address.port });
    });
  });
}

async function renderRoute(browser, route, port) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`Rendering: ${route}`);

  await page.goto(`http://127.0.0.1:${port}${route}`, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  // Give React Helmet an extra second to inject SEO tags
  await new Promise((r) => setTimeout(r, 1000));

  const html = await page.content();

  const routePath =
    route === '/' ? '/index.html' : route === NOT_FOUND_ROUTE ? '/404.html' : `${route}/index.html`;
  const outputPath = resolve(DIST, routePath.replace(/^\//, ''));

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);

  await page.close();
}

async function main() {
  console.log('Starting prerender process...');

  const fallbackHtml = await readFile(resolve(DIST, 'index.html'), 'utf8');
  const { server, port } = await startStaticServer(fallbackHtml);

  const browser = await launchBrowser();

  const { BLOG_POSTS, REDIRECTED_SLUGS } = await loadBlog();
  const routes = [
    ...CORE_ROUTES,
    ...BLOG_POSTS.filter((p) => !REDIRECTED_SLUGS[p.slug]).map((p) => `/blog/${p.slug}`),
    NOT_FOUND_ROUTE,
  ];

  const failed = [];
  for (const route of routes) {
    let done = false;
    for (let attempt = 1; attempt <= 2 && !done; attempt++) {
      try {
        await renderRoute(browser, route, port);
        done = true;
      } catch (err) {
        console.error(`Failed to render ${route} (attempt ${attempt}):`, err.message);
      }
    }
    if (!done) failed.push(route);
  }

  await browser.close();
  server.close();
  if (failed.length) {
    console.error(`Prerender failed for ${failed.length} route(s): ${failed.join(', ')}`);
    process.exit(1);
  }
  console.log(`Prerender complete! ${routes.length} pages generated in dist/`);
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});