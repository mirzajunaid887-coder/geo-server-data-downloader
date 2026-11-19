import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  searchArcGISOnline,
  thumbnailUrl,
  itemPageUrl,
  DiscoverSort,
  DiscoverTypeFilter,
} from '../services/arcgis-online/search';
import { ArcGISOnlineItem } from '../types/arcgisOnline';
import { Compass, Search, ExternalLink, PlusCircle, ListTree, ChevronUp } from 'lucide-react';
import { SEO, buildBreadcrumbSchema } from '../components/SEO';
import { ServiceInspector } from '../components/discover/ServiceInspector';
import { articleStyle, h2Style, sectionStyle, ulStyle, linkStyle } from './Privacy';

const SUGGESTIONS = [
  'parcels',
  'zoning',
  'flood zones',
  'county boundaries',
  'census tracts',
  'land use',
  'city limits',
  'school districts',
  'building footprints',
  'fire stations',
];

const TYPE_OPTIONS: { value: DiscoverTypeFilter; label: string }[] = [
  { value: 'all', label: 'Feature + Map services' },
  { value: 'feature', label: 'Feature services only' },
  { value: 'map', label: 'Map services only' },
];

const SORT_OPTIONS: { value: DiscoverSort; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'views', label: 'Most viewed' },
  { value: 'updated', label: 'Recently updated' },
];

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

const Thumb: React.FC<{ item: ArcGISOnlineItem }> = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const src = thumbnailUrl(item.id, item.thumbnail);
  if (!src || failed) return null;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      width={200}
      height={133}
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '7.5rem', objectFit: 'cover', borderRadius: '0.35rem', backgroundColor: 'var(--accent-soft)' }}
    />
  );
};

const bodyP: React.CSSProperties = { fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' };
const h3: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, margin: '1.25rem 0 0.25rem', color: 'var(--text-main)' };

