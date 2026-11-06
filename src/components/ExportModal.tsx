import React, { useState } from 'react';
import { X, Download, AlertCircle, ExternalLink } from 'lucide-react';
import { useIsMobile } from '../hooks/useMediaQuery';

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

const FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: 'gpkg', label: 'GeoPackage (.gpkg) - Multi-layer container' },
  { value: 'shp', label: 'ESRI Shapefile (.zip) - Separate dataset archive' },
  { value: 'geojson', label: 'GeoJSON (.geojson)' },
  { value: 'csv', label: 'CSV Spreadsheet (.csv)' },
  { value: 'kml', label: 'Google Earth KML (.kml)' },
  { value: 'gpx', label: 'GPS Exchange Format (.gpx)' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ layers, onClose }) => {
  const isMobile = useIsMobile();
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(
    layers.map((l) => l.id)
  );
  const [format, setFormat] = useState<string>('gpkg');
  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState<boolean>(false);

  const toggleSelectAll = () => {
    if (selectedLayerIds.length === layers.length) {
      setSelectedLayerIds([]);
    } else {
      setSelectedLayerIds(layers.map((l) => l.id));
    }
  };

  const toggleLayer = (id: string) => {
    setSelectedLayerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStartExport = () => {
    if (selectedLayerIds.length === 0) {
      setError('Please select at least one layer to export.');
      return;
    }

    const targetLayers = layers.filter((l) => selectedLayerIds.includes(l.id));

    for (const layer of targetLayers) {
      if (!layer.url || layer.url.includes('example.com')) {
        setError(
          `Layer "${layer.name}" has an invalid or placeholder service URL.`
        );
        return;
      }
    }

    setError(null);
    setLaunching(true);

    // Open popup synchronously to avoid mobile browser popup blockers
    const popup = openExportWindow(
      targetLayers.map((l) => ({ name: l.name, url: l.url })),
      format
    );

    if (!popup) {
      setLaunching(false);
      setError(
        'Your browser blocked the download window. Please allow pop-ups for this site and click "Start Download" again.'
      );
      return;
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: isMobile ? 0 : '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#111827',
          border: '1px solid var(--border-color)',
          borderRadius: isMobile ? '1rem 1rem 0 0' : '0.5rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: isMobile ? '90vh' : '85vh',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f3f4f6',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Download
              style={{
                width: '1.125rem',
                height: '1.125rem',
                color: 'var(--accent-color)',
              }}
            />
            Bulk Export Layers
          </h3>
          <button
            onClick={onClose}
            disabled={launching}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#1f2937',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                color: '#f3f4f6',
                fontSize: '0.85rem',
              }}
            >
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
              }}
            >
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Select Layers ({selectedLayerIds.length} of {layers.length})
              </label>
              <button
                type="button"
                onClick={toggleSelectAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-color)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {selectedLayerIds.length === layers.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: '#1f2937',
              }}
            >
              {layers.map((layer) => (
                <label
                  key={layer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedLayerIds.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    style={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
                  />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {layer.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.7rem',
              color: '#9ca3af',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              padding: '0.5rem 0.6rem',
              borderRadius: '0.375rem',
            }}
          >
            <ExternalLink
              style={{
                width: '0.9rem',
                height: '0.9rem',
                flexShrink: 0,
                marginTop: '0.1rem',
              }}
            />
            <span>
              Downloads open in a separate window and run independently — the
              map and dashboard stay fully interactive while the export is in
              progress.
            </span>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '0.5rem',
                borderRadius: '0.375rem',
              }}
            >
              <AlertCircle
                style={{ width: '1rem', height: '1rem', flexShrink: 0 }}
              />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#1f2937',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            disabled={launching}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: '#d1d5db',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleStartExport}
            disabled={launching}
            className="btn-primary"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              opacity: launching ? 0.7 : 1,
              flex: 2,
            }}
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

