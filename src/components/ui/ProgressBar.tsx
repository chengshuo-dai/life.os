'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  variant?: 'cyan' | 'violet' | 'error';
  pulse?: boolean;
  className?: string;
}

/**
 * ProgressBar — Cyan data-stream style progress indicator.
 * Used for narrative progress, sync percentages, and credit usage.
 */
export default function ProgressBar({
  value,
  max,
  label,
  showPercent = false,
  variant = 'cyan',
  pulse = false,
  className = '',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  const variantStyles = {
    cyan: 'bg-secondary',
    violet: 'bg-violet-400',
    error: 'bg-error',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="font-mono-data text-[9px] text-outline tracking-[0.1em]">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="font-mono-data text-[10px] text-on-surface-variant">
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${variantStyles[variant]} ${
            pulse ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
