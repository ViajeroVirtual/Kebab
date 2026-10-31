import React from 'react';
import { BRAND_CONFIG } from '../utils/formula';

const sizeMap = {
  sm: { heading: 'text-xl', badge: 'text-xs', gap: 'gap-1.5' },
  md: { heading: 'text-2xl sm:text-3xl', badge: 'text-xs', gap: 'gap-2' },
  lg: { heading: 'text-4xl sm:text-6xl', badge: 'text-xs sm:text-sm', gap: 'gap-3' },
};

export default function Logo({ size = 'md', showBadge = true, centered = false }) {
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center ${s.gap} select-none ${centered ? 'justify-center' : ''}`}>
      <span className={`${s.heading} font-extrabold tracking-tight leading-none text-ink`}>
        {BRAND_CONFIG.prefix}
        <span className="text-brand-600">{BRAND_CONFIG.accent}</span>
      </span>
      {showBadge && (
        <span className={`${s.badge} font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60`}>
          {BRAND_CONFIG.city}
        </span>
      )}
    </div>
  );
}
