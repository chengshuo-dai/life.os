'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import GlitchText from '@/components/ui/GlitchText';
import LightWaves from '@/components/ui/LightWaves';

/**
 * Fragment Reassembly (SCREEN_7 / SCREEN_25 post-decryption)
 * Post-decryption reassembly complete screen with glitch aesthetic.
 */
export default function BreachPage() {
  const router = useRouter();
  const { state, dispatch } = useLifeOS();
  const [phase, setPhase] = useState<'reassembling' | 'complete'>('reassembling');
  const [fragments, setFragments] = useState<string[]>([]);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/breach' });
    dispatch({ type: 'SET_GLITCH', active: true });

    // Simulate fragment reassembly
    const fragmentParts = [
      'MEMORY_BLOCK_001',
      'NEURAL_PATHWAY_082',
      'TEMPORAL_NODE_SYNCED',
      'DESTINY_FRAGMENT_RECOVERED',
      'IDENTITY_LAYER_RESTORED',
      'QUANTUM_STATE_VERIFIED',
      'REALITY_QUOTIENT_CALIBRATED',
    ];

    fragmentParts.forEach((fragment, i) => {
      setTimeout(() => {
        setFragments((prev) => [...prev, fragment]);
        if (i === fragmentParts.length - 1) {
          setTimeout(() => {
            setPhase('complete');
            dispatch({ type: 'SET_GLITCH', active: false });
          }, 800);
        }
      }, i * 400);
    });

    return () => {
      dispatch({ type: 'SET_GLITCH', active: false });
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-136px)] relative">
      <LightWaves color="cyan" />

      <div className="max-w-lg mx-auto px-gutter py-20 text-center relative z-10">
        {/* Glitch Header */}
        <div className="mb-10">
          <p className="font-mono-data text-[10px] text-outline tracking-[0.2em] mb-4">
            SYSTEM_BREACH // FRAGMENT_REASSEMBLY
          </p>
          <h1 className="font-display-hero text-3xl text-on-surface tracking-[0.1em]">
            {phase === 'reassembling' ? (
              <GlitchText text="REASSEMBLING" as="span" active />
            ) : (
              <span>
                REASSEMBLY<span className="text-secondary">_</span>COMPLETE
              </span>
            )}
          </h1>
        </div>

        {/* Fragment Progress */}
        <div className="space-y-2 mb-10">
          {fragments.map((fragment, i) => (
            <div
              key={fragment}
              className="animate-glitch-reveal"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="glass-panel rounded-lg p-3 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <p className="font-mono-data text-xs text-on-surface-variant">
                  [{i + 1}/7] {fragment}
                </p>
                <span className="ml-auto font-mono-data text-[10px] text-secondary">
                  SYNC
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Scanline for reassembling phase */}
        {phase === 'reassembling' && (
          <div className="relative h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-secondary transition-all duration-300"
              style={{ width: `${(fragments.length / 7) * 100}%` }}
            />
          </div>
        )}

        {/* Complete State */}
        {phase === 'complete' && (
          <div className="animate-fade-in space-y-6">
            <div className="glass-panel rounded-xl p-6 border-secondary/20">
              <p className="font-mono-data text-sm text-secondary tracking-[0.1em] mb-3">
                [FRAGMENT_REASSEMBLY_COMPLETE]
              </p>
              <p className="font-body-md text-sm text-on-surface-variant">
                All destiny fragments have been successfully reassembled. Neural
                pathways restored. The breach has been sealed. Your narrative
                path integrity is now at optimal levels.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => router.push('/hub')}
                className="liquid-btn"
              >
                RETURN_TO_HUB
              </button>
              <button
                onClick={() => router.push('/archive')}
                className="liquid-btn"
              >
                VIEW_ARCHIVE
              </button>
            </div>
          </div>
        )}

        {/* Reassembling hint */}
        {phase === 'reassembling' && (
          <p className="font-mono-data text-[10px] text-outline tracking-[0.1em]">
            RECONSTRUCTING_FRAGMENTS // PLEASE_STANDBY
          </p>
        )}
      </div>
    </div>
  );
}
