import React, { useState } from 'react';
import { X, Download, AlertCircle, ExternalLink } from 'lucide-react';

interface LoadedLayer {
  id: string;
  name: string;
  url: string;
  geometryType: string;
  visible: boolean;
}

interface ExportModalProps {
  layers: LoadedLayer[];
  onClose: () => void;
  onExport?: (selectedLayerIds: string[], format: string) => Promise<void>;
}

/**
 * ARCHITECTURE NOTE
 * -----------------
 * This mirrors how mchaynes/geodatadownloader (geodatadownloader.com) works:
 * everything runs client-side, in the browser, with no backend.
 *
 * The difference from the old version of this modal: instead of running the
 * GDAL/JSZip pipeline inline and blocking this dialog with a progress screen,
 * clicking "Start Download" now:
 *   1. Opens a brand-new, self-contained popup window.
 *   2. Writes a standalone HTML document into it that duplicates the whole
 *      export pipeline (ArcGIS queries -> GDAL conversion -> file download),
 *      loading GDAL/JSZip from CDN as native ES modules.
 *   3. Immediately closes this modal.
 *
 * Because the popup is a completely separate window/document/JS context,
 * the main dashboard and map view are never blocked, re-rendered, or tied up
 * while the export runs — the user can keep exploring layers immediately.
 * Multiple exports can even run side-by-side in their own popups.
 */

const FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: 'gpkg', label: 'GeoPackage (.gpkg) - Multi-layer container' },
  { value: 'shp', label: 'ESRI Shapefile (.zip) - Separate dataset archive' },
  { value: 'geojson', label: 'GeoJSON (.geojson)' },
  { value: 'csv', label: 'CSV Spreadsheet (.csv)' },
  { value: 'kml', label: 'Google Earth KML (.kml)' },
  { value: 'gpx', label: 'GPS Exchange Format (.gpx)' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ layers, onClose }) => {
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(layers.map(l => l.id));
  const [format, setFormat] = useState<string>('gpkg');
  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState<boolean>(false);

  const toggleSelectAll = () => {
    if (selectedLayerIds.length === layers.length) {
      setSelectedLayerIds([]);
    } else {
      setSelectedLayerIds(layers.map(l => l.id));
    }
  };

  const toggleLayer = (id: string) => {
    setSelectedLayerIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStartExport = () => {
    if (selectedLayerIds.length === 0) {
      setError('Please select at least one layer to export.');
      return;
    }

    const targetLayers = layers.filter(l => selectedLayerIds.includes(l.id));

    for (const layer of targetLayers) {
      if (!layer.url || layer.url.includes('example.com')) {
        setError(`Layer "${layer.name}" has an invalid or placeholder service URL.`);
        return;
      }
    }

    setError(null);
    setLaunching(true);

    const popup = openExportWindow(
      targetLayers.map(l => ({ name: l.name, url: l.url })),
      format
    );

    if (!popup) {
      setLaunching(false);
      setError(
        'Your browser blocked the download window. Please allow pop-ups for this site and click "Start Download" again.'
      );
      return;
    }

    // The popup now owns the entire export pipeline independently.
    // Close this dialog right away so the map/dashboard is free to use.
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#111827', border: '1px solid var(--border-color)',
        borderRadius: '0.5rem', width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', display: 'flex',
        flexDirection: 'column', overflow: 'hidden', color: '#f3f4f6'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download style={{ width: '1.125rem', height: '1.125rem', color: 'var(--accent-color)' }} />
            Bulk Export Layers
          </h3>
          <button onClick={onClose} disabled={launching} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                width: '100%', padding: '0.5rem', backgroundColor: '#1f2937',
                border: '1px solid var(--border-color)', borderRadius: '0.375rem',
                color: '#f3f4f6', fontSize: '0.85rem'
              }}
            >
              {FORMAT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Select Layers ({selectedLayerIds.length} of {layers.length})
              </label>
              <button
                type="button"
                onClick={toggleSelectAll}
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                {selectedLayerIds.length === layers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#1f2937' }}>
              {layers.map(layer => (
                <label key={layer.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', padding: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedLayerIds.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{layer.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.7rem', color: '#9ca3af', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '0.5rem 0.6rem', borderRadius: '0.375rem' }}>
            <ExternalLink style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }} />
            <span>Downloads open in a separate window and run independently — the map and dashboard stay fully interactive while the export is in progress.</span>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.375rem' }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: '#1f2937' }}>
          <button
            onClick={onClose}
            disabled={launching}
            style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: '#d1d5db', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleStartExport}
            disabled={launching}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, opacity: launching ? 0.7 : 1 }}
          >
            {launching ? 'Opening window...' : 'Start Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
 * Popup window launcher
 * ---------------------------------------------------------------------- */

interface ExportLayerConfig {
  name: string;
  url: string;
}

function openExportWindow(exportLayers: ExportLayerConfig[], format: string): Window | null {
  const popup = window.open(
    '',
    `gdd_export_${Date.now()}`,
    'width=480,height=640,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
  );

  if (!popup) {
    return null;
  }

  popup.document.open();
  popup.document.write(buildExportDocument(exportLayers, format));
  popup.document.close();

  try {
    popup.focus();
  } catch {
    // ignore - some browsers restrict focus() on popups
  }

  return popup;
}

/**
 * Builds a fully self-contained HTML document for the popup window.
 * It duplicates the ArcGIS query + GDAL conversion pipeline as plain JS so
 * it has zero dependency on this app's bundle - just like geodatadownloader,
 * it runs entirely in its own browser context with no backend.
 *
 * The layer/format config is passed in as base64-encoded JSON to avoid any
 * escaping issues with quotes/backticks that might appear in layer names or
 * URLs.
 */
function buildExportDocument(exportLayers: ExportLayerConfig[], format: string): string {
  const configJson = JSON.stringify({ layers: exportLayers, format });
  const configB64 = btoa(unescape(encodeURIComponent(configJson)));

  const lines: string[] = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8" />',
    '<title>GIS Export</title>',
    '<style>',
    '  :root { --accent-color: #3b82f6; --border-color: #374151; }',
    '  * { box-sizing: border-box; }',
    '  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #111827; color: #f3f4f6; }',
    '  .card { display: flex; flex-direction: column; height: 100vh; }',
    '  .header { display: flex; align-items: center; gap: 0.5rem; padding: 1rem; border-bottom: 1px solid var(--border-color); font-weight: 700; font-size: 0.95rem; }',
    '  .header .dot { width: 0.6rem; height: 0.6rem; border-radius: 50%; background: var(--accent-color); }',
    '  .body { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; }',
    '  .title { font-size: 0.9rem; font-weight: 700; color: #e5e7eb; margin: 0; }',
    '  .detail { font-size: 0.78rem; color: #9ca3af; margin: 0; word-break: break-word; }',
    '  .spinner { width: 2rem; height: 2rem; border: 3px solid #374151; border-top-color: var(--accent-color); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0.5rem auto; }',
    '  @keyframes spin { to { transform: rotate(360deg); } }',
    '  .log { flex: 1; min-height: 100px; max-height: 220px; overflow-y: auto; background: #1f2937; border: 1px solid var(--border-color); border-radius: 0.375rem; padding: 0.5rem; font-size: 0.72rem; color: #9ca3af; font-family: ui-monospace, monospace; }',
    '  .log div { padding: 0.1rem 0; }',
    '  .error { display: none; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.6rem; border-radius: 0.375rem; }',
    '  .done { display: none; flex-direction: column; align-items: center; gap: 0.6rem; padding: 1rem 0; text-align: center; }',
    '  .done p { margin: 0; font-size: 0.85rem; color: #a7f3d0; }',
    '  button.close-btn { background: var(--accent-color); border: none; color: white; padding: 0.5rem 1.1rem; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; }',
    '</style>',
    '</head>',
    '<body>',
    '<div class="card">',
    '  <div class="header"><span class="dot"></span> GIS Export</div>',
    '  <div class="body">',
    '    <div class="spinner" id="spinner"></div>',
    '    <p class="title" id="title">Preparing export...</p>',
    '    <p class="detail" id="detail"></p>',
    '    <div class="log" id="log"></div>',
    '    <div class="error" id="error"></div>',
    '    <div class="done" id="done">',
    '      <p id="doneMsg">Download complete.</p>',
    '      <button class="close-btn" id="closeBtn">Close window</button>',
    '    </div>',
    '  </div>',
    '</div>',
    '<script>',
    '  window.CONFIG = JSON.parse(decodeURIComponent(escape(atob("' + configB64 + '"))));',
    '',
    '  function setTitle(t) { document.getElementById("title").textContent = t; }',
    '  function setDetail(t) { document.getElementById("detail").textContent = t; }',
    '  function log(t) {',
    '    const el = document.getElementById("log");',
    '    const line = document.createElement("div");',
    '    line.textContent = t;',
    '    el.appendChild(line);',
    '    el.scrollTop = el.scrollHeight;',
    '  }',
    '  function showError(msg) {',
    '    document.getElementById("spinner").style.display = "none";',
    '    const errEl = document.getElementById("error");',
    '    errEl.style.display = "flex";',
    '    errEl.textContent = msg;',
    '    setTitle("Export failed");',
    '  }',
    '  function showDone(msg) {',
    '    document.getElementById("spinner").style.display = "none";',
    '    document.getElementById("done").style.display = "flex";',
    '    document.getElementById("doneMsg").textContent = msg;',
    '  }',
    '  document.getElementById("closeBtn").addEventListener("click", function () { window.close(); });',
    '</' + 'script>',
    '',
    /*
     * gdal3.js and JSZip are Emscripten/UMD "global" browser builds, not real
     * ES modules - jsDelivr's "+esm" auto-conversion of these does not work
     * reliably (the wasm loader relies on script-relative self-location that
     * the ESM-wrapper breaks), which is why the previous version silently
     * did nothing. Loading them as plain <script src> tags, exactly as the
     * gdal3.js docs recommend, is what actually works in a browser.
     */
    '<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" onerror="showError(\'Failed to load JSZip from the CDN. Check your internet connection and try again.\')"></' + 'script>',
    '<script src="https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package/gdal3.js" onerror="showError(\'Failed to load GDAL WebAssembly from the CDN. Check your internet connection and try again.\')"></' + 'script>',
    '',
    '<script>',
    '  function baseUrl(serviceUrl) { return serviceUrl.replace(/\\/+$/, ""); }',
    '',
    '  async function fetchObjectIds(serviceUrl) {',
    '    const base = baseUrl(serviceUrl);',
    '    const res = await fetch(`${base}/query?where=1%3D1&returnIdsOnly=true&f=json`);',
    '    if (!res.ok) throw new Error(`Failed to fetch object IDs (HTTP ${res.status}) from ${base}/query`);',
    '    const data = await res.json();',
    '    if (data.error) throw new Error(data.error.message || "ArcGIS error fetching object IDs.");',
    '    return data.objectIds || [];',
    '  }',
    '',
    '  async function fetchFeaturesBatch(serviceUrl, ids, onProgress) {',
    '    const base = baseUrl(serviceUrl);',
    '    const chunkSize = 1000;',
    '    const chunks = [];',
    '    for (let i = 0; i < ids.length; i += chunkSize) chunks.push(ids.slice(i, i + chunkSize));',
    '    const allFeatures = [];',
    '    for (let i = 0; i < chunks.length; i++) {',
    '      onProgress(i + 1, chunks.length);',
    '      // POST (not GET) - a GET query string with hundreds/thousands of',
    '      // comma-separated objectIds can exceed URL-length limits enforced',
    '      // by many ArcGIS Server proxies/WAFs, which show up as a plain 404.',
    '      const body = new URLSearchParams();',
    '      body.set("objectIds", chunks[i].join(","));',
    '      body.set("outFields", "*");',
    '      body.set("returnGeometry", "true");',
    '      body.set("f", "geojson");',
    '      const res = await fetch(`${base}/query`, {',
    '        method: "POST",',
    '        headers: { "Content-Type": "application/x-www-form-urlencoded" },',
    '        body: body.toString(),',
    '      });',
    '      if (!res.ok) throw new Error(`Failed to fetch features (chunk ${i + 1}/${chunks.length}, HTTP ${res.status}) from ${base}/query`);',
    '      const data = await res.json();',
    '      if (data.error) throw new Error(data.error.message || "ArcGIS error fetching features.");',
    '      if (data.features) allFeatures.push(...data.features);',
    '    }',
    '    return allFeatures;',
    '  }',
    '',
    '  async function run() {',
    '    try {',
    '      const layers = window.CONFIG.layers;',
    '      const format = window.CONFIG.format;',
    '',
    '      setTitle("Validating layer endpoints...");',
    '      for (const layer of layers) {',
    '        setDetail(`Checking connection to ${layer.name}...`);',
    '        const res = await fetch(`${baseUrl(layer.url)}?f=pjson`);',
    '        if (!res.ok) throw new Error(`Cannot reach "${layer.name}" (HTTP ${res.status}).`);',
    '        const meta = await res.json();',
    '        if (meta.error) throw new Error(meta.error.message || `ArcGIS service error for "${layer.name}".`);',
    '      }',
    '',
    '      setTitle("Initializing download engine...");',
    '      setDetail("Loading GDAL WebAssembly environment from CDN...");',
    '      if (typeof window.JSZip !== "function") throw new Error("JSZip did not load from the CDN.");',
    '      if (typeof window.initGdalJs !== "function") throw new Error("GDAL WebAssembly did not load from the CDN.");',
    '      const JSZip = window.JSZip;',
    '      const gdal = await window.initGdalJs({',
    '        path: "https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package",',
    '        useWorker: false,',
    '      });',
    '',
    '      const mainZip = new JSZip();',
    '      const layerDatasets = [];',
    '',
    '      for (let i = 0; i < layers.length; i++) {',
    '        const layer = layers[i];',
    '        const safeName = layer.name.replace(/[^a-zA-Z0-9_-]/g, "_");',
    '',
    '        setTitle(`Layer ${i + 1} of ${layers.length}: ${layer.name}`);',
    '        setDetail("Fetching Object IDs from FeatureServer...");',
    '        const ids = await fetchObjectIds(layer.url);',
    '        if (!ids || ids.length === 0) throw new Error(`No features or Object IDs returned for layer "${layer.name}".`);',
    '        log(`${layer.name}: ${ids.length.toLocaleString()} features found.`);',
    '',
    '        const features = await fetchFeaturesBatch(layer.url, ids, (chunkIndex, totalChunks) => {',
    '          setDetail(`Downloading features: chunk ${chunkIndex} / ${totalChunks}`);',
    '        });',
    '        if (!features || features.length === 0) throw new Error(`Failed to retrieve feature records for layer "${layer.name}".`);',
    '        log(`${layer.name}: ready for conversion.`);',
    '',
    '        // gdal3.js v2.x has no gdal.FS - files are opened by handing GDAL',
    '        // a real File/Blob object via Gdal.open(), which returns',
    '        // { datasets: [...] }.',
    '        const fc = { type: "FeatureCollection", features };',
    '        const rawBytes = new TextEncoder().encode(JSON.stringify(fc));',
    '        const geojsonFile = new File([rawBytes], `${safeName}.geojson`, { type: "application/geo+json" });',
    '',
    '        const openResult = await gdal.open(geojsonFile);',
    '        if (!openResult || !openResult.datasets || openResult.datasets.length === 0) {',
    '          throw new Error(`GDAL could not open the downloaded data for layer "${layer.name}".`);',
    '        }',
    '        layerDatasets.push({ name: safeName, dataset: openResult.datasets[0] });',
    '      }',
    '',
    '      let blob, filename;',
    '',
    '      if (format === "gpkg") {',
    '        setTitle("Creating GeoPackage...");',
    '        setDetail("Converting layers into a single .gpkg container...");',
    '        let gpkgPath = null;',
    '        for (let j = 0; j < layerDatasets.length; j++) {',
    '          const item = layerDatasets[j];',
    '          const options = j === 0',
    '            ? ["-f", "GPKG", "-nln", item.name]',
    '            : ["-update", "-append", "-f", "GPKG", "-nln", item.name];',
    '          setDetail(j === 0 ? `Creating GeoPackage with ${item.name}...` : `Appending ${item.name} to GeoPackage...`);',
    '          gpkgPath = await gdal.ogr2ogr(item.dataset, options, "download");',
    '        }',
    '        if (!gpkgPath) throw new Error("GeoPackage generation resulted in empty output.");',
    '        setDetail("Finalizing GeoPackage download...");',
    '        const finalBuffer = await gdal.getFileBytes(gpkgPath);',
    '        blob = new Blob([finalBuffer], { type: "application/x-sqlite3" });',
    '        filename = "download.gpkg";',
    '      } else if (format === "shp") {',
    '        setTitle("Creating ESRI Shapefiles...");',
    '        for (let k = 0; k < layerDatasets.length; k++) {',
    '          const item = layerDatasets[k];',
    '          setDetail(`Converting ${item.name} to Shapefile (${k + 1}/${layerDatasets.length})...`);',
    '          await gdal.ogr2ogr(item.dataset, ["-f", "ESRI Shapefile"], item.name);',
    '        }',
    '        setDetail("Collecting Shapefile components...");',
    '        const outputFiles = await gdal.getOutputFiles();',
    '        for (const fileInfo of outputFiles) {',
    '          const fileName = fileInfo.path.split("/").pop();',
    '          const belongsToLayer = layerDatasets.some((item) => fileName.indexOf(item.name) === 0);',
    '          if (belongsToLayer) {',
    '            const fileBytes = await gdal.getFileBytes(fileInfo.path);',
    '            mainZip.file(fileName, fileBytes);',
    '          }',
    '        }',
    '        setDetail("Compressing Shapefiles into ZIP archive...");',
    '        blob = await mainZip.generateAsync({ type: "blob" });',
    '        filename = "download.zip";',
    '      } else {',
    '        setTitle(`Converting to ${format.toUpperCase()}...`);',
    '        const driverMap = { geojson: "GeoJSON", csv: "CSV", kml: "KML", gpx: "GPX" };',
    '        const driver = driverMap[format] || "GeoJSON";',
    '        for (let m = 0; m < layerDatasets.length; m++) {',
    '          const item = layerDatasets[m];',
    '          setDetail(`Processing ${item.name} (${m + 1}/${layerDatasets.length})...`);',
    '          const outPath = await gdal.ogr2ogr(item.dataset, ["-f", driver], item.name);',
    '          const fileBytes = await gdal.getFileBytes(outPath);',
    '          mainZip.file(outPath.split("/").pop(), fileBytes);',
    '        }',
    '        setDetail("Compressing archive files...");',
    '        blob = await mainZip.generateAsync({ type: "blob" });',
    '        filename = `gis_bulk_export_${format}.zip`;',
    '      }',
    '',
    '      for (const item of layerDatasets) {',
    '        try { await gdal.close(item.dataset); } catch (e) {}',
    '      }',
    '',
    '      setTitle("Starting download...");',
    '      const link = document.createElement("a");',
    '      link.href = URL.createObjectURL(blob);',
    '      link.download = filename;',
    '      document.body.appendChild(link);',
    '      link.click();',
    '      link.remove();',
    '',
    '      showDone(`${filename} has been saved to your downloads.`);',
    '    } catch (err) {',
    '      console.error("Export error:", err);',
    '      showError((err && err.message) || "Failed to complete export pipeline.");',
    '    }',
    '  }',
    '',
    '  run();',
    '</' + 'script>',
    '',
    '</body>',
    '</html>',
  ];

  return lines.join('\n');
}