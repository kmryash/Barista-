import { PaymentIntent, PaymentProvider, PerkTier } from '../types';

export const USD_TO_INR_RATE = 90; // 1 USD = ₹90 (configurable constant)
export const MIN_PASS_USD = 5;
export const MIN_BID_USD = 5;

export function usdToInr(usd: number): number {
  return Math.round(usd * USD_TO_INR_RATE);
}

export function inrToUsd(inr: number): number {
  return Math.round((inr / USD_TO_INR_RATE) * 100) / 100;
}

export function getTierForAmount(amountUsd: number): PerkTier | null {
  if (amountUsd < MIN_PASS_USD) return null;
  if (amountUsd >= 30) return 'master_barista';
  if (amountUsd >= 25) return 'head_barista';
  return 'barista';
}

export function getTierName(tier?: PerkTier | null): string {
  switch (tier) {
    case 'master_barista':
      return 'Master Barista ☕👑';
    case 'head_barista':
      return 'Head Barista ☕✨';
    case 'barista':
      return 'Barista ☕';
    default:
      return 'Free Member';
  }
}

export function formatCurrencyPair(amountUsd: number, isIndia: boolean): string {
  const inr = usdToInr(amountUsd);
  if (isIndia) {
    return `₹${inr.toLocaleString('en-IN')} ($${amountUsd})`;
  }
  return `$${amountUsd}`;
}

export function detectUserCountry(): 'IN' | 'US' {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India'))) {
      return 'IN';
    }
    const navLangs = navigator.languages || [navigator.language];
    if (navLangs.some(l => l.includes('IN') || l.includes('hi'))) {
      return 'IN';
    }
  } catch (e) {
    // fallback
  }
  return 'US';
}

// Client-facing Payment Provider Implementation for Stripe Test Mode
export class StripePaymentProvider implements PaymentProvider {
  name = 'Stripe Checkout (Cards & International)';
  currency: 'USD' = 'USD';

  async createOrder(amountUsd: number, metadata: Record<string, any>): Promise<PaymentIntent> {
    if (amountUsd < MIN_BID_USD) {
      throw new Error(`Server rejection: Minimum payment is $${MIN_BID_USD}.`);
    }

    // In a live Cloud Functions deployment, this calls httpsCallable or /api/payments/stripe/create-session
    const intentId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      id: intentId,
      amountUsd,
      amountInr: usdToInr(amountUsd),
      currency: 'USD',
      provider: 'stripe',
      clientSecret: `seti_${intentId}_secret_test`,
    };
  }

  async confirmPayment(orderId: string, paymentDetails: any): Promise<{ success: boolean; transactionId: string }> {
    // Simulate secure test mode verification with latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      transactionId: `txn_stripe_${orderId}`,
    };
  }
}

// Client-facing Payment Provider Implementation for Razorpay (UPI, Netbanking, RuPay)
export class RazorpayPaymentProvider implements PaymentProvider {
  name = 'Razorpay (UPI / RuPay / Netbanking)';
  currency: 'INR' = 'INR';

  async createOrder(amountUsd: number, metadata: Record<string, any>): Promise<PaymentIntent> {
    if (amountUsd < MIN_BID_USD) {
      throw new Error(`Server rejection: Minimum payment is $${MIN_BID_USD}.`);
    }

    const inr = usdToInr(amountUsd);
    const orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      id: orderId,
      orderId,
      amountUsd,
      amountInr: inr,
      currency: 'INR',
      provider: 'razorpay',
    };
  }

  async confirmPayment(orderId: string, paymentDetails: any): Promise<{ success: boolean; transactionId: string }> {
    // Simulate secure UPI / Webhook confirmation
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      transactionId: `pay_rzp_${orderId}`,
    };
  }
}

export function getPaymentProvider(mode: 'upi' | 'card'): PaymentProvider {
  if (mode === 'upi') {
    return new RazorpayPaymentProvider();
  }
  return new StripePaymentProvider();
}
