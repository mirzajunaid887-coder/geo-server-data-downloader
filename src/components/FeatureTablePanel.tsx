import React, { useEffect, useRef, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';

interface FeatureTablePanelProps {
  layerUrl: string;
  layerTitle: string;
  onClose: () => void;
}

export const FeatureTablePanel: React.FC<FeatureTablePanelProps> = ({
  layerUrl,
  layerTitle,
  onClose,
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
        <button
          onClick={onClose}
          title="Close"
          style={{
            background: 'var(--danger-color)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      {status && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            color: hasError ? 'var(--danger-color)' : 'var(--text-muted)',
            backgroundColor: hasError
              ? 'var(--danger-soft)'
              : 'var(--bg-hover)',
            borderRadius: 4,
            marginBottom: '0.5rem',
            flexShrink: 0,
          }}
        >
          {status}
        </div>
      )}

      <div
        ref={containerRef}
        style={{
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