import { ADSENSE_CLIENT_ID, IS_ADSENSE_CONFIGURED } from '../../config/ads';

/**
 * Injects the AdSense loader script exactly once, on demand.
 *
 * It is called by <AdSlot> only, so pages without ads (the downloader, converter,
 * discovery tool, legal pages, thin posts) never load any advertising code.
 * Site ownership is verified by the static <meta name="google-adsense-account">
 * tag in index.html, so the script does not need to be on every page.
 */
export function ensureAdSenseScript(): void {
  if (typeof document === 'undefined' || !IS_ADSENSE_CONFIGURED) return;
  if (document.querySelector('script[data-adsense-loader]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  script.setAttribute('data-adsense-loader', 'true');
  document.head.appendChild(script);
}
