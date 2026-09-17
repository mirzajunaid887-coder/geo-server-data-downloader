export async function fetchFeaturesBatch(url: string, objectIds: number[]): Promise<any[]> {
  const batchSize = 100;
  const features: any[] = [];

  for (let i = 0; i < objectIds.length; i += batchSize) {
    const chunk = objectIds.slice(i, i + batchSize);
    const queryUrl = `${url}/query?objectIds=${chunk.join(',')}&outFields=*&f=geojson`;
    
    try {
      const response = await fetch(queryUrl);
      const data = await response.json();
      if (data.features) {
        features.push(...data.features);
      }
    } catch (err) {
      console.error('Error fetching batch features:', err);
    }
  }

  return features;
}