import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, Eye, EyeOff, Sparkles, Check, Phone, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateDisplayName } from '../utils/safety';
import { ANIMAL_AVATARS, AnimalAvatar, getAnimalById } from '../data/animals';
import { AnimalAvatarBadge } from './AnimalAvatarBadge';
import { COUNTRIES, DEFAULT_COUNTRY, findCountryByCodeOrName } from '../data/countries';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyPolicy,
  onSuccess,
}) => {
  const { signUpWithEmail, loginWithEmail, loginWithGoogle, resetPassword, updateAvatar } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('lion');
  const [countryCode, setCountryCode] = useState('IN');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Consolidated "Accept Privacy Policy & Terms" check mark
  const [acceptPrivacyAndPolicy, setAcceptPrivacyAndPolicy] = useState(false);
  const [includeOptionalFeatures, setIncludeOptionalFeatures] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);

  // Granular optional flags
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const [pushOptIn, setPushOptIn] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCountry = findCountryByCodeOrName(countryCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (!acceptPrivacyAndPolicy) {
        setError('Please check "I accept the Privacy Policy & Terms of Service" to continue.');
        return;
      }
      const nameVal = validateDisplayName(displayName);
      if (!nameVal.valid) {
        setError(nameVal.error || 'Invalid display name');
        return;
      }

      const cleanPhone = mobileNumber.trim();
      const phoneDigits = cleanPhone.replace(/\D/g, '');
      if (!cleanPhone || phoneDigits.length < 7 || phoneDigits.length > 15) {
        setError('Please enter a valid mobile number (7 to 15 digits).');
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      const formattedPhone = `${selectedCountry.dialCode} ${cleanPhone.startsWith('+') ? cleanPhone.replace(selectedCountry.dialCode, '').trim() : cleanPhone}`;

      setLoading(true);
      try {
        await signUpWithEmail(
          email,
          password,
          displayName,
          {
            accountService: true,
            leaderboardDisplay: showCustomize ? leaderboardOptIn : includeOptionalFeatures,
            marketingEmails: showCustomize ? marketingOptIn : includeOptionalFeatures,
            pushNotifications: showCustomize ? pushOptIn : includeOptionalFeatures,
            analytics: true,
          },
          {
            country: selectedCountry.name,
            phoneNumber: formattedPhone,
            avatarId: selectedAvatarId,
          }
        );
        if (selectedAvatarId) {
          try {
            await updateAvatar(selectedAvatarId);
          } catch (err) {
            console.warn('Avatar update fallback:', err);
          }
        }
        onClose();
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setError(err?.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      setLoading(true);
      try {
        await loginWithEmail(email, password);
        onClose();
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setError(err?.message || 'Login failed.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      setLoading(true);
      try {
        await resetPassword(email);
        setSuccessMsg('If an account matches this email, password reset instructions have been sent.');
      } catch (err: any) {
        setError(err?.message || 'Password reset request failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Google authentication was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-md w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#3B2418] text-[#FFF6E9] p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-black">
            {mode === 'signup' && 'Create Your Barista Account'}
            {mode === 'login' && 'Welcome Back to BrewBook'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-[#FFF6E9]/80 mt-1">
            {mode === 'signup' && 'Open to all coffee lovers — explore recipes and master brewing.'}
            {mode === 'login' && 'Log in to view your recipes, rank, and perks.'}
            {mode === 'forgot' && 'Enter your email to receive a secure reset link.'}
          </p>

          {/* Tab Selector */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl bg-white/10 p-1 mt-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-[#F2B84B] text-[#3B2418]' : 'text-white/80 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mode === 'login' ? 'bg-[#F2B84B] text-[#3B2418]' : 'text-white/80 hover:text-white'
                }`}
              >
                Log In
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-[#3B2418]">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium">
              {successMsg}
            </div>
          )}

          {/* Display Name (Only on Signup) */}
          {mode === 'signup' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/80 mb-1 font-mono">
                  Barista Display Name (Max 30 chars)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C68642]" />
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Maya the Brewer"
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:border-[#C68642] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* 25 Animal Avatar Selector */}
              <div className="bg-white/80 p-3 rounded-2xl border border-[#C68642]/20">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#3B2418] font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" />
                    <span>Choose Animal Avatar (25 Animals)</span>
                  </label>
                  {getAnimalById(selectedAvatarId) && (
                    <span className="text-[10px] font-bold text-[#E8590C] bg-[#E8590C]/10 px-2 py-0.5 rounded-full">
                      {getAnimalById(selectedAvatarId)?.name} · {getAnimalById(selectedAvatarId)?.coffeePersona}
                    </span>
                  )}
                </div>

                {/* Horizontal scrollable or compact multi-row badges */}
                <div className="flex gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
                  {ANIMAL_AVATARS.map((animal) => {
                    const isSelected = selectedAvatarId === animal.id;
                    return (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(animal.id)}
                        title={`${animal.name} - ${animal.coffeePersona}`}
                        className={`relative shrink-0 p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B2418] text-white ring-2 ring-[#F2B84B] scale-105'
                            : 'bg-white hover:bg-[#FFF6E9] border border-[#C68642]/20'
                        }`}
                      >
                        <AnimalAvatarBadge avatarId={animal.id} size="sm" showBorder={false} />
                        <span className="text-[9px] font-bold max-w-[42px] truncate">
                          {animal.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Choose Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/80 mb-1 font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#C68642]" />
                    Choose Country
                  </span>
                  <span className="text-[10px] text-[#C68642] font-bold">
                    {selectedCountry.dialCode}
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:border-[#C68642] focus:outline-none text-xs text-[#3B2418] font-semibold appearance-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#C68642] text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/80 mb-1 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C68642]" />
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-[#3B2418]/5 border border-[#C68642]/30 rounded-xl text-xs font-bold text-[#3B2418] shrink-0">
                    <span className="text-sm">{selectedCountry.flag}</span>
                    <span>{selectedCountry.dialCode}</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder={selectedCountry.code === 'IN' ? '98765 43210' : 'Enter mobile number'}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:border-[#C68642] focus:outline-none text-xs text-[#3B2418] placeholder:text-stone-400"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#3B2418]/60 mt-1">
                  Required for barista identity verification and security alerts
                </p>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/80 mb-1 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C68642]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:border-[#C68642] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Password */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3B2418]/80 font-mono">
                  Password (Min 8 chars)
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#E8590C] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C68642]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:border-[#C68642] focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Unified "Accept Privacy & Policy" Checkmark (Sign-up only) */}
          {mode === 'signup' && (
            <div className="space-y-3 pt-2 border-t border-[#C68642]/15">
              {/* Primary Consolidated Checkmark */}
              <label className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#C68642]/30 hover:border-[#C68642] cursor-pointer transition-colors shadow-xs">
                <input
                  type="checkbox"
                  required
                  checked={acceptPrivacyAndPolicy}
                  onChange={(e) => setAcceptPrivacyAndPolicy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#E8590C] rounded cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#3B2418]">
                    I accept the Privacy Policy & Terms of Service
                  </span>
                  <p className="text-[11px] text-[#3B2418]/70 mt-0.5 leading-snug">
                    By checking this, you agree to our{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacyPolicy}
                      className="text-[#E8590C] font-semibold underline hover:text-[#d04f0a]"
                    >
                      Privacy Policy (DPDP Act)
                    </button>{' '}
                    and terms for account security and recipe service.
                  </p>
                </div>
              </label>

              {/* Optional: Include Leaderboard & Brew Updates */}
              {!showCustomize ? (
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 text-[11px] text-[#3B2418]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeOptionalFeatures}
                      onChange={(e) => setIncludeOptionalFeatures(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#E8590C]"
                    />
                    <span>Opt-in to new recipe notifications and brewing alerts</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowCustomize(true)}
                    className="text-[11px] text-[#E8590C] hover:underline font-semibold"
                  >
                    Customize
                  </button>
                </div>
              ) : (
                <div className="bg-[#FFF6E9]/60 p-3 rounded-xl border border-[#C68642]/20 space-y-2 text-[11px]">
                  <div className="font-bold text-[#3B2418] flex items-center justify-between">
                    <span>Granular Preferences:</span>
                    <button
                      type="button"
                      onClick={() => setShowCustomize(false)}
                      className="text-[#E8590C] text-[10px] font-semibold hover:underline"
                    >
                      Done
                    </button>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushOptIn}
                      onChange={(e) => setPushOptIn(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#E8590C]"
                    />
                    <span>Web push notifications for new recipes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingOptIn}
                      onChange={(e) => setMarketingOptIn(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#E8590C]"
                    />
                    <span>Special membership offers & coffee email tips</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8590C] hover:bg-[#d04f0a] disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'login' && 'Log In to BrewBook'}
                  {mode === 'forgot' && 'Send Password Reset Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Google Sign In Option */}
          {mode !== 'forgot' && (
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-[#C68642]/20"></div>
                <span className="shrink mx-2 text-[10px] text-[#3B2418]/50 uppercase font-mono">or</span>
                <div className="grow border-t border-[#C68642]/20"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-stone-50 border border-[#C68642]/30 text-[#3B2418] font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-[#E8590C] hover:underline mt-2"
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
