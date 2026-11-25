import React from 'react';
import { Link } from 'react-router-dom';
import { PARCEL_CITIES, cityPath, cityLabel } from '../../data/parcelCities';

/**
 * "Parcel data for big US cities": links to every city page that is indexable, with descriptive link
 * text. Built from the spreadsheet list, so it grows by itself when you add cities.
 */
export const CityLinks: React.FC<{ title?: string }> = ({ title = 'Download parcel data for big US cities' }) => {
  const cities = PARCEL_CITIES.filter((c) => c.indexable);
  if (cities.length === 0) return null;
  const shown = cities.slice(0, 24);
  return (
    <section aria-label="Parcel data by city" style={{ margin: '2rem 0' }}>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.6rem' }}>{title}</h2>
      <p style={{ margin: '0 0 0.6rem', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
        Each page names the official publisher, lists what the layer covers and has a one-click download of the whole layer.
      </p>
      <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.9, margin: '0 0 0.5rem', columns: shown.length > 8 ? 2 : 1 }}>
        {shown.map((c) => (
          <li key={c.slug}>
            <Link to={cityPath(c)}>{cityLabel(c)} parcel data</Link>
          </li>
        ))}
      </ul>
      <p style={{ margin: 0, fontSize: '0.92rem' }}>
        <Link to="/data">See all parcel data by city</Link>
      </p>
    </section>
  );
};
