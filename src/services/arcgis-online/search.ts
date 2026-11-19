import { ArcGISOnlineSearchResponse } from '../../types/arcgisOnline';

export type DiscoverTypeFilter = 'all' | 'feature' | 'map';
export type DiscoverSort = 'relevance' | 'views' | 'updated';

export interface SearchOptions {
  start?: number;
  num?: number;
  type?: DiscoverTypeFilter;
  sort?: DiscoverSort;
  signal?: AbortSignal;
}

const PORTAL_SEARCH = 'https://www.arcgis.com/sharing/rest/search';

function typeClause(type: DiscoverTypeFilter): string {
  if (type === 'feature') return 'type:"Feature Service"';
  if (type === 'map') return 'type:"Map Service"';
  return '(type:"Feature Service" OR type:"Map Service")';
}

/** Search public ArcGIS Online items that are downloadable services. */
export async function searchArcGISOnline(
  query: string,
  options: SearchOptions = {}
): Promise<ArcGISOnlineSearchResponse> {
  const { start = 1, num = 12, type = 'all', sort = 'relevance', signal } = options;

  const params = new URLSearchParams({
    q: `(${query}) AND ${typeClause(type)}`,
    num: String(num),
    start: String(start),
    f: 'json',
  });
  if (sort === 'views') {
    params.set('sortField', 'numviews');
    params.set('sortOrder', 'desc');
  } else if (sort === 'updated') {
    params.set('sortField', 'modified');
    params.set('sortOrder', 'desc');
  }

  const response = await fetch(`${PORTAL_SEARCH}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Failed to search ArcGIS Online.');
  }

  const data = await response.json();
  if (data && data.error) {
    throw new Error(data.error.message || 'ArcGIS Online returned an error.');
  }

  return {
    total: data.total || 0,
    start: data.start || start,
    num: data.num || num,
    nextStart: data.nextStart || -1,
    // Items without a service URL cannot be downloaded or inspected.
    results: (data.results || []).filter((r: { url?: string }) => !!r.url),
  };
}

export function thumbnailUrl(id: string, thumbnail?: string): string | null {
  if (!thumbnail) return null;
  return `https://www.arcgis.com/sharing/rest/content/items/${id}/info/${thumbnail}`;
}

export function itemPageUrl(id: string): string {
  return `https://www.arcgis.com/home/item.html?id=${id}`;
}
