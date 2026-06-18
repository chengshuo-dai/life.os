import type { TerminalCommand, TerminalResponse } from '@/models/types';

// ─── Command Registry ──────────────────────────────────
export const COMMAND_REGISTRY: TerminalCommand[] = [
  { command: 'STATUS', handler: 'STATUS_CHECK', requires_clearance: 'ALL' },
  { command: 'SYNC', handler: 'SYNC_TRIGGER', requires_clearance: 'ALL' },
  { command: 'SCAN', handler: 'NARRATIVE_QUERY', requires_clearance: 'OPERATOR' },
  { command: 'ACCESS', handler: 'NARRATIVE_QUERY', requires_clearance: 'OPERATOR' },
  { command: 'LOGS', handler: 'STATUS_CHECK', requires_clearance: 'ALL' },
  { command: 'HELP', handler: 'HELP', requires_clearance: 'ALL' },
  { command: 'VERSION', handler: 'STATUS_CHECK', requires_clearance: 'ALL' },
  { command: 'OVERRIDE', handler: 'OVERRIDE_ACCESS', requires_clearance: 'ROOT' },
  { command: 'WHOAMI', handler: 'STATUS_CHECK', requires_clearance: 'ALL' },
  { command: 'EXIT', handler: 'HELP', requires_clearance: 'ALL' },
  { command: 'CLEAR', handler: 'HELP', requires_clearance: 'ALL' },
];

// ─── Command Processor ─────────────────────────────────
const CLEARANCE_LEVELS: Record<string, number> = {
  GUEST: 0,
  OPERATOR: 1,
  ADMIN: 2,
  ROOT: 3,
};

export function processCommand(
  input: string,
  clearance: string
): TerminalResponse {
  const parts = input.trim().split(/\s+/);
  const command = parts[0]?.toUpperCase() || '';
  const args = parts.slice(1);

  if (!command) {
    return {
      output_lines: ['> No command entered. Type HELP for available commands.'],
      action_triggered: 'NONE',
    };
  }

  const registration = COMMAND_REGISTRY.find(
    (c) => c.command === command
  );

  if (!registration) {
    return {
      output_lines: [
        `> Unknown command: ${command}`,
        `> Type HELP for a list of available commands.`,
        `> Similar: ${findSimilar(command).join(', ') || 'none'}`,
      ],
      action_triggered: 'NONE',
    };
  }

  // Check clearance
  const requiredLevel = CLEARANCE_LEVELS[registration.requires_clearance] || 0;
  const userLevel = CLEARANCE_LEVELS[clearance] || 0;
  if (userLevel < requiredLevel) {
    return {
      output_lines: [
        `> [DENIED] Command "${command}" requires ${registration.requires_clearance} clearance.`,
        `> Current clearance: ${clearance}`,
      ],
      action_triggered: 'NONE',
    };
  }

  // Dispatch to handler
  switch (registration.handler) {
    case 'STATUS_CHECK':
      return handleStatus(command, args);
    case 'SYNC_TRIGGER':
      return handleSync(args);
    case 'NARRATIVE_QUERY':
      return handleQuery(command, args);
    case 'OVERRIDE_ACCESS':
      return handleOverride(args);
    case 'HELP':
      return handleHelp();
    default:
      return {
        output_lines: ['> [ERR] Unknown handler for command.'],
        action_triggered: 'NONE',
      };
  }
}

// ─── Handler Functions ─────────────────────────────────

