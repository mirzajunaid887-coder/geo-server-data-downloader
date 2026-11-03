// src/config/ads.ts

// We pull from Vite environment variables.
// If they are missing or contain placeholders, ads will NOT load.
const rawClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
const rawSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID || '';
const rawArticleSlot = import.meta.env.VITE_ADSENSE_SLOT_ARTICLE || '';

export const ADSENSE_CLIENT_ID =
  rawClientId.includes('XXXX') || !rawClientId ? '' : rawClientId;

export const ADSENSE_SLOT_ID =
  rawSlotId === '1234567890' || !rawSlotId ? '' : rawSlotId;

/** In-article unit. Falls back to the display slot when not set separately. */
export const ADSENSE_SLOT_ARTICLE =
  rawArticleSlot === '1234567890' ? '' : rawArticleSlot || ADSENSE_SLOT_ID;

// This boolean tells the rest of the app whether it's safe to render ads
export const IS_ADSENSE_CONFIGURED = Boolean(ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID);