import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession, setSession, getCredits, setCredits } from '@/lib/store';
import { NARRATIVES } from '@/data/seed-narratives';
import { DEFAULT_CREDIT_CONFIG } from '@/data/seed-credits';
import { generateId, now, roundTo } from '@/lib/utils';
import type { CreditTransaction } from '@/models/types';

/**
 * POST /api/v1/decrypt
 *
 * Fragment Decryption endpoint (Alignment Guide §1.D, §2).
 * Deducts 1 Curiosity Credit to decrypt a redacted/paywalled narrative fragment.
 * Returns the decrypted content and triggers Fragment_Reassembly on the frontend.
 *
 * Body: { fragment_id: string, narrative_id?: string }
 * Response: { decrypted_text: string, new_balance: number, fragment_node_id: string }
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
    const { fragment_id, narrative_id } = body;

    if (!fragment_id) {
      return NextResponse.json(
        { success: false, error: 'fragment_id is required' },
        { status: 400 }
      );
    }

    // Decryption cost — 1 CC per the alignment guide
    const decryptCost = 1.0;

    // Check balance
    const credits = await getCredits(userId);
    if (!credits || credits.balance < decryptCost) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. Cost: ${decryptCost} CC, Balance: ${credits?.balance ?? 0} CC`,
        },
        { status: 402 }
      );
    }

    // Find the fragment content
    // fragment_id can refer to:
    //   (a) a specific node_id in a narrative (e.g., "NODE_082_MED_004")
    //   (b) a redacted archive entry
    let decryptedText = '';
    let fragmentNodeId = fragment_id;

    // Attempt to find the node across all narratives
    if (narrative_id) {
      const narrative = NARRATIVES.find((n) => n.id === narrative_id);
      if (narrative) {
        const node = narrative.nodes.find((n) => n.id === fragment_id);
        if (node) {
          decryptedText = node.content;
          fragmentNodeId = node.id;
        }
      }
    }

    // Fallback: search all narratives for the fragment_id as a node ID
    if (!decryptedText) {
      for (const narrative of NARRATIVES) {
        const node = narrative.nodes.find((n) => n.id === fragment_id);
        if (node) {
          decryptedText = node.content;
          fragmentNodeId = node.id;
          break;
        }
      }
    }

    // If still not found, return a system-generated fragment
    if (!decryptedText) {
      decryptedText = `[FRAGMENT_DECRYPTED] // ID: ${fragment_id}\n`
        + `Data stream recovered from redacted strata. `
        + `Neural integrity at ${(70 + Math.random() * 25).toFixed(1)}%. `
        + `Proceed with caution — temporal echoes detected in this memory sector.`;
    }

    // Deduct credits
    credits.balance = roundTo(credits.balance - decryptCost, 2);
    session.credits = credits.balance;

    const transaction: CreditTransaction = {
      id: generateId('TX'),
      type: 'DEBIT',
      amount: decryptCost,
      description: `FRAGMENT_DECRYPTION // ${fragment_id}${narrative_id ? ` // ${narrative_id}` : ''}`,
      narrative_id: narrative_id || undefined,
      timestamp: now(),
    };
    credits.transactions.push(transaction);

    await setCredits(userId, credits);
    await setSession(userId, session);

    return NextResponse.json({
      success: true,
      data: {
        decrypted_text: decryptedText,
        new_balance: credits.balance,
        fragment_node_id: fragmentNodeId,
        transaction,
        // Flag to trigger Fragment_Reassembly animation on frontend
        trigger_reassembly: true,
      },
    });
  } catch (error) {
    console.error('Decrypt error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
