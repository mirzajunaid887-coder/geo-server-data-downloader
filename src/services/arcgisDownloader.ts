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
  const response = await fetch(`${serviceUrl}?f=json`);
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
 * Step 5 & 9: Chunked ID download engine mirroring GeoDataDownloader workflow
 * Retrieves Object IDs first, optionally filters by spatial geometry, then paginates 
 * through chunks safely to prevent payload truncation or server timeouts.
 */
export async function downloadAllFeatures(
  serviceUrl: string,
  options: DownloadOptions = {}
): Promise<any[]> {
  const metadata = await fetchLayerMetadata(serviceUrl);
  const objectIdField = metadata.objectIdField;

  // 1. Build query parameters to harvest Object IDs efficiently
  const idParams = new URLSearchParams({
    where: '1=1',
    returnIdsOnly: 'true',
    f: 'json',
  });

  if (options.geometry) {
    idParams.append('geometry', options.geometry);
    idParams.append('geometryType', options.geometryType || 'esriGeometryEnvelope');
    idParams.append('spatialRel', options.spatialRel || 'esriSpatialRelIntersects');
  }

  const idsRes = await fetch(`${serviceUrl}/query?${idParams.toString()}`);
  const idsData = await idsRes.json();

  if (idsData.error) {
    throw new Error(`ArcGIS Query Error: ${idsData.error.message}`);
  }

  const allObjectIds: number[] = idsData.objectIds || [];
  if (allObjectIds.length === 0) {
    return [];
  }

  const total = allObjectIds.length;
  const chunkSize = Math.min(metadata.maxRecordCount || 500, 500);
  const features: any[] = [];

  // 2. Page through Object IDs in safe chunks
  for (let i = 0; i < total; i += chunkSize) {
    const chunkIds = allObjectIds.slice(i, i + chunkSize);
    
    const queryParams = new URLSearchParams({
      where: `${objectIdField} IN (${chunkIds.join(',')})`,
      outFields: '*',
      outSR: metadata.spatialReference.wkid.toString(),
      f: 'geojson', // Request pristine GeoJSON format preserving original attributes and CRS
    });

    const chunkRes = await fetch(`${serviceUrl}/query`, {
      method: 'POST',
      body: queryParams,
    });
    const chunkJson = await chunkRes.json();

    if (chunkJson.features) {
      features.push(...chunkJson.features);
    }

    if (options.onProgress) {
      options.onProgress(Math.min(i + chunkSize, total), total);
    }
  }

  return features;
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