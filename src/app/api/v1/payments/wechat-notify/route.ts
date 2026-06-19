import { NextRequest, NextResponse } from 'next/server';
import { getCredits, setCredits, getSession, setSession } from '@/lib/store';
import { generateId, now, roundTo } from '@/lib/utils';
import type { CreditTransaction } from '@/models/types';

/**
 * POST /api/v1/payments/wechat-notify
 *
 * Handles WeChat Pay payment success notifications (webhook).
 * WeChat Pay calls this URL when a payment completes successfully.
 *
 * WeChat Pay v3 notification format:
 *   Headers: Wechatpay-Signature-Type, Wechatpay-Signature, Wechatpay-Timestamp, etc.
 *   Body: { id, create_time, resource_type, event_type, summary, resource: { original_type, algorithm, ciphertext, associated_data, nonce } }
 *
 * After decrypting the resource, grant credits to the user.
 * Always returns 200 with { code: "SUCCESS" } per WeChat Pay spec.
 */
export async function POST(request: NextRequest) {
  try {
    const wechatTimestamp = request.headers.get('wechatpay-timestamp') || '';
    const wechatNonce = request.headers.get('wechatpay-nonce') || '';
    const wechatSignature = request.headers.get('wechatpay-signature') || '';
    const wechatSerial = request.headers.get('wechatpay-serial') || '';

    const body = await request.json();

    // ─── Production: Verify signature + decrypt resource ──
    // For a full production implementation, we would:
    // 1. Verify WeChat Pay signature using the platform certificate
    // 2. Decrypt the resource.ciphertext using AEAD_AES_256_GCM
    // 3. Extract user_id, tier_id, credits from the decrypted data

    const isConfigured =
      process.env.WECHAT_PAY_API_V3_KEY &&
      process.env.WECHAT_PAY_SERIAL_NUMBER;

    if (!isConfigured) {
      // ─── Dev/Test Mode ──────────────────────────────────
      console.log(
        '[Life.OS] WeChat Pay notification received (dev mode — no verification)'
      );

      // Try to extract metadata from the notification
      const resource = body?.resource;
      let userId = '';
      let tierId = '';
      let creditAmount = 0;

      if (resource?.ciphertext) {
        // In dev, ciphertext might be base64-encoded JSON (for testing)
        try {
          const decoded = JSON.parse(
            Buffer.from(resource.ciphertext, 'base64').toString('utf-8')
          );
          userId = decoded.user_id || '';
          tierId = decoded.tier_id || '';
          creditAmount = parseInt(decoded.credits || '0', 10);
        } catch {
          console.log('[Life.OS] Could not decode dev notification ciphertext');
        }
      }

      if (!userId || creditAmount <= 0) {
        console.log('[Life.OS] Dev notification — no credits to grant, metadata missing');
      } else {
        await grantCreditsToUser(userId, tierId, creditAmount);
      }

      return NextResponse.json({ code: 'SUCCESS', message: 'OK' });
    }

    // ─── Production: Verify and decrypt ──────────────────
    // This section runs when WeChat Pay credentials are configured.
    // Implementation would use the WeChat Pay SDK or manual crypto:
    //
    // 1. Verify Wechatpay-Signature using wechatpay-certificate
    // 2. Decrypt resource.ciphertext using AEAD_AES_256_GCM with
    //    resource.nonce and resource.associated_data
    // 3. Parse the decrypted JSON for out_trade_no and attach metadata

    // Placeholder for production verification
    const eventType = body?.event_type;

    if (eventType === 'TRANSACTION.SUCCESS') {
      // In production, decrypt the resource to get user metadata
      const decryptedResource = body?.resource; // Would be decrypted
      const attachData = decryptedResource?.attach
        ? JSON.parse(decryptedResource.attach)
        : {};

      const userId = attachData.user_id;
      const tierId = attachData.tier_id;
      const creditAmount = parseInt(attachData.credits || '0', 10);

      if (userId && creditAmount > 0) {
        await grantCreditsToUser(userId, tierId, creditAmount);
      }
    }

    return NextResponse.json({ code: 'SUCCESS', message: 'OK' });
  } catch (error: any) {
    console.error('WeChat Pay notification error:', error);
    // WeChat Pay requires 200 with SUCCESS — never return error codes
    return NextResponse.json({ code: 'SUCCESS', message: 'Processed with errors' });
  }
}

// ─── Shared Credit Granting ──────────────────────────────

async function grantCreditsToUser(
  userId: string,
  tierId: string,
  creditAmount: number
): Promise<void> {
  const credits = await getCredits(userId);
  const session = await getSession(userId);

  if (credits) {
    const newBalance = roundTo(
      Math.min(credits.limit, credits.balance + creditAmount),
      2
    );

    const transaction: CreditTransaction = {
      id: generateId('TX'),
      type: 'CREDIT',
      amount: creditAmount,
      description: `WECHAT_PAY_PURCHASE // ${tierId} // +${creditAmount} CC`,
      timestamp: now(),
    };

    credits.balance = newBalance;
    credits.transactions.push(transaction);
    await setCredits(userId, credits);

    if (session) {
      session.credits = newBalance;
      await setSession(userId, session);
    }

    console.log(
      `[Life.OS] WeChat credits granted: +${creditAmount} CC → User ${userId} (${newBalance} CC total)`
    );
  }
}
