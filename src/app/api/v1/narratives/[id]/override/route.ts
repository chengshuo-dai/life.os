import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import {
  getSession,
  setSession,
  getNarrativeProgress,
  setNarrativeProgress,
  getCredits,
  setCredits,
  appendArchiveEntry,
} from '@/lib/store';
import { NARRATIVES } from '@/data/seed-narratives';
import { generateId, now, roundTo } from '@/lib/utils';
import type { CreditTransaction, ArchiveTimelineEntry } from '@/models/types';

/**
 * POST /api/v1/narratives/:id/override
 *
 * System Override — Node Backtracking (Alignment Guide §1.E, §2).
 * Allows an operator to spend credits to backtrack to a previously
 * completed node and re-choose, altering subsequent outcomes.
 *
 * Cost: 3.0 CC per override attempt.
 *
 * Body: { target_node_id: string }
 * Response: { backtracked_node: NarrativeNode, cost: number, new_balance: number }
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

    const narrativeId = params.id;
    const narrative = NARRATIVES.find((n) => n.id === narrativeId);

    if (!narrative) {
      return NextResponse.json(
        { success: false, error: 'Narrative not found' },
        { status: 404 }
      );
    }

    // Ensure the user has started this narrative
    const progress = await getNarrativeProgress(userId, narrativeId);
    if (!progress) {
      return NextResponse.json(
        { success: false, error: 'No progress found for this narrative. Start it first.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { target_node_id } = body;

    if (!target_node_id) {
      return NextResponse.json(
        { success: false, error: 'target_node_id is required' },
        { status: 400 }
      );
    }

    // Find the target node
    const targetNode = narrative.nodes.find((n) => n.id === target_node_id);
    if (!targetNode) {
      return NextResponse.json(
        { success: false, error: 'Target node not found in this narrative' },
        { status: 404 }
      );
    }

    // Override cost
    const overrideCost = 3.0;

    // Check credits
    const credits = await getCredits(userId);
    if (!credits || credits.balance < overrideCost) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits for Override. Cost: ${overrideCost} CC, Balance: ${credits?.balance ?? 0} CC`,
        },
        { status: 402 }
      );
    }

    // Find the current progress position (for the archive entry)
    const currentNode = narrative.nodes.find(
      (n) => n.id === progress.current_node
    );

    // Deduct credits
    credits.balance = roundTo(credits.balance - overrideCost, 2);
    session.credits = credits.balance;

    const transaction: CreditTransaction = {
      id: generateId('TX'),
      type: 'DEBIT',
      amount: overrideCost,
      description: `SYSTEM_OVERRIDE // ${narrativeId}: ${currentNode?.id ?? progress.current_node} → ${target_node_id}`,
      narrative_id: narrativeId,
      timestamp: now(),
    };
    credits.transactions.push(transaction);

    // Rewind narrative progress to the target node
    // Truncate choices_made to only include choices before the target node
    const targetIndex = narrative.nodes.findIndex((n) => n.id === target_node_id);
    const truncatedChoices = progress.choices_made.slice(0, targetIndex);

    const newProgress = {
      current_node: target_node_id,
      choices_made: truncatedChoices,
      progress: Math.round(((targetIndex + 1) / narrative.nodes.length) * 100),
    };

    await setNarrativeProgress(userId, narrativeId, newProgress);
    session.current_node = target_node_id;
    session.last_active = now();
    await setCredits(userId, credits);
    await setSession(userId, session);

    // Archive the override event
    const overrideEntry: ArchiveTimelineEntry = {
      id: generateId('ARCH'),
      timestamp: now(),
      label: `SYSTEM_OVERRIDE: ${narrativeId} // ${currentNode?.id ?? 'START'} → ${target_node_id}`,
      type: 'SYSTEM_EVENT',
      narrative_id: narrativeId,
      narrative_path: narrative.path,
      metrics: {
        fragmentation_index: roundTo(1 - newProgress.progress / 100, 2),
        neural_integrity: roundTo(0.5 + (newProgress.progress / 100) * 0.5, 2),
        data_integrity: roundTo(0.6 + (newProgress.progress / 100) * 0.3, 2),
      },
      data_blob: {
        event_type: 'SYSTEM_OVERRIDE',
        operator_id: userId,
        previous_node: currentNode?.id ?? 'START',
        target_node: target_node_id,
        override_cost: overrideCost,
        causality_drift: `+${(Math.random() * 0.001).toFixed(5)}s`,
      },
      is_corrupted: false,
    };
    await appendArchiveEntry(userId, overrideEntry);

    return NextResponse.json({
      success: true,
      data: {
        backtracked_node: targetNode,
        previous_node_id: currentNode?.id ?? null,
        cost: overrideCost,
        new_balance: credits.balance,
        new_progress: newProgress.progress,
        choices_preserved: truncatedChoices,
        archive_entry: overrideEntry,
      },
    });
  } catch (error) {
    console.error('Override error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
