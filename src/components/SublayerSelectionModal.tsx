import React, { useState } from 'react';

interface SublayerItem {
  id: number;
  name: string;
  parentLayerId?: number;
}

interface SublayerModalProps {
  serviceUrl: string;
  sublayers: SublayerItem[];
  onAddLayers: (selectedUrls: { url: string; title: string }[]) => void;
  onClose: () => void;
}

export const SublayerSelectionModal: React.FC<SublayerModalProps> = ({
  serviceUrl,
  sublayers,
  onAddLayers,
  onClose,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    sublayers.map((l) => l.id)
  );

  const toggleLayer = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === sublayers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sublayers.map((l) => l.id));
    }
  };

  const handleConfirm = () => {
    const formattedLayers = sublayers
      .filter((l) => selectedIds.includes(l.id))
      .map((l) => ({
        url: `${serviceUrl.replace(/\/+$/, '')}/${l.id}`,
        title: l.name,
      }));
    onAddLayers(formattedLayers);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h3
            style={{
              margin: '0 0 0.25rem 0',
              fontSize: '1rem',
              color: 'var(--text-main)',
            }}
          >
            Select Sublayers to Add
          </h3>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            This service contains multiple sublayers. Choose which layers you
            want to add to your map.
          </p>
        </div>

        <div
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {selectedIds.length} of {sublayers.length} selected
            </span>
            <button
              onClick={toggleAll}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-color)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {selectedIds.length === sublayers.length
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>

          <div
            style={{
              maxHeight: '280px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              padding: '0.4rem',
              backgroundColor: 'var(--bg-hover)',
            }}
          >
            {sublayers.map((layer) => (
              <label
                key={layer.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.55rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  borderRadius: '0.25rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(layer.id)}
                  onChange={() => toggleLayer(layer.id)}
                  style={{
                    marginRight: '0.65rem',
                    cursor: 'pointer',
                    width: '1rem',
                    height: '1rem',
                    accentColor: 'var(--accent-color)',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {layer.name}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginLeft: '0.5rem',
                    flexShrink: 0,
                  }}
                >
                  ID: {layer.id}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-hover)',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: '1 1 auto', minWidth: '100px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className="btn-primary"
            style={{ flex: '2 1 auto', minWidth: '140px' }}
          >
            Add Selected ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};