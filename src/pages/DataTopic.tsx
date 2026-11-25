import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO, buildBreadcrumbSchema, buildFaqSchema } from '../components/SEO';
import { ContentRenderer } from '../components/blog/ContentRenderer';
import { getDataTopic, DATA_TOPICS } from '../data/dataTopics';
import { getPostBySlug } from '../data/blogPosts';
import { CityLinks } from '../components/data/CityLinks';

export const DataTopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? getDataTopic(slug) : undefined;
  if (!topic) return <Navigate to="/data" replace />;

  const path = `/data/${topic.slug}`;
  const posts = topic.relatedPosts.map((s) => getPostBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getPostBySlug>>[];
  const topics = topic.relatedTopics.map((s) => DATA_TOPICS.find((t) => t.slug === s)).filter(Boolean) as typeof DATA_TOPICS;
  const short = topic.h1.split(':')[0];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.h1,
    description: topic.description,
    datePublished: topic.datePublished,
    dateModified: topic.dateModified,
    author: { '@type': 'Person', name: 'Muhammad Junaid Baig' },
    mainEntityOfPage: `https://www.geo-server-data-downloader.com${path}`,
  };

  return (
    <>
      <SEO
        title={topic.title}
        description={topic.description}
        keywords={topic.keywords}
        path={path}
        type="article"
        publishedTime={topic.datePublished}
        modifiedTime={topic.dateModified}
        structuredData={[
          articleSchema,
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Parcel Data', path: '/data' }, { name: short, path }]),
          buildFaqSchema(topic.faqs.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <article style={{ maxWidth: '50rem', margin: '0 auto', padding: '1.5rem 1rem 3rem', color: 'var(--text-main)' }}>
        <Link to="/data" className="touch-target" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.25rem' }}>
          <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} /> Parcel data by city
        </Link>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.15rem)', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.2 }}>{topic.h1}</h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>{topic.intro}</p>

        <aside className="card" style={{ margin: '1.25rem 0 0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6, flex: '1 1 16rem' }}>
            {topic.slug === 'parcel-data'
              ? 'Looking for a specific city or county? See the official parcel layers we have collected.'
              : `Want to find ${short.replace(/^US /, '').toLowerCase()} for your area? Search all public ArcGIS services.`}
          </p>
          <Link to={topic.slug === 'parcel-data' ? '/data' : `/discover?q=${encodeURIComponent(topic.searchTerm)}&sort=views`} className="btn-primary" style={{ textDecoration: 'none' }}>
            {topic.slug === 'parcel-data' ? 'Parcel data by city' : 'Search in Discover'}
          </Link>
        </aside>

        <ContentRenderer blocks={topic.content} />

        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem' }}>Frequently asked questions</h2>
          {topic.faqs.map((f) => (
            <div key={f.q} style={{ marginBottom: '1.1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.3rem' }}>{f.q}</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        {topic.slug === 'parcel-data' && <CityLinks />}

        {(posts.length > 0 || topics.length > 0) && (
          <aside style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            {posts.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Related guides</h2>
                <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.9, margin: '0 0 1.25rem' }}>
                  {posts.map((po) => <li key={po.slug}><Link to={`/blog/${po.slug}`}>{po.title}</Link></li>)}
                </ul>
              </>
            )}
            {topics.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem' }}>More US data</h2>
                <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.9, margin: 0 }}>
                  {topics.map((t) => <li key={t.slug}><Link to={`/data/${t.slug}`}>{t.h1.split(':')[0]}</Link></li>)}
                </ul>
              </>
            )}
          </aside>
        )}
      </article>
    </>
  );
};
