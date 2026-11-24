import React, { useState } from 'react';
import { Download } from 'lucide-react';
import type { ParcelCity } from '../../data/parcelCities';

/**
 * "Download now": opens /export.html in a NEW TAB and downloads the layer there, in the layer's own
 * coordinate system, using the same paging engine as the Downloader (all object IDs, then pages of
 * 200 with 6 requests at a time). /export.html is served with Cross-Origin-Opener-Policy
 * (see vercel.json), so it runs in its own process and this page stays fully responsive.
 * It is a real link (target=_blank), so popup blockers never interfere.
 */
export const EXPORT_FORMATS = [
  { value: 'shp', label: 'Shapefile (.zip)' },
  { value: 'gpkg', label: 'GeoPackage (.gpkg)' },
  { value: 'geojson', label: 'GeoJSON' },
  { value: 'csv', label: 'CSV (WKT)' },
  { value: 'kml', label: 'KML (WGS84)' },
] as const;

const KEY = 'gdd.parcelFormat';
const readFormat = (): string => {
  try {
    const v = localStorage.getItem(KEY);
    if (v && EXPORT_FORMATS.some((f) => f.value === v)) return v;
  } catch { /* storage can be blocked */ }
  return 'shp';
};

export function exportUrl(city: ParcelCity, format: string): string {
  const config = {
    layers: [{ name: `${city.city}_${city.stateCode}_parcels`, url: city.url, type: 'arcgis' }],
    format,
    crs: 'native',
    preflight: true,
    filename: `${city.slug}_parcels`,
    ...(city.filterExample ? { whereHint: city.filterExample } : {}),
  };
  return '/export.html#' + btoa(unescape(encodeURIComponent(JSON.stringify(config))));
}

interface Props {
  city: ParcelCity;
  /** Lay the select and the button out on one row (city page) instead of stacked (cards). */
  inline?: boolean;
}

export const DownloadNow: React.FC<Props> = ({ city, inline = false }) => {
  const [format, setFormat] = useState<string>(readFormat);
  const change = (v: string) => {
    setFormat(v);
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
  };
  const id = `fmt-${city.slug}`;
  return (
    <div style={{ display: 'flex', flexDirection: inline ? 'row' : 'column', flexWrap: 'wrap', gap: '0.5rem', alignItems: inline ? 'center' : 'stretch', flex: '0 0 auto', minWidth: inline ? undefined : '11.5rem' }}>
      <label htmlFor={id} style={{ position: 'absolute', left: '-9999px' }}>Download format for {city.city}</label>
      <select id={id} className="input-field" value={format} onChange={(e) => change(e.target.value)} style={{ fontSize: '0.82rem', padding: '0.4rem 0.5rem' }}>
        {EXPORT_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      <a
        href={exportUrl(city, format)}
        target="_blank"
        rel="noopener"
        className="btn-primary"
        style={{ textDecoration: 'none', justifyContent: 'center' }}
        aria-label={`Download ${city.city} parcel data now (opens in a new tab)`}
      >
        <Download style={{ width: '1rem', height: '1rem' }} /> Download now
      </a>
    </div>
  );
};
