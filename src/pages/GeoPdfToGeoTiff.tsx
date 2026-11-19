import React, { useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Link } from 'react-router-dom';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, Download, Info, ShieldCheck, Package, XCircle } from 'lucide-react';
import { SEO, buildBreadcrumbSchema, buildFaqSchema } from '../components/SEO';
import { articleStyle, h1Style, sectionStyle, h2Style, ulStyle, linkStyle } from './Privacy';
import { parseGeoPdf, GeoPdfError, type GeoPdfInfo, type GeoViewport } from '../services/geopdf/parse';
import { convertViewport, openPdf, maxDpiFor, outputSize, type ConvertResult } from '../services/geopdf/convert';

const DPI_CHOICES = [72, 150, 300, 600];
const label: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' };

const FAQS = [
  { q: 'What is a GeoPDF?', a: 'A GeoPDF is a PDF map that also stores where on Earth it sits: the coordinate system and a set of control points. ArcGIS Pro, ArcMap, QGIS and GDAL can all export them.' },
  { q: 'Does the GeoTIFF keep the same projection as the PDF?', a: 'Yes. The coordinate system written in the PDF (for example Albers, UTM or State Plane) is copied into the GeoTIFF, and the image is positioned using the PDF\'s own control points.' },
  { q: 'Can I convert a PDF with many pages and insets at once?', a: 'Yes. The tool lists every page and every inset map it finds. Tick the ones you want, or keep them all ticked, and it converts them one after another, page by page, then offers each GeoTIFF separately or all together in one ZIP.' },
  { q: 'Is my PDF uploaded anywhere?', a: 'No. The PDF is read and drawn inside your browser. Nothing is sent to a server.' },
  { q: 'Why is the GeoTIFF a picture and not the original data?', a: 'A GeoPDF is a drawing of a map, so the GeoTIFF is an image of that drawing, positioned on the ground. Vector data such as lines and polygons is not rebuilt.' },
];

type ItemState = { id: string; status: 'queued' | 'working' | 'done' | 'error' | 'cancelled'; name: string; label: string; result?: ConvertResult; url?: string; error?: string };

