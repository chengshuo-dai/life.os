import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession } from '@/lib/store';
import { NARRATIVES, getNarrativeListItems } from '@/data/seed-narratives';
import type { NarrativeListItem } from '@/models/types';

/**
 * GET /api/v1/narratives
 *
 * Returns all narratives available to the authenticated user.
 * Optional query param: ?path=MED to filter by path.
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

    const session = await getSession(userId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session expired. Please re-authenticate.' },
        { status: 401 }
      );
    }

    // Build user progress map from session
    const userProgress = new Map<string, number>();

    // For each unlocked narrative, derive progress
    for (const narrativeId of session.unlocked_narratives) {
      const narrative = NARRATIVES.find((n) => n.id === narrativeId);
      if (!narrative) continue;

      if (session.completed_narratives.includes(narrativeId)) {
        userProgress.set(narrativeId, 100);
      } else if (session.current_narrative === narrativeId && session.current_node) {
        // Calculate progress based on current node position
        const currentNodeIdx = narrative.nodes.findIndex(
          (n) => n.id === session.current_node
        );
        const totalNodes = narrative.nodes.length;
        const progress = Math.round(((currentNodeIdx + 1) / totalNodes) * 100);
        userProgress.set(narrativeId, Math.min(progress, 99)); // Cap at 99 unless completed
      } else {
        userProgress.set(narrativeId, 0);
      }
    }

    const items = getNarrativeListItems(session.unlocked_narratives, userProgress);

    // Filter by path if requested
    const { searchParams } = new URL(request.url);
    const pathFilter = searchParams.get('path');

    const filtered = pathFilter
      ? items.filter((item) => item.path === pathFilter)
      : items;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Narratives list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
