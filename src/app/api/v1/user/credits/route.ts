import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getCredits } from '@/lib/store';
import { createDefaultCredits } from '@/data/seed-credits';
import type { UserCredits } from '@/models/types';

/**
 * GET /api/v1/user/credits
 *
 * Returns the authenticated user's credit balance, limit, and transaction history.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let credits = await getCredits(userId);

    // Initialize if not found
    if (!credits) {
      credits = createDefaultCredits(userId);
    }

    return NextResponse.json({ success: true, data: credits });
  } catch (error) {
    console.error('Credits fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
