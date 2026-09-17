export interface ArcGISField {
  name: string;
  type: string;
  alias: string;
  editable?: boolean;
  nullable?: boolean;
}

export interface ArcGISLayerMetadata {
  currentVersion: number;
  id: number;
  name: string;
  type: string;
  geometryType?: 'esriGeometryPoint' | 'esriGeometryPolyline' | 'esriGeometryPolygon' | 'esriGeometryMultipoint';
  extent?: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    spatialReference: { wkid: number; latestWkid?: number };
  };
  fields?: ArcGISField[];
  maxRecordCount?: number;
  supportsPagination?: boolean;
  supportsAdvancedQueries?: boolean;
}

export interface ArcGISFeature {
  attributes: Record<string, any>;
  geometry?: {
    x?: number;
    y?: number;
    paths?: number[][][];
    rings?: number[][][];
    points?: number[][];
  };
}