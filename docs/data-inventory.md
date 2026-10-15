# BrewBook DPDP Act 2023 - Data Inventory & Processing Register

This data inventory documents all personal data collected, stored, and processed by BrewBook under the Digital Personal Data Protection (DPDP) Act, 2023.

| Data Attribute | Purpose of Processing | Lawful Basis / Consent | Shared With Third Parties? | Mandatory or Optional? | Retention Period | Storage Location |
|---|---|---|---|---|---|---|
| **Email Address** | Authentication, account security, password recovery, critical billing receipts | Explicit Consent (Account creation) | Firebase Authentication (Google Cloud) | Mandatory for account | Active account lifecycle + 24 months inactivity | Google Cloud (Mumbai / Asia-South1) |
| **Display Name** | Personalized recipe bookmarks, barista display | Explicit Consent | Publicly visible ONLY if opted-in to Leaderboard | Mandatory (pseudonym permitted) | Active account lifecycle | Firestore (Cloud DB) |
| **Age Confirmation (18+)** | Age gate compliance, blocking minor registration | Legal Obligation / Consent | None | Mandatory (Under 18 strictly barred) | Duration of account | Firestore (Cloud DB) |
| **Country / Geolocation** | Determining currency (INR for India, USD international) and payment rails | Legitimate use / Consent | Stripe / Razorpay (Payment gateways) | Optional (auto-detected with manual override) | Session / Profile | Firestore |
| **Payment Status & Amount** | Granting 30-day Barista pass, computing leaderboard rank | Contract Performance | Razorpay (India), Stripe (Global) | Mandatory for Premium tier only | 7 years (Statutory financial recordkeeping) | Payment Gateways & Secure Server logs |
| **Custom Link Title & URL** | Head Barista & Master Barista perk ($10+) | Explicit Opt-in | Google Safe Browsing API (Malware/Phishing screen) | Completely Optional | 30-day pass period or until removed | Firestore |
| **Profile Photo / Avatar** | Master Barista perk ($50+) visual badge | Explicit Opt-in | Cloud Storage, Image Moderation API | Completely Optional | 30-day pass period or until deleted | Firebase Storage |
| **FCM Device Push Token** | Brew alerts, outbid notices, leaderboard events | Explicit Separate Opt-in | Firebase Cloud Messaging (Google) | Completely Optional (Default: OFF) | Deleted immediately on opt-out or account deletion | Firestore |
| **DPDP Consent Records** | Verifiable proof of consent (timestamp, version, granular flags) | Legal Obligation (DPDP Act) | None | Mandatory for compliant audit | Duration of account + 3 years | Firestore Audit Log |
| **Moderation & Report Flags** | Community safety, hate speech/profanity takedowns | Legitimate Interest | Admin / Moderation Team | Optional (submitted upon grievance) | 90 days after ticket resolution | Firestore |

## Cross-Border Data Transfers
All primary customer data for Indian Data Principals is handled with adherence to Central Government notifications under the DPDP Act 2023. Payment processing is tokenized directly via RBI-authorized payment aggregators (Razorpay) within India for domestic transactions.

## Data Principal Rights Matrix
- **Right to Access & Portability**: Available via in-app "Download My Data (JSON)".
- **Right to Correction**: Editable directly under Settings > Profile.
- **Right to Erasure**: One-click account deletion removes all personal data, avatars, tokens, and leaderboard entries, retaining only statutory financial invoices.
- **Right of Grievance Redressal**: Contact Data Protection & Grievance Officer within 24 hours acknowledgment, 30 days resolution.
- **Right to Nominate**: In-app nomination for legal representative or next of kin in event of death/incapacity.
