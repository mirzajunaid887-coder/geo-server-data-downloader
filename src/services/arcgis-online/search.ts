import { ArcGISOnlineSearchResponse } from '../../types/arcgisOnline';

export async function searchArcGISOnline(
  query: string,
  start: number = 1,
  num: number = 10
): Promise<ArcGISOnlineSearchResponse> {
  const portalUrl = 'https://www.arcgis.com/sharing/rest/search';
  const q = encodeURIComponent(`${query} AND (type:"Feature Service" OR type:"Map Service")`);
  const targetUrl = `${portalUrl}?q=${q}&num=${num}&start=${start}&f=json`;

  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error('Failed to search ArcGIS Online.');
  }

  const data = await response.json();
  return {
    total: data.total || 0,
    start: data.start || start,
    num: data.num || num,
    nextStart: data.nextStart || -1,
    results: data.results || [],
  };
}