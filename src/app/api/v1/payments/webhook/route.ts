import { NextRequest, NextResponse } from 'next/server';
import {
  verifyStripeWebhook,
  creditsForPayment,
} from '@/lib/payments';
import { getCredits, setCredits, getSession, setSession } from '@/lib/store';
import { generateId, now, roundTo } from '@/lib/utils';
import type { CreditTransaction } from '@/models/types';

/**
 * POST /api/v1/payments/webhook
 *
 * Handles Stripe webhook events for payment processing.
 * Primary event: checkout.session.completed → grant credits to user.
 *
 * This endpoint receives raw body bytes — Next.js must be configured
 * to NOT parse the body for this route. This is handled by exporting
 * the `preferredRegion` and using `request.text()` for raw body.
 *
 * Security: Webhook signature is verified using STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature (throws if invalid)
    let event: any;
    try {
      event = await verifyStripeWebhook(payload, signature);
    } catch (err: any) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return NextResponse.json(
        { success: false, error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object;
        const userId = checkoutSession.metadata?.user_id;
        const tierId = checkoutSession.metadata?.tier_id;
        const creditAmount = parseInt(checkoutSession.metadata?.credits || '0', 10);

        if (!userId || !tierId || creditAmount <= 0) {
          console.error('Webhook: Missing metadata', { userId, tierId, creditAmount });
          return NextResponse.json(
            { success: false, error: 'Missing required metadata in checkout session' },
            { status: 400 }
          );
        }

        // Grant credits to the user
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
            description: `STRIPE_PURCHASE // ${tierId} // Session: ${checkoutSession.id}`,
            timestamp: now(),
          };

          credits.balance = newBalance;
          credits.transactions.push(transaction);
          await setCredits(userId, credits);

          // Sync session credits
          if (session) {
            session.credits = newBalance;
            await setSession(userId, session);
          }

          console.log(
            `[Life.OS] Credits granted: +${creditAmount} CC → User ${userId} (${newBalance} CC total)`
          );
        } else {
          console.error(`Webhook: No credits record found for user ${userId}`);
        }
        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        console.log(`[Life.OS] Payment event: ${event.type} — no action needed.`);
        break;
      }

      case 'payment_intent.succeeded': {
        // Could also grant credits here for redundancy, but checkout.session.completed
        // is the canonical event for Checkout Sessions.
        console.log(
          `[Life.OS] PaymentIntent succeeded: ${event.data.object.id}`
        );
        break;
      }

      default:
        console.log(`[Life.OS] Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook handler error' },
      { status: 500 }
    );
  }
}
