'use client';

interface LightWavesProps {
  color?: 'cyan' | 'violet' | 'both';
}

/**
 * LightWaves — Slow-breathing ambient light blobs.
 * Creates the "environmental depth" effect from DESIGN.md.
 */
export default function LightWaves({ color = 'both' }: LightWavesProps) {
  return (
    <>
      {(color === 'cyan' || color === 'both') && (
        <div
          className="fixed bottom-0 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none z-0 breathing-glow"
          style={{
            background:
              'radial-gradient(circle, rgba(123,208,255,0.06) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}
      {(color === 'violet' || color === 'both') && (
        <div
          className="fixed bottom-0 right-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none z-0 breathing-glow"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
            animationDelay: '3s',
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
