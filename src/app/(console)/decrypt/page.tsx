'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import GlitchText from '@/components/ui/GlitchText';
import CreditsDisplay from '@/components/ui/CreditsDisplay';
import type { PaymentUnlockResponse, NarrativeNode } from '@/models/types';

/**
 * Decryption Gateway (SCREEN_7 / SCREEN_25)
 * Paywall and fragment reassembly mechanics.
 * Wrapped in Suspense because useSearchParams requires it.
 */
export default function DecryptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-136px)] flex items-center justify-center">
          <p className="font-mono-data text-sm text-secondary cursor-blink">
            &gt; INITIALIZING_DECRYPTION_GATEWAY<span className="cursor-blink">_</span>
          </p>
        </div>
      }
    >
      <DecryptContent />
    </Suspense>
  );
}

function DecryptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, apiFetch } = useLifeOS();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [unlockedNode, setUnlockedNode] = useState<NarrativeNode | null>(null);
  const [error, setError] = useState('');
  const [gridCells, setGridCells] = useState<boolean[]>(Array(36).fill(false));

  const needsUnlock = searchParams.get('needs_unlock') === 'true';
  const narrativeId = searchParams.get('narrative_id');

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/decrypt' });
  }, [dispatch]);

  const handleDecrypt = async () => {
    if (!narrativeId) return;
    setIsDecrypting(true);
    setError('');

    let cellIndex = 0;
    const interval = setInterval(() => {
      setGridCells((prev) => {
        const next = [...prev];
        if (cellIndex < 36) {
          next[cellIndex] = true;
          cellIndex++;
        }
        return next;
      });
    }, 50);

    const result = await apiFetch<PaymentUnlockResponse>(
      '/payments/unlock-fragment',
      {
        method: 'POST',
        body: JSON.stringify({
          narrative_id: narrativeId,
          node_id: `${narrativeId.replace('NARRATIVE_', 'NODE_')}_004`,
        }),
      }
    );

    clearInterval(interval);

    if (result.success && result.data) {
      setUnlockedNode(result.data.unlocked_content);
      setGridCells(Array(36).fill(true));
    } else {
      setError(result.error || 'Decryption failed. Insufficient credits or invalid fragment.');
    }
    setIsDecrypting(false);
  };

  const credits = state.credits || { balance: 14.2, limit: 20.0 };

  return (
    <div className="min-h-[calc(100vh-136px)]">
      <div className="max-w-4xl mx-auto px-gutter py-12">
        <div className="mb-8">
          <p className="font-mono-data text-[10px] text-outline tracking-[0.2em] mb-3">
            DECRYPTION_GATEWAY // FRAGMENT_ACCESS
          </p>
          <h1 className="font-display-hero text-3xl text-on-surface tracking-[0.1em]">
            DECRYPT<span className="text-secondary">_</span>FRAGMENT
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
                FRAGMENT_MATRIX // 6×6_GRID
              </p>
              <span className="font-mono-data text-[10px] text-secondary">
                SYNC: {gridCells.filter(Boolean).length}/36
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mb-6">
              {gridCells.map((active, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setGridCells((prev) => {
                      const next = [...prev];
                      next[i] = !next[i];
                      return next;
                    });
                  }}
                  className={`aspect-square rounded-sm border cursor-pointer transition-all duration-300 ${
                    active
                      ? 'bg-secondary/30 border-secondary/60 shadow-[0_0_8px_rgba(123,208,255,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                />
              ))}
            </div>

            {needsUnlock && narrativeId && !unlockedNode && (
              <div className="text-center">
                <button
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="liquid-btn w-full py-3 text-sm tracking-[0.15em]"
                >
                  {isDecrypting ? 'DECRYPTING...' : 'INITIATE_DECRYPTION'}
                </button>
                <p className="font-mono-data text-[10px] text-outline mt-2">
                  COST: 2.50 CC // Current Balance: {credits.balance.toFixed(2)} CC
                </p>
              </div>
            )}

            {unlockedNode && (
              <div className="animate-glitch-reveal">
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 mb-4">
                  <p className="font-mono-data text-[10px] text-secondary tracking-[0.1em] mb-2">
                    FRAGMENT_UNLOCKED // {unlockedNode.id}
                  </p>
                  <h3 className="font-headline-lg text-lg text-on-surface mb-3">
                    {unlockedNode.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {unlockedNode.content.substring(0, 300)}...
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/narratives/${narrativeId}`)}
                  className="liquid-btn w-full"
                >
                  CONTINUE_NARRATIVE
                </button>
              </div>
            )}

            {error && (
              <div className="text-center">
                <GlitchText
                  text={error}
                  className="font-mono-data text-sm text-error"
                  active
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <CreditsDisplay balance={credits.balance} limit={credits.limit} />
            <div className="glass-panel rounded-xl p-4 space-y-3">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
                DECRYPTION_PROTOCOLS
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[10px] text-on-surface-variant">
                    Fragment Unlock
                  </span>
                  <span className="font-mono-data text-[10px] text-secondary">2.50 CC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[10px] text-on-surface-variant">
                    Deep Scan
                  </span>
                  <span className="font-mono-data text-[10px] text-secondary">0.40 CC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[10px] text-on-surface-variant">
                    Archive Access
                  </span>
                  <span className="font-mono-data text-[10px] text-secondary">0.05 CC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
