import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { fetchArcGISMetadata } from '../services/arcgis/service';
import { fetchObjectIds } from '../services/arcgis/objectIds';
import { fetchFeaturesBatch } from '../services/arcgis/query';
import {
  isWfsUrl,
  normalizeWfsBaseUrl,
  fetchWfsCapabilities,
  fetchWfsFeatureCollection,
  type WfsFeatureType,
} from '../services/wfs/wfs';
import { WfsFeatureTypeModal } from '../components/WfsFeatureTypeModal';
import { SublayerSelectionModal } from '../components/SublayerSelectionModal';
import { ExportModal } from '../components/ExportModal';
import { FeatureTablePanel } from '../components/FeatureTablePanel';
import { useIsMobile } from '../hooks/useMediaQuery';
import {
  Download,
  Layers,
  AlertCircle,
  Trash2,
  MoreVertical,
  Search,
  Loader2,
  Plus,
} from 'lucide-react';
import JSZip from 'jszip';
import { SEO } from '../components/SEO';
import { articleStyle, h1Style, h2Style, sectionStyle, ulStyle, linkStyle } from './Privacy';

const MapView = React.lazy(() =>
  import('../components/map/MapView').then((module) => ({ default: module.MapView }))
);

interface LoadedLayer {
  id: string;
  name: string;
  url: string;
  geometryType: string;
  visible: boolean;
  extent?: any;
  serviceType?: 'arcgis' | 'wfs';
  wfsTypeName?: string;
  wfsVersion?: string;
}