function handleStatus(command: string, args: string[]): TerminalResponse {
  switch (command) {
    case 'STATUS': {
      const sync = 84.6;
      const stability = 99.98;
      return {
        output_lines: [
          `[${timestamp()}] SYSTEM_STATUS REPORT`,
          `────────────────────────────────────────`,
          `REALITY_SYNC:       ${sync.toFixed(1)}% [STABLE]`,
          `SYSTEM_STABILITY:   ${stability.toFixed(2)}% [NOMINAL]`,
          `NEURAL_LINK:        ACTIVE [LATENCY: 0.02ms]`,
          `ACTIVE_NODES:       12,402`,
          `OS_VERSION:         ALPHA-9-SYNC`,
          `UPLINK:             CONNECTED [99.2%]`,
          `CORE_TEMP:          NOMINAL [42.1°C]`,
          `────────────────────────────────────────`,
          `> STATUS_CHECK_COMPLETE`,
        ],
        action_triggered: 'NONE',
      };
    }
    case 'VERSION': {
      return {
        output_lines: [
          `Life.OS // Narrative Reality Console`,
          `Version: ALPHA-9-SYNC (Build 2026.06.19)`,
          `Kernel: DESTINY_ENGINE v3.2.1`,
          `Neural Interface: ACTIVE`,
          `All rights reserved. STITCH_LIFE_CORP.`,
        ],
        action_triggered: 'NONE',
      };
    }
    case 'WHOAMI': {
      return {
        output_lines: [
          `OPERATOR_ID:  ALPHA-9-SYNC`,
          `CLEARANCE:     ROOT`,
          `LOC:           40.7128° N, 74.0060° W`,
          `SECTOR:        Sector-7`,
          `SESSION_UPTIME: ${Math.floor(Math.random() * 3600)}s`,
        ],
        action_triggered: 'NONE',
      };
    }
    case 'LOGS': {
      const count = parseInt(args[0]) || 5;
      const logLines = generateMockLogs(count);
      return {
        output_lines: [
          `[${timestamp()}] LAST ${count} SYSTEM LOGS`,
          `────────────────────────────────────────`,
          ...logLines,
          `────────────────────────────────────────`,
          `> End of log buffer.`,
        ],
        action_triggered: 'NONE',
      };
    }
    default:
      return { output_lines: ['> Unknown status command.'], action_triggered: 'NONE' };
  }
}

function handleSync(args: string[]): TerminalResponse {
  const newSync = (84.6 + (Math.random() - 0.5) * 2).toFixed(1);
  return {
    output_lines: [
      `[${timestamp()}] INITIATING REALITY_SYNC...`,
      `> Scanning neural pathways... [OK]`,
      `> Aligning destiny fragments... [OK]`,
      `> Recalibrating temporal nodes... [OK]`,
      `> Verifying quantum state... [OK]`,
      `────────────────────────────────────────`,
      `SYNC_COMPLETE: Reality alignment at ${newSync}%`,
      `> ${parseFloat(newSync) > 84.6 ? 'SYNC_IMPROVED' : 'SYNC_DEGRADED'} // Delta: ${(parseFloat(newSync) - 84.6).toFixed(2)}%`,
    ],
    action_triggered: 'SYNC',
    metadata_changes: { reality_sync: parseFloat(newSync) },
  };
}

function handleQuery(command: string, args: string[]): TerminalResponse {
  if (command === 'ACCESS') {
    const target = args[0];
    if (!target) {
      return {
        output_lines: ['> Usage: ACCESS <narrative_id>', '> Example: ACCESS NARRATIVE_082_MED'],
        action_triggered: 'NONE',
      };
    }
    return {
      output_lines: [
        `[${timestamp()}] ACCESSING ${target}...`,
        `> Loading narrative stream... [OK]`,
        `> Decrypting path data... [OK]`,
        `> Establishing neural link... [OK]`,
        `────────────────────────────────────────`,
        `ACCESS_GRANTED: Redirecting to ${target}`,
      ],
      action_triggered: 'SYNC',
    };
  }

  if (command === 'SCAN') {
    const target = args[0];
    if (!target) {
      return {
        output_lines: [
          '> Usage: SCAN <target>',
          '> Available targets: NARRATIVE_082_MED, NARRATIVE_115_CORP, NARRATIVE_401_FREE, SYSTEM, ARCHIVE',
        ],
        action_triggered: 'NONE',
      };
    }
    return {
      output_lines: [
        `[${timestamp()}] SCANNING ${target}...`,
        `> Probing data stream... [OK]`,
        `> Fragmentation index: ${(Math.random() * 0.3).toFixed(2)}`,
        `> Neural integrity: ${(85 + Math.random() * 15).toFixed(1)}%`,
        `> Data integrity: ${Math.random() > 0.3 ? 'HIGH' : 'DEGRADED'}`,
        `────────────────────────────────────────`,
        `SCAN_COMPLETE: ${target} accessible.`,
      ],
      action_triggered: 'NONE',
    };
  }

  return { output_lines: ['> Unknown query command.'], action_triggered: 'NONE' };
}

