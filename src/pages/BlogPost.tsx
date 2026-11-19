import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, User } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ContentRenderer } from '../components/blog/ContentRenderer';
import { AdSlot } from '../components/ads/AdSlot';
import { ADSENSE_SLOT_ARTICLE } from '../config/ads';
import { getPostBySlug, getRelatedPosts } from '../data/blogPosts';
import { REDIRECTED_SLUGS, isIndexable, countWords } from '../data/blogSeo';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    // Posts merged into a stronger guide redirect to it (the server sends a 301 too).
    const mergedInto = slug ? REDIRECTED_SLUGS[slug] : undefined;
    return <Navigate to={mergedInto ? `/blog/${mergedInto}` : '/blog'} replace />;
  }

  // Thin posts: noindex and ad-free until they reach the quality threshold.
  const indexable = isIndexable(post);
  const related = getRelatedPosts(post.slug, 3);
  const wasUpdated = post.dateModified && post.dateModified !== post.datePublished;

  const siteUrl = 'https://www.geo-server-data-downloader.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}/og-image.png`,
    wordCount: countWords(post),
    inLanguage: 'en',
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
        noindex={!indexable}
        publishedTime={post.datePublished}
        modifiedTime={post.dateModified}
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
          className="touch-target"
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
              fontSize: '0.72rem',
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
            {wasUpdated && (
              <span>
                Updated{' '}
                {new Date(post.dateModified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </header>

        <ContentRenderer blocks={post.content} currentSlug={post.slug} />

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

        {/* One ad unit, after the article body, and only on substantial articles */}
        {indexable && <AdSlot slotId={ADSENSE_SLOT_ARTICLE} minHeight={250} />}

        {/* Author */}
        <section
          aria-label="About the author"
          style={{
            margin: '2rem 0 1.5rem',
            padding: '1rem 1.1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--bg-hover)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
          }}
        >
          <strong style={{ color: 'var(--text-main)' }}>Written by {post.author}</strong>, a geospatial developer who builds and maintains Geo Server Data Downloader.{' '}
          <Link to="/about" style={{ color: 'var(--accent-color)' }}>About the author</Link>. Spotted a mistake or an outdated step?{' '}
          <Link to="/contact" style={{ color: 'var(--accent-color)' }}>Tell us</Link> and we will fix it.
        </section>

        {/* Related guides */}
        {related.length > 0 && (
          <section aria-label="Related guides" style={{ margin: '0 0 1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.6rem', color: 'var(--text-main)' }}>
              Related guides
            </h2>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/blog/${r.slug}`} style={{ color: 'var(--accent-color)' }}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </section>
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