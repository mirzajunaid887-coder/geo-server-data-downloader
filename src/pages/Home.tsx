import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Compass, ArrowRight, Zap, Database } from 'lucide-react';
import { SEO, buildFaqSchema } from '../components/SEO';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is Geo Server Data Downloader free?',
    a: 'Yes. There is no account, no sign-up and no export fee. Some blog articles may show ads, which help cover hosting.',
  },
  {
    q: 'Which formats can I export?',
    a: 'GeoPackage, Shapefile (zipped), GeoJSON, CSV, KML and GPX. Conversion runs in your browser using GDAL compiled to WebAssembly.',
  },
  {
    q: 'Is there a limit on how many features I can download?',
    a: 'The tool does not impose a feature cap and ignores the 1,000-record limit that many ArcGIS services apply to a single request. It downloads every object ID the layer reports, so very large layers are limited only by your browser’s memory.',
  },
  {
    q: 'Does it support WFS?',
    a: 'Yes, for WFS 1.0.0 to 2.0.0 servers that can return GeoJSON and allow cross-origin browser requests. WMS is not supported because it serves map images, not feature data.',
  },
  {
    q: 'Why do some ArcGIS downloads fail with "Failed to execute query"?',
    a: 'Servers differ in what they accept. Many reject requests for server-built GeoJSON or very long ID lists. This tool asks for plain JSON in small pages of 200 object IDs and converts it to GeoJSON in your browser, which works on a wider range of servers.',
  },
  {
    q: 'Is my data uploaded to your servers?',
    a: 'No. The site has no backend. Your browser requests features directly from the data provider and converts them locally.',
  },
];

const GUIDES: { slug: string; title: string }[] = [
  { slug: 'how-to-download-arcgis-rest-featureserver-data', title: 'How to download data from an ArcGIS REST FeatureServer' },
  { slug: 'complete-guide-wfs-web-feature-service', title: 'The complete guide to WFS (Web Feature Service)' },
  { slug: 'how-to-find-free-parcel-data-us-counties', title: 'How to find free parcel data for US counties' },
  { slug: 'geojson-vs-shapefile-vs-geopackage', title: 'GeoJSON vs Shapefile vs GeoPackage: which to use' },
  { slug: 'how-to-use-arcgis-rest-api-query-parameters', title: 'ArcGIS REST API query parameters explained' },
  { slug: 'understanding-coordinate-systems-and-projections', title: 'Coordinate systems and projections explained' },
];

const muted: React.CSSProperties = { fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 };
const sectionTitle: React.CSSProperties = { fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem', color: 'var(--text-main)' };
const wrap: React.CSSProperties = { maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 1rem', boxSizing: 'border-box' };

export const Home: React.FC = () => {
  return (
    <>
      <SEO
        path="/"
        title="Download ArcGIS REST & WFS Data — Free Online Tool"
        description="Free browser-based tool to download ArcGIS FeatureServer, MapServer and WFS layers as Shapefile, GeoJSON, KML, GeoPackage or CSV. No signup, no upload."
        structuredData={buildFaqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })))}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem 0 2rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 0.5rem', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: 0, color: 'var(--text-main)', lineHeight: 1.15 }}>
            Download ArcGIS REST and WFS data as Shapefile, GeoJSON or GeoPackage
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Paste a FeatureServer, MapServer or WFS URL, preview the layer on a map, inspect its fields, and export every feature. It is free, needs no account, and the conversion happens in your browser.
          </p>
        </div>

        {/* Main workflow cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', ...wrap }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', borderLeft: '4px solid var(--accent-color)', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-color)' }}>
                  <Globe style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Direct URL Downloader</h2>
              </div>
              <p style={muted}>
                Paste an ArcGIS REST FeatureServer or MapServer endpoint, or a WFS service URL. Preview the layer on the map, review its attributes, identify features and download the data.
              </p>
            </div>
            <Link to="/download" className="btn-primary" style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
              Launch Downloader <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </Link>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', borderLeft: '4px solid #059669', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                  <Compass style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>ArcGIS Online Discovery</h2>
              </div>
              <p style={muted}>
                Search public vector datasets, parcels, boundaries and feature layers hosted on ArcGIS Online without needing a service URL first.
              </p>
            </div>
            <Link to="/discover" className="btn-primary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#059669', boxSizing: 'border-box' }}>
              Open Discovery Tool <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </Link>
          </div>
        </div>

        {/* How it works */}
        <section style={wrap} aria-labelledby="how-it-works">
          <h2 id="how-it-works" style={sectionTitle}>How it works</h2>
          <ol style={{ ...muted, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><strong>Add a layer.</strong> Paste the service URL (for example <code>.../FeatureServer/0</code> or <code>.../wfs</code>). For a WFS service you choose which feature types to load.</li>
            <li><strong>Check the data.</strong> The layer appears on the map, with its geometry type, coordinate system and attribute table available before you export.</li>
            <li><strong>Export.</strong> The tool requests the layer&rsquo;s object IDs, downloads the features in small pages of 200, and converts them in your browser to GeoPackage, Shapefile, GeoJSON, CSV, KML or GPX.</li>
          </ol>
          <p style={{ ...muted, marginTop: '0.75rem' }}>
            Coordinates are exported in WGS84 (longitude/latitude) for ArcGIS layers, and WFS layers keep the coordinate system the server reports. Attribute values are exported as the server returns them. For a deeper explanation, read our guide to <Link to="/blog/understanding-coordinate-systems-and-projections" style={{ color: 'var(--accent-color)' }}>coordinate systems and projections</Link>.
          </p>
        </section>

        {/* Feature highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', ...wrap }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Database style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>ArcGIS REST and WFS</h3>
            <p style={muted}>Load FeatureServer and MapServer layers, ArcGIS Online items, and WFS 1.0.0 to 2.0.0 feature types in one place.</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Compass style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Metadata first</h3>
            <p style={muted}>Inspect spatial reference, geometry type, extent and field definitions before you spend time downloading.</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Zap style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Private by design</h3>
            <p style={muted}>There is no backend. Your browser talks directly to the data provider, and conversion happens locally.</p>
          </div>
        </div>

        {/* Guides */}
        <section style={wrap} aria-labelledby="guides">
          <h2 id="guides" style={sectionTitle}>Guides for working with GIS services</h2>
          <ul style={{ ...muted, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link to={`/blog/${g.slug}`} style={{ color: 'var(--accent-color)' }}>{g.title}</Link>
              </li>
            ))}
          </ul>
          <p style={{ ...muted, marginTop: '0.75rem' }}>
            More in the <Link to="/blog" style={{ color: 'var(--accent-color)' }}>blog</Link> and the <Link to="/documentation" style={{ color: 'var(--accent-color)' }}>documentation</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section style={wrap} aria-labelledby="faq">
          <h2 id="faq" style={sectionTitle}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {FAQS.map((f) => (
              <details key={f.q} className="card" style={{ padding: '0.9rem 1.1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{f.q}</summary>
                <p style={{ ...muted, marginTop: '0.6rem' }}>{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ ...muted, marginTop: '1rem' }}>
            Built and maintained by Muhammad Junaid Baig. Questions or corrections? See the <Link to="/about" style={{ color: 'var(--accent-color)' }}>about page</Link> or <Link to="/contact" style={{ color: 'var(--accent-color)' }}>contact us</Link>.
          </p>
        </section>
      </div>
    </>
  );
};

export default Home;
