'use client';

import ProgressBar from './ProgressBar';

interface CreditsDisplayProps {
  balance: number;
  limit: number;
}

/**
 * CreditsDisplay — Shows Curious Credits balance with a progress bar toward limit.
 * Large numeric display with mono-data styling.
 */
export default function CreditsDisplay({ balance, limit }: CreditsDisplayProps) {
  const percentUsed = (balance / limit) * 100;

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] uppercase">
        CURIOUS_CREDITS
      </p>

      <div className="flex items-baseline gap-2">
        <span className="font-display-hero text-4xl text-on-surface">{balance.toFixed(2)}</span>
        <span className="font-mono-data text-sm text-secondary">CC</span>
      </div>

      <ProgressBar
        value={balance}
        max={limit}
        label={`LIMIT: ${limit.toFixed(2)} CC`}
        showPercent
        variant={percentUsed > 85 ? 'error' : percentUsed > 70 ? 'violet' : 'cyan'}
      />

      <p className="font-mono-data text-[10px] text-outline tracking-[0.05em]">
        {balance >= limit
          ? 'CREDIT_LIMIT_REACHED // Upgrade required'
          : `AVAILABLE: ${(limit - balance).toFixed(2)} CC`}
      </p>
    </div>
  );
}
