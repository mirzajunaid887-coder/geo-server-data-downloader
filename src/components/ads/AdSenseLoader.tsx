import React, { useEffect } from 'react';
import { ADSENSE_CLIENT_ID, IS_ADSENSE_CONFIGURED } from '../../config/ads';

/**
 * Injects the AdSense loader script exactly once.
 *
 * Without this script, `(window.adsbygoogle = window.adsbygoogle || []).push({})`
 * only queues placements into an array that nothing ever drains, so no ad can
 * render. Guarded by IS_ADSENSE_CONFIGURED so development builds and
 * pre-approval deployments stay completely clean.
 */
export const AdSenseLoader: React.FC = () => {
  useEffect(() => {
    if (!IS_ADSENSE_CONFIGURED) return;
    if (document.querySelector('script[data-adsense-loader]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.setAttribute('data-adsense-loader', 'true');
    document.head.appendChild(script);

    // Site ownership / account association meta tag
    if (!document.querySelector('meta[name="google-adsense-account"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google-adsense-account';
      meta.content = ADSENSE_CLIENT_ID;
      document.head.appendChild(meta);
    }
  }, []);

  return null;
};