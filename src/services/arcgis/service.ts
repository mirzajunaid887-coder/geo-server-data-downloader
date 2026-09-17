import { ArcGISLayerMetadata } from '../../types/arcgis';

export async function fetchArcGISMetadata(url: string): Promise<ArcGISLayerMetadata> {
  const cleanUrl = url.split('?')[0];
  const targetUrl = `${cleanUrl}?f=pjson`;
  
  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ArcGIS metadata: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(`ArcGIS Error: ${data.error.message || 'Unknown service error'}`);
  }
  return data;
}