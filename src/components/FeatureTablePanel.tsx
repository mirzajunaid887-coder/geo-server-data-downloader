import React, { useEffect, useRef, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import { Minimize2, Maximize2, ChevronUp } from 'lucide-react';

interface FeatureTablePanelProps {
  layerUrl: string;
  layerTitle: string;
  onClose: () => void;
  tableMode: 'normal' | 'minimized' | 'maximized';
  onToggleMode: (mode: 'normal' | 'minimized' | 'maximized') => void;
}

export const FeatureTablePanel: React.FC<FeatureTablePanelProps> = ({
  layerUrl,
  layerTitle,
  onClose,
  tableMode,
  onToggleMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('Initializing attribute table...');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let featureTable: FeatureTable | null = null;
    let featureLayer: FeatureLayer | null = null;
    let isDestroyed = false;

    const init = async () => {
      try {
        featureLayer = new FeatureLayer({
          url: layerUrl,
          outFields: ['*'],
          title: layerTitle,
        });

        setStatus('Loading layer metadata...');
        await featureLayer.load();

        if (isDestroyed || !containerRef.current) return;

        setStatus('Rendering table...');
        featureTable = new FeatureTable({
          layer: featureLayer,
          container: containerRef.current,
          multiSortEnabled: true,
          visibleElements: {
            header: true,
            columnMenus: true,
            menu: true,
            menuItems: {
              clearSelection: true,
              refreshData: true,
              selectedRecordsShowAllToggle: true,
              selectedRecordsShowSelectedToggle: true,
              zoomToSelection: true,
            },
          },
        });

        setStatus('');
      } catch (err: any) {
        console.error('[FeatureTablePanel] Failed to initialize:', err);
        setHasError(true);
        setStatus(
          `Failed to load attribute table: ${err?.message || 'Unknown error'}`
        );
      }
    };

    init();

    return () => {
      isDestroyed = true;
      try { if (featureTable) featureTable.destroy(); } catch {}
      try { if (featureLayer) featureLayer.destroy(); } catch {}
    };
  }, [layerUrl, layerTitle]);

  const iconBtnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 6px',
    borderRadius: '4px',
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        position: 'relative',
      }}
    >
      {/* Header strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          padding: '0.25rem 0.25rem 0.5rem 0.25rem',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          📊 {layerTitle} — Attribute Table
        </span>
        
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {tableMode === 'minimized' ? (
            <button
              onClick={() => onToggleMode('normal')}
              title="Restore"
              style={iconBtnStyle}
            >
              <ChevronUp style={{ width: '0.9rem', height: '0.9rem' }} />
            </button>
          ) : (
            <button
              onClick={() => onToggleMode('minimized')}
              title="Minimize"
              style={iconBtnStyle}
            >
              <Minimize2 style={{ width: '0.8rem', height: '0.8rem' }} />
            </button>
          )}

          {tableMode !== 'minimized' && (
            <button
              onClick={() => onToggleMode(tableMode === 'maximized' ? 'normal' : 'maximized')}
              title={tableMode === 'maximized' ? 'Restore' : 'Maximize'}
              style={iconBtnStyle}
            >
              {tableMode === 'maximized' ? (
                <Minimize2 style={{ width: '0.8rem', height: '0.8rem' }} />
              ) : (
                <Maximize2 style={{ width: '0.8rem', height: '0.8rem' }} />
              )}
            </button>
          )}

          <button
            onClick={onClose}
            title="Close"
            style={{ ...iconBtnStyle, background: '#ef4444', color: '#fff', border: 'none', fontSize: '0.9rem', fontWeight: 'bold', padding: '2px 8px' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Status / error message */}
      {status && tableMode !== 'minimized' && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            color: hasError ? 'var(--danger-color)' : 'var(--text-muted)',
            backgroundColor: hasError ? 'var(--danger-soft)' : 'var(--bg-hover)',
            borderRadius: 4,
            marginBottom: '0.5rem',
            flexShrink: 0,
          }}
        >
          {status}
        </div>
      )}

      {/* Table Container - Hidden when minimized */}
      <div
        ref={containerRef}
        style={{
          display: tableMode === 'minimized' ? 'none' : 'block',
          flex: 1,
          minHeight: 0,
          width: '100%',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default FeatureTablePanel;