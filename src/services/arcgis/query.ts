/**
 * Feature download engine.
 *
 * This mirrors how geodatadownloader.com pulls data (app/arcgis.ts + app/downloader.ts):
 *
 *   1. Ask the layer for ALL object IDs                      (returnIdsOnly=true)
 *   2. Split the IDs into small pages (200)
 *   3. For each page query   where=<OIDFIELD> IN (id,id,...)
 *        outFields=*, returnGeometry=true, outSR=4326, f=json   <-- plain Esri JSON
 *   4. Drop features with invalid geometry
 *   5. Convert Esri JSON -> GeoJSON on the CLIENT with @terraformer/arcgis
 *
 * The important differences from the old implementation:
 *   - We NEVER ask the server for f=geojson. Many ArcGIS Server MapServer layers
 *     (older versions, or layers with certain data sources) reject it with
 *     "Failed to execute query."  Esri JSON is supported everywhere.
 *   - The OID field name is read from the layer's fields (type esriFieldTypeOID),
 *     because MapServer sublayers often don't expose a top-level `objectIdField`.
 *   - outSR=4326 is requested explicitly so coordinates are always lon/lat.
 *   - Pages are 200 IDs (not 1000) so we never exceed a server's maxRecordCount
 *     or URL / POST size limits.
 */
import { arcgisToGeoJSON } from '@terraformer/arcgis';

export const PAGE_SIZE = 200;
export const DEFAULT_CONCURRENCY = 6; // geodatadownloader defaults to 2 and allows up to 20
const MAX_RETRIES = 3;

type Params = Record<string, string>;

export function cleanLayerUrl(rawUrl: string): string {
  let cleaned = (rawUrl ?? '').trim();
  try {
    const u = new URL(cleaned);
    cleaned = u.origin + u.pathname;
  } catch {
    cleaned = cleaned.split('?')[0].split('#')[0];
  }
  return cleaned.replace(/\/query\/?$/i, '').replace(/\/+$/, '');
}

export function describeArcGISError(err: any): string {
  if (!err) return 'Unknown ArcGIS error';
  if (typeof err === 'string') return err;
  const details = Array.isArray(err.details) && err.details.length ? ` (${err.details.join('; ')})` : '';
  return `${err.message || 'ArcGIS server error'}${err.code ? ` [code ${err.code}]` : ''}${details}`;
}

/**
 * Same transport rule the ArcGIS JS SDK uses: GET for short requests,
 * POST (form-encoded, no preflight) when the URL would get long.
 */
async function arcgisRequest(url: string, params: Params, signal?: AbortSignal): Promise<any> {
  try {
    return await arcgisRequestOnce(url, params, signal);
  } catch (e: any) {
    // Network hiccups / throttling: retry with backoff instead of failing the whole download.
    const transient = e?.transient || e instanceof TypeError;
    if (!transient) throw e;
    let lastErr = e;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1) + Math.random() * 200));
      try {
        return await arcgisRequestOnce(url, params, signal);
      } catch (err: any) {
        lastErr = err;
        if (!(err?.transient || err instanceof TypeError)) throw err;
      }
    }
    throw lastErr;
  }
}

async function arcgisRequestOnce(url: string, params: Params, signal?: AbortSignal): Promise<any> {
  const body = new URLSearchParams({ ...params, f: 'json' });
  const getUrl = `${url}?${body.toString()}`;

  const res =
    getUrl.length < 2000
      ? await fetch(getUrl, { signal })
      : await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
          signal,
        });

  if (!res.ok) {
    const err: any = new Error(`HTTP ${res.status} ${res.statusText} from ${url}`);
    err.transient = res.status === 429 || res.status >= 500;
    throw err;
  }
  const json = await res.json();
  // ArcGIS often returns HTTP 200 with an { error: {...} } body
  if (json?.error) {
    throw new Error(describeArcGISError(json.error));
  }
  return json;
}

interface LayerInfo {
  oidField: string;
}

const layerInfoCache = new Map<string, Promise<LayerInfo>>();

