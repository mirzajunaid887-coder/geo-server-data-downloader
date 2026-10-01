import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_CONFIG } from '../config/app';

/* ============================================================
   SITE CONSTANTS
   ============================================================ */

const SITE_NAME = APP_CONFIG.APP_NAME || 'Geo Server Data Downloader';

/** Normalised site URL — accepts either "example.com" or "https://example.com/" */
const SITE_URL = (() => {
  const raw = APP_CONFIG.APP_DOMAIN || 'https://www.geo-server-data-downloader.com';
  const clean = raw.replace(/\/+$/, '');
  return clean.startsWith('http') ? clean : `https://${clean}`;
})();

const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

/** Fallback title for the home page (keyword-rich, ~60 chars) */
const DEFAULT_HOME_TITLE =
  'Geo Server Data Downloader';

const DEFAULT_DESCRIPTION =
  'Free online GIS data downloader. Connect to ArcGIS REST, WFS, and spatial web services to export layers as Shapefile, GeoJSON, KML, and GeoPackage — entirely in your browser.';

const DEFAULT_KEYWORDS =
  'GIS data downloader, ArcGIS REST feature service, WFS downloader, GeoJSON to Shapefile, GIS layer exporter, spatial data tool, Download GIS Data, Free GIS Data, Esri Data Downloader';

/* ============================================================
   COMPONENT
   ============================================================ */

interface SEOProps {
  /** Page-specific title. Suffixed with "| Site Name" automatically. Omit on Home. */
  title?: string;
  /** Meta description — 150–160 chars is ideal. */
  description?: string;
  /** Comma-separated keywords (optional, mainly for Bing). */
  keywords?: string;
  /** Route path starting with "/" — e.g. "/about". Used to build the canonical URL. */
  path?: string;
  /** Relative or absolute image URL for social previews. */
  image?: string;
  /** Open Graph type. */
  type?: 'website' | 'article' | 'product';
  /** Set to true to tell search engines not to index this page. */
  noindex?: boolean;
  /** JSON-LD structured data (object or array of objects). */
  structuredData?: object | object[];
  /** Optional extra <meta> / <link> tags. */
  children?: React.ReactNode;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  structuredData,
  children,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_HOME_TITLE;

  const normalisedPath =
    path === '' || path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalisedPath}`;

  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  const ldArray = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${SITE_NAME} preview`} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} preview`} />

      {/* JSON-LD structured data */}
      {ldArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}

      {children}
    </Helmet>
  );
};

export default SEO;

/* ============================================================
   REUSABLE JSON-LD SCHEMA BUILDERS
   ============================================================ */

/**
 * WebApplication schema — use on the Home page only.
 * If you keep the one in index.html, you can skip this.
 */
export const buildWebApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: 'GISApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  image: DEFAULT_IMAGE,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_IMAGE,
    },
  },
});

/** BreadcrumbList schema — great for any sub-page. */
export const buildBreadcrumbSchema = (
  items: { name: string; path: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
  })),
});

/** FAQPage schema — powerful for ranking on question-style searches. */
export const buildFaqSchema = (
  faqs: { question: string; answer: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
});