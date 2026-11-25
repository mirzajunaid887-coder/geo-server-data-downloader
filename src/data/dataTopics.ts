import type { ContentBlock } from '../types/blog';

/**
 * US data guides. Each topic page = the written guide below + a LIVE search of public ArcGIS Online
 * services (so the list of datasets is never hard-coded and never goes stale).
 * To add a topic: add an entry here. The page, index, sitemap and prerender pick it up automatically.
 */
export interface DataTopic {
  slug: string;
  title: string; // <title> and card title
  h1: string;
  description: string; // meta description
  keywords: string;
  datePublished: string;
  dateModified: string;
  /** ArcGIS Online search term; the chosen state is appended */
  searchTerm: string;
  /** a result must contain one of these (lower-case fragments) in its title, tags or summary to be shown */
  matchWords: string[];
  /** one-line summary for cards */
  summary: string;
  intro: string;
  content: ContentBlock[];
  faqs: { q: string; a: string }[];
  relatedPosts: string[]; // blog slugs
  relatedTopics: string[]; // topic slugs
}

const p = (text: string): ContentBlock => ({ type: 'paragraph', text });
const h2 = (text: string): ContentBlock => ({ type: 'heading', level: 2, text });
const ul = (items: string[]): ContentBlock => ({ type: 'list', items });
const ol = (items: string[]): ContentBlock => ({ type: 'list', ordered: true, items });

const HOW_TO = (what: string): ContentBlock[] => [
  h2(`How to download ${what} with this tool`),
  ol([
    'Pick your state in the live search above, or search [Discover](/discover) for the county or city name.',
    'Press "Add to map" on a result. The layer loads on the Downloader map so you can check that it covers the right area.',
    'Open "Inspect" first if you are unsure. It shows the field names, geometry type and feature count, and whether the service allows queries.',
    'Export one layer as GeoJSON, or use Bulk Export for Shapefile, GeoPackage, KML, CSV and more. Large layers are fetched in batches, so the 1,000 to 2,000 feature limit of a web viewer does not apply.',
  ]),
];

