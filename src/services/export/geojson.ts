import { ArcGISFeature } from '../../types/arcgis';

export function convertArcGISFeaturesToGeoJSON(features: ArcGISFeature[]): GeoJSON.FeatureCollection {
  const geojsonFeatures: GeoJSON.Feature[] = features.map((f, idx) => {
    let geometry: GeoJSON.Geometry | null = null;

    if (f.geometry) {
      if (typeof f.geometry.x === 'number' && typeof f.geometry.y === 'number') {
        geometry = {
          type: 'Point',
          coordinates: [f.geometry.x, f.geometry.y],
        };
      } else if (f.geometry.rings) {
        geometry = {
          type: 'Polygon',
          coordinates: f.geometry.rings,
        };
      } else if (f.geometry.paths) {
        geometry = {
          type: 'LineString',
          coordinates: f.geometry.paths[0],
        };
      }
    }

    return {
      type: 'Feature',
      id: idx,
      properties: f.attributes || {},
      geometry: geometry || { type: 'Point', coordinates: [0, 0] },
    };
  });

  return {
    type: 'FeatureCollection',
    features: geojsonFeatures,
  };
}