/**
 * WeChat Pay v3 API — Request Signing
 *
 * WeChat Pay v3 requires RSA-SHA256 signing of every API request.
 * The signing process:
 *   1. Build the canonical message (HTTP method + URL path + timestamp + nonce + body)
 *   2. Sign with the merchant's private key
 *   3. Add Authorization header with the signature
 *
 * This module is only loaded server-side (never bundled to client).
 *
 * Reference: https://pay.weixin.qq.com/docs/merchant/development/interface-rules/signature-generation.html
 */

import { createSign, randomBytes } from 'crypto';

/**
 * Generate WeChat Pay v3 Authorization headers.
 * Returns the headers needed for authenticating with WeChat Pay API.
 */
export async function createWechatPayHeaders(
  method: string,
  path: string,
  body: string
): Promise<Record<string, string>> {
  const mchid = process.env.WECHAT_PAY_MERCHANT_ID || '';
  const serialNumber = process.env.WECHAT_PAY_SERIAL_NUMBER || '';
  const privateKeyPem = process.env.WECHAT_PAY_PRIVATE_KEY || '';

  if (!mchid || !serialNumber || !privateKeyPem) {
    throw new Error(
      'WeChat Pay credentials not configured. Set WECHAT_PAY_MERCHANT_ID, WECHAT_PAY_SERIAL_NUMBER, and WECHAT_PAY_PRIVATE_KEY.'
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(16).toString('hex');

  // Build the message to sign
  const message = `${method}\n${path}\n${timestamp}\n${nonce}\n${body}\n`;

  // Sign with RSA-SHA256
  const signer = createSign('RSA-SHA256');
  signer.update(message);
  signer.end();
  const signature = signer.sign(privateKeyPem, 'base64');

  // Build WECHATPAY2-SHA256-RSA2048 Authorization
  const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",serial_no="${serialNumber}",nonce_str="${nonce}",timestamp="${timestamp}",signature="${signature}"`;

  return {
    Authorization: authorization,
    'Wechatpay-Serial': serialNumber,
  };
}

/**
 * Verify a WeChat Pay notification signature.
 * Uses the WeChat Pay platform certificate (public key).
 */
export async function verifyWechatPaySignature(
  wechatTimestamp: string,
  wechatNonce: string,
  wechatSignature: string,
  body: string
): Promise<boolean> {
  const publicKeyPem = process.env.WECHAT_PAY_PLATFORM_CERT || '';
  if (!publicKeyPem) {
    console.warn('[Life.OS] WECHAT_PAY_PLATFORM_CERT not set — skipping signature verification.');
    return true; // Soft-fail for dev
  }

  const message = `${wechatTimestamp}\n${wechatNonce}\n${body}\n`;

  const { createVerify } = await import('crypto');
  const verifier = createVerify('RSA-SHA256');
  verifier.update(message);
  verifier.end();

  return verifier.verify(publicKeyPem, wechatSignature, 'base64');
}
