/**
 * Life.OS Payment Integration — Stripe + WeChat Pay (Alignment Guide §1.D)
 *
 * "一元好奇心" (One-Yuan Curiosity): ¥1.00 = 1 Curious Credit (CC).
 * This module provides shared configuration, pricing tiers, and
 * utility functions used by both payment gateway endpoints.
 */

// ─── Pricing Tiers ───────────────────────────────────────

export interface CreditPricingTier {
  id: string;
  name: string;
  name_zh: string;
  credits: number;
  price_cny: number;      // Price in Chinese Yuan (¥)
  price_usd: number;       // Approximate USD equivalent
  stripe_price_id?: string; // Stripe Price ID from dashboard
  popular?: boolean;
}

/**
 * Credit packages available for purchase.
 * Exchange rate: ¥1.00 = 1 CC ("一元好奇心")
 * Stripe Price IDs are set via env vars or hardcoded from Stripe Dashboard.
 */
export const CREDIT_PRICING_TIERS: CreditPricingTier[] = [
  {
    id: 'tier_1',
    name: 'Explorer Pack',
    name_zh: '探索者包',
    credits: 5,
    price_cny: 5.0,
    price_usd: 0.69,
    stripe_price_id: process.env.STRIPE_PRICE_TIER_1,
  },
  {
    id: 'tier_2',
    name: 'Operator Pack',
    name_zh: '操作员包',
    credits: 10,
    price_cny: 10.0,
    price_usd: 1.39,
    stripe_price_id: process.env.STRIPE_PRICE_TIER_2,
    popular: true,
  },
  {
    id: 'tier_3',
    name: 'Architect Pack',
    name_zh: '架构师包',
    credits: 25,
    price_cny: 25.0,
    price_usd: 3.49,
    stripe_price_id: process.env.STRIPE_PRICE_TIER_3,
  },
  {
    id: 'tier_4',
    name: 'ROOT Access',
    name_zh: '根权限包',
    credits: 60,
    price_cny: 60.0,
    price_usd: 8.49,
    stripe_price_id: process.env.STRIPE_PRICE_TIER_4,
  },
];

/**
 * WeChat Pay configuration.
 * All values sourced from environment variables.
 * WeChat Pay v3 API uses merchant ID, API v3 key, and serial number.
 */
export const WECHAT_PAY_CONFIG = {
  mchid: process.env.WECHAT_PAY_MERCHANT_ID || '',
  appId: process.env.WECHAT_PAY_APP_ID || '',
  apiV3Key: process.env.WECHAT_PAY_API_V3_KEY || '',
  serialNumber: process.env.WECHAT_PAY_SERIAL_NUMBER || '',
  privateKeyPath: process.env.WECHAT_PAY_PRIVATE_KEY_PATH || '',
  notifyUrl: `${process.env.NEXT_PUBLIC_API_BASE || ''}/api/v1/payments/wechat-notify`,
};

// ─── Currency Helpers ────────────────────────────────────

/**
 * Format a USD amount for Stripe (integer cents).
 */
export function toStripeAmount(usdPrice: number): number {
  return Math.round(usdPrice * 100);
}

/**
 * Format a CNY amount for WeChat Pay (integer fen).
 */
export function toWechatAmount(cnyPrice: number): number {
  return Math.round(cnyPrice * 100);
}

/**
 * Generate an idempotency key for payment operations to prevent double-charges.
 */
export function generateIdempotencyKey(userId: string, tierId: string): string {
  return `${userId}_${tierId}_${Date.now()}`;
}

// ─── Stripe Initialization ───────────────────────────────

let _stripe: any = null;

/**
 * Lazy-load the Stripe client instance.
 * Returns null if STRIPE_SECRET_KEY is not configured.
 */
export async function getStripe() {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.warn('[Life.OS] STRIPE_SECRET_KEY not set — Stripe payments disabled.');
    return null;
  }

  const { default: Stripe } = await import('stripe');
  _stripe = new Stripe(secretKey, {
    apiVersion: '2026-05-27.dahlia',
    typescript: true,
  });
  return _stripe;
}

/**
 * Verify a Stripe webhook signature.
 */
export async function verifyStripeWebhook(
  payload: string,
  signature: string
): Promise<any> {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe not configured.');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not set.');

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// ─── Credit Granting ──────────────────────────────────────

/**
 * Determine how many credits to grant for a given payment amount (in CNY).
 * Default exchange: ¥1.00 = 1 CC.
 * Can be overridden per tier via the pricing table.
 */
export function creditsForPayment(tierId: string): number {
  const tier = CREDIT_PRICING_TIERS.find((t) => t.id === tierId);
  return tier?.credits ?? 0;
}
