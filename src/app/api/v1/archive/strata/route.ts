import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession } from '@/lib/store';
import { getTimelineResponse, CORRUPTED_CARDS } from '@/data/seed-archive';
import type { ArchiveTimelineEntry } from '@/models/types';

/**
 * GET /api/v1/archive/strata
 *
 * Returns the archive organized into geological "strata" layers
 * for the timeline visualization (Alignment Guide §1.E, §2).
 *
 * Strata layers:
 *   - SURFACE: Normal, uncorrupted entries (white/cyan display)
 *   - SUBSURFACE: Older entries with minor fragmentation
 *   - REDACTED: Entries marked as corrupted or redacted (red fault layer)
 *   - BEDROCK: System events — foundational, never corrupted
 *
 * Query params:
 *   ?timestamp=  - Scrub to a specific point
 *   ?narrative_id= - Filter by narrative
 *   ?path=        - Filter by path
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
    const narrativeId = searchParams.get('narrative_id') || undefined;
    const path = searchParams.get('path') || undefined;

    // Get base timeline entries
    const timeline = getTimelineResponse({
      timestamp,
      narrative_id: narrativeId,
      path: path as 'MED' | 'CORP' | 'FREE' | undefined,
      userCompletedPaths: session.completed_narratives,
    });

    // ─── Classify entries into strata layers ──────────────
    const surface: ArchiveTimelineEntry[] = [];
    const subsurface: ArchiveTimelineEntry[] = [];
    const redacted: ArchiveTimelineEntry[] = [];
    const bedrock: ArchiveTimelineEntry[] = [];

    for (const entry of timeline.entries) {
      if (entry.type === 'SYSTEM_EVENT') {
        bedrock.push(entry);
      } else if (entry.is_corrupted || entry.type === 'CORRUPTED' || entry.type === 'REDACTED') {
        redacted.push({
          ...entry,
          is_corrupted: true,
          corruption_message:
            entry.corruption_message ||
            'DATA_INTEGRITY_COMPROMISED // STRATA_LAYER_UNSTABLE',
        });
      } else if (entry.metrics.fragmentation_index > 0.3) {
        subsurface.push(entry);
      } else {
        surface.push(entry);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        strata: {
          surface,
          subsurface,
          redacted,
          bedrock,
        },
        counts: {
          surface: surface.length,
          subsurface: subsurface.length,
          redacted: redacted.length,
          bedrock: bedrock.length,
          total: timeline.entries.length,
        },
        corrupted_cards: CORRUPTED_CARDS,
        has_corrupted_data: redacted.length > 0,
        scrubbing_position: timeline.scrubbing_position,
        system_stability: 99.98,
        active_nodes: 12402,
        // Sync percentage from session
        reality_sync: session.reality_sync,
      },
    });
  } catch (error) {
    console.error('Archive strata error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
