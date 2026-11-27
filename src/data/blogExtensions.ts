import type { BlogPost, ContentBlock } from '../types/blog';
import { GUIDE_POSTS } from './blogGuides';

/**
 * Additions to existing posts (inserted before the closing "Summary" section) and brand-new posts.
 * Kept separate from blogPosts.ts so the original text stays easy to read and edit.
 */
const h2 = (text: string): ContentBlock => ({ type: 'heading', level: 2, text });
const h3 = (text: string): ContentBlock => ({ type: 'heading', level: 3, text });
const p = (text: string): ContentBlock => ({ type: 'paragraph', text });
const ul = (items: string[]): ContentBlock => ({ type: 'list', items });
const ol = (items: string[]): ContentBlock => ({ type: 'list', ordered: true, items });
const code = (c: string): ContentBlock => ({ type: 'code', language: 'text', code: c });
const callout = (variant: 'info' | 'warning' | 'tip', title: string, text: string): ContentBlock => ({ type: 'callout', variant, title, text });

export const EXTENSIONS: Record<string, { modified: string; blocks: ContentBlock[] }> = {
  'how-to-find-free-parcel-data-us-counties': {
    modified: '2026-11-23',
    blocks: [
      h2('Statewide parcel layers: check these first'),
      p('Before you hunt through 50 county websites, search for a statewide layer. Some state agencies collect parcels from every county and publish one standardised dataset. Massachusetts (MassGIS), Texas (the TxGIO land parcel program) and Florida (the Department of Revenue) are well-known examples. Coverage, license terms and update frequency differ, so read the metadata page before you rely on one.'),
      p('If your state has no statewide layer, the state GIS clearinghouse usually still lists which counties publish parcels and links to them.'),
      h2('A search routine that works'),
      ol([
        'Search for "[county name] GIS open data" and "[county name] parcels" in Google. The first result is often the county\'s ArcGIS Hub or open data portal.',
        'On the portal, open the parcel dataset and use the "I want to use this" or "APIs" section to find the service URL. It usually ends in FeatureServer/0 or MapServer/0.',
        'If there is no portal, search the county\'s assessor and GIS pages for "GIS data download".',
        'Use the live search on our [US parcel data guide](/data/parcel-data) to see public ArcGIS services for your state, ranked by popularity.',
      ]),
      callout('tip', 'Tip', 'ArcGIS Hub portals often hide the service URL behind a "View API Resources" button. Copy the FeatureServer address from there and paste it into the Downloader.'),
      h2('Related US data guides'),
      p('Parcels are most useful when combined with other layers. See our guides to [zoning data](/data/zoning-data), [flood zone data](/data/flood-zone-data) and [Census boundaries](/data/census-boundaries), each with a live search for public layers in your state.'),
    ],
  },
  'wms-vs-wfs-choosing-the-right-web-service': {
    modified: '2026-11-23',
    blocks: [
      h2('You have a WMS link but need the data'),
      p('A common situation: someone sends a link like this, and you want to download the layer behind it.'),
      code('https://example.org/geoserver/city/wms?service=WMS&request=GetMap&version=1.1.1&layers=city%3Aboundary&format=image%2Fpng&srs=EPSG%3A3857&bbox=...'),
      p('That link returns a PNG picture of the map. There are no features in it, so it cannot be turned into a Shapefile. The good news is that servers that publish a WMS usually publish a WFS for the same layers next to it.'),
      h3('How to find the matching WFS'),
      ul([
        'GeoServer: change the end of the path from /wms to /wfs (or /ows). The layer name in the layers parameter, such as city:boundary, becomes the typeName of the feature type.',
        'MapServer and QGIS Server: the same URL with SERVICE=WFS usually works.',
        'ArcGIS Server: replace /WMSServer with /WFSServer, if the administrator has enabled the WFS capability.',
        'Test it by opening the address followed by ?service=WFS&request=GetCapabilities in your browser. If you get an XML document that lists FeatureType entries, the WFS exists.',
      ]),
      p('Our [Downloader](/download) does this swap for you. Paste the WMS link, and it looks for the WFS on the same server, picks the feature type that matches the layers parameter and loads it. If the server has no WFS, it tells you so, and then the only option is to ask the data owner for a download link.'),
      callout('info', 'Not every WMS has a WFS', 'Some servers publish a layer only as a picture on purpose, for example for licensing reasons. In that case no tool can extract the vector data from the WMS.'),
      h2('Can you use WMS and WFS together?'),
      p('Yes, and it is a common pattern in WebGIS development. Consider a zoning application: WMS displays the zoning map with its colours and symbols, while WFS provides the actual zoning polygons and attribute information. Users look at the map through WMS, and the application requests individual features through WFS only when someone needs detail or a spatial analysis. This combines fast visualisation with access to the underlying data.'),
      h2('How to connect WMS and WFS in QGIS'),
      p('QGIS can connect to both services from the Data Source Manager (Layer, then Data Source Manager).'),
      h3('Add a WMS layer'),
      ol([
        'Open QGIS and the Data Source Manager.',
        'Select WMS/WMTS.',
        'Click New and enter the WMS service URL.',
        'Connect to the service.',
        'Select a layer and click Add.',
      ]),
      h3('Add a WFS layer'),
      ol([
        'In the Data Source Manager, select WFS / OGC API - Features.',
        'Create a new connection using the WFS service URL.',
        'Connect to the server.',
        'Select the feature layer you need.',
        'Add it to your project.',
      ]),
      p('The WMS layer displays as a map image, while the WFS layer gives you vector features that you can inspect, filter and analyse in QGIS. Always check the server capabilities, output formats, access permissions and feature limits before requesting large datasets.'),
      p('For more detail on the standards, see the GeoServer reference pages for [WMS](https://docs.geoserver.org/main/en/user/services/wms/reference/) and [WFS](https://docs.geoserver.org/main/en/user/services/wfs/reference.html).'),
      h2('Find public WFS and ArcGIS services by topic'),
      p('If you are looking for datasets and not a specific link, our [parcel data by city](/data) page lists official layers for big US cities and counties, and the guides there cover zoning, flood zones, building footprints, Census boundaries and roads.'),
    ],
  },
  'how-to-extract-data-from-arcgis-online': {
    modified: '2026-11-23',
    blocks: [
      h2('Why the Export Data button is missing'),
      p('On an ArcGIS Online item page for a hosted feature layer, the Export Data menu appears only if the owner has allowed it. In the item\'s settings, the owner chooses whether others may export the data to different formats. If that setting is off, or if the layer is a view or a service that is not hosted on ArcGIS Online, there is no Export Data button even though the layer is public.'),
      p('This does not mean the data is locked. As long as the layer allows queries, the same features can be read through its REST endpoint, which is what the Downloader does. Always respect the data owner\'s license and terms of use.'),
      h2('Open data sites (Hub) and download buttons'),
      p('Many cities publish through ArcGIS Hub. A Hub dataset page often has a Download menu with prepared CSV, Shapefile, GeoJSON and KML files. Those files are generated from the same service and can lag behind the live data, so check the "last updated" date. If the Download menu is missing, look for the "APIs" section on the dataset page and copy the FeatureServer link.'),
      h2('Finding datasets by topic'),
      p('If you are not sure which layer to look for, the [US data guides](/data) on this site list the most requested datasets (parcels, zoning, flood zones, footprints, Census boundaries, roads), and [Discover](/discover) searches public ArcGIS Online services.'),
    ],
  },
};

/** New posts. The step-by-step converter guides live in blogGuides.ts. */
export const NEW_POSTS: BlogPost[] = [...GUIDE_POSTS];

/** Inserts extension blocks before the last heading of a post (its "Summary"/"Wrapping up"). */
export function applyExtensions(posts: BlogPost[]): BlogPost[] {
  const merged = posts.map((post) => {
    const ext = EXTENSIONS[post.slug];
    if (!ext) return post;
    let at = -1;
    post.content.forEach((b, i) => { if (b.type === 'heading' && b.level === 2) at = i; });
    const last = at >= 0 ? post.content[at] : undefined;
    const isClosing = last && last.type === 'heading' && /summary|wrapping|conclusion|final/i.test(last.text);
    const content = isClosing
      ? [...post.content.slice(0, at), ...ext.blocks, ...post.content.slice(at)]
      : [...post.content, ...ext.blocks];
    return { ...post, content, dateModified: ext.modified, readingTimeMinutes: post.readingTimeMinutes + 2 };
  });
  return [...merged, ...NEW_POSTS];
}
