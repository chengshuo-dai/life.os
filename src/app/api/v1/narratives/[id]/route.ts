import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession, getNarrativeProgress, setNarrativeProgress } from '@/lib/store';
import { NARRATIVES } from '@/data/seed-narratives';
import type { NarrativeDetailResponse } from '@/models/types';

/**
 * GET /api/v1/narratives/:id
 *
 * Returns a single narrative with the user's current node and progress.
 */
export async function GET(
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
        { success: false, error: 'Session expired. Please re-authenticate.' },
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

    // Check if user has access
    if (!session.unlocked_narratives.includes(narrativeId)) {
      return NextResponse.json(
        { success: false, error: 'Narrative locked. Complete prerequisite paths to unlock.' },
        { status: 403 }
      );
    }

    // Get or initialize progress
    let progress = await getNarrativeProgress(userId, narrativeId);
    if (!progress) {
      // Start from the first node
      const firstNode = narrative.nodes[0];
      progress = {
        current_node: firstNode.id,
        choices_made: [],
        progress: 0,
      };
      await setNarrativeProgress(userId, narrativeId, progress);

      // Update session
      session.current_narrative = narrativeId;
      session.current_node = firstNode.id;
      await setNarrativeProgress(userId, narrativeId, progress);
    }

    // Find current node
    const currentNode = narrative.nodes.find(
      (n) => n.id === progress!.current_node
    ) || narrative.nodes[0];

    const response: NarrativeDetailResponse = {
      narrative: {
        ...narrative,
        // Don't send full node content for all nodes, just the current one
        nodes: narrative.nodes.map((n) => ({
          ...n,
          // Only send full content for current node
          content: n.id === currentNode.id ? n.content : '',
        })),
      },
      current_node: currentNode,
      user_progress: {
        progress: progress!.progress,
        choices_made: progress!.choices_made,
      },
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Narrative detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
