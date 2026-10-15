import React, { useState, useEffect } from 'react';
import { Bell, X, Coffee, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SoftPushPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoftPushPrompt: React.FC<SoftPushPromptProps> = ({ isOpen, onClose }) => {
  const { currentUser, userProfile, updateConsents } = useAuth();
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIosDevice);
    setIsStandalone(isInStandalone);
  }, []);

  if (!isOpen) return null;

  const handleAllow = async () => {
    setStatusMsg(null);

    if (!('Notification' in window)) {
      setStatusMsg('Notifications are not supported by your current browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Register token mock/client
        const mockFcmToken = `fcm_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, { fcmToken: mockFcmToken });
          await updateConsents({ pushNotifications: true });
        }

        setStatusMsg('Brew alerts activated! You will receive updates on new recipes and bids.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatusMsg('Notification permission was declined. You can enable it in browser settings anytime.');
        if (currentUser) {
          await updateConsents({ pushNotifications: false });
        }
      }
    } catch (e: any) {
      setStatusMsg(e?.message || 'Could not request notification permission.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-sm w-full border border-[#C68642]/30 shadow-2xl p-6 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#3B2418] text-[#F2B84B] flex items-center justify-center mx-auto mb-3 shadow-md">
          <Bell className="w-6 h-6 animate-swing" />
        </div>

        <h3 className="text-lg font-bold text-[#3B2418]">
          Get new brew alerts? ☕
        </h3>
        <p className="text-xs text-[#3B2418]/70 mt-1 mb-4 leading-relaxed">
          Be notified when a new coffee recipe drops, when seasonal blends arrive, or when someone bids on the barista crown.
        </p>

        {/* iOS Web Push Notice */}
        {isIOS && !isStandalone && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px] text-left mb-4 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">iOS Safari Hint:</span> Apple requires adding this web app to your Home Screen to receive web push. Tap Share ⎋ and choose <strong>"Add to Home Screen"</strong>.
            </div>
          </div>
        )}

        {statusMsg ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium mb-3">
            {statusMsg}
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-[#3B2418]/80 hover:bg-[#C68642]/10 transition-colors cursor-pointer"
          >
            Not now
          </button>
          <button
            onClick={handleAllow}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#E8590C] hover:bg-[#d04f0a] text-white shadow-md transition-all cursor-pointer"
          >
            Allow Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
