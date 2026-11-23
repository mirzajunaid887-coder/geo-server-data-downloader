/**
 * Official parcel services for big US cities / counties. Everything countable (feature totals,
 * field lists, update dates, coordinate system) is read LIVE from the service by the inspector on
 * the page, so only descriptive notes live here. To add a place, add one entry.
 */
export interface CityParcel {
  slug: string;
  name: string; // heading
  place: string; // "New York State"
  publisher: string;
  serviceUrl: string; // layer URL (ends in /0, /1 ...)
  summary: string;
  coverage: string;
  inside: string[];
  watchOut: string[];
}

export const CITY_PARCELS: CityParcel[] = [
  {
    slug: 'new-york-state',
    name: 'New York: NYS Tax Parcels (public)',
    place: 'New York State',
    publisher: 'NYS ITS Geospatial Services',
    serviceUrl: 'https://nysgeohub.ny.gov/arcgis/rest/services/Parcels/NYS_Tax_Parcels_Public/FeatureServer/1',
    summary: 'A statewide layer assembled from county parcel files, including New York City.',
    coverage:
      'This is not every county in the state. The service description says it contains tax parcel data only for counties that authorised public sharing (36 counties as of May 2026), built from county parcel geometry, state assessment rolls and NYC MapPLUTO. Filter or group by COUNTY_NAME to see which counties are present before you start.',
    inside: [
      'Parcel identifiers: PRINT_KEY, SBL and SWIS-based IDs (the SWIS code identifies the municipality).',
      'Situs address, municipality, school district and county names.',
      'Property class (PROP_CLASS) with the state\'s class codes, plus land and total assessed value and full market value.',
      'Acreage, building year, number of bedrooms and bathrooms for many parcels.',
      'Owner and mailing address fields.',
    ],
    watchOut: [
      'Counties that do not share publicly are missing, so a blank area on the map is not necessarily empty land.',
      'The data is an annual snapshot. Check the roll year and spatial year fields for each county.',
      'Coordinates are in Web Mercator. Reproject to a local projected system before measuring area.',
      'Assessment practices differ by county, so values are not strictly comparable across counties.',
    ],
  },
  {
    slug: 'chicago-cook-county',
    name: 'Chicago: Cook County Parcels',
    place: 'Cook County, Illinois (includes Chicago)',
    publisher: 'Cook County GIS',
    serviceUrl: 'https://gis.cookcountyil.gov/traditional/rest/services/cookviewer3DynamicLabels/MapServer/0',
    summary: 'The county parcel layer behind the Cook County viewer. It covers Chicago and the suburbs.',
    coverage:
      'Chicago parcels come from the county, not the city. This layer is named "Parcels Current" and covers the whole of Cook County, so you can filter by city or township to get Chicago only.',
    inside: [
      'Parcel numbers as PIN (14 digits), PIN10 and a dashed PIN14 for display.',
      'Street address, city, ZIP and township name.',
      'Property class and a readable class description.',
      'Current assessed values for land, building and total, plus building area and building age.',
      'Tax district names (municipality, school, park, library, community college) and links to the assessor\'s records.',
    ],
    watchOut: [
      'The service is a map service, so it is meant for display. Queries work, but very large pulls take time. Filter by township or city.',
      'The layer has no description or copyright text. Use the Cook County Assessor and GIS pages for terms of use.',
      'Coordinates are in Illinois State Plane East (feet). Distances and areas come out in feet.',
    ],
  },
  {
    slug: 'houston-harris',
    name: 'Houston: Cadastral Parcels',
    place: 'Houston, Texas area',
    publisher: 'City of Houston GIS',
    serviceUrl: 'https://mycity2.houstontx.gov/gisweb02/rest/services/HoustonMap/Cadastral/MapServer/0',
    summary: 'City-published parcels with tax, land use and flood fields.',
    coverage:
      'Published by the City of Houston as part of its HoustonMap service. Use the live extent below to see how far the layer reaches. The layer extent is larger than the city limits proper, so check coverage in the map before assuming it covers the whole county.',
    inside: [
      'A tax account ID (TAX_ID) and the alternate ID field.',
      'Site address split into number, street and suffix fields, and mailing address fields.',
      'State property class and land use code and description.',
      'Land value, improvement value and total appraised or market value, plus acreage and building area.',
      'Handy extras: FLOOD_ZONE, FLOOD_SFHA and COUNCIL_DISTRICT.',
    ],
    watchOut: [
      'The layer includes owner and mailing information. Handle personal data responsibly and follow Texas rules on its use.',
      'The service has no description or copyright text. Confirm terms of use with the City of Houston.',
      'For the county-wide appraisal data, check the Harris County Appraisal District as well.',
    ],
  },
  {
    slug: 'phoenix-maricopa',
    name: 'Phoenix: Maricopa County Parcel Outlines',
    place: 'Maricopa County, Arizona (includes Phoenix)',
    publisher: 'Maricopa County Assessor',
    serviceUrl: 'https://gis.mcassessor.maricopa.gov/arcgis/rest/services/ParcelOutline/MapServer/0',
    summary: 'Parcel outlines from the county assessor, covering Phoenix and the rest of the county.',
    coverage:
      'Phoenix parcels are maintained by the county assessor, so this layer covers all of Maricopa County. Use the live details below for the exact fields and the feature count.',
    inside: [
      'Parcel outlines (polygons) from the county assessor.',
      'The attribute list is shown live below. It is a map service named "ParcelOutline", so the attribute set may be smaller than a full assessor table.',
    ],
    watchOut: [
      'Phoenix is a part of a very large county. Filter by city or area before you download.',
      'For ownership and valuation details, the assessor\'s own search and data products may offer more than this outline layer.',
    ],
  },
];
