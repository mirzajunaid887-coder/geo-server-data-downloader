import proj4 from 'proj4';
import type { GeoViewport } from './parse';

export interface Georef {
  /** GDAL style [originX, pxW, rotX, originY, rotY, pxH] for the rendered raster */
  gt: [number, number, number, number, number, number];
  width: number;
  height: number;
  /** Largest disagreement between the fitted transform and the PDF control points, in pixels */
  maxResidualPx: number;
  /** Axis-aligned (north-up) in the map projection? */
  northUp: boolean;
  gcps: { col: number; row: number; x: number; y: number }[];
  wkt: string;
  isGeographic: boolean;
  /** Pixel size in CRS units (metres for projected, degrees for geographic) */
  pixelSize: [number, number];
  bounds: [number, number, number, number]; // minx, miny, maxx, maxy in CRS units
}

/** Pulls the GEOGCS[...] block out of a PROJCS WKT so we can project from the PDF's own datum. */
function geogcsOf(wkt: string): string {
  const i = wkt.indexOf('GEOGCS[');
  if (i < 0) return wkt;
  let depth = 0;
  for (let j = i; j < wkt.length; j++) {
    if (wkt[j] === '[') depth++;
    else if (wkt[j] === ']' && --depth === 0) return wkt.slice(i, j + 1);
  }
  return wkt;
}

function utmFromEpsg(code: number): { wkt: string } | null {
  let zone = 0, south = false, datum = '';
  if (code >= 32601 && code <= 32660) { zone = code - 32600; datum = 'WGS84'; }
  else if (code >= 32701 && code <= 32760) { zone = code - 32700; south = true; datum = 'WGS84'; }
  else if (code >= 26901 && code <= 26923) { zone = code - 26900; datum = 'NAD83'; }
  else return null;
  return { wkt: `EPSG:${code}|+proj=utm +zone=${zone}${south ? ' +south' : ''} +datum=${datum} +units=m +no_defs` };
}

/** Works out the CRS to hand to both proj4 (maths) and GDAL (output tag). */
function resolveCrs(vp: GeoViewport): { gdalSrs: string; proj: (lon: number, lat: number) => [number, number]; geographic: boolean } {
  if (vp.wkt) {
    const w = vp.wkt.trim();
    const geographic = /^GEOGCS\[/i.test(w) || /^GEODETIC/i.test(w);
    if (geographic) return { gdalSrs: w, proj: (lon, lat) => [lon, lat], geographic: true };
    const f = proj4(geogcsOf(w), w);
    return { gdalSrs: w, proj: (lon, lat) => f.forward([lon, lat]) as [number, number], geographic: false };
  }
  const e = vp.epsg;
  if (e) {
    if ([4326, 4269, 4267, 4258].includes(e)) return { gdalSrs: `EPSG:${e}`, proj: (lon, lat) => [lon, lat], geographic: true };
    if (e === 3857 || e === 900913) {
      const f = proj4('EPSG:4326', 'EPSG:3857');
      return { gdalSrs: 'EPSG:3857', proj: (lon, lat) => f.forward([lon, lat]) as [number, number], geographic: false };
    }
    const u = utmFromEpsg(e);
    if (u) {
      const f = proj4('EPSG:4326', u.wkt.split('|')[1]);
      return { gdalSrs: `EPSG:${e}`, proj: (lon, lat) => f.forward([lon, lat]) as [number, number], geographic: false };
    }
    throw new Error(
      `This PDF only names the coordinate system as EPSG:${e} without a definition, and that code is not built in yet. Please contact us with the file so we can add it.`,
    );
  }
  throw new Error('The PDF has map points but no coordinate system definition.');
}

/** Solve least-squares affine: [x y] = [col row 1] * M. */
function fitAffine(pts: { col: number; row: number; x: number; y: number }[]) {
  // Normal equations for a (3x3) system, done twice (x and y)
  let sc = 0, sr = 0, scc = 0, scr = 0, srr = 0, n = pts.length;
  let sx = 0, sxc = 0, sxr = 0, sy = 0, syc = 0, syr = 0;
  // Centre to keep numbers well-conditioned
  const mc = pts.reduce((a, p) => a + p.col, 0) / n, mr = pts.reduce((a, p) => a + p.row, 0) / n;
  const mx = pts.reduce((a, p) => a + p.x, 0) / n, my = pts.reduce((a, p) => a + p.y, 0) / n;
  for (const p of pts) {
    const c = p.col - mc, r = p.row - mr, x = p.x - mx, y = p.y - my;
    scc += c * c; scr += c * r; srr += r * r;
    sxc += x * c; sxr += x * r; syc += y * c; syr += y * r;
  }
  void sc; void sr; void sx; void sy;
  const det = scc * srr - scr * scr;
  if (Math.abs(det) < 1e-12) throw new Error('The control points are in a straight line, so the map cannot be positioned.');
  const a = (sxc * srr - sxr * scr) / det; // dx/dcol
  const b = (sxr * scc - sxc * scr) / det; // dx/drow
  const d = (syc * srr - syr * scr) / det; // dy/dcol
  const e = (syr * scc - syc * scr) / det; // dy/drow
  const ox = mx - a * mc - b * mr;
  const oy = my - d * mc - e * mr;
  return { a, b, ox, d, e, oy };
}

/**
 * Builds the georeferencing for a raster that shows `vp.bbox` rendered at `scale` px per PDF point.
 * `toPixel` converts PDF user-space coordinates to raster pixel coordinates (handles page rotation).
 */
export function computeGeoref(
  vp: GeoViewport,
  toPixel: (x: number, y: number) => [number, number],
  width: number,
  height: number,
): Georef {
  const crs = resolveCrs(vp);
  const gcps = vp.points.map((p) => {
    const [col, row] = toPixel(p.x, p.y);
    const [x, y] = crs.proj(p.lon, p.lat);
    if (!isFinite(x) || !isFinite(y)) throw new Error('A control point could not be projected. The coordinate system in the PDF may be damaged.');
    return { col, row, x, y };
  });
  const m = fitAffine(gcps);
  let maxRes = 0;
  for (const g of gcps) {
    const px = m.ox + m.a * g.col + m.b * g.row;
    const py = m.oy + m.d * g.col + m.e * g.row;
    // residual in pixels
    const sx = Math.hypot(m.a, m.d) || 1;
    maxRes = Math.max(maxRes, Math.hypot(px - g.x, py - g.y) / sx);
  }
  const gt: Georef['gt'] = [m.ox, m.a, m.b, m.oy, m.d, m.e];
  const pw = Math.hypot(m.a, m.d), ph = Math.hypot(m.b, m.e);
  const rotated = Math.abs(m.b) > 1e-6 * pw * width || Math.abs(m.d) > 1e-6 * ph * height;
  const corners = [[0, 0], [width, 0], [0, height], [width, height]].map(([c, r]) => [
    m.ox + m.a * c + m.b * r,
    m.oy + m.d * c + m.e * r,
  ]);
  const xs = corners.map((c) => c[0]), ys = corners.map((c) => c[1]);
  return {
    gt, width, height, maxResidualPx: maxRes, northUp: !rotated, gcps, wkt: crs.gdalSrs,
    isGeographic: crs.geographic, pixelSize: [pw, ph],
    bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)],
  };
}
