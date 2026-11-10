import { cleanLayerUrl, fetchAllObjectIds, fetchFeaturesBatch } from './arcgis/query';

export interface ServiceMetadata {
  name: string;
  geometryType: string;
  objectIdField: string;
  fields: Array<{ name: string; type: string; alias: string }>;
  extent: any;
  spatialReference: { wkid: number; latestWkid?: number };
  maxRecordCount: number;
}

export interface DownloadOptions {
  geometry?: string; // Esri JSON geometry string or comma-separated bounding box
  geometryType?: string; // e.g. 'esriGeometryEnvelope', 'esriGeometryPolygon'
  spatialRel?: string; // e.g. 'esriSpatialRelIntersects'
  onProgress?: (fetched: number, total: number) => void;
}

/**
 * Step 1: Validate and fetch ArcGIS REST layer metadata
 */
export async function fetchLayerMetadata(serviceUrl: string): Promise<ServiceMetadata> {
  const response = await fetch(`${cleanLayerUrl(serviceUrl)}?f=json`);
  if (!response.ok) {
    throw new Error(`Failed to connect to ArcGIS service: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(`ArcGIS Error: ${data.error.message}`);
  }

  return {
    name: data.name || 'Exported_Layer',
    geometryType: data.geometryType || 'esriGeometryPolygon',
    objectIdField: data.objectIdField || 'OBJECTID',
    fields: data.fields || [],
    extent: data.extent,
    spatialReference: data.spatialReference || { wkid: 4326 },
    maxRecordCount: data.maxRecordCount || 1000,
  };
}

/**
 * Chunked ID download engine mirroring GeoDataDownloader's workflow.
 * Delegates to the shared engine in ./arcgis/query (ids -> pages of 200 ->
 * where OID IN (...) with f=json + outSR=4326 -> Esri JSON to GeoJSON on the client).
 */
export async function downloadAllFeatures(
  serviceUrl: string,
  options: DownloadOptions = {}
): Promise<any[]> {
  const ids = await fetchAllObjectIds(serviceUrl);
  if (ids.length === 0) return [];
  return fetchFeaturesBatch(serviceUrl, ids, options.onProgress);
}

/**
 * Helper to wrap retrieved features into a standard GeoJSON FeatureCollection
 */
export function createFeatureCollection(features: any[]) {
  return {
    type: 'FeatureCollection',
    features: features,
  };
}