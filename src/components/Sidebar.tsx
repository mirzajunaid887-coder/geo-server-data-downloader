import React, { useState } from 'react';
import { SublayerSelectionModal } from './SublayerSelectionModal';

interface SidebarProps {
  onAddLayerToMap: (layer: { url: string; title: string }) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddLayerToMap }) => {
  const [pendingSublayers, setPendingSublayers] = useState<{ serviceUrl: string; sublayers: any[] } | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');

  const handleAddServiceUrl = async () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;

    if ((cleanUrl.includes('FeatureServer') || cleanUrl.includes('MapServer')) && !cleanUrl.match(/\/\d+$/)) {
      try {
        const res = await fetch(`${cleanUrl}?f=json`);
        const data = await res.json();
        
        if (data.layers && data.layers.length > 0) {
          setPendingSublayers({ serviceUrl: cleanUrl, sublayers: data.layers });
          return;
        }
      } catch (err) {
        console.error('Failed to parse service metadata for sublayers:', err);
      }
    }

    onAddLayerToMap({ url: cleanUrl, title: 'GIS Layer' });
    setUrlInput('');
  };

  const handleConfirmSublayers = (selectedItems: { url: string; title: string }[]) => {
    selectedItems.forEach(item => {
      onAddLayerToMap({ url: item.url, title: item.title });
    });
    setPendingSublayers(null);
  };

  return (
    <div className="sidebar-container" style={{ padding: '1rem', backgroundColor: '#111827', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Add Layer</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Enter FeatureServer or MapServer URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
        />
        <button
          onClick={handleAddServiceUrl}
          style={{ padding: '0.5rem 1rem', background: 'var(--accent-color)', border: 'none', borderRadius: '0.375rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
        >
          Load Layer
        </button>
      </div>
      
      {pendingSublayers && (
        <SublayerSelectionModal
          serviceUrl={pendingSublayers.serviceUrl}
          sublayers={pendingSublayers.sublayers}
          onAddLayers={handleConfirmSublayers}
          onClose={() => setPendingSublayers(null)}
        />
      )}
    </div>
  );
};