declare module '@terraformer/arcgis' {
  export function arcgisToGeoJSON(arcgis: any, idAttribute?: string): any;
  export function geojsonToArcGIS(geojson: any, idAttribute?: string): any;
}
