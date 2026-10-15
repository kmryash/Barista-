import React, { useState } from 'react';
import { X, Crown, Sparkles, Check, ShieldCheck, Calendar, Zap, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPaymentProvider } from '../services/payment';
import { PerkTier } from '../types';

export interface MembershipPlan {
  id: '1-month' | '6-month' | '12-month';
  durationMonths: number;
  durationDays: number;
  name: string;
  regularPrice: number;
  price: number;
  offerText?: string;
  badge?: string;
  tier: PerkTier;
  subtext: string;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: '1-month',
    durationMonths: 1,
    durationDays: 30,
    name: '1 Month Pass',
    regularPrice: 5,
    price: 5,
    tier: 'barista',
    subtext: '$5 for 1 month',
  },
  {
    id: '6-month',
    durationMonths: 6,
    durationDays: 180,
    name: '6 Months Pass',
    regularPrice: 30,
    price: 25,
    badge: 'Save $5',
    tier: 'head_barista',
    subtext: '$30 dollars for 6 month in offer $25',
  },
  {
    id: '12-month',
    durationMonths: 12,
    durationDays: 365,
    name: '12 Months Pass',
    regularPrice: 60,
    price: 30,
    badge: '50% OFF',
    tier: 'master_barista',
    subtext: '$60 for 12 month in offer $30',
  },
];

interface BiddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amountUsd: number, tier: PerkTier, planName: string) => void;
  countryMode: 'IN' | 'US';
  onToggleCountry: () => void;
}

export const BiddingModal: React.FC<BiddingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  countryMode,
  onToggleCountry,
}) => {
  const { userProfile, applyPremiumPass, currentUser } = useAuth();

  // Selected plan - default to 6 Months ($25) or 1 Month ($5)
  const [selectedPlanId, setSelectedPlanId] = useState<'1-month' | '6-month' | '12-month'>('6-month');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>(countryMode === 'IN' ? 'upi' : 'card');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPlan = MEMBERSHIP_PLANS.find(p => p.id === selectedPlanId) || MEMBERSHIP_PLANS[0];

  const handleProceedPayment = async () => {
    setError(null);

    setLoading(true);
    try {
      const provider = getPaymentProvider(paymentMethod);
      const order = await provider.createOrder(selectedPlan.price, {
        userId: userProfile?.id || currentUser?.uid,
        planId: selectedPlan.id,
        durationDays: selectedPlan.durationDays,
      });

      const confirmation = await provider.confirmPayment(order.id, {
        method: paymentMethod,
      });

      if (confirmation.success) {
        await applyPremiumPass(selectedPlan.price, selectedPlan.durationDays, selectedPlan.tier);
        onSuccess(selectedPlan.price, selectedPlan.tier, selectedPlan.name);
      }
    } catch (err: any) {
      setError(err?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-lg w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#3B2418] text-[#FFF6E9] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2B84B] text-[#3B2418] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Crown className="w-3.5 h-3.5 text-[#3B2418]" />
            <span>Barista League Pass</span>
          </div>

          <h2 className="text-2xl font-black text-[#FFF6E9]">
            Unlock All Specialty Brews ☕
          </h2>
          <p className="text-xs text-[#FFF6E9]/80 mt-1">
            Choose your membership plan to unlock all 25+ artisanal recipes and dynamic guides.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-[#3B2418]">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* EXACT 3 MEMBERSHIP PLANS */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 font-mono">
              Select Membership Plan:
            </div>

            <div className="space-y-2.5">
              {MEMBERSHIP_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#E8590C] ring-2 ring-[#E8590C]/30 shadow-md'
                        : 'bg-white/70 border-[#C68642]/30 hover:border-[#C68642] hover:bg-white'
                    }`}
                  >
                    {/* Left: Radio & Plan Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#E8590C] bg-[#E8590C]'
                            : 'border-stone-400 bg-transparent'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#3B2418]">
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8590C] text-white font-mono">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#3B2418]/70 mt-0.5">
                          {plan.subtext}
                        </div>
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        {plan.regularPrice > plan.price && (
                          <span className="text-xs line-through text-stone-400 font-mono">
                            ${plan.regularPrice}
                          </span>
                        )}
                        <span className="text-xl font-black text-[#E8590C] font-mono">
                          ${plan.price}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {plan.durationMonths === 1 ? '30 days' : `${plan.durationDays} days`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAYMENT METHOD SELECTION */}
          <div className="space-y-2 pt-2 border-t border-[#C68642]/15">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 font-mono">
                Payment Method:
              </label>
              <button
                type="button"
                onClick={onToggleCountry}
                className="text-[11px] text-[#E8590C] hover:underline font-semibold cursor-pointer"
              >
                Switch to {countryMode === 'IN' ? 'Card / International' : 'UPI / India'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#3B2418] text-[#F2B84B] border-[#3B2418] shadow-xs'
                    : 'bg-white text-[#3B2418] border-[#C68642]/30 hover:bg-[#FFF6E9]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / Netbanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#3B2418] text-[#F2B84B] border-[#3B2418] shadow-xs'
                    : 'bg-white text-[#3B2418] border-[#C68642]/30 hover:bg-[#FFF6E9]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>
            </div>
          </div>

          {/* DISPLAY OF USER INSTRUCTION: "you can pay ($X only)" */}
          <div className="bg-white p-4 rounded-2xl border border-[#C68642]/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#3B2418]/70">Selected Plan:</div>
              <div className="font-bold text-sm text-[#3B2418] flex items-center gap-1.5 mt-0.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{selectedPlan.name} ({selectedPlan.durationMonths} {selectedPlan.durationMonths === 1 ? 'Month' : 'Months'})</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-[#3B2418]/70">Amount:</div>
              <div className="text-sm font-bold text-[#E8590C]">
                you can pay <span className="font-black font-mono">(${selectedPlan.price} only)</span>
              </div>
            </div>
          </div>

          {/* BENEFITS INCLUDED */}
          <div className="bg-[#C68642]/10 p-3.5 rounded-2xl space-y-1.5 text-xs text-[#3B2418]">
            <div className="font-bold text-[#3B2418] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>Membership Benefits:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-[#3B2418]/80 list-disc list-inside">
              <li>Instant unlock of all 25+ classic and reserve artisanal coffee recipes</li>
              <li>Interactive step tracking with brew progress saved to your device</li>
              <li>Grind size ratios, water temperature dials, and sensory flavor guides</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer with "you can pay ($X only)" CTA */}
        <div className="p-4 bg-white border-t border-[#C68642]/20 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#3B2418]/80">
            <span>Total: </span>
            <span className="font-bold text-[#E8590C]">you can pay (${selectedPlan.price} only)</span>
          </div>

          <button
            onClick={handleProceedPayment}
            disabled={loading}
            className="bg-[#E8590C] hover:bg-[#d04f0a] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#F2B84B]" />
                <span>Pay (${selectedPlan.price} only)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
