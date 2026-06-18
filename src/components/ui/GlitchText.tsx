'use client';

import { useState, useCallback } from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'span' | 'p' | 'h1' | 'h2';
  className?: string;
  active?: boolean;
  intensity?: number; // 0-1
}

/**
 * GlitchText — Text with hover-triggered or continuous glitch/corruption effect.
 * For corrupted data displays and dramatic UI moments.
 */
export default function GlitchText({
  text,
  as: Tag = 'p',
  className = '',
  active = false,
}: GlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isGlitched = active || isHovered;

  const scramble = useCallback((str: string): string => {
    if (!isGlitched) return str;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`αβγδελμΣΩΔθ';
    return str
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (Math.random() > 0.3) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
  }, [isGlitched]);

  return (
    <Tag
      className={`${isGlitched ? 'glitch-text' : ''} transition-all duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-text={text}
    >
      {scramble(text)}
    </Tag>
  );
}
