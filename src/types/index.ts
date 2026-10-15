export type BrewMethod = 'espresso machine' | 'French press' | 'AeroPress' | 'moka pot' | 'V60';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export interface Recipe {
  id: string;
  title: string;
  coffeeType: string;
  method: BrewMethod;
  difficulty: Difficulty;
  prepTimeMins: number;
  ingredients: string[];
  steps: string[];
  servings: number;
  tasteProfile: string;
  isFree: boolean;
  image?: string;
  rating?: number;
  ratingCount?: number;
  userRating?: number;
  isCustom?: boolean;
  createdAt?: string;
  createdBy?: string;
}

export type PerkTier = 'barista' | 'head_barista' | 'master_barista';

export interface UserConsents {
  accountService: boolean; // required (1)
  leaderboardDisplay: boolean; // optional (2)
  marketingEmails: boolean; // optional (3)
  pushNotifications: boolean; // optional (4)
  analytics: boolean; // optional (5)
  updatedAt: string;
  version: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarId?: string;
  isAdult?: boolean;
  isPremium: boolean;
  tier?: PerkTier;
  amountPaid?: number;
  passExpiresAt?: string;
  role: 'user' | 'owner' | 'admin';
  country?: string;
  phoneNumber?: string;
  fcmToken?: string;
  consents: UserConsents;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  amount: number;
  tier: PerkTier;
  avatarId?: string;
  linkTitle?: string;
  linkUrl?: string;
  avatarUrl?: string;
  showOnLeaderboard: boolean;
  paidAt: string;
  expiresAt: string;
  hidden?: boolean;
}

export interface FilterState {
  coffeeTypes: string[];
  methods: BrewMethod[];
  difficulties: Difficulty[];
  maxPrepTime: number;
  includeIngredients: string[];
  excludeIngredients: string[];
  searchQuery: string;
  minRating: number;
}

export interface PaymentIntent {
  id: string;
  amountUsd: number;
  amountInr: number;
  currency: 'USD' | 'INR';
  provider: 'stripe' | 'razorpay';
  clientSecret?: string;
  orderId?: string;
}

export interface PaymentProvider {
  name: string;
  currency: 'USD' | 'INR';
  createOrder(amountUsd: number, metadata: Record<string, any>): Promise<PaymentIntent>;
  confirmPayment(orderId: string, paymentDetails: any): Promise<{ success: boolean; transactionId: string }>;
}

export interface ContentReport {
  id: string;
  targetType: 'name' | 'link' | 'photo';
  targetUserId: string;
  targetContent: string;
  reason: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  link?: string;
  audience: 'all' | 'premium' | 'free';
  sentCount: number;
  failedCount: number;
  sentBy: string;
  sentAt: string;
}
