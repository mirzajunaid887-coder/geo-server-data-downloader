/**
 * OGC WFS support (vector features only - WMS serves images, not data).
 *
 * Based on geodatadownloader's app/wfs.ts:
 *   GetCapabilities -> list feature types -> GetFeature (GeoJSON) page by page.
 *
 * Differences from the reference, all aimed at not losing or corrupting data:
 *   - Pages by the number of features the server ACTUALLY returned. Servers often cap a
 *     response below the page size we ask for (e.g. 500); the reference stops on "short page"
 *     and can truncate, we only stop on an empty page / reaching the known total.
 *   - WFS 1.0.0 has no paging: we send ONE request with no maxFeatures instead of capping at 1000.
 *   - Tries several GeoJSON outputFormat names (servers disagree on the name).
 *   - Keeps extra query params in the endpoint URL (e.g. ?map=... on MapServer-based WFS).
 *   - Keeps the response's `crs` member so GDAL interprets non-WGS84 coordinates correctly.
 *   - Retries transient failures (429 / 5xx / dropped connections) with backoff.
 */

export const WFS_PAGE_SIZE = 1000;
const MAX_RETRIES = 3;
const PARALLEL_PAGES = 4;

const OUTPUT_FORMATS = [
  'application/json',
  'application/json; subtype=geojson',
  'json',
  'geojson',
  'GEOJSON',
];

const WFS_RESERVED_PARAMS = new Set([
  'service', 'request', 'version', 'typename', 'typenames', 'outputformat',
  'count', 'maxfeatures', 'startindex', 'resulttype', 'srsname', 'acceptversions',
]);

export interface WfsFeatureType {
  name: string;
  title?: string;
  abstract?: string;
  defaultCrs?: string;
}

export interface WfsCapabilities {
  version: string;
  featureTypes: WfsFeatureType[];
  serviceTitle?: string;
}

export interface WfsFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSON.Feature[];
  crs?: unknown;
}

/* ------------------------------------------------------------------ URL helpers */

/** True for ?service=WFS URLs, paths ending in /wfs, /ows or ArcGIS Server's /WFSServer. */
export function isWfsUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl.trim());
    const service = url.searchParams.get('service');
    if (service && service.toUpperCase() === 'WFS') return true;
    const path = url.pathname.toLowerCase().replace(/\/+$/, '');
    return path.endsWith('/wfs') || path.endsWith('/ows') || path.endsWith('/wfsserver');
  } catch {
    return false;
  }
}

/** Endpoint without the WFS protocol params, but keeping any vendor params (map=..., etc). */
export function normalizeWfsBaseUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());
    for (const key of [...url.searchParams.keys()]) {
      if (WFS_RESERVED_PARAMS.has(key.toLowerCase())) url.searchParams.delete(key);
    }
    url.hash = '';
    return url.toString();
  } catch {
    return rawUrl.split('#')[0]!.split('?')[0]!;
  }
}

function buildUrl(endpoint: string, params: Record<string, string>): string {
  const url = new URL(endpoint);
  for (const key of [...url.searchParams.keys()]) {
    if (WFS_RESERVED_PARAMS.has(key.toLowerCase())) url.searchParams.delete(key);
  }
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

function versionParts(version: string): [number, number] {
  const [maj, min] = version.split('.');
  return [parseInt(maj ?? '2', 10) || 2, parseInt(min ?? '0', 10) || 0];
}

/* --------------------------------------------------------------------- transport */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function networkError(err: unknown): Error {
  const msg = (err as Error)?.message ?? String(err);
  return new Error(
    `Could not reach the WFS server (${msg}). The URL may be wrong, or the server may not allow ` +
      'cross-origin (CORS) requests from a browser.'
  );
}

/** fetch with backoff for network errors and, optionally, 429/5xx responses. */
async function fetchWithRetry(url: string, retryOnStatus = true): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) await sleep(400 * 2 ** (attempt - 1) + Math.random() * 200);
    try {
      const res = await fetch(url);
      if (retryOnStatus && (res.status === 429 || res.status >= 500)) {
        lastErr = new Error(`HTTP ${res.status} ${res.statusText}`);
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw networkError(lastErr);
}

function parseXml(text: string): Document {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Failed to parse WFS response as XML');
  }
  return doc;
}

const byLocalName = (doc: Document | Element, name: string): Element[] =>
  Array.from(doc.getElementsByTagNameNS('*', name));

const childText = (el: Element, name: string): string | undefined => {
  for (const c of Array.from(el.children)) {
    if (c.localName === name) return c.textContent?.trim() || undefined;
  }
  return undefined;
};

