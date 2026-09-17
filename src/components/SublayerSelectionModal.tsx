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

export const SublayerSelectionModal: React.FC<SublayerModalProps> = ({ serviceUrl, sublayers, onAddLayers, onClose }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(sublayers.map(l => l.id));

  const toggleLayer = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const formattedLayers = sublayers
      .filter(l => selectedIds.includes(l.id))
      .map(l => ({
        url: `${serviceUrl.replace(/\/+$/, '')}/${l.id}`,
        title: l.name
      }));
    onAddLayers(formattedLayers);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1a1c23', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
        width: '420px', maxWidth: '90%', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', color: '#fff'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#00f5ff' }}>Select Sublayers to Add</h3>
        <p style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '16px' }}>
          This service contains multiple sublayers. Choose which layers you want to add to your map:
        </p>

        <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px' }}>
          {sublayers.map(layer => (
            <label key={layer.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(layer.id)}
                onChange={() => toggleLayer(layer.id)}
                style={{ marginRight: '10px', accentColor: '#00f5ff' }}
              />
              {layer.name} <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#718096' }}>(ID: {layer.id})</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#a0aec0', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            style={{ backgroundColor: selectedIds.length === 0 ? '#4a5568' : '#00f5ff', border: 'none', color: selectedIds.length === 0 ? '#a0aec0' : '#000', padding: '6px 16px', borderRadius: '4px', cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '12px' }}
          >
            Add Selected ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};