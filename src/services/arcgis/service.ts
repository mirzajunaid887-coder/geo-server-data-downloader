import { ArcGISLayerMetadata } from '../../types/arcgis';
import { cleanLayerUrl } from './query';

export async function fetchArcGISMetadata(url: string): Promise<ArcGISLayerMetadata> {
  const cleanUrl = cleanLayerUrl(url);
  const targetUrl = `${cleanUrl}?f=pjson`;
  
  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ArcGIS metadata: ${response.statusText}`);
  }
  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      'This link did not return ArcGIS data (it returned a web page or XML). Paste an ArcGIS FeatureServer / MapServer layer URL, ' +
        'or a WFS link (ending in /wfs or /ows). WMS links only draw pictures and cannot be downloaded.'
    );
  }
  if (data.error) {
    throw new Error(`ArcGIS Error: ${data.error.message || 'Unknown service error'}`);
  }
  return data;
}