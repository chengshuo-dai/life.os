'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import NarrativeCard from '@/components/ui/NarrativeCard';
import GridOverlay from '@/components/ui/GridOverlay';
import type { NarrativeListItem } from '@/models/types';

/**
 * Narrative Hub (SCREEN_5 / SCREEN_22)
 * Central selector displaying all available narrative paths as 3:4 cards.
 * Features reassembly entrance effects.
 */
export default function HubPage() {
  const router = useRouter();
  const { state, dispatch, apiFetch } = useLifeOS();
  const [narratives, setNarratives] = useState<NarrativeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entrancePhase, setEntrancePhase] = useState(0);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/hub' });
    loadNarratives();
  }, []);

  // Staggered entrance animation
  useEffect(() => {
    if (!isLoading) {
      const t1 = setTimeout(() => setEntrancePhase(1), 200);
      const t2 = setTimeout(() => setEntrancePhase(2), 500);
      const t3 = setTimeout(() => setEntrancePhase(3), 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isLoading]);

  const loadNarratives = async () => {
    setIsLoading(true);
    const result = await apiFetch<NarrativeListItem[]>('/narratives');
    if (result.success && result.data) {
      setNarratives(result.data);
      dispatch({ type: 'SET_PATH_SYNC', pathSync: result.data.map((n) => ({
        narrative_path_id: n.id,
        sync_percentage: n.progress,
        is_complete: n.status === 'COMPLETED',
      })) });
    }
    setIsLoading(false);
  };

  const handleSelectNarrative = (narrativeId: string) => {
    router.push(`/narratives/${narrativeId}`);
  };

  return (
    <div className="min-h-[calc(100vh-136px)] relative">
      <GridOverlay />

      <div className="max-w-6xl mx-auto px-gutter py-12">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            entrancePhase >= 1
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-mono-data text-[10px] text-outline tracking-[0.2em] mb-3">
            检索另一种人生的终局
          </p>
          <h1 className="font-display-hero text-3xl md:text-4xl text-on-surface tracking-[0.1em]">
            NARRATIVE<span className="text-secondary">_</span>HUB
          </h1>
          <p className="font-mono-data text-xs text-on-surface-variant mt-4 max-w-md mx-auto">
            Select a narrative path to enter. Each path represents a life
            unfolding. Your choices shape the destiny.
          </p>
        </div>

        {/* Narrative Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-mono-data text-sm text-secondary cursor-blink">
              &gt; SCANNING_DESTINY_PATHS<span className="cursor-blink">_</span>
            </p>
          </div>
        ) : narratives.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono-data text-sm text-outline">
              [VOID] No narrative paths detected. Initialize system to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {narratives.map((narrative, i) => (
              <div
                key={narrative.id}
                className={`transition-all duration-700 ${
                  entrancePhase >= i + 1
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <NarrativeCard
                  narrative={narrative}
                  onClick={() => handleSelectNarrative(narrative.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Sync Status */}
        <div
          className={`text-center mt-12 transition-all duration-700 ${
            entrancePhase >= 3
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <p className="font-mono-data text-[10px] text-outline tracking-[0.1em]">
            SYNC_STATUS: {state.profile?.reality_sync_percentage
              ? `${(state.profile.reality_sync_percentage * 100).toFixed(1)}%`
              : '--'}
          </p>
        </div>
      </div>
    </div>
  );
}
