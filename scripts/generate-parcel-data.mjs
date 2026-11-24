/**
 * Turns data/parcel-cities.xlsx (or .csv) into src/data/parcelCities.json.
 * Runs before the sitemap and the build (see package.json), and before `npm run dev`.
 *  - A bad row (unknown state, broken link) FAILS the build so a typo can never go live silently.
 *  - Soft problems (short text, old date) are printed as warnings.
 */
import { writeFile } from 'node:fs/promises';
import { loadParcelCities } from './parcel-cities.mjs';

const { cities, warnings, errors, source } = await loadParcelCities();

if (errors.length) {
  console.error('\nCity spreadsheet has problems:\n  - ' + errors.join('\n  - ') + '\n');
  process.exit(1);
}
for (const w of warnings) console.warn('  warning: ' + w);

await writeFile('src/data/parcelCities.json', JSON.stringify(cities, null, 2) + '\n');
const live = cities.filter((c) => c.indexable).length;
console.log(`parcelCities.json: ${cities.length} cities from ${source} (${live} indexable, ${cities.length - live} noindex)`);
