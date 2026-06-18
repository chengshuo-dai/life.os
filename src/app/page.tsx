'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root page — client-side redirect to the system initialization gateway.
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/initialize');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-mono-data text-sm text-secondary cursor-blink">
        &gt; INITIALIZING_LIFE_OS<span className="cursor-blink">_</span>
      </p>
    </div>
  );
}
