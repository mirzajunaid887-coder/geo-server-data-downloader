/**
 * Reads GeoPDF (ISO 32000 "Measure" style) georeferencing out of a PDF.
 * Each page may carry /VP viewports; every viewport that has a /Measure of /Subtype /GEO
 * becomes one selectable map area. Everything runs in the browser.
 */
import {
  PDFArray, PDFDict, PDFDocument, PDFHexString, PDFName, PDFNumber, PDFObject, PDFString,
} from 'pdf-lib';

export interface GeoViewport {
  id: string;
  pageIndex: number; // 0-based
  name: string;
  /** [xmin, ymin, xmax, ymax] in PDF user space (points), normalised */
  bbox: [number, number, number, number];
  /** Control points: PDF page coordinates (x,y) paired with geographic lon/lat of the GCS datum */
  points: { x: number; y: number; lon: number; lat: number }[];
  /** ESRI/OGC WKT1 of the map's coordinate system (projected or geographic) */
  wkt?: string;
  epsg?: number;
}

export interface GeoPdfInfo {
  pageCount: number;
  viewports: GeoViewport[];
  /** Set when the file looks like a TerraGo-style GeoPDF (not supported) */
  legacyTerraGo: boolean;
}

export class GeoPdfError extends Error {
  code: 'not-pdf' | 'encrypted' | 'no-georef' | 'legacy' | 'bad-georef';
  constructor(code: GeoPdfError['code'], message: string) {
    super(message);
    this.code = code;
  }
}

function num(o: PDFObject | undefined): number | undefined {
  return o instanceof PDFNumber ? o.asNumber() : undefined;
}

function nums(doc: PDFDocument, o: PDFObject | undefined): number[] | undefined {
  const a = o && doc.context.lookup(o);
  if (!(a instanceof PDFArray)) return undefined;
  const out: number[] = [];
  for (let i = 0; i < a.size(); i++) {
    const v = num(doc.context.lookup(a.get(i)));
    if (v === undefined) return undefined;
    out.push(v);
  }
  return out;
}

function text(o: PDFObject | undefined): string | undefined {
  if (o instanceof PDFString || o instanceof PDFHexString) return o.decodeText();
  return undefined;
}

export async function parseGeoPdf(buffer: ArrayBuffer): Promise<GeoPdfInfo> {
  const head = new Uint8Array(buffer, 0, Math.min(1024, buffer.byteLength));
  const headStr = new TextDecoder('latin1').decode(head);
  if (!headStr.includes('%PDF')) throw new GeoPdfError('not-pdf', 'This file does not look like a PDF.');

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(buffer, { ignoreEncryption: false, updateMetadata: false, throwOnInvalidObject: false });
  } catch (e: any) {
    if (/encrypt/i.test(String(e?.message))) {
      throw new GeoPdfError('encrypted', 'This PDF is password-protected. Remove the password and try again.');
    }
    throw new GeoPdfError('not-pdf', 'This PDF could not be read. It may be damaged.');
  }

  const ctx = doc.context;
  const viewports: GeoViewport[] = [];
  let legacy = false;
  const pages = doc.getPages();

  pages.forEach((page, pageIndex) => {
    const node = page.node;
    if (node.get(PDFName.of('LGIDict'))) legacy = true;
    const vpArr = ctx.lookup(node.get(PDFName.of('VP')));
    if (!(vpArr instanceof PDFArray)) return;

    for (let i = 0; i < vpArr.size(); i++) {
      const vp = ctx.lookup(vpArr.get(i));
      if (!(vp instanceof PDFDict)) continue;
      const measure = ctx.lookup(vp.get(PDFName.of('Measure')));
      if (!(measure instanceof PDFDict)) continue;
      const sub = ctx.lookup(measure.get(PDFName.of('Subtype')));
      if (!(sub instanceof PDFName) || sub.asString() !== '/GEO') continue;

      const bb = nums(doc, vp.get(PDFName.of('BBox')));
      const gpts = nums(doc, measure.get(PDFName.of('GPTS')));
      let lpts = nums(doc, measure.get(PDFName.of('LPTS')));
      if (!bb || bb.length !== 4 || !gpts || gpts.length < 6 || gpts.length % 2) continue;
      const n = gpts.length / 2;
      // LPTS default to the BBox corners in order (spec: [0 0 0 1 1 1 1 0])
      if (!lpts || lpts.length !== gpts.length) lpts = [0, 0, 0, 1, 1, 1, 1, 0].slice(0, gpts.length);

      // Normalised bbox for cropping. LPTS are relative to the bbox *as written*, so keep both.
      const [bx1, by1, bx2, by2] = bb;
      const points = [] as GeoViewport['points'];
      for (let k = 0; k < n; k++) {
        const u = lpts[2 * k], v = lpts[2 * k + 1];
        points.push({
          x: bx1 + u * (bx2 - bx1),
          y: by1 + v * (by2 - by1),
          lat: gpts[2 * k],
          lon: gpts[2 * k + 1],
        });
      }

      let wkt: string | undefined;
      let epsg: number | undefined;
      const gcs = ctx.lookup(measure.get(PDFName.of('GCS')));
      if (gcs instanceof PDFDict) {
        wkt = text(ctx.lookup(gcs.get(PDFName.of('WKT'))));
        epsg = num(ctx.lookup(gcs.get(PDFName.of('EPSG'))));
      }

      const nameObj = ctx.lookup(vp.get(PDFName.of('Name')));
      const name = text(nameObj) || `Map ${viewports.length + 1}`;
      viewports.push({
        id: `p${pageIndex}v${i}`,
        pageIndex,
        name: name.trim() || `Map ${viewports.length + 1}`,
        bbox: [Math.min(bx1, bx2), Math.min(by1, by2), Math.max(bx1, bx2), Math.max(by1, by2)],
        points,
        wkt,
        epsg,
      });
    }
  });

  if (viewports.length === 0) {
    if (legacy) {
      throw new GeoPdfError(
        'legacy',
        'This PDF uses the older TerraGo georeferencing style, which this tool cannot read yet. PDFs exported from ArcGIS Pro, ArcMap, QGIS and GDAL are supported.',
      );
    }
    throw new GeoPdfError(
      'no-georef',
      'No georeferencing was found in this PDF. It is a normal PDF, or it was exported with the "Georeference information" option turned off.',
    );
  }
  return { pageCount: pages.length, viewports, legacyTerraGo: legacy };
}
