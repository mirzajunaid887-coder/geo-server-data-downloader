import React from 'react';
import { Link } from 'react-router-dom';
import { ContentBlock } from '../../types/blog';

const h2Style: React.CSSProperties = {
  fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)',
  fontWeight: 700,
  color: 'var(--text-main)',
  margin: '2rem 0 0.75rem',
  lineHeight: 1.3,
};

const h3Style: React.CSSProperties = {
  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
  fontWeight: 700,
  color: 'var(--text-main)',
  margin: '1.5rem 0 0.5rem',
  lineHeight: 1.35,
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.75,
  color: 'var(--text-main)',
  margin: '0 0 1rem',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '1.4rem',
  margin: '0 0 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  fontSize: '0.95rem',
  lineHeight: 1.65,
  color: 'var(--text-main)',
};

const codeStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-hover)',
  padding: '0.75rem 1rem',
  borderRadius: '0.4rem',
  fontSize: '0.82rem',
  overflowX: 'auto',
  border: '1px solid var(--border-color)',
  margin: '0 0 1rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  color: 'var(--text-main)',
  whiteSpace: 'pre',
};

const calloutVariants: Record<
  'info' | 'warning' | 'tip',
  { bg: string; border: string; color: string }
> = {
  info: {
    bg: 'var(--accent-soft)',
    border: 'var(--accent-color)',
    color: 'var(--text-main)',
  },
  warning: {
    bg: 'var(--danger-soft)',
    border: 'var(--danger-color)',
    color: 'var(--text-main)',
  },
  tip: {
    bg: 'var(--success-soft)',
    border: 'var(--success-color)',
    color: 'var(--text-main)',
  },
};

/**
 * Automatic internal links for plain text (used when a block has no hand-placed links).
 * Each phrase links once per article, up to MAX_AUTO_LINKS per article.
 */
const AUTO_LINKS: [phrase: string, to: string][] = [
  ['Geo Server Data Downloader', '/download'],
  ['GIS Converter', '/converter'],
  ['Discover tool', '/discover'],
  ['Web Feature Service', '/blog/complete-guide-wfs-web-feature-service'],
  ['WMS and WFS', '/blog/wms-vs-wfs-choosing-the-right-web-service'],
  ['query parameters', '/blog/how-to-use-arcgis-rest-api-query-parameters'],
  ['coordinate reference system', '/blog/understanding-coordinate-systems-and-projections'],
  ['Shapefile to GeoJSON', '/blog/convert-shapefile-to-geojson-online'],
  ['GeoPDF to GeoTIFF', '/blog/how-to-convert-geopdf-to-geotiff'],
  ['KML to Shapefile', '/blog/converting-kml-to-shapefile-step-by-step'],
  ['OpenStreetMap', '/blog/downloading-openstreetmap-data-for-gis'],
  ['zoning data', '/blog/how-to-download-municipal-zoning-data'],
  ['parcel data', '/blog/how-to-find-free-parcel-data-us-counties'],
  ['raster data', '/blog/vector-vs-raster-data-in-gis'],
  ['geocoding', '/blog/beginners-guide-to-geocoding-and-reverse-geocoding'],
  ['GeoPackage', '/blog/geojson-vs-shapefile-vs-geopackage'],
];
const MAX_AUTO_LINKS = 4;

const linkStyle: React.CSSProperties = {
  color: 'var(--accent-color)',
  textDecoration: 'underline',
};

