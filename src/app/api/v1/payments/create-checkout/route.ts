import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession } from '@/lib/store';
import {
  CREDIT_PRICING_TIERS,
  getStripe,
  toStripeAmount,
  generateIdempotencyKey,
} from '@/lib/payments';

/**
 * POST /api/v1/payments/create-checkout
 *
 * Creates a Stripe Checkout Session for purchasing Curious Credits.
 * The user is redirected to Stripe's hosted checkout page.
 * On success, Stripe redirects back to /credits?session_id={CHECKOUT_SESSION_ID}.
 * The actual credit granting happens in the webhook handler.
 *
 * Body: { tier_id: string, success_url?: string, cancel_url?: string }
 * Response: { url: string } — Stripe Checkout URL to redirect to
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
    const { tier_id, success_url, cancel_url } = body;

    if (!tier_id) {
      return NextResponse.json(
        { success: false, error: 'tier_id is required' },
        { status: 400 }
      );
    }

    const tier = CREDIT_PRICING_TIERS.find((t) => t.id === tier_id);
    if (!tier) {
      return NextResponse.json(
        { success: false, error: `Unknown tier: ${tier_id}` },
        { status: 400 }
      );
    }

    const stripe = await getStripe();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Payment provider not configured.' },
        { status: 503 }
      );
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user_id || undefined,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        tier_id: tier.id,
        credits: tier.credits.toString(),
        narrative_console: 'life-os-v1',
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tier.name} — ${tier.name_zh}`,
              description: `${tier.credits} Curious Credits (CC) for Life.OS Narrative Console. ¥${tier.price_cny.toFixed(2)} CNY equivalent.`,
            },
            unit_amount: toStripeAmount(tier.price_usd),
          },
          quantity: 1,
        },
      ],
      success_url:
        success_url ||
        `${origin}/credits?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url:
        cancel_url ||
        `${origin}/credits?status=cancelled`,
      idempotency_key: generateIdempotencyKey(userId, tier.id),
    });

    return NextResponse.json({
      success: true,
      data: {
        url: checkoutSession.url,
        session_id: checkoutSession.id,
        tier,
      },
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
