import React from 'react';
import { ADS_CONFIG } from '../../config/ads';

export const AdContainer: React.FC<{ slot?: string }> = () => {
  // If AdSense is not configured, do not render any placeholder box on the UI
  if (!ADS_CONFIG.ENABLED) {
    return null;
  }

  return (
    <div className="my-4 overflow-hidden text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS_CONFIG.CLIENT_ID}
        data-ad-slot={ADS_CONFIG.SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};