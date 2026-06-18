'use client';

interface RealitySyncRingProps {
  percentage: number; // 0-1
  size?: number;
  label?: string;
}

/**
 * RealitySyncRing — SVG ring chart displaying the Reality Sync percentage.
 * Circular progress indicator with cyan stroke matching the Life.OS design.
 */
export default function RealitySyncRing({
  percentage,
  size = 120,
  label = 'REALITY_SYNC',
}: RealitySyncRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#7bd0ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ filter: 'drop-shadow(0 0 6px rgba(123,208,255,0.3))' }}
        />
      </svg>
      <div className="text-center">
        <p className="font-mono-data text-[10px] text-outline tracking-[0.1em]">
          {label}
        </p>
        <p className="font-display-hero text-2xl text-on-surface">
          {(percentage * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