export const Downloader: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const endpointParam = searchParams.get('url');
  const isMobile = useIsMobile();

  const hasProcessedUrlRef = useRef(false);

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layers, setLayers] = useState<LoadedLayer[]>([]);
  const [progress, setProgress] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'url' | 'search'>('url');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const [pendingSublayers, setPendingSublayers] = useState<{
    serviceUrl: string;
    sublayers: any[];
  } | null>(null);
  const [pendingWfs, setPendingWfs] = useState<{
    baseUrl: string;
    version: string;
    serviceTitle?: string;
    featureTypes: WfsFeatureType[];
  } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const [activeMenuLayerId, setActiveMenuLayerId] = useState<string | null>(null);
  const [zoomTarget, setZoomTarget] = useState<any>(null);

  const [tableMode, setTableMode] = useState<'normal' | 'minimized' | 'maximized'>('normal');

  const [tableLayerInfo, setTableLayerInfo] = useState<{
    id: string;
    url: string;
    title: string;
    serviceType?: 'arcgis' | 'wfs';
    wfsTypeName?: string;
  } | null>(null);

  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  void selectedFeature;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.layer-menu-container')) {
        setActiveMenuLayerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addWfsLayers = (
    baseUrl: string,
    version: string,
    featureTypes: WfsFeatureType[]
  ) => {
    const newLayers: LoadedLayer[] = featureTypes.map((ft) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: ft.title || ft.name,
      url: baseUrl,
      geometryType: `WFS · ${ft.name}`,
      visible: true,
      serviceType: 'wfs',
      wfsTypeName: ft.name,
      wfsVersion: version,
    }));
    setLayers((prev) => [...newLayers, ...prev]);
    setUrl('');
    setProgress(
      newLayers.length === 1
        ? 'WFS layer successfully added to map!'
        : `${newLayers.length} WFS layers successfully added to map!`
    );
    if (newLayers[0]) {
      setZoomTarget({ layerId: newLayers[0].id, time: Date.now() });
    }
  };

  const executeLoadService = async (rawUrl: string) => {
    let cleanUrl = rawUrl.trim();
    if (!cleanUrl) return;

    setLoading(true);
    setError(null);

    try {
      if (isWfsUrl(cleanUrl)) {
        setProgress('Reading WFS capabilities...');
        const baseUrl = normalizeWfsBaseUrl(cleanUrl);
        const caps = await fetchWfsCapabilities(baseUrl);
        if (caps.featureTypes.length === 1) {
          addWfsLayers(baseUrl, caps.version, caps.featureTypes);
        } else {
          setPendingWfs({
            baseUrl,
            version: caps.version,
            serviceTitle: caps.serviceTitle,
            featureTypes: caps.featureTypes,
          });
          setProgress('');
        }
        return;
      }

      if (
        cleanUrl.includes('/home/item.html?id=') ||
        cleanUrl.includes('/sharing/rest/content/items/')
      ) {
        setProgress('Resolving ArcGIS Online Item ID...');
        const match =
          cleanUrl.match(/id=([a-fA-F0-9]+)/) ||
          cleanUrl.match(/\/items\/([a-fA-F0-9]+)/);
        if (match && match[1]) {
          const itemId = match[1];
          const itemRes = await fetch(
            `https://www.arcgis.com/sharing/rest/content/items/${itemId}?f=json`
          );
          const itemData = await itemRes.json();
          if (itemData.url) {
            cleanUrl = itemData.url;
          } else {
            throw new Error(
              'Could not resolve a valid service URL from this ArcGIS Item ID.'
            );
          }
        }
      }

      if (
        (cleanUrl.includes('FeatureServer') || cleanUrl.includes('MapServer')) &&
        !cleanUrl.match(/\/\d+$/)
      ) {
        setProgress('Checking service for sublayers...');
        try {
          const res = await fetch(`${cleanUrl}?f=json`);
          const data = await res.json();

          if (data.layers && data.layers.length > 0) {
            if (data.layers.length === 1) {
              cleanUrl = `${cleanUrl}/${data.layers[0].id ?? 0}`;
            } else {
              setPendingSublayers({
                serviceUrl: cleanUrl,
                sublayers: data.layers,
              });
              setLoading(false);
              setProgress('');
              return;
            }
          } else {
            cleanUrl = `${cleanUrl}/0`;
          }
        } catch {
          cleanUrl = `${cleanUrl}/0`;
        }
      }

      setProgress('Fetching service metadata...');
      const meta = await fetchArcGISMetadata(cleanUrl);

      const newLayer: LoadedLayer = {
        id: Math.random().toString(36).substring(2, 9),
        name: meta.name || 'Unnamed Layer',
        url: cleanUrl,
        geometryType: meta.geometryType || 'Unknown',
        visible: true,
        extent: meta.extent,
      };

      setLayers((prev) => [newLayer, ...prev]);
      setUrl('');
      setProgress('Layer successfully added to map!');

      if (meta.extent) {
        setZoomTarget({ layerId: newLayer.id, extent: meta.extent, time: Date.now() });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load service layer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpointParam && !hasProcessedUrlRef.current) {
      hasProcessedUrlRef.current = true;
      const decodedUrl = decodeURIComponent(endpointParam);
      setSearchParams({}, { replace: true });
      executeLoadService(decodedUrl);
    }
  }, [endpointParam, setSearchParams]);

  const handleDatasetSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const res = await fetch(
        `https://www.arcgis.com/sharing/rest/search?q=${encodeURIComponent(
          searchQuery + ' (type:"Feature Service" OR type:"Map Service")'
        )}&f=json&num=15`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search datasets.');
    } finally {
      setSearching(false);
    }
  };

  const handleAddSearchedItemToMap = async (item: any) => {
    setLoadingItemId(item.id);
    setError(null);
    try {
      let serviceUrl = item.url;
      if (!serviceUrl || !serviceUrl.includes('Server')) {
        const itemRes = await fetch(
          `https://www.arcgis.com/sharing/rest/content/items/${item.id}?f=json`
        );
        const itemData = await itemRes.json();
        if (itemData.url) {
          serviceUrl = itemData.url;
        } else {
          throw new Error(
            'This search result is not a direct feature service layer.'
          );
        }
      }
      await executeLoadService(serviceUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to load searched dataset.');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleLoadService = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLoadService(url);
  };

  const handleConfirmSublayers = async (
    selectedItems: { url: string; title: string }[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newLoadedLayers: LoadedLayer[] = [];
      for (const item of selectedItems) {
        try {
          const meta = await fetchArcGISMetadata(item.url);
          newLoadedLayers.push({
            id: Math.random().toString(36).substring(2, 9),
            name: item.title || meta.name || 'GIS Layer',
            url: item.url,
            geometryType: meta.geometryType || 'Unknown',
            visible: true,
            extent: meta.extent,
          });
        } catch {
          newLoadedLayers.push({
            id: Math.random().toString(36).substring(2, 9),
            name: item.title,
            url: item.url,
            geometryType: 'Unknown',
            visible: true,
          });
        }
      }

      setLayers((prev) => [...newLoadedLayers, ...prev]);
      setUrl('');
      setProgress('Selected sublayers successfully added to map!');
    } catch (err: any) {
      setError(err.message || 'Failed to load selected sublayers.');
    } finally {
      setLoading(false);
      setPendingSublayers(null);
    }
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (tableLayerInfo?.id === id) setTableLayerInfo(null);
  };

  const removeAllLayers = () => {
    setLayers([]);
    setZoomTarget(null);
    setTableLayerInfo(null);
    setSelectedFeature(null);
  };

  const handleDownloadExport = async (layer: LoadedLayer) => {
    setExporting(true);
    setError(null);
    try {
      let fullGeoJson: any;

      if (layer.serviceType === 'wfs') {
        setProgress(`Downloading ${layer.name} from WFS...`);
        fullGeoJson = await fetchWfsFeatureCollection(
          layer.url,
          layer.wfsTypeName ?? '',
          layer.wfsVersion ?? '2.0.0',
          (done, total) => {
            setProgress(
              `Downloading ${layer.name}: ${done.toLocaleString()}${
                total ? ` / ${total.toLocaleString()}` : ''
              } features...`
            );
          }
        );
      } else {
        setProgress(`Fetching all object IDs for ${layer.name}...`);
        const ids = await fetchObjectIds(layer.url);

        setProgress(`Downloading all ${ids.length} features in batches...`);
        const features = await fetchFeaturesBatch(layer.url, ids, (done, total) => {
          setProgress(`Downloading ${layer.name}: batch ${done} / ${total}...`);
        });
        fullGeoJson = { type: 'FeatureCollection', features };
      }

      const blob = new Blob([JSON.stringify(fullGeoJson)], {
        type: 'application/json',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${layer.name.replace(/\s+/g, '_')}.geojson`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setProgress('Export completed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to export full dataset.');
    } finally {
      setExporting(false);
    }
  };

  const convertToCSV = (features: any[]) => {
    if (!features || features.length === 0) return '';
    const sampleAttrs =
      features[0].attributes || features[0].properties || features[0];
    const headers = Object.keys(sampleAttrs);
    const rows = features.map((f) => {
      const attrs = f.attributes || f.properties || f;
      return headers
        .map((h) => {
          const val = attrs[h];
          if (val === null || val === undefined) return '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const convertToKML = (layerName: string, features: any[]) => {
    let placemarks = '';
    for (const f of features) {
      const attrs = f.attributes || f.properties || {};
      const geom = f.geometry;
      let coordsStr = '';
      if (geom && geom.rings && geom.rings[0]) {
        coordsStr = geom.rings[0]
          .map((c: any) => `${c[0]},${c[1]},0`)
          .join(' ');
      } else if (geom && geom.paths && geom.paths[0]) {
        coordsStr = geom.paths[0]
          .map((c: any) => `${c[0]},${c[1]},0`)
          .join(' ');
      } else if (geom && geom.x !== undefined && geom.y !== undefined) {
        coordsStr = `${geom.x},${geom.y},0`;
      }

      const desc = Object.entries(attrs)
        .map(([k, v]) => `&lt;b&gt;${k}:&lt;/b&gt; ${v}`)
        .join('&lt;br/&gt;');
      placemarks += `
        <Placemark>
          <name>${layerName}</name>
          <description><![CDATA[${desc}]]></description>
          <Point><coordinates>${coordsStr}</coordinates></Point>
        </Placemark>`;
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${layerName}</name>
    ${placemarks}
  </Document>
</kml>`;
  };

  const handleBulkExport = async (
    selectedLayerIds: string[],
    format: string
  ) => {
    setExporting(true);
    setError(null);
    try {
      const targetLayers = layers.filter((l) =>
        selectedLayerIds.includes(l.id)
      );
      const zip = new JSZip();

      for (let i = 0; i < targetLayers.length; i++) {
        const layer = targetLayers[i];
        setProgress(
          `Processing layer ${i + 1} of ${targetLayers.length}: ${layer.name}...`
        );

        let features: any[];
        let crs: unknown;
        if (layer.serviceType === 'wfs') {
          const wfsFc = await fetchWfsFeatureCollection(
            layer.url,
            layer.wfsTypeName ?? '',
            layer.wfsVersion ?? '2.0.0',
            (done, total) => {
              setProgress(
                `Layer ${i + 1} of ${targetLayers.length}: ${layer.name} - ${done.toLocaleString()}${
                  total ? ` / ${total.toLocaleString()}` : ''
                } features...`
              );
            }
          );
          features = wfsFc.features;
          crs = wfsFc.crs;
        } else {
          const ids = await fetchObjectIds(layer.url);
          features = await fetchFeaturesBatch(layer.url, ids, (done, total) => {
            setProgress(`Layer ${i + 1} of ${targetLayers.length}: ${layer.name} - batch ${done} / ${total}...`);
          });
        }
        const safeName = layer.name.replace(/[^a-zA-Z0-9_-]/g, '_');

        if (format === 'csv') {
          const csvData = convertToCSV(features);
          zip.file(`${safeName}.csv`, csvData);
        } else if (format === 'kml') {
          const kmlData = convertToKML(layer.name, features);
          zip.file(`${safeName}.kml`, kmlData);
        } else {
          const fc: any = {
            type: 'FeatureCollection',
            ...(crs ? { crs } : {}),
            features,
          };
          zip.file(`${safeName}.geojson`, JSON.stringify(fc));
        }
      }

      setProgress('Compressing files into archive...');
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `gis_bulk_export_${format}.zip`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProgress('Bulk export complete!');
    } catch (err: any) {
      setError(err.message || 'Failed during bulk export conversion.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SEO
        title="Free GIS Data Downloader — ArcGIS REST & WFS Export"
        description="Load ArcGIS REST, spatial web services and export them as GeoJSON, Shapefile, KML, GeoPackage, or CSV. Free, browser-based, no signup required."
        keywords="ArcGIS downloader, FeatureServer export, GIS layer exporter, download GIS data"
        path="/download"
      />

<h1
        style={{
          fontSize: '1rem',
          fontWeight: 800,
          margin: '0.45rem 1rem 0',
          color: 'var(--text-main)',
        }}
      >
        ArcGIS REST &amp; WFS Data Downloader
      </h1>

      {/* Main Tool UI (Locked to viewport height) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="downloader-grid">
          {/* Sidebar Controls */}
          <div className="downloader-sidebar">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h2
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: 0,
                }}
              >
                <Layers
                  style={{
                    width: '1.125rem',
                    height: '1.125rem',
                    color: 'var(--accent-color)',
                  }}
                />
                GIS Service Loader
              </h2>

              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-hover)',
                  padding: '0.2rem',
                  borderRadius: '0.375rem',
                  gap: '0.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor:
                      activeTab === 'url' ? 'var(--accent-color)' : 'transparent',
                    color: activeTab === 'url' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                  }}
                >
                  URL / Endpoint
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor:
                      activeTab === 'search' ? 'var(--accent-color)' : 'transparent',
                    color: activeTab === 'search' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                  }}
                >
                  Search Datasets
                </button>
              </div>

              {activeTab === 'url' ? (
                <form
                  onSubmit={handleLoadService}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    ArcGIS REST URL (FeatureServer / MapServer) or WFS
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://services.arcgis.com/.../FeatureServer or .../wfs"
                    required
                    className="form-input"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    {loading ? 'Adding...' : 'Add Layer'}
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <form
                    onSubmit={handleDatasetSearch}
                    style={{ display: 'flex', gap: '0.5rem' }}
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search datasets..."
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="submit"
                      disabled={searching}
                      className="btn-primary"
                      style={{ padding: '0.55rem 0.9rem' }}
                    >
                      {searching ? (
                        <Loader2
                          style={{
                            width: '0.9rem',
                            height: '0.9rem',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                      ) : (
                        <Search style={{ width: '0.9rem', height: '0.9rem' }} />
                      )}
                    </button>
                  </form>

                  {searchResults.length > 0 && (
                    <div
                      style={{
                        maxHeight: '260px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        paddingRight: '4px',
                      }}
                    >
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            padding: '0.6rem',
                            backgroundColor: 'var(--bg-hover)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.375rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                margin: '0 0 0.15rem 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'var(--text-main)',
                              }}
                            >
                              {item.title}
                            </p>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {item.type}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddSearchedItemToMap(item)}
                            disabled={loadingItemId === item.id}
                            className="btn-primary"
                            style={{
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.7rem',
                              flexShrink: 0,
                            }}
                          >
                            {loadingItemId === item.id ? (
                              <Loader2
                                style={{
                                  width: '0.75rem',
                                  height: '0.75rem',
                                  animation: 'spin 1s linear infinite',
                                }}
                              />
                            ) : (
                              <Plus style={{ width: '0.75rem', height: '0.75rem' }} />
                            )}
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {progress && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-color)',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {progress}
                </p>
              )}
              {error && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--danger-color)',
                    backgroundColor: 'var(--danger-soft)',
                    padding: '0.6rem',
                    borderRadius: '0.375rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle
                      style={{ width: '1rem', height: '1rem', flexShrink: 0 }}
                    />
                    <span style={{ fontWeight: 600 }}>
                      Unable to load this ArcGIS layer.
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      wordBreak: 'break-all',
                    }}
                  >
                    Reason: {error}
                  </span>
                </div>
              )}
            </div>

            {/* Layers Management Box */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.5rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                  Layers ({layers.length})
                </h3>
                {layers.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                      onClick={() => setShowExportModal(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-color)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: 0,
                      }}
                    >
                      Bulk Export
                    </button>
                    <button
                      onClick={removeAllLayers}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger-color)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: 0,
                      }}
                    >
                      Remove All
                    </button>
                  </div>
                )}
              </div>

              {layers.length === 0 ? (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    margin: '2rem 0',
                  }}
                >
                  No layers added yet. Paste a service URL or search for datasets
                  above to add them to your map.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--bg-hover)',
                        border: '1px solid var(--border-color)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={() => toggleLayerVisibility(layer.id)}
                            style={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
                          />
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'var(--text-main)',
                            }}
                          >
                            {layer.name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexShrink: 0 }}>
                          <button
                            onClick={() => handleDownloadExport(layer)}
                            disabled={exporting}
                            style={{
                              backgroundColor: 'var(--success-color)',
                              color: '#fff',
                              border: 'none',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Download style={{ width: '0.75rem', height: '0.75rem' }} />
                            <span className="hide-on-small">Export</span>
                          </button>

                          <div className="layer-menu-container" style={{ position: 'relative' }}>
                            <button
                              onClick={() =>
                                setActiveMenuLayerId(
                                  activeMenuLayerId === layer.id ? null : layer.id
                                )
                              }
                              title="Layer Options"
                              className="icon-button"
                              style={{ width: '2rem', height: '2rem' }}
                            >
                              <MoreVertical style={{ width: '0.9rem', height: '0.9rem' }} />
                            </button>

                            {activeMenuLayerId === layer.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: '100%',
                                  marginTop: '4px',
                                  backgroundColor: 'var(--bg-elevated)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '0.5rem',
                                  boxShadow: 'var(--shadow-lg)',
                                  zIndex: 9999,
                                  minWidth: '180px',
                                  padding: '0.25rem 0',
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setActiveMenuLayerId(null);
                                    setLayers((prev) =>
                                      prev.map((l) =>
                                        l.id === layer.id ? { ...l, visible: true } : l
                                      )
                                    );
                                    setZoomTarget({
                                      layerId: layer.id,
                                      extent: layer.extent,
                                      time: Date.now(),
                                    });
                                  }}
                                  style={dropdownItemStyle}
                                >
                                  🔍 Zoom to Layer
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuLayerId(null);
                                    window.open(layer.url, '_blank');
                                  }}
                                  style={dropdownItemStyle}
                                >
                                  🔗 View Endpoint
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuLayerId(null);
                                    setTableMode('normal');
                                    setTableLayerInfo({
                                      id: layer.id,
                                      url: layer.url,
                                      title: layer.name,
                                      serviceType: layer.serviceType,
                                      wfsTypeName: layer.wfsTypeName,
                                    });
                                  }}
                                  style={dropdownItemStyle}
                                >
                                  📊 Attribute Table
                                </button>
                                <div
                                  style={{
                                    height: '1px',
                                    backgroundColor: 'var(--border-color)',
                                    margin: '0.25rem 0',
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    setActiveMenuLayerId(null);
                                    removeLayer(layer.id);
                                  }}
                                  style={{ ...dropdownItemStyle, color: 'var(--danger-color)' }}
                                >
                                  <Trash2
                                    style={{
                                      width: '0.85rem',
                                      height: '0.85rem',
                                      display: 'inline',
                                      marginRight: '6px',
                                      verticalAlign: '-2px',
                                    }}
                                  />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {layer.geometryType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Display Area */}
          <div className="card map-card">
            <div
              style={{
                flex: 1,
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '300px',
              }}
            >
              <Suspense
                fallback={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    <Loader2 style={{ width: '2rem', height: '2rem', animation: 'spin 1s linear infinite' }} />
                  </div>
                }
              >
                <ErrorBoundary
                  fallback={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <AlertCircle style={{ width: '2rem', height: '2rem', color: 'var(--danger-color)', marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.85rem' }}>The interactive map is not supported on this device or ran out of memory.</p>
                    </div>
                  }
                >
                  <MapView
                    layers={layers}
                    zoomTarget={zoomTarget}
                    onFeatureSelect={(attributes) => {
                      setSelectedFeature(attributes);
                    }}
                  />
                </ErrorBoundary>
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory content — helps search engines and reviewers understand the page */}
      <section style={{ maxWidth: '46rem', margin: '3rem auto 2rem', padding: '0 0.5rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          How this downloader works
        </h2>
        <p style={{ fontSize: '0.95rem', marginTop: 0 }}>
          Paste an ArcGIS REST FeatureServer or MapServer layer URL. The tool first
          asks the server for every object ID in the layer, then pages through those
          IDs in batches of 200 and appends each batch to the output file. That is
          why it is not limited by the server&apos;s <code>maxRecordCount</code> — the cap
          that silently truncates ordinary REST queries around 1,000 to 2,000
          features.
        </p>
        <p style={{ fontSize: '0.95rem' }}>
          Conversion to Shapefile, GeoPackage, KML, GeoJSON, CSV, or GPX happens in
          your browser through GDAL compiled to WebAssembly. No file is uploaded to
          a server, and nothing is stored between sessions.
        </p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', marginTop: '2rem' }}>
          Supported inputs
        </h2>
        <ul style={{ fontSize: '0.95rem', paddingLeft: '1.25rem' }}>
          <li>ArcGIS REST FeatureServer and MapServer layers (numeric layer id required)</li>
          <li>OGC Web Feature Service (WFS) endpoints, versions 1.0.0 through 2.0.0</li>
          <li>ArcGIS Online public feature layers, using the Discover tool</li>
        </ul>
        <p style={{ fontSize: '0.95rem', marginTop: '1.5rem' }}>
          New to ArcGIS REST endpoints? Start with the{' '}
          <Link to="/blog/how-to-download-arcgis-rest-featureserver-data" style={{ color: 'var(--accent-color)' }}>
            step-by-step FeatureServer guide
          </Link>
          , or read{' '}
          <Link to="/documentation" style={{ color: 'var(--accent-color)' }}>
            the documentation
          </Link>
          .
        </p>
      </section>

      {/* SEO Content Section (Below the tool, above the footer) */}
      <div style={{ maxWidth: '800px', margin: '3rem auto 2rem auto', padding: '0 1rem' }}>
        <section style={sectionStyle}>
          <h2 style={h2Style}>About the Data Downloader</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
            The Geo Server Data Downloader is a powerful, completely free, and client-side tool designed to extract raw spatial data directly from ArcGIS REST services. Whether you are working with an ArcGIS Online FeatureServer, an Enterprise MapServer, or a standard WFS endpoint, this tool bypasses the traditional 1,000-feature limit imposed by web viewers.
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
            By utilizing the server's <code>returnIdsOnly</code> query mode, the tool automatically paginates through datasets with hundreds of thousands of features, downloading them in optimized chunks. All processing, querying, and format conversion happens locally in your browser using WebAssembly. Your data is never uploaded to a server.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Supported Export Formats</h2>
          <ul style={ulStyle}>
            <li><strong>GeoJSON:</strong> The modern standard for web mapping and spatial analysis.</li>
            <li><strong>ESRI Shapefile:</strong> The universal legacy format (packaged as a ZIP archive).</li>
            <li><strong>Google Earth KML:</strong> For visualizing layers in Google Earth.</li>
            <li><strong>GeoPackage:</strong> The modern SQLite-based container for desktop GIS.</li>
            <li><strong>CSV with WKT:</strong> Spreadsheet-ready data with geometry preserved.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Related Resources</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
            Need to convert an existing file on your computer? Use our <Link to="/converter" style={linkStyle}>Free GIS Format Converter</Link> to transform Shapefiles, KMLs, and GeoJSON files.
            <br /><br />
            Want to learn more about working with spatial data? Read our guides on <Link to="/blog/how-to-download-arcgis-rest-featureserver-data" style={linkStyle}>downloading FeatureServer data</Link> and <Link to="/blog/geojson-vs-shapefile-vs-geopackage" style={linkStyle}>choosing the right GIS format</Link>.
          </p>
        </section>
      </div>

      {/* Modals and Drawers */}
      {tableLayerInfo && (
        <div className={`table-drawer ${tableMode}`}>
          <FeatureTablePanel
            key={tableLayerInfo.id}
            layerUrl={tableLayerInfo.url}
            layerTitle={tableLayerInfo.title}
            serviceType={tableLayerInfo.serviceType}
            wfsTypeName={tableLayerInfo.wfsTypeName}
            onClose={() => setTableLayerInfo(null)}
            tableMode={tableMode}
            onToggleMode={setTableMode}
          />
        </div>
      )}

      {pendingSublayers && (
        <SublayerSelectionModal
          serviceUrl={pendingSublayers.serviceUrl}
          sublayers={pendingSublayers.sublayers}
          onAddLayers={handleConfirmSublayers}
          onClose={() => setPendingSublayers(null)}
        />
      )}

      {pendingWfs && (
        <WfsFeatureTypeModal
          baseUrl={pendingWfs.baseUrl}
          version={pendingWfs.version}
          serviceTitle={pendingWfs.serviceTitle}
          featureTypes={pendingWfs.featureTypes}
          onAdd={(selected) => {
            addWfsLayers(pendingWfs.baseUrl, pendingWfs.version, selected);
            setPendingWfs(null);
          }}
          onClose={() => setPendingWfs(null)}
        />
      )}

      {showExportModal && (
        <ExportModal
          layers={layers}
          onClose={() => setShowExportModal(false)}
          onExport={handleBulkExport}
        />
      )}
    </div>
  );
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.5rem 0.9rem',
  textAlign: 'left',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-main)',
  fontSize: '0.78rem',
  cursor: 'pointer',
};

export default Downloader;