async function getLayerInfo(layerUrl: string): Promise<LayerInfo> {
  const base = cleanLayerUrl(layerUrl);
  let cached = layerInfoCache.get(base);
  if (!cached) {
    cached = (async () => {
      const meta = await arcgisRequest(base, {});
      const oidField =
        meta.fields?.find((f: any) => f.type === 'esriFieldTypeOID')?.name ??
        meta.objectIdField ??
        'OBJECTID';
      return { oidField };
    })();
    layerInfoCache.set(base, cached);
    cached.catch(() => layerInfoCache.delete(base));
  }
  return cached;
}

/** Step 1: every object id in the layer (optionally filtered). */
export async function fetchAllObjectIds(layerUrl: string, where = '1=1'): Promise<number[]> {
  const base = cleanLayerUrl(layerUrl);
  const data = await arcgisRequest(`${base}/query`, { where, returnIdsOnly: 'true' });
  return data.objectIds || [];
}

function paginate<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

const hasValidGeometry = (f: any): boolean => {
  const g = f?.geometry;
  if (!g) return false;
  if (g.rings) return g.rings.every((r: any[]) => r?.length > 1);
  if (g.paths) return g.paths.every((p: any[]) => p?.length > 0);
  if (g.points) return g.points.length > 0;
  return g.x !== undefined && g.y !== undefined;
};

/** Step 3: one page of features as Esri JSON, with fallbacks if the server objects. */
async function queryPage(base: string, oidField: string, ids: number[]): Promise<any[]> {
  const common: Params = {
    outFields: '*',
    returnGeometry: 'true',
    outSR: '4326', // geojson is always 4326
  };

  const attempts: Params[] = [
    { ...common, where: `${oidField} IN (${ids.join(',')})` }, // exactly what geodatadownloader does
    { ...common, objectIds: ids.join(',') }, // alternate way to ask for the same ids
  ];

  let lastError: Error | null = null;
  for (const params of attempts) {
    try {
      const data = await arcgisRequest(`${base}/query`, params);
      return data.features || [];
    } catch (e: any) {
      lastError = e;
    }
  }

  // Both styles failed. If the page has more than one id, split it and try again;
  // that isolates a single problematic feature (or a size limit) instead of failing everything.
  if (ids.length > 1) {
    const mid = Math.ceil(ids.length / 2);
    const left = await queryPage(base, oidField, ids.slice(0, mid));
    const right = await queryPage(base, oidField, ids.slice(mid));
    return [...left, ...right];
  }

  throw new Error(`Query failed for feature ${oidField}=${ids[0]}: ${lastError?.message ?? 'unknown error'}`);
}

/**
 * Steps 2–5. Takes the ids from fetchAllObjectIds and returns GeoJSON features.
 * Signature is unchanged from the old implementation so existing callers keep working.
 */
export async function fetchFeaturesBatch(
  url: string,
  objectIds: number[],
  onProgress?: (done: number, total: number) => void,
  concurrency = DEFAULT_CONCURRENCY
): Promise<any[]> {
  const base = cleanLayerUrl(url);
  const { oidField } = await getLayerInfo(base);
  // Callers may omit the callback (or pass something that isn't a function) - never crash on it.
  const report = typeof onProgress === 'function' ? onProgress : () => {};
  const pages = paginate(objectIds, PAGE_SIZE);
  const results: any[][] = new Array(pages.length);
  let next = 0;
  let done = 0;

  const worker = async () => {
    while (true) {
      const i = next++;
      if (i >= pages.length) return;
      const esriFeatures = (await queryPage(base, oidField, pages[i]!)).filter(hasValidGeometry);
      const fc = arcgisToGeoJSON({
        features: esriFeatures,
        spatialReference: { wkid: 4326 },
      } as any) as unknown as GeoJSON.FeatureCollection;
      results[i] = fc.features;
      done++;
      report(done, pages.length);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, pages.length) }, worker));
  return results.flat();
}

/** Convenience: ids + features in one call. */
export async function downloadLayerFeatures(
  url: string,
  onProgress?: (done: number, total: number) => void,
  where = '1=1'
): Promise<any[]> {
  const ids = await fetchAllObjectIds(url, where);
  if (ids.length === 0) return [];
  return fetchFeaturesBatch(url, ids, onProgress);
}