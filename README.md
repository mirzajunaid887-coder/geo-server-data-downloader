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