/**
 * Reads the city parcel list from a spreadsheet and turns it into clean data.
 *
 *   data/parcel-cities.xlsx   (preferred)   or   data/parcel-cities.csv
 *
 * Columns (header names are matched loosely: case, spaces and underscores are ignored)
 *   City, County, State, Parcel_Data_URL, About_Data, URL_Last_Updated      <- required / main
 *   Publisher, Coverage, Key_Fields, Watch_Out, Filter_Example              <- optional, add real content
 *
 * Used by generate-parcel-data.mjs (writes src/data/parcelCities.json for the app) so the pages,
 * sitemap and prerender always agree. The .xlsx reader only needs jszip, which the app already has.
 */
import { readFile, access } from 'node:fs/promises';
import JSZip from 'jszip';

export const STATES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  PR: 'Puerto Rico',
};

/** Pages need real written content to be worth indexing (same idea as the blog's word threshold). */
export const MIN_INDEXABLE_WORDS = 60;
const STALE_DAYS = 180;

// ------------------------------------------------------------------ file readers

const decodeXml = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

const textOf = (xml) => {
  const clean = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '');
  let out = '';
  for (const m of clean.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)) out += m[1];
  return decodeXml(out);
};

const colIndex = (ref) => {
  const letters = /^[A-Z]+/.exec(ref)?.[0] ?? 'A';
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
};

