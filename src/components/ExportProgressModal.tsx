import React, { useState, useEffect } from 'react';
import { X, Download, AlertCircle, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { fetchObjectIds } from '../services/arcgis/objectIds';
import { fetchFeaturesBatch } from '../services/arcgis/query';

interface LoadedLayer {
  id: string;
  name: string;
  url: string;
  geometryType: string;
  visible: boolean;
}

interface ExportProgressModalProps {
  layers: LoadedLayer[];
  selectedLayerIds: string[];
  format: string;
  onClose: () => void;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  layers,
  selectedLayerIds,
  format,
  onClose,
}) => {
  const [progressTitle, setProgressTitle] = useState<string>('Preparing export...');
  const [progressDetail, setProgressDetail] = useState<string>('Initializing processing pipeline...');
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    const runExport = async () => {
      try {
        const targetLayers = layers.filter(l => selectedLayerIds.includes(l.id));
        if (targetLayers.length === 0) {
          throw new Error('No layers selected for export.');
        }

        setProgressTitle('Loading GDAL WebAssembly environment...');
        const gdalModule = await import('gdal3.js');
        const initGdal = gdalModule.default || gdalModule;
        const gdal_ = (await (initGdal as any)({
          path: 'https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package',
          useWorker: false
        })) as any;

        if (isCancelled) return;

        const mainZip = new JSZip();
        const layerDatasets: { name: string; dataset: any }[] = [];

        for (let i = 0; i < targetLayers.length; i++) {
          const layer = targetLayers[i];
          const safeName = layer.name.replace(/[^a-zA-Z0-9_-]/g, '_');

          setProgressTitle(`Layer ${i + 1} of ${targetLayers.length}: ${layer.name}`);
          setProgressDetail('Fetching Object IDs...');
          
          const ids = await fetchObjectIds(layer.url);
          if (!ids || ids.length === 0) {
            throw new Error(`No features found for layer "${layer.name}".`);
          }

          setProgressDetail(`Downloading ${ids.length.toLocaleString()} features...`);
          // Fixed: pass only 2 parameters if fetchFeaturesBatch expects 2 arguments
          const features = await fetchFeaturesBatch(layer.url, ids);

          if (isCancelled) return;

          const fc: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };
          const vsiPath = `/${safeName}_input.geojson`;
          
          try { gdal_.FS.unlink(vsiPath); } catch {}
          gdal_.FS.writeFile(vsiPath, JSON.stringify(fc));

          const dataset = gdal_.open(vsiPath);
          layerDatasets.push({ name: safeName, dataset });
        }

        const driverMap: Record<string, string> = {
          gpkg: 'GPKG',
          shp: 'ESRI Shapefile',
          geojson: 'GeoJSON',
          csv: 'CSV',
          kml: 'KML',
          gpx: 'GPX'
        };
        const gdalDriver = driverMap[format] || 'GeoJSON';
        const extension = format === 'shp' ? 'shp' : format === 'gpkg' ? 'gpkg' : format;

        if (format === 'gpkg') {
          setProgressTitle('Generating GeoPackage...');
          setProgressDetail('Converting layers into single .gpkg container...');

          const first = layerDatasets[0];
          let resultFiles = gdal_.gdal.ogr2ogr(['-f', 'GPKG', 'download.gpkg', `/input_${first.name}.geojson`]);
          
          for (let j = 1; j < layerDatasets.length; j++) {
            const nextLayer = layerDatasets[j];
            setProgressDetail(`Appending ${nextLayer.name}...`);
            resultFiles = gdal_.gdal.ogr2ogr([
              '-update', '-append', '-f', 'GPKG', 'download.gpkg', `/input_${nextLayer.name}.geojson`, '-nln', nextLayer.name
            ]);
          }

          const finalBuffer = resultFiles['download.gpkg'];
          if (!finalBuffer) throw new Error('GeoPackage generation failed.');

          const blob = new Blob([finalBuffer], { type: 'application/x-sqlite3' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'download.gpkg';
          link.click();
        } else {
          setProgressTitle(`Compressing ${format.toUpperCase()} files...`);
          for (let k = 0; k < layerDatasets.length; k++) {
            const item = layerDatasets[k];
            const outName = `${item.name}.${extension}`;
            gdal_.gdal.ogr2ogr(['-f', gdalDriver, outName, `/input_${item.name}.geojson`]);
            
            const fileData = gdal_.FS.readFile(outName);
            if (fileData) {
              mainZip.file(outName, fileData);
            }
          }

          const content = await mainZip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = `bulk_export_${format}.zip`;
          link.click();
        }

        // Cleanup
        for (const item of layerDatasets) {
          try { gdal_.close(item.dataset); } catch {}
        }

        if (!isCancelled) {
          setIsComplete(true);
          setProgressTitle('Export Complete!');
          setProgressDetail('Your download has started successfully.');
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || 'Export process failed.');
        }
      }
    };

    runExport();

    return () => {
      isCancelled = true;
    };
  }, [layers, selectedLayerIds, format]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#111827', border: '1px solid var(--border-color)',
        borderRadius: '0.5rem', width: '100%', maxWidth: '450px',
        padding: '1.5rem', color: '#f3f4f6', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download style={{ width: '1.125rem', height: '1.125rem', color: 'var(--accent-color)' }} />
            Exporting GIS Data
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {error ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        ) : isComplete ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981', margin: '0 0 0.5rem 0' }}>{progressTitle}</p>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>{progressDetail}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '1rem' }}>
            <Loader2 className="animate-spin" style={{ width: '2.5rem', height: '2.5rem', color: 'var(--accent-color)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e5e7eb', margin: '0 0 0.3rem 0' }}>{progressTitle}</p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, wordBreak: 'break-word' }}>{progressDetail}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{ backgroundColor: '#374151', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            {isComplete ? 'Close' : 'Cancel / Run in Background'}
          </button>
        </div>
      </div>
    </div>
  );
};