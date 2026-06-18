'use client';

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * GlassCard — the core glassmorphism container used throughout Life.OS.
 * Semi-transparent surface with backdrop blur and subtle border.
 */
export default function GlassCard({
  children,
  className,
  active = false,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card',
        active && 'active-path',
        hover && 'cursor-pointer',
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
