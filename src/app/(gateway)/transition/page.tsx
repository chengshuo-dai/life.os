'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import LightWaves from '@/components/ui/LightWaves';

/**
 * System Transition (SCREEN_18 / SCREEN_45)
 * High-intensity glitch reveal transitioning from initialization to main console.
 * Displays fragmentation animation, then auto-redirects to hub.
 */
export default function TransitionPage() {
  const router = useRouter();
  const { state, dispatch } = useLifeOS();
  const [phase, setPhase] = useState<'fragmenting' | 'glitching' | 'reassembling' | 'complete'>(
    'fragmenting'
  );

  useEffect(() => {
    dispatch({ type: 'SET_GLITCH', active: true });
    dispatch({ type: 'SET_PAGE', page: '/transition' });

    // Phase timing
    const t1 = setTimeout(() => setPhase('glitching'), 1200);
    const t2 = setTimeout(() => setPhase('reassembling'), 2200);
    const t3 = setTimeout(() => {
      setPhase('complete');
      dispatch({ type: 'SET_GLITCH', active: false });
      router.push('/hub');
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router, dispatch]);

  const phaseText = {
    fragmenting: 'FRAGMENTING_IDENTITY_LAYER',
    glitching: 'GLITCH_REVEAL_ACTIVE',
    reassembling: 'REASSEMBLING_NARRATIVE_PATH',
    complete: 'TRANSITION_COMPLETE',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <LightWaves color="both" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Glitch animation */}
        <div
          className={`transition-all duration-700 ${
            phase === 'fragmenting'
              ? 'opacity-100 scale-100'
              : phase === 'glitching'
              ? 'opacity-70 scale-105 skew-x-2 filter brightness-150'
              : phase === 'reassembling'
              ? 'opacity-90 scale-100 skew-x-0 filter brightness-110'
              : 'opacity-100 scale-100'
          }`}
        >
          <p className="font-display-hero text-4xl text-on-surface tracking-[0.2em] glitch-text">
            LIFE<span className="text-secondary">.</span>OS
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-1 h-1 rounded-full ${
              phase === 'complete' ? 'bg-secondary' : 'bg-secondary animate-pulse'
            }`}
          />
          <p className="font-mono-data text-xs text-on-surface-variant tracking-[0.15em]">
            {phaseText[phase]}
          </p>
        </div>

        {/* Data stream bars */}
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-500"
              style={{
                height: `${16 + Math.sin(i * 0.8 + Date.now() * 0.001) * 20}px`,
                background:
                  phase === 'complete'
                    ? '#7bd0ff'
                    : i % 2 === 0
                    ? '#7bd0ff'
                    : '#8b5cf6',
                opacity: phase === 'complete' ? 0.8 : 0.4,
                transitionDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                phase === 'fragmenting' && i === 0
                  ? 'bg-secondary'
                  : phase === 'glitching' && i <= 1
                  ? 'bg-secondary'
                  : phase === 'reassembling' && i <= 2
                  ? 'bg-secondary'
                  : phase === 'complete' && i <= 3
                  ? 'bg-secondary'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Terminal log */}
        <div className="terminal-scroll space-y-1">
          {[
            '[SYNC] Fragmenting identity layer... OK',
            '[SYNC] Establishing neural bridge... OK',
            '[SYNC] Decrypting narrative paths... OK',
            '[SYNC] Reality quotient verified... OK',
            '[SYNC] Transition complete // Access granted',
          ].slice(0, phase === 'fragmenting' ? 1 : phase === 'glitching' ? 2 : phase === 'reassembling' ? 4 : 5).map((line, i) => (
            <p
              key={i}
              className="font-mono-data text-[11px] text-on-surface-variant animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
