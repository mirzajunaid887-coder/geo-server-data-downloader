import React, { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ListTree, ChevronUp, PlusCircle } from 'lucide-react';
import { SEO, buildBreadcrumbSchema, buildFaqSchema } from '../components/SEO';
import { ServiceInspector } from '../components/discover/ServiceInspector';
import { DownloadNow } from '../components/data/DownloadNow';
import { PARCEL_CITIES, cityLabel, cityPath, getParcelCity } from '../data/parcelCities';

const h2: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 800, margin: '2rem 0 0.5rem' };
const ulS: React.CSSProperties = { paddingLeft: '1.2rem', margin: 0, lineHeight: 1.8, fontSize: '0.95rem' };
const pS: React.CSSProperties = { fontSize: '0.97rem', lineHeight: 1.75, margin: '0 0 0.6rem' };

const prettyDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const ParcelCityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const c = slug ? getParcelCity(slug) : undefined;
  if (!c) return <Navigate to="/data" replace />;

  const label = cityLabel(c);
  const path = cityPath(c);
  const where = c.county ? `${c.city}, ${c.state} (${c.county})` : `${c.city}, ${c.state}`;
  const load = (url: string) => navigate('/download?url=' + encodeURIComponent(url));
  const sameState = PARCEL_CITIES.filter((o) => o.stateCode === c.stateCode && o.slug !== c.slug);
  const others = PARCEL_CITIES.filter((o) => o.stateCode !== c.stateCode && o.slug !== c.slug).slice(0, 6);

  const faqs = [
    {
      q: `Where can I download ${c.city} parcel data?`,
      a: `${c.publisher ? `${c.publisher} publishes` : 'The official GIS server publishes'} a parcel layer for ${where}. This page links to it. Use "Load in the downloader" to export it as Shapefile, GeoJSON, GeoPackage or CSV without installing GIS software.`,
    },
    {
      q: `What does the ${c.city} parcel layer cover?`,
      a: c.coverage.length ? c.coverage.join(' ') : c.about.join(' '),
    },
    {
      q: `How current is this ${c.city} parcel link?`,
      a: c.checked
        ? `We last confirmed that the link opens on ${prettyDate(c.checked)}. The live details on this page are read directly from the service, so feature counts and fields are always the current ones.`
        : 'The live details on this page are read directly from the service, so feature counts and fields are always the current ones.',
    },
    {
      q: `Can I download all ${c.city} parcels at once?`,
      a: `Yes, with no filter needed. "Download now" pages through the whole layer and saves it in the layer's own coordinate system. Shapefile, GeoJSON and CSV are written straight to your disk, so layers with millions of parcels work; a very large Shapefile is split into several .zip parts of under 2 GB each. GeoPackage and KML are built in memory, so they are limited to 100,000 features. Keep the download tab open and leave enough free disk space (a few gigabytes for a million parcels).`,
    },
    {
      q: 'Can I use parcel data commercially?',
      a: 'That depends on the publisher. Read the terms of use on the official site before you resell or republish parcel data, and handle owner names and mailing addresses as personal data.',
    },
  ];

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${c.city}, ${c.stateCode} parcel data`,
    description: c.about.join(' ').slice(0, 500),
    url: `https://www.geo-server-data-downloader.com${path}`,
    ...(c.publisher ? { creator: { '@type': 'Organization', name: c.publisher } } : {}),
    spatialCoverage: where,
    isAccessibleForFree: true,
    distribution: [{ '@type': 'DataDownload', contentUrl: c.url, encodingFormat: 'ArcGIS REST' }],
    ...(c.checked ? { dateModified: c.checked } : {}),
  };

  return (
    <>
      <SEO
        title={`${label} Parcel Data: Official Source & Download`}
        description={`Official parcel data for ${where}: what the layer covers, which fields it has and how to download it as Shapefile, GeoJSON or GeoPackage.`}
        keywords={`${c.city} parcel data, ${c.city} ${c.stateCode} parcels, ${c.county ? c.county + ' parcel data, ' : ''}${c.city} GIS data download, ${c.city} parcel shapefile`}
        path={path}
        noindex={!c.indexable}
        modifiedTime={c.checked ?? undefined}
        structuredData={[
          datasetSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' }, { name: 'Parcel Data', path: '/data' }, { name: label, path },
          ]),
          buildFaqSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <article style={{ maxWidth: '50rem', margin: '0 auto', padding: '1.5rem 1rem 3rem', color: 'var(--text-main)' }}>
        <Link to="/data" className="touch-target" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.25rem' }}>
          <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} /> Parcel data by city
        </Link>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.15rem)', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.2 }}>{c.city}, {c.state} Parcel Data</h1>
        {c.about.map((t, i) => <p key={i} style={{ ...pS, fontSize: i === 0 ? '1.05rem' : '0.97rem', color: i === 0 ? 'var(--text-muted)' : undefined }}>{t}</p>)}

        <dl className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.35rem 1rem', margin: '1.25rem 0', fontSize: '0.9rem' }}>
          <dt style={{ fontWeight: 700 }}>Place</dt><dd style={{ margin: 0 }}>{c.city}, {c.state}</dd>
          {c.county && <><dt style={{ fontWeight: 700 }}>County</dt><dd style={{ margin: 0 }}>{c.county}</dd></>}
          {c.publisher && <><dt style={{ fontWeight: 700 }}>Published by</dt><dd style={{ margin: 0 }}>{c.publisher}</dd></>}
          {c.checked && <><dt style={{ fontWeight: 700 }}>Link last checked</dt><dd style={{ margin: 0 }}><time dateTime={c.checked}>{prettyDate(c.checked)}</time></dd></>}
        </dl>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <DownloadNow city={c} inline />
          <button type="button" className="btn-secondary" onClick={() => load(c.url)}>
            <PlusCircle style={{ width: '1rem', height: '1rem' }} /> Load in the downloader
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0.6rem 0 0' }}>
          Download now opens a new tab and saves the data in the layer&apos;s original coordinate system, so this page keeps working. Use the downloader instead if you want to preview or filter on a map first.
        </p>

        {c.coverage.length > 0 && (
          <>
            <h2 style={h2}>What the {c.city} layer covers</h2>
            {c.coverage.map((t, i) => <p key={i} style={pS}>{t}</p>)}
          </>
        )}
        {c.fields.length > 0 && (
          <>
            <h2 style={h2}>What is inside</h2>
            <ul style={ulS}>{c.fields.map((t) => <li key={t}>{t}</li>)}</ul>
          </>
        )}
        {c.watchOut.length > 0 && (
          <>
            <h2 style={h2}>Watch out for</h2>
            <ul style={ulS}>{c.watchOut.map((t) => <li key={t}>{t}</li>)}</ul>
          </>
        )}

        <h2 style={h2}>Live service details</h2>
        <p style={{ ...pS, color: 'var(--text-muted)' }}>Feature count, fields and coordinate system are read from the service when you open this panel.</p>
        <button type="button" className="btn-secondary" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <ChevronUp style={{ width: '1rem', height: '1rem' }} /> : <ListTree style={{ width: '1rem', height: '1rem' }} />}
          {open ? 'Hide live details' : 'Show live details'}
        </button>
        {open && <div style={{ marginTop: '1rem' }}><ServiceInspector serviceUrl={c.url} onAddToMap={load} /></div>}
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.9rem 0 0', overflowWrap: 'anywhere' }}>Endpoint: {c.url}</p>

        <h2 style={h2}>How to download {c.city} parcel data</h2>
        <ol style={ulS}>
          <li>Select <strong>Load in the downloader</strong> above. The {c.city} parcel layer opens with its fields listed.</li>
          <li>Optional: filter by a field such as address, ZIP code or parcel number so you only pull the area you need.</li>
          <li>Choose a format: Shapefile, GeoJSON, GeoPackage or CSV.</li>
          <li>Download the file and open it in QGIS, ArcGIS Pro or any GIS tool. Check the coordinate system first if you will measure areas.</li>
        </ol>
        <p style={{ ...pS, marginTop: '0.75rem' }}>
          New to parcel data? Read the <Link to="/data/parcel-data">US parcel data guide</Link>{' '}or search other layers with <Link to="/discover">Discover: find ArcGIS parcel services</Link>.
        </p>

        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ ...h2, marginTop: 0 }}>Frequently asked questions</h2>
          {faqs.map((f) => (
            <div key={f.q} style={{ marginBottom: '1.1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.3rem' }}>{f.q}</h3>
              <p style={{ ...pS, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        {(sameState.length > 0 || others.length > 0) && (
          <aside style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            {sameState.length > 0 && (
              <>
                <h2 style={{ ...h2, marginTop: 0, fontSize: '1.1rem' }}>More parcel data in {c.state}</h2>
                <ul style={{ ...ulS, margin: '0 0 1.25rem' }}>{sameState.map((o) => <li key={o.slug}><Link to={cityPath(o)}>{cityLabel(o)} parcel data</Link></li>)}</ul>
              </>
            )}
            {others.length > 0 && (
              <>
                <h2 style={{ ...h2, marginTop: 0, fontSize: '1.1rem' }}>Parcel data for other cities</h2>
                <ul style={ulS}>{others.map((o) => <li key={o.slug}><Link to={cityPath(o)}>{cityLabel(o)} parcel data</Link></li>)}</ul>
              </>
            )}
          </aside>
        )}
      </article>
    </>
  );
};
