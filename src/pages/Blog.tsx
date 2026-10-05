import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getSortedPosts } from '../data/blogPosts';
import { articleStyle, h1Style } from './Privacy';

export const Blog: React.FC = () => {
  const posts = getSortedPosts();

  return (
    <>
      <SEO
        title="GIS Tutorials and Guides"
        description="In-depth tutorials and practical guides on ArcGIS REST services, spatial data formats, GIS downloads, and everything related to working with vector geospatial data."
        keywords="GIS tutorials, ArcGIS guides, spatial data format comparison, download GIS data guide, GeoJSON tutorial, Shapefile guide"
        path="/blog"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Geo Server Data Downloader — Blog',
          description:
            'Tutorials and guides on ArcGIS, GIS data formats, and spatial data downloads.',
          url: 'https://www.geo-server-data-downloader.com/blog',
        }}
      />

      <div style={articleStyle}>
        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent-color)',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            <BookOpen style={{ width: '0.9rem', height: '0.9rem' }} />
            Blog &amp; Guides
          </div>
          <h1 style={{ ...h1Style, marginBottom: '0.75rem' }}>
            GIS Tutorials and Guides
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Practical, in-depth articles on ArcGIS REST services, spatial
            data formats, and getting the most out of your GIS workflows.
          </p>
        </header>

        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No posts yet. Check back soon!
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--accent-color)',
                    backgroundColor: 'var(--accent-soft)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    width: 'fit-content',
                  }}
                >
                  {post.category}
                </span>

                <h2
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Calendar style={{ width: '0.8rem', height: '0.8rem' }} />
                    {new Date(post.datePublished).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Clock style={{ width: '0.8rem', height: '0.8rem' }} />
                    {post.readingTimeMinutes} min read
                  </span>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--accent-color)',
                  }}
                >
                  Read article <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;