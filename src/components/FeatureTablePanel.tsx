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
  const tableRef = useRef<FeatureTable | null>(null);
  const layerRef = useRef<FeatureLayer | null>(null);

  const [status, setStatus] = useState<string>('Initializing attribute table...');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Reset status for the new layer
    setStatus('Initializing attribute table...');
    setHasError(false);

    let isDestroyed = false;

    // Helper to fully tear down the previous widget synchronously
    const teardown = () => {
      try {
        if (tableRef.current) {
          tableRef.current.destroy();
          tableRef.current = null;
        }
      } catch {
        /* noop */
      }
      try {
        if (layerRef.current) {
          layerRef.current.destroy();
          layerRef.current = null;
        }
      } catch {
        /* noop */
      }
      // Ensure the container is completely empty before reuse
      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      } catch {
        /* noop */
      }
    };

    const init = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        // 1. Create layer instance
        const featureLayer = new FeatureLayer({
          url: layerUrl,
          outFields: ['*'],
          title: layerTitle,
        });
        layerRef.current = featureLayer;

        // 2. Wait for layer metadata to fully load
        setStatus('Loading layer metadata...');
        await featureLayer.load();

        if (isDestroyed || !containerRef.current) {
          // Component unmounted mid-load — clean up what we created
          try { featureLayer.destroy(); } catch { /* noop */ }
          return;
        }

        // 3. Guard: make sure we still own the same DOM node
        if (containerRef.current !== container) {
          try { featureLayer.destroy(); } catch { /* noop */ }
          return;
        }

        // 4. Build the FeatureTable widget
        setStatus('Rendering table...');

        const featureTable = new FeatureTable({
          layer: featureLayer,
          container,
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

        // If the component unmounted while the widget was constructing,
        // destroy it immediately and bail.
        if (isDestroyed) {
          try { featureTable.destroy(); } catch { /* noop */ }
          try { featureLayer.destroy(); } catch { /* noop */ }
          return;
        }

        tableRef.current = featureTable;
        setStatus('');
      } catch (err: any) {
        if (isDestroyed) return;
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
      teardown();
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          padding: '0.25rem 0.25rem 0.5rem',
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

      {/* Status / error message */}
      {status && (
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

      {/* Container — widget attaches here */}
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