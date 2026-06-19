'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLifeOS } from '@/lib/store-client';
import GlitchText from '@/components/ui/GlitchText';
import CreditsDisplay from '@/components/ui/CreditsDisplay';
import ProgressBar from '@/components/ui/ProgressBar';
import GlassCard from '@/components/ui/GlassCard';
import { CREDIT_PRICING_TIERS } from '@/lib/payments';
import type { CreditPricingTier } from '@/lib/payments';

interface CheckoutResponse {
  url: string;
  session_id: string;
  tier: CreditPricingTier;
}

interface WechatOrderResponse {
  order_id: string;
  prepay_id: string;
  tier: CreditPricingTier;
  credits: number;
  amount_cny: number;
  amount_fen: number;
  status: string;
  wechat_params?: {
    appId: string;
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
    paySign: string;
  };
  _dev_note?: string;
}

/**
 * Curious Credits Purchase Page (Alignment Guide §1.D)
 * "一元好奇心" — ¥1.00 = 1 Curious Credit (CC)
 *
 * Supports two payment methods:
 *   - Stripe Checkout (international, USD)
 *   - WeChat Pay (China, CNY)
 */
export default function CreditsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-136px)] flex items-center justify-center">
          <p className="font-mono-data text-sm text-secondary cursor-blink">
            &gt; INITIALIZING_PAYMENT_GATEWAY<span className="cursor-blink">_</span>
          </p>
        </div>
      }
    >
      <CreditsContent />
    </Suspense>
  );
}

function CreditsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useLifeOS();

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wechat'>('stripe');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [wechatOrder, setWechatOrder] = useState<WechatOrderResponse | null>(null);

  const sessionStatus = searchParams.get('status');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    dispatch({ type: 'SET_PAGE', page: '/credits' });
  }, [dispatch]);

  // Fetch latest credits on mount and after successful Stripe redirect
  useEffect(() => {
    if (sessionStatus === 'success' && sessionId) {
      refreshCredits();
    }
  }, [sessionStatus, sessionId]);

  const refreshCredits = async () => {
    // The webhook may have already credited the user.
    // Re-fetch profile to get the latest balance.
    try {
      const res = await fetch('/api/v1/user/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
      });
      const json = await res.json();
      if (json.success && json.data?.credits) {
        dispatch({ type: 'SET_CREDITS', credits: json.data.credits });
      }
    } catch {
      // Silently fail — balance updates next page load
    }
  };

  const handleStripeCheckout = async (tier: CreditPricingTier) => {
    setIsProcessing(true);
    setError('');
    setSelectedTier(tier.id);

    const result = await fetch('/api/v1/payments/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ tier_id: tier.id }),
    });

    const json = await result.json();

    if (json.success && json.data?.url) {
      // Redirect to Stripe Checkout
      window.location.href = json.data.url;
    } else {
      setError(json.error || 'Failed to create checkout session.');
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  const handleWechatOrder = async (tier: CreditPricingTier) => {
    setIsProcessing(true);
    setError('');
    setWechatOrder(null);
    setSelectedTier(tier.id);

    const result = await fetch('/api/v1/payments/wechat-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ tier_id: tier.id }),
    });

    const json = await result.json();

    if (json.success && json.data) {
      setWechatOrder(json.data);

      // WeChat JSAPI payment invocation
      if (json.data.wechat_params && typeof window !== 'undefined') {
        const params = json.data.wechat_params;

        // Check if WeChat JSAPI bridge is available (in-app browser)
        if ((window as any).wx && (window as any).wx.chooseWXPay) {
          (window as any).wx.chooseWXPay({
            appId: params.appId,
            timestamp: params.timeStamp,
            nonceStr: params.nonceStr,
            package: params.package,
            signType: params.signType,
            paySign: params.paySign,
            success: () => {
              refreshCredits();
              setWechatOrder((prev) =>
                prev ? { ...prev, status: 'success' } : null
              );
            },
            fail: (err: any) => {
              setError(`WeChat Pay failed: ${err.errMsg || 'Unknown error'}`);
              setWechatOrder((prev) =>
                prev ? { ...prev, status: 'failed' } : null
              );
            },
          });
        } else {
          // Not in WeChat browser — show QR code option
          setWechatOrder((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'awaiting_scan',
                  _dev_note:
                    'Open this page in WeChat to complete payment, or use Stripe for international cards.',
                }
              : null
          );
        }
      }
    } else {
      setError(json.error || 'Failed to create WeChat order.');
    }
    setIsProcessing(false);
  };

  const credits = state.credits || { balance: 0, limit: 20.0 };

  return (
    <div className="min-h-[calc(100vh-136px)]">
      <div className="max-w-4xl mx-auto px-gutter py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono-data text-[10px] text-outline tracking-[0.2em] mb-3">
            CURIOSITY_ECONOMY // CREDIT_EXCHANGE
          </p>
          <h1 className="font-display-hero text-3xl text-on-surface tracking-[0.1em]">
            ACQUIRE<span className="text-secondary">_</span>CREDITS
          </h1>
          <p className="font-mono-data text-xs text-outline mt-2">
            一元好奇心 // ¥1.00 = 1 CC (Curious Credit)
          </p>
        </div>

        {/* Success banner (after Stripe redirect) */}
        {sessionStatus === 'success' && (
          <div className="mb-8 p-5 glass-panel rounded-xl border-secondary/20 bg-secondary/5">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <div>
                <p className="font-mono-data text-xs text-secondary tracking-[0.1em]">
                  PAYMENT_SUCCESSFUL // CREDITS_GRANTED
                </p>
                <p className="font-mono-data text-[10px] text-outline mt-1">
                  Session: {sessionId?.slice(0, 20)}... — Refreshing balance...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled banner */}
        {sessionStatus === 'cancelled' && (
          <div className="mb-8 p-4 glass-panel rounded-lg border-amber-500/20 bg-amber-500/5">
            <p className="font-mono-data text-xs text-amber-500/80">
              PAYMENT_CANCELLED // No credits were deducted.
            </p>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 glass-panel rounded-lg border-error/20">
            <GlitchText
              text={error}
              className="font-mono-data text-sm text-error"
              active
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Current Balance + Payment Method */}
          <div className="lg:col-span-1 space-y-4">
            <CreditsDisplay balance={credits.balance} limit={credits.limit} />

            {/* Payment method selector */}
            <div className="glass-panel rounded-xl p-4 space-y-3">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
                PAYMENT_METHOD
              </p>
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-secondary/40 bg-secondary/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <p className="font-mono-data text-xs text-on-surface">Stripe</p>
                <p className="font-mono-data text-[9px] text-outline mt-0.5">
                  International Cards (USD)
                </p>
              </button>
              <button
                onClick={() => setPaymentMethod('wechat')}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  paymentMethod === 'wechat'
                    ? 'border-secondary/40 bg-secondary/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <p className="font-mono-data text-xs text-on-surface">WeChat Pay</p>
                <p className="font-mono-data text-[9px] text-outline mt-0.5">
                  微信支付 (CNY ¥)
                </p>
              </button>
            </div>

            {/* Transaction info */}
            <div className="glass-panel rounded-xl p-4 space-y-2">
              <p className="font-mono-data text-[10px] text-outline tracking-[0.15em]">
                EXCHANGE_INFO
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] text-on-surface-variant">
                  Rate
                </span>
                <span className="font-mono-data text-[10px] text-secondary">
                  ¥1.00 = 1.00 CC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] text-on-surface-variant">
                  Credit Limit
                </span>
                <span className="font-mono-data text-[10px] text-on-surface-variant">
                  {credits.limit.toFixed(0)} CC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] text-on-surface-variant">
                  Daily Quota
                </span>
                <span className="font-mono-data text-[10px] text-secondary">
                  +2.00 CC
                </span>
              </div>
            </div>
          </div>

          {/* Right: Pricing Tiers */}
          <div className="lg:col-span-2">
            <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-4">
              SELECT_CREDIT_PACKAGE
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CREDIT_PRICING_TIERS.map((tier) => (
                <GlassCard
                  key={tier.id}
                  className={`p-5 relative ${
                    tier.popular ? 'border-secondary/30' : ''
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-sm bg-secondary/20 border border-secondary/30 font-mono-data text-[9px] text-secondary">
                      POPULAR
                    </span>
                  )}
                  <div className="mb-4">
                    <p className="font-headline-lg text-lg text-on-surface">
                      {tier.name}
                    </p>
                    <p className="font-mono-data text-[10px] text-outline">
                      {tier.name_zh}
                    </p>
                  </div>

                  <div className="mb-4">
                    <span className="font-display-hero text-3xl text-secondary">
                      {tier.credits}
                    </span>
                    <span className="font-mono-data text-sm text-outline ml-1">
                      CC
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-[10px] text-outline">
                        CNY
                      </span>
                      <span className="font-mono-data text-xs text-on-surface">
                        ¥{tier.price_cny.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-[10px] text-outline">
                        USD (approx.)
                      </span>
                      <span className="font-mono-data text-xs text-on-surface-variant">
                        ${tier.price_usd.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-[10px] text-outline">
                        Per Credit
                      </span>
                      <span className="font-mono-data text-xs text-secondary">
                        ¥{(tier.price_cny / tier.credits).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* WeChat Order Status */}
                  {wechatOrder?.tier.id === tier.id && wechatOrder.status === 'awaiting_scan' && (
                    <div className="mb-3 p-2 rounded bg-amber-500/5 border border-amber-500/20">
                      <p className="font-mono-data text-[9px] text-amber-500/80">
                        ⚠ Open in WeChat browser to complete payment.
                      </p>
                    </div>
                  )}

                  {wechatOrder?.tier.id === tier.id && wechatOrder.status === 'success' && (
                    <div className="mb-3 p-2 rounded bg-secondary/5 border border-secondary/20">
                      <p className="font-mono-data text-[9px] text-secondary">
                        ✓ Payment successful! Refreshing balance...
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      paymentMethod === 'stripe'
                        ? handleStripeCheckout(tier)
                        : handleWechatOrder(tier)
                    }
                    disabled={
                      isProcessing ||
                      (paymentMethod === 'stripe' && !process.env.NEXT_PUBLIC_STRIPE_ENABLED)
                    }
                    className="liquid-btn w-full text-xs disabled:opacity-50"
                  >
                    {isProcessing && selectedTier === tier.id
                      ? 'PROCESSING...'
                      : paymentMethod === 'stripe'
                      ? `Pay $${tier.price_usd.toFixed(2)}`
                      : `¥${tier.price_cny.toFixed(2)} 微信支付`}
                  </button>
                </GlassCard>
              ))}
            </div>

            {/* Dev note when WeChat Pay not configured */}
            {paymentMethod === 'wechat' && wechatOrder?._dev_note && (
              <div className="mt-4 p-3 glass-panel rounded-lg border-amber-500/10">
                <p className="font-mono-data text-[10px] text-amber-500/60">
                  [DEV] {wechatOrder._dev_note}
                </p>
              </div>
            )}

            {/* Stripe test mode note */}
            {paymentMethod === 'stripe' && (
              <div className="mt-4 p-3 glass-panel rounded-lg border-white/5">
                <p className="font-mono-data text-[10px] text-outline">
                  [TEST_MODE] Use Stripe test card: 4242 4242 4242 4242
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History (if available) */}
        {state.credits?.transactions && state.credits.transactions.length > 0 && (
          <div className="mt-12">
            <p className="font-mono-data text-[10px] text-outline tracking-[0.15em] mb-4">
              TRANSACTION_HISTORY
            </p>
            <div className="glass-panel rounded-xl divide-y divide-white/[0.04]">
              {state.credits.transactions
                .slice()
                .reverse()
                .slice(0, 10)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="font-mono-data text-[10px] text-on-surface-variant">
                        {tx.description}
                      </p>
                      <p className="font-mono-data text-[9px] text-outline">
                        {new Date(tx.timestamp * 1000).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`font-mono-data text-xs ${
                        tx.type === 'CREDIT' ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {tx.type === 'CREDIT' ? '+' : '-'}
                      {tx.amount.toFixed(2)} CC
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
