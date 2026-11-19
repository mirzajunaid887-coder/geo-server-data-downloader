import type { GeoViewport } from './parse';
import { computeGeoref, type Georef } from './georef';

export const MAX_PIXELS = 60_000_000; // ~60 megapixels keeps phones and the GDAL WASM heap safe

export interface ConvertOptions {
  dpi: number;
  signal?: AbortSignal;
  onStatus?: (s: string) => void;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  dpi: number;
  georef: Georef;
  previewUrl: string;
  info: string; // gdalinfo text of the output (for verification)
}

/** Output size in pixels for a viewport at a DPI */
export function outputSize(vp: GeoViewport, dpi: number): { width: number; height: number } {
  const s = dpi / 72;
  return {
    width: Math.max(1, Math.round((vp.bbox[2] - vp.bbox[0]) * s)),
    height: Math.max(1, Math.round((vp.bbox[3] - vp.bbox[1]) * s)),
  };
}

/** Highest allowed DPI that stays under the pixel cap */
export function maxDpiFor(vp: GeoViewport): number {
  const w = vp.bbox[2] - vp.bbox[0], h = vp.bbox[3] - vp.bbox[1];
  return Math.floor(72 * Math.sqrt(MAX_PIXELS / (w * h)));
}

let pdfjsPromise: Promise<any> | null = null;
async function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs: any = await import('pdfjs-dist');
      const worker: any = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

async function loadGdal() {
  const mod: any = await import('gdal3.js');
  const init = mod.default || mod;
  return init({ path: 'https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package', useWorker: false });
}

/** Opens the PDF once so many maps can be drawn from it without re-reading the file. */
export async function openPdf(pdfBytes: ArrayBuffer): Promise<any> {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data: new Uint8Array(pdfBytes.slice(0)) });
  return task.promise;
}

export async function convertViewport(
  pdf: any,
  vp: GeoViewport,
  opts: ConvertOptions,
): Promise<ConvertResult> {
  const say = opts.onStatus || (() => {});
  const { width, height } = outputSize(vp, opts.dpi);
  if (opts.signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  if (width * height > MAX_PIXELS) throw new Error('That resolution is too large for a browser. Choose a lower DPI.');

  {
    const page = await pdf.getPage(vp.pageIndex + 1);
    const scale = opts.dpi / 72;
    const base = page.getViewport({ scale });
    // Shift so the viewport's top-left lands on pixel (0,0). Works for rotated pages too.
    const corners = [
      base.convertToViewportPoint(vp.bbox[0], vp.bbox[1]),
      base.convertToViewportPoint(vp.bbox[2], vp.bbox[3]),
    ];
    const offsetX = -Math.min(corners[0][0], corners[1][0]);
    const offsetY = -Math.min(corners[0][1], corners[1][1]);
    const view = page.getViewport({ scale, offsetX, offsetY });
    const toPixel = (x: number, y: number): [number, number] => view.convertToViewportPoint(x, y) as [number, number];

    const georef = computeGeoref(vp, toPixel, width, height);

    say('Drawing the map…');
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Your browser could not allocate a canvas this large. Try a lower DPI.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    const renderTask = page.render({ canvasContext: ctx, viewport: view, background: 'rgb(255,255,255)' });
    opts.signal?.addEventListener('abort', () => renderTask.cancel());
    await renderTask.promise;

    say('Encoding image…');
    const png: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not encode the image.'))), 'image/png'));
    // keep a small preview
    const pv = document.createElement('canvas');
    const k = Math.min(1, 480 / Math.max(width, height));
    pv.width = Math.round(width * k); pv.height = Math.round(height * k);
    pv.getContext('2d')!.drawImage(canvas, 0, 0, pv.width, pv.height);
    const previewUrl = pv.toDataURL('image/jpeg', 0.8);
    canvas.width = canvas.height = 0; // release memory

    say('Writing GeoTIFF…');
    const gdal = await loadGdal(); // a fresh engine per map, so memory is released between maps
    const file = new File([png], 'page.png', { type: 'image/png' });
    const opened = await gdal.open([file]);
    if (!opened?.datasets?.length) throw new Error('The converter engine could not read the rendered image.');
    const ds = opened.datasets[0];
    const common = ['-of', 'GTiff', '-b', '1', '-b', '2', '-b', '3', '-co', 'COMPRESS=DEFLATE', '-co', 'PREDICTOR=2', '-co', 'TILED=YES', '-co', 'BIGTIFF=IF_SAFER'];
    const findOut = async (name: string): Promise<string> => {
      const outs: { path: string }[] = await gdal.getOutputFiles();
      const f = outs.find((o) => (o.path.split('/').pop() || '').startsWith(name + '.'));
      if (!f) throw new Error('The converter engine did not produce a GeoTIFF. [' + outs.map((o) => o.path).join(', ') + ']');
      return f.path;
    };
    if (georef.northUp) {
      // Plain north-up map: set the extent directly. No resampling, pixels are untouched.
      const [ox, pw, , oy, , ph] = georef.gt;
      const lrx = ox + pw * width, lry = oy + ph * height;
      await gdal.gdal_translate(ds, [...common, '-a_srs', georef.wkt, '-a_ullr', String(ox), String(oy), String(lrx), String(lry)], 'out_geo');
    } else {
      // Rotated map: attach control points, then warp so the result is north-up.
      const gcpArgs = georef.gcps.flatMap((g) => ['-gcp', String(g.col), String(g.row), String(g.x), String(g.y)]);
      await gdal.gdal_translate(ds, ['-of', 'GTiff', '-b', '1', '-b', '2', '-b', '3', ...gcpArgs, '-a_srs', georef.wkt], 'gcp');
      const gcpBytes: Uint8Array = await gdal.getFileBytes(await findOut('gcp'));
      const o2 = await gdal.open([new File([gcpBytes as BlobPart], 'gcp.tif')]);
      await gdal.gdalwarp(o2.datasets[0], ['-of', 'GTiff', '-order', '1', '-r', 'bilinear', '-dstalpha', '-co', 'COMPRESS=DEFLATE', '-co', 'TILED=YES', '-co', 'BIGTIFF=IF_SAFER'], 'out_geo');
    }
    const outPath = await findOut('out_geo');
    const bytes: Uint8Array = await gdal.getFileBytes(outPath);
    let info = '';
    try {
      const o3 = await gdal.open([new File([bytes as BlobPart], 'out_geo.tif')]);
      info = String(await gdal.gdalinfo(o3.datasets[0], []));
    } catch { /* optional */ }
    try { await gdal.close(ds); } catch { /* ignore */ }
    return {
      blob: new Blob([bytes as BlobPart], { type: 'image/tiff' }),
      width, height, dpi: opts.dpi, georef, previewUrl, info,
    };
  }
}
