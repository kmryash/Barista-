import React from 'react';
import { Coffee, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateLegal: (page: 'privacy' | 'terms' | 'refund-policy' | 'support' | 'community-guidelines' | 'delete-account') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateLegal }) => {
  return (
    <footer className="bg-[#3B2418] text-[#FFF6E9] border-t border-[#C68642]/30 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#C68642]/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#F2B84B] text-[#3B2418] flex items-center justify-center font-bold text-sm">
                ☕
              </div>
              <span className="text-xl font-black tracking-tight text-[#FFF6E9]">BrewBook</span>
            </div>
            <p className="text-xs text-[#FFF6E9]/70 max-w-sm leading-relaxed">
              Brew like a barista
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#FFF6E9]/80">
            <button
              onClick={() => onNavigateLegal('privacy')}
              className="hover:text-[#F2B84B] transition-colors cursor-pointer"
            >
              Privacy Policy (DPDP)
            </button>
            <button
              onClick={() => onNavigateLegal('terms')}
              className="hover:text-[#F2B84B] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigateLegal('refund-policy')}
              className="hover:text-[#F2B84B] transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <button
              onClick={() => onNavigateLegal('community-guidelines')}
              className="hover:text-[#F2B84B] transition-colors cursor-pointer"
            >
              Community Guidelines
            </button>
            <button
              onClick={() => onNavigateLegal('support')}
              className="hover:text-[#F2B84B] transition-colors cursor-pointer"
            >
              Support
            </button>
            <button
              onClick={() => onNavigateLegal('delete-account')}
              className="hover:text-rose-400 text-rose-300 transition-colors cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* DPDP Act 2023 Badge & Regulatory Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FFF6E9]/60 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F2B84B]" />
            <span>Digital Personal Data Protection Act, 2023 Compliant · Grievance Officer: kmryash09@gmail.com</span>
          </div>
          <div>
            <span>Exchange Base: 1 USD = ₹90 INR · © {new Date().getFullYear()} BrewBook</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
