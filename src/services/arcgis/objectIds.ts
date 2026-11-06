// src/services/arcgis/objectIds.ts
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

export async function fetchObjectIds(url: string): Promise<number[]> {
  try {
    const layer = new FeatureLayer({ url });
    await layer.load();
    
    // GDD uses queryObjectIds with where: "1=1"
    const ids = await layer.queryObjectIds({ where: '1=1' });
    return ids || [];
  } catch (error) {
    console.error('Failed to fetch Object IDs:', error);
    throw error;
  }
}