function exceptionText(doc: Document): string | undefined {
  const t = byLocalName(doc, 'ExceptionText')[0] ?? byLocalName(doc, 'ServiceException')[0];
  return t?.textContent?.trim() || undefined;
}

/* ------------------------------------------------------------------ capabilities */

export async function fetchWfsCapabilities(baseUrl: string): Promise<WfsCapabilities> {
  const res = await fetchWithRetry(buildUrl(baseUrl, { service: 'WFS', request: 'GetCapabilities' }));
  if (!res.ok) throw new Error(`WFS GetCapabilities failed: HTTP ${res.status} ${res.statusText}`);

  const doc = parseXml(await res.text());
  const exc = exceptionText(doc);
  if (exc) throw new Error(`WFS service error: ${exc}`);

  const version = doc.documentElement.getAttribute('version') ?? '2.0.0';

  const identification = byLocalName(doc, 'ServiceIdentification')[0] ?? byLocalName(doc, 'Service')[0];
  const serviceTitle = identification ? childText(identification, 'Title') : undefined;

  const featureTypes: WfsFeatureType[] = [];
  for (const ft of byLocalName(doc, 'FeatureType')) {
    const name = childText(ft, 'Name');
    if (!name) continue;
    featureTypes.push({
      name,
      title: childText(ft, 'Title'),
      abstract: childText(ft, 'Abstract'),
      defaultCrs: childText(ft, 'DefaultCRS') ?? childText(ft, 'DefaultSRS') ?? childText(ft, 'SRS'),
    });
  }

  if (featureTypes.length === 0) {
    throw new Error('No feature types found in the WFS GetCapabilities response');
  }
  return { version, featureTypes, serviceTitle };
}

/* ------------------------------------------------------------------ GetFeature */

interface PageResult {
  features: GeoJSON.Feature[];
  total?: number;
  crs?: unknown;
}

interface Ctx {
  baseUrl: string;
  typeName: string;
  version: string;
  format?: string;
}

function featureParams(ctx: Ctx, format: string, startIndex: number, count?: number) {
  const [major, minor] = versionParts(ctx.version);
  const params: Record<string, string> = {
    service: 'WFS',
    version: ctx.version,
    request: 'GetFeature',
    outputFormat: format,
  };
  if (major >= 2) {
    params.typeNames = ctx.typeName;
    if (count !== undefined) {
      params.count = String(count);
      params.startIndex = String(startIndex);
    }
  } else {
    params.typeName = ctx.typeName;
    if (major === 1 && minor >= 1 && count !== undefined) {
      params.maxFeatures = String(count);
      params.startIndex = String(startIndex);
    }
    // WFS 1.0.0: no paging parameters at all - one request returns everything.
  }
  return params;
}

/** Parses a response body as a GeoJSON FeatureCollection, or throws with the server's message. */
async function readGeoJson(res: Response): Promise<PageResult> {
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    let reason = 'response was not JSON';
    try {
      reason = exceptionText(parseXml(text)) ?? reason;
    } catch { /* not XML either */ }
    throw new Error(reason);
  }
  if (!Array.isArray(json?.features)) {
    throw new Error('response was not a GeoJSON FeatureCollection');
  }
  const total = json.numberMatched ?? json.totalFeatures;
  return {
    features: json.features,
    total: typeof total === 'number' ? total : undefined,
    crs: json.crs,
  };
}

async function requestPage(ctx: Ctx, startIndex: number, count: number | undefined): Promise<PageResult> {
  const probing = ctx.format === undefined;
  const formats = probing ? OUTPUT_FORMATS : [ctx.format!];
  let lastError = 'unknown error';

  for (const format of formats) {
    const url = buildUrl(ctx.baseUrl, featureParams(ctx, format, startIndex, count));
    // While probing for a working outputFormat, don't burn retries on error statuses.
    const res = await fetchWithRetry(url, !probing);
    if (!res.ok && !probing) {
      throw new Error(`WFS GetFeature failed: HTTP ${res.status} ${res.statusText}`);
    }
    try {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const page = await readGeoJson(res);
      ctx.format = format;
      return page;
    } catch (e) {
      lastError = (e as Error).message;
    }
  }
  throw new Error(
    `The WFS server did not return GeoJSON for "${ctx.typeName}" (${lastError}). ` +
      'Only servers that can output GeoJSON are supported.'
  );
}

