import type { ArchiveTimelineEntry, CorruptedArcCard, TimelineResponse } from '@/models/types';

// ─── Archive Timeline Seed Data ──────────────────────────
// Life.OS Destiny Data Bank — Archive/Timeline entries
// spanning MED, CORP, and FREE narrative paths.

export const ARCHIVE_ENTRIES: ArchiveTimelineEntry[] = [
  // ═══════════════════════════════════════════════════════
  // MED PATH — NARRATIVE_082_MED: The Trauma Bay
  // ═══════════════════════════════════════════════════════
  {
    id: 'ENTRY_001',
    timestamp: 1710800000,
    label: 'NARRATIVE_082_MED: ENTERED_TRAUMA_BAY',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.12,
      neural_integrity: 0.96,
      data_integrity: 0.99,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_002',
    timestamp: 1710803600,
    label: 'NARRATIVE_082_MED: STABILIZED_PATIENT_ZERO',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.18,
      neural_integrity: 0.93,
      data_integrity: 0.97,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_003',
    timestamp: 1710807200,
    label: 'NARRATIVE_082_MED: CHOICE_TRIAGE_PROTOCOL',
    type: 'CHOICE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.22,
      neural_integrity: 0.91,
      data_integrity: 0.95,
    },
    data_blob: {
      chosen_option: 'AGGRESSIVE_TREATMENT',
      consequence: 'Patient stabilized but neural degradation accelerated by 12%',
      outcome_flags: ['UNLOCK_PATH_CORP', 'EARN_CREDITS'],
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_004',
    timestamp: 1710810800,
    label: 'NARRATIVE_082_MED: SURGICAL_INTERVENTION',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.27,
      neural_integrity: 0.88,
      data_integrity: 0.93,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_005',
    timestamp: 1710814400,
    label: 'NARRATIVE_082_MED: CHOICE_CODE_BLUE',
    type: 'CHOICE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.31,
      neural_integrity: 0.85,
      data_integrity: 0.90,
    },
    data_blob: {
      chosen_option: 'EXPERIMENTAL_PROTOCOL_7',
      consequence: 'Patient neural link severed — recovery uncertain',
      outcome_flags: ['GAIN_FRAGMENT', 'TRIGGER_GLITCH', 'CORRUPT_DATA'],
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_006',
    timestamp: 1710818000,
    label: 'NARRATIVE_082_MED: RECOVERY_WARD_OBSERVATION',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.35,
      neural_integrity: 0.82,
      data_integrity: 0.88,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_007',
    timestamp: 1710821600,
    label: 'NARRATIVE_082_MED: PATIENT_DISCHARGED',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_082_MED',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.40,
      neural_integrity: 0.79,
      data_integrity: 0.85,
    },
    is_corrupted: false,
  },

  // ═══════════════════════════════════════════════════════
  // CORP PATH — NARRATIVE_115_CORP: The Cover-Up
  // ═══════════════════════════════════════════════════════
  {
    id: 'ENTRY_008',
    timestamp: 1710805000,
    label: 'NARRATIVE_115_CORP: BOARDROOM_CONFRONTATION',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_115_CORP',
    narrative_path: 'CORP',
    metrics: {
      fragmentation_index: 0.14,
      neural_integrity: 0.94,
      data_integrity: 0.98,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_009',
    timestamp: 1710808600,
    label: 'NARRATIVE_115_CORP: CHOICE_WHISTLEBLOW_OR_COMPLY',
    type: 'CHOICE',
    narrative_id: 'NARRATIVE_115_CORP',
    narrative_path: 'CORP',
    metrics: {
      fragmentation_index: 0.21,
      neural_integrity: 0.90,
      data_integrity: 0.94,
    },
    data_blob: {
      chosen_option: 'WHISTLEBLOW',
      consequence: 'Executives alerted — lockdown protocol engaged on Level 42',
      outcome_flags: ['UNLOCK_PATH_FREE', 'LOSE_CREDITS', 'ACTIVATE_OVERRIDE'],
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_010',
    timestamp: 1710812200,
    label: 'NARRATIVE_115_CORP: DATA_HEIST_EXECUTION',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_115_CORP',
    narrative_path: 'CORP',
    metrics: {
      fragmentation_index: 0.28,
      neural_integrity: 0.86,
      data_integrity: 0.91,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_011',
    timestamp: 1710815800,
    label: 'NARRATIVE_115_CORP: COVER_UP_EXPOSED',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_115_CORP',
    narrative_path: 'CORP',
    metrics: {
      fragmentation_index: 0.34,
      neural_integrity: 0.83,
      data_integrity: 0.87,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_012',
    timestamp: 1710819400,
    label: 'NARRATIVE_115_CORP: CHOICE_BURN_EVIDENCE_OR_DEFECT',
    type: 'CHOICE',
    narrative_id: 'NARRATIVE_115_CORP',
    narrative_path: 'CORP',
    metrics: {
      fragmentation_index: 0.39,
      neural_integrity: 0.80,
      data_integrity: 0.84,
    },
    data_blob: {
      chosen_option: 'DEFECT',
      consequence: 'Evidence transferred to external data vault — corporate firewall breached',
      outcome_flags: ['GAIN_FRAGMENT', 'CORRUPT_DATA', 'EARN_CREDITS'],
    },
    is_corrupted: false,
  },

  // ═══════════════════════════════════════════════════════
  // FREE PATH — NARRATIVE_401_FREE: The Fugitive's Trail
  // ═══════════════════════════════════════════════════════
  {
    id: 'ENTRY_013',
    timestamp: 1710808000,
    label: 'NARRATIVE_401_FREE: ABANDONED_STATION_ENTRY',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_401_FREE',
    narrative_path: 'FREE',
    metrics: {
      fragmentation_index: 0.08,
      neural_integrity: 0.98,
      data_integrity: 0.99,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_014',
    timestamp: 1710811600,
    label: 'NARRATIVE_401_FREE: ENCOUNTERED_THE_FUGITIVE',
    type: 'NARRATIVE_NODE',
    narrative_id: 'NARRATIVE_401_FREE',
    narrative_path: 'FREE',
    metrics: {
      fragmentation_index: 0.15,
      neural_integrity: 0.92,
      data_integrity: 0.96,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_015',
    timestamp: 1710815200,
    label: 'NARRATIVE_401_FREE: CHOICE_JOIN_OR_BETRAY',
    type: 'CHOICE',
    narrative_id: 'NARRATIVE_401_FREE',
    narrative_path: 'FREE',
    metrics: {
      fragmentation_index: 0.20,
      neural_integrity: 0.87,
      data_integrity: 0.92,
    },
    data_blob: {
      chosen_option: 'JOIN_THE_FUGITIVE',
      consequence: 'Alliance formed — corporate tracking network now hunting both targets',
      outcome_flags: ['GAIN_FRAGMENT', 'TRIGGER_GLITCH', 'EARN_CREDITS'],
    },
    is_corrupted: false,
  },

  // ═══════════════════════════════════════════════════════
  // SYSTEM EVENTS
  // ═══════════════════════════════════════════════════════
  {
    id: 'ENTRY_016',
    timestamp: 1710777600,
    label: 'SYSTEM: DAILY_SYNC_COMPLETED',
    type: 'SYSTEM_EVENT',
    metrics: {
      fragmentation_index: 0.05,
      neural_integrity: 0.99,
      data_integrity: 0.99,
    },
    data_blob: {
      event_type: 'DAILY_SYNC',
      sync_percentage: 84.6,
      sectors_scanned: 47,
      anomalies_detected: 2,
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_017',
    timestamp: 1710864000,
    label: 'SYSTEM: CREDIT_QUOTA_AWARDED',
    type: 'SYSTEM_EVENT',
    metrics: {
      fragmentation_index: 0.04,
      neural_integrity: 0.99,
      data_integrity: 1.0,
    },
    data_blob: {
      event_type: 'CREDIT_QUOTA_AWARDED',
      amount: 2.0,
      description: 'Daily existence quota allocated to all active operators',
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_018',
    timestamp: 1710817500,
    label: 'SYSTEM: SYSTEM_OVERRIDE_ACTIVE',
    type: 'SYSTEM_EVENT',
    metrics: {
      fragmentation_index: 0.09,
      neural_integrity: 0.97,
      data_integrity: 0.98,
    },
    data_blob: {
      event_type: 'SYSTEM_OVERRIDE_ACTIVE',
      operator_id: 'ALPHA-9-SYNC',
      clearance: 'ROOT',
      target_node: 'NODE_115_CORP_OVERLOOK',
      reason: 'Temporal recalibration — causality drift detected at +0.00042s',
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_019',
    timestamp: 1710835200,
    label: 'SYSTEM: REALITY_QUOTIENT_RECALIBRATED',
    type: 'SYSTEM_EVENT',
    metrics: {
      fragmentation_index: 0.07,
      neural_integrity: 0.98,
      data_integrity: 0.99,
    },
    data_blob: {
      event_type: 'REALITY_RECALIBRATION',
      previous_stability: 99.97,
      new_stability: 99.98,
      delta: '+0.01%',
    },
    is_corrupted: false,
  },

  // ═══════════════════════════════════════════════════════
  // CORRUPTED ENTRIES — Failed Timeline Branches
  // ═══════════════════════════════════════════════════════
  {
    id: 'ENTRY_020',
    timestamp: 1710828800,
    label: 'NARRATIVE_XXX_NULL: VOID_BRANCH_DETECTED',
    type: 'CORRUPTED',
    narrative_id: 'NARRATIVE_XXX_NULL',
    narrative_path: 'MED',
    metrics: {
      fragmentation_index: 0.96,
      neural_integrity: 0.02,
      data_integrity: 0.01,
    },
    data_blob: {
      error_code: 'ERR_404_MEMORY_VOID',
      fragments_recovered: 0,
      branch_status: 'COLLAPSED',
    },
    is_corrupted: false,
  },
  {
    id: 'ENTRY_021',
    timestamp: 1710842400,
    label: 'NARRATIVE_YYY_VOID: SIGNAL_LOST',
    type: 'CORRUPTED',
    narrative_id: 'NARRATIVE_YYY_VOID',
    narrative_path: 'CORP',
    metrics: {
      fragmentation_index: 0.99,
      neural_integrity: 0.01,
      data_integrity: 0.00,
    },
    data_blob: {
      error_code: 'ERR_500_TEMPORAL_DEGRADATION',
      fragments_recovered: 0,
      branch_status: 'UNRECOVERABLE',
    },
    is_corrupted: false,
  },

  // ═══════════════════════════════════════════════════════
  // REDACTED ENTRY — Top-Secret Content
  // ═══════════════════════════════════════════════════════
  {
    id: 'ENTRY_022',
    timestamp: 1710856800,
    label: '[REDACTED]_LEVEL_OMEGA_CLEARANCE',
    type: 'REDACTED',
    narrative_id: 'NARRATIVE_ZZZ_NIL',
    narrative_path: 'FREE',
    metrics: {
      fragmentation_index: 0.50,
      neural_integrity: 0.50,
      data_integrity: 0.50,
    },
    data_blob: {
      redaction_code: 'OMEGA-7-BLACK',
      redacted_by: 'SYSTEM_ADMINISTRATOR',
      reason: 'TOP_SECRET // CLEARANCE_LEVEL_INSUFFICIENT',
      original_content_hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    },
    is_corrupted: false,
  },
];

// ─── Corrupted Arc Cards ─────────────────────────────────
// Unexplored and failed narrative paths — eerie fragments
// of timelines that never fully materialized.

export const CORRUPTED_CARDS: CorruptedArcCard[] = [
  {
    decorative_index: 'XXX',
    narrative_path_id: 'NARRATIVE_XXX_NULL',
    designation: '[REDACTED]',
    integrity_level: 8,
    raw_data_stream: [
      'ERR_404: MEMORY_VOID_DETECTED // SECTOR_7_SUBSTRATA_3',
      'FRAGMENT_UNRECOVERABLE // NEURAL_PATHWAY_SEVERED_AT_ORIGIN',
      '[WARN] Temporal echo mismatch — causality chain broken beyond repair',
      'OPERATOR_RESIDUAL: "I remember... no, I don\'t. Was there ever a patient here?"',
      'GLITCH_STREAM: ████████░░░░░░░░ 47% COHERENCE LOST',
      'ADMIN_OVERRIDE: This timeline branch has been pruned. Redirect to NARRATIVE_082_MED.',
    ],
    button_action: 'Recover_Fragments',
  },
  {
    decorative_index: '000',
    narrative_path_id: 'NARRATIVE_YYY_VOID',
    designation: 'The Lost',
    integrity_level: 3,
    raw_data_stream: [
      'ERR_500: TEMPORAL_DEGRADATION_97% // DATA_STREAM_CORRUPTED',
      '▒▒▒▒▒▒▒▒ UNREADABLE_SECTOR ▒▒▒▒▒▒▒▒',
      'FRAGMENT_REMNANT: "The board voted 7-2... the vote... the vote never happened?"',
      '[CRITICAL] Causality loop detected — event recursively overwrites itself',
      'MEMORY_DUMP: 0x7F3A_B000 → 0x0000_0000 // ALLOCATION_FAULT',
      '[REDACTED BY ORDER OF ADMINISTRATOR] // SEAL_LEVEL_5',
    ],
    button_action: 'Recover_Fragments',
  },
  {
    decorative_index: '///',
    narrative_path_id: 'NARRATIVE_ZZZ_NIL',
    designation: '[EXPUNGED]',
    integrity_level: 12,
    raw_data_stream: [
      'OMEGA_CLEARANCE_REQUIRED // ACCESS_DENIED',
      '[EXPUNGED] Per Directive 7-Alpha, this record has been sealed indefinitely',
      'FRAGMENT_TRACE: "The fugitive knew something... something about the Origin."',
      'LOG_ANOMALY: Timestamp 1710856800 registers twice in the causality ledger',
      '[REDACTED] External agency involvement confirmed — data purged from all nodes',
      'SYSTEM_NOTE: Even ROOT clearance is insufficient. Do not pursue.',
    ],
    button_action: 'Recover_Fragments',
  },
];

// ─── Timeline Response Builder ────────────────────────────

/**
 * Build a filtered, corruption-aware TimelineResponse from the archive.
 *
 * Filters:
 *  - timestamp range (params.from → params.to)
 *  - specific narrative_id
 *  - specific narrative_path
 *
 * Corruption logic:
 *  - Entries whose narrative_path is NOT in userCompletedPaths
 *    are flagged as corrupted (is_corrupted = true) and receive
 *    a corruption_message.
 *  - has_corrupted_data is set to true if any entry in the result
 *    has is_corrupted = true.
 */
export function getTimelineResponse(params: {
  timestamp?: number;
  narrative_id?: string;
  path?: string;
  from?: number;
  to?: number;
  userCompletedPaths: string[];
}): TimelineResponse {
  const {
    timestamp,
    narrative_id,
    path,
    from,
    to,
    userCompletedPaths,
  } = params;

  let entries = [...ARCHIVE_ENTRIES];

  // --- Filter by timestamp range ---
  // If `timestamp` is provided without `from`/`to`, it acts as a
  // "scrub to" anchor — entries at or before that point are included.
  if (from !== undefined) {
    entries = entries.filter((e) => e.timestamp >= from);
  }
  if (to !== undefined) {
    entries = entries.filter((e) => e.timestamp <= to);
  }
  // Fallback: use single timestamp as upper-bound scrub
  if (from === undefined && to === undefined && timestamp !== undefined) {
    entries = entries.filter((e) => e.timestamp <= timestamp);
  }

  // --- Filter by narrative_id ---
  if (narrative_id) {
    entries = entries.filter((e) => e.narrative_id === narrative_id);
  }

  // --- Filter by narrative_path ---
  if (path) {
    entries = entries.filter((e) => e.narrative_path === path);
  }

  // --- Apply corruption to uncompleted paths ---
  let hasCorruptedData = false;

  entries = entries.map((entry) => {
    // SYSTEM_EVENT entries are never corrupted — they belong to the OS, not a narrative path.
    if (entry.type === 'SYSTEM_EVENT') {
      return entry;
    }

    // Entries with no narrative_path cannot be checked against completion.
    if (!entry.narrative_path) {
      return entry;
    }

    // If the entry's path is not in the user's completed paths, corrupt it.
    if (!userCompletedPaths.includes(entry.narrative_path)) {
      hasCorruptedData = true;
      return {
        ...entry,
        is_corrupted: true,
        corruption_message: corruptionMessageForPath(entry.narrative_path),
      };
    }

    return entry;
  });

  // --- Determine scrubbing position ---
  // Prefer the provided timestamp, then `to`, then the latest entry timestamp, then Date.now().
  const scrubbingPosition =
    timestamp ??
    to ??
    (entries.length > 0
      ? Math.max(...entries.map((e) => e.timestamp))
      : undefined) ??
    Date.now();

  return {
    entries,
    has_corrupted_data: hasCorruptedData,
    scrubbing_position: scrubbingPosition,
  };
}

// ─── Helpers ─────────────────────────────────────────────

function corruptionMessageForPath(path: string): string {
  const messages: Record<string, string> = {
    MED: 'CORRUPTED_TIMELINE: Medical narrative path data degraded beyond recovery. Neural link to NARRATIVE_082_MED severed.',
    CORP: 'CORRUPTED_TIMELINE: Corporate narrative path compromised. Boardroom data heist records show critical fragmentation.',
    FREE: 'CORRUPTED_TIMELINE: Free path timeline collapsed. The fugitive\'s trail goes cold — temporal echoes only.',
  };
  return (
    messages[path] ??
    `CORRUPTED_TIMELINE: Unknown narrative path "${path}" — data integrity compromised.`
  );
}