// Hand-placed links are written in the post text as [anchor text](/path or https://...)
const MD_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export const ContentRenderer: React.FC<{ blocks: ContentBlock[]; currentSlug?: string }> = ({
  blocks,
  currentSlug,
}) => {
  const linked = new Set<string>();

  const renderLink = (label: string, to: string, key: string | number): React.ReactNode =>
    to.startsWith('/') ? (
      <Link key={key} to={to} style={linkStyle}>
        {label}
      </Link>
    ) : (
      <a key={key} href={to} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {label}
      </a>
    );

  const autoLink = (text: string): React.ReactNode => {
    if (linked.size >= MAX_AUTO_LINKS) return text;
    for (const [phrase, to] of AUTO_LINKS) {
      if (linked.has(phrase) || to === `/blog/${currentSlug}`) continue;
      const idx = text.indexOf(phrase);
      if (idx === -1) continue;
      linked.add(phrase);
      return (
        <>
          {text.slice(0, idx)}
          {renderLink(phrase, to, 'auto')}
          {text.slice(idx + phrase.length)}
        </>
      );
    }
    return text;
  };

  const withLinks = (text: string): React.ReactNode => {
    if (!text.includes('](')) return autoLink(text);
    const parts: React.ReactNode[] = [];
    let last = 0;
    let n = 0;
    for (const m of text.matchAll(MD_LINK)) {
      const start = m.index ?? 0;
      if (start > last) parts.push(text.slice(last, start));
      if (m[2] === `/blog/${currentSlug}`) parts.push(m[1]);
      else parts.push(renderLink(m[1], m[2], n++));
      last = start + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return <>{parts.map((p, i) => (typeof p === 'string' ? <React.Fragment key={`t${i}`}>{p}</React.Fragment> : p))}</>;
  };

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return block.level === 2 ? (
              <h2 key={i} style={h2Style}>{block.text}</h2>
            ) : (
              <h3 key={i} style={h3Style}>{block.text}</h3>
            );

          case 'paragraph':
            return (
              <p key={i} style={paragraphStyle}>
                {withLinks(block.text)}
              </p>
            );

          case 'list':
            return block.ordered ? (
              <ol key={i} style={listStyle}>
                {block.items.map((item, j) => (
                  <li key={j}>{withLinks(item)}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} style={listStyle}>
                {block.items.map((item, j) => (
                  <li key={j}>{withLinks(item)}</li>
                ))}
              </ul>
            );

          case 'code':
            return (
              <pre key={i} style={codeStyle}>
                <code>{block.code}</code>
              </pre>
            );

          case 'callout': {
            const v = calloutVariants[block.variant];
            return (
              <aside
                key={i}
                style={{
                  backgroundColor: v.bg,
                  borderLeft: `4px solid ${v.border}`,
                  padding: '0.85rem 1rem',
                  borderRadius: '0.4rem',
                  margin: '0 0 1rem',
                  color: v.color,
                }}
              >
                {block.title && (
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {block.title}
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {withLinks(block.text)}
                </div>
              </aside>
            );
          }

          case 'image':
            return (
              <figure key={i} style={{ margin: '0 0 1.25rem' }}>
                <img
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  loading="lazy"
                  decoding="async"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '0.4rem',
                    border: '1px solid var(--border-color)',
                  }}
                />
                {block.caption && (
                  <figcaption
                    style={{
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      color: 'var(--text-muted)',
                      marginTop: '0.4rem',
                    }}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'video':
            return (
              <figure key={i} style={{ margin: '0 0 1.25rem' }}>
                <video
                  src={block.src}
                  poster={block.poster}
                  width={block.width}
                  height={block.height}
                  aria-label={block.label}
                  controls
                  playsInline
                  preload="metadata"
                  {...(block.autoplay ? { autoPlay: true, muted: true, loop: true } : {})}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '0.4rem',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#000',
                  }}
                >
                  Your browser does not support embedded video. {block.label}
                </video>
                {block.caption && (
                  <figcaption
                    style={{
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      color: 'var(--text-muted)',
                      marginTop: '0.4rem',
                    }}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'table':
            return (
              <div
                key={i}
                style={{
                  overflowX: 'auto',
                  margin: '0 0 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.4rem',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem',
                    minWidth: '480px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-hover)' }}>
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          style={{
                            textAlign: 'left',
                            padding: '0.6rem 0.75rem',
                            borderBottom: '1px solid var(--border-color)',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            style={{
                              padding: '0.55rem 0.75rem',
                              borderBottom:
                                j < block.rows.length - 1
                                  ? '1px solid var(--border-color)'
                                  : 'none',
                              color: 'var(--text-main)',
                              verticalAlign: 'top',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default ContentRenderer;