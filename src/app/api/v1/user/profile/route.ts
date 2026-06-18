import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession, getProfile, getCredits } from '@/lib/store';
import { getNarrativeListItems } from '@/data/seed-narratives';
import type { UserProfile, PathSyncItem } from '@/models/types';

/**
 * GET /api/v1/user/profile
 *
 * Returns the full user profile including reality sync metrics,
 * narrative path synchronicity, and credit overview.
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
    const profile = await getProfile(userId);
    const credits = await getCredits(userId);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found. Please re-initialize.' },
        { status: 404 }
      );
    }

    // Merge session state into profile
    const enrichedProfile: UserProfile = {
      ...profile,
      reality_sync_percentage: session?.reality_sync ?? profile.reality_sync_percentage,
      fragments_collected: session?.fragments ?? profile.fragments_collected,
      strata_depth: session?.strata_depth ?? profile.strata_depth,
    };

    // Build path synchronicity
    const userProgress = new Map<string, number>();
    if (session) {
      for (const narrativeId of session.unlocked_narratives) {
        if (session.completed_narratives.includes(narrativeId)) {
          userProgress.set(narrativeId, 100);
        } else if (session.current_narrative === narrativeId) {
          userProgress.set(narrativeId, 50); // Approximate mid-path
        } else {
          userProgress.set(narrativeId, 0);
        }
      }
    }

    const narrativeItems = getNarrativeListItems(
      session?.unlocked_narratives || [],
      userProgress
    );

    const path_synchronicity: PathSyncItem[] = narrativeItems.map((item) => ({
      narrative_path_id: item.id,
      sync_percentage: item.progress,
      is_complete: item.progress >= 100,
    }));

    return NextResponse.json({
      success: true,
      data: {
        profile: enrichedProfile,
        credits: credits
          ? { balance: credits.balance, limit: credits.limit }
          : { balance: 15.0, limit: 20.0 },
        path_synchronicity,
        active_narrative: session?.current_narrative || null,
        current_node: session?.current_node || null,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
