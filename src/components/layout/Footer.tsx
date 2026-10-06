import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Briefcase, MessageCircle, Github, Linkedin, Globe } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';

/* ============================================================
   👇 EDIT THESE VALUES WITH YOUR REAL LINKS
   ============================================================ */
const CONTACT = {
  email: 'gisgynix@gmail.com',
  fiverr: 'https://www.fiverr.com/gisgynix',
  upwork: 'https://www.upwork.com/freelancers/~014c5dfcb05a8b2acb',
  github: 'https://github.com/mirzajunaid887-coder',            // set to '' to hide
  linkedin: 'https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/',  // set to '' to hide
  facebook: 'https://www.facebook.com/profile.php?id=61553547554500',                                           // optional, set to '' to hide
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
        {(CONTACT.github || CONTACT.linkedin || CONTACT.website) && (
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
                    <Github style={iconStyle} />
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
                    <Linkedin style={iconStyle} />
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
                    <Globe style={iconStyle} />
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
  <Link to="/contact" style={footerLinkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
    Contact Me
  </Link>
</li>
<li>
  <Link to="/blog" style={footerLinkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
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
  width: '0.9rem',
  height: '0.9rem',
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