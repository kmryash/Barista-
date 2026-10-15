import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, Coffee, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PerkTier } from '../types';

interface BiddingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountPaid: number;
  tier: PerkTier;
  planName?: string;
}

export const BiddingSuccessModal: React.FC<BiddingSuccessModalProps> = ({
  isOpen,
  onClose,
  amountPaid,
  tier,
  planName,
}) => {
  const { userProfile } = useAuth();

  // Trigger celebratory confetti burst on open
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F2B84B', '#C68642', '#E8590C', '#3B2418']
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedExpiry = userProfile?.passExpiresAt
    ? new Date(userProfile.passExpiresAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-md w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#3B2418] text-[#FFF6E9] p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-gradient-to-tr from-[#E8590C] to-[#F2B84B] rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2B84B] text-[#3B2418] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
            <span>Pass Activated</span>
          </div>

          <h2 className="text-2xl font-black text-[#FFF6E9]">
            Welcome to Barista League! ☕
          </h2>
          <p className="text-xs text-[#FFF6E9]/80 mt-1">
            Your membership is confirmed. All recipes and brewing guides are unlocked!
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-[#3B2418]">
          <div className="bg-white p-4 rounded-2xl border border-[#C68642]/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#3B2418]/70">Membership Plan:</span>
              <span className="font-bold text-[#3B2418]">{planName || 'Barista League Pass'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#3B2418]/70">Amount Paid:</span>
              <span className="font-black text-[#E8590C] font-mono">${amountPaid} USD</span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-[#C68642]/10 pt-2">
              <span className="text-[#3B2418]/70">Pass Valid Until:</span>
              <span className="font-bold text-emerald-700 font-mono">{formattedExpiry}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Perks Unlocked:</span>
            </div>
            <ul className="text-[11px] text-emerald-800 list-disc list-inside space-y-0.5">
              <li>Instant access to all 25+ artisanal brewing recipes</li>
              <li>Exclusive reserve coffee guides and recipes</li>
              <li>Interactive step-by-step progress checklist</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#E8590C] hover:bg-[#d04f0a] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Coffee className="w-4 h-4 text-[#F2B84B]" />
            <span>Start Brewing Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
