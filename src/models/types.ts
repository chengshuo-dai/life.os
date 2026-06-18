// ─── Auth ───────────────────────────────────────────────
export interface AuthInitializeRequest {
  biometric_signature: string;
  device_metadata: {
    user_agent: string;
    screen_width: number;
    screen_height: number;
    locale: string;
  };
}

export interface AuthInitializeResponse {
  token: string;
  expires_at: number;
  user: UserProfile;
}

// ─── User ───────────────────────────────────────────────
export type ClearanceLevel = 'ROOT' | 'ADMIN' | 'OPERATOR' | 'GUEST';

export interface UserProfile {
  id: string;
  operator_name: string;
  clearance: ClearanceLevel;
  location: {
    lat: number;
    lng: number;
    sector: string;
  };
  reality_sync_percentage: number;
  fragments_collected: number;
  strata_depth: number;
  system_stability: number;
  active_nodes: number;
  created_at: number;
}

export interface UserCredits {
  balance: number;
  limit: number;
  transactions: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  narrative_id?: string;
  timestamp: number;
}

// ─── Narratives ─────────────────────────────────────────
export type NarrativePath = 'MED' | 'CORP' | 'FREE';
export type NarrativeStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';
export type RecoveryLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
export type ContentType = 'PROSE' | 'DIALOG' | 'TERMINAL_LOG' | 'GLITCH_DATA';

export interface Narrative {
  id: string;
  path: NarrativePath;
  number: number;
  title: string;
  subtitle: string;
  status: NarrativeStatus;
  progress: number;
  recovery_level: RecoveryLevel;
  description: string;
  cover_image_url?: string;
  nodes: NarrativeNode[];
  branch_count: number;
  estimated_completion_time: string;
  rewards: NarrativeReward;
}

export interface NarrativeNode {
  id: string;
  narrative_id: string;
  sequence_index: number;
  title: string;
  content: string;
  content_type: ContentType;
  environment: NarrativeEnvironment;
  choices: NarrativeChoice[];
  is_endpoint: boolean;
  is_paywalled: boolean;
  credit_cost?: number;
}

export interface NarrativeEnvironment {
  background_class: string;
  shader_active: boolean;
  glitch_intensity: number;
  ambient_audio_cue?: string;
  light_wave_color?: 'cyan' | 'violet' | 'none';
}

export interface NarrativeChoice {
  id: string;
  text: string;
  consequence_text: string;
  target_node_id: string;
  required_credits?: number;
  metadata_changes: ChoiceMetadataChanges;
  outcome_flags: OutcomeFlag[];
}

export interface ChoiceMetadataChanges {
  reality_sync_delta?: number;
  fragments_delta?: number;
  strata_depth_delta?: number;
  credit_deduct?: number;
}

export type OutcomeFlag =
  | 'UNLOCK_PATH_CORP'
  | 'UNLOCK_PATH_FREE'
  | 'CORRUPT_DATA'
  | 'GAIN_FRAGMENT'
  | 'TRIGGER_GLITCH'
  | 'ACTIVATE_OVERRIDE'
  | 'EARN_CREDITS'
  | 'LOSE_CREDITS';

export interface NarrativeReward {
  credits_earned: number;
  fragments_unlocked: number;
  archive_entries: number;
  special_item?: string;
}

// ─── Narrative List Item (for hub) ─────────────────────
export interface NarrativeListItem {
  id: string;
  path: NarrativePath;
  number: number;
  title: string;
  subtitle: string;
  designation: string;
  status: NarrativeStatus;
  progress: number;
  recovery_level: RecoveryLevel;
  fragmentation: number;
  neural_integrity: number;
  data_integrity: string;
  icon_url?: string;
  active_path: boolean;
}

// ─── Archive / Timeline ────────────────────────────────
export interface ArchiveTimelineEntry {
  id: string;
  timestamp: number;
  label: string;
  type: 'NARRATIVE_NODE' | 'CHOICE' | 'SYSTEM_EVENT' | 'CORRUPTED' | 'REDACTED';
  narrative_id?: string;
  narrative_path?: NarrativePath;
  metrics: {
    fragmentation_index: number;
    neural_integrity: number;
    data_integrity: number;
  };
  data_blob?: Record<string, unknown>;
  is_corrupted: boolean;
  corruption_message?: string;
}

export interface TimelineQueryParams {
  timestamp?: number;
  narrative_id?: string;
  path?: NarrativePath;
  from?: number;
  to?: number;
}

export interface TimelineResponse {
  entries: ArchiveTimelineEntry[];
  has_corrupted_data: boolean;
  scrubbing_position: number;
}

// ─── Corrupted Archive Cards ───────────────────────────
export interface CorruptedArcCard {
  decorative_index: string;
  narrative_path_id: string;
  designation: string;
  integrity_level: number;
  raw_data_stream: string[];
  button_action: string;
}

// ─── Terminal ───────────────────────────────────────────
export interface TerminalCommand {
  command: string;
  handler: 'STATUS_CHECK' | 'NARRATIVE_QUERY' | 'SYNC_TRIGGER' | 'OVERRIDE_ACCESS' | 'HELP' | 'UNKNOWN';
  requires_clearance: 'ALL' | 'OPERATOR' | 'ADMIN' | 'ROOT';
}

export interface TerminalResponse {
  output_lines: string[];
  action_triggered?: 'SYNC' | 'GLITCH' | 'OVERRIDE' | 'NONE';
  metadata_changes?: Record<string, number>;
}

// ─── System State ───────────────────────────────────────
export interface SystemState {
  reality_sync: number;
  system_stability: number;
  active_narratives: number;
  total_fragments: number;
  neural_link_status: 'STABLE' | 'FLUCTUATING' | 'UNSTABLE' | 'DISCONNECTED';
  os_version: string;
  last_sync_timestamp: number;
}

// ─── User Session (stored in KV) ───────────────────────
export interface UserSession {
  user_id: string;
  token: string;
  current_narrative?: string;
  current_node?: string;
  selected_paths: NarrativePath[];
  credits: number;
  fragments: number;
  strata_depth: number;
  reality_sync: number;
  unlocked_narratives: string[];
  completed_narratives: string[];
  archived_entries: string[];
  created_at: number;
  last_active: number;
}

// ─── API Response Wrappers ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NarrativeDetailResponse {
  narrative: Narrative;
  current_node: NarrativeNode;
  user_progress: {
    progress: number;
    choices_made: string[];
  };
}

export interface ChoiceResponse {
  next_node: NarrativeNode;
  applied_changes: {
    reality_sync_delta: string;
    fragments_delta: string;
    credits_deducted: number;
    flags_triggered: OutcomeFlag[];
  };
  updated_profile: UserProfile;
  archive_entry: ArchiveTimelineEntry | null;
}

export interface PaymentUnlockResponse {
  success: boolean;
  new_balance: number;
  unlocked_content: NarrativeNode;
  transaction: CreditTransaction;
}

export interface PathSyncItem {
  narrative_path_id: string;
  sync_percentage: number;
  is_complete: boolean;
}