export const GeoPdfToGeoTiff: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [info, setInfo] = useState<GeoPdfInfo | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dpi, setDpi] = useState(150);
  const [busy, setBusy] = useState('');
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<ItemState[]>([]);
  const [zipBusy, setZipBusy] = useState(false);

  const revokeAll = (list: ItemState[]) => list.forEach((i) => i.url && URL.revokeObjectURL(i.url));
  const reset = () => {
    abortRef.current?.abort();
    revokeAll(items);
    setItems([]); setInfo(null); setBytes(null); setError(''); setSelected(new Set());
  };

  const load = async (f: File) => {
    reset();
    setFile(f);
    setReading(true);
    try {
      const buf = await f.arrayBuffer();
      const gi = await parseGeoPdf(buf);
      setBytes(buf);
      setInfo(gi);
      setSelected(new Set(gi.viewports.map((v) => v.id)));
    } catch (e: any) {
      setError(e instanceof GeoPdfError ? e.message : 'This file could not be read as a PDF.');
    } finally {
      setReading(false);
    }
  };

  // Group maps by page, in page order, and note pages with no georeferencing
  const pages = useMemo(() => {
    if (!info) return [];
    return Array.from({ length: info.pageCount }, (_, i) => ({ index: i, maps: info.viewports.filter((v) => v.pageIndex === i) }));
  }, [info]);

  const effDpiFor = (vp: GeoViewport) => Math.min(dpi, maxDpiFor(vp));
  const selectedMaps = info ? info.viewports.filter((v) => selected.has(v.id)) : [];
  const totalMp = selectedMaps.reduce((a, v) => { const z = outputSize(v, effDpiFor(v)); return a + (z.width * z.height) / 1e6; }, 0);
  const globalCap = info ? Math.min(...info.viewports.map(maxDpiFor)) : 600;
  const running = !!busy;

  const toggle = (ids: string[], on: boolean) => setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => (on ? n.add(id) : n.delete(id))); return n; });

  const base = (file?.name || 'map').replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const nameFor = (vp: GeoViewport, used: Set<string>) => {
    const multiPage = (info?.pageCount || 1) > 1;
    const sameCount = info!.viewports.filter((v) => v.pageIndex === vp.pageIndex).length;
    const safe = vp.name.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
    let n = `${base}${multiPage ? `_p${vp.pageIndex + 1}` : ''}${sameCount > 1 || info!.viewports.length > 1 ? `_${safe || 'map'}` : ''}`;
    let c = 2; const root = n;
    while (used.has(n)) n = `${root}_${c++}`;
    used.add(n);
    return `${n}.tif`;
  };

  const run = async () => {
    if (!bytes || !info || selectedMaps.length === 0) return;
    revokeAll(items);
    setError('');
    const ac = new AbortController();
    abortRef.current = ac;
    const used = new Set<string>();
    const queue = [...selectedMaps].sort((a, b) => a.pageIndex - b.pageIndex || info.viewports.indexOf(a) - info.viewports.indexOf(b));
    const list: ItemState[] = queue.map((v) => ({ id: v.id, status: 'queued', name: nameFor(v, used), label: `Page ${v.pageIndex + 1} · ${v.name}` }));
    setItems([...list]);
    const patch = (i: number, p: Partial<ItemState>) => { list[i] = { ...list[i], ...p }; setItems([...list]); };
    let pdf: any;
    try {
      setBusy('Opening PDF…');
      pdf = await openPdf(bytes);
      for (let i = 0; i < queue.length; i++) {
        if (ac.signal.aborted) { for (let j = i; j < queue.length; j++) patch(j, { status: 'cancelled' }); break; }
        patch(i, { status: 'working' });
        try {
          const r = await convertViewport(pdf, queue[i], { dpi: effDpiFor(queue[i]), signal: ac.signal, onStatus: (m) => setBusy(`${i + 1} of ${queue.length} — ${list[i].label}: ${m}`) });
          patch(i, { status: 'done', result: r, url: URL.createObjectURL(r.blob) });
        } catch (e: any) {
          if (ac.signal.aborted) { for (let j = i; j < queue.length; j++) patch(j, { status: 'cancelled' }); break; }
          patch(i, { status: 'error', error: e?.message || 'Conversion failed.' });
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Conversion failed.');
    } finally {
      try { await pdf?.destroy(); } catch { /* ignore */ }
      setBusy('');
      abortRef.current = null;
    }
  };

  const downloadZip = async () => {
    setZipBusy(true);
    try {
      const zip = new JSZip();
      items.forEach((i) => i.result && zip.file(i.name, i.result.blob));
      const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${base}_geotiffs.zip`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } finally { setZipBusy(false); }
  };

  const doneItems = items.filter((i) => i.status === 'done');
  const finished = items.length > 0 && !running;
  const progress = items.length ? Math.round((items.filter((i) => ['done', 'error', 'cancelled'].includes(i.status)).length / items.length) * 100) : 0;
  const crsName = (w: string) => (w.match(/^(?:PROJCS|GEOGCS)\["([^"]+)"/) || [])[1] || w;

  return (
    <>
      <SEO
        title="GeoPDF to GeoTIFF Converter — Free, Online"
        description="Convert a GeoPDF to GeoTIFF in your browser. Pick pages and insets or convert them all. Keeps the PDF's projection. Free, private, no upload."
        keywords="GeoPDF to GeoTIFF, convert GeoPDF to GeoTIFF, GeoPDF converter, PDF to GeoTIFF, georeferenced PDF to TIFF, ArcGIS PDF to GeoTIFF, GeoPDF online, multi page GeoPDF"
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
            Turn a georeferenced PDF map into GeoTIFFs that sit in the same place and use the same projection.
            Choose pages and insets, or convert everything at once. It all happens in your browser, so your PDF is never uploaded.
          </p>
        </header>

        <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => !running && inputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !running && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f && !running) load(f); }}
            style={{ border: '2px dashed var(--border-color)', borderRadius: '0.5rem', padding: '2rem 1rem', textAlign: 'center', cursor: running ? 'not-allowed' : 'pointer', backgroundColor: file ? 'var(--accent-soft)' : 'var(--bg-hover)' }}
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

          {reading && (
            <p role="status" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} /> Reading every page…
            </p>
          )}

          {error && (
            <div role="alert" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--danger-soft)', color: 'var(--danger-color)', borderRadius: '0.375rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>{error}</div>
            </div>
          )}

          {info && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                <strong>{info.pageCount} page{info.pageCount === 1 ? '' : 's'}</strong> read.{' '}
                <strong>{info.viewports.length} georeferenced map{info.viewports.length === 1 ? '' : 's'}</strong> found
                {info.viewports.length > info.pageCount || pages.some((p) => p.maps.length > 1) ? ' (main maps and insets)' : ''}.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <button type="button" className="btn-secondary" disabled={running} onClick={() => toggle(info.viewports.map((v) => v.id), true)}>Select all</button>
                <button type="button" className="btn-secondary" disabled={running} onClick={() => toggle(info.viewports.map((v) => v.id), false)}>Select none</button>
              </div>

              <div style={{ maxHeight: '22rem', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }}>
                {pages.map((pg) => {
                  const ids = pg.maps.map((m) => m.id);
                  const allOn = ids.length > 0 && ids.every((id) => selected.has(id));
                  const someOn = ids.some((id) => selected.has(id));
                  return (
                    <div key={pg.index} style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-color)', opacity: ids.length ? 1 : 0.55 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '0.9rem', cursor: ids.length ? 'pointer' : 'default' }}>
                        <input type="checkbox" disabled={!ids.length || running} checked={allOn}
                          ref={(el) => { if (el) el.indeterminate = someOn && !allOn; }}
                          onChange={(e) => toggle(ids, e.target.checked)} style={{ width: '1.1rem', height: '1.1rem' }} />
                        Page {pg.index + 1}
                        <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {ids.length === 0 ? 'no georeferencing — skipped' : `${ids.length} map${ids.length === 1 ? '' : 's'}`}
                        </span>
                      </label>
                      {pg.maps.map((m, k) => {
                        const z = outputSize(m, effDpiFor(m));
                        return (
                          <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0.35rem 0 0 1.7rem', fontSize: '0.85rem', cursor: 'pointer', flexWrap: 'wrap' }}>
                            <input type="checkbox" disabled={running} checked={selected.has(m.id)} onChange={(e) => toggle([m.id], e.target.checked)} style={{ width: '1.1rem', height: '1.1rem' }} />
                            <span style={{ overflowWrap: 'anywhere' }}>{m.name}{pg.maps.length > 1 ? (k === 0 ? '' : ' (inset)') : ''}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{z.width.toLocaleString()} × {z.height.toLocaleString()} px</span>
                          </label>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div style={{ margin: '1rem 0' }}>
                <label htmlFor="gp-dpi" style={label}>Resolution</label>
                <select id="gp-dpi" className="form-input" disabled={running} value={dpi} onChange={(e) => setDpi(Number(e.target.value))}>
                  {[72, 150, 300, 600].map((d) => <option key={d} value={d}>{d} DPI{d > globalCap ? ' (large maps are lowered automatically)' : ''}</option>)}
                </select>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  {selectedMaps.length} map{selectedMaps.length === 1 ? '' : 's'} selected, about {totalMp.toFixed(1)} megapixels in total.
                  Each map is limited to about 60 megapixels so your browser does not run out of memory.
                </p>
                {totalMp > 300 && <p style={{ fontSize: '0.78rem', color: 'var(--danger-color)' }}>That is a lot of data. Choose a lower DPI or fewer maps if your device is slow.</p>}
              </div>

              {!running ? (
                <button onClick={run} disabled={selectedMaps.length === 0} className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                  {selectedMaps.length === 0 ? 'Select at least one map' : `Convert ${selectedMaps.length} map${selectedMaps.length === 1 ? '' : 's'} to GeoTIFF`}
                </button>
              ) : (
                <button onClick={() => abortRef.current?.abort()} className="btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
                  <XCircle style={{ width: '1rem', height: '1rem' }} /> Cancel remaining
                </button>
              )}
            </div>
          )}

          {items.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              {running && (
                <div role="status" aria-live="polite" style={{ marginBottom: '0.75rem' }}>
                  <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.4rem', overflowWrap: 'anywhere' }}>
                    <Loader2 style={{ width: '1rem', height: '1rem', flexShrink: 0, animation: 'spin 1s linear infinite' }} /> {busy}
                  </p>
                  <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width .3s' }} />
                  </div>
                </div>
              )}

              {doneItems.length > 1 && (
                <button onClick={downloadZip} disabled={zipBusy} className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem', backgroundColor: 'var(--success-color)' }}>
                  {zipBusy ? <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} /> : <Package style={{ width: '1rem', height: '1rem' }} />}
                  Download all {doneItems.length} GeoTIFFs (ZIP)
                </button>
              )}

              {items.map((it) => {
                const r = it.result, g = r?.georef;
                return (
                  <div key={it.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.9rem', overflowWrap: 'anywhere' }}>{it.label}</strong>
                      <span style={{ fontSize: '0.78rem', color: it.status === 'error' ? 'var(--danger-color)' : it.status === 'done' ? 'var(--success-color)' : 'var(--text-muted)', display: 'inline-flex', gap: '0.3rem', alignItems: 'center' }}>
                        {it.status === 'working' && <Loader2 style={{ width: '0.85rem', height: '0.85rem', animation: 'spin 1s linear infinite' }} />}
                        {it.status === 'done' && <CheckCircle style={{ width: '0.85rem', height: '0.85rem' }} />}
                        {it.status === 'queued' ? 'Waiting' : it.status === 'working' ? 'Converting' : it.status === 'done' ? 'Done' : it.status === 'cancelled' ? 'Cancelled' : 'Failed'}
                      </span>
                    </div>
                    {it.status === 'error' && <p style={{ fontSize: '0.8rem', color: 'var(--danger-color)', margin: '0.4rem 0 0' }}>{it.error}</p>}
                    {r && g && it.url && (
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <img src={r.previewUrl} alt={`Preview of ${it.label}`} style={{ width: '7.5rem', maxWidth: '35%', height: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }} />
                        <div style={{ flex: '1 1 10rem', minWidth: 0, fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                          <div style={{ overflowWrap: 'anywhere' }}>{crsName(g.wkt)}</div>
                          <div>{r.width.toLocaleString()} × {r.height.toLocaleString()} px · {(r.blob.size / 1024 / 1024).toFixed(1)} MB · {g.isGeographic ? g.pixelSize[0].toFixed(6) + '°' : g.pixelSize[0].toFixed(1) + ' m'}/px</div>
                          <div style={{ color: g.maxResidualPx < 1 ? 'var(--text-muted)' : 'var(--danger-color)' }}>
                            {g.maxResidualPx < 1 ? 'Position check passed' : `Position differs by up to ${g.maxResidualPx.toFixed(1)} px — verify in your GIS`}
                            {!g.northUp ? ' · rotated map resampled to north-up' : ''}
                          </div>
                          <a href={it.url} download={it.name} className="btn-primary touch-target" style={{ display: 'inline-flex', marginTop: '0.4rem', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                            <Download style={{ width: '0.9rem', height: '0.9rem' }} /> Download
                          </a>
                          <div style={{ color: 'var(--text-muted)', overflowWrap: 'anywhere', marginTop: '0.25rem' }}>{it.name}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {finished && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Finished: {doneItems.length} of {items.length} converted{items.some((i) => i.status === 'error') ? ', some failed (see above)' : ''}.</p>}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }} />
            <span>Your file stays on your device. Results are kept in your browser&apos;s memory until you close or reload the page, so download what you need.</span>
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '4rem auto 0 auto' }}>
          <section style={sectionStyle}>
            <h2 style={h2Style}>How to convert a GeoPDF to a GeoTIFF</h2>
            <ol style={{ ...ulStyle, paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
              <li>Upload a PDF map that was exported with georeferencing on.</li>
              <li>The tool reads every page and lists each map and inset it finds. Tick the ones you want, or leave them all ticked to convert everything.</li>
              <li>Choose a resolution. 150 DPI is a good start; use 300 DPI or more for fine detail.</li>
              <li>Click <strong>Convert</strong>. Maps are converted one after another, page by page. Download each GeoTIFF, or all of them in one ZIP. Open them in ArcGIS, QGIS or any GIS and it lines up with your other layers.</li>
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
