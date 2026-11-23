import type { BlogPost, ContentBlock } from '../types/blog';

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

export const NEW_POSTS: BlogPost[] = [
  {
    slug: 'convert-geopdf-to-geotiff',
    title: 'How to Convert a GeoPDF to a GeoTIFF (Keep the Projection)',
    description:
      'What a GeoPDF is, how its georeferencing works, and how to convert each page and inset map to a GeoTIFF that keeps the same coordinate system. Free, in your browser.',
    keywords: 'convert GeoPDF to GeoTIFF, GeoPDF to GeoTIFF online, GeoPDF georeferencing, PDF to GeoTIFF with projection, ArcGIS PDF export GeoTIFF',
    author: 'Muhammad Junaid Baig',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    readingTimeMinutes: 7,
    category: 'Tutorial',
    tags: ['GeoPDF', 'GeoTIFF', 'Raster', 'Tutorial'],
    excerpt: 'A GeoPDF is a map that knows where it is. Here is how to turn it into a GeoTIFF that lines up with your other layers.',
    content: [
      p('A GeoPDF looks like any PDF map, but it also stores where on Earth the map sits. GIS programs such as ArcGIS Pro, ArcMap and QGIS can export one, and organisations often send maps in this format because anyone can open it in a normal PDF reader. The problem starts when you want to use the map as a layer. A plain PDF has no place in a GIS project, and a GeoPDF only works as a layer in programs that read the georeferencing.'),
      p('Converting the GeoPDF to a GeoTIFF solves this. A GeoTIFF is an image that carries its coordinate system and position, so it opens in any GIS, web mapping library or image tool that supports GeoTIFF.'),
      h2('How a GeoPDF stores its location'),
      p('The PDF standard defines a way to attach a coordinate system to part of a page. A page can hold one or more "viewports", each one a rectangle on the page that is georeferenced. For each viewport the file stores three things:'),
      ul([
        'The rectangle of the map area on the page, in PDF points (1/72 inch).',
        'A coordinate system, usually written as WKT text, for example an Albers or UTM projection.',
        'Control points that pair positions on the page with latitude and longitude values.',
      ]),
      p('That is why a single page can contain several georeferenced maps, such as a main map plus insets for Alaska and Hawaii. Each viewport has its own control points and sometimes its own projection.'),
      h2('What the conversion does'),
      ol([
        'Reads every page of the PDF and lists each georeferenced viewport.',
        'Draws the chosen viewport as an image at the resolution you pick (DPI).',
        'Converts the control points into the PDF\'s own coordinate system and fits the position of the image to them.',
        'Writes a GeoTIFF with that coordinate system and extent.',
      ]),
      callout('info', 'It is an image of the map', 'The GeoTIFF is a picture of what the PDF shows. Vector lines, polygons and text are not rebuilt as data, and PDF layers are merged into one image.'),
      h2('Convert a GeoPDF to GeoTIFF with this site'),
      ol([
        'Open the [GeoPDF to GeoTIFF converter](/geopdf-to-geotiff).',
        'Upload the PDF. The tool reads every page and lists each map and inset it finds.',
        'Tick the maps you want, or leave them all ticked to convert everything.',
        'Choose a resolution. 150 DPI is a good start. Use 300 DPI or more when you need fine detail.',
        'Press Convert, then download each GeoTIFF or all of them as one ZIP.',
      ]),
      p('The file never leaves your computer. The conversion happens in your browser, so even large or sensitive maps stay private.'),
      h2('Choosing the resolution'),
      p('The pixel size on the ground depends on the map scale and the DPI. A national map at 150 DPI has pixels of several kilometres, which is fine for an overview. A city map at 300 DPI has pixels of a few metres. Higher DPI makes the file larger without adding information the PDF does not contain, so test a low value first and increase it only if the result is too coarse.'),
      h2('Check the result in your GIS'),
      ul([
        'Open the GeoTIFF with a known reference layer, such as state boundaries or a basemap, and check that features line up.',
        'Look at the layer properties to confirm the coordinate system matches the PDF.',
        'If the position is off, the PDF may have been georeferenced with a different datum than expected. Try the layer in the PDF\'s original software to compare.',
      ]),
      h2('What it cannot convert'),
      ul([
        'PDFs with no georeferencing. If the export option "Georeference information" was turned off, the PDF holds only a picture.',
        'Scanned maps. A scan has no embedded location, so it must be georeferenced in a GIS first.',
        'Older TerraGo-style GeoPDFs. They use a different internal structure.',
      ]),
      h2('Related tools'),
      p('To pull the actual vector data instead of a picture, use the [Downloader](/download) with the data source behind the map. To convert vector formats, use the [Converter](/converter). For help finding the data, see our [US data guides](/data).'),
      h2('Frequently asked questions'),
      h3('Does the GeoTIFF use the same projection as the PDF?'),
      p('Yes. The coordinate system stored in the PDF is written into the GeoTIFF.'),
      h3('Can I convert a PDF with many pages?'),
      p('Yes. Pick the pages and insets you want, or convert all of them in one run.'),
      h3('Why is my output so large?'),
      p('The image size depends on the page size and DPI. Lower the DPI to make the file smaller.'),
    ],
  },
];

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
