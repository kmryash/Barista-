# ☕ BrewBook — Specialty Coffee Recipes & "Be the Favorite Barista"

BrewBook is a responsive, PWA-ready coffee brewing recipe guide and competitive barista micro-economy. Users can master world-class recipes, filter by method, prep time, difficulty, or dietary constraints, and climb the "Favorite Barista" Hall of Fame.

---

## 🌟 Key Features
- **25 Seeded Coffee Recipes**: 5 Free, 20 Premium recipes covering Espresso machine, French press, AeroPress, Moka pot, and V60.
- **Advanced Real-Time Filtering**:
  - Coffee type (Single Origin, Blend, Cold Brew, Latte, Pour-Over, etc.)
  - Brew method multi-select
  - Difficulty tier
  - Prep-time slider (1 to 20+ mins)
  - Ingredient Include / Exclude logic (e.g. "exclude dairy", "include oat milk")
  - Live text search, active chip pills with clear-all, and URL query parameter persistence.
- **"Be the Favorite Barista" Bidding Game**:
  - 30-Day Barista Pass with minimum $2 bid.
  - Perk progression:
    - **$2+ Barista**: Public name & amount on leaderboard.
    - **$10+ Head Barista**: Custom Link with 20-char max plain title and validated HTTPS URL (anti-phishing & safe browsing guarded).
    - **$50+ Master Barista**: Custom avatar photo badge (stripped of EXIF, moderated).
  - Outbid real-time alerts & "Top up to climb" difference payment.
  - Header Spotlight rotating Top 3 Baristas with crowns.
  - Podium Leaderboard (Gold, Silver, Bronze) + Infinite list.
- **Multi-Rail Payments via `PaymentProvider` Interface**:
  - Auto-detection of country (India vs Global).
  - UPI, RuPay cards, Netbanking via Razorpay charged in INR (Default $1 = ₹90 conversion rate).
  - Stripe Checkout in USD for international users.
  - Manual switcher "Pay with UPI (India) / Pay with Card (USD)".
- **FCM Push Notification Broadcasting**:
  - Soft opt-in permission prompt (never triggers unprompted).
  - Owner-only broadcast console (`/admin/notifications`) with preview, target audience selection, rate-limiting (max 5/day), and multicast batching.
- **DPDP Act 2023 & Privacy Architecture**:
  - Granular, unticked consent options at sign-up.
  - Right to Access (Download JSON), Right to Correction, Right to Erasure (One-click complete wipe), Right to Nominate.
  - Bilingual Privacy Policy (English and Hindi).
  - Appointed Grievance Officer with 24h response SLA.
- **Rock-Solid Security**:
  - ABAC Firestore Security Rules preventing client-side privilege escalation.
  - Age-gating (18+ only enforced).

---

## 🚀 Setup & Local Development

### 1. Prerequisites
- Node.js 20+
- Firebase Project configured (Firestore, Auth, Storage, FCM)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the client-side Firebase keys and payment gateway test keys.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👑 Owner Role Setup (Admin SDK)
To grant a user the `owner` role for broadcasting push notifications and accessing `/admin/notifications`:

1. Using Firebase Admin SDK in a Node script:
```typescript
import * as admin from 'firebase-admin';

admin.initializeApp();

async function setOwnerRole(email: string) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role: 'owner' });
  console.log(`Successfully assigned role 'owner' to ${email} (UID: ${user.uid})`);
}

setOwnerRole('kmryash09@gmail.com');
```
2. The user will automatically have access to owner features.

---

## 📋 Pre-Launch Checklist

- [ ] **Firestore Rules**: Deployed and audited via `DeployRules`.
- [ ] **Payment Webhooks**: Configured endpoints for Stripe (`/api/webhooks/stripe`) and Razorpay (`/api/webhooks/razorpay`) with secret validation.
- [ ] **DPDP Consent Records**: Verify consent storage works on every registration.
- [ ] **Content Safety**: Test URL rejection for raw IP addresses, javascript: schemes, and domain-like titles.
- [ ] **Image Moderation**: Verify photo size limit (2MB) and MIME type checks (JPG, PNG, WebP).
- [ ] **PWA Audit**: Ensure `manifest.json` and service worker are registered for offline resilience.
- [ ] **Rate Limiting**: Confirm max 5 owner broadcasts per 24 hours.
