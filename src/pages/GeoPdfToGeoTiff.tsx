import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, Download, Info, ShieldCheck } from 'lucide-react';
import { SEO, buildBreadcrumbSchema, buildFaqSchema } from '../components/SEO';
import { articleStyle, h1Style, sectionStyle, h2Style, ulStyle, linkStyle } from './Privacy';
import { parseGeoPdf, GeoPdfError, type GeoPdfInfo } from '../services/geopdf/parse';
import { convertViewport, maxDpiFor, outputSize, type ConvertResult } from '../services/geopdf/convert';

const DPI_CHOICES = [72, 150, 300, 600];
const label: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' };

const FAQS = [
  { q: 'What is a GeoPDF?', a: 'A GeoPDF is a PDF map that also stores where on Earth it sits: the coordinate system and a set of control points. ArcGIS Pro, ArcMap, QGIS and GDAL can all export them.' },
  { q: 'Does the GeoTIFF keep the same projection as the PDF?', a: 'Yes. The coordinate system written in the PDF (for example Albers, UTM or State Plane) is copied into the GeoTIFF, and the image is positioned using the PDF\'s own control points.' },
  { q: 'Is my PDF uploaded anywhere?', a: 'No. The PDF is read and drawn inside your browser. Nothing is sent to a server.' },
  { q: 'Why is the GeoTIFF a picture and not the original data?', a: 'A GeoPDF is a drawing of a map, so the GeoTIFF is an image of that drawing, positioned on the ground. Vector data such as lines and polygons is not rebuilt.' },
];

