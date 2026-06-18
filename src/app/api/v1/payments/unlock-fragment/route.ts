import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession, setSession, getCredits, setCredits } from '@/lib/store';
import { NARRATIVES } from '@/data/seed-narratives';
import { DEFAULT_CREDIT_CONFIG } from '@/data/seed-credits';
import { generateId, now, roundTo } from '@/lib/utils';
import type { PaymentUnlockResponse, CreditTransaction } from '@/models/types';

/**
 * POST /api/v1/payments/unlock-fragment
 *
 * Spends Curious Credits to unlock paywalled narrative content.
 * Verifies balance, deducts credits, and returns the unlocked content.
 */
export async function POST(request: NextRequest) {
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
    const { narrative_id, node_id } = body;

    if (!narrative_id || !node_id) {
      return NextResponse.json(
        { success: false, error: 'narrative_id and node_id are required' },
        { status: 400 }
      );
    }

    // Find the narrative and node
    const narrative = NARRATIVES.find((n) => n.id === narrative_id);
    if (!narrative) {
      return NextResponse.json(
        { success: false, error: 'Narrative not found' },
        { status: 404 }
      );
    }

    const node = narrative.nodes.find((n) => n.id === node_id);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    if (!node.is_paywalled) {
      return NextResponse.json(
        { success: false, error: 'This node is not paywalled.' },
        { status: 400 }
      );
    }

    const cost = node.credit_cost || DEFAULT_CREDIT_CONFIG.fragment_unlock_cost;

    // Check balance
    const credits = await getCredits(userId);
    if (!credits || credits.balance < cost) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. Cost: ${cost} CC, Balance: ${credits?.balance || 0} CC`,
        },
        { status: 402 }
      );
    }

    // Deduct credits
    credits.balance = roundTo(credits.balance - cost, 2);
    session.credits = credits.balance;

    const transaction: CreditTransaction = {
      id: generateId('TX'),
      type: 'DEBIT',
      amount: cost,
      description: `FRAGMENT_UNLOCK // ${narrative_id} // ${node_id}`,
      narrative_id,
      timestamp: now(),
    };
    credits.transactions.push(transaction);

    await setCredits(userId, credits);
    await setSession(userId, session);

    const response: PaymentUnlockResponse = {
      success: true,
      new_balance: credits.balance,
      unlocked_content: node,
      transaction,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Payment unlock error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
