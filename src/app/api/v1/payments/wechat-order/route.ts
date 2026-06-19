import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getSession } from '@/lib/store';
import {
  CREDIT_PRICING_TIERS,
  WECHAT_PAY_CONFIG,
  toWechatAmount,
  generateIdempotencyKey,
} from '@/lib/payments';
import { generateId, now } from '@/lib/utils';

/**
 * POST /api/v1/payments/wechat-order
 *
 * Creates a WeChat Pay Native/JSAPI order for purchasing Curious Credits.
 *
 * WeChat Pay v3 API flow:
 *   1. Server creates an order via POST to WeChat Pay
 *   2. Returns prepay_id and parameters
 *   3. Frontend invokes WeChat JSAPI to complete payment
 *   4. WeChat Pay calls /api/v1/payments/wechat-notify on success
 *
 * Body: { tier_id: string, openid?: string }
 * Response: { prepay_id, package, paySign, nonceStr, timeStamp, signType }
 *
 * NOTE: Requires valid WECHAT_PAY_* environment variables.
 * When credentials are absent, returns a simulated response for dev/testing.
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
    const { tier_id, openid } = body;

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

    // Check if WeChat Pay is configured
    const isConfigured =
      WECHAT_PAY_CONFIG.mchid &&
      WECHAT_PAY_CONFIG.apiV3Key &&
      WECHAT_PAY_CONFIG.serialNumber;

    if (!isConfigured) {
      // ─── Development/Test Mode: Simulate WeChat Pay ─────
      // Returns a simulated response so the frontend can test the flow.
      const mockOrderId = `WX_MOCK_${generateId('ORD')}`;
      console.log(
        `[Life.OS] WeChat Pay not configured — returning mock order ${mockOrderId}`
      );

      return NextResponse.json({
        success: true,
        data: {
          order_id: mockOrderId,
          prepay_id: `prepay_${mockOrderId}`,
          tier,
          credits: tier.credits,
          amount_cny: tier.price_cny,
          amount_fen: toWechatAmount(tier.price_cny),
          status: 'pending',
          // Mock WeChat JSAPI parameters
          wechat_params: {
            appId: WECHAT_PAY_CONFIG.appId || 'wx_mock_appid',
            timeStamp: Math.floor(Date.now() / 1000).toString(),
            nonceStr: generateId('NONCE'),
            package: `prepay_id=prepay_${mockOrderId}`,
            signType: 'RSA',
            paySign: 'MOCK_PAY_SIGN_FOR_DEVELOPMENT',
          },
          _dev_note: 'WeChat Pay credentials not configured. This is a simulated response.',
        },
      });
    }

    // ─── Production: Real WeChat Pay v3 Order ─────────────
    // WeChat Pay v3 POST /v3/pay/transactions/jsapi
    // or /v3/pay/transactions/native (QR code)

    const wechatOrderId = generateId('WX');
    const orderBody = {
      appid: WECHAT_PAY_CONFIG.appId,
      mchid: WECHAT_PAY_CONFIG.mchid,
      description: `${tier.name} — ${tier.name_zh}: ${tier.credits} Curious Credits`,
      out_trade_no: wechatOrderId,
      notify_url: WECHAT_PAY_CONFIG.notifyUrl,
      amount: {
        total: toWechatAmount(tier.price_cny),
        currency: 'CNY',
      },
      payer: openid ? { openid } : undefined,
      // Attach metadata for webhook processing
      attach: JSON.stringify({
        user_id: userId,
        tier_id: tier.id,
        credits: tier.credits,
      }),
    };

    // WeChat Pay requires RSA signing of requests — this is a
    // production implementation that requires the private key.
    const wechatApiBase = 'https://api.mch.weixin.qq.com/v3';

    try {
      // Dynamically import crypto for WeChat Pay signing
      const { createWechatPayHeaders } = await import('./signing');

      const headers = await createWechatPayHeaders(
        'POST',
        '/v3/pay/transactions/jsapi',
        JSON.stringify(orderBody)
      );

      const wechatResponse = await fetch(
        `${wechatApiBase}/pay/transactions/jsapi`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
          },
          body: JSON.stringify(orderBody),
        }
      );

      const wechatData = await wechatResponse.json();

      if (!wechatResponse.ok) {
        console.error('WeChat Pay order creation failed:', wechatData);
        return NextResponse.json(
          {
            success: false,
            error: `WeChat Pay error: ${wechatData.message || 'Unknown'}`,
          },
          { status: 502 }
        );
      }

      // Build JSAPI parameters for frontend
      const prepayId = wechatData.prepay_id;
      const timeStamp = Math.floor(Date.now() / 1000).toString();
      const nonceStr = generateId('NONCE');

      return NextResponse.json({
        success: true,
        data: {
          order_id: wechatOrderId,
          prepay_id: prepayId,
          tier,
          credits: tier.credits,
          amount_cny: tier.price_cny,
          amount_fen: toWechatAmount(tier.price_cny),
          status: 'pending',
          wechat_params: {
            appId: WECHAT_PAY_CONFIG.appId,
            timeStamp,
            nonceStr,
            package: `prepay_id=${prepayId}`,
            signType: 'RSA',
            paySign: '', // To be computed with WeChat Pay signing
          },
        },
      });
    } catch (wechatError: any) {
      console.error('WeChat Pay API error:', wechatError);
      return NextResponse.json(
        { success: false, error: `WeChat Pay API error: ${wechatError.message}` },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('WeChat order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create WeChat order' },
      { status: 500 }
    );
  }
}