function openExportWindow(
  exportLayers: ExportLayerConfig[],
  format: string
): Window | null {
  const popup = window.open(
    '',
    `gdd_export_${Date.now()}`,
    'width=520,height=680,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
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

function buildExportDocument(
  exportLayers: ExportLayerConfig[],
  format: string
): string {
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
    '<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" onerror="showError(\'Failed to load JSZip from the CDN. Check your internet connection and try again.\')"></' + 'script>',
    '<script src="https://cdn.jsdelivr.net/npm/@terraformer/arcgis@2.1.2/dist/t-arcgis.umd.js" onerror="showError(\'Failed to load the Esri JSON converter from the CDN. Check your internet connection and try again.\')"></' + 'script>',
    '<script src="https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package/gdal3.js" onerror="showError(\'Failed to load GDAL WebAssembly from the CDN. Check your internet connection and try again.\')"></' + 'script>',
    '',
    '<script>',
    '  function baseUrl(serviceUrl) {',
    '    return String(serviceUrl || "").trim().split("#")[0].split("?")[0].replace(/\\/query\\/?$/i, "").replace(/\\/+$/, "");',
    '  }',
    '',
    '  var PAGE_SIZE = 200;',
    '  var CONCURRENCY = 6;',
    '',
    '  function describeError(err) {',
    '    if (!err) return "Unknown ArcGIS error";',
    '    if (typeof err === "string") return err;',
    '    var details = Array.isArray(err.details) && err.details.length ? " (" + err.details.join("; ") + ")" : "";',
    '    return (err.message || "ArcGIS server error") + (err.code ? " [code " + err.code + "]" : "") + details;',
    '  }',
    '',
    '  // Same transport rule as the ArcGIS JS SDK: GET when short, form-encoded POST when long.',
    '  async function arcgisRequest(url, params) {',
    '    let lastErr = null;',
    '    for (let attempt = 0; attempt <= 3; attempt++) {',
    '      if (attempt > 0) await new Promise(function (r) { setTimeout(r, 400 * Math.pow(2, attempt - 1) + Math.random() * 200); });',
    '      try { return await arcgisRequestOnce(url, params); }',
    '      catch (e) { lastErr = e; if (!(e && e.transient) && !(e instanceof TypeError)) throw e; }',
    '    }',
    '    throw lastErr;',
    '  }',
    '',
    '  async function arcgisRequestOnce(url, params) {',
    '    const body = new URLSearchParams(Object.assign({}, params, { f: "json" }));',
    '    const getUrl = url + "?" + body.toString();',
    '    const res = getUrl.length < 2000',
    '      ? await fetch(getUrl)',
    '      : await fetch(url, {',
    '          method: "POST",',
    '          headers: { "Content-Type": "application/x-www-form-urlencoded" },',
    '          body: body.toString(),',
    '        });',
    '    if (!res.ok) { const he = new Error("HTTP " + res.status + " " + res.statusText + " from " + url); he.transient = res.status === 429 || res.status >= 500; throw he; }',
    '    const json = await res.json();',
    '    if (json && json.error) throw new Error(describeError(json.error));',
    '    return json;',
    '  }',
    '',
    '  async function fetchObjectIds(serviceUrl) {',
    '    const data = await arcgisRequest(baseUrl(serviceUrl) + "/query", { where: "1=1", returnIdsOnly: "true" });',
    '    return data.objectIds || [];',
    '  }',
    '',
    '  async function fetchLayerInfo(serviceUrl) {',
    '    const meta = await arcgisRequest(baseUrl(serviceUrl), {});',
    '    const fieldTypes = {};',
    '    let oidField = null;',
    '    (meta.fields || []).forEach(function (f) {',
    '      if (f && f.name && f.type) {',
    '        fieldTypes[f.name] = f.type;',
    '        if (!oidField && f.type === "esriFieldTypeOID") oidField = f.name;',
    '      }',
    '    });',
    '    return { fieldTypes: fieldTypes, oidField: oidField || meta.objectIdField || "OBJECTID" };',
    '  }',
    '',
    '  function hasValidGeometry(f) {',
    '    const g = f && f.geometry;',
    '    if (!g) return false;',
    '    if (g.rings) return g.rings.every(function (r) { return r && r.length > 1; });',
    '    if (g.paths) return g.paths.every(function (p) { return p && p.length > 0; });',
    '    if (g.points) return g.points.length > 0;',
    '    return g.x !== undefined && g.y !== undefined;',
    '  }',
    '',
    '  // One page of Esri JSON features. Mirrors geodatadownloader: where OID IN (...), f=json, outSR=4326.',
    '  async function queryPage(base, oidField, ids) {',
    '    const common = { outFields: "*", returnGeometry: "true", outSR: "4326" };',
    '    const attempts = [',
    '      Object.assign({}, common, { where: oidField + " IN (" + ids.join(",") + ")" }),',
    '      Object.assign({}, common, { objectIds: ids.join(",") }),',
    '    ];',
    '    let lastError = null;',
    '    for (const params of attempts) {',
    '      try {',
    '        const data = await arcgisRequest(base + "/query", params);',
    '        return data.features || [];',
    '      } catch (e) {',
    '        lastError = e;',
    '      }',
    '    }',
    '    if (ids.length > 1) {',
    '      const mid = Math.ceil(ids.length / 2);',
    '      const left = await queryPage(base, oidField, ids.slice(0, mid));',
    '      const right = await queryPage(base, oidField, ids.slice(mid));',
    '      return left.concat(right);',
    '    }',
    '    throw new Error("Query failed for feature " + oidField + "=" + ids[0] + ": " + (lastError && lastError.message));',
    '  }',
    '',
    '  async function fetchFeaturesBatch(serviceUrl, ids, oidField, onProgress) {',
    '    const base = baseUrl(serviceUrl);',
    '    const pages = [];',
    '    for (let i = 0; i < ids.length; i += PAGE_SIZE) pages.push(ids.slice(i, i + PAGE_SIZE));',
    '    const results = new Array(pages.length);',
    '    let next = 0;',
    '    let done = 0;',
    '    async function worker() {',
    '      while (true) {',
    '        const i = next++;',
    '        if (i >= pages.length) return;',
    '        const esriFeatures = (await queryPage(base, oidField, pages[i])).filter(hasValidGeometry);',
    '        const fc = window.Terraformer.arcgisToGeoJSON({ features: esriFeatures, spatialReference: { wkid: 4326 } });',
    '        results[i] = fc.features || [];',
    '        done++;',
    '        onProgress(done, pages.length);',
    '      }',
    '    }',
    '    const workers = [];',
    '    for (let w = 0; w < Math.min(CONCURRENCY, pages.length); w++) workers.push(worker());',
    '    await Promise.all(workers);',
    '    return [].concat.apply([], results);',
    '  }',
    '',
    '  function applyDateFormatting(features, fieldTypes) {',
    '    return features.map(function (f) {',
    '      const props = f.properties || f.attributes;',
    '      if (!props) return f;',
    '      Object.keys(props).forEach(function (k) {',
    '        if (fieldTypes[k] === "esriFieldTypeDate" && typeof props[k] === "number") {',
    '          const d = new Date(props[k]);',
    '          if (!isNaN(d.getTime())) props[k] = d.toISOString();',
    '        }',
    '      });',
    '      return f;',
    '    });',
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
    '      if (!window.Terraformer || typeof window.Terraformer.arcgisToGeoJSON !== "function") throw new Error("Esri JSON converter did not load from the CDN.");',
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
    '',
    '        setDetail("Reading field metadata...");',
    '        const layerInfo = await fetchLayerInfo(layer.url);',
    '        const fieldTypes = layerInfo.fieldTypes;',
    '',
    '        setDetail("Fetching Object IDs from FeatureServer...");',
    '        const ids = await fetchObjectIds(layer.url);',
    '        if (!ids || ids.length === 0) throw new Error(`No features or Object IDs returned for layer "${layer.name}".`);',
    '        log(`${layer.name}: ${ids.length.toLocaleString()} features found.`);',
    '',
    '        const rawFeatures = await fetchFeaturesBatch(layer.url, ids, layerInfo.oidField, (chunkIndex, totalChunks) => {',
    '          setDetail(`Downloading features: chunk ${chunkIndex} / ${totalChunks}`);',
    '        });',
    '        if (!rawFeatures || rawFeatures.length === 0) throw new Error(`Failed to retrieve feature records for layer "${layer.name}".`);',
    '        const features = applyDateFormatting(rawFeatures, fieldTypes);',
    '        log(`${layer.name}: ready for conversion.`);',
    '',
    '        const fc = { type: "FeatureCollection", features: features };',
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
    '      async function collectLayerOutputFiles(zipInstance) {',
    '        const outputFiles = await gdal.getOutputFiles();',
    '        for (const fileInfo of outputFiles) {',
    '          const fileName = fileInfo.path.split("/").pop();',
    '          const belongsToLayer = layerDatasets.some(function (item) {',
    '            return fileName.indexOf(item.name) === 0;',
    '          });',
    '          if (belongsToLayer) {',
    '            const fileBytes = await gdal.getFileBytes(fileInfo.path);',
    '            zipInstance.file(fileName, fileBytes);',
    '          }',
    '        }',
    '      }',
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
    '        await collectLayerOutputFiles(mainZip);',
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
    '          const options = ["-f", driver];',
    '          if (driver === "CSV") {',
    '            options.push("-lco", "GEOMETRY=AS_WKT");',
    '          }',
    '          await gdal.ogr2ogr(item.dataset, options, item.name);',
    '        }',
    '        setDetail("Collecting output files...");',
    '        await collectLayerOutputFiles(mainZip);',
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
    '      document.body.removeChild(link);',
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