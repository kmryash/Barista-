import React, { useState } from 'react';
import { X, Shield, Download, Trash2, UserCheck, AlertTriangle, Check, Bell, FileText, Send, Sparkles, Phone, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateDisplayName } from '../utils/safety';
import { doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ANIMAL_AVATARS, getAnimalById } from '../data/animals';
import { AnimalAvatarBadge } from './AnimalAvatarBadge';
import { COUNTRIES } from '../data/countries';

interface SettingsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const SettingsPrivacyModal: React.FC<SettingsPrivacyModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyPolicy,
}) => {
  const {
    currentUser,
    userProfile,
    updateConsents,
    updateProfileDetails,
    updateAvatar,
    deleteAccountAndData,
    exportUserDataJson,
    logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'consents' | 'profile' | 'rights' | 'grievance'>('consents');
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [country, setCountry] = useState(userProfile?.country || 'India');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');

  // Grievance form
  const [grievanceSubject, setGrievanceSubject] = useState('');
  const [grievanceDetails, setGrievanceDetails] = useState('');
  const [grievanceSent, setGrievanceSent] = useState(false);

  // Nominee form
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeSaved, setNomineeSaved] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !userProfile) return null;

  const handleConsentToggle = async (key: keyof typeof userProfile.consents, val: boolean) => {
    try {
      await updateConsents({ [key]: val });
      setStatusMsg(`Updated consent for ${key}.`);
      setTimeout(() => setStatusMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || 'Failed to update consent.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const valid = validateDisplayName(displayName);
    if (!valid.valid) {
      setError(valid.error || 'Invalid display name');
      return;
    }

    try {
      await updateProfileDetails(displayName, country, phoneNumber);
      setStatusMsg('Profile details successfully updated.');
      setTimeout(() => setStatusMsg(null), 2000);
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile.');
    }
  };

  const handleDownloadData = async () => {
    try {
      const json = await exportUserDataJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brewbook-data-${userProfile.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg('Data downloaded successfully.');
    } catch (e: any) {
      setError('Could not export data.');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountAndData();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete account. Please re-login and try again.');
      setIsDeleting(false);
    }
  };

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject.trim() || !grievanceDetails.trim()) return;

    try {
      await addDoc(collection(db, 'grievances'), {
        userId: userProfile.id,
        userEmail: userProfile.email,
        subject: grievanceSubject.trim(),
        details: grievanceDetails.trim(),
        status: 'received',
        createdAt: new Date().toISOString(),
        acknowledgedWithin24h: true
      });
      setGrievanceSent(true);
    } catch (e: any) {
      setError('Could not log grievance.');
    }
  };

  const handleSaveNominee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeName || !nomineeEmail) return;
    setNomineeSaved(true);
    setStatusMsg('Nominee details recorded under DPDP Act §14.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-xl w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col text-[#3B2418]">
        {/* Header */}
        <div className="bg-[#3B2418] text-[#FFF6E9] p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-[#F2B84B]" />
            <h2 className="text-xl font-black">Account, Privacy & DPDP Rights</h2>
          </div>
          <p className="text-xs text-[#FFF6E9]/80">
            Digital Personal Data Protection Act, 2023 Privacy Dashboard
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mt-4 text-xs font-semibold">
            {[
              { id: 'consents', label: 'Consents & Privacy' },
              { id: 'profile', label: 'Edit Profile' },
              { id: 'rights', label: 'DPDP Rights & Nominee' },
              { id: 'grievance', label: 'Grievance Officer' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setError(null); }}
                className={`py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === tab.id ? 'bg-[#F2B84B] text-[#3B2418] font-bold' : 'bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {statusMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl font-medium">
              {statusMsg}
            </div>
          )}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* TAB 1: Granular Consents */}
          {activeTab === 'consents' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#3B2418] mb-1">
                  Manage or Withdraw Consents
                </h3>
                <p className="text-[11px] text-[#3B2418]/70">
                  Under the DPDP Act 2023 §6(4), you may withdraw any optional consent at any time as easily as it was given.
                </p>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#C68642]/20">
                {/* 1. Account Service */}
                <div className="flex items-center justify-between py-2 border-b border-[#C68642]/10">
                  <div>
                    <div className="font-bold text-[#3B2418]">Account & Service Data (Required)</div>
                    <div className="text-[10px] text-stone-500">Essential for authentication, pass validity, and security.</div>
                  </div>
                  <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded">Required</span>
                </div>

                {/* 2. Marketing & Offers */}
                <div className="flex items-center justify-between py-2 border-b border-[#C68642]/10">
                  <div>
                    <div className="font-bold text-[#3B2418]">Special Offers & Coffee Updates</div>
                    <div className="text-[10px] text-stone-500">Receive alerts when new recipes or discounted pass offers are released.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.consents.marketingEmails}
                    onChange={(e) => handleConsentToggle('marketingEmails', e.target.checked)}
                    className="w-4 h-4 accent-[#E8590C] cursor-pointer"
                  />
                </div>

                {/* 4. Push Notifications */}
                <div className="flex items-center justify-between py-2 border-b border-[#C68642]/10">
                  <div>
                    <div className="font-bold text-[#3B2418]">Web Push Notifications</div>
                    <div className="text-[10px] text-stone-500">Turning OFF deletes your device FCM push token immediately.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.consents.pushNotifications}
                    onChange={(e) => handleConsentToggle('pushNotifications', e.target.checked)}
                    className="w-4 h-4 accent-[#E8590C] cursor-pointer"
                  />
                </div>

                {/* 5. Analytics */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-bold text-[#3B2418]">Anonymous Analytics</div>
                    <div className="text-[10px] text-stone-500">Aggregated usage metrics to improve recipe recommendations.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.consents.analytics}
                    onChange={(e) => handleConsentToggle('analytics', e.target.checked)}
                    className="w-4 h-4 accent-[#E8590C] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Edit Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#3B2418] mb-1">
                  Correct Your Personal Data
                </h3>
                <p className="text-[11px] text-[#3B2418]/70">
                  Right to Correction under DPDP Act 2023 §12.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#C68642]/20 space-y-4">
                {/* 25 Animal Avatar Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#3B2418] flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" />
                      <span>Barista Animal Avatar (25 Available)</span>
                    </label>
                    {userProfile.avatarId && (
                      <span className="text-[10px] font-bold text-[#E8590C] bg-[#E8590C]/10 px-2 py-0.5 rounded-full">
                        {getAnimalById(userProfile.avatarId)?.name} · {getAnimalById(userProfile.avatarId)?.coffeePersona}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto p-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/20 scrollbar-thin">
                    {ANIMAL_AVATARS.map((animal) => {
                      const isSelected = userProfile.avatarId === animal.id;
                      return (
                        <button
                          key={animal.id}
                          type="button"
                          onClick={async () => {
                            try {
                              await updateAvatar(animal.id);
                              setStatusMsg(`Avatar updated to ${animal.name}!`);
                              setTimeout(() => setStatusMsg(null), 2000);
                            } catch (err: any) {
                              setError('Failed to update avatar.');
                            }
                          }}
                          title={`${animal.name} · ${animal.coffeePersona}`}
                          className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white ring-2 ring-[#3B2418] shadow-xs scale-105'
                              : 'bg-white/60 hover:bg-white hover:scale-105'
                          }`}
                        >
                          <AnimalAvatarBadge avatarId={animal.id} size="sm" showBorder={false} />
                          <span className="text-[9px] font-bold text-[#3B2418] truncate w-full text-center">
                            {animal.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3B2418] mb-1">
                    Display Name (Max 30 chars):
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 focus:border-[#C68642] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3B2418] mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#C68642]" />
                    Country:
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 focus:border-[#C68642] text-xs text-[#3B2418] cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3B2418] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C68642]" />
                    Mobile Number:
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 focus:border-[#C68642] text-xs text-[#3B2418]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#3B2418] hover:bg-[#3B2418]/90 text-[#FFF6E9] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DPDP Rights & Nominee */}
          {activeTab === 'rights' && (
            <div className="space-y-6">
              {/* Right to Access & Download */}
              <div className="bg-white p-4 rounded-2xl border border-[#C68642]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#3B2418]">
                    Right to Access & Data Portability
                  </div>
                  <button
                    onClick={handleDownloadData}
                    className="flex items-center gap-1.5 bg-[#3B2418] text-[#FFF6E9] px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#C68642] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F2B84B]" />
                    <span>Download JSON</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#3B2418]/70">
                  Export an immutable JSON copy of all personal records, consent history, and public entries associated with your account.
                </p>
              </div>

              {/* Right to Nominate */}
              <div className="bg-white p-4 rounded-2xl border border-[#C68642]/20 space-y-3">
                <div className="font-bold text-[#3B2418] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C68642]" />
                  <span>Right to Nominate (DPDP Act §14)</span>
                </div>
                <p className="text-[11px] text-[#3B2418]/70">
                  Nominate a representative who may exercise your data rights in the event of death or incapacity.
                </p>

                {nomineeSaved ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-medium">
                    Nominee registered: {nomineeName} ({nomineeEmail})
                  </div>
                ) : (
                  <form onSubmit={handleSaveNominee} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nominee Full Name"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 text-xs"
                    />
                    <input
                      type="email"
                      placeholder="Nominee Email"
                      value={nomineeEmail}
                      onChange={(e) => setNomineeEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 text-xs"
                    />
                    <button
                      type="submit"
                      className="bg-[#C68642] text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-[#b07436] transition-colors"
                    >
                      Record Nominee
                    </button>
                  </form>
                )}
              </div>

              {/* Right to Erasure */}
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Right to Erasure & Account Deletion (DPDP Act §12)</span>
                </div>
                <p className="text-[11px] text-rose-800">
                  Permanently deletes your profile, pass membership, and push tokens. Note: Legally mandated tax/payment records are archived for statutory compliance.
                </p>

                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Delete My Account & All Data
                  </button>
                ) : (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-rose-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer"
                    >
                      {isDeleting ? 'Erasing Data...' : 'Confirm Permanent Deletion'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-2 text-stone-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Grievance Redressal */}
          {activeTab === 'grievance' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#3B2418] mb-1">
                  Data Protection & Grievance Officer
                </h3>
                <p className="text-[11px] text-[#3B2418]/70">
                  In accordance with the DPDP Act 2023 §13, you have the right to readily available grievance redressal.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#C68642]/20 text-xs space-y-1.5">
                <div><strong>Appointed Officer:</strong> Yash Kumar</div>
                <div><strong>Designation:</strong> Data Protection & Grievance Officer</div>
                <div><strong>Email:</strong> kmryash09@gmail.com</div>
                <div><strong>Service Level Agreement (SLA):</strong> Acknowledged within 24 hours · Resolved within 30 days</div>
              </div>

              {grievanceSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-medium">
                  Your grievance ticket has been filed and dispatched to the Grievance Officer. An acknowledgment receipt has been logged.
                </div>
              ) : (
                <form onSubmit={handleSubmitGrievance} className="bg-white p-4 rounded-2xl border border-[#C68642]/20 space-y-3">
                  <h4 className="font-bold text-[#3B2418]">File a Grievance Ticket:</h4>
                  <div>
                    <input
                      type="text"
                      placeholder="Subject (e.g. Consent withdrawal inquiry)"
                      value={grievanceSubject}
                      onChange={(e) => setGrievanceSubject(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 text-xs"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Detailed description of your privacy concern or data request..."
                      value={grievanceDetails}
                      onChange={(e) => setGrievanceDetails(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#FFF6E9]/40 rounded-xl border border-[#C68642]/30 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#E8590C] hover:bg-[#d04f0a] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Grievance</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#C68642]/20 flex items-center justify-between shrink-0">
          <button
            onClick={logout}
            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Log Out
          </button>
          <button
            onClick={onClose}
            className="bg-[#3B2418] text-[#FFF6E9] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#3B2418]/90 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
