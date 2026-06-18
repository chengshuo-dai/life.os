'use client';

import { useEffect, useState } from 'react';
import { useLifeOS } from '@/lib/store-client';
import CreditsDisplay from '@/components/ui/CreditsDisplay';
import RealitySyncRing from '@/components/ui/RealitySyncRing';
import ProgressBar from '@/components/ui/ProgressBar';
import type { PathSyncItem } from '@/models/types';

/**
 * System Profile (SCREEN_29)
 * Reality sync dashboard displaying user metrics, credits, and path synchronicity.
 */
export default function ProfilePage() {
  const { state, dispatch, apiFetch } = useLifeOS();
  const [profile, setProfile] = useState<any>(null);
  const [pathSync, setPathSync] = useState<PathSyncItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/profile' });
    loadProfile();
  }, []);

  // Simulate live terminal logs
  useEffect(() => {
    const logMessages = [
      '[LOG] Reality quotient verified: STABLE',
      '[SYNC] Neural pathway 082: ACTIVE',
      '[TRANS] Narrative interaction fee: -0.40 CC',
      '[CREDIT] Daily existence quota: +2.00 CC',
      '[WARN] Minor temporal drift detected',
      '[LOG] Memory strata depth: 4',
    ];

    const interval = setInterval(() => {
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
      setTerminalLogs((prev) => [...prev.slice(-20), `[${getTimestamp()}] ${msg}`]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadProfile = async () => {
    const result = await apiFetch<any>('/user/profile');
    if (result.success && result.data) {
      setProfile(result.data);
      setPathSync(result.data.path_synchronicity || []);
    }
    setIsLoading(false);
  };

  const getTimestamp = () => {
    const d = new Date();
    return [
      d.getHours().toString().padStart(2, '0'),
      d.getMinutes().toString().padStart(2, '0'),
      d.getSeconds().toString().padStart(2, '0'),
    ].join(':');
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-136px)] flex items-center justify-center">
        <p className="font-mono-data text-sm text-secondary cursor-blink">
          &gt; LOADING_PROFILE_DATA<span className="cursor-blink">_</span>
        </p>
      </div>
    );
  }

  const userProfile = profile?.profile || state.profile;
  const credits = profile?.credits || { balance: 14.2, limit: 20.0 };

  return (
    <div className="min-h-[calc(100vh-136px)]">
      <div className="max-w-6xl mx-auto px-gutter py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono-data text-[10px] text-outline tracking-[0.2em] mb-3">
            SYSTEM_PROFILE // REALITY_SYNC_DASHBOARD
          </p>
          <h1 className="font-display-hero text-3xl text-on-surface tracking-[0.1em]">
            OPERATOR<span className="text-secondary">_</span>PROFILE
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Identity */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                <span className="font-display-hero text-xl text-outline">
                  {userProfile?.operator_name?.[0] || '?'}
                </span>
              </div>
              <div className="text-center space-y-2">
                <p className="font-headline-lg text-lg text-on-surface">
                  {userProfile?.operator_name || 'OPERATOR_NULL'}
                </p>
                <p className="font-mono-data text-xs text-secondary flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {userProfile?.clearance || 'ROOT'}_ACCESS
                </p>
                <p className="font-mono-data text-[10px] text-outline">
                  ID: {userProfile?.id || 'ALPHA-9-SYNC'}
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 space-y-3">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
                SYSTEM_PROTOCOLS
              </p>
              {['Sync Settings', 'Security Clearance', 'Neural Dampening', 'Destiny Export'].map(
                (protocol) => (
                  <div
                    key={protocol}
                    className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                  >
                    <span className="font-mono-data text-xs text-on-surface-variant">
                      {protocol}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline" />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Main: Metrics */}
          <div className="lg:col-span-9 space-y-6">
            {/* Credits + Reality Sync */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CreditsDisplay balance={credits.balance} limit={credits.limit} />
              <div className="glass-panel rounded-xl p-6 flex items-center justify-center">
                <RealitySyncRing
                  percentage={userProfile?.reality_sync_percentage || 0.846}
                />
              </div>
            </div>

            {/* Path Synchronicity */}
            <div className="glass-panel rounded-xl p-6">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-4">
                PATH_SYNCHRONICITY
              </p>
              <div className="space-y-4">
                {pathSync.map((path) => (
                  <div key={path.narrative_path_id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-xs text-on-surface-variant">
                        {path.narrative_path_id}
                      </span>
                      <span className="font-mono-data text-xs text-secondary">
                        {path.sync_percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      value={path.sync_percentage}
                      max={100}
                      variant={path.is_complete ? 'cyan' : path.sync_percentage > 50 ? 'cyan' : 'violet'}
                      pulse={!path.is_complete}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Log */}
            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-mono-data text-[10px] text-outline ml-2">
                  Console :: Alpha-9-Terminal
                </span>
              </div>
              <div className="terminal-scroll max-h-48 overflow-y-auto space-y-0.5">
                {terminalLogs.map((log, i) => (
                  <p
                    key={i}
                    className={`font-mono-data text-[11px] ${
                      log.includes('WARN') || log.includes('CRITICAL')
                        ? 'text-error'
                        : log.includes('TRANS')
                        ? 'text-secondary/70'
                        : 'text-on-surface-variant/70'
                    }`}
                  >
                    {log}
                  </p>
                ))}
                <p className="font-mono-data text-[11px] text-secondary">
                  &gt; <span className="cursor-blink">_</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
