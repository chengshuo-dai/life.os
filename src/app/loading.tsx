/**
 * Global loading state — shown during page transitions.
 * Renders a minimal glitch-style loading indicator.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Glitch loading text */}
        <p className="font-mono-data text-secondary glitch-text text-sm tracking-[0.15em] uppercase">
          SYSTEM_SYNCING
        </p>

        {/* Data stream loading bars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full animate-pulse"
              style={{
                height: `${16 + Math.random() * 32}px`,
                background: i % 2 === 0 ? '#7bd0ff' : '#8b5cf6',
                animationDelay: `${i * 0.15}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <p className="font-mono-data text-outline text-xs tracking-[0.1em] cursor-blink">
          &gt; AWAITING_DESTINY_SYNC<span className="cursor-blink">_</span>
        </p>
      </div>
    </div>
  );
}
