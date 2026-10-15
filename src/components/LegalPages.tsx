import React, { useState } from 'react';
import { Shield, FileText, RefreshCw, Mail, BookOpen, Trash2, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LegalPagesProps {
  page: 'privacy' | 'terms' | 'refund-policy' | 'support' | 'community-guidelines' | 'delete-account';
  onBack: () => void;
  onOpenSettings?: () => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ page, onBack, onOpenSettings }) => {
  const { currentUser, deleteAccountAndData } = useAuth();
  const [privacyLang, setPrivacyLang] = useState<'en' | 'hi'>('en');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteDone, setDeleteDone] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAccountAndData();
      setDeleteDone(true);
    } catch (e) {
      alert('Failed to delete account. Please try again from Settings.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-[#3B2418] animate-fade-in pb-20">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#E8590C] hover:underline cursor-pointer mb-2 inline-flex items-center gap-1"
        >
          ← Back to BrewBook
        </button>
      </div>

      {/* PRIVACY POLICY (English & Hindi) */}
      {page === 'privacy' && (
        <div className="bg-white rounded-3xl border border-[#C68642]/20 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C68642]/15 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C68642]/20 text-[#3B2418] text-xs font-bold uppercase tracking-wider font-mono mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {privacyLang === 'en' ? 'Privacy Policy & Data Notice' : 'गोपनीयता नीति एवं डेटा सूचना'}
              </h1>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Version 2026.1 · Last updated: October 10, 2026
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#FFF6E9] p-1 rounded-xl border border-[#C68642]/30">
              <button
                onClick={() => setPrivacyLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  privacyLang === 'en' ? 'bg-[#3B2418] text-[#FFF6E9]' : 'text-[#3B2418]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setPrivacyLang('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  privacyLang === 'hi' ? 'bg-[#3B2418] text-[#FFF6E9]' : 'text-[#3B2418]'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {privacyLang === 'en' ? (
            <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#3B2418]/90">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">1. Introduction & Statutory Scope</h2>
                <p>
                  BrewBook operates under the provisions of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of India. This Privacy Notice governs the collection, processing, storage, and erasure of digital personal data provided by Data Principals.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">2. Data Collected & Specified Purposes</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Identity (Email & Display Name):</strong> Collected to authenticate users, manage recipe bookmarks, and administer account security.</li>
                  <li><strong>Family-Friendly Community:</strong> Open to coffee lovers of all ages with automated profanity and safety protections.</li>
                  <li><strong>Payment Status & Pass Duration:</strong> Processed to grant digital access passes for 1 month ($5), 6 months ($25), or 12 months ($30).</li>
                  <li><strong>Device Push Tokens:</strong> Processed solely upon separate affirmative consent to deliver coffee alerts.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">3. Third-Party Service Providers</h2>
                <p>
                  We share data strictly on a need-to-know basis with trusted fiduciaries:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Google Cloud & Firebase:</strong> Encrypted hosting, authentication, and database services.</li>
                  <li><strong>Razorpay:</strong> RBI-licensed payment aggregator for domestic Indian UPI, cards, and netbanking.</li>
                  <li><strong>Stripe:</strong> Payment processing for international credit/debit transactions in USD.</li>
                  <li><strong>Google Safe Browsing:</strong> Automated URL inspection to shield users from malware and deceptive sites.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">4. Universal User Safety Policy</h2>
                <p>
                  BrewBook welcomes coffee lovers of all ages. We maintain family-friendly recipes, automated profanity scrubbing, and proactive URL safety checks to provide a wholesome community for all brewers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">5. Data Retention & Erasure</h2>
                <p>
                  We retain personal data only for as long as necessary. Accounts inactive for longer than 24 months are flagged for automated deletion following prior email notification. You may exercise your <strong>Right to Erasure</strong> at any time via Settings.
                </p>
              </section>

              <section className="space-y-2 bg-[#FFF6E9] p-4 rounded-2xl border border-[#C68642]/30">
                <h2 className="text-base font-bold text-[#3B2418]">6. Grievance Officer Contact Details</h2>
                <p>
                  If you have questions, privacy concerns, or wish to exercise statutory DPDP rights:
                </p>
                <div className="mt-2 space-y-0.5 font-mono text-xs">
                  <div><strong>Name:</strong> Yash Kumar</div>
                  <div><strong>Email:</strong> kmryash09@gmail.com</div>
                  <div><strong>Response Time:</strong> Acknowledged within 24 hours · Final resolution within 30 days</div>
                </div>
              </section>
            </div>
          ) : (
            /* Hindi Version */
            <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#3B2418]/90">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">1. प्रस्तावना एवं वैधानिक दायरा</h2>
                <p>
                  ब्रूबुक (BrewBook) भारत के <strong>डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act), 2023</strong> के अंतर्गत कार्य करता है। यह गोपनीयता सूचना आपके व्यक्तिगत डेटा के संग्रह, उपयोग, और अधिकार से संबंधित है।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-[#3B2418]">2. एकत्रित किया गया डेटा एवं उद्देश्य</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>पहचान डेटा (ईमेल एवं नाम):</strong> लॉगिन और कॉफी रेसिपी एक्सेस के लिए।</li>
                  <li><strong>सभी आयु वर्ग के लिए सुरक्षित:</strong> ब्रूबुक सभी कॉफी प्रेमियों के लिए एक सुरक्षित व स्वच्छ अनुभव प्रदान करता है।</li>
                  <li><strong>भुगतान एवं पास विवरण:</strong> 30 दिवसीय बरिस्ता पास और लीडरबोर्ड रैंकिंग प्रदान करने हेतु।</li>
                  <li><strong>कस्टम लिंक एवं फोटो:</strong> केवल $10+ और $50+ टियर के लिए वैकल्पिक सुविधा।</li>
                </ul>
              </section>

              <section className="space-y-2 bg-[#FFF6E9] p-4 rounded-2xl border border-[#C68642]/30">
                <h2 className="text-base font-bold text-[#3B2418]">3. शिकायत निवारण अधिकारी (Grievance Officer)</h2>
                <div className="mt-2 space-y-0.5 font-mono text-xs">
                  <div><strong>अधिकारी का नाम:</strong> यश कुमार (Yash Kumar)</div>
                  <div><strong>ईमेल:</strong> kmryash09@gmail.com</div>
                  <div><strong>समय सीमा:</strong> 24 घंटे में पावती · 30 दिनों में पूर्ण समाधान</div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* TERMS OF SERVICE */}
      {page === 'terms' && (
        <div className="bg-white rounded-3xl border border-[#C68642]/20 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black">Terms of Service</h1>
          <p className="text-xs text-stone-500 font-mono">Last updated: October 10, 2026</p>
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#3B2418]/90">
            <h2 className="font-bold text-base text-[#3B2418]">1. Acceptance of Terms</h2>
            <p>By accessing BrewBook, creating an account, or purchasing a 30-day Barista Pass, you agree to be bound by these Terms.</p>

            <h2 className="font-bold text-base text-[#3B2418]">2. Barista Membership Passes & Pricing Plans</h2>
            <p>BrewBook offers 3 membership tiers for unlimited access to all artisanal coffee recipes and step guides:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>1 Month Pass:</strong> $5 for 1 month (30 days access).</li>
              <li><strong>6 Months Pass:</strong> $30 regular value in special offer for $25 (180 days access, save $5).</li>
              <li><strong>12 Months Pass:</strong> $60 regular value in special offer for $30 (365 days access, 50% OFF).</li>
            </ul>

            <h2 className="font-bold text-base text-[#3B2418]">3. Content Standards</h2>
            <p>Account names and community ratings must strictly follow our Community Guidelines. Spam and abusive behavior result in immediate account termination.</p>
          </div>
        </div>
      )}

      {/* REFUND POLICY */}
      {page === 'refund-policy' && (
        <div className="bg-white rounded-3xl border border-[#C68642]/20 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C68642]/20 text-[#3B2418] text-xs font-bold uppercase tracking-wider font-mono">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pass Terms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Refund Policy</h1>
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#3B2418]/90">
            <p>Because the Barista Pass provides immediate, unhindered digital access to our complete recipe collection and brewing steps, passes are <strong>non-refundable once activated</strong>.</p>
            <p>If you experience duplicate billing or technical errors during checkout via Stripe or Razorpay, please contact support within 48 hours for immediate transaction verification and reconciliation.</p>
          </div>
        </div>
      )}

      {/* SUPPORT */}
      {page === 'support' && (
        <div className="bg-white rounded-3xl border border-[#C68642]/20 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black">BrewBook Support & Assistance</h1>
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#3B2418]/90">
            <p>We're here to help you dial in the perfect cup or answer questions about membership passes.</p>
            <div className="bg-[#FFF6E9] p-4 rounded-2xl border border-[#C68642]/30 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Mail className="w-4 h-4 text-[#E8590C]" />
                <span>Contact Email: kmryash09@gmail.com</span>
              </div>
              <p className="text-xs text-[#3B2418]/70">
                Support inquiries are typically answered within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* COMMUNITY GUIDELINES */}
      {page === 'community-guidelines' && (
        <div className="bg-white rounded-3xl border border-[#C68642]/20 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F2B84B] text-[#3B2418] text-xs font-bold uppercase tracking-wider font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Safety First</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Community Guidelines</h1>
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#3B2418]/90">
            <h2 className="font-bold text-base text-[#3B2418]">1. Respect & Clean Discourse</h2>
            <p>Display names and public links must remain friendly, respectful, and family-appropriate. Harassment, profanity, and offensive language will be purged.</p>

            <h2 className="font-bold text-base text-[#3B2418]">2. Link Safety Rules</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Link Titles must be max 20 characters in plain text. Domain names or URLs as titles are rejected.</li>
              <li>Only secure <code>https://</code> links are allowed. JavaScript schemes, IP addresses, and data URLs are blocked.</li>
              <li>Every link is screened against Google Safe Browsing. Phishing or malware links result in permanent ban.</li>
            </ul>

            <h2 className="font-bold text-base text-[#3B2418]">3. Reporting & 24-Hour Takedown</h2>
            <p>Every public name, link, and photo has an active report button. Our moderation team reviews all flagged items with a target takedown time within 24 hours.</p>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT (Public Route) */}
      {page === 'delete-account' && (
        <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-rose-900">Delete Account & Erase Data</h1>

          {deleteDone ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-medium">
              Your account and personal data have been completely erased from BrewBook.
            </div>
          ) : currentUser ? (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <p>Under the DPDP Act 2023, you have the absolute right to have your data permanently deleted.</p>
              <div className="bg-rose-50 p-4 rounded-2xl text-rose-900 text-xs space-y-1">
                <div>• Your user profile and authentication credentials will be erased.</div>
                <div>• Your membership pass records and brew preferences will be removed immediately.</div>
                <div>• Your device push notification token will be deleted.</div>
                <div>• Legally mandated payment receipts are retained solely for tax compliance.</div>
              </div>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Proceed with Permanent Account Deletion
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="bg-rose-700 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    Confirm & Delete Right Now
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-stone-600">
              Please log in to your account first to verify identity and initiate account deletion.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
