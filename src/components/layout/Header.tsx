import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Database, Globe, Compass, BookOpen, Info, Menu, X } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';

const NAV_ITEMS = [
  { to: '/download', label: 'Downloader', icon: Globe },
  { to: '/discover', label: 'Discover AGOL', icon: Compass },
  { to: '/documentation', label: 'Documentation', icon: BookOpen },
  { to: '/about', label: 'About', icon: Info },
];

export const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer whenever route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = drawerOpen ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="app-header-content">
          <Link
            to="/"
            className="app-logo"
            onClick={() => setDrawerOpen(false)}
          >
            <Database
              style={{
                width: '1.4rem',
                height: '1.4rem',
                color: 'var(--accent-color)',
                flexShrink: 0,
              }}
            />
            <span>{APP_CONFIG.APP_NAME}</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="app-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}>
                <Icon style={{ width: '1rem', height: '1rem' }} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="app-header-actions">
            <button
              type="button"
              className="icon-button hamburger-button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet drawer */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${drawerOpen ? 'open' : ''}`}
        aria-hidden={!drawerOpen}
      >
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <nav className="drawer-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Header;