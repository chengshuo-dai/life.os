'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLifeOS } from '@/lib/store-client';
import GlassCard from '@/components/ui/GlassCard';
import GlitchText from '@/components/ui/GlitchText';
import ProgressBar from '@/components/ui/ProgressBar';
import type { ArchiveTimelineEntry, CorruptedArcCard } from '@/models/types';

/**
 * Memory Archive / Destiny Data Bank (SCREEN_6 / SCREEN_14 / SCREEN_40)
 * Timeline scrubbing interface displaying narrative history with corrupted data layers.
 */
export default function ArchivePage() {
  const { state, dispatch, apiFetch } = useLifeOS();
  const [entries, setEntries] = useState<ArchiveTimelineEntry[]>([]);
  const [corruptedCards, setCorruptedCards] = useState<CorruptedArcCard[]>([]);
  const [hasCorrupted, setHasCorrupted] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'strata'>('timeline');
  const [strataData, setStrataData] = useState<{
    surface: ArchiveTimelineEntry[];
    subsurface: ArchiveTimelineEntry[];
    redacted: ArchiveTimelineEntry[];
    bedrock: ArchiveTimelineEntry[];
  } | null>(null);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/archive' });
    loadArchive();
  }, []);

  const loadArchive = async (timestamp?: number) => {
    setIsLoading(true);
    const query = timestamp ? `?timestamp=${timestamp}` : '';

    if (viewMode === 'strata') {
      // Use strata endpoint for layered geological view
      const result = await apiFetch<{
        strata: {
          surface: ArchiveTimelineEntry[];
          subsurface: ArchiveTimelineEntry[];
          redacted: ArchiveTimelineEntry[];
          bedrock: ArchiveTimelineEntry[];
        };
        counts: { surface: number; subsurface: number; redacted: number; bedrock: number; total: number };
        corrupted_cards: CorruptedArcCard[];
        has_corrupted_data: boolean;
        scrubbing_position: number;
        system_stability: number;
        active_nodes: number;
        reality_sync: number;
      }>(`/archive/strata${query}`);

      if (result.success && result.data) {
        setStrataData(result.data.strata);
        setCorruptedCards(result.data.corrupted_cards || []);
        setHasCorrupted(result.data.has_corrupted_data);
        setScrubPosition(result.data.scrubbing_position);
        // Flatten for entry-based rendering compatibility
        setEntries([
          ...result.data.strata.surface,
          ...result.data.strata.subsurface,
          ...result.data.strata.redacted,
          ...result.data.strata.bedrock,
        ]);
      }
    } else {
      // Default timeline view
      const result = await apiFetch<{
        entries: ArchiveTimelineEntry[];
        corrupted_cards: CorruptedArcCard[];
        has_corrupted_data: boolean;
        scrubbing_position: number;
        system_stability: number;
        active_nodes: number;
      }>(`/archive/timeline${query}`);

      if (result.success && result.data) {
        setEntries(result.data.entries);
        setCorruptedCards(result.data.corrupted_cards || []);
        setHasCorrupted(result.data.has_corrupted_data);
        setScrubPosition(result.data.scrubbing_position);
        setStrataData(null);
      }
    }
    setIsLoading(false);
  };

  const handleScrub = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const baseTime = 1710800000;
      const range = 86400 * 30; // 30 days of timeline
      const timestamp = Math.round(baseTime + percentage * range);
      setScrubPosition(timestamp);
      setIsScrubbing(true);
    },
    []
  );

  const handleScrubEnd = useCallback(() => {
    setIsScrubbing(false);
    loadArchive(scrubPosition);
  }, [scrubPosition]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isScrubbing) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const baseTime = 1710800000;
      const range = 86400 * 30;
      const timestamp = Math.round(baseTime + percentage * range);
      setScrubPosition(timestamp);
    },
    [isScrubbing]
  );

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts * 1000);
    return d.toISOString().split('T')[0];
  };

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case 'CHOICE':
        return 'text-secondary';
      case 'CORRUPTED':
      case 'REDACTED':
        return 'text-error';
      case 'SYSTEM_EVENT':
        return 'text-outline';
      default:
        return 'text-on-surface-variant';
    }
  };

  return (
    <div className="min-h-[calc(100vh-136px)]">
      <div className="max-w-6xl mx-auto px-gutter py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono-data text-[10px] text-outline tracking-[0.2em] mb-3">
            MEMORY_ARCHIVE // DESTINY_DATA_BANK
          </p>
          <div className="flex items-center justify-between">
            <h1 className="font-display-hero text-3xl text-on-surface tracking-[0.1em]">
              TIMELINE<span className="text-secondary">_</span>ARCHIVE
            </h1>
            <div className="flex items-center gap-4">
              {/* View mode toggle */}
              <div className="flex items-center gap-1 glass-panel rounded-md p-0.5">
                <button
                  onClick={() => {
                    setViewMode('timeline');
                    loadArchive(scrubPosition);
                  }}
                  className={`px-3 py-1 text-[10px] font-mono-data tracking-[0.1em] rounded transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-secondary/20 text-secondary'
                      : 'text-outline hover:text-on-surface-variant'
                  }`}
                >
                  TIMELINE
                </button>
                <button
                  onClick={() => {
                    setViewMode('strata');
                    loadArchive(scrubPosition);
                  }}
                  className={`px-3 py-1 text-[10px] font-mono-data tracking-[0.1em] rounded transition-all ${
                    viewMode === 'strata'
                      ? 'bg-secondary/20 text-secondary'
                      : 'text-outline hover:text-on-surface-variant'
                  }`}
                >
                  STRATA
                </button>
              </div>
              <span className="font-mono-data text-[10px] text-secondary">
                STABILITY: {99.98}%
              </span>
              <span className="font-mono-data text-[10px] text-outline">
                NODES: 12,402
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="mb-8">
          <p className="font-mono-data text-[10px] text-outline tracking-[0.1em] mb-2">
            SCRUB_POSITION: T-{Math.floor(scrubPosition * 0.001)} //{' '}
            {formatTimestamp(scrubPosition || Math.floor(Date.now() / 1000))}
          </p>
          <div
            className="relative h-12 glass-panel rounded-lg cursor-pointer overflow-hidden"
            onMouseDown={handleScrub}
            onMouseMove={handleMouseMove}
            onMouseUp={handleScrubEnd}
            onMouseLeave={handleScrubEnd}
          >
            <div className="absolute inset-0 flex items-center px-4">
              <div className="w-full h-[2px] bg-white/10 rounded-full">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-75"
                  style={{
                    width: `${
                      ((scrubPosition - 1710800000) / (86400 * 30)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-6 bg-secondary rounded-sm shadow-[0_0_10px_rgba(123,208,255,0.5)] transition-all duration-75"
              style={{
                left: `${
                  ((scrubPosition - 1710800000) / (86400 * 30)) * 100
                }%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        {/* Strata Layer Visualization (Alignment Guide §1.E) */}
        {viewMode === 'strata' && strataData && !isLoading && (
          <div className="mb-8 space-y-3">
            <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-3">
              GEOLOGICAL_STRATA_VIEW
            </p>
            {/* SURFACE layer */}
            {strataData.surface.length > 0 && (
              <div className="glass-panel rounded-lg p-4 border-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-mono-data text-[10px] text-secondary tracking-[0.1em]">
                    SURFACE_LAYER
                  </span>
                  <span className="font-mono-data text-[9px] text-outline">
                    ({strataData.surface.length} entries // LOW_FRAGMENTATION)
                  </span>
                </div>
              </div>
            )}
            {/* SUBSURFACE layer */}
            {strataData.subsurface.length > 0 && (
              <div className="glass-panel rounded-lg p-4 border-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                  <span className="font-mono-data text-[10px] text-amber-500/80 tracking-[0.1em]">
                    SUBSURFACE_LAYER
                  </span>
                  <span className="font-mono-data text-[9px] text-outline">
                    ({strataData.subsurface.length} entries // MODERATE_FRAGMENTATION)
                  </span>
                </div>
              </div>
            )}
            {/* REDACTED layer */}
            {strataData.redacted.length > 0 && (
              <div className="glass-panel rounded-lg p-4 border-error/20 bg-error/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="font-mono-data text-[10px] text-error tracking-[0.1em]">
                    REDACTED_STRATA
                  </span>
                  <span className="font-mono-data text-[9px] text-outline">
                    ({strataData.redacted.length} entries // CORRUPTED_OR_CLASSIFIED)
                  </span>
                </div>
              </div>
            )}
            {/* BEDROCK layer */}
            {strataData.bedrock.length > 0 && (
              <div className="glass-panel rounded-lg p-4 border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="font-mono-data text-[10px] text-outline tracking-[0.1em]">
                    BEDROCK
                  </span>
                  <span className="font-mono-data text-[9px] text-outline">
                    ({strataData.bedrock.length} entries // SYSTEM_EVENTS_IMMUTABLE)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline Entries */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="font-mono-data text-sm text-secondary cursor-blink">
              &gt; ACCESSING_MEMORY_STRATA<span className="cursor-blink">_</span>
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            {entries.map((entry) => (
              <GlassCard
                key={entry.id}
                className={`p-4 transition-all ${entry.is_corrupted ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono-data text-[10px] text-outline shrink-0 mt-0.5">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-mono-data text-[10px] tracking-[0.1em] ${getEntryTypeColor(entry.type)}`}
                      >
                        [{entry.type}]
                      </span>
                      {entry.narrative_path && (
                        <span className="font-mono-data text-[9px] text-outline">
                          {entry.narrative_path}
                        </span>
                      )}
                    </div>
                    {entry.is_corrupted ? (
                      <GlitchText
                        text={entry.label}
                        className="font-mono-data text-xs"
                        active
                      />
                    ) : (
                      <p className="font-mono-data text-xs text-on-surface-variant">
                        {entry.label}
                      </p>
                    )}
                    {entry.corruption_message && (
                      <p className="font-mono-data text-[10px] text-error mt-1">
                        {entry.corruption_message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <div className="text-right">
                      <p className="font-mono-data text-[9px] text-outline">FRAG</p>
                      <p className="font-mono-data text-[10px] text-on-surface-variant">
                        {(entry.metrics.fragmentation_index * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-data text-[9px] text-outline">NEURAL</p>
                      <p className="font-mono-data text-[10px] text-on-surface-variant">
                        {(entry.metrics.neural_integrity * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Corrupted Strata */}
        {hasCorrupted && corruptedCards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              <p className="font-mono-data text-xs text-error tracking-[0.15em]">
                REDACTED_STRATA // CORRUPTED_DATA
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {corruptedCards.map((card, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-xl p-5 border-error/10 opacity-70"
                >
                  <p className="font-display-hero text-2xl text-error/30 mb-3">
                    {card.decorative_index}
                  </p>
                  <p className="font-mono-data text-xs text-error mb-2">
                    {card.narrative_path_id}
                  </p>
                  <p className="font-mono-data text-[10px] text-outline mb-3">
                    {card.designation}
                  </p>
                  <ProgressBar
                    value={card.integrity_level}
                    max={100}
                    variant="error"
                    label="INTEGRITY"
                    showPercent
                  />
                  <div className="mt-3 space-y-1">
                    {card.raw_data_stream.slice(0, 3).map((line, j) => (
                      <GlitchText
                        key={j}
                        text={line}
                        className="font-mono-data text-[10px] text-error/60"
                        active
                      />
                    ))}
                  </div>
                  <button className="liquid-btn w-full mt-4 text-xs hover:border-error/30">
                    {card.button_action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
