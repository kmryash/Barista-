# BrewBook Incident & Personal Data Breach Response Runbook
**Statutory Reference:** Digital Personal Data Protection (DPDP) Act, 2023 §8(6) & CERT-In Cyber Incident Directions

## 1. Objective & Scope
This incident response runbook outlines the mandatory operational and regulatory protocol in the event of an actual or suspected breach of personal data stored or processed by BrewBook (including Firebase Authentication, Firestore, Storage, or payment webhook pipelines).

---

## 2. Severity Classification

| Level | Severity | Description | Target Response Time |
|---|---|---|---|
| **P1** | **Critical Breach** | Compromise of production database, unauthorized dump of user PII/tokens, or payment credentials access. | Immediate (< 1 hour containment) |
| **P2** | **Elevated Incident** | Unauthorized modification of user data, unauthorized push notification broadcast, or persistent XSS attempt. | < 4 hours containment |
| **P3** | **Moderate Incident** | Single account takeover or suspicious failed auth brute-force burst blocked by rate limiters. | < 24 hours containment |

---

## 3. Incident Response Protocol: 5-Phase Playbook

### Phase 1: Identification & Triage (T + 0 to 1 Hour)
1. **Identify the Trigger**: Automated alert from audit log, Firebase security alert, rate limit anomaly, or user grievance.
2. **Freeze Impacted Credentials**:
   - Rotate Firebase service account keys.
   - Rotate Stripe and Razorpay webhook secret keys.
   - Invalidate compromised user session tokens immediately via Firebase Admin SDK `revokeRefreshTokens(uid)`.

### Phase 2: Containment & Isolation (T + 1 to 4 Hours)
1. If attack vector is an insecure security rule or endpoint:
   - Immediately deploy emergency restrictive `firestore.rules` denying write access.
   - Block malicious IP address or subnets in Cloud Armor / GCP VPC Firewall.
2. Isolate compromised Firestore documents:
   - Quarantine suspect records by setting `hidden: true` or moving to quarantine collection.

### Phase 3: Investigation & Impact Assessment (T + 4 to 12 Hours)
1. Collect audit logs: Examine Cloud Logging, Firebase Auth logs, and payment provider webhook ledgers.
2. Determine scope:
   - Exact count of impacted Data Principals.
   - Nature of breached data (e.g. emails, device tokens, or payment transaction IDs). Note: No raw credit cards or UPI MPINs are ever stored by BrewBook.

### Phase 4: Statutory Notification & Communications (Within 6 Hours to CERT-In / DPB)
Under the DPDP Act 2023 §8(6) and CERT-In directions:
1. **Notification to Data Protection Board of India (DPBI) and CERT-In**:
   - Timeframe: Promptly without delay.
   - Contents of Notice:
     - Nature and extent of personal data breach.
     - Number of affected Data Principals.
     - Likely consequences and risks.
     - Remedial steps taken and mitigation recommendations.
2. **Notification to Affected Users (Data Principals)**:
   - Clear, plain-language email and in-app notice describing:
     - What happened and when.
     - What information was involved.
     - What BrewBook has done to secure systems.
     - Recommended actions for users (e.g., reset passwords).
     - Contact details of BrewBook Grievance Officer.

### Phase 5: Remediation & Post-Mortem (Within 72 Hours)
1. Permanent patch deployment and automated regression tests.
2. Full forensic log retention for 180 days as mandated by CERT-In.
3. Review and update this runbook based on lessons learned.

---

## 4. Key Incident Response Contacts
- **Data Protection & Grievance Officer**: Yash Kumar (`kmryash09@gmail.com`)
- **Emergency Triage Email**: `security@brewbook.app`
- **Regulatory Reporting**: Data Protection Board of India Portal & CERT-In (`incident@cert-in.org.in`)
