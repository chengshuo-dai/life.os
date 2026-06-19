import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import {
  getSession,
  setSession,
  getNarrativeProgress,
  setNarrativeProgress,
  getProfile,
  setProfile,
  getCredits,
  setCredits,
  appendArchiveEntry,
} from '@/lib/store';
import { NARRATIVES } from '@/data/seed-narratives';
import { DEFAULT_CREDIT_CONFIG } from '@/data/seed-credits';
import { generateId, now, roundTo } from '@/lib/utils';
import type {
  ChoiceResponse,
  ArchiveTimelineEntry,
  CreditTransaction,
  OutcomeFlag,
} from '@/models/types';

/**
 * POST /api/v1/narratives/:id/choice
 *
 * Submits a user's choice in a narrative node and returns the next node.
 * Handles credit deductions, reality sync changes, and path unlocking.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await getSession(userId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session expired.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { node_id, choice_id, reaction_time } = body;

    if (!node_id || !choice_id) {
      return NextResponse.json(
        { success: false, error: 'node_id and choice_id are required' },
        { status: 400 }
      );
    }

    const narrativeId = params.id;
    const narrative = NARRATIVES.find((n) => n.id === narrativeId);

    if (!narrative) {
      return NextResponse.json(
        { success: false, error: 'Narrative not found' },
        { status: 404 }
      );
    }

    // Find the node
    const node = narrative.nodes.find((n) => n.id === node_id);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    // Find the choice
    const choice = node.choices.find((c) => c.id === choice_id);
    if (!choice) {
      return NextResponse.json(
        { success: false, error: 'Choice not found' },
        { status: 404 }
      );
    }

    // Check paywall
    if (choice.required_credits && session.credits < choice.required_credits) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. Required: ${choice.required_credits} CC, Available: ${session.credits} CC`,
        },
        { status: 402 }
      );
    }

    // Find the target node
    const targetNode = narrative.nodes.find((n) => n.id === choice.target_node_id);
    if (!targetNode) {
      return NextResponse.json(
        { success: false, error: 'Target node not found — narrative tree may be corrupted' },
        { status: 500 }
      );
    }

    // ─── Apply Changes ───────────────────────────────────

    // Update reality sync
    let realitySyncDelta = choice.metadata_changes.reality_sync_delta || 0;
    session.reality_sync = roundTo(
      Math.min(1, Math.max(0, session.reality_sync + realitySyncDelta)),
      3
    );

    // Update fragments
    let fragmentsDelta = choice.metadata_changes.fragments_delta || 0;
    session.fragments += fragmentsDelta;

    // Update strata depth
    let strataDelta = choice.metadata_changes.strata_depth_delta || 0;
    session.strata_depth += strataDelta;

    // Handle credits
    let creditsDeducted = 0;
    if (choice.required_credits) {
      creditsDeducted = choice.required_credits;
    }
    if (choice.metadata_changes.credit_deduct) {
      creditsDeducted += choice.metadata_changes.credit_deduct;
    }

    // Also deduct the standard interaction fee
    creditsDeducted += DEFAULT_CREDIT_CONFIG.narrative_interaction_fee;

    if (creditsDeducted > 0) {
      session.credits = roundTo(Math.max(0, session.credits - creditsDeducted), 2);
    }

    // Handle outcome flags
    for (const flag of choice.outcome_flags) {
      switch (flag) {
        case 'UNLOCK_PATH_CORP':
          if (!session.unlocked_narratives.includes('NARRATIVE_115_CORP')) {
            session.unlocked_narratives.push('NARRATIVE_115_CORP');
          }
          break;
        case 'UNLOCK_PATH_FREE':
          if (!session.unlocked_narratives.includes('NARRATIVE_401_FREE')) {
            session.unlocked_narratives.push('NARRATIVE_401_FREE');
          }
          break;
        case 'EARN_CREDITS':
          session.credits = roundTo(
            Math.min(
              DEFAULT_CREDIT_CONFIG.credit_limit,
              session.credits + DEFAULT_CREDIT_CONFIG.daily_existence_quota
            ),
            2
          );
          break;
        case 'GAIN_FRAGMENT':
          session.fragments += 1;
          break;
        default:
          break;
      }
    }

    // Update narrative progress
    const progress = await getNarrativeProgress(userId, narrativeId);
    const updatedChoices = [...(progress?.choices_made || []), choice_id];
    const nodeIndex = narrative.nodes.findIndex(
      (n) => n.id === targetNode.id
    );
    const progressPercent = targetNode.is_endpoint
      ? 100
      : Math.round(((nodeIndex + 1) / narrative.nodes.length) * 100);

    await setNarrativeProgress(userId, narrativeId, {
      current_node: targetNode.id,
      choices_made: updatedChoices,
      progress: progressPercent,
    });

    // Mark completed if endpoint
    if (targetNode.is_endpoint) {
      if (!session.completed_narratives.includes(narrativeId)) {
        session.completed_narratives.push(narrativeId);
      }
    }

    // Update session
    session.current_narrative = narrativeId;
    session.current_node = targetNode.id;
    session.last_active = now();
    await setSession(userId, session);

    // Create archive entry
    const archiveEntry: ArchiveTimelineEntry = {
      id: generateId('ARCH'),
      timestamp: now(),
      label: `${narrativeId}: CHOSE_${choice_id}`,
      type: 'CHOICE',
      narrative_id: narrativeId,
      narrative_path: narrative.path,
      metrics: {
        fragmentation_index: roundTo(1 - progressPercent / 100, 2),
        neural_integrity: roundTo(0.5 + (progressPercent / 100) * 0.5, 2),
        data_integrity: roundTo(progressPercent >= 100 ? 1 : 0.6 + (progressPercent / 100) * 0.3, 2),
      },
      data_blob: {
        chosen_option: choice.text,
        consequence: choice.consequence_text,
        outcome_flags: choice.outcome_flags,
        reaction_time_ms: reaction_time ?? null,
      },
      is_corrupted: false,
    };
    await appendArchiveEntry(userId, archiveEntry);

    // Create credit transaction if applicable
    if (creditsDeducted > 0) {
      const credits = await getCredits(userId);
      if (credits) {
        const transaction: CreditTransaction = {
          id: generateId('TX'),
          type: 'DEBIT',
          amount: creditsDeducted,
          description: `NARRATIVE_INTERACTION // ${narrativeId} // ${choice_id}`,
          narrative_id: narrativeId,
          timestamp: now(),
        };
        credits.transactions.push(transaction);
        credits.balance = session.credits;
        await setCredits(userId, credits);
      }
    }

    // Update profile
    const profile = await getProfile(userId);
    if (profile) {
      profile.reality_sync_percentage = session.reality_sync;
      profile.fragments_collected = session.fragments;
      profile.strata_depth = session.strata_depth;
      await setProfile(userId, profile);
    }

    // Build response
    const response: ChoiceResponse = {
      next_node: targetNode,
      applied_changes: {
        reality_sync_delta: `${realitySyncDelta >= 0 ? '+' : ''}${realitySyncDelta.toFixed(2)}`,
        fragments_delta: `${fragmentsDelta >= 0 ? '+' : ''}${fragmentsDelta}`,
        credits_deducted: creditsDeducted,
        flags_triggered: choice.outcome_flags,
      },
      updated_profile: profile || {
        id: userId,
        operator_name: 'OPERATOR_NULL',
        clearance: 'ROOT',
        location: { lat: 40.7128, lng: -74.006, sector: 'Sector-7' },
        reality_sync_percentage: session.reality_sync,
        fragments_collected: session.fragments,
        strata_depth: session.strata_depth,
        system_stability: 0.9998,
        active_nodes: 12402,
        created_at: now(),
      },
      archive_entry: archiveEntry,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Choice error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
