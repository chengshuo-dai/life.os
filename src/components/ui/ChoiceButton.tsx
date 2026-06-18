'use client';

import type { NarrativeChoice } from '@/models/types';

interface ChoiceButtonProps {
  choice: NarrativeChoice;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * ChoiceButton — narrative decision button with liquid hover effect.
 * Displays the choice text, consequence, and any credit cost.
 */
export default function ChoiceButton({
  choice,
  onClick,
  disabled = false,
}: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="choice-btn group disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 text-left">
          <p className="font-headline-lg text-sm text-on-surface group-hover:text-white transition-liquid">
            {choice.text}
          </p>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            {choice.consequence_text}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {choice.required_credits && choice.required_credits > 0 && (
            <span className="font-mono-data text-[10px] text-secondary tracking-[0.1em]">
              {choice.required_credits} CC
            </span>
          )}
          <span className="font-mono-data text-[10px] text-outline tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-liquid">
            ▶ SELECT
          </span>
        </div>
      </div>
    </button>
  );
}
