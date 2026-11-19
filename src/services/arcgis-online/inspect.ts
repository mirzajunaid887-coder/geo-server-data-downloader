/**
 * Read-only metadata lookups for ArcGIS REST services (client-side, no key).
 * Every call is a plain GET with f=json, the same way the Downloader reads services.
 */

export class InspectError extends Error {
  kind: 'auth' | 'network' | 'service';
  constructor(kind: 'auth' | 'network' | 'service', message: string) {
    super(message);
    this.kind = kind;
  }
}

export interface ServiceLayerRef {
  id: number;
  name: string;
  geometryType?: string;
}

export interface ServiceRoot {
  baseUrl: string;
  /** Set when the URL already points at one layer, e.g. .../FeatureServer/3 */
  directLayerId: number | null;
  layers: ServiceLayerRef[];
  tableCount: number;
  serviceDescription?: string;
}

export interface FieldInfo {
  name: string;
  alias: string;
  type: string;
}

export interface LayerDetails {
  id: number;
  name: string;
  geometryType: string;
  fields: FieldInfo[];
  maxRecordCount: number | null;
  wkid: number | null;
  extent: { xmin: number; ymin: number; xmax: number; ymax: number } | null;
  capabilities: string[];
  supportsPagination: boolean | null;
  description: string;
  copyright: string;
  lastEdit: number | null;
  count: number | null;
  queryUrl: string;
  layerUrl: string;
}

const GEOMETRY_LABELS: Record<string, string> = {
  esriGeometryPoint: 'Point',
  esriGeometryMultipoint: 'Multipoint',
  esriGeometryPolyline: 'Line',
  esriGeometryPolygon: 'Polygon',
  esriGeometryEnvelope: 'Envelope',
};

const FIELD_TYPE_LABELS: Record<string, string> = {
  esriFieldTypeOID: 'Object ID',
  esriFieldTypeString: 'Text',
  esriFieldTypeInteger: 'Integer',
  esriFieldTypeSmallInteger: 'Short integer',
  esriFieldTypeBigInteger: 'Big integer',
  esriFieldTypeDouble: 'Double',
  esriFieldTypeSingle: 'Float',
  esriFieldTypeDate: 'Date',
  esriFieldTypeGlobalID: 'Global ID',
  esriFieldTypeGUID: 'GUID',
  esriFieldTypeGeometry: 'Geometry',
  esriFieldTypeBlob: 'Blob',
  esriFieldTypeRaster: 'Raster',
  esriFieldTypeXML: 'XML',
};

export function geometryLabel(type?: string): string {
  if (!type) return 'Unknown';
  return GEOMETRY_LABELS[type] || type.replace('esriGeometry', '');
}

export function fieldTypeLabel(type: string): string {
  return FIELD_TYPE_LABELS[type] || type.replace('esriFieldType', '');
}

/** Strip query/hash and trailing slashes; upgrade http to https (mixed content is blocked). */
export function normalizeServiceUrl(raw: string): string {
  let url = raw.trim().split('#')[0].split('?')[0].replace(/\/+$/, '');
  if (url.startsWith('http://')) url = 'https://' + url.slice('http://'.length);
  return url;
}

async function getJson(url: string, signal?: AbortSignal): Promise<any> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: any) {
    if (err && err.name === 'AbortError') throw err;
    throw new InspectError(
      'network',
      'The service could not be reached from the browser. It may be offline, or it may block requests from other websites.'
    );
  }
  if (!response.ok) {
    throw new InspectError('service', `The server answered with HTTP ${response.status}.`);
  }
  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new InspectError('service', 'The server did not return valid ArcGIS JSON.');
  }
  // ArcGIS reports most failures as HTTP 200 with an "error" object.
  if (data && data.error) {
    const code = Number(data.error.code);
    if (code === 498 || code === 499 || code === 403) {
      throw new InspectError('auth', 'This service is private or needs a sign-in, so it cannot be inspected or downloaded here.');
    }
    throw new InspectError('service', data.error.message || 'The service returned an error.');
  }
  return data;
}

/** Read a service root (or a single layer URL) and list its layers. */
export async function inspectServiceRoot(rawUrl: string, signal?: AbortSignal): Promise<ServiceRoot> {
  const url = normalizeServiceUrl(rawUrl);
  const layerMatch = url.match(/^(.*\/(?:FeatureServer|MapServer))\/(\d+)$/i);
  if (layerMatch) {
    return {
      baseUrl: layerMatch[1],
      directLayerId: Number(layerMatch[2]),
      layers: [{ id: Number(layerMatch[2]), name: 'Layer ' + layerMatch[2] }],
      tableCount: 0,
    };
  }

  const data = await getJson(`${url}?f=json`, signal);
  const layers: ServiceLayerRef[] = (data.layers || [])
    // Skip group layers (they only contain other layers).
    .filter((l: any) => !(Array.isArray(l.subLayerIds) && l.subLayerIds.length > 0))
    .map((l: any) => ({ id: Number(l.id), name: String(l.name || `Layer ${l.id}`), geometryType: l.geometryType }));

  return {
    baseUrl: url,
    directLayerId: null,
    layers,
    tableCount: Array.isArray(data.tables) ? data.tables.length : 0,
    serviceDescription: data.serviceDescription || data.description || '',
  };
}

/** Read one layer's fields, limits and (when allowed) its feature count. */
export async function inspectLayer(
  baseUrl: string,
  layerId: number,
  signal?: AbortSignal
): Promise<LayerDetails> {
  const layerUrl = `${baseUrl}/${layerId}`;
  const data = await getJson(`${layerUrl}?f=json`, signal);

  const sr = data.extent?.spatialReference || data.spatialReference || {};
  const extent =
    data.extent && isFinite(data.extent.xmin)
      ? { xmin: data.extent.xmin, ymin: data.extent.ymin, xmax: data.extent.xmax, ymax: data.extent.ymax }
      : null;

  let count: number | null = null;
  try {
    const c = await getJson(`${layerUrl}/query?where=1%3D1&returnCountOnly=true&f=json`, signal);
    if (typeof c.count === 'number') count = c.count;
  } catch (err: any) {
    if (err && err.name === 'AbortError') throw err;
    // Count is optional: some services disable queries.
  }

  return {
    id: layerId,
    name: String(data.name || `Layer ${layerId}`),
    geometryType: geometryLabel(data.geometryType),
    fields: (data.fields || []).map((f: any) => ({
      name: String(f.name),
      alias: String(f.alias || f.name),
      type: String(f.type || ''),
    })),
    maxRecordCount: typeof data.maxRecordCount === 'number' ? data.maxRecordCount : null,
    wkid: sr.latestWkid || sr.wkid || null,
    extent,
    capabilities: String(data.capabilities || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean),
    supportsPagination:
      data.advancedQueryCapabilities && typeof data.advancedQueryCapabilities.supportsPagination === 'boolean'
        ? data.advancedQueryCapabilities.supportsPagination
        : null,
    description: String(data.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    copyright: String(data.copyrightText || ''),
    lastEdit: data.editingInfo && typeof data.editingInfo.lastEditDate === 'number' ? data.editingInfo.lastEditDate : null,
    count,
    layerUrl,
    queryUrl: `${layerUrl}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson`,
  };
}
