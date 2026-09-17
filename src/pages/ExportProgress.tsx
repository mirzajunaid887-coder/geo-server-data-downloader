import React, { useEffect, useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fetchObjectIds } from '../services/arcgis/objectIds';
import { fetchFeaturesBatch } from '../services/arcgis/query';

export const ExportProgress: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing export window...');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runBackgroundExport = async () => {
      try {
        setStatus('Parsing parameters...');
        const params = new URLSearchParams(window.location.search);
        const layersParam = params.get('layers');
        const format = params.get('format') || 'shapefile';
        
        if (!layersParam) {
          setError('No export layers specified in URL query.');
          return;
        }

        const layerConfigs: { name: string; url: string }[] = JSON.parse(decodeURIComponent(layersParam));
        
        setStatus('Initializing GDAL engine...');
        const gdalModule = await import('gdal3.js');
        const initGdal = gdalModule.default || gdalModule;
        const gdal_ = (await (initGdal as any)({
          path: 'https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package',
          useWorker: false
        })) as any;

        let completed = 0;
        for (const layer of layerConfigs) {
          setStatus(`Fetching feature IDs for ${layer.name} (${completed + 1}/${layerConfigs.length})...`);
          const ids = await fetchObjectIds(layer.url);

          setStatus(`Downloading ${ids.length} records for ${layer.name}...`);
          const features = await fetchFeaturesBatch(layer.url, ids);

          const fc: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };
          const inputGeoJsonStr = JSON.stringify(fc);

          try { gdal_.FS.unlink('/input.geojson'); } catch {}
          gdal_.FS.writeFile('/input.geojson', inputGeoJsonStr);

          let extension = 'geojson';
          let gdalDriver = 'GeoJSON';
          let mimeType = 'application/json';

          if (format === 'shapefile') {
            gdalDriver = 'ESRI Shapefile';
            extension = 'zip';
            mimeType = 'application/zip';
          } else if (format === 'kml') {
            gdalDriver = 'KML';
            extension = 'kml';
            mimeType = 'application/vnd.google-earth.kml+xml';
          } else if (format === 'csv') {
            gdalDriver = 'CSV';
            extension = 'csv';
            mimeType = 'text/csv';
          }

          setStatus(`Converting ${layer.name} to ${format.toUpperCase()}...`);
          gdal_.gdal.ogr2ogr(['-f', gdalDriver, `/output.${extension}`, '/input.geojson']);
          
          const fileData = gdal_.FS.readFile(`/output.${extension}`);
          const blob = new Blob([fileData], { type: mimeType });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${layer.name.replace(/\s+/g, '_')}.${extension}`;
          link.click();

          completed++;
          setProgressPercent(Math.round((completed / layerConfigs.length) * 100));
        }

        setStatus('All exports completed successfully!');
        setIsComplete(true);
      } catch (err: any) {
        console.error('Export error:', err);
        setError(err.message || 'An unknown error occurred during export.');
      }
    };

    runBackgroundExport();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#111827', color: '#f3f4f6', fontFamily: 'sans-serif', padding: '1rem' }}>
      <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Download style={{ color: 'var(--accent-color)' }} /> Exporting Geospatial Data
        </h2>

        {!error && !isComplete && (
          <div style={{ margin: '1.5rem 0' }}>
            <Loader2 style={{ width: '2.5rem', height: '2.5rem', animation: 'spin 1s linear infinite', color: 'var(--accent-color)', margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>{status}</p>
            <div style={{ width: '100%', backgroundColor: '#374151', height: '8px', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, backgroundColor: 'var(--accent-color)', height: '100%', transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>{progressPercent}% Complete</p>
          </div>
        )}

        {isComplete && (
          <div style={{ margin: '1.5rem 0' }}>
            <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: '#10b981', margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#10b981' }}>Downloads Triggered Successfully!</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>You can now safely close this window.</p>
            <button onClick={() => window.close()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#374151', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
              Close Window
            </button>
          </div>
        )}

        {error && (
          <div style={{ margin: '1.5rem 0' }}>
            <AlertCircle style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '0.85rem', color: '#ef4444', wordBreak: 'break-word' }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};