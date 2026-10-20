import React, { useEffect, useRef } from 'react';
import { IS_ADSENSE_CONFIGURED, ADSENSE_CLIENT_ID, ADSENSE_SLOT_ID } from '../../config/ads';

export const AdContainer: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // 1. If IDs are not configured, do nothing.
    if (!IS_ADSENSE_CONFIGURED) return;

    // 2. Ensure we don't push the same ad twice on re-renders
    if (pushedRef.current) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, []);

  // If no IDs are set, render nothing (this prevents console errors and broken layout)
  if (!IS_ADSENSE_CONFIGURED) {
    return null;
  }

  return (
    <div style={{ margin: '2rem auto', maxWidth: '728px', width: '100%', textAlign: 'center' }}>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={ADSENSE_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
};