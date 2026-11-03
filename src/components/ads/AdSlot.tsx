import React, { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID, IS_ADSENSE_CONFIGURED } from '../../config/ads';

type AdSlotProps = {
  /** Ad unit id from the AdSense dashboard. */
  slotId: string | undefined;
  /** "auto" | "fluid" | "rectangle" | "horizontal" */
  format?: string;
  /** Reserve space to avoid layout shift while the ad loads. */
  minHeight?: number;
  label?: string;
};

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  format = 'auto',
  minHeight = 120,
  label = 'Advertisement',
}) => {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!IS_ADSENSE_CONFIGURED || !slotId || pushed.current || !ref.current) return;
    try {
      // @ts-ignore - adsbygoogle is injected by AdSenseLoader
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ad blocker or not yet approved — stay silent */
    }
  }, [slotId]);

  if (!IS_ADSENSE_CONFIGURED || !slotId) return null;

  return (
    <aside
      aria-label={label}
      style={{ margin: '2rem auto', width: '100%', minHeight, textAlign: 'center' }}
    >
      <span
        style={{
          display: 'block',
          marginBottom: '0.35rem',
          fontSize: '0.6rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
};