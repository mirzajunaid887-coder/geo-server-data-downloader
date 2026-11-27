import type { BlogPost, ContentBlock } from '../types/blog';

/**
 * Content-quality policy for the blog.
 *
 * Posts shorter than MIN_INDEXABLE_WORDS are treated as "drafts in public":
 *   - they stay reachable by URL, but are noindex,
 *   - they show no ads (AdSense policy: no ads on low-value pages),
 *   - they are left out of the sitemap, the blog index and "related posts".
 * The moment a post is expanded past the threshold it is indexed, listed and
 * monetised automatically - there is nothing else to change.
 */
export const MIN_INDEXABLE_WORDS = 550;

/**
 * Overlapping posts that were merged into a stronger guide.
 * old slug -> slug that now covers the topic.
 * IMPORTANT: keep vercel.json "redirects" in sync (the build checks this).
 */
export const REDIRECTED_SLUGS: Record<string, string> = {
  'how-to-download-data-from-arcgis-rest-services': 'how-to-download-arcgis-rest-featureserver-data',
  'how-to-use-the-arcgis-rest-api-query-endpoint': 'how-to-use-arcgis-rest-api-query-parameters',
  'understanding-coordinate-reference-systems-in-depth': 'understanding-coordinate-systems-and-projections',
  'how-to-access-public-parcel-data-via-gis': 'how-to-find-free-parcel-data-us-counties',
  'using-wfs-to-download-spatial-data': 'complete-guide-wfs-web-feature-service',
  'geopackage-vs-shapefile-the-modern-standard': 'geojson-vs-shapefile-vs-geopackage',
  'mastering-shapefile-to-geojson-conversion': 'convert-shapefile-to-geojson-online',
  'convert-geopdf-to-geotiff': 'how-to-convert-geopdf-to-geotiff',
  'free-gis-data-sources-for-environmental-analysis': 'ten-free-gis-data-sources-every-analyst-should-know',
};

const textOf = (block: ContentBlock): string => {
  const b = block as any;
  switch (b.type) {
    case 'list':
      return (b.items ?? []).join(' ');
    case 'table':
      return [...(b.headers ?? []), ...(b.rows ?? []).flat()].join(' ');
    case 'code':
      return '';
    default:
      return b.text ?? '';
  }
};

export function countWords(post: BlogPost): number {
  return post.content
    .map(textOf)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function isIndexable(post: BlogPost): boolean {
  return !REDIRECTED_SLUGS[post.slug] && countWords(post) >= MIN_INDEXABLE_WORDS;
}
