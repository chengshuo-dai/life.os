'use client';

import { useEffect } from 'react';

/**
 * Global Error Boundary — catches rendering errors and displays
 * a Life.OS-themed error screen with recovery options.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Life.OS unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Grid overlay */}
      <div className="grid-overlay absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg mx-auto px-6 text-center">
        {/* Glitch header */}
        <div>
          <p className="font-mono-data text-[10px] text-error tracking-[0.2em] mb-4">
            SYSTEM_FAULT // NARRATIVE_STREAM_INTERRUPTED
          </p>
          <h1 className="font-display-hero text-3xl text-on-surface tracking-[0.1em]">
            REALITY<span className="text-error">_</span>BREACH
          </h1>
        </div>

        {/* Error details */}
        <div className="glass-panel rounded-xl p-6 w-full">
          <p className="font-mono-data text-xs text-on-surface-variant mb-4">
            A temporal anomaly has disrupted the narrative stream. The system is
            attempting to recalibrate.
          </p>
          {error.digest && (
            <p className="font-mono-data text-[10px] text-outline mb-4">
              ERROR_CODE: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            className="liquid-btn w-full py-3 text-sm tracking-[0.15em]"
          >
            RECALIBRATE_SYNC
          </button>
        </div>

        {/* Fallback links */}
        <div className="flex items-center gap-4">
          <a
            href="/initialize"
            className="font-mono-data text-[10px] text-outline hover:text-secondary tracking-[0.1em] transition-liquid"
          >
            RETURN_TO_GATEWAY
          </a>
          <span className="text-outline">|</span>
          <a
            href="/hub"
            className="font-mono-data text-[10px] text-outline hover:text-secondary tracking-[0.1em] transition-liquid"
          >
            NARRATIVE_HUB
          </a>
        </div>
      </div>
    </div>
  );
}