/** Returns rows (arrays of strings) of the FIRST sheet of an .xlsx file. */
export async function readXlsx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const get = async (name) => {
    const f = zip.file(name);
    return f ? f.async('string') : null;
  };

  const sharedXml = await get('xl/sharedStrings.xml');
  const shared = sharedXml ? [...sharedXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1])) : [];

  const wb = await get('xl/workbook.xml');
  const rels = await get('xl/_rels/workbook.xml.rels');
  if (!wb || !rels) throw new Error('This does not look like a valid .xlsx file.');
  const firstSheet = /<sheet\b[^>]*?r:id="([^"]+)"/.exec(wb);
  if (!firstSheet) throw new Error('The workbook has no sheets.');
  let target = null;
  for (const m of rels.matchAll(/<Relationship\b([^>]*?)\/?>/g)) {
    const id = /\bId="([^"]+)"/.exec(m[1])?.[1];
    if (id === firstSheet[1]) target = /\bTarget="([^"]+)"/.exec(m[1])?.[1];
  }
  if (!target) throw new Error('Could not find the first sheet in the workbook.');
  const path = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`;
  const sheet = await get(path);
  if (!sheet) throw new Error(`Sheet file ${path} is missing.`);

  const rows = [];
  for (const rm of sheet.matchAll(/<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const cells = [];
    for (const cm of (rm[1] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cm[1];
      const ref = /\br="([A-Z]+\d+)"/.exec(attrs)?.[1] ?? '';
      const type = /\bt="([^"]+)"/.exec(attrs)?.[1] ?? 'n';
      const inner = cm[2] ?? '';
      let value = '';
      if (type === 'inlineStr') value = textOf(inner);
      else {
        const v = /<v\b[^>]*>([\s\S]*?)<\/v>/.exec(inner)?.[1];
        if (v !== undefined) value = type === 's' ? (shared[Number(v)] ?? '') : decodeXml(v);
      }
      cells[colIndex(ref)] = value;
    }
    rows.push(Array.from(cells, (c) => c ?? ''));
  }
  return rows;
}

/** Minimal RFC 4180 CSV parser (quotes, escaped quotes, newlines inside cells, BOM). */
export function parseCsv(text) {
  const src = text.replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; } else q = false;
      } else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// ------------------------------------------------------------------ cleaning

const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const ALIASES = {
  city: ['city', 'place', 'cityname'],
  county: ['county', 'countyname'],
  state: ['state', 'statename', 'st'],
  url: ['parceldataurl', 'parcelurl', 'url', 'serviceurl', 'endpoint', 'restendpoint'],
  about: ['aboutdata', 'about', 'description', 'summary'],
  updated: ['urllastupdated', 'lastupdated', 'lastchecked', 'urllastchecked', 'updated', 'checked'],
  publisher: ['publisher', 'source', 'owner', 'agency'],
  coverage: ['coverage', 'coveragenotes'],
  fields: ['keyfields', 'fields', 'whatisinside', 'inside'],
  filterExample: ['filterexample', 'downloadfilter', 'examplefilter', 'whereexample'],
  watchOut: ['watchout', 'watchouts', 'watchoutfor', 'notes', 'caveats'],
};

const clean = (s) => String(s ?? '').replace(/ /g, ' ').replace(/[ \t]+/g, ' ').trim();
const slugify = (s) =>
  clean(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const words = (s) => (s.match(/\S+/g) ?? []).length;
const paragraphs = (s) => String(s ?? '').split(/\r?\n/).map(clean).filter(Boolean);
const items = (s) => String(s ?? '').split(/\r?\n|\s\|\s/).map(clean).filter(Boolean);

function stateInfo(raw) {
  const v = clean(raw);
  if (!v) return null;
  const up = v.toUpperCase().replace(/\./g, '');
  if (STATES[up]) return { code: up, name: STATES[up] };
  for (const [code, name] of Object.entries(STATES)) if (name.toLowerCase() === v.toLowerCase()) return { code, name };
  return null;
}

/** Accepts YYYY-MM-DD, M/D/YYYY (US), "23 Nov 2026" and Excel serial numbers. Returns YYYY-MM-DD or null. */
export function parseDate(raw) {
  const v = clean(raw);
  if (!v) return null;
  let d = null;
  if (/^\d{4,6}(\.\d+)?$/.test(v) && Number(v) > 20000 && Number(v) < 80000) {
    d = new Date(Date.UTC(1899, 11, 30) + Math.floor(Number(v)) * 86400000);
  } else if (/^\d{4}-\d{1,2}-\d{1,2}/.test(v)) {
    const [y, m, day] = v.slice(0, 10).split('-').map(Number);
    d = new Date(Date.UTC(y, m - 1, day));
  } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(v)) {
    let [m, day, y] = v.split('/').map(Number);
    if (y < 100) y += 2000;
    d = new Date(Date.UTC(y, m - 1, day));
  } else {
    const t = Date.parse(v + ' UTC');
    if (!Number.isNaN(t)) d = new Date(t);
  }
  if (!d || Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/** Pure function: rows (first row = header) -> { cities, warnings, errors } */
export function buildCities(rows, today = new Date()) {
  const warnings = [];
  const errors = [];
  const nonEmpty = rows.filter((r) => r.some((c) => clean(c)));
  if (!nonEmpty.length) return { cities: [], warnings, errors: ['The spreadsheet is empty.'] };

  const header = nonEmpty[0].map(norm);
  const col = {};
  for (const [key, names] of Object.entries(ALIASES)) {
    const i = header.findIndex((h) => names.includes(h));
    if (i >= 0) col[key] = i;
  }
  for (const need of ['city', 'state', 'url']) {
    if (col[need] === undefined) errors.push(`Missing a column for "${need}". Found headers: ${nonEmpty[0].map(clean).join(', ')}`);
  }
  if (errors.length) return { cities: [], warnings, errors };

  const get = (r, key) => (col[key] === undefined ? '' : r[col[key]] ?? '');
  const used = new Set();
  const cities = [];

  nonEmpty.slice(1).forEach((r, idx) => {
    const line = idx + 2; // rows are 1-based, header is row 1 (blank rows make this approximate)
    const city = clean(get(r, 'city'));
    if (!city) { warnings.push(`Row ${line}: no city name, row skipped.`); return; }
    const label = `${city}`;
    const st = stateInfo(get(r, 'state'));
    if (!st) { errors.push(`${label}: state "${clean(get(r, 'state'))}" is not a US state name or code.`); return; }
    const url = clean(get(r, 'url'));
    let parsed = null;
    try { parsed = new URL(url); } catch { /* handled below */ }
    if (!parsed || !/^https?:$/.test(parsed.protocol)) { errors.push(`${label}, ${st.code}: Parcel_Data_URL is not a valid web address.`); return; }
    if (parsed.protocol !== 'https:') warnings.push(`${label}, ${st.code}: link is http, not https. Browsers may block it on an https site.`);
    if (!/rest\/services|FeatureServer|MapServer|wfs|WFSServer/i.test(url)) {
      warnings.push(`${label}, ${st.code}: link does not look like an ArcGIS REST or WFS service. The downloader may not load it.`);
    }

    const county = clean(get(r, 'county'));
    let slug = `${slugify(city)}-${st.code.toLowerCase()}`;
    if (used.has(slug) && county) slug = `${slug}-${slugify(county)}`;
    for (let n = 2; used.has(slug); n++) slug = `${slug.replace(/-\d+$/, '')}-${n}`;
    used.add(slug);

    const checkedRaw = clean(get(r, 'updated'));
    const checked = parseDate(checkedRaw);
    if (checkedRaw && !checked) warnings.push(`${label}, ${st.code}: could not read the date "${checkedRaw}". Use YYYY-MM-DD.`);
    if (!checkedRaw) warnings.push(`${label}, ${st.code}: no URL_Last_Updated date. Add the day you last confirmed the link works.`);
    if (checked) {
      const age = (today.getTime() - new Date(checked + 'T00:00:00Z').getTime()) / 86400000;
      if (age > STALE_DAYS) warnings.push(`${label}, ${st.code}: link last checked ${checked} (${Math.round(age)} days ago). Please re-check it.`);
    }

    const about = paragraphs(get(r, 'about'));
    const coverage = paragraphs(get(r, 'coverage'));
    const fields = items(get(r, 'fields'));
    const watchOut = items(get(r, 'watchOut'));
    const wordCount = words([...about, ...coverage, ...fields, ...watchOut].join(' '));
    const indexable = wordCount >= MIN_INDEXABLE_WORDS;
    if (!indexable) {
      warnings.push(`${label}, ${st.code}: only ${wordCount} words of written content (need ${MIN_INDEXABLE_WORDS}). The page is built but set to noindex and left out of the sitemap until you add more.`);
    }

    cities.push({
      slug,
      city,
      county,
      state: st.name,
      stateCode: st.code,
      url,
      publisher: clean(get(r, 'publisher')),
      about,
      coverage,
      fields,
      watchOut,
      filterExample: clean(get(r, 'filterExample')),
      checked,
      indexable,
    });
  });

  cities.sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city));
  return { cities, warnings, errors };
}

export async function loadParcelCities({ dir = 'data', today } = {}) {
  const xlsx = `${dir}/parcel-cities.xlsx`;
  const csv = `${dir}/parcel-cities.csv`;
  const has = async (p) => access(p).then(() => true, () => false);
  const [hasX, hasC] = [await has(xlsx), await has(csv)];
  if (!hasX && !hasC) {
    return { cities: [], warnings: [], errors: [`No spreadsheet found. Put parcel-cities.xlsx (or .csv) in the "${dir}" folder.`], source: null };
  }
  const warnings = [];
  let rows;
  let source;
  if (hasX) {
    source = xlsx;
    if (hasC) warnings.push('Both parcel-cities.xlsx and parcel-cities.csv exist. Using the .xlsx file, ignoring the .csv.');
    rows = await readXlsx(await readFile(xlsx));
  } else {
    source = csv;
    rows = parseCsv(await readFile(csv, 'utf8'));
  }
  const res = buildCities(rows, today);
  return { ...res, warnings: [...warnings, ...res.warnings], source };
}
