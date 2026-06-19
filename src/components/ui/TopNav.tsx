'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLifeOS } from '@/lib/store-client';

const NAV_ITEMS = [
  { label: 'ARCHIVE', href: '/archive', icon: 'archive' },
  { label: 'CONSOLE', href: '/hub', icon: 'terminal' },
  { label: 'PATHS', href: '/narratives', icon: 'route' },
  { label: 'CREDITS', href: '/credits', icon: 'currency' },
  { label: 'PROFILE', href: '/profile', icon: 'person' },
] as const;

export default function TopNav() {
  const { state } = useLifeOS();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
      {/* Left: System Status */}
      <div className="flex items-center gap-4">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span className="font-mono-data text-xs text-on-surface-variant tracking-[0.1em]">
          LIFE.OS
        </span>
        <span className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
          {state.profile?.reality_sync_percentage
            ? `SYNC: ${(state.profile.reality_sync_percentage * 100).toFixed(1)}%`
            : 'SYNC: --'}
        </span>
      </div>

      {/* Center: Navigation */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 text-xs font-mono-data tracking-[0.1em] transition-liquid
              ${
                state.currentPage === item.href
                  ? 'text-secondary border-b border-secondary/50'
                  : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
              }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right: Sync Status */}
      <div className="flex items-center gap-3">
        <span className="font-mono-data text-[10px] text-outline tracking-[0.1em] hidden sm:block">
          NODES: {state.profile?.active_nodes?.toLocaleString() || '12,402'}
        </span>
        <button
          onClick={() => {
            const event = new CustomEvent('lifeos:toggle-terminal');
            window.dispatchEvent(event);
          }}
          className="liquid-btn text-xs py-1 px-3"
        >
          &gt;_
        </button>
      </div>
    </nav>
  );
}
