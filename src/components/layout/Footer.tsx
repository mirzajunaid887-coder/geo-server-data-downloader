import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config/app';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '2rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <p>&copy; {new Date().getFullYear()} {APP_CONFIG.APP_NAME}. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};