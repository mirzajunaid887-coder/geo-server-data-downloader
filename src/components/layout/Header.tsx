import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Globe, Compass, BookOpen, Info } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="app-header-content">
        <Link to="/" className="app-logo">
          <Database style={{ width: '1.5rem', height: '1.5rem', color: 'var(--accent-color)' }} />
          <span>{APP_CONFIG.APP_NAME}</span>
        </Link>
        <nav className="app-nav">
          <Link to="/download">
            <Globe style={{ width: '1rem', height: '1rem' }} /> Downloader
          </Link>
          <Link to="/discover">
            <Compass style={{ width: '1rem', height: '1rem' }} /> Discover AGOL
          </Link>
          <Link to="/documentation">
            <BookOpen style={{ width: '1rem', height: '1rem' }} /> Documentation
          </Link>
          <Link to="/about">
            <Info style={{ width: '1rem', height: '1rem' }} /> About
          </Link>
        </nav>
      </div>
    </header>
  );
};