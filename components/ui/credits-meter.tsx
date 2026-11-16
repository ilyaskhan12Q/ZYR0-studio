'use client';

import React from 'react';

interface CreditsMeterProps {
  used: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}

function compact(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 10000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

/**
 * Credit balance bar for the sidebar user card.
 *
 * Presentational only — there is no credits API in browser mode yet, so the caller supplies the
 * numbers. `role="progressbar"` keeps it legible to assistive tech either way.
 */
export function CreditsMeter({ used, total, showLabel = true, className }: CreditsMeterProps) {
  const safeTotal = total > 0 ? total : 0;
  const pct = safeTotal > 0 ? Math.min(100, Math.max(0, (used / safeTotal) * 100)) : 0;

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[10px]">
          <span className="text-zyr0-text-faint">Credits</span>
          <span className="tabular-nums text-zyr0-text-dim">
            {compact(used)} / {compact(safeTotal)}
          </span>
        </div>
      )}
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]"
        role="progressbar"
        aria-label="Credits used"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-zyr0-blue via-zyr0-violet to-zyr0-gold transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
