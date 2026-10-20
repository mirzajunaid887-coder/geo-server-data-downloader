import puppeteer from 'puppeteer';
import express from 'express';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const PORT = 4173;
const DIST = resolve('dist');

// All the routes we want Google to index
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

async function startStaticServer() {
  const app = express();
  app.use(express.static(DIST));
  
    // SPA fallback: serve index.html for any route
  app.use(async (_req, res) => {
    const html = await readFile(resolve(DIST, 'index.html'), 'utf8');
    res.send(html);
  });

  return new Promise((resolveServer) => {
    const server = app.listen(PORT, () => resolveServer(server));
  });
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  
  // Set a reasonable viewport
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`Rendering: ${route}`);

  // Navigate and wait for network to be idle
  await page.goto(`http://localhost:${PORT}${route}`, {
    waitUntil: 'networkidle0',
    timeout: 60000, // 60 seconds max per page
  });

  // Give React Helmet an extra second to inject the SEO tags
  await new Promise((r) => setTimeout(r, 1000));

  // Get the fully rendered HTML (including the <head> metadata)
  const html = await page.content();

  // Determine output path: e.g. /blog -> dist/blog/index.html
  const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
  const outputPath = resolve(DIST, routePath.replace(/^\//, ''));

  // Create directory and write the HTML
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);

  await page.close();
}

async function main() {
  console.log('Starting prerender process...');
  
  // 1. Start local server
  const server = await startStaticServer();
  
  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 3. Render all routes
  for (const route of routes) {
    try {
      await renderRoute(browser, route);
    } catch (err) {
      console.error(`Failed to render ${route}:`, err.message);
    }
  }

  // 4. Cleanup
  await browser.close();
  server.close();
  console.log('Prerender complete! Static HTML generated in dist/');
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});