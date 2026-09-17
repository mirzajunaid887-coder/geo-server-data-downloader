import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import * as locator from '@arcgis/core/rest/locator';
import Point from '@arcgis/core/geometry/Point';

import '@arcgis/core/assets/esri/themes/dark/main.css';

interface LayerItem {
  id: string;
  url: string;
  visible: boolean;
  extent?: any;
}

interface EsriMapViewProps {
  layers?: LayerItem[];
  zoomTarget?: { layerId: string; extent?: any; time?: number };
  onFeatureSelect?: (attributes: any | null) => void;
}

const WORLD_LOCATOR_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

export const EsriMapView: React.FC<EsriMapViewProps> = ({ layers = [], zoomTarget, onFeatureSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const layerInstancesRef = useRef<{ [key: string]: any }>({});
  const selectionLayerRef = useRef<GraphicsLayer | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  
  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<{ text: string; location?: any }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const onFeatureSelectRef = useRef(onFeatureSelect);
  useEffect(() => {
    onFeatureSelectRef.current = onFeatureSelect;
  }, [onFeatureSelect]);

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const map = new Map({
      basemap: 'dark-gray-vector',
    });

    const selectionLayer = new GraphicsLayer({
      listMode: 'hide',
      ...({ legendEnabled: false } as any),
    });
    map.add(selectionLayer);
    selectionLayerRef.current = selectionLayer;

    const view = new MapView({
      container: containerRef.current,
      map: map,
      center: [-120, 47],
      zoom: 4,
      ui: { components: [] },
    });

    viewRef.current = view;

    const clickHandler = view.on('click', async (event) => {
      try {
        const mapPoint = view.toMap(event);
        if (!mapPoint) return;

        let foundAttributes = null;
        let foundGeometry = null;
        let matchedLayerTitle = 'Feature Details';

        for (const layerId of Object.keys(layerInstancesRef.current)) {
          const layerInstance = layerInstancesRef.current[layerId];
          if (layerInstance instanceof FeatureLayer && layerInstance.visible) {
            const query = layerInstance.createQuery();
            query.geometry = mapPoint;
            query.spatialRelationship = 'intersects';
            query.returnGeometry = true;
            query.outFields = ['*'];
            query.num = 1;

            const results = await layerInstance.queryFeatures(query);
            if (results.features && results.features.length > 0) {
              foundAttributes = results.features[0].attributes;
              foundGeometry = results.features[0].geometry;
              matchedLayerTitle = layerInstance.title || 'Layer Feature';
              break;
            }
          }
        }

        selectionLayer.removeAll();

        if (foundGeometry && foundAttributes) {
          const highlightGraphic = new Graphic({
            geometry: foundGeometry,
            symbol: {
              type: 'simple-fill',
              color: [0, 245, 255, 0.25],
              outline: {
                color: [0, 245, 255, 1],
                width: 3,
              },
            },
            attributes: foundAttributes,
            popupTemplate: {
              title: matchedLayerTitle,
              content: [
                {
                  type: 'fields',
                  fieldInfos: Object.keys(foundAttributes).map((fieldName) => ({
                    fieldName: fieldName,
                    label: fieldName,
                  })),
                },
              ],
            },
          });

          selectionLayer.add(highlightGraphic);

          if (view.popup) {
            view.popup.open({
              features: [highlightGraphic],
              location: event.mapPoint,
            });
          }

          if (onFeatureSelectRef.current) {
            onFeatureSelectRef.current(foundAttributes);
          }
        } else {
          if (view.popup) {
            view.popup.close();
          }
          if (onFeatureSelectRef.current) {
            onFeatureSelectRef.current(null);
          }
        }
      } catch (err) {
        console.error('Feature highlight selection error:', err);
      }
    });

    return () => {
      isInitializedRef.current = false;
      clickHandler.remove();
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  const handleSearchChange = async (val: string) => {
    setSearchText(val);
    if (!val.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const results = await locator.suggestLocations(WORLD_LOCATOR_URL, {
        text: val,
        ...({ maxResults: 5 } as any),
      });

      if (results && results.length > 0) {
        setSuggestions(results);
        setIsDropdownOpen(true);
      } else {
        setSuggestions([]);
        setIsDropdownOpen(false);
      }
    } catch (err) {
      console.error('Locator suggest error:', err);
    }
  };

  const handleSelectSuggestion = async (magicKey: string, text: string) => {
    setSearchText(text);
    setIsDropdownOpen(false);

    try {
      const results = await locator.addressToLocations(WORLD_LOCATOR_URL, {
        address: { MAGICKEY: magicKey },
        maxLocations: 1,
      });

      if (results && results.length > 0 && viewRef.current) {
        const match = results[0];
        const pt = match.location;

        viewRef.current.goTo({ center: [pt.longitude, pt.latitude], zoom: 15 });

        if (selectionLayerRef.current) {
          selectionLayerRef.current.removeAll();
          const graphic = new Graphic({
            geometry: pt,
            symbol: {
              type: 'simple-marker',
              color: [0, 245, 255, 0.8],
              size: 12,
              outline: { color: [255, 255, 255, 1], width: 2 },
            },
          });
          selectionLayerRef.current.add(graphic);
        }
      }
    } catch (err) {
      console.error('Address lookup error:', err);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsDropdownOpen(false);
      const text = searchText.trim();

      const coordMatch = text.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (coordMatch && viewRef.current) {
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);

        const pt = new Point({ longitude: lon, latitude: lat });
        viewRef.current.goTo({ center: pt, zoom: 15 });

        if (selectionLayerRef.current) {
          selectionLayerRef.current.removeAll();
          const graphic = new Graphic({
            geometry: pt,
            symbol: {
              type: 'simple-marker',
              color: [0, 245, 255, 0.8],
              size: 12,
              outline: { color: [255, 255, 255, 1], width: 2 },
            },
          });
          selectionLayerRef.current.add(graphic);
        }
        return;
      }

      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0].text, suggestions[0].text);
      }
    }
  };

  useEffect(() => {
    const view = viewRef.current;
    if (!view || !view.map) return;

    const mapInstance = view.map;
    const currentLayerIds = new Set(layers.map((l) => l.id));

    Object.keys(layerInstancesRef.current).forEach((id) => {
      if (!currentLayerIds.has(id)) {
        const layerInstance = layerInstancesRef.current[id];
        if (layerInstance) {
          mapInstance.remove(layerInstance);
        }
        delete layerInstancesRef.current[id];
      }
    });

    layers.forEach((layerItem) => {
      let layerInstance = layerInstancesRef.current[layerItem.id];
      if (!layerInstance) {
        if (layerItem.url.includes('MapServer') && !layerItem.url.match(/\/\d+$/)) {
          layerInstance = new MapImageLayer({ url: layerItem.url });
        } else {
          layerInstance = new FeatureLayer({ 
            url: layerItem.url,
            outFields: ['*'],
            popupEnabled: false,
          });
        }
        layerInstancesRef.current[layerItem.id] = layerInstance;
        mapInstance.add(layerInstance);

        layerInstance.when(() => {
          if (layerInstance.fullExtent && !layerItem.extent) {
            layerItem.extent = layerInstance.fullExtent;
          }
        }).catch((err: any) => {
          if (err.name !== 'AbortError') console.error(err);
        });
      }

      layerInstance.visible = layerItem.visible;
    });
  }, [layers]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || !zoomTarget || !zoomTarget.layerId) return;

    const targetLayerInstance = layerInstancesRef.current[zoomTarget.layerId];

    if (targetLayerInstance && targetLayerInstance.fullExtent) {
      view.goTo(targetLayerInstance.fullExtent, { duration: 1000 }).catch((err: any) => {
        if (err.name !== 'AbortError') console.error('Error zooming to layer instance extent:', err);
      });
    } else if (zoomTarget.extent) {
      view.goTo(zoomTarget.extent, { duration: 1000 }).catch((err: any) => {
        if (err.name !== 'AbortError') console.error('Error zooming to metadata extent:', err);
      });
    }
  }, [zoomTarget]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '520px', position: 'relative', outline: 'none', border: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 40, width: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(18, 18, 26, 0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)', padding: '0 8px', height: '36px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: '8px' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search address or lat, long..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '12px' }}
          />
          {searchText && (
            <button onClick={() => { setSearchText(''); setSuggestions([]); setIsDropdownOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '12px', padding: '0 4px' }}>
              ✕
            </button>
          )}
        </div>

        {isDropdownOpen && suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: '42px', left: 0, right: 0, backgroundColor: '#1a1c23', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 50, overflow: 'hidden' }}>
            {suggestions.map((item, idx) => (
              <div key={idx} onClick={() => handleSelectSuggestion(item.text, item.text)} style={{ padding: '8px 12px', fontSize: '12px', color: '#fff', cursor: 'pointer', borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d3748')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                {item.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, outline: 'none', border: 'none' }} />
    </div>
  );
};

export { EsriMapView as MapView };