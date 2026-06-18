import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { setSession, setProfile, setCredits, getProfile } from '@/lib/store';
import { generateId, simpleHash, now } from '@/lib/utils';
import { createDefaultCredits } from '@/data/seed-credits';
import type { AuthInitializeRequest, AuthInitializeResponse, UserProfile, UserSession } from '@/models/types';

/**
 * POST /api/v1/auth/initialize
 *
 * Authenticates (or creates) a user and returns a JWT session token.
 * This is the only public API endpoint — no auth required.
 */
export async function POST(request: NextRequest) {
  try {
    const body: AuthInitializeRequest = await request.json();

    if (!body.biometric_signature) {
      return NextResponse.json(
        { success: false, error: 'biometric_signature is required' },
        { status: 400 }
      );
    }

    // Hash the biometric signature to create a stable user ID
    const bioHash = simpleHash(body.biometric_signature);
    const userId = `OP_${bioHash}`;

    // Check if user already exists
    let profile = await getProfile(userId);

    if (!profile) {
      // Create new user profile
      profile = createDefaultProfile(userId);
      await setProfile(userId, profile);

      // Initialize credits
      const credits = createDefaultCredits(userId);
      await setCredits(userId, credits);
    }

    // Generate JWT
    const token = await createToken(userId);

    // Create or update session
    const session: UserSession = {
      user_id: userId,
      token,
      current_narrative: undefined,
      current_node: undefined,
      selected_paths: ['MED'],
      credits: 15.0,
      fragments: 0,
      strata_depth: 1,
      reality_sync: profile.reality_sync_percentage,
      unlocked_narratives: ['NARRATIVE_082_MED', 'NARRATIVE_115_CORP'],
      completed_narratives: [],
      archived_entries: [],
      created_at: profile.created_at,
      last_active: now(),
    };

    await setSession(userId, session);

    const response: AuthInitializeResponse = {
      token,
      expires_at: now() + 7 * 24 * 60 * 60, // 7 days
      user: profile,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Auth initialize error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createDefaultProfile(userId: string): UserProfile {
  return {
    id: userId,
    operator_name: 'OPERATOR_NULL',
    clearance: 'ROOT',
    location: {
      lat: 40.7128,
      lng: -74.006,
      sector: 'Sector-7',
    },
    reality_sync_percentage: 0.846,
    fragments_collected: 0,
    strata_depth: 1,
    system_stability: 0.9998,
    active_nodes: 12402,
    created_at: now(),
  };
}
