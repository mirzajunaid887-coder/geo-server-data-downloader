import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchArcGISOnline } from '../services/arcgis-online/search';
import { ArcGISOnlineItem } from '../types/arcgisOnline';
import { Compass, Search, ExternalLink, PlusCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { articleStyle, h2Style, sectionStyle, ulStyle, linkStyle } from './Privacy';

export const Discover: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArcGISOnlineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchArcGISOnline(query);
      setResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMap = (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    navigate(`/downloader?url=${encodedUrl}`);
  };

  return (
    <>
      <SEO
        title="ArcGIS Online Dataset Discovery — Find Free GIS Data"
        description="Search thousands of public ArcGIS Online feature services, parcels, boundaries, and map layers. Discover and download free spatial data without needing a URL."
        keywords="ArcGIS Online search, find GIS data, public feature services, spatial data discovery, free GIS data"
        path="/discover"
      />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Main Tool Interface */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
          <div style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
              <Compass style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} /> ArcGIS Online Discovery
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Search public feature services, maps, and vector datasets hosted across ArcGIS Online.
            </p>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search parcels, zoning, roads..."
                className="form-input"
                style={{ flex: '1 1 200px' }}
              />
              <button type="submit" className="btn-primary" style={{ flex: '0 0 auto' }}>
                <Search style={{ width: '1rem', height: '1rem' }} /> Search
              </button>
            </form>
          </div>

          {loading && (
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Searching ArcGIS Online...
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {results.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', width: 'fit-content' }}>
                    {item.type}
                  </span>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: 'var(--text-main)' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.snippet || item.description || 'No description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {item.url && (
                    <>
                      <button
                        onClick={() => handleAddToMap(item.url)}
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
                      >
                        <PlusCircle style={{ width: '0.875rem', height: '0.875rem' }} /> Add to Map
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}
                      >
                        Endpoint <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div style={{ maxWidth: '800px', margin: '3rem auto 2rem auto', padding: '0 1rem' }}>
          <section style={sectionStyle}>
            <h2 style={h2Style}>Discovering Public Spatial Data on ArcGIS Online</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              ArcGIS Online is the world's largest repository of public geospatial data. It hosts millions of authoritative datasets published by government agencies, municipalities, environmental organizations, and research institutions. Whether you are looking for municipal zoning maps, census tracts, utility networks, or environmental monitoring stations, the data is likely hosted on an ArcGIS REST Feature Server.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              This Discovery tool allows you to search the official ArcGIS Online directory directly. Instead of guessing URLs, you can search for keywords (e.g., "parcels", "flood zones", "county boundaries") and instantly find the underlying web services.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>How to Use the Discovery Tool</h2>
            <ol style={{ ...ulStyle, paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
              <li><strong>Search:</strong> Enter a keyword related to the data you need.</li>
              <li><strong>Review Results:</strong> Browse the results. Each card shows the dataset title, type, and a brief description.</li>
              <li><strong>Add to Map:</strong> If you find a dataset you want to use, click the "Add to Map" button. This will automatically load the FeatureServer URL into our GIS Data Downloader tool.</li>
              <li><strong>Export:</strong> Once in the Downloader, you can preview the data on an interactive map, view the attribute table, and export the entire dataset to Shapefile, GeoJSON, KML, or GeoPackage.</li>
            </ol>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Common Types of Data You Can Find</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              Because ArcGIS Online is used by thousands of organizations, the variety of data is nearly endless. The most commonly searched categories include:
            </p>
            <ul style={ulStyle}>
              <li><strong>Administrative Boundaries:</strong> City limits, county lines, voting districts, and census tracts.</li>
              <li><strong>Cadastral / Parcel Data:</strong> Property boundaries, zoning districts, and land use classifications.</li>
              <li><strong>Environmental &amp; Hydrology:</strong> Watersheds, floodplains, elevation models, and habitat conservation areas.</li>
              <li><strong>Infrastructure:</strong> Road networks, public transit routes, utility lines, and broadband coverage.</li>
              <li><strong>Demographics:</strong> Population density, median household income, and housing statistics.</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Related Tools &amp; Guides</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              Found the data you need? Head over to the <Link to="/download" style={linkStyle}>GIS Data Downloader</Link> to extract the complete dataset. 
              <br /><br />
              Need to convert the data after downloading? Use our <Link to="/converter" style={linkStyle}>Free GIS Format Converter</Link> to change it between Shapefile, GeoJSON, KML, and GeoPackage.
              <br /><br />
              Want to learn more about finding free data? Read our article on <Link to="/blog/ten-free-gis-data-sources-every-analyst-should-know" style={linkStyle}>10 Free GIS Data Sources Every Analyst Should Know</Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Discover;