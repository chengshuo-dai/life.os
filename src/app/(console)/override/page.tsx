'use client';

import { useEffect, useState } from 'react';
import { useLifeOS } from '@/lib/store-client';
import GlassCard from '@/components/ui/GlassCard';
import GlitchText from '@/components/ui/GlitchText';
import ProgressBar from '@/components/ui/ProgressBar';
import type { NarrativeListItem, NarrativeNode } from '@/models/types';

interface OverrideResult {
  backtracked_node: NarrativeNode;
  previous_node_id: string | null;
  cost: number;
  new_balance: number;
  new_progress: number;
  choices_preserved: string[];
}

/**
 * System Override (SCREEN_33)
 * Interactive node re-syncing interface for ROOT-level operators.
 * Allows timeline recalibration and destiny path manipulation
 * via the dedicated POST /api/v1/narratives/:id/override endpoint.
 */
export default function OverridePage() {
  const { state, dispatch, apiFetch } = useLifeOS();
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [temporalDrift, setTemporalDrift] = useState('+0.00000s');
  const [syncProbability, setSyncProbability] = useState(88.4);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [activeOverrideNarrative, setActiveOverrideNarrative] = useState<string | null>(null);
  const [overrideResult, setOverrideResult] = useState<OverrideResult | null>(null);
  const [error, setError] = useState('');
  const [systemLogs, setSystemLogs] = useState<string[]>([
    '> SUBJECT_082: 14 YEARS SURGICAL EXP',
    '> SUBJECT_115: QUARTERLY_YIELD_ANALYSIS',
    '> SUBJECT_401: AURA_INTEGRATION_INDEX',
    '[CRITICAL] WARNING: NODE_REWRITING_PERMANENT',
    '> BIO_SCAN: NEURAL_PATHWAYS_ACTIVE',
    '> OVERRIDE_LOG: PROTOCOL_72_ENGAGED',
    '[WARN] MULTIPLE_OVERRIDE_ATTEMPTS_DETECTED',
  ]);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/override' });
  }, []);

  // Derive narrative cards from actual store state instead of hardcoding
  const narrativeCards: NarrativeListItem[] = (state.narratives || []).map((n) => {
    const pathSync = state.pathSync.find(
      (p) => p.narrative_path_id === n.id
    );
    return {
      id: n.id,
      path: n.path,
      number: n.number,
      title: n.title,
      subtitle: n.subtitle,
      designation: n.path === 'MED' ? '/life 医生' : n.path === 'CORP' ? '/life 大厂' : '/life 大理',
      status: n.status,
      progress: n.progress,
      recovery_level: n.recovery_level,
      fragmentation: pathSync?.sync_percentage ? 100 - pathSync.sync_percentage : n.progress > 0 ? 30 : 0,
      neural_integrity: pathSync?.sync_percentage ? pathSync.sync_percentage / 100 : 0.9,
      data_integrity: n.status === 'COMPLETED' ? 'HIGH' : n.progress > 50 ? 'MEDIUM' : 'LOW',
      active_path: n.status === 'IN_PROGRESS',
    };
  });

  // Fallback to hardcoded cards if store hasn't loaded
  const displayCards = narrativeCards.length > 0
    ? narrativeCards
    : [
        {
          id: 'NARRATIVE_082_MED',
          path: 'MED' as const,
          number: 82,
          title: 'The Trauma Bay',
          subtitle: 'Medical Reality',
          designation: '/life 医生',
          status: 'UNLOCKED' as const,
          progress: 0,
          recovery_level: 'HIGH' as const,
          fragmentation: 74,
          neural_integrity: 91.2,
          data_integrity: 'HIGH',
          active_path: true,
        },
        {
          id: 'NARRATIVE_115_CORP',
          path: 'CORP' as const,
          number: 115,
          title: 'The Cover-Up',
          subtitle: 'Corporate Reality',
          designation: '/life 大厂',
          status: 'LOCKED' as const,
          progress: 0,
          recovery_level: 'MEDIUM' as const,
          fragmentation: 0,
          neural_integrity: 98.9,
          data_integrity: 'OPTIMAL',
          active_path: false,
        },
        {
          id: 'NARRATIVE_401_FREE',
          path: 'FREE' as const,
          number: 401,
          title: "The Fugitive's Trail",
          subtitle: 'Free Reality',
          designation: '/life 大理',
          status: 'LOCKED' as const,
          progress: 0,
          recovery_level: 'LOW' as const,
          fragmentation: 22,
          neural_integrity: 14.5,
          data_integrity: 'CRITICAL',
          active_path: false,
        },
      ];

  const handleOverride = async (narrativeId: string) => {
    setIsCalibrating(true);
    setError('');
    setOverrideResult(null);
    setActiveOverrideNarrative(narrativeId);

    // Use the dedicated override API endpoint
    // The target node is the first node of the narrative (full backtrack)
    const result = await apiFetch<OverrideResult>(
      `/narratives/${narrativeId}/override`,
      {
        method: 'POST',
        body: JSON.stringify({
          target_node_id: `${narrativeId.replace('NARRATIVE_', 'NODE_')}_001`,
        }),
      }
    );

    if (result.success && result.data) {
      setOverrideResult(result.data);
      setTemporalDrift(`+${(Math.random() * 0.001).toFixed(5)}s`);
      setSyncProbability(85 + Math.random() * 15);
      setIsOverrideActive(true);

      // Add to system logs
      setSystemLogs((prev) => [
        `> OVERRIDE_SUCCESS: ${narrativeId} → ${result.data!.backtracked_node.id}`,
        `> COST: ${result.data!.cost} CC // BALANCE: ${result.data!.new_balance.toFixed(2)} CC`,
        ...prev.slice(0, 5),
      ]);

      // Update credits in store
      if (state.credits) {
        dispatch({
          type: 'SET_CREDITS',
          credits: { ...state.credits, balance: result.data.new_balance },
        });
      }
    } else {
      setError(result.error || 'Override failed.');
      setSystemLogs((prev) => [
        `[ERROR] OVERRIDE_FAILED: ${narrativeId} // ${result.error || 'Unknown'}`,
        ...prev.slice(0, 6),
      ]);
    }

    setIsCalibrating(false);
  };

  return (
    <div className="min-h-[calc(100vh-136px)]">
      <div className="max-w-6xl mx-auto px-gutter py-12">
        {/* Warning Banner */}
        <div className="glass-panel rounded-xl p-4 border-error/20 bg-error/5 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <div>
              <p className="font-mono-data text-xs text-error tracking-[0.1em]">
                SYSTEM_OVERRIDE_ACTIVE // PROTOCOL_72_ENGAGED
              </p>
              <p className="font-mono-data text-[10px] text-error/70 mt-1">
                [CAUTION: TEMPORAL_INTEGRITY_AT_RISK] // COST: 3.00 CC PER OVERRIDE
              </p>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 glass-panel rounded-lg border-error/20">
            <GlitchText
              text={error}
              className="font-mono-data text-sm text-error"
              active
            />
          </div>
        )}

        {/* Override success result */}
        {overrideResult && (
          <div className="mb-6 p-5 glass-panel rounded-xl border-secondary/20 bg-secondary/5">
            <p className="font-mono-data text-[10px] text-secondary tracking-[0.1em] mb-3">
              OVERRIDE_SUCCESSFUL // TEMPORAL_RECALIBRATION_COMPLETE
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-mono-data text-[9px] text-outline">BACKTRACKED TO</p>
                <p className="font-mono-data text-xs text-on-surface">
                  {overrideResult.backtracked_node.id}
                </p>
              </div>
              <div>
                <p className="font-mono-data text-[9px] text-outline">FROM</p>
                <p className="font-mono-data text-xs text-on-surface">
                  {overrideResult.previous_node_id || 'START'}
                </p>
              </div>
              <div>
                <p className="font-mono-data text-[9px] text-outline">NEW BALANCE</p>
                <p className="font-mono-data text-xs text-secondary">
                  {overrideResult.new_balance.toFixed(2)} CC
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Node Recalibration */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-xl p-5 space-y-4">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
                NODE_RECALIBRATION
              </p>

              <div>
                <p className="font-mono-data text-[9px] text-outline mb-1">TEMPORAL_DRIFT</p>
                <GlitchText
                  text={temporalDrift}
                  className="font-mono-data text-sm text-secondary"
                  active={isOverrideActive}
                />
              </div>

              <div>
                <p className="font-mono-data text-[9px] text-outline mb-1">SYNC_PROBABILITY</p>
                <div className="flex items-center gap-2">
                  <ProgressBar
                    value={syncProbability}
                    max={100}
                    variant="cyan"
                    pulse={isCalibrating}
                    className="flex-1"
                  />
                  <span className="font-mono-data text-xs text-secondary">
                    {syncProbability.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="font-mono-data text-[9px] text-outline mb-1">CREDITS</p>
                <p className="font-mono-data text-sm text-on-surface">
                  {state.credits?.balance.toFixed(2) ?? '0.00'} CC
                </p>
              </div>

              {isCalibrating && (
                <div className="pt-2">
                  <p className="font-mono-data text-[10px] text-secondary cursor-blink">
                    &gt; CALIBRATING_FLUX_CAPACITANCE<span className="cursor-blink">_</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Center: Narrative Override Cards */}
          <div className="lg:col-span-6">
            <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-4">
              NARRATIVE_PATH_OVERRIDES
            </p>
            <div className="space-y-4">
              {displayCards.map((card) => (
                <GlassCard key={card.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono-data text-xs text-on-surface-variant">
                        {card.id}
                      </p>
                      <p className="font-mono-data text-[10px] text-outline">
                        Designation: {card.designation}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono-data text-[9px] text-outline">FRAG</p>
                        <p className="font-mono-data text-[10px] text-on-surface-variant">
                          {card.fragmentation}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono-data text-[9px] text-outline">INTEGRITY</p>
                        <p
                          className={`font-mono-data text-[10px] ${
                            card.data_integrity === 'CRITICAL'
                              ? 'text-error'
                              : card.data_integrity === 'OPTIMAL'
                              ? 'text-secondary'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {card.data_integrity}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOverride(card.id)}
                    disabled={
                      isCalibrating ||
                      card.status === 'LOCKED' ||
                      (state.credits?.balance ?? 0) < 3.0
                    }
                    className="liquid-btn w-full mt-4 text-xs disabled:opacity-50"
                    title={
                      card.status === 'LOCKED'
                        ? 'Narrative path is locked'
                        : (state.credits?.balance ?? 0) < 3.0
                        ? 'Insufficient credits (3.00 CC required)'
                        : 'Override this narrative path'
                    }
                  >
                    {activeOverrideNarrative === card.id && isCalibrating
                      ? 'Calibrating...'
                      : 'Initiate_Override'}
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right: System Logs */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-xl p-5">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-3">
                SYSTEM_LOGS
              </p>
              <div className="terminal-scroll max-h-80 overflow-y-auto space-y-2">
                {systemLogs.map((log, i) => (
                  <p
                    key={i}
                    className={`font-mono-data text-[10px] ${
                      log.startsWith('[CRITICAL]')
                        ? 'text-error'
                        : log.startsWith('[WARN]') || log.startsWith('[ERROR]')
                        ? 'text-error/70'
                        : log.startsWith('> OVERRIDE_SUCCESS')
                        ? 'text-secondary'
                        : 'text-on-surface-variant/70'
                    }`}
                  >
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