export const DATA_TOPICS: DataTopic[] = [
  {
    slug: 'parcel-data',
    title: 'Free US Parcel Data Download (County & State GIS Layers)',
    h1: 'US Parcel Data: Find and Download Parcel Boundaries',
    description:
      'Find public parcel boundary layers for any US state or county and download them as Shapefile, GeoJSON or GeoPackage. Live search of ArcGIS services plus a practical guide.',
    keywords: 'free parcel data download, US parcel data GIS, county parcel shapefile, parcel boundaries GIS, download parcel data by county, property boundary shapefile',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    searchTerm: 'parcels',
    matchWords: ['parcel', 'cadastr', 'tax lot', 'taxlot', 'assessor', 'property', 'lot line'],
    summary: 'Property boundaries with parcel IDs, addresses and land-use codes.',
    intro:
      'Parcel data shows the legal property lots that make up a county. It is the base layer for real estate analysis, zoning work, utilities and site selection. There is no single free national parcel file, so you find it county by county or, in some states, as one statewide layer.',
    content: [
      h2('Who publishes parcel data'),
      p('Parcels are created and maintained locally, usually by the county assessor, recorder or GIS office. Many publish them through an ArcGIS Online or ArcGIS Server service, which is exactly what this downloader reads. A few states also assemble a statewide layer from the counties, so it is worth searching for your state name first.'),
      p('Because every county maintains its own data, quality and update frequency differ a lot. Some counties update weekly, others once a year after the tax roll closes.'),
      h2('What fields to expect'),
      ul([
        'A parcel identifier. It may be called APN, PIN, PARCELID or similar, and its format is different in every county.',
        'Site (situs) address, and sometimes the mailing address.',
        'Acreage or shape area. Treat the geometry area and the recorded acreage as two separate values that may not match.',
        'Land use or property class codes. These are local codes, so read the county\'s code list before comparing counties.',
        'Assessed value and year, when the county includes tax data.',
        'Owner name. Some counties remove it from public GIS layers for privacy reasons.',
      ]),
      ...HOW_TO('parcel data'),
      h2('Checks before you rely on the data'),
      ul([
        'Look at the update date on the item page. A layer from several years ago may miss new subdivisions.',
        'Read the terms of use. Parcel data is public in many places, but some counties restrict resale or bulk use.',
        'Check the coordinate system with Inspect. Parcel layers are often in a State Plane system, and the downloader keeps the service\'s spatial reference when it can.',
        'Do not treat parcel lines as a legal survey. They are an index map and can be off by several feet.',
      ]),
      h2('Parcel data for big cities'),
      p('Looking for a specific metro area? See [parcel data for big US cities](/data): official sources for New York, Chicago (Cook County), Houston and Phoenix (Maricopa County), with live field lists.'),
      h2('Combining parcels with other data'),
      p('Parcels become more useful when you join them with zoning, flood zones or Census data. For a first pass, download each layer to GeoPackage or GeoJSON and overlay them in QGIS or ArcGIS Pro. Make sure all layers use the same coordinate system before you run any spatial join.'),
    ],
    faqs: [
      { q: 'Is there a free nationwide parcel dataset?', a: 'No official free nationwide parcel file exists. Parcels come from individual counties and a few statewide programs, which is why the live search above is organised by state. Commercial vendors sell national parcel coverage.' },
      { q: 'Can I download parcels for a whole county?', a: 'Yes, if the county publishes a feature service that allows queries. The downloader fetches the full layer in batches. The Inspect panel shows the feature count first, so you know what to expect.' },
      { q: 'Does parcel data include the owner name?', a: 'It depends on the county. Many include it, some remove it for privacy, and others only show it through a separate property search website.' },
      { q: 'What format should I choose?', a: 'GeoPackage for large layers or long field names, Shapefile for older software, GeoJSON for web maps. Shapefile field names are cut to 10 characters.' },
    ],
    relatedPosts: ['how-to-find-free-parcel-data-us-counties', 'how-to-filter-arcgis-data-before-downloading', 'geojson-vs-shapefile-vs-geopackage'],
    relatedTopics: ['zoning-data', 'census-boundaries', 'flood-zone-data', 'building-footprints', 'roads-data'],
  },
  {
    slug: 'zoning-data',
    title: 'Free Zoning Data Download for US Cities & Counties (GIS)',
    h1: 'US Zoning Data: Find and Download Zoning District Layers',
    description:
      'Find public zoning district layers for US cities and counties and download them as Shapefile, GeoJSON or GeoPackage. Live search plus a guide to zoning codes and fields.',
    keywords: 'zoning data download, zoning shapefile, city zoning GIS data, zoning map data, download zoning districts, US zoning GIS layer',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    searchTerm: 'zoning',
    matchWords: ['zon'],
    summary: 'Zoning districts and overlays from city and county planning offices.',
    intro:
      'Zoning layers show which districts a city or county has mapped, such as residential, commercial or industrial, and which rules apply in each. They are used for site selection, due diligence and planning studies. Zoning is set locally, so data comes from individual cities and counties.',
    content: [
      h2('Why zoning data is hard to compare'),
      p('Every jurisdiction writes its own zoning code. One city may call a single-family district R-1, another may use RS-7 or SF-6, and the number can refer to minimum lot size, density or just a sequence. A zone code alone tells you very little until you read the local ordinance.'),
      p('Zone boundaries are also not the same as parcel lines. A zoning polygon can split a parcel, and overlay districts (historic, airport, floodplain) sit on top of the base zone.'),
      h2('Typical fields'),
      ul([
        'Zone code or district name, for example R-1 or C-2.',
        'A longer description, such as "Single Family Residential".',
        'A general category, when the city has added one (residential, commercial, industrial, mixed use).',
        'Ordinance or adoption date, and sometimes a link to the code section.',
        'Overlay or special district flags.',
      ]),
      ...HOW_TO('zoning data'),
      h2('Use zoning data responsibly'),
      ul([
        'A GIS layer is an informational map. The adopted ordinance and the official zoning map decide what is legal. Confirm with the planning department before you buy or build.',
        'Check the layer date. Cities rezone regularly, and an old copy can be wrong for a given parcel.',
        'Many places publish zoning only at city level. If a county covers unincorporated land, you may need two layers to cover one area.',
        'When you merge layers from different cities, keep the source name in a field so the codes stay traceable.',
      ]),
      h2('A simple workflow for site screening'),
      p('Download the zoning layer and the parcel layer for the same area, overlay them in a GIS, and use a spatial join to attach the zone code to each parcel. Then filter by the codes that allow your use. Always sample a few results against the city\'s own map to confirm that the join is working.'),
    ],
    faqs: [
      { q: 'Where can I get zoning data for my city?', a: 'Start with the city or county open data portal and the planning department\'s GIS page. The live search above looks for public zoning services on ArcGIS Online, which many cities use.' },
      { q: 'Is there a national zoning dataset?', a: 'There is no official free national zoning layer. Because every jurisdiction defines its own codes, national collections are either commercial or incomplete.' },
      { q: 'Is a downloaded zoning layer legally binding?', a: 'No. Treat it as a reference. The adopted zoning ordinance and the official map from the local government are the authority.' },
      { q: 'Why are the zone codes different from city to city?', a: 'Each local government writes its own code. Compare categories and read the ordinance, not just the letters.' },
    ],
    relatedPosts: ['how-to-download-municipal-zoning-data', 'how-to-find-free-parcel-data-us-counties', 'how-to-filter-arcgis-data-before-downloading'],
    relatedTopics: ['parcel-data', 'flood-zone-data', 'census-boundaries', 'building-footprints'],
  },
  {
    slug: 'flood-zone-data',
    title: 'Flood Zone Data Download: FEMA Flood Hazard Layers for GIS',
    h1: 'Flood Zone Data: Find and Download Flood Hazard Layers',
    description:
      'Find FEMA and local flood hazard zone layers (SFHA, AE, X zones) and download them as GeoJSON, Shapefile or GeoPackage. Live search plus a guide to flood zone fields.',
    keywords: 'flood zone data download, FEMA flood hazard shapefile, NFHL download, flood zones GIS layer, special flood hazard area data, FEMA flood map GIS',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    searchTerm: 'flood hazard zones',
    matchWords: ['flood', 'nfhl', 'sfha', 'fema'],
    summary: 'FEMA flood zones and local floodplain layers.',
    intro:
      'Flood hazard layers show areas with a mapped risk of flooding. In the US the main source is FEMA\'s National Flood Hazard Layer (NFHL), which is built from Flood Insurance Rate Maps. Cities and counties also publish their own floodplain layers.',
    content: [
      h2('What the NFHL contains'),
      p('FEMA publishes the NFHL as a set of GIS layers, including flood hazard zones, base flood elevations, flood zone cross-sections and community boundaries. FEMA offers it as a map service and as downloads, and local governments often republish the part for their area.'),
      h2('Flood zone codes in plain language'),
      ul([
        'Zones starting with A (A, AE, AH, AO) are Special Flood Hazard Areas, which have a 1 percent or greater chance of flooding in any year.',
        'Zones starting with V (VE) are coastal high-hazard areas with added wave action.',
        'Zone X marks moderate or minimal flood hazard areas. FEMA separates "shaded X" from "unshaded X" using the field that describes the zone subtype.',
        'The field FLD_ZONE usually holds the code, and SFHA_TF tells you whether the area is a Special Flood Hazard Area.',
      ]),
      p('Field names can vary when a county republishes the layer, so use Inspect to see what the service actually exposes.'),
      ...HOW_TO('flood zone data'),
      h2('Common mistakes'),
      ul([
        'Using flood zones as a flood prediction. They describe regulatory mapping, and real flooding can happen outside the mapped area.',
        'Ignoring the effective date. Maps are revised, and a revised map can change the zone of a property.',
        'Mixing a local floodplain layer with the FEMA layer without checking which one your lender or permit office uses.',
        'Forgetting that very large national layers are slow. Filter to your county or area first. See the guide to [filtering before downloading](/blog/how-to-filter-arcgis-data-before-downloading).',
      ]),
    ],
    faqs: [
      { q: 'Where does flood zone data come from?', a: 'Mainly from FEMA\'s National Flood Hazard Layer. Counties and cities may publish their own floodplain layers too.' },
      { q: 'What is the difference between zone AE and zone X?', a: 'AE is a Special Flood Hazard Area with a mapped base flood elevation. Zone X is outside the Special Flood Hazard Area and has a lower mapped risk.' },
      { q: 'Can I download flood zones for one county only?', a: 'Yes. Filter the layer by county or area before exporting, or choose a county-level service from the live search.' },
      { q: 'Is the flood zone map enough to decide on flood insurance?', a: 'No. Ask your insurer or the local floodplain administrator. This tool only gives you the data.' },
    ],
    relatedPosts: ['how-to-filter-arcgis-data-before-downloading', 'how-to-download-arcgis-rest-featureserver-data', 'understanding-coordinate-systems-and-projections'],
    relatedTopics: ['parcel-data', 'zoning-data', 'census-boundaries', 'building-footprints', 'roads-data'],
  },
  {
    slug: 'building-footprints',
    title: 'Building Footprint Data Download for GIS (US & Local Layers)',
    h1: 'Building Footprints: Find and Download Building Outlines',
    description:
      'Find building footprint layers for US cities and counties and download them as GeoJSON, Shapefile or GeoPackage. Live search plus a guide to sources, fields and file size.',
    keywords: 'building footprints download, building footprint shapefile, building outlines GIS data, US building footprints, download building polygons',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    searchTerm: 'building footprints',
    matchWords: ['building', 'footprint', 'structure'],
    summary: 'Building outlines from cities, counties and open datasets.',
    intro:
      'Building footprints are polygons that outline the roof or base of each building. They are used for population estimates, solar studies, risk analysis and basemaps. Many local governments publish them, and there are also large open datasets.',
    content: [
      h2('Where footprints come from'),
      ul([
        'Local governments, who digitise footprints from aerial photos or lidar. These often carry useful attributes such as height or building type.',
        'Open datasets built with machine learning from aerial imagery, such as Microsoft\'s US building footprints and the Overture Maps buildings theme. They cover large areas but have fewer attributes and can contain errors.',
        'OpenStreetMap, where volunteers trace buildings. Coverage is excellent in some places and patchy in others.',
      ]),
      p('This downloader reads services that are published as ArcGIS or WFS endpoints. For the very large open datasets, which are published as file downloads, use the vendor\'s files and then bring the result into the [Converter](/converter) if you need another format.'),
      h2('What you usually get'),
      ul([
        'A polygon per building, sometimes with a unique ID.',
        'Optional height, floors, building use, year built or address.',
        'Source and capture date fields. Check these before comparing areas.',
      ]),
      ...HOW_TO('building footprints'),
      h2('Handling large footprint layers'),
      p('A city can have hundreds of thousands of buildings. Check the feature count with Inspect first, and filter to a neighbourhood or tile if you only need part of it. GeoPackage is the best format for big layers because it has no field name limit and handles large sizes well.'),
      p('If you plan to calculate area, reproject the layer to an equal-area or local projected coordinate system first. Areas calculated in degrees are meaningless.'),
    ],
    faqs: [
      { q: 'Are building footprints free?', a: 'Many are. City and county layers are often open data, and large open datasets are free to download, but each has its own license, so read it first.' },
      { q: 'Do footprints include building height?', a: 'Some local layers do. Machine-learning datasets usually do not, or include it only for part of the area.' },
      { q: 'How do I download footprints for just one city?', a: 'Search for the city in Discover, load the layer, and filter or export the full layer if it is already city-sized.' },
      { q: 'Which file format is best for millions of footprints?', a: 'GeoPackage. Shapefile has a 2 GB limit and short field names, and GeoJSON gets very large.' },
    ],
    relatedPosts: ['downloading-openstreetmap-data-for-gis', 'geojson-vs-shapefile-vs-geopackage', 'how-to-filter-arcgis-data-before-downloading'],
    relatedTopics: ['parcel-data', 'roads-data', 'flood-zone-data', 'zoning-data'],
  },
  {
    slug: 'census-boundaries',
    title: 'Census Boundary Data: Download Tracts, Block Groups & Counties',
    h1: 'Census Boundaries: Tracts, Block Groups, Counties and More',
    description:
      'Find US Census boundary layers (states, counties, tracts, block groups) as GIS data, and learn how GEOIDs join them to Census statistics. Live search and a practical guide.',
    keywords: 'census tract shapefile download, census block group boundaries GIS, TIGER/Line download, census boundaries GIS, GEOID join census data, county boundaries shapefile',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    searchTerm: 'census tracts',
    matchWords: ['census', 'tract', 'block group', 'tiger', 'boundar', 'demograph'],
    summary: 'States, counties, tracts and block groups, with GEOIDs for joins.',
    intro:
      'Census boundaries are the polygons behind population and demographic statistics. The US Census Bureau publishes them as TIGER/Line shapefiles and as simplified cartographic boundary files. Many agencies republish them as web services.',
    content: [
      h2('The geographic hierarchy'),
      p('The main levels are state, county, census tract, block group and block. Each level nests inside the one above it. Tracts and block groups are the usual choice for neighbourhood-scale analysis because the Bureau publishes detailed statistics for them.'),
      h2('TIGER/Line or cartographic boundary files?'),
      ul([
        'TIGER/Line files follow the legal and map-feature geometry. They include water areas and are best for accurate analysis.',
        'Cartographic boundary files are generalised and clipped to the shoreline, so they look better on maps and are smaller.',
      ]),
      h2('Joining boundaries to Census statistics'),
      p('Each boundary has a GEOID field, which is a code built from the state, county and tract numbers. Statistics from the Census Bureau use the same GEOID, so a join on GEOID attaches population or income to each polygon. Keep the GEOID as text, because a leading zero in the state code is lost if a spreadsheet converts it to a number.'),
      ...HOW_TO('Census boundaries'),
      h2('Things to know'),
      ul([
        'Boundaries change every ten years with the decennial census and can change slightly in between. Always match the boundary vintage to the year of the statistics.',
        'Census data uses the NAD83 geographic coordinate system by default. Reproject to a projected system before measuring area or distance.',
        'Tract and block group counts are large for a state, so filter by county if you only need part of it.',
      ]),
    ],
    faqs: [
      { q: 'What is a GEOID?', a: 'A numeric code that uniquely identifies a Census geography. It is built from the state, county, tract and block group codes and is the key for joining statistics.' },
      { q: 'Where do the official files come from?', a: 'The US Census Bureau publishes TIGER/Line shapefiles and cartographic boundary files. Many local agencies republish them as web services, which the live search can find.' },
      { q: 'Why did my join lose some rows?', a: 'Usually the GEOID was stored as a number and lost its leading zero, or the boundary year does not match the statistics year.' },
      { q: 'Which is better for maps: TIGER/Line or cartographic boundaries?', a: 'Cartographic boundary files, because they are generalised and clipped to the shoreline. Use TIGER/Line when you need the full geometry.' },
    ],
    relatedPosts: ['how-to-download-census-data-for-gis-analysis', 'understanding-coordinate-systems-and-projections', 'ten-free-gis-data-sources-every-analyst-should-know'],
    relatedTopics: ['parcel-data', 'roads-data', 'zoning-data'],
  },
  {
    slug: 'roads-data',
    title: 'Road Centerline Data Download for GIS (Streets & Highways)',
    h1: 'Road Data: Find and Download Street Centerlines',
    description:
      'Find road centerline layers for US cities, counties and states and download them as Shapefile, GeoJSON or GeoPackage. Live search plus a guide to sources and fields.',
    keywords: 'road centerline shapefile download, street centerlines GIS, roads GIS data free, US roads shapefile, highway data GIS, download road network',
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
    searchTerm: 'road centerlines',
    matchWords: ['road', 'street', 'centerline', 'highway', 'transport'],
    summary: 'Streets and highways as line layers for mapping and routing.',
    intro:
      'Road layers are line features that represent streets, highways and ramps. They are used for mapping, address work, emergency services and network analysis. Sources include city and county GIS offices, state transportation departments, the Census Bureau and OpenStreetMap.',
    content: [
      h2('Which source fits your project'),
      ul([
        'Local centerlines from a city or county are the most detailed and usually include street names, address ranges and road classes.',
        'State transportation departments publish statewide road layers, often with route numbers and traffic counts.',
        'The Census Bureau\'s TIGER/Line roads are nationwide and consistent, but less detailed than local data.',
        'OpenStreetMap has global coverage and is good for routing, but its quality depends on the area.',
      ]),
      h2('Common fields'),
      ul([
        'Street name, split into prefix, name, type and direction in many local layers.',
        'Road class, such as local, collector, arterial or highway.',
        'Address ranges on the left and right side, used for geocoding.',
        'Speed limit, number of lanes or surface type, when the agency collects them.',
        'One-way flags, needed for routing.',
      ]),
      ...HOW_TO('road data'),
      h2('Tips for working with road data'),
      ul([
        'Road layers are large. Filter to your area and choose GeoPackage for big downloads.',
        'Reproject to a projected coordinate system before you measure length. Lengths calculated in degrees are not usable.',
        'For routing you need a connected network with proper node topology, which many plain centerline layers do not guarantee.',
        'Check the update date. New subdivisions are missing in old layers.',
      ]),
    ],
    faqs: [
      { q: 'Where can I get free road data for the US?', a: 'From city and county GIS offices, state transportation departments, the Census Bureau (TIGER/Line) and OpenStreetMap. The live search above looks for public road services.' },
      { q: 'Can I use downloaded roads for routing?', a: 'Only if the layer is a connected network with correct topology and one-way information. Many centerline layers are only for mapping.' },
      { q: 'What is the best format for a statewide road layer?', a: 'GeoPackage. Shapefile is limited to 2 GB and 10-character field names.' },
      { q: 'How do I get road data in KML for Google Earth?', a: 'Export to KML from the [Downloader](/download), or convert a downloaded file with the [Converter](/converter). Large layers can be slow in Google Earth, so filter first.' },
    ],
    relatedPosts: ['downloading-openstreetmap-data-for-gis', 'converting-gis-data-to-kml-for-google-earth', 'how-to-download-arcgis-rest-featureserver-data'],
    relatedTopics: ['building-footprints', 'census-boundaries', 'parcel-data'],
  },
];

export const getDataTopic = (slug: string) => DATA_TOPICS.find((t) => t.slug === slug);
