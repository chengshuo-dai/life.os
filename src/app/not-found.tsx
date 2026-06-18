'use client';

import Link from 'next/link';

/**
 * Custom 404 — Life.OS themed "Void Page".
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="grid-overlay absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg mx-auto px-6 text-center">
        {/* Void indicator */}
        <div className="mb-4">
          <p className="font-display-hero text-8xl text-outline/20 tracking-[0.2em] select-none">
            404
          </p>
          <p className="font-mono-data text-[10px] text-error tracking-[0.3em] mt-2">
            NARRATIVE_PATH_NOT_FOUND
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span className="font-mono-data text-xs text-on-surface-variant tracking-[0.1em]">
              VOID_DETECTED // PATH_DOES_NOT_EXIST
            </span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mb-6">
            The narrative path you requested does not exist in this reality
            stratum. The destiny you seek may have branched elsewhere, or may
            not yet be written.
          </p>

          <div className="space-y-3">
            <Link
              href="/initialize"
              className="liquid-btn block text-center w-full py-3 text-sm tracking-[0.15em]"
            >
              INITIALIZE_NEW_SESSION
            </Link>
            <Link
              href="/hub"
              className="liquid-btn block text-center w-full py-3 text-sm tracking-[0.15em]"
            >
              RETURN_TO_HUB
            </Link>
          </div>
        </div>

        {/* System metadata */}
        <div className="font-mono-data text-[9px] text-outline tracking-[0.15em] space-y-1">
          <p>OS_VER: ALPHA-9-SYNC</p>
          <p>STATUS: FRAGMENT_LOST</p>
        </div>
      </div>
    </div>
  );
}
