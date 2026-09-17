export async function fetchObjectIds(serviceUrl: string, whereClause: string = '1=1'): Promise<number[]> {
  const cleanUrl = serviceUrl.split('?')[0];
  const queryUrl = `${cleanUrl}/query?where=${encodeURIComponent(whereClause)}&returnIdsOnly=true&f=pjson`;

  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error('Failed to retrieve Object IDs from ArcGIS service.');
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(`Object ID fetch error: ${data.error.message}`);
  }
  return data.objectIds || [];
}