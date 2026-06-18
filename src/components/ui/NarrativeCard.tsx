'use client';

import GlassCard from './GlassCard';
import ProgressBar from './ProgressBar';
import type { NarrativeListItem } from '@/models/types';

interface NarrativeCardProps {
  narrative: NarrativeListItem;
  onClick?: () => void;
}

/**
 * NarrativeCard — 3:4 aspect ratio card displaying a narrative path.
 * Shows designation, status, progress, and fragment integrity metrics.
 */
export default function NarrativeCard({ narrative, onClick }: NarrativeCardProps) {
  const statusColor =
    narrative.status === 'COMPLETED'
      ? 'text-secondary'
      : narrative.status === 'IN_PROGRESS'
      ? 'text-secondary'
      : narrative.status === 'UNLOCKED'
      ? 'text-on-surface-variant'
      : 'text-outline';

  return (
    <GlassCard onClick={onClick} active={narrative.active_path}>
      <div className="aspect-[3/4] p-6 flex flex-col justify-between">
        {/* Top: ID and Status */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] uppercase">
              PATH_{String(narrative.number).padStart(3, '0')}
            </p>
            <p className="font-mono-data text-xs text-on-surface-variant mt-1">
              {narrative.id}
            </p>
          </div>
          <span
            className={`font-mono-data text-[10px] tracking-[0.1em] ${statusColor}`}
          >
            {narrative.status.replace('_', ' ')}
          </span>
        </div>

        {/* Center: Designation & Icon */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          {narrative.icon_url ? (
            <img
              src={narrative.icon_url}
              alt={narrative.title}
              className="w-12 h-12 rounded-full opacity-60"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <span className="font-display-hero text-secondary text-lg">
                {narrative.path === 'MED' ? '⚕' : narrative.path === 'CORP' ? '⬡' : '☸'}
              </span>
            </div>
          )}
          <p className="font-headline-lg text-on-surface text-center">
            {narrative.designation}
          </p>
          <p className="font-mono-data text-[10px] text-outline tracking-[0.1em]">
            {narrative.title}
          </p>
        </div>

        {/* Bottom: Metrics */}
        <div className="space-y-3">
          <ProgressBar
            value={narrative.progress}
            max={100}
            label="PROGRESS"
            showPercent
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-mono-data text-[9px] text-outline tracking-[0.1em]">
                FRAGMENTATION
              </p>
              <p className="font-mono-data text-xs text-on-surface-variant">
                {narrative.fragmentation}%
              </p>
            </div>
            <div>
              <p className="font-mono-data text-[9px] text-outline tracking-[0.1em]">
                NEURAL_INTEGRITY
              </p>
              <p className="font-mono-data text-xs text-on-surface-variant">
                {narrative.neural_integrity}%
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono-data text-[9px] text-outline tracking-[0.1em]">
              DATA_INTEGRITY
            </p>
            <p
              className={`font-mono-data text-[10px] tracking-[0.1em] ${
                narrative.data_integrity === 'OPTIMAL'
                  ? 'text-secondary'
                  : narrative.data_integrity === 'HIGH'
                  ? 'text-on-surface-variant'
                  : 'text-error'
              }`}
            >
              {narrative.data_integrity}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