function handleOverride(args: string[]): TerminalResponse {
  const nodeId = args[0];
  if (!nodeId) {
    return {
      output_lines: [
        '> [WARN] OVERRIDE requires a target node ID.',
        '> Usage: OVERRIDE <node_id>',
        '> ⚠️  CAUTION: Node recalibration is irreversible.',
      ],
      action_triggered: 'NONE',
    };
  }
  return {
    output_lines: [
      `[${timestamp()}] SYSTEM_OVERRIDE_INITIATED`,
      `> Target node: ${nodeId}`,
      `> Protocol 72 engaged... [OK]`,
      `> Temporal drift compensated: +${(Math.random() * 0.001).toFixed(5)}s`,
      `> Flux capacitance calibrating... [OK]`,
      `> Rewriting node parameters... [OK]`,
      `────────────────────────────────────────`,
      `[CRITICAL] OVERRIDE_COMPLETE: ${nodeId} has been recalibrated.`,
      `[WARN] CAUSALITY_CHAIN_ALTERED // Verify timeline integrity.`,
    ],
    action_triggered: 'OVERRIDE',
  };
}

function handleHelp(): TerminalResponse {
  return {
    output_lines: [
      `[${timestamp()}] AVAILABLE_COMMANDS`,
      `────────────────────────────────────────`,
      `STATUS              System status overview`,
      `SYNC                Trigger reality synchronization`,
      `SCAN <target>       Scan narrative or system node`,
      `ACCESS <narrative>  Load narrative path`,
      `LOGS [n]            Display last n system logs`,
      `VERSION             Display OS version info`,
      `WHOAMI              Display operator identity`,
      `OVERRIDE <node>     [ROOT] Recalibrate timeline node`,
      `CLEAR               Clear terminal buffer`,
      `EXIT                End terminal session`,
      `HELP                Display this message`,
      `────────────────────────────────────────`,
      `> Life.OS // ALPHA-9-SYNC // All paths monitored.`,
    ],
    action_triggered: 'NONE',
  };
}

// ─── Helpers ───────────────────────────────────────────

function timestamp(): string {
  const d = new Date();
  return [
    d.getHours().toString().padStart(2, '0'),
    d.getMinutes().toString().padStart(2, '0'),
    d.getSeconds().toString().padStart(2, '0'),
  ].join(':');
}

function findSimilar(command: string): string[] {
  return COMMAND_REGISTRY.filter((c) => {
    const cmd = c.command;
    if (cmd === command) return false;
    if (cmd.startsWith(command[0])) return true;
    let matches = 0;
    for (let i = 0; i < Math.min(cmd.length, command.length); i++) {
      if (cmd[i] === command[i]) matches++;
    }
    return matches >= 2;
  }).map((c) => c.command);
}

function generateMockLogs(count: number): string[] {
  const templates = [
    '[LOG] Neural pathway verification: ACTIVE',
    '[LOG] Destiny fragment #${n} synchronized',
    '[TRANS] Narrative interaction fee: -0.40 CC',
    '[CREDIT] Daily existence quota: +2.00 CC',
    '[WARN] Temporal anomaly detected in Sector-${n}',
    '[LOG] Archive compression cycle complete',
    '[SYNC] Reality quotient recalibrated: ${pct}%',
    '[LOG] Memory strata verified: DEPTH_LEVEL_${n}',
    '[CRITICAL] Unauthorized timeline access blocked',
    '[INFO] Uplink latency: ${n}ms',
  ];

  return Array.from({ length: count }, (_, i) => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template
      .replace(/\$\{n\}/g, String(Math.floor(Math.random() * 999)))
      .replace(/\$\{pct\}/g, (80 + Math.random() * 20).toFixed(1));
  });
}
