# 🌍 Geo Server Data Downloader

A free, **100% client-side** GIS toolkit for finding, previewing, downloading and converting geospatial data. Paste an ArcGIS REST or WFS link (or search ArcGIS Online), look at the layer on a map, and export the **entire layer** (even millions of features) in the layer's own coordinate system. No account, no upload, no backend.

[**Live site**](https://www.geo-server-data-downloader.com/) • [**Report a bug**](https://github.com/mirzajunaid887-coder/geo-server-data-downloader/issues) • [**Request a feature**](https://github.com/mirzajunaid887-coder/geo-server-data-downloader/issues)

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)

---

## Table of contents

1. [What the site offers](#1-what-the-site-offers)
2. [Pages and routes](#2-pages-and-routes)
3. [How downloading works](#3-how-downloading-works)
4. [US parcel data by city (spreadsheet driven)](#4-us-parcel-data-by-city-spreadsheet-driven)
5. [SEO and AdSense setup](#5-seo-and-adsense-setup)
6. [Tech stack](#6-tech-stack)
7. [Project structure](#7-project-structure)
8. [Getting started (local development)](#8-getting-started-local-development)
9. [Build and deployment](#9-build-and-deployment)
10. [Configuration (environment variables)](#10-configuration-environment-variables)
11. [Common tasks](#11-common-tasks)
12. [Limits, browser support and testing status](#12-limits-browser-support-and-testing-status)
13. [Troubleshooting](#13-troubleshooting)
14. [Third-party software](#14-third-party-software)
15. [Contributing, license, author](#15-contributing-license-author)

---

## 1. What the site offers

| Tool | What it does |
|---|---|
| **Downloader** (`/download`) | Load an ArcGIS FeatureServer / MapServer layer or a WFS service, preview it on a map, inspect the attribute table, and export one or many layers. |
| **Discover** (`/discover`) | Search public ArcGIS Online feature services (parcels, zoning, boundaries), inspect fields and feature counts, then send a result to the Downloader. |
| **US parcel data by city** (`/data`) | A hub of city pages, built from an Excel/CSV list. Each city page explains the data and has a **Download now** button that downloads the whole layer. |
| **US data guides** (`/data/<topic>`) | Written guides on US datasets, each with a live ArcGIS Online search so the dataset list never goes stale. |
| **GIS Converter** (`/converter`) | Convert GIS files in the browser (Shapefile, GeoJSON, KML, GeoPackage, CSV, GPX, FlatGeobuf, DXF, GML and more) using GDAL compiled to WebAssembly. |
| **GeoPDF to GeoTIFF** (`/geopdf-to-geotiff`) | Convert a GeoPDF to GeoTIFF in the browser, choosing pages and insets, keeping the PDF's projection. |
| **Blog and Documentation** | Long-form GIS guides and the user documentation. |

Everything runs in the visitor's browser. URLs, data and exported files never go to our servers.

---

## 2. Pages and routes

Defined in `src/app/routes.tsx`. All pages except Home are code-split, so the heavy ArcGIS map SDK is only downloaded on `/download`.

| Route | Page file | Notes |
|---|---|---|
| `/` | `Home.tsx` | Landing page |
| `/download` | `Downloader.tsx` | Map, layer list, attribute table, export. `/downloader` redirects here (and keeps `?url=`). |
| `/discover` | `Discover.tsx` | ArcGIS Online search + `ServiceInspector` |
| `/converter` | `GISConverter.tsx` | File converter |
| `/geopdf-to-geotiff` | `GeoPdfToGeoTiff.tsx` | GeoPDF converter (`src/services/geopdf/`) |
| `/data` | `DataIndex.tsx` | Parcel hub (cities grouped by state, filter box) and list of data guides |
| `/data/parcels/<city>-<st>` | `ParcelCityPage.tsx` | One page per row of the city spreadsheet |
| `/data/<topic>` | `DataTopic.tsx` | Guides from `src/data/dataTopics.ts` |
| `/blog`, `/blog/<slug>` | `Blog.tsx`, `BlogPost.tsx` | Posts from `src/data/blogPosts.ts` |
| `/documentation`, `/about`, `/contact`, `/privacy`, `/terms` | matching files | Trust and information pages |
| `/export.html` | `public/export.html` | **Standalone** export page (not part of the React app), see section 3 |

---

## 3. How downloading works

### 3.1 Why exports run in their own page

Exports open **`/export.html`** in a new tab instead of running inside the dashboard. The page is served with `Cross-Origin-Opener-Policy: same-origin` (see `vercel.json`), so the browser gives it its own process. Big exports can use a lot of CPU and memory, and the dashboard stays responsive (in testing the main page never stalled for more than about 30 ms).

The export settings are passed in the URL hash as base64 JSON, for example:

```json
{
  "layers": [{ "name": "Houston parcels", "url": "https://.../FeatureServer/0", "type": "arcgis" }],
  "format": "shp",
  "crs": "native",
  "preflight": true,
  "filename": "houston-tx_parcels"
}
```

The hash never reaches a server. `/export.html` is `noindex` and disallowed in `robots.txt`.

### 3.2 Fetching features (ArcGIS REST)

1. Read the layer metadata (`?f=pjson`): geometry type, fields, `maxRecordCount` and the layer's spatial reference.
2. Ask the server for all object IDs (`returnIdsOnly`), then sort them.
3. Request features in **ID ranges** (`OID >= a AND OID <= b`). Range queries are much faster on large layers than `resultOffset` paging.
4. Page size is the server's `maxRecordCount`, capped at 1,000 and never below 100. A server limited to 500 is paged by 500.
5. Up to **6 requests run in parallel**, with retries and back-off. If a server returns fewer features than asked for (`exceededTransferLimit`), that range is split and fetched again, so nothing is lost.
6. An optional `where` filter can be applied. It is **not required**.

WFS layers are fetched page by page (1,000 per page, 4 in parallel) with several GeoJSON output formats tried and transient errors retried. See `src/services/wfs/wfs.ts`. WMS only draws pictures and cannot be downloaded.

### 3.3 Coordinate systems

By default the export keeps the layer's **own projection** (for example a State Plane system), not WGS 84. The tool reads the spatial reference from the layer metadata, asks the server for coordinates in that system (`outSR`), and writes the matching `.prj` / `crs` information. KML and GPX are always WGS 84 because those formats require it. CSV has no projection information, so the export page tells the user which system the coordinates are in.

### 3.4 Two export engines

| | **GDAL engine** (small layers) | **Streaming engine** (large layers) |
|---|---|---|
| Used when | Layer has up to **25,000** features, or the format is GeoPackage / KML | Layer has more than 25,000 features **and** the format is Shapefile, GeoJSON or CSV |
| How | Features collected in memory, converted with `gdal3.js` (WebAssembly) | Features written straight to the browser's private disk storage (OPFS) by a worker, then handed to the download |
| Formats | Shapefile, GeoPackage, GeoJSON, KML, CSV, GPX | Shapefile, GeoJSON, CSV |
| Size limit | **100,000** features for GeoPackage and KML (they must fit in memory) | **No feature limit**. Memory stays flat. |
| Files | `public/export.html` | `public/stream-export.js`, `public/opfs-worker.js` |

Streaming details:

- **Shapefile** is written by a purpose-built streaming writer (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`) into a streaming ZIP. A shapefile over about **1.9 GB** is split into several parts, because the format limits each file to 2 GB. ZIP64 is used when the archive is larger than about 3.5 GB. Field names are shortened to 10 characters; if any were renamed, a `_field_names.txt` is added.
- **GeoJSON** is streamed with a `crs` member. **CSV** is UTF-8 with a BOM and the geometry as WKT.
- The page asks the browser for a wake lock, checks free storage first, shows a progress bar with time left, and deletes old temporary files (older than 2 hours) at start.
- If storage runs out, a clear message is shown and the temporary files are removed.
- Large numbers (above about 1e9) and non-Latin text are preserved in the streaming path.

### 3.5 Preflight panel

For big layers the export page first shows the feature count, the coordinate system and the field list, and lets the user pick a format and an optional filter. GeoPackage and KML above 100,000 features are blocked with a message that points to Shapefile, GeoJSON or CSV. Layers the streaming engine can handle start automatically.

### 3.6 "Download now" on city pages

Each parcel city card and city page has a **Download now** button (`src/components/data/DownloadNow.tsx`). It opens `/export.html` in a new tab with the city's layer URL, the chosen format and `crs: "native"`. The layer is never added to the map, so the dashboard is not involved.

---

## 4. US parcel data by city (spreadsheet driven)

The list of cities is **not hard-coded**. It lives in `data/parcel-cities.xlsx` (or `data/parcel-cities.csv`) at the repository root, next to `package.json`.

### 4.1 Columns

Header names are matched loosely (case, spaces and underscores are ignored).

| Column | Required | Purpose |
|---|---|---|
| `City` | yes | City name |
| `County` | yes | County name |
| `State` | yes | Full name or 2-letter code. An unknown state fails the build. |
| `Parcel_Data_URL` | yes | The ArcGIS FeatureServer/MapServer **layer** URL (must start with `https://`). A broken or non-URL value fails the build. |
| `About_Data` | recommended | Your own written description of the data. Original text is what makes a page worth indexing. |
| `URL_Last_Updated` | recommended | Date you last checked the link (ISO, `M/D/YYYY` or an Excel date). Dates older than 180 days produce a warning. |
| `Publisher` | optional | Who publishes the layer (county assessor, GIS department...) |
| `Coverage` | optional | What area and parcel types are covered |
| `Key_Fields` | optional | Notable attribute fields |
| `Watch_Out` | optional | Caveats (ownership data limits, update frequency...) |
| `Filter_Example` | optional | An example `where` clause for the city's data |

A second sheet ("How to fill") in the template explains each column.

### 4.2 What happens at build

`scripts/generate-parcel-data.mjs` reads the sheet (the xlsx reader only needs `jszip`) and writes `src/data/parcelCities.json`. Then the sitemap and the pre-render step add one page per city at `/data/parcels/<city>-<st>`.

- **Errors stop the build** (unknown state, bad URL), so a typo never goes live silently.
- **Warnings are printed** for short text or stale dates.
- A city page with fewer than **60 words** of written content is built but set to `noindex` and left out of the sitemap until you add more text.
- Each city page carries Dataset, FAQ and Breadcrumb structured data (JSON-LD).

### 4.3 Adding cities

1. Open `data/parcel-cities.xlsx`.
2. Add a row per city (see the columns above). Open each `Parcel_Data_URL` in a browser first and confirm it returns layer JSON.
3. Write original text in `About_Data` (and the optional columns).
4. Run `npm run dev` or `npm run build`. Read any errors or warnings.
5. Commit and push. Vercel rebuilds the site.

---

## 5. SEO and AdSense setup

- **Static pre-rendering.** React is a single-page app, so `scripts/prerender.mjs` starts a local server on the built `dist/` folder, opens every route in headless Chromium (`puppeteer-core` + `@sparticuz/chromium`, or a local Chrome/Edge, or `CHROME_PATH`), and saves the finished HTML. Search engines and AdSense reviewers therefore see real content, titles and structured data. A missing page becomes `dist/404.html`.
- **Sitemap.** `scripts/generate-sitemap.mjs` builds `public/sitemap.xml` from the core routes, blog posts, data guides and city pages. `noindex` pages are excluded.
- **Thin-content protection.** Blog posts and city pages below the word threshold get `noindex`. Merged posts are 301-redirected in `vercel.json`.
- **Meta and schema.** `src/components/SEO.tsx` sets title, description, canonical and Open Graph tags per page, plus JSON-LD where relevant.
- **AdSense.** `public/ads.txt` holds the publisher line. `src/config/ads.ts` reads the client and slot IDs from environment variables, and **ads only render when real IDs are set** (placeholders are ignored). Components live in `src/components/ads/`.
- **Audit script.** `node scripts/audit-adsense.mjs <project-folder>` checks that every sitemap URL has a prerendered file with a proper title, description, canonical, single H1 and enough body text. Exit code 1 means at least one must-fix problem.
- `robots.txt` allows crawling and disallows `/export-progress` and `/export.html`.

> Rankings and AdSense approval depend on content quality, time and links. This code removes technical obstacles; it cannot promise either.

---

## 6. Tech stack

- **Framework:** React 18 + TypeScript + Vite
- **Mapping:** `@arcgis/core` and `@arcgis/map-components` (ArcGIS Maps SDK for JavaScript), Leaflet / `esri-leaflet`
- **Data conversion:** `gdal3.js` (GDAL in WebAssembly), `jszip`, `@terraformer/arcgis`, `proj4`
- **GeoPDF:** `pdfjs-dist`, `pdf-lib`
- **SEO and pre-rendering:** `react-helmet-async`, `puppeteer-core`, `@sparticuz/chromium`
- **Styling:** CSS variables (dark/light theme) + Tailwind CSS
- **Icons:** Lucide React
- **Hosting:** Vercel

`public/export.html` loads `jszip`, `@terraformer/arcgis` and `gdal3.js` from the jsDelivr CDN (pinned versions) so the standalone page stays small.

---

## 7. Project structure

```text
├── data/
│   └── parcel-cities.xlsx        # City list for the parcel hub (you edit this)
├── public/
│   ├── export.html               # Standalone export page (own tab, own process)
│   ├── stream-export.js          # Streaming engine for huge layers
│   ├── opfs-worker.js            # Disk worker (browser private file system)
│   ├── ads.txt, robots.txt, sitemap.xml, site.webmanifest
│   └── icons, og-image, THIRD-PARTY-NOTICES.txt
├── scripts/
│   ├── generate-parcel-data.mjs  # xlsx/csv  ->  src/data/parcelCities.json
│   ├── parcel-cities.mjs         # Spreadsheet reader and validation
│   ├── generate-sitemap.mjs      # Builds public/sitemap.xml
│   ├── prerender.mjs             # Static HTML for every route
│   ├── seo-data.mjs              # Shared route / blog / city lists for the scripts
│   └── audit-adsense.mjs         # SEO / AdSense readiness audit
├── src/
│   ├── app/                      # App shell and routes
│   ├── components/               # Map, modals, ads, SEO, layout, DownloadNow, ServiceInspector
│   ├── config/                   # App, SEO and AdSense configuration
│   ├── context/                  # Theme context
│   ├── data/                     # Blog posts, data guides, parcelCities (.ts + generated .json)
│   ├── hooks/                    # Custom hooks
│   ├── pages/                    # One file per page
│   ├── services/                 # arcgis/, arcgis-online/, wfs/, geopdf/, export/
│   ├── styles/                   # Global CSS and theme tokens
│   └── types/                    # TypeScript types
├── .env.example                  # Names of the environment variables
├── vercel.json                   # Redirects and headers (incl. COOP for /export.html)
└── package.json
```

---

## 8. Getting started (local development)

**Prerequisites:** Node.js 18 or newer, and npm.

```bash
git clone https://github.com/mirzajunaid887-coder/geo-server-data-downloader.git
cd geo-server-data-downloader
npm install
cp .env.example .env     # optional: fill in real values (see section 10)
npm run dev
```

The app opens at http://localhost:5173. `npm run dev` first regenerates `src/data/parcelCities.json` from the spreadsheet, so edits to the Excel file show up after a restart.

Testing the export page locally: `/export.html` works under `npm run dev`, but the cross-origin isolation header comes from `vercel.json`, so test big exports on a Vercel preview deployment as well.

---

## 9. Build and deployment

```bash
npm run build
```

This runs, in order:

1. `generate-parcel-data.mjs`: spreadsheet to JSON (fails on bad rows)
2. `generate-sitemap.mjs`: writes `public/sitemap.xml`
3. `vite build`: bundles the app into `dist/`
4. `prerender.mjs`: saves static HTML for every route

The pre-render step needs a Chromium. On Linux (Vercel) it uses `@sparticuz/chromium`. On Windows or macOS it looks for Chrome or Edge, or the path in `CHROME_PATH`. On a small machine the build can run out of memory; if so, run it with more, for example `NODE_OPTIONS=--max-old-space-size=6000 npm run build`.

**Deploying:** the repository is connected to Vercel. Every push to the main branch builds with `npm run build` and publishes `dist/`. `vercel.json` also holds the redirects for merged blog posts and the headers for `/export.html`, `/assets/*` and all pages.

---

## 10. Configuration (environment variables)

Copy `.env.example` to `.env` for local work, and set the same names in the Vercel project settings for production. All names start with `VITE_`, so they are visible in the browser. **Never put secrets here.**

| Variable | Purpose |
|---|---|
| `VITE_APP_NAME` | Site name |
| `VITE_APP_DOMAIN` | Canonical domain, used for canonical URLs and the sitemap |
| `VITE_ARCGIS_API_KEY` | Optional ArcGIS API key for the map SDK |
| `VITE_ADSENSE_CLIENT_ID` | AdSense publisher ID (`ca-pub-...`). Placeholder values keep ads off. |
| `VITE_ADSENSE_SLOT_ID` | Display ad slot |
| `VITE_ADSENSE_SLOT_ARTICLE` | In-article ad slot (falls back to the display slot) |
| `VITE_GOOGLE_SITE_VERIFICATION` | Search Console verification code |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics measurement ID (listed in `.env.example`, but no code reads it yet) |

---

## 11. Common tasks

**Add a city:** edit `data/parcel-cities.xlsx` (section 4.3).

**Add a blog post:** add an entry in `src/data/blogPosts.ts`. The page, sitemap and pre-render pick it up. Keep it substantial; thin posts are set to `noindex`.

**Add a data guide:** add an entry in `src/data/dataTopics.ts` (title, description, search term, written content, FAQs).

**Add an export format:** GDAL formats are mapped in `public/export.html`; streaming formats live in `public/stream-export.js`.

**Change the redirect list or headers:** edit `vercel.json`.

**Check SEO before publishing:** build, then run `node scripts/audit-adsense.mjs .`

---

## 12. Limits, browser support and testing status

**Limits**

- GeoPackage and KML: **100,000 features** (they are built in memory).
- Shapefile, GeoJSON, CSV: no feature limit. Large shapefiles are split into parts under 2 GB.
- The user must **keep the export tab open** until the download finishes. There is no resume after a dropped connection.
- Disk space needed is roughly **twice the final file size** while the file is built. Chrome and Edge allow large amounts of temporary storage; other browsers may allow less.
- The data server must allow cross-origin requests (CORS). If it does not, the browser blocks the download and no client-side tool can get around that.
- Public servers may rate-limit or throttle heavy downloads.

**Browsers:** Chrome and Edge are the primary targets. The streaming engine uses the browser's private file system and a dedicated worker, which Firefox and Safari also support, but those have had less testing.

**Testing status (be aware)**

- The streaming engine was tested against a **mock ArcGIS server**: 1,000,000 features as Shapefile (about 61 s), GeoJSON (about 63 s) and CSV (about 51 s), ZIP64 archives, multipart shapes, polygons with holes, null values, Unicode text, a server that returns fewer records than requested, and the city button end to end.
- A real run on a New York parcel layer of about 3.8 million features has been started from the site and was progressing normally.
- Not yet verified on many real city servers (speed, rate limits, CORS), in Firefox or Safari, or with long downloads in a background tab.

If you test a city and it fails, please open an issue with the layer URL, the browser and the message shown.

---

## 13. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| "This link did not return ArcGIS data" | The link is a web page, a WMS link or a service root. Paste a FeatureServer / MapServer **layer** URL (ending in a layer number) or a WFS link. |
| Download fails right away with a network error | The server does not allow cross-origin access (CORS), or it is offline. |
| "The browser ran out of storage space" | Free some disk space, or use Chrome / Edge. Layers with millions of features need several gigabytes of temporary space. |
| GeoPackage or KML blocked above 100,000 features | Choose Shapefile, GeoJSON or CSV. |
| Download is slow | The data server sets the speed. Servers with a low `maxRecordCount` (for example 500) need more requests. |
| Build fails with a spreadsheet error | Read the message: it names the row. Usually an unknown state or a link that does not start with `https://`. |
| A city page is missing from Google | Under 60 words of text means `noindex`. Add more written content in the spreadsheet. |
| Pre-render step cannot find a browser | Install Chrome or Edge, or set `CHROME_PATH`. |
| Build runs out of memory | Run with `NODE_OPTIONS=--max-old-space-size=6000`. |

---

## 14. Third-party software

Open-source components (GDAL via `gdal3.js`, JSZip, Terraformer, the ArcGIS Maps SDK, Leaflet and others) keep their own licenses. See `public/THIRD-PARTY-NOTICES.txt`. Data downloaded through this tool belongs to its publishers; users are responsible for following each dataset's terms of use.

---

## 15. Contributing, license, author

Contributions, issues and feature requests are welcome. Please open an issue first for larger changes.

Distributed under the MIT License. See the `LICENSE` file for more information.

### 👨‍💻 Author

**Muhammad Junaid Baig**

🌐 Website: [Geo Server Data Downloader](https://www.geo-server-data-downloader.com/)

💼 LinkedIn: [Muhammad Junaid Baig](https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/)

🐙 Upwork: [GIS_Gynix](https://www.upwork.com/freelancers/~014c5dfcb05a8b2acb?mp_source=share)

💻 Fiverr: [Fiverr](https://www.fiverr.com/gisgynix)
