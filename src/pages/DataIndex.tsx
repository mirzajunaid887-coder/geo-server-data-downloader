import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ListTree, ChevronUp, PlusCircle } from 'lucide-react';
import { SEO, buildBreadcrumbSchema } from '../components/SEO';
import { ServiceInspector } from '../components/discover/ServiceInspector';
import { CITY_PARCELS } from '../data/cityParcels';
import { DATA_TOPICS } from '../data/dataTopics';

const h3: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 700, margin: '1rem 0 0.3rem' };
const ulS: React.CSSProperties = { paddingLeft: '1.2rem', margin: 0, lineHeight: 1.75, fontSize: '0.92rem' };

export const DataIndex: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);
  const load = (url: string) => navigate('/download?url=' + encodeURIComponent(url));

  return (
    <>
      <SEO
        title="US Parcel Data by City: Official Sources & Downloads"
        description="Official parcel layers for big US cities and counties, with coverage notes, field lists and a one-click load into the downloader. Download as Shapefile, GeoJSON or GeoPackage."
        keywords="parcel data by city, US parcel data download, Cook County parcels, Houston parcel data, Maricopa County parcels, New York tax parcels, free parcel shapefile"
        path="/data"
        structuredData={[buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Parcel Data', path: '/data' }])]}
      />
      <article style={{ maxWidth: '50rem', margin: '0 auto', padding: '1.5rem 1rem 3rem', color: 'var(--text-main)' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.15rem)', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.2 }}>US Parcel Data by City</h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
          Official parcel layers for big US cities and counties, with notes on what each one covers and what to watch for. Feature counts, field lists and coordinate systems are read live from each service, so they are always current. Parcels are kept by counties in most places, so a city name often leads to a county layer.
        </p>

        <nav aria-label="Cities" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0 0' }}>
          {CITY_PARCELS.map((c) => <a key={c.slug} href={`#${c.slug}`} className="chip">{c.place.split(',')[0].split(' (')[0]}</a>)}
        </nav>

        {CITY_PARCELS.map((c) => {
          const isOpen = open === c.slug;
          return (
            <section key={c.slug} id={c.slug} className="card" style={{ margin: '1.75rem 0' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.2rem' }}>{c.name}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>{c.place} · Published by {c.publisher}</p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 0.5rem' }}>{c.summary}</p>
              <h3 style={h3}>Coverage</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.75, margin: 0 }}>{c.coverage}</p>
              <h3 style={h3}>What is inside</h3>
              <ul style={ulS}>{c.inside.map((t) => <li key={t}>{t}</li>)}</ul>
              <h3 style={h3}>Watch out for</h3>
              <ul style={ulS}>{c.watchOut.map((t) => <li key={t}>{t}</li>)}</ul>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.1rem' }}>
                <button type="button" className="btn-primary" onClick={() => load(c.serviceUrl)}>
                  <PlusCircle style={{ width: '1rem', height: '1rem' }} /> Load in the downloader
                </button>
                <button type="button" className="btn-secondary" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.slug)}>
                  {isOpen ? <ChevronUp style={{ width: '1rem', height: '1rem' }} /> : <ListTree style={{ width: '1rem', height: '1rem' }} />}
                  {isOpen ? 'Hide live details' : 'Show live details'}
                </button>
              </div>
              {isOpen && <div style={{ marginTop: '1rem' }}><ServiceInspector serviceUrl={c.serviceUrl} onAddToMap={load} /></div>}
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.9rem 0 0', overflowWrap: 'anywhere' }}>Endpoint: {c.serviceUrl}</p>
            </section>
          );
        })}

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Before you use any of these</h2>
          <ul style={{ ...ulS, fontSize: '0.95rem' }}>
            <li>Parcel lines are an index map, not a legal survey.</li>
            <li>Read each publisher&apos;s terms of use, especially if you plan to resell or republish the data.</li>
            <li>Owner names and mailing addresses are personal data. Use them only as the law and the publisher allow.</li>
            <li>Services change. If a layer stops loading, search for the new link in <Link to="/discover">Discover</Link> or the <Link to="/data/parcel-data">parcel data guide</Link>.</li>
          </ul>
        </section>
        <section style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>More US data guides</h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Looking for a place that is not listed? Read the guides below, or search every public ArcGIS service in <Link to="/discover">Discover</Link>.
          </p>
          <ul style={{ ...ulS, fontSize: '0.95rem' }}>
            {DATA_TOPICS.map((t) => <li key={t.slug}><Link to={`/data/${t.slug}`}>{t.h1.split(':')[0]}</Link></li>)}
          </ul>
        </section>
      </article>
    </>
  );
};
