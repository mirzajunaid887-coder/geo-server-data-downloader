import React from 'react';
import { SEO, buildFaqSchema } from '../components/SEO';

// Inside the component's return statement:
<SEO
  title="Documentation & User Guide"
  description="Learn how to download ArcGIS REST layers, WFS services, and ArcGIS Online datasets as Shapefile, GeoJSON, KML, or GeoPackage."
  keywords="ArcGIS download guide, WFS tutorial, GIS export documentation"
  path="/documentation"
  structuredData={buildFaqSchema([
    {
      question: 'How do I download an ArcGIS REST service as a Shapefile?',
      answer: 'Paste your FeatureServer URL into the Downloader, select the layer, and use the Bulk Export option to generate a Shapefile.'
    },
    {
      question: 'Can I convert GeoJSON to KML with this tool?',
      answer: 'Yes. Load a GeoJSON source or any ArcGIS layer and select KML as your export format in the Bulk Export dialog.'
    }
  ])}
/>

export const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Documentation</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Welcome to the Geo Server Data Downloader user guide and technical documentation.Built By Junaid.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Direct Service Workflow</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter any valid ArcGIS REST FeatureServer or WFS endpoint directly into the Downloader tab. The system queries metadata, retrieves Object IDs in optimized chunks, and converts features entirely on the client-side.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">ArcGIS Online Integration</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Use the Discover tab to search live public items via the official ArcGIS REST search portal without needing prior knowledge of individual service URLs.
        </p>
      </section>
    </div>
  );
};