import React, { useState } from 'react';
import { X, Download, AlertCircle, ExternalLink } from 'lucide-react';
import { useIsMobile } from '../hooks/useMediaQuery';

interface LoadedLayer {
  id: string;
  name: string;
  url: string;
  geometryType: string;
  visible: boolean;
  serviceType?: 'arcgis' | 'wfs';
  wfsTypeName?: string;
  wfsVersion?: string;
}

interface ExportModalProps {
  layers: LoadedLayer[];
  onClose: () => void;
  onExport?: (selectedLayerIds: string[], format: string) => Promise<void>;
}

const FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: 'gpkg', label: 'GeoPackage (.gpkg) - Multi-layer container' },
  { value: 'shp', label: 'ESRI Shapefile (.zip) - Separate dataset archive' },
  { value: 'geojson', label: 'GeoJSON (.geojson)' },
  { value: 'csv', label: 'CSV Spreadsheet (.csv)' },
  { value: 'kml', label: 'Google Earth KML (.kml)' },
  { value: 'gpx', label: 'GPS Exchange Format (.gpx)' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ layers, onClose }) => {
  const isMobile = useIsMobile();
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(
    layers.map((l) => l.id)
  );
  const [format, setFormat] = useState<string>('gpkg');
  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState<boolean>(false);

  const toggleSelectAll = () => {
    if (selectedLayerIds.length === layers.length) {
      setSelectedLayerIds([]);
    } else {
      setSelectedLayerIds(layers.map((l) => l.id));
    }
  };

  const toggleLayer = (id: string) => {
    setSelectedLayerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStartExport = () => {
    if (selectedLayerIds.length === 0) {
      setError('Please select at least one layer to export.');
      return;
    }

    const targetLayers = layers.filter((l) => selectedLayerIds.includes(l.id));

    for (const layer of targetLayers) {
      if (!layer.url || layer.url.includes('example.com')) {
        setError(
          `Layer "${layer.name}" has an invalid or placeholder service URL.`
        );
        return;
      }
    }

    setError(null);
    setLaunching(true);

    // Open popup synchronously to avoid mobile browser popup blockers
    const popup = openExportWindow(
      targetLayers.map((l) => ({
        name: l.name,
        url: l.url,
        type: l.serviceType === 'wfs' ? 'wfs' : 'arcgis',
        typeName: l.wfsTypeName,
        version: l.wfsVersion,
      })),
      format
    );

    if (!popup) {
      setLaunching(false);
      setError(
        'Your browser blocked the download window. Please allow pop-ups for this site and click "Start Download" again.'
      );
      return;
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: isMobile ? 0 : '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#111827',
          border: '1px solid var(--border-color)',
          borderRadius: isMobile ? '1rem 1rem 0 0' : '0.5rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: isMobile ? '90vh' : '85vh',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f3f4f6',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Download
              style={{
                width: '1.125rem',
                height: '1.125rem',
                color: 'var(--accent-color)',
              }}
            />
            Bulk Export Layers
          </h3>
          <button
            onClick={onClose}
            disabled={launching}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#1f2937',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                color: '#f3f4f6',
                fontSize: '0.85rem',
              }}
            >
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
              }}
            >
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Select Layers ({selectedLayerIds.length} of {layers.length})
              </label>
              <button
                type="button"
                onClick={toggleSelectAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-color)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {selectedLayerIds.length === layers.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: '#1f2937',
              }}
            >
              {layers.map((layer) => (
                <label
                  key={layer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedLayerIds.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    style={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
                  />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {layer.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.7rem',
              color: '#9ca3af',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              padding: '0.5rem 0.6rem',
              borderRadius: '0.375rem',
            }}
          >
            <ExternalLink
              style={{
                width: '0.9rem',
                height: '0.9rem',
                flexShrink: 0,
                marginTop: '0.1rem',
              }}
            />
            <span>
              Downloads open in a separate window and run independently — the
              map and dashboard stay fully interactive while the export is in
              progress.
            </span>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '0.5rem',
                borderRadius: '0.375rem',
              }}
            >
              <AlertCircle
                style={{ width: '1rem', height: '1rem', flexShrink: 0 }}
              />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#1f2937',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            disabled={launching}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: '#d1d5db',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleStartExport}
            disabled={launching}
            className="btn-primary"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              opacity: launching ? 0.7 : 1,
              flex: 2,
            }}
          >
            {launching ? 'Opening window...' : 'Start Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
 * Export window launcher
 *
 * The export runs in its own page (/export.html), NOT in a window written by this
 * page. A window created with window.open('') and document.write() shares this
 * page's process and main thread, so the heavy GDAL/WebAssembly work froze the
 * Downloader while an export was running. /export.html is served with
 * "Cross-Origin-Opener-Policy: same-origin" (see vercel.json), which puts it in a
 * separate browsing context group and process, so this page stays fully usable.
 * ---------------------------------------------------------------------- */

interface ExportLayerConfig {
  name: string;
  url: string;
  type?: 'arcgis' | 'wfs';
  typeName?: string;
  version?: string;
}

function openExportWindow(
  exportLayers: ExportLayerConfig[],
  format: string
): Window | null {
  const configJson = JSON.stringify({ layers: exportLayers, format });
  const configB64 = btoa(unescape(encodeURIComponent(configJson)));

  return window.open(
    `/export.html#${configB64}`,
    `gdd_export_${Date.now()}`,
    'popup=yes,width=520,height=680,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
  );
}
