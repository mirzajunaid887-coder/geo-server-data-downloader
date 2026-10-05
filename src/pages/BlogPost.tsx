import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, User } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ContentRenderer } from '../components/blog/ContentRenderer';
import { getPostBySlug } from '../data/blogPosts';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const siteUrl = 'https://www.geo-server-data-downloader.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}/android-chrome-512x512.png`,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Geo Server Data Downloader',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.keywords,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        keywords={post.keywords}
        path={`/blog/${post.slug}`}
        type="article"
        structuredData={[articleSchema, breadcrumbSchema]}
      />

      <article
        style={{
          maxWidth: '46rem',
          margin: '0 auto',
          padding: '1.5rem 1rem 3rem',
          color: 'var(--text-main)',
        }}
      >
        <Link
          to="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} />
          Back to all articles
        </Link>

        <header style={{ marginBottom: '2rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--accent-color)',
              backgroundColor: 'var(--accent-soft)',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              marginBottom: '0.85rem',
            }}
          >
            {post.category}
          </span>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4.5vw, 2.15rem)',
              fontWeight: 800,
              margin: '0 0 1rem',
              lineHeight: 1.2,
              color: 'var(--text-main)',
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--text-muted)',
              margin: '0 0 1.25rem',
            }}
          >
            {post.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <User style={{ width: '0.85rem', height: '0.85rem' }} />
              {post.author}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar style={{ width: '0.85rem', height: '0.85rem' }} />
              {new Date(post.datePublished).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock style={{ width: '0.85rem', height: '0.85rem' }} />
              {post.readingTimeMinutes} min read
            </span>
          </div>
        </header>

        <ContentRenderer blocks={post.content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-hover)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            backgroundColor: 'var(--accent-soft)',
            border: '1px solid var(--accent-color)',
            borderRadius: '0.6rem',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              margin: '0 0 0.5rem',
              color: 'var(--text-main)',
            }}
          >
            Ready to try it yourself?
          </h3>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              margin: '0 0 1rem',
              lineHeight: 1.5,
            }}
          >
            Export ArcGIS REST services, WFS endpoints, and ArcGIS Online
            datasets to Shapefile, GeoJSON, KML, or GeoPackage — all in your
            browser.
          </p>
          <Link
            to="/download"
            className="btn-primary"
            style={{ display: 'inline-flex' }}
          >
            Open the Downloader
          </Link>
        </div>
      </article>
    </>
  );
};

export default BlogPost;