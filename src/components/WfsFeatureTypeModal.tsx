import React, { useMemo, useState } from 'react';
import type { WfsFeatureType } from '../services/wfs/wfs';

interface Props {
  baseUrl: string;
  version: string;
  serviceTitle?: string;
  featureTypes: WfsFeatureType[];
  onAdd: (selected: WfsFeatureType[]) => void;
  onClose: () => void;
}

export const WfsFeatureTypeModal: React.FC<Props> = ({
  version,
  serviceTitle,
  featureTypes,
  onAdd,
  onClose,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return featureTypes;
    return featureTypes.filter((ft) =>
      `${ft.name} ${ft.title ?? ''}`.toLowerCase().includes(q)
    );
  }, [featureTypes, filter]);

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const allVisibleSelected = visible.length > 0 && visible.every((ft) => selected.includes(ft.name));
  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((n) => !visible.some((ft) => ft.name === n)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...visible.map((ft) => ft.name)])]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--text-main)' }}>
            Select WFS Feature Types
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            {serviceTitle ? `${serviceTitle} · ` : ''}WFS {version} · {featureTypes.length} feature type
            {featureTypes.length === 1 ? '' : 's'} available.
          </p>
        </div>

        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0, overflowY: 'auto' }}>
          {featureTypes.length > 8 && (
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter feature types..."
              style={{
                padding: '0.5rem 0.7rem',
                fontSize: '0.82rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-hover)',
                color: 'var(--text-main)',
                outline: 'none',
              }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {selected.length} selected
            </span>
            <button
              onClick={toggleAllVisible}
              style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {allVisibleSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              padding: '0.4rem',
              backgroundColor: 'var(--bg-hover)',
            }}
          >
            {visible.length === 0 && (
              <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No feature types match "{filter}".
              </div>
            )}
            {visible.map((ft) => (
              <label
                key={ft.name}
                style={{ display: 'flex', alignItems: 'center', padding: '0.55rem 0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-main)', borderRadius: '0.25rem' }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(ft.name)}
                  onChange={() => toggle(ft.name)}
                  style={{ marginRight: '0.65rem', cursor: 'pointer', width: '1rem', height: '1rem', accentColor: 'var(--accent-color)' }}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ft.title || ft.name}
                  </span>
                  {ft.title && ft.title !== ft.name && (
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ft.name}
                    </span>
                  )}
                </span>
                {ft.defaultCrs && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '0.5rem', flexShrink: 0 }}>
                    {ft.defaultCrs.replace(/^urn:ogc:def:crs:/i, '')}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-hover)', flexWrap: 'wrap' }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: '1 1 auto', minWidth: '100px' }}>
            Cancel
          </button>
          <button
            onClick={() => onAdd(featureTypes.filter((ft) => selected.includes(ft.name)))}
            disabled={selected.length === 0}
            className="btn-primary"
            style={{ flex: '2 1 auto', minWidth: '140px' }}
          >
            Add Selected ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};
