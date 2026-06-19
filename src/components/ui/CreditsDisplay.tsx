'use client';

import Link from 'next/link';
import ProgressBar from './ProgressBar';

interface CreditsDisplayProps {
  balance: number;
  limit: number;
  showBuyButton?: boolean;
}

/**
 * CreditsDisplay — Shows Curious Credits balance with a progress bar toward limit.
 * Large numeric display with mono-data styling.
 * When showBuyButton is true and balance is low, displays a link to the credit exchange.
 */
export default function CreditsDisplay({
  balance,
  limit,
  showBuyButton = true,
}: CreditsDisplayProps) {
  const percentUsed = (balance / limit) * 100;
  const isLow = balance < 2.0; // Threshold for "buy more" prompt

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] uppercase">
        CURIOUS_CREDITS
      </p>

      <div className="flex items-baseline gap-2">
        <span className="font-display-hero text-4xl text-on-surface">
          {balance.toFixed(2)}
        </span>
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

      {showBuyButton && isLow && (
        <Link
          href="/credits"
          className="block w-full text-center liquid-btn text-xs py-2"
        >
          ACQUIRE_CREDITS →
        </Link>
      )}
    </div>
  );
}
