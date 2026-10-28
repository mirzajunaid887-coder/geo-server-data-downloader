# 🌍 Geo Server Data Downloader

A free, fast, and **100% client-side** GIS tool for discovering, previewing, and downloading geospatial data from ArcGIS REST services, WFS, and ArcGIS Online. 

[**Live Demo**](https://www.geo-server-data-downloader.com/) • [**Report Bug**](https://github.com/mirzajunaid887-coder/geo-server-data-downloader/issues) • [**Request Feature**](https://github.com/mirzajunaid887-coder/geo-server-data-downloader/issues)

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)

---

## ✨ Features

- **Direct URL Loader**: Connect directly to any ESRI ArcGIS REST FeatureServer or MapServer endpoint.
- **ArcGIS Online Discovery**: Search thousands of public feature services without needing a pre-existing URL.
- **Interactive Mapping**: Preview layers on an interactive map powered by the Esri ArcGIS Maps SDK for JavaScript.
- **Attribute Tables**: Inspect layer data natively using the Esri `FeatureTable` widget.
- **Bulk Export**: Download layers in multiple formats (GeoPackage, Shapefile, GeoJSON, KML, CSV, GPX) entirely in the browser using `gdal3.js` (WebAssembly).
- **100% Client-Side**: No backend database required. Your data, URLs, and exported files never leave your browser.
- **SEO Optimized (SSG)**: Includes a custom Puppeteer script that pre-renders static HTML for every route, ensuring Google can crawl the React SPA.
- **Responsive**: Fully functional on Desktop, Tablet, and Mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Mapping SDK**: `@arcgis/core` (ArcGIS Maps SDK for JavaScript)
- **Data Conversion**: `gdal3.js` (WebAssembly), `jszip`
- **SEO & Pre-rendering**: `react-helmet-async` + `puppeteer-core` + `@sparticuz/chromium`
- **Styling**: Custom CSS Variables (Dark/Light mode) + Tailwind CSS
- **Icons**: Lucide React + Font Awesome (Inline SVGs)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (or yarn/pnpm)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mirzajunaid887-coder/geo-server-data-downloader.git
   cd geo-server-data-downloader

#### Install dependencies

  npm install

#### Start the development server
   
   npm run dev
      The application will be available at http://localhost:5173
   

##### 📦 Build & Deployment

   npm run build
    Note: This command does two things:
        1. Bundles the React application using vite build.
        2. Runs node scripts/prerender.mjs which launches a headless serverless Chromium browser to generate static HTML files for all pages (Home, Blog, Docs, etc.). This is critical for Google AdSense approval and SEO.

###### 📁 Project Structure

├── public/                 # Static assets (favicon, robots.txt, sitemap.xml, ads.txt)
├── scripts/
│   └── prerender.mjs       # Puppeteer script for SSG generation
├── src/
│   ├── app/                # App wrapper and routing
│   ├── components/         # Reusable UI components (Map, Modals, Ads, SEO)
│   ├── config/             # App and AdSense configuration
│   ├── context/            # React Context (Theme)
│   ├── data/               # Blog post data and glossary definitions
│   ├── hooks/              # Custom React hooks (useMediaQuery)
│   ├── pages/              # Page components (Home, Downloader, Blog, etc.)
│   ├── services/           # ArcGIS REST and conversion logic
│   └── styles/             # Global CSS and theme tokens
├── vercel.json             # Vercel deployment configuration
└── package.json

##### 🤝 Contributing
  
   Contributions, issues, and feature requests are welcome!

###### 📝 License
   
   Distributed under the MIT License. See LICENSE for more information.

###### 👨‍💻 Author
  
  Muhammad Junaid Baig

🌐 Website: [Geo Server Data Downloader](https://www.geo-server-data-downloader.com/)

💼 LinkedIn: Muhammad Junaid Baig

🐙 GitHub: @mirzajunaid887-coder

💻 Fiverr: [Fiverr](https://www.fiverr.com/gisgynix)