export const Discover: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get('q') || '').trim();
  const urlType = (['all', 'feature', 'map'].includes(searchParams.get('type') || '') ? searchParams.get('type') : 'all') as DiscoverTypeFilter;
  const urlSort = (['relevance', 'views', 'updated'].includes(searchParams.get('sort') || '') ? searchParams.get('sort') : 'relevance') as DiscoverSort;

  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<ArcGISOnlineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [nextStart, setNextStart] = useState(-1);
  const [openInspector, setOpenInspector] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const runSearch = useCallback(async (q: string, type: DiscoverTypeFilter, sort: DiscoverSort, start: number, append: boolean) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError('');
    try {
      const res = await searchArcGISOnline(q, { start, type, sort, signal: ctrl.signal });
      setResults((prev) => {
        if (!append) return res.results;
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...res.results.filter((r) => !seen.has(r.id))];
      });
      setTotal(res.total);
      setNextStart(res.nextStart);
      setSearched(true);
      if (!append) setOpenInspector(null);
    } catch (err: any) {
      if (err && err.name === 'AbortError') return;
      console.error(err);
      setError('The ArcGIS Online search could not be reached. Check your connection and try again.');
    } finally {
      if (abortRef.current === ctrl) setLoading(false);
    }
  }, []);

  // The address bar is the source of truth, so searches can be shared and the back button works.
  useEffect(() => {
    setQuery(urlQuery);
    if (urlQuery) {
      setResults([]);
      runSearch(urlQuery, urlType, urlSort, 1, false);
    } else {
      abortRef.current?.abort();
      setResults([]);
      setSearched(false);
      setLoading(false);
      setNextStart(-1);
      setTotal(0);
    }
  }, [urlQuery, urlType, urlSort, runSearch]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateParams = (q: string, type: DiscoverTypeFilter, sort: DiscoverSort) => {
    const p: Record<string, string> = {};
    if (q) p.q = q;
    if (type !== 'all') p.type = type;
    if (sort !== 'relevance') p.sort = sort;
    setSearchParams(p);
  };

  const submitQuery = (q: string) => {
    const clean = q.trim();
    if (!clean) return;
    if (clean === urlQuery) {
      runSearch(clean, urlType, urlSort, 1, false); // same query again: refresh
    } else {
      updateParams(clean, urlType, urlSort);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(query);
  };

  const handleAddToMap = (url: string) => {
    // The Downloader lives at /download. (/downloader redirects and drops the query string.)
    navigate(`/download?url=${encodeURIComponent(url)}`);
  };

  return (
    <>
      <SEO
        title="Find & Download Free GIS Vector Data | ArcGIS Online Search"
        description="Search public ArcGIS Online feature services for parcels, zoning and boundaries. Inspect fields and feature counts, then download free as GeoJSON or Shapefile."
        keywords="download vector data, free GIS data download, ArcGIS Online search, find GIS data, public feature services, parcel data download, zoning data download, spatial data discovery"
        path="/discover"
        structuredData={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'ArcGIS Online Discovery', path: '/discover' },
          ]),
        ]}
      />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Main Tool Interface */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
          <div style={{ maxWidth: '44rem', width: '100%', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
              <Compass style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} /> ArcGIS Online Discovery
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Search public feature services and map services, inspect their fields and feature counts, then send the layer straight to the Downloader.
            </p>
            <form onSubmit={handleSearch} role="search" style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search parcels, zoning, roads..."
                aria-label="Search ArcGIS Online"
                className="form-input"
                style={{ flex: '1 1 200px' }}
              />
              <button type="submit" className="btn-primary" style={{ flex: '0 0 auto' }} disabled={!query.trim()}>
                <Search style={{ width: '1rem', height: '1rem' }} /> Search
              </button>
            </form>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <select
                className="form-input"
                aria-label="Service type"
                value={urlType}
                onChange={(e) => updateParams(urlQuery || query.trim(), e.target.value as DiscoverTypeFilter, urlSort)}
                style={{ flex: '0 1 14rem', fontSize: '0.8rem' }}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                className="form-input"
                aria-label="Sort results"
                value={urlSort}
                onChange={(e) => updateParams(urlQuery || query.trim(), urlType, e.target.value as DiscoverSort)}
                style={{ flex: '0 1 12rem', fontSize: '0.8rem' }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }} aria-label="Popular searches">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => { setQuery(s); submitQuery(s); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading && results.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }} role="status">
              Searching ArcGIS Online...
            </p>
          )}

          {error && (
            <p role="alert" style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--danger-color)', margin: 0 }}>
              {error}
            </p>
          )}

          {searched && !loading && !error && results.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              No public services matched &ldquo;{urlQuery}&rdquo;. Try a broader keyword such as &ldquo;parcels&rdquo;,
              &ldquo;zoning&rdquo; or &ldquo;flood zones&rdquo;, or switch the type filter to include both service types.
            </p>
          )}

          {results.length > 0 && (
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }} role="status">
              Showing {results.length} of {total.toLocaleString()} results for &ldquo;{urlQuery}&rdquo;
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
            {results.map((item) => {
              const open = openInspector === item.id;
              return (
                <article key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Thumb item={item} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', width: 'fit-content' }}>
                      {item.type}
                    </span>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: 'var(--text-main)', overflowWrap: 'anywhere' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      {item.owner}
                      {item.modified ? ` · Updated ${formatDate(item.modified)}` : ''}
                      {typeof item.numViews === 'number' ? ` · ${item.numViews.toLocaleString()} views` : ''}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {(item.snippet || item.description || 'No description provided.').replace(/<[^>]*>/g, ' ')}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {item.tags.slice(0, 4).map((t) => (
                          <button
                            key={t}
                            type="button"
                            className="chip chip-quiet"
                            onClick={() => { setQuery(t); submitQuery(t); }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {item.url && (
                      <>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleAddToMap(item.url as string)}
                            className="btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
                          >
                            <PlusCircle style={{ width: '0.875rem', height: '0.875rem' }} /> Add to Map
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenInspector(open ? null : item.id)}
                            aria-expanded={open}
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
                          >
                            {open ? <ChevronUp style={{ width: '0.875rem', height: '0.875rem' }} /> : <ListTree style={{ width: '0.875rem', height: '0.875rem' }} />}
                            {open ? 'Hide details' : 'Inspect'}
                          </button>
                        </div>
                        <span style={{ display: 'inline-flex', gap: '0.6rem' }}>
                          <a href={itemPageUrl(item.id)} target="_blank" rel="noreferrer" className="touch-target" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}>
                            Item page <ExternalLink style={{ width: '0.7rem', height: '0.7rem' }} />
                          </a>
                          <a href={item.url} target="_blank" rel="noreferrer" className="touch-target" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}>
                            Endpoint <ExternalLink style={{ width: '0.7rem', height: '0.7rem' }} />
                          </a>
                        </span>
                      </>
                    )}
                  </div>

                  {open && item.url && <ServiceInspector serviceUrl={item.url} onAddToMap={handleAddToMap} />}
                </article>
              );
            })}
          </div>

          {nextStart > 0 && results.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn-primary"
                disabled={loading}
                onClick={() => runSearch(urlQuery, urlType, urlSort, nextStart, true)}
              >
                {loading ? 'Loading...' : 'Load more results'}
              </button>
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <div style={{ maxWidth: '800px', margin: '3rem auto 2rem auto', padding: '0 1rem' }}>
          <section style={sectionStyle}>
            <h2 style={h2Style}>Find Free Vector Data on ArcGIS Online</h2>
            <p style={bodyP}>
              ArcGIS Online hosts a very large collection of public vector datasets published by city and county governments, state agencies,
              universities, utilities and non-profit organizations. Parcels, zoning districts, flood zones, road centerlines, school districts and census
              boundaries are all published as ArcGIS REST <strong>feature services</strong>, and most of them are open to the public.
            </p>
            <p style={bodyP}>
              The trouble is finding the right layer and knowing whether it is any good before you spend time on it. This tool searches the public
              ArcGIS Online directory for you, lets you <strong>inspect a layer&apos;s fields, feature count and coordinate system</strong>, and sends the
              layer straight to the{' '}
              <Link to="/download" style={linkStyle}>GIS Data Downloader</Link> so you can export it as Shapefile, GeoJSON, KML, GeoPackage or CSV. It runs
              in your browser, needs no account, and is free.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>How to Use the Discovery Tool</h2>
            <ol style={{ ...ulStyle, paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
              <li><strong>Search:</strong> Type a keyword such as &ldquo;parcels&rdquo;, &ldquo;zoning&rdquo; or &ldquo;county boundaries&rdquo;, or tap one of the popular searches.</li>
              <li><strong>Narrow down:</strong> Filter by feature services or map services, and sort by best match, most viewed or recently updated.</li>
              <li><strong>Inspect:</strong> Click <em>Inspect</em> on a result to see its feature count, geometry type, coordinate system, server record limit, last edit date and field list. If the service has several layers, pick the one you need.</li>
              <li><strong>Add to Map:</strong> Click <em>Add to Map</em> (or <em>Add this layer to map</em> inside the inspector) to load it into the Downloader.</li>
              <li><strong>Export:</strong> In the Downloader, preview the data on the map, browse the attribute table and export the full dataset in the format you need.</li>
            </ol>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>What the Inspector Tells You Before You Download</h2>
            <ul style={ulStyle}>
              <li><strong>Feature count:</strong> how many records the layer really contains, so you know whether you are getting a few hundred districts or millions of parcels.</li>
              <li><strong>Geometry type:</strong> point, line or polygon, which decides which export formats make sense (GPX, for example, cannot store polygons).</li>
              <li><strong>Fields:</strong> the attribute names and types. Look for the columns you need, such as a zoning code, parcel ID or owner name, before you download.</li>
              <li><strong>Coordinate system:</strong> the EPSG code the data is stored in. Many local government layers use State Plane coordinates, so you may want to reproject later. See our guide to{' '}
                <Link to="/blog/understanding-coordinate-systems-and-projections" style={linkStyle}>coordinate systems and projections</Link>.
              </li>
              <li><strong>Server record limit:</strong> the number of features the server returns per request. The Downloader fetches larger layers in batches, so the limit does not cap what you get.</li>
              <li><strong>Last edited:</strong> a quick check on whether the data is current.</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Popular Vector Data to Search For</h2>
            <p style={bodyP}>These searches are a good starting point. Each one opens the results straight away.</p>
            <ul style={ulStyle}>
              <li>
                <Link to="/discover?q=parcels" style={linkStyle}>Parcel data</Link>: property boundaries and tax parcels. Read{' '}
                <Link to="/blog/how-to-find-free-parcel-data-us-counties" style={linkStyle}>how to find free parcel data for US counties</Link>.
              </li>
              <li>
                <Link to="/discover?q=zoning" style={linkStyle}>Zoning data</Link>: zoning districts and land use controls. See{' '}
                <Link to="/blog/how-to-download-municipal-zoning-data" style={linkStyle}>how to download municipal zoning data</Link>.
              </li>
              <li>
                <Link to="/discover?q=flood zones" style={linkStyle}>Flood zones</Link>: floodplain and hazard areas, useful for environmental and risk analysis.
              </li>
              <li>
                <Link to="/discover?q=county boundaries" style={linkStyle}>County and city boundaries</Link>, plus{' '}
                <Link to="/discover?q=census tracts" style={linkStyle}>census tracts</Link>. See{' '}
                <Link to="/blog/how-to-download-census-data-for-gis-analysis" style={linkStyle}>how to download Census data for GIS analysis</Link>.
              </li>
              <li>
                <Link to="/discover?q=land use" style={linkStyle}>Land use</Link>,{' '}
                <Link to="/discover?q=school districts" style={linkStyle}>school districts</Link> and{' '}
                <Link to="/discover?q=building footprints" style={linkStyle}>building footprints</Link>.
              </li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Feature Service or Map Service?</h2>
            <p style={bodyP}>
              A <strong>feature service</strong> serves the real vector features with their attributes, so you can query and download them. A{' '}
              <strong>map service</strong> mainly serves a rendered picture of the data, although many map services still let you query individual
              layers. If you want data to download, start with feature services and use the filter above. Our article on{' '}
              <Link to="/blog/what-is-a-gis-feature-service" style={linkStyle}>what a GIS feature service is</Link> explains the difference in more detail.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>How to Choose a Good Dataset</h2>
            <ul style={ulStyle}>
              <li>Prefer layers published by the agency that owns the data (a county assessor for parcels, a planning department for zoning).</li>
              <li>Check the last edited date and the item page for notes about update frequency.</li>
              <li>Confirm the fields you need exist, and compare feature counts if several versions are available.</li>
              <li>Read the publisher&apos;s terms of use on the item page. Public does not always mean unrestricted reuse.</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Frequently Asked Questions</h2>
            <h3 style={h3}>Is the Discovery tool free?</h3>
            <p style={bodyP}>Yes. There is no signup. Everything runs in your browser, and data is requested directly from the publisher&apos;s server.</p>
            <h3 style={h3}>Do you host the data you list?</h3>
            <p style={bodyP}>No. The tool searches the public ArcGIS Online directory and reads each service directly from the organization that publishes it. We do not store or change the data.</p>
            <h3 style={h3}>Why does a service say it is private or needs sign-in?</h3>
            <p style={bodyP}>Some items appear in search but their service requires a login or has restricted access. They cannot be inspected or downloaded here. Try another result or contact the publisher.</p>
            <h3 style={h3}>Why can some services not be inspected?</h3>
            <p style={bodyP}>A server can be offline, or it can block requests coming from other websites. The inspector tells you which case it is. You can still open the Endpoint link to see the service in your browser.</p>
            <h3 style={h3}>What formats can I download the data in?</h3>
            <p style={bodyP}>The Downloader exports to GeoPackage, Shapefile, GeoJSON, CSV, KML and GPX. To change a file you already have, use the <Link to="/converter" style={linkStyle}>GIS Format Converter</Link>.</p>
            <h3 style={h3}>Does the record limit mean I only get part of the data?</h3>
            <p style={bodyP}>No. The limit is how many features the server returns per request. The Downloader requests the full list of feature IDs and fetches them in batches, so you receive the whole layer.</p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Related Tools &amp; Guides</h2>
            <ul style={ulStyle}>
              <li><Link to="/download" style={linkStyle}>GIS Data Downloader</Link>: load any ArcGIS REST or WFS URL and export it.</li>
              <li><Link to="/converter" style={linkStyle}>Free GIS Format Converter</Link>: convert between Shapefile, GeoJSON, KML, GeoPackage and more.</li>
              <li><Link to="/blog/how-to-extract-data-from-arcgis-online" style={linkStyle}>How to extract data from ArcGIS Online</Link></li>
              <li><Link to="/blog/ten-free-gis-data-sources-every-analyst-should-know" style={linkStyle}>10 free GIS data sources every analyst should know</Link></li>
              <li><Link to="/documentation" style={linkStyle}>Documentation</Link>: step-by-step help for every tool.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default Discover;
