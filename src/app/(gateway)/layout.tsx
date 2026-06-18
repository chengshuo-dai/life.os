'use client';

import { LifeOSProvider } from '@/lib/store-client';

/**
 * Gateway Layout — wraps all gateway pages with the LifeOS state provider.
 * Gateway pages (initialize, transition) don't have the console nav/terminal chrome.
 */
export default function GatewayLayout({ children }: { children: React.ReactNode }) {
  return <LifeOSProvider>{children}</LifeOSProvider>;
}
