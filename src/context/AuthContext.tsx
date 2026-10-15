import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserConsents, PerkTier } from '../types';
import { getTierForAmount } from '../services/payment';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
    consents: {
      accountService: boolean;
      leaderboardDisplay: boolean;
      marketingEmails: boolean;
      pushNotifications: boolean;
      analytics: boolean;
    },
    extra?: {
      country?: string;
      phoneNumber?: string;
      avatarId?: string;
    }
  ) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateConsents: (consents: Partial<UserConsents>) => Promise<void>;
  updateProfileDetails: (displayName: string, country?: string, phoneNumber?: string) => Promise<void>;
  updateAvatar: (avatarId: string) => Promise<void>;
  updatePublicBaristaProfile: (data: { linkTitle?: string; linkUrl?: string; avatarUrl?: string; showOnLeaderboard?: boolean }) => Promise<void>;
  applyPremiumPass: (totalPaidUsd: number, durationDays?: number, tier?: PerkTier) => Promise<void>;
  deleteAccountAndData: () => Promise<void>;
  exportUserDataJson: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OWNER_EMAILS = ['kmryash09@gmail.com', 'kmryashsingh09@gmail.com'];
const isOwnerEmail = (email?: string | null) => {
  if (!email) return false;
  return OWNER_EMAILS.some(e => e.toLowerCase() === email.trim().toLowerCase());
};
const CONSENT_VERSION = '2026.1-DPDP';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (!fbUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // Realtime listener on user profile
      const userDocRef = doc(db, 'users', fbUser.uid);
      const unsubscribeDoc = onSnapshot(userDocRef, async (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          // Check pass expiration (30 days)
          let isStillPremium = data.isPremium;
          if (data.passExpiresAt && new Date(data.passExpiresAt).getTime() < Date.now()) {
            isStillPremium = false;
          }
          setUserProfile({
            ...data,
            isPremium: isStillPremium
          });
        } else {
          // If profile doc doesn't exist yet (e.g. Google Sign-In first time)
          const isOwnerUser = isOwnerEmail(fbUser.email);
          const defaultProfile: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || '',
            displayName: (fbUser.displayName || 'Barista Explorer').trim().substring(0, 30),
            country: 'India',
            phoneNumber: '',
            avatarId: 'lion',
            isAdult: true, // will be confirmed in modal if newly joined
            isPremium: false,
            role: isOwnerUser ? 'owner' : 'user',
            consents: {
              accountService: true,
              leaderboardDisplay: false,
              marketingEmails: false,
              pushNotifications: false,
              analytics: false,
              updatedAt: new Date().toISOString(),
              version: CONSENT_VERSION,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          try {
            await setDoc(userDocRef, defaultProfile, { merge: true });
            setUserProfile(defaultProfile);
          } catch (err) {
            console.warn('Could not auto-create profile doc:', err);
            setUserProfile(defaultProfile);
          }
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching user profile snapshot:', error);
        setLoading(false);
      });

      return () => {
        unsubscribeDoc();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    consents: {
      accountService: boolean;
      leaderboardDisplay: boolean;
      marketingEmails: boolean;
      pushNotifications: boolean;
      analytics: boolean;
    },
    extra?: {
      country?: string;
      phoneNumber?: string;
      avatarId?: string;
    }
  ) => {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    if (!consents.accountService) {
      throw new Error('Please accept the Privacy Policy and Terms of Service to continue.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateFirebaseProfile(user, { displayName });

      const isOwnerUser = isOwnerEmail(email);
      const profile: UserProfile = {
        id: user.uid,
        email,
        displayName: displayName.trim().substring(0, 30),
        country: extra?.country || 'India',
        phoneNumber: extra?.phoneNumber || '',
        avatarId: extra?.avatarId || 'lion',
        isAdult: true,
        isPremium: false,
        role: isOwnerUser ? 'owner' : 'user',
        consents: {
          accountService: true,
          leaderboardDisplay: consents.leaderboardDisplay,
          marketingEmails: consents.marketingEmails,
          pushNotifications: consents.pushNotifications,
          analytics: consents.analytics,
          updatedAt: new Date().toISOString(),
          version: CONSENT_VERSION,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userDocRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userDocRef, profile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      }
      setUserProfile(profile);
    } catch (error: any) {
      // Generic auth errors to prevent user enumeration
      if (error?.code === 'auth/email-already-in-use') {
        throw new Error('Unable to create account. Please check your credentials or try logging in.');
      }
      if (error?.code === 'auth/weak-password') {
        throw new Error('Password must be at least 8 characters with sufficient strength.');
      }
      throw new Error(error?.message || 'Failed to sign up. Please try again.');
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Prevent user enumeration by standardizing invalid credential errors
      if (
        error?.code === 'auth/user-not-found' ||
        error?.code === 'auth/wrong-password' ||
        error?.code === 'auth/invalid-credential'
      ) {
        throw new Error('Invalid email or password combination.');
      }
      throw new Error(error?.message || 'Login failed. Please verify your credentials.');
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      throw new Error(error?.message || 'Google sign-in was cancelled or failed.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      // Do not reveal if email exists or not
      throw new Error('If an account exists for this email, password reset instructions have been sent.');
    }
  };

  const updateConsents = async (newConsents: Partial<UserConsents>) => {
    if (!currentUser || !userProfile) throw new Error('Not logged in');
    const updated: UserConsents = {
      ...userProfile.consents,
      ...newConsents,
      updatedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await setDoc(userDocRef, {
        consents: updated,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, consents: updated } : null);

      // If push notifications disabled, clear token
      if (newConsents.pushNotifications === false) {
        await setDoc(userDocRef, { fcmToken: null }, { merge: true });
      }

      // If leaderboard display toggled, sync with leaderboard collection
      if (newConsents.leaderboardDisplay !== undefined) {
        const lbRef = doc(db, 'leaderboard', currentUser.uid);
        const lbSnap = await getDoc(lbRef);
        if (lbSnap.exists()) {
          await setDoc(lbRef, { showOnLeaderboard: newConsents.leaderboardDisplay }, { merge: true });
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const updateProfileDetails = async (displayName: string, country?: string, phoneNumber?: string) => {
    if (!currentUser) throw new Error('Not logged in');
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updates: any = {
      displayName: displayName.trim().substring(0, 30),
      updatedAt: new Date().toISOString()
    };
    if (country !== undefined) updates.country = country;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;

    try {
      await setDoc(userDocRef, updates, { merge: true });
      await updateFirebaseProfile(currentUser, { displayName: updates.displayName });
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);

      // Sync display name with leaderboard if active
      const lbRef = doc(db, 'leaderboard', currentUser.uid);
      const lbSnap = await getDoc(lbRef);
      if (lbSnap.exists()) {
        await setDoc(lbRef, { displayName: updates.displayName }, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const updateAvatar = async (avatarId: string) => {
    if (!currentUser) throw new Error('Not logged in');
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updates = {
      avatarId,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(userDocRef, updates, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);

      // Sync avatar with leaderboard entry if exists
      const lbRef = doc(db, 'leaderboard', currentUser.uid);
      const lbSnap = await getDoc(lbRef);
      if (lbSnap.exists()) {
        await setDoc(lbRef, { avatarId }, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const updatePublicBaristaProfile = async (data: {
    linkTitle?: string;
    linkUrl?: string;
    avatarUrl?: string;
    showOnLeaderboard?: boolean;
  }) => {
    if (!currentUser || !userProfile) throw new Error('Not logged in');
    const lbRef = doc(db, 'leaderboard', currentUser.uid);

    try {
      await setDoc(lbRef, data, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `leaderboard/${currentUser.uid}`);
    }
  };

  const applyPremiumPass = async (
    totalPaidUsd: number,
    durationDays: number = 30,
    tier: PerkTier = 'barista'
  ) => {
    if (!currentUser || !userProfile) throw new Error('Not logged in');

    // Calculate pass expiration date based on plan duration
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const paidAt = new Date().toISOString();

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userUpdates = {
      isPremium: true,
      tier,
      amountPaid: totalPaidUsd,
      passExpiresAt: expiresAt,
      updatedAt: paidAt
    };

    try {
      await setDoc(userDocRef, userUpdates, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...userUpdates } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
    }
  };

  const deleteAccountAndData = async () => {
    if (!currentUser) throw new Error('Not logged in');
    const uid = currentUser.uid;

    try {
      // 1. Delete user profile
      await deleteDoc(doc(db, 'users', uid));
      // 2. Delete public leaderboard entry
      await deleteDoc(doc(db, 'leaderboard', uid));
      // 3. Delete firebase auth user
      await currentUser.delete();
      setUserProfile(null);
      setCurrentUser(null);
    } catch (err) {
      console.error('Account deletion error:', err);
      throw new Error('Account deletion failed. Please re-authenticate and try again.');
    }
  };

  const exportUserDataJson = async (): Promise<string> => {
    if (!currentUser || !userProfile) throw new Error('Not logged in');
    const lbRef = doc(db, 'leaderboard', currentUser.uid);
    let lbData = null;
    try {
      const snap = await getDoc(lbRef);
      if (snap.exists()) lbData = snap.data();
    } catch {
      // ignore
    }

    const exportBundle = {
      userProfile: {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.displayName,
        avatarId: userProfile.avatarId || null,
        isAdult: userProfile.isAdult,
        isPremium: userProfile.isPremium,
        tier: userProfile.tier || 'free',
        amountPaid: userProfile.amountPaid || 0,
        passExpiresAt: userProfile.passExpiresAt || null,
        country: userProfile.country || null,
        phoneNumber: userProfile.phoneNumber || null,
        role: userProfile.role,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      },
      consentHistory: userProfile.consents,
      publicLeaderboardRecord: lbData,
      exportTimestamp: new Date().toISOString(),
      statutoryNotice: 'Generated under Digital Personal Data Protection (DPDP) Act, 2023 §11 Right to Access'
    };

    return JSON.stringify(exportBundle, null, 2);
  };

  const isOwner = userProfile?.role === 'owner' || isOwnerEmail(currentUser?.email);
  const isAdmin = isOwner || userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isOwner,
        isAdmin,
        signUpWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        updateConsents,
        updateProfileDetails,
        updateAvatar,
        updatePublicBaristaProfile,
        applyPremiumPass,
        deleteAccountAndData,
        exportUserDataJson
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
