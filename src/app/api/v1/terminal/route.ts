import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession } from '@/lib/store';
import { processCommand } from '@/data/seed-terminal';

/**
 * POST /api/v1/terminal
 *
 * Accepts a text command from the Life.OS terminal interface
 * and returns formatted output lines.
 *
 * Body: { command: "STATUS" }
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
    const { command } = body;

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { success: false, error: 'command string is required' },
        { status: 400 }
      );
    }

    // Process the command
    const clearance = 'ROOT'; // Default for MVP — in production, use session.clearance
    const result = processCommand(command, clearance);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Terminal error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
