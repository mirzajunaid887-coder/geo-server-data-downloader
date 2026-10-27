import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';

/* ============================================================
   👇 EDIT THESE VALUES WITH YOUR REAL LINKS
   ============================================================ */
const CONTACT = {
  email: 'gisgynix@gmail.com',
  fiverr: 'https://www.fiverr.com/gisgynix',
  upwork: 'https://www.upwork.com/freelancers/~014c5dfcb05a8b2acb',
  github: 'https://github.com/mirzajunaid887-coder',
  linkedin: 'https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/',
  facebook: 'https://www.facebook.com/profile.php?id=61553547554500',
};
/* ============================================================ */

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1rem 1rem',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
      }}
    >
      {/* Top grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '1.5rem',
        }}
      >
        {/* Brand */}
        <div>
          <h3
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Globe
              style={{
                width: '1.05rem',
                height: '1.05rem',
                color: 'var(--accent-color)',
              }}
            />
            {APP_CONFIG.APP_NAME}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.78rem',
              lineHeight: 1.5,
              color: 'var(--text-muted)',
            }}
          >
            Free, browser-based tool for exploring and downloading ArcGIS REST,
            WFS, and other spatial web services as Shapefile, GeoJSON, KML,
            GeoPackage, GPX and CSV. Plus you can also download the data available at
            ArcGIS Online Store directly through the discovery tool.
          </p>
        </div>

        {/* Find Me Online */}
        {(CONTACT.github || CONTACT.linkedin || CONTACT.facebook) && (
          <div>
            <h4 style={sectionHeadingStyle}>Find Me Online</h4>
            <ul style={listStyle}>
              {CONTACT.github && (
                <li>
                  <a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={footerLinkStyle}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    <FontAwesomeGithub style={iconStyle} />
                    GitHub
                  </a>
                </li>
              )}
              {CONTACT.linkedin && (
                <li>
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={footerLinkStyle}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    <FontAwesomeLinkedIn style={iconStyle} />
                    LinkedIn
                  </a>
                </li>
              )}
              {CONTACT.facebook && (
                <li>
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={footerLinkStyle}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    <FontAwesomeFacebook style={iconStyle} />
                    Facebook Page
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Legal / Quick Links */}
        <div>
          <h4 style={sectionHeadingStyle}>Information</h4>
          <ul style={listStyle}>
            <li>
              <Link
                to="/contact"
                style={footerLinkStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Contact Me
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                style={footerLinkStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Blog &amp; Guides
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                style={footerLinkStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                style={footerLinkStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.75rem',
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; {year} {APP_CONFIG.APP_NAME}. All rights reserved.
        </p>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Built by Junaid for the GIS community
        </p>
      </div>
    </footer>
  );
};

/* ============================================================
   FONT AWESOME BRAND ICONS (Inline SVGs)
   ------------------------------------------------------------
   Using the exact official Font Awesome SVG paths for brands
   so you don't need to install any extra npm packages.
   ============================================================ */

interface IconProps {
  style?: React.CSSProperties;
}

const FontAwesomeGithub: React.FC<IconProps> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 496 512"
    fill="currentColor"
    style={style}
    aria-hidden="true"
  >
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
  </svg>
);

const FontAwesomeLinkedIn: React.FC<IconProps> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    style={style}
    aria-hidden="true"
  >
    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
  </svg>
);

const FontAwesomeFacebook: React.FC<IconProps> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    style={style}
    aria-hidden="true"
  >
    <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" />
  </svg>
);

/* -------- styling helpers -------- */

const sectionHeadingStyle: React.CSSProperties = {
  margin: '0 0 0.6rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
};

const footerLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
};

const iconStyle: React.CSSProperties = {
  width: '1rem',
  height: '1rem',
  color: 'var(--accent-color)',
  flexShrink: 0,
};

const hoverOn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = 'var(--accent-color)';
};

const hoverOff = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = 'var(--text-muted)';
};

export default Footer;