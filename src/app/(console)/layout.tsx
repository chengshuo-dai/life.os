'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LifeOSProvider, useLifeOS } from '@/lib/store-client';
import TopNav from '@/components/ui/TopNav';
import BottomTerminalBar from '@/components/ui/BottomTerminalBar';
import LightWaves from '@/components/ui/LightWaves';

/**
 * Console Layout — shared layout for all authenticated console pages.
 * Includes top nav bar, bottom terminal, and ambient light waves.
 */
function ConsoleInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state } = useLifeOS();

  useEffect(() => {
    if (!state.isInitializing && !state.isAuthenticated) {
      router.push('/initialize');
    }
  }, [state.isInitializing, state.isAuthenticated, router]);

  if (state.isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono-data text-sm text-secondary cursor-blink">
          &gt; INITIALIZING_SYSTEM<span className="cursor-blink">_</span>
        </p>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <LightWaves color="both" />
      <TopNav />
      <main className="pt-nav-height pb-terminal-height relative z-10">
        {children}
      </main>
      <BottomTerminalBar />
    </div>
  );
}

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <LifeOSProvider>
      <ConsoleInner>{children}</ConsoleInner>
    </LifeOSProvider>
  );
}
