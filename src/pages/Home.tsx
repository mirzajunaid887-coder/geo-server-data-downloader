import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Compass, ArrowRight, Zap, Database } from 'lucide-react';
import { APP_CONFIG } from '../config/app';
import { AdContainer } from '../components/ads/AdContainer';

export const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1rem', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.025em', margin: 0, color: 'var(--text-main)' }}>
          Download GIS Data Without the Hassle
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', margin: 0 }}>
          {APP_CONFIG.APP_DESCRIPTION}
        </p>
      </div>

      {/* Main Workflow Action Highlight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 1rem', boxSizing: 'border-box' }}>
        
        {/* Direct URL Downloader Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', borderLeft: '4px solid var(--accent-color)', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-color)' }}>
                <Globe style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Direct URL Downloader</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
              Paste an ArcGIS REST FeatureServer or WFS service endpoint directly. Query metadata, review layer attributes, batch-download object IDs, and render interactively on the map.
            </p>
          </div>
          <Link to="/download" className="btn-primary" style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
            Launch Downloader <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </Link>
        </div>

        {/* ArcGIS Online Discovery Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', borderLeft: '4px solid #059669', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                <Compass style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>ArcGIS Online Discovery</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
              Search thousands of public vector datasets, parcels, boundaries, and feature layers hosted on ArcGIS Online without needing a pre-existing service URL.
            </p>
          </div>
          <Link to="/discover" className="btn-primary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#059669', boxSizing: 'border-box' }}>
            Open Discovery Tool <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </Link>
        </div>

      </div>

      <div style={{ maxWidth: '48rem', margin: '0 auto', width: '100%', padding: '0 1rem', boxSizing: 'border-box' }}>
        <AdContainer />
      </div>

      {/* Feature Grid Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', maxWidth: '1000px', margin: '0 auto', width: '100%', paddingLeft: '1rem', paddingRight: '1rem', boxSizing: 'border-box' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Database style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>Direct URL Support</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            Connect directly to any standard ArcGIS REST or WFS service endpoint to load, inspect, and export features instantly.
          </p>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Compass style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>Integrated Metadata</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            Inspect spatial reference IDs, geometry categories, coordinate limits, and attribute field definitions prior to export.
          </p>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Zap style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>Client-Side Processing</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            Leverage robust batch pagination and in-browser conversion pipelines to export GeoJSON, CSV, and spatial packages securely.
          </p>
        </div>
      </div>
    </div>
  );
};