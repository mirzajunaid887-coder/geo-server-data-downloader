import React, { useEffect, useState } from 'react';
import { Copy, Check, PlusCircle, AlertCircle } from 'lucide-react';
import {
  InspectError,
  LayerDetails,
  ServiceRoot,
  fieldTypeLabel,
  inspectLayer,
  inspectServiceRoot,
} from '../../services/arcgis-online/inspect';

interface Props {
  serviceUrl: string;
  /** Called with the exact layer (or service) URL the user wants in the Downloader. */
  onAddToMap: (url: string) => void;
}

const FIELDS_COLLAPSED = 8;

const cell: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
  padding: '0.5rem 0.65rem',
  borderRadius: '0.4rem',
  backgroundColor: 'var(--accent-soft)',
  minWidth: 0,
};
const cellLabel: React.CSSProperties = { fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' };
const cellValue: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', overflowWrap: 'anywhere' };

function formatDate(ms: number | null): string {
  if (!ms) return '—';
  try {
    return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

export const ServiceInspector: React.FC<Props> = ({ serviceUrl, onAddToMap }) => {
  const [root, setRoot] = useState<ServiceRoot | null>(null);
  const [layerId, setLayerId] = useState<number | null>(null);
  const [details, setDetails] = useState<LayerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<InspectError | Error | null>(null);
  const [showAllFields, setShowAllFields] = useState(false);
  const [fieldFilter, setFieldFilter] = useState('');
  const [copied, setCopied] = useState('');

  // 1. Read the service and list layers.
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    setRoot(null);
    setDetails(null);
    inspectServiceRoot(serviceUrl, ctrl.signal)
      .then((r) => {
        setRoot(r);
        if (r.layers.length === 0) {
          setLoading(false);
          setError(new InspectError('service', 'This service does not list any vector layers.'));
        } else {
          setLayerId(r.directLayerId ?? r.layers[0].id);
        }
      })
      .catch((e) => {
        if (e && e.name === 'AbortError') return;
        setError(e);
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [serviceUrl]);

  // 2. Read the selected layer.
  useEffect(() => {
    if (!root || layerId === null) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    setDetails(null);
    setShowAllFields(false);
    setFieldFilter('');
    inspectLayer(root.baseUrl, layerId, ctrl.signal)
      .then((d) => {
        setDetails(d);
        setLoading(false);
      })
      .catch((e) => {
        if (e && e.name === 'AbortError') return;
        setError(e);
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [root, layerId]);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      // Clipboard can be blocked; the URL is also shown in the field below.
    }
  };

  const filteredFields = details
    ? details.fields.filter(
        (f) =>
          !fieldFilter ||
          f.name.toLowerCase().includes(fieldFilter.toLowerCase()) ||
          f.alias.toLowerCase().includes(fieldFilter.toLowerCase())
      )
    : [];
  const visibleFields = showAllFields || fieldFilter ? filteredFields : filteredFields.slice(0, FIELDS_COLLAPSED);

  return (
    <div
      role="region"
      aria-label="Service details"
      style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      {loading && (
        <p role="status" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Reading service details…
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger-color)', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}
        >
          <AlertCircle style={{ width: '1rem', height: '1rem', flex: '0 0 auto', marginTop: '0.1rem' }} />
          <span>{error.message}</span>
        </p>
      )}

      {root && root.layers.length > 1 && (
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
          Layer ({root.layers.length} in this service)
          <select
            className="form-input"
            value={layerId ?? ''}
            onChange={(e) => setLayerId(Number(e.target.value))}
            style={{ fontSize: '0.8rem' }}
          >
            {root.layers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id}: {l.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {details && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
            <div style={cell}>
              <span style={cellLabel}>Features</span>
              <span style={cellValue}>{details.count === null ? 'Not available' : details.count.toLocaleString()}</span>
            </div>
            <div style={cell}>
              <span style={cellLabel}>Geometry</span>
              <span style={cellValue}>{details.geometryType}</span>
            </div>
            <div style={cell}>
              <span style={cellLabel}>Coordinate system</span>
              <span style={cellValue}>{details.wkid ? `EPSG:${details.wkid}` : 'Unknown'}</span>
            </div>
            <div style={cell}>
              <span style={cellLabel}>Server record limit</span>
              <span style={cellValue}>{details.maxRecordCount ? details.maxRecordCount.toLocaleString() : '—'}</span>
            </div>
            <div style={cell}>
              <span style={cellLabel}>Last edited</span>
              <span style={cellValue}>{formatDate(details.lastEdit)}</span>
            </div>
            <div style={cell}>
              <span style={cellLabel}>Fields</span>
              <span style={cellValue}>{details.fields.length}</span>
            </div>
          </div>

          {details.count !== null && details.maxRecordCount && details.count > details.maxRecordCount && (
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              This layer has more features than the server returns per request ({details.maxRecordCount.toLocaleString()}). The
              Downloader fetches the rest in batches, so you still get everything.
            </p>
          )}

          {details.capabilities.length > 0 && !details.capabilities.some((c) => /query|data/i.test(c)) && (
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--danger-color)' }}>
              This layer does not advertise the Query capability, so downloading it may fail.
            </p>
          )}

          {details.description && (
            <p
              style={{
                margin: 0,
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {details.description}
            </p>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Fields</span>
              {details.fields.length > FIELDS_COLLAPSED && (
                <input
                  type="search"
                  className="form-input"
                  placeholder="Filter fields"
                  aria-label="Filter fields"
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', maxWidth: '10rem' }}
                />
              )}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.25rem 0.4rem', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: '0.25rem 0.4rem', fontWeight: 600 }}>Alias</th>
                    <th style={{ padding: '0.25rem 0.4rem', fontWeight: 600 }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFields.map((f) => (
                    <tr key={f.name} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.25rem 0.4rem', fontFamily: 'monospace' }}>{f.name}</td>
                      <td style={{ padding: '0.25rem 0.4rem' }}>{f.alias}</td>
                      <td style={{ padding: '0.25rem 0.4rem', color: 'var(--text-muted)' }}>{fieldTypeLabel(f.type)}</td>
                    </tr>
                  ))}
                  {filteredFields.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                        No fields match.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {!fieldFilter && filteredFields.length > FIELDS_COLLAPSED && (
              <button
                type="button"
                onClick={() => setShowAllFields((v) => !v)}
                style={{ marginTop: '0.35rem', background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
              >
                {showAllFields ? 'Show fewer fields' : `Show all ${filteredFields.length} fields`}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
              onClick={() => onAddToMap(details.layerUrl)}
            >
              <PlusCircle style={{ width: '0.875rem', height: '0.875rem' }} /> Add this layer to map
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
              onClick={() => copy('layer', details.layerUrl)}
            >
              {copied === 'layer' ? <Check style={{ width: '0.875rem', height: '0.875rem' }} /> : <Copy style={{ width: '0.875rem', height: '0.875rem' }} />}
              {copied === 'layer' ? 'Copied' : 'Copy layer URL'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
              onClick={() => copy('query', details.queryUrl)}
            >
              {copied === 'query' ? <Check style={{ width: '0.875rem', height: '0.875rem' }} /> : <Copy style={{ width: '0.875rem', height: '0.875rem' }} />}
              {copied === 'query' ? 'Copied' : 'Copy GeoJSON query URL'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceInspector;
