'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import ChoiceButton from '@/components/ui/ChoiceButton';
import GlitchText from '@/components/ui/GlitchText';
import ProgressBar from '@/components/ui/ProgressBar';
import type { NarrativeNode, NarrativeDetailResponse, ChoiceResponse } from '@/models/types';

/**
 * Narrative Scene Viewer
 * Displays a single narrative node with its prose content and choice buttons.
 * Handles the branching choice flow, countdown timers, and reaction time tracking.
 */
export default function NarrativeScenePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { state, dispatch, apiFetch } = useLifeOS();
  const [node, setNode] = useState<NarrativeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChoosing, setIsChoosing] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  // ─── Timer State ─────────────────────────────────────
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const nodeShownAt = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: `/narratives/${params.id}` });
    loadNarrative();
  }, [params.id]);

  useEffect(() => {
    if (node) {
      const t = setTimeout(() => setFadeIn(true), 100);
      // Start timer tracking
      nodeShownAt.current = Date.now();
      startTimer(node);
      return () => clearTimeout(t);
    }
  }, [node]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = (n: NarrativeNode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerExpired(false);

    const seconds = n.environment.timer_seconds;
    if (!seconds || seconds <= 0 || n.is_endpoint || n.choices.length === 0) {
      setTimerRemaining(0);
      return;
    }

    setTimerRemaining(seconds);
    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerExpired(true);
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  // Auto-select failure branch on timer expiry
  useEffect(() => {
    if (timerExpired && node && !isChoosing && !node.is_endpoint) {
      handleChoice(node.choices[node.choices.length - 1].id, true);
    }
  }, [timerExpired]);

  const loadNarrative = async () => {
    setIsLoading(true);
    setError('');
    setFadeIn(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const result = await apiFetch<NarrativeDetailResponse>(
      `/narratives/${params.id}`
    );

    if (result.success && result.data) {
      setNode(result.data.current_node);
    } else {
      setError(result.error || 'Failed to load narrative.');
    }
    setIsLoading(false);
  };

  const handleChoice = async (choiceId: string, isTimeout = false) => {
    if (!node) return;
    setIsChoosing(true);
    setFadeIn(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const reactionTime = Date.now() - nodeShownAt.current;

    const result = await apiFetch<ChoiceResponse>(
      `/narratives/${params.id}/choice`,
      {
        method: 'POST',
        body: JSON.stringify({
          node_id: node.id,
          choice_id: choiceId,
          reaction_time: Math.round(reactionTime),
        }),
      }
    );

    if (result.success && result.data) {
      dispatch({ type: 'APPLY_CHOICE', response: result.data });

      if (result.data.next_node.is_endpoint) {
        setNode(result.data.next_node);
        setIsChoosing(false);
      } else {
        setNode(result.data.next_node);
        setIsChoosing(false);
      }
    } else {
      if (result.error?.includes('Insufficient credits')) {
        router.push('/decrypt?needs_unlock=true&narrative_id=' + params.id);
      } else {
        setError(result.error || 'Choice failed.');
      }
      setIsChoosing(false);
    }
  };

  // ─── Timer formatting ────────────────────────────────
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-136px)] flex items-center justify-center">
        <p className="font-mono-data text-sm text-secondary cursor-blink">
          &gt; LOADING_NARRATIVE_STREAM<span className="cursor-blink">_</span>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-136px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <GlitchText text="DATA_STREAM_CORRUPTED" as="p" className="font-mono-data text-sm text-error" active />
          <p className="font-mono-data text-xs text-outline">{error}</p>
          <button onClick={loadNarrative} className="liquid-btn">
            RETRY_SYNC
          </button>
        </div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-[calc(100vh-136px)] flex items-center justify-center">
        <p className="font-mono-data text-sm text-outline">
          [VOID] No narrative data found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-136px)]">
      <div className="max-w-3xl mx-auto px-gutter py-12">
        {/* Node Header */}
        <div
          className={`mb-8 transition-all duration-700 ${
            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
              {params.id}
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary" />
            <span className="font-mono-data text-[10px] text-secondary tracking-[0.1em]">
              NODE_{String(node.sequence_index).padStart(3, '0')}
            </span>
            {node.is_paywalled && (
              <span className="font-mono-data text-[10px] text-error tracking-[0.1em] ml-auto">
                [PAYWALL: {node.credit_cost || 2} CC]
              </span>
            )}
            {/* Timer display */}
            {timerRemaining > 0 && !node.is_endpoint && (
              <span
                className={`font-mono-data text-xs tracking-[0.1em] ml-auto px-2 py-0.5 rounded-sm border ${
                  timerRemaining <= 10
                    ? 'text-error border-error/40 bg-error/10 animate-pulse'
                    : 'text-secondary border-secondary/30 bg-secondary/5'
                }`}
              >
                ⏱ {formatTimer(timerRemaining)}
              </span>
            )}
            {timerExpired && (
              <span className="font-mono-data text-xs text-error tracking-[0.1em] ml-auto">
                TIMEOUT — AUTO_SELECTING
              </span>
            )}
          </div>
          <h1 className="font-headline-lg text-xl text-on-surface">{node.title}</h1>
        </div>

        {/* Narrative Prose */}
        <div
          className={`mb-10 transition-all duration-700 delay-150 ${
            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="space-y-4">
            {node.content.split('\n').map((paragraph, i) => {
              if (!paragraph.trim()) return null;
              // Terminal-style log lines
              if (paragraph.startsWith('>') || paragraph.startsWith('[')) {
                return (
                  <p key={i} className="font-mono-data text-xs text-secondary my-2">
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={i} className="font-body-md text-base text-on-surface-variant/90 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Glitch intensity indicator */}
        {node.environment.glitch_intensity > 0.2 && (
          <div className="mb-8">
            <ProgressBar
              value={node.environment.glitch_intensity * 100}
              max={100}
              label="SIGNAL_DEGRADATION"
              variant={node.environment.glitch_intensity > 0.35 ? 'error' : 'cyan'}
            />
          </div>
        )}

        {/* Choices */}
        {!isChoosing && !node.is_endpoint && node.choices.length > 0 && (
          <div
            className={`space-y-4 transition-all duration-700 delay-300 ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-2">
              AVAILABLE_ACTIONS
            </p>
            {node.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                onClick={() => handleChoice(choice.id, false)}
                disabled={isChoosing || timerExpired}
              />
            ))}
          </div>
        )}

        {/* Choosing indicator */}
        {isChoosing && (
          <div className="text-center py-8">
            <p className="font-mono-data text-sm text-secondary cursor-blink">
              &gt; PROCESSING_CHOICE<span className="cursor-blink">_</span>
            </p>
          </div>
        )}

        {/* Endpoint */}
        {node.is_endpoint && (
          <div
            className={`text-center py-8 space-y-6 transition-all duration-700 delay-300 ${
              fadeIn ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="font-mono-data text-sm text-secondary tracking-[0.15em]">
              [NARRATIVE_PATH_COMPLETE]
            </p>
            <p className="font-body-md text-on-surface-variant">
              This path has reached its resolution. Your choices are archived in
              the Destiny Data Bank.
            </p>
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
      </div>
    </div>
  );
}