/** Total feature count via resultType=hits (WFS >= 1.1). null when unsupported/unknown. */
export async function getWfsTotalCount(baseUrl: string, typeName: string, version: string): Promise<number | null> {
  const [major, minor] = versionParts(version);
  if (major < 2 && !(major === 1 && minor >= 1)) return null;
  try {
    const params: Record<string, string> = {
      service: 'WFS', version, request: 'GetFeature', resultType: 'hits',
    };
    params[major >= 2 ? 'typeNames' : 'typeName'] = typeName;
    const res = await fetchWithRetry(buildUrl(baseUrl, params));
    if (!res.ok) return null;
    const root = parseXml(await res.text()).documentElement;
    const matched = root.getAttribute('numberMatched') ?? root.getAttribute('numberOfFeatures');
    if (matched && matched !== 'unknown') {
      const n = parseInt(matched, 10);
      return Number.isNaN(n) ? null : n;
    }
  } catch { /* count is optional */ }
  return null;
}

const featureKey = (f: GeoJSON.Feature | undefined): string =>
  f ? String(f.id ?? JSON.stringify(f.geometry ?? '').slice(0, 300) + JSON.stringify(f.properties ?? '')) : '';

/** Fetch exactly `expected` features starting at `start`, tolerating servers that cap page size. */
async function fetchRange(ctx: Ctx, start: number, expected: number): Promise<{ features: GeoJSON.Feature[]; crs?: unknown }> {
  const features: GeoJSON.Feature[] = [];
  let crs: unknown;
  while (features.length < expected) {
    const page = await requestPage(ctx, start + features.length, expected - features.length);
    crs = crs ?? page.crs;
    if (page.features.length === 0) break;
    features.push(...page.features);
  }
  return { features, crs };
}

/**
 * Download every feature of a WFS feature type as one GeoJSON FeatureCollection.
 */
export async function fetchWfsFeatureCollection(
  baseUrl: string,
  typeName: string,
  version: string,
  onProgress?: (fetched: number, total?: number) => void
): Promise<WfsFeatureCollection> {
  const report = typeof onProgress === 'function' ? onProgress : () => {};
  const ctx: Ctx = { baseUrl, typeName, version };
  const [major, minor] = versionParts(version);

  // WFS 1.0.0: single unpaged request.
  if (major === 1 && minor === 0) {
    const page = await requestPage(ctx, 0, undefined);
    report(page.features.length, page.features.length);
    return { type: 'FeatureCollection', features: page.features, ...(page.crs ? { crs: page.crs } : {}) };
  }

  const hits = await getWfsTotalCount(baseUrl, typeName, version);
  const first = await requestPage(ctx, 0, WFS_PAGE_SIZE);
  const total = hits ?? first.total;
  const features: GeoJSON.Feature[] = [...first.features];
  let crs = first.crs;
  report(features.length, total);

  if (features.length > 0) {
    if (total !== undefined) {
      // Known total -> fetch remaining pages in parallel. Step = what the server really returned.
      const step = first.features.length;
      const starts: number[] = [];
      for (let s = step; s < total; s += step) starts.push(s);
      const results: GeoJSON.Feature[][] = new Array(starts.length);
      let next = 0;
      let fetched = features.length;
      const worker = async () => {
        while (true) {
          const i = next++;
          if (i >= starts.length) return;
          const start = starts[i]!;
          const r = await fetchRange(ctx, start, Math.min(step, total - start));
          if (r.features.length > 0 && featureKey(r.features[0]) === featureKey(first.features[0])) {
            throw new Error('The WFS server ignores startIndex, so it cannot be paged reliably.');
          }
          crs = crs ?? r.crs;
          results[i] = r.features;
          fetched += r.features.length;
          report(fetched, total);
        }
      };
      await Promise.all(Array.from({ length: Math.min(PARALLEL_PAGES, starts.length) }, worker));
      for (const r of results) if (r) features.push(...r);
    } else {
      // Unknown total -> sequential until the server returns an empty page.
      let prevFirstKey = featureKey(first.features[0]);
      while (true) {
        const page = await requestPage(ctx, features.length, WFS_PAGE_SIZE);
        crs = crs ?? page.crs;
        if (page.features.length === 0) break;
        const key = featureKey(page.features[0]);
        if (key === prevFirstKey) break; // server ignored startIndex and repeated the page
        prevFirstKey = key;
        features.push(...page.features);
        report(features.length, undefined);
      }
    }
  }

  report(features.length, total ?? features.length);
  return { type: 'FeatureCollection', features, ...(crs ? { crs } : {}) };
}
