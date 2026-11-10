import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => (
  <>
    <SEO
      title="Page not found"
      description="The page you were looking for does not exist. Use the links to find the GIS downloader, converter or guides."
      path="/404"
      noindex
    />
    <div style={{ maxWidth: '36rem', margin: '3rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.75rem', color: 'var(--text-main)' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
        That address does not exist or has moved. Try one of these instead:
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-primary">Home</Link>
        <Link to="/download" className="btn-primary">Downloader</Link>
        <Link to="/blog" className="btn-primary">Blog</Link>
      </div>
    </div>
  </>
);

export default NotFound;
