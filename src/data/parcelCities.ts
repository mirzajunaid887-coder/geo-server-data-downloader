/**
 * City parcel pages. The list comes from data/parcel-cities.xlsx (or .csv), converted to
 * parcelCities.json by scripts/generate-parcel-data.mjs before every build and dev start.
 * To add a city: add a row to the spreadsheet. Nothing in the code needs to change.
 */
import raw from './parcelCities.json';

export interface ParcelCity {
  slug: string;
  city: string;
  county: string;
  state: string;
  stateCode: string;
  url: string;
  publisher: string;
  /** Optional official page about the dataset (open data portal or city GIS page), or ''. */
  officialUrl: string;
  /** Optional license name or URL stated by the publisher, or ''. */
  license: string;
  about: string[];
  coverage: string[];
  fields: string[];
  watchOut: string[];
  /** Example ArcGIS SQL filter shown as a hint in the Download now window, e.g. ZIP = '60601'. */
  filterExample: string;
  /** YYYY-MM-DD the link was last confirmed, or null. */
  checked: string | null;
  /** false = too little written content: page is noindex and not in the sitemap. */
  indexable: boolean;
}

export const PARCEL_CITIES = raw as ParcelCity[];

export const cityPath = (c: ParcelCity) => `/data/parcels/${c.slug}`;
export const cityLabel = (c: ParcelCity) => `${c.city}, ${c.stateCode}`;
export const getParcelCity = (slug: string) => PARCEL_CITIES.find((c) => c.slug === slug);

export function citiesByState(list: ParcelCity[] = PARCEL_CITIES): { state: string; stateCode: string; cities: ParcelCity[] }[] {
  const map = new Map<string, { state: string; stateCode: string; cities: ParcelCity[] }>();
  for (const c of list) {
    if (!map.has(c.stateCode)) map.set(c.stateCode, { state: c.state, stateCode: c.stateCode, cities: [] });
    map.get(c.stateCode)!.cities.push(c);
  }
  return [...map.values()].sort((a, b) => a.state.localeCompare(b.state));
}
