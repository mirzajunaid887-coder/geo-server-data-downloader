import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { createServer } from 'node:http';

const DIST = resolve('dist');

const routes = [
  '/',
  '/download',
  '/discover',
  '/documentation',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/blog',
  '/blog/how-to-download-arcgis-rest-featureserver-data',
  '/blog/geojson-vs-shapefile-vs-geopackage',
  '/blog/how-to-find-free-parcel-data-us-counties',
  '/blog/complete-guide-wfs-web-feature-service',
  '/blog/how-to-convert-arcgis-online-layers-to-excel',
  '/blog/ten-free-gis-data-sources-every-analyst-should-know',
  '/blog/understanding-coordinate-systems-and-projections',
  '/blog/how-to-load-gis-data-in-qgis-beginner-guide',
  '/blog/what-is-arcgis-online-complete-introduction',
  '/blog/how-to-use-arcgis-rest-api-query-parameters',
  '/blog/beginners-guide-spatial-data-formats',
  '/blog/how-to-download-census-data-for-gis-analysis',
];

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

  const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
  const outputPath = resolve(DIST, routePath.replace(/^\//, ''));

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);

  await page.close();
}

async function main() {
  console.log('Starting prerender process...');

  const fallbackHtml = await readFile(resolve(DIST, 'index.html'), 'utf8');
  const { server, port } = await startStaticServer(fallbackHtml);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  for (const route of routes) {
    try {
      await renderRoute(browser, route, port);
    } catch (err) {
      console.error(`Failed to render ${route}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log('Prerender complete! Static HTML generated in dist/');
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});