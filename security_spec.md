# BrewBook Security Specification & Rules Hardening

## 1. Data Invariants
- Users can ONLY read and write their own `/users/{userId}` record.
- Users CANNOT self-elevate permissions, update `isPremium`, change `role`, `tier`, or `amountPaid` directly from client-side Firestore. These require server-side verification / webhook processing.
- `/recipes/{recipeId}`: Public / free users can only read recipes where `resource.data.isFree == true`. Premium users with an active pass can read all recipes.
- Leaderboard entries in `/leaderboard/{userId}`: Opted-in entries (`showOnLeaderboard == true` and `hidden == false`) are publicly readable. A user may only edit their own link/avatar if their server-confirmed tier permits it.
- Broadcast audit logs (`/broadcasts/{id}`) can only be read and created by users with role `owner` or `admin`.
- Reports (`/reports/{id}`) can be created by authenticated users, but only read or managed by admins/owners.
- Admin bootstrap: Users with email `kmryash09@gmail.com` or presence in `/admins/{uid}` are treated as owner/admin.

## 2. The Dirty Dozen Malicious Payloads
1. **Privilege Escalation**: User tries to write `{ role: 'owner', isPremium: true }` to their `/users/{userId}`.
2. **Free User Scraping Premium Recipes**: Unauthenticated or free user attempts `get` or `list` on a premium recipe with `isFree == false`.
3. **Cross-User Profile Hijack**: User A writes to `/users/{userB}`.
4. **Link Injection in Tier $2**: A user with tier `barista` attempts to add `linkTitle` and `linkUrl` to their `/leaderboard/{userId}`.
5. **Photo Injection in Tier $10**: A user with tier `head_barista` attempts to set `avatarUrl` without $50+ tier.
6. **URL Title Spoofing**: Attempting to set `linkTitle` to `https://evil.com` or `www.spam.com` to bypass text-only title display.
7. **Dangerous URL Protocol**: Attempting `javascript:alert(1)` or `data:text/html` in `linkUrl`.
8. **Excessive String Payload Denial-of-Wallet**: Sending a 100,000 character string in `displayName` or `message`.
9. **Fake Broadcast Injection**: Non-owner attempts to write to `/broadcasts/{id}`.
10. **Tampering with Expiry or Amount**: User attempts to extend `expiresAt` or increase `amount` directly without payment proof.
11. **Reading Private PII**: Anonymous user queries `/users` collection to scrape email and tokens.
12. **Bypassing Age Gate**: User attempting to register with `isAdult: false`.

## 3. Test Runner Invariant Checks
All 12 malicious payloads must be rejected by Firestore Security Rules with PERMISSION_DENIED.
