'use client';

import { useEffect, useState } from 'react';
import { useLifeOS } from '@/lib/store-client';
import GlassCard from '@/components/ui/GlassCard';
import GlitchText from '@/components/ui/GlitchText';
import ProgressBar from '@/components/ui/ProgressBar';

/**
 * System Override (SCREEN_33)
 * Interactive node re-syncing interface for ROOT-level operators.
 * Allows timeline recalibration and destiny path manipulation.
 */
export default function OverridePage() {
  const { state, dispatch, apiFetch } = useLifeOS();
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [temporalDrift, setTemporalDrift] = useState('+0.00042s');
  const [syncProbability, setSyncProbability] = useState(88.4);
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/override' });
  }, []);

  const handleOverride = async (narrativeId: string) => {
    setIsCalibrating(true);

    // Execute terminal override command
    await apiFetch('/terminal', {
      method: 'POST',
      body: JSON.stringify({ command: `OVERRIDE ${narrativeId}` }),
    });

    // Simulate recalibration
    setTimeout(() => {
      setTemporalDrift(`+${(Math.random() * 0.001).toFixed(5)}s`);
      setSyncProbability(85 + Math.random() * 15);
      setIsCalibrating(false);
      setIsOverrideActive(true);
    }, 1500);
  };

  const narrativeCards = [
    {
      id: 'NARRATIVE_082_MED',
      designation: '/life 医生',
      fragmentation: 74,
      neuralIntegrity: 91.2,
      dataIntegrity: 'HIGH',
    },
    {
      id: 'NARRATIVE_115_CORP',
      designation: '/life 大厂',
      fragmentation: 0,
      neuralIntegrity: 98.9,
      dataIntegrity: 'OPTIMAL',
    },
    {
      id: 'NARRATIVE_401_FREE',
      designation: '/life 大理',
      fragmentation: 22,
      neuralIntegrity: 14.5,
      dataIntegrity: 'CRITICAL',
    },
  ];

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
                [CAUTION: TEMPORAL_INTEGRITY_AT_RISK]
              </p>
            </div>
          </div>
        </div>

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
              {narrativeCards.map((card) => (
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
                            card.dataIntegrity === 'CRITICAL'
                              ? 'text-error'
                              : card.dataIntegrity === 'OPTIMAL'
                              ? 'text-secondary'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {card.dataIntegrity}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOverride(card.id)}
                    disabled={isCalibrating}
                    className="liquid-btn w-full mt-4 text-xs disabled:opacity-50"
                  >
                    Initiate_Override
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
                {[
                  '> SUBJECT_082: 14 YEARS SURGICAL EXP',
                  '> SUBJECT_115: QUARTERLY_YIELD_ANALYSIS',
                  '> SUBJECT_402: AURA_INTEGRATION_INDEX',
                  '[CRITICAL] WARNING: NODE_REWRITING_PERMANENT',
                  '> BIO_SCAN: NEURAL_PATHWAYS_ACTIVE',
                  '> OVERRIDE_LOG: PROTOCOL_72_ENGAGED',
                  '[WARN] MULTIPLE_OVERRIDE_ATTEMPTS_DETECTED',
                ].map((log, i) => (
                  <p
                    key={i}
                    className={`font-mono-data text-[10px] ${
                      log.startsWith('[CRITICAL]')
                        ? 'text-error'
                        : log.startsWith('[WARN]')
                        ? 'text-error/70'
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
