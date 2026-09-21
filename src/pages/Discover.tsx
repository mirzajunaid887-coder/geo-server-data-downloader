import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchArcGISOnline } from '../services/arcgis-online/search';
import { ArcGISOnlineItem } from '../types/arcgisOnline';
import { Compass, Search, ExternalLink, PlusCircle } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
          <Compass style={{ width: '2rem', height: '2rem', color: 'var(--accent-color)' }} /> ArcGIS Online Discovery
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Search public feature services, maps, and vector datasets hosted across ArcGIS Online.
        </p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parcels, zoning, roads..."
            className="form-input"
          />
          <button type="submit" className="btn-primary">
            <Search style={{ width: '1rem', height: '1rem' }} /> Search
          </button>
        </form>
      </div>

      {loading && <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Searching ArcGIS Online...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {results.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: '700', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-color)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', width: 'fit-content' }}>
                {item.type}
              </span>
              <h3 style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0, color: 'var(--text-main)' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.snippet || item.description || 'No description provided.'}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
              {item.url && (
                <>
                  <button
                    onClick={() => handleAddToMap(item.url)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--accent-color, #4f46e5)', color: 'white', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
                  >
                    <PlusCircle style={{ width: '0.875rem', height: '0.875rem' }} /> Add to Map
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textDecoration: 'none' }}
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
  );
};