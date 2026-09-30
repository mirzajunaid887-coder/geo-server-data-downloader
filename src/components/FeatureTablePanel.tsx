import React, { useEffect, useRef, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import '@arcgis/core/assets/esri/themes/dark/main.css';

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
        // 1. Create the layer
        featureLayer = new FeatureLayer({
          url: layerUrl,
          outFields: ['*'],
          title: layerTitle,
        });

        // 2. IMPORTANT: wait until the layer's metadata is fully loaded
        //    before handing it to the FeatureTable widget.
        setStatus('Loading layer metadata...');
        await featureLayer.load();

        if (isDestroyed || !containerRef.current) return;

        // 3. Build the FeatureTable
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
      try {
        if (featureTable) featureTable.destroy();
      } catch {
        /* noop */
      }
      try {
        if (featureLayer) featureLayer.destroy();
      } catch {
        /* noop */
      }
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
      {/* Header strip with title + close button */}
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
            color: '#f3f4f6',
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
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      {/* Status / error message */}
      {status && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            color: hasError ? '#f87171' : '#9ca3af',
            backgroundColor: hasError
              ? 'rgba(239, 68, 68, 0.08)'
              : 'rgba(255,255,255,0.03)',
            borderRadius: 4,
            marginBottom: '0.5rem',
            flexShrink: 0,
          }}
        >
          {status}
        </div>
      )}

      {/* Container the FeatureTable attaches to.
          flex: 1 + minHeight: 0 lets it fill the remaining space
          inside the flex column, which is required for the widget
          to measure its own size correctly. */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default FeatureTablePanel;