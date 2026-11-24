import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SEO, buildBreadcrumbSchema } from '../components/SEO';
import { DATA_TOPICS } from '../data/dataTopics';
import { PARCEL_CITIES, cityLabel, cityPath, citiesByState } from '../data/parcelCities';
import { DownloadNow } from '../components/data/DownloadNow';
import { articleStyle, h1Style } from './Privacy';

const snippet = (t: string) => (t.length > 150 ? t.slice(0, 150).replace(/\s+\S*$/, '') + '…' : t);

export const DataIndex: React.FC = () => {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s
      ? PARCEL_CITIES.filter((c) => `${c.city} ${c.county} ${c.state} ${c.stateCode}`.toLowerCase().includes(s))
      : PARCEL_CITIES;
    return citiesByState(list);
  }, [q]);

  return (
    <>
      <SEO
        title="US Parcel Data by City: Official Sources & Downloads"
        description="Official parcel data for big US cities and counties: coverage notes, key fields and a one-click load into the downloader. Export as Shapefile, GeoJSON or GeoPackage."
        keywords="parcel data by city, US parcel data download, free parcel data, county parcel shapefile, city parcel GIS data, tax parcel data download"
        path="/data"
        structuredData={[buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Parcel Data', path: '/data' }])]}
      />
      <div style={articleStyle}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ ...h1Style, marginBottom: '0.75rem' }}>US Parcel Data by City</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Official parcel layers from city, county and state servers, with notes on what each one covers and a one-click load into the downloader. Parcels are kept by counties in most places, so a city often leads to a county layer.
          </p>
        </header>

        <div style={{ maxWidth: '58rem', margin: '0 auto' }}>
          <label htmlFor="city-filter" style={{ position: 'absolute', left: '-9999px' }}>Find a city, county or state</label>
          <div style={{ position: 'relative', maxWidth: '26rem', margin: '0 auto 1.75rem' }}>
            <Search aria-hidden style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--text-muted)' }} />
            <input
              id="city-filter"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a city, county or state"
              className="input-field"
              style={{ width: '100%', paddingLeft: '2.25rem' }}
            />
          </div>

          {groups.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No city matches "{q}". Try <Link to={`/discover?q=${encodeURIComponent(q.trim() + ' parcels')}&sort=views`}>searching all public ArcGIS services</Link>.
            </p>
          )}

          {groups.map((g) => (
            <section key={g.stateCode} aria-labelledby={`st-${g.stateCode}`} style={{ marginBottom: '1.75rem' }}>
              <h2 id={`st-${g.stateCode}`} style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.75rem' }}>{g.state}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 26rem), 1fr))', gap: '1rem' }}>
                {g.cities.map((c) => (
                  <div key={c.slug} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Link to={cityPath(c)} style={{ textDecoration: 'none', color: 'inherit', flex: '1 1 14rem', minWidth: 0 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.2rem' }}>{cityLabel(c)} parcel data</h3>
                      {c.county && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.4rem' }}>{c.county}</p>}
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{snippet(c.about[0] ?? '')}</p>
                    </Link>
                    <DownloadNow city={c} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>More US data guides</h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Looking for a place that is not listed? Read the guides below, or search every public ArcGIS service in <Link to="/discover">Discover</Link>.
            </p>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.8, fontSize: '0.95rem' }}>
              {DATA_TOPICS.map((t) => <li key={t.slug}><Link to={`/data/${t.slug}`}>{t.h1.split(':')[0]}</Link></li>)}
            </ul>
          </section>

          <section style={{ marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Before you use any parcel data</h2>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.8, fontSize: '0.92rem' }}>
              <li>Parcel lines are an index map, not a legal survey.</li>
              <li>Read each publisher&apos;s terms of use, especially if you plan to resell or republish the data.</li>
              <li>Owner names and mailing addresses are personal data. Use them only as the law and the publisher allow.</li>
              <li>Download now runs in its own tab and keeps the layer's original coordinate system. It downloads the entire layer, even millions of parcels, with no filter needed (Shapefile, GeoJSON or CSV; GeoPackage and KML are limited to 100,000 features).</li>
              <li>Services change. If a layer stops loading, search for the new link in <Link to="/discover">Discover</Link>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
