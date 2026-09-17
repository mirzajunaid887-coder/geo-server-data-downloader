export const ADS_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
  SLOT_ID: import.meta.env.VITE_ADSENSE_SLOT_ID || '1234567890',
  ENABLED: Boolean(import.meta.env.VITE_ADSENSE_CLIENT_ID),
};