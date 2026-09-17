export interface ArcGISOnlineItem {
  id: string;
  title: string;
  description?: string;
  snippet?: string;
  owner: string;
  created: number;
  modified: number;
  guid?: string;
  name?: string;
  type: string;
  typeKeywords: string[];
  url?: string;
  tags: string[];
  thumbnail?: string;
  extent?: number[][];
  access: string;
  numViews: number;
}

export interface ArcGISOnlineSearchResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: ArcGISOnlineItem[];
}