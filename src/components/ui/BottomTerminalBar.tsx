'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLifeOS } from '@/lib/store-client';

export default function BottomTerminalBar() {
  const { state, apiFetch } = useLifeOS();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Focus input on mount and when clicked anywhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input')) return;
      inputRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Listen for global toggle
  useEffect(() => {
    const handleToggle = () => setIsExpanded((prev) => !prev);
    window.addEventListener('lifeos:toggle-terminal', handleToggle);
    return () => window.removeEventListener('lifeos:toggle-terminal', handleToggle);
  }, []);

  // Scroll output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = useCallback(
    async (cmd: string) => {
      if (!cmd.trim()) return;
      setIsProcessing(true);
      setOutput((prev) => [...prev, `> ${cmd}`]);

      try {
        const result = await apiFetch<{
          output_lines: string[];
          action_triggered?: string;
        }>('/terminal', {
          method: 'POST',
          body: JSON.stringify({ command: cmd }),
        });

        if (result.success && result.data) {
          setOutput((prev) => [...prev, ...result.data!.output_lines]);
        } else {
          setOutput((prev) => [...prev, `[ERR] ${result.error || 'Command failed'}`]);
        }
      } catch {
        setOutput((prev) => [...prev, '[ERR] Terminal offline. Neural link disrupted.']);
      }

      setIsProcessing(false);
    },
    [apiFetch]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Expanded output area */}
      {isExpanded && output.length > 0 && (
        <div
          ref={outputRef}
          className="mx-6 mb-0 max-h-64 overflow-y-auto terminal-scroll glass-panel rounded-t-lg border-b-0"
        >
          {output.map((line, i) => (
            <div
              key={i}
              className={`px-4 py-1 font-mono-data text-xs ${
                line.startsWith('[ERR]')
                  ? 'text-error'
                  : line.startsWith('[WARN]') || line.startsWith('[CRITICAL]')
                  ? 'text-error/80'
                  : line.startsWith('>')
                  ? 'text-secondary'
                  : 'text-on-surface-variant'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Terminal bar */}
      <div className="terminal-bar">
        <span className="text-secondary mr-3 font-mono-data select-none">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ENTER_COMMAND..."
          className="cli-input flex-1"
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command input"
        />
        <div className="flex items-center gap-3 ml-3">
          {isProcessing && (
            <span className="w-3 h-3 border border-secondary/50 border-t-secondary rounded-full animate-spin" />
          )}
          <span className="font-mono-data text-[10px] text-outline hidden sm:block">
            {state.profile?.operator_name || 'OPERATOR_NULL'}
          </span>
          <span className="font-mono-data text-[10px] text-outline/60 hidden sm:block border-l border-white/10 pl-3 ml-1">
            © Lucas Dai
          </span>
          <span className="cursor-blink text-secondary font-mono-data select-none">_</span>
        </div>
      </div>
    </div>
  );
}
