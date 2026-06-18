'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import LightWaves from '@/components/ui/LightWaves';

/**
 * System Initialization Gateway (SCREEN_4 / SCREEN_32)
 * The boot sequence where users IDENTIFY themselves.
 * First entry point into Life.OS after landing.
 */
export default function InitializePage() {
  const router = useRouter();
  const { state, dispatch, apiFetch } = useLifeOS();
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'error'>(
    state.isAuthenticated ? 'granted' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [bootProgress, setBootProgress] = useState(0);

  const handleInitialize = async () => {
    setStatus('authenticating');
    setErrorMsg('');

    // Simulate boot sequence progress
    const bootInterval = setInterval(() => {
      setBootProgress((prev) => Math.min(prev + Math.random() * 15, 92));
    }, 200);

    try {
      const result = await apiFetch<{
        token: string;
        expires_at: number;
        user: any;
      }>('/auth/initialize', {
        method: 'POST',
        body: JSON.stringify({
          biometric_signature: `web-${navigator.userAgent}-${Date.now()}`,
          device_metadata: {
            user_agent: navigator.userAgent,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            locale: navigator.language,
          },
        }),
      });

      clearInterval(bootInterval);

      if (result.success && result.data) {
        setBootProgress(100);
        dispatch({ type: 'SET_TOKEN', token: result.data.token });
        dispatch({ type: 'SET_PROFILE', profile: result.data.user });

        // Persist token
        localStorage.setItem('lifeos_token', result.data.token);

        setStatus('granted');

        // Navigate after brief pause
        setTimeout(() => {
          dispatch({ type: 'SET_AUTH', isAuthenticated: true });
          router.push('/transition');
        }, 1500);
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Neural link initialization failed.');
      }
    } catch {
      clearInterval(bootInterval);
      setStatus('error');
      setErrorMsg('SYSTEM_UNREACHABLE // Verify uplink and retry.');
    }
  };

  const logLines = [
    '[BOOT] Life.OS Kernel v3.2.1 // ALPHA-9-SYNC',
    '[BOOT] Initializing neural interface...',
    `[BOOT] Signal strength: ${(0.8 + Math.random() * 0.2).toFixed(2)} MS`,
    '[BOOT] Quantum state verified... OK',
    '[BOOT] Destiny engine online...',
    `[BOOT] Boot sequence: ${bootProgress.toFixed(0)}%`,
    '[SYNC] Uplink established // LATENCY: 0.02ms',
    '[AUTH] Awaiting biometric signature...',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <LightWaves color="cyan" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg mx-auto px-6 text-center">
        {/* OS Logo */}
        <div className="mb-4">
          <p className="font-display-hero text-3xl text-on-surface tracking-[0.2em]">
            LIFE<span className="text-secondary">.</span>OS
          </p>
          <p className="font-mono-data text-[10px] text-outline tracking-[0.3em] mt-2">
            NARRATIVE REALITY CONSOLE
          </p>
        </div>

        {/* Status indicator */}
        <div className="glass-panel rounded-xl p-6 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'idle'
                  ? 'bg-outline'
                  : status === 'authenticating'
                  ? 'bg-secondary animate-pulse'
                  : status === 'granted'
                  ? 'bg-secondary'
                  : 'bg-error animate-pulse'
              }`}
            />
            <span className="font-mono-data text-xs text-on-surface-variant tracking-[0.1em]">
              {status === 'idle'
                ? 'AWAITING_OPERATOR'
                : status === 'authenticating'
                ? 'BOOT_SEQUENCE_ACTIVE'
                : status === 'granted'
                ? 'ACCESS_GRANTED'
                : 'INITIALIZATION_FAILED'}
            </span>
          </div>

          {/* Boot log */}
          <div className="terminal-scroll max-h-48 overflow-y-auto space-y-1 mb-4 text-left">
            {logLines.map((line, i) => (
              <p
                key={i}
                className="font-mono-data text-[11px] text-on-surface-variant animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {line}
              </p>
            ))}
            {status === 'authenticating' && (
              <p className="font-mono-data text-[11px] text-secondary cursor-blink">
                &gt; PROCESSING<span className="cursor-blink">_</span>
              </p>
            )}
          </div>

          {/* Error message */}
          {errorMsg && (
            <p className="font-mono-data text-xs text-error mb-4 animate-fade-in">{errorMsg}</p>
          )}

          {/* Action button */}
          {status !== 'granted' && (
            <button
              onClick={handleInitialize}
              disabled={status === 'authenticating'}
              className="liquid-btn w-full py-3 text-sm tracking-[0.15em] disabled:opacity-50"
            >
              {status === 'authenticating' ? 'AUTHENTICATING...' : 'IDENTIFY_USER'}
            </button>
          )}

          {status === 'granted' && (
            <p className="font-mono-data text-sm text-secondary animate-fade-in">
              INITIALIZATION_COMPLETE // Redirecting to narrative console...
            </p>
          )}
        </div>

        {/* Metadata footer */}
        <div className="font-mono-data text-[9px] text-outline tracking-[0.15em] space-y-1">
          <p>LOC: 40.7128° N, 74.0060° W</p>
          <p>PATH: NEURAL/CORE/SYNC</p>
          <p>OS_VER: ALPHA-9-SYNC</p>
        </div>
      </div>
    </div>
  );
}