export const GeoPdfToGeoTiff: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [info, setInfo] = useState<GeoPdfInfo | null>(null);
  const [vpId, setVpId] = useState('');
  const [dpi, setDpi] = useState(150);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const reset = () => {
    setInfo(null); setBytes(null); setResult(null); setError(''); setVpId('');
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  };

  const load = async (f: File) => {
    reset();
    setFile(f);
    setBusy('Reading georeferencing…');
    try {
      const buf = await f.arrayBuffer();
      const gi = await parseGeoPdf(buf);
      setBytes(buf);
      setInfo(gi);
      setVpId(gi.viewports[0].id);
    } catch (e: any) {
      setError(e instanceof GeoPdfError ? e.message : 'This file could not be read as a PDF.');
    } finally {
      setBusy('');
    }
  };

  const vp = info?.viewports.find((v) => v.id === vpId);
  const cap = vp ? maxDpiFor(vp) : 600;
  const effDpi = Math.min(dpi, cap);
  const size = vp ? outputSize(vp, effDpi) : null;

  const run = async () => {
    if (!bytes || !vp) return;
    setError(''); setResult(null);
    if (downloadUrl) { URL.revokeObjectURL(downloadUrl); setDownloadUrl(''); }
    try {
      const r = await convertViewport(bytes, vp, { dpi: effDpi, onStatus: setBusy });
      setResult(r);
      setDownloadUrl(URL.createObjectURL(r.blob));
    } catch (e: any) {
      setError(e?.message || 'Conversion failed.');
    } finally {
      setBusy('');
    }
  };

  const base = (file?.name || 'map').replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const outName = `${base}${info && info.viewports.length > 1 && vp ? '_' + vp.name.replace(/[^a-zA-Z0-9_-]+/g, '_') : ''}.tif`;
  const g = result?.georef;
  const fmt = (n: number) => (g?.isGeographic ? n.toFixed(6) : n.toFixed(2));

  return (
    <>
      <SEO
        title="GeoPDF to GeoTIFF Converter — Free, Online"
        description="Convert a GeoPDF to a GeoTIFF in your browser. Keeps the PDF's projection and position. Free, private, no upload, no software to install."
        keywords="GeoPDF to GeoTIFF, convert GeoPDF to GeoTIFF, GeoPDF converter, PDF to GeoTIFF, georeferenced PDF to TIFF, ArcGIS PDF to GeoTIFF, GeoPDF online"
        path="/geopdf-to-geotiff"
        structuredData={[
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'GeoPDF to GeoTIFF', path: '/geopdf-to-geotiff' }]),
          buildFaqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <div style={articleStyle}>
        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ ...h1Style, marginBottom: '0.75rem' }}>GeoPDF to GeoTIFF Converter</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Turn a georeferenced PDF map into a GeoTIFF that sits in the same place and uses the same projection.
            Everything happens in your browser, so your PDF is never uploaded.
          </p>
        </header>

        <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) load(f); }}
            style={{ border: '2px dashed var(--border-color)', borderRadius: '0.5rem', padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: file ? 'var(--accent-soft)' : 'var(--bg-hover)' }}
          >
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); e.target.value = ''; }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {file ? <FileType style={{ width: '2.5rem', height: '2.5rem', color: 'var(--accent-color)' }} /> : <UploadCloud style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-muted)' }} />}
              <span style={{ fontWeight: 600, color: 'var(--text-main)', overflowWrap: 'anywhere' }}>{file ? file.name : 'Click or drag a GeoPDF here'}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF maps exported from ArcGIS Pro, ArcMap, QGIS or GDAL'}
              </span>
            </div>
          </div>

          {busy && !result && (
            <p role="status" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} /> {busy}
            </p>
          )}

          {info && vp && (
            <div style={{ marginTop: '1.5rem' }}>
              {info.viewports.length > 1 && (
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="gp-vp" style={label}>Map area ({info.viewports.length} found)</label>
                  <select id="gp-vp" className="form-input" value={vpId} onChange={(e) => { setVpId(e.target.value); setResult(null); }}>
                    {info.viewports.map((v) => <option key={v.id} value={v.id}>{v.name}{info.pageCount > 1 ? ` (page ${v.pageIndex + 1})` : ''}</option>)}
                  </select>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                    This PDF holds several georeferenced maps (for example insets). Each one is saved as its own GeoTIFF.
                  </p>
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="gp-dpi" style={label}>Resolution</label>
                <select id="gp-dpi" className="form-input" value={effDpi} onChange={(e) => { setDpi(Number(e.target.value)); setResult(null); }}>
                  {Array.from(new Set([...DPI_CHOICES.filter((d) => d <= cap), cap])).sort((a, b) => a - b).map((d) => (
                    <option key={d} value={d}>{d} DPI{d === cap && !DPI_CHOICES.includes(d) ? ' (maximum)' : ''}</option>
                  ))}
                </select>
                {size && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Output: {size.width.toLocaleString()} × {size.height.toLocaleString()} pixels ({((size.width * size.height) / 1e6).toFixed(1)} MP).
                    Higher DPI gives sharper text and finer detail but a larger file.
                  </p>
                )}
              </div>
              <button onClick={run} disabled={!!busy} className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                {busy ? (<><Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} /> {busy}</>) : 'Convert to GeoTIFF'}
              </button>
            </div>
          )}

          {error && (
            <div role="alert" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--danger-soft)', color: 'var(--danger-color)', borderRadius: '0.375rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>{error}</div>
            </div>
          )}

          {result && g && downloadUrl && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success-color)', borderRadius: '0.375rem', textAlign: 'center' }}>
                <CheckCircle style={{ width: '2rem', height: '2rem', color: 'var(--success-color)', margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: 600, color: 'var(--success-color)', marginBottom: '1rem' }}>GeoTIFF ready — {(result.blob.size / 1024 / 1024).toFixed(1)} MB</p>
                <a href={downloadUrl} download={outName} className="btn-primary" style={{ display: 'inline-flex', backgroundColor: 'var(--success-color)' }}>
                  <Download style={{ width: '1rem', height: '1rem' }} /> Download GeoTIFF
                </a>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.75rem 0 0', overflowWrap: 'anywhere' }}>{outName}</p>
              </div>
              <img src={result.previewUrl} alt="Preview of the converted map" style={{ width: '100%', height: 'auto', marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }} />
              <dl style={{ marginTop: '1rem', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-main)', display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.25rem 0.75rem' }}>
                <dt style={{ color: 'var(--text-muted)' }}>Projection</dt>
                <dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{(g.wkt.match(/^(?:PROJCS|GEOGCS)\["([^"]+)"/) || [])[1] || g.wkt}</dd>
                <dt style={{ color: 'var(--text-muted)' }}>Pixel size</dt>
                <dd style={{ margin: 0 }}>{g.pixelSize[0].toPrecision(5)} {g.isGeographic ? 'degrees' : 'metres'}</dd>
                <dt style={{ color: 'var(--text-muted)' }}>Extent X</dt>
                <dd style={{ margin: 0 }}>{fmt(g.bounds[0])} to {fmt(g.bounds[2])}</dd>
                <dt style={{ color: 'var(--text-muted)' }}>Extent Y</dt>
                <dd style={{ margin: 0 }}>{fmt(g.bounds[1])} to {fmt(g.bounds[3])}</dd>
                <dt style={{ color: 'var(--text-muted)' }}>Position check</dt>
                <dd style={{ margin: 0 }}>{g.maxResidualPx < 1 ? `Control points agree to within ${Math.max(g.maxResidualPx, 0.01).toFixed(2)} px` : `Control points differ by up to ${g.maxResidualPx.toFixed(1)} px, so check the result in your GIS`}</dd>
              </dl>
              {g.maxResidualPx >= 1 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--danger-color)' }}>This PDF&apos;s map frame is slightly distorted, so the fit is approximate.</p>
              )}
              {!g.northUp && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This map was rotated in the PDF, so it was resampled to north-up.</p>
              )}
              <button type="button" onClick={() => setShowInfo((s) => !s)} className="btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                {showInfo ? 'Hide' : 'Show'} GDAL details
              </button>
              {showInfo && <pre style={{ fontSize: '0.7rem', maxHeight: '18rem', overflow: 'auto', marginTop: '0.5rem' }}>{result.info}</pre>}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }} />
            <span>Your file stays on your device. Very large pages are limited to about 60 megapixels so your browser does not run out of memory.</span>
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '4rem auto 0 auto' }}>
          <section style={sectionStyle}>
            <h2 style={h2Style}>How to convert a GeoPDF to a GeoTIFF</h2>
            <ol style={{ ...ulStyle, paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
              <li>Upload a PDF map that was exported with georeferencing on.</li>
              <li>If the PDF has several map areas (such as Alaska and Hawaii insets), pick one.</li>
              <li>Choose a resolution. 150 DPI is a good start; use 300 DPI or more for fine detail.</li>
              <li>Click <strong>Convert to GeoTIFF</strong> and download the file. Open it in ArcGIS, QGIS or any GIS and it lines up with your other layers.</li>
            </ol>
          </section>
          <section style={sectionStyle}>
            <h2 style={h2Style}>What is kept, and what is not</h2>
            <ul style={ulStyle}>
              <li><strong>Kept:</strong> the coordinate system (for example Albers Equal Area, UTM, State Plane) and the exact placement from the PDF&apos;s control points.</li>
              <li><strong>Not kept:</strong> vector layers, text search and PDF layers. The GeoTIFF is a picture of the map. If you need the data itself, use the <Link to="/download" style={linkStyle}>Downloader</Link> or the <Link to="/converter" style={linkStyle}>vector converter</Link>.</li>
              <li><strong>Not supported:</strong> scanned PDFs without georeferencing, and the older TerraGo style of GeoPDF.</li>
            </ul>
          </section>
          <section style={sectionStyle}>
            <h2 style={h2Style}>Frequently asked questions</h2>
            {FAQS.map((f) => (
              <div key={f.q} style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{f.q}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-main)', margin: 0 }}>{f.a}</p>
              </div>
            ))}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem' }}>
              <Info style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0, marginTop: '0.2rem' }} />
              Always check the result against a known layer in your GIS before relying on it for survey-grade work.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
