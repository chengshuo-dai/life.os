import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession } from '@/lib/store';
import { getTimelineResponse, CORRUPTED_CARDS } from '@/data/seed-archive';
import type { TimelineResponse } from '@/models/types';

/**
 * GET /api/v1/archive/timeline
 *
 * Returns timeline entries filtered by query parameters.
 * Entries for paths the user hasn't completed are returned as corrupted.
 *
 * Query params:
 *   ?timestamp=  - Scrub to a specific Unix timestamp
 *   ?from=&to=   - Time range
 *   ?narrative_id= - Filter by narrative
 *   ?path=        - Filter by path (MED, CORP, FREE)
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
        { success: false, error: 'Session expired.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const timestamp = searchParams.get('timestamp')
      ? parseInt(searchParams.get('timestamp')!)
      : undefined;
    const from = searchParams.get('from')
      ? parseInt(searchParams.get('from')!)
      : undefined;
    const to = searchParams.get('to')
      ? parseInt(searchParams.get('to')!)
      : undefined;
    const narrativeId = searchParams.get('narrative_id') || undefined;
    const path = searchParams.get('path') || undefined;

    const response: TimelineResponse = getTimelineResponse({
      timestamp,
      from,
      to,
      narrative_id: narrativeId,
      path: path as 'MED' | 'CORP' | 'FREE' | undefined,
      userCompletedPaths: session.completed_narratives,
    });

    // Attach corrupted cards data
    return NextResponse.json({
      success: true,
      data: {
        ...response,
        corrupted_cards: CORRUPTED_CARDS,
        system_stability: 99.98,
        active_nodes: 12402,
      },
    });
  } catch (error) {
    console.error('Archive timeline error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
