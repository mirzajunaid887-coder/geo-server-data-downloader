import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/** Old /downloader links: forward to /download and keep ?url=... */
const DownloaderRedirect: React.FC = () => {
  const { search } = useLocation();
  return <Navigate to={`/download${search}`} replace />;
};
import { Home } from '../pages/Home';

/**
 * Every page except Home is code-split. Before this, visitors to ANY page (including a
 * blog post) downloaded one ~2.3 MB bundle that contained the whole ArcGIS map SDK.
 * Now the heavy map code loads only on /download, and /discover and /converter
 * load their own code when opened.
 */
const Downloader = lazy(() => import('../pages/Downloader').then((m) => ({ default: m.Downloader })));
const Discover = lazy(() => import('../pages/Discover').then((m) => ({ default: m.Discover })));
const Documentation = lazy(() => import('../pages/Documentation').then((m) => ({ default: m.Documentation })));
const About = lazy(() => import('../pages/About').then((m) => ({ default: m.About })));
const Privacy = lazy(() => import('../pages/Privacy').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('../pages/Terms').then((m) => ({ default: m.Terms })));
const Contact = lazy(() => import('../pages/Contact').then((m) => ({ default: m.Contact })));
const Blog = lazy(() => import('../pages/Blog').then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import('../pages/BlogPost').then((m) => ({ default: m.BlogPost })));
const ExportProgress = lazy(() => import('../pages/ExportProgress').then((m) => ({ default: m.ExportProgress })));
const GISConverter = lazy(() => import('../pages/GISConverter').then((m) => ({ default: m.GISConverter })));
const GeoPdfToGeoTiff = lazy(() => import('../pages/GeoPdfToGeoTiff').then((m) => ({ default: m.GeoPdfToGeoTiff })));
const DataIndex = lazy(() => import('../pages/DataIndex').then((m) => ({ default: m.DataIndex })));
const DataTopicPage = lazy(() => import('../pages/DataTopic').then((m) => ({ default: m.DataTopicPage })));
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })));

const RouteFallback: React.FC = () => (
  <div role="status" aria-live="polite" style={{ minHeight: '60vh', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
    Loading&hellip;
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<Downloader />} />
        {/* Old duplicate URL: the server also sends a 301 (see vercel.json) */}
        <Route path="/downloader" element={<DownloaderRedirect />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/converter" element={<GISConverter />} />
        <Route path="/geopdf-to-geotiff" element={<GeoPdfToGeoTiff />} />
        <Route path="/data" element={<DataIndex />} />
        <Route path="/data/parcels-by-city" element={<Navigate to="/data" replace />} />
        <Route path="/data/:slug" element={<DataTopicPage />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/export-progress" element={<ExportProgress />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};