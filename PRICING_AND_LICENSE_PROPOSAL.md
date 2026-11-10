# MediCore Clinic v1.0.0 — Commercial Pricing & Licensing Proposal

**Document Reference:** `MC-PRICE-PROP-2026-001`  
**System Name:** MediCore Clinic Management System  
**Commercial Version:** `1.0.0`  
**Date:** November 10, 2026  
**Status:** Strategic Commercial Proposal (For Marketplace Research & Testing)  

---

## 1. Executive Pricing Strategy

### 1.1 Marketplace Commercial Philosophy
MediCore Clinic Management System is engineered to disrupt the recurring cloud SaaS medical software market by delivering **100% self-hosted ownership with full unencrypted source code** for a one-time purchase price.

The pricing model must achieve three commercial objectives:
1. **Low Friction for Solo Practitioners:** Provide an accessible entry tier for solo doctors, dentists, and small clinics.
2. **High Value Realization for Polyclinics:** Capture appropriate commercial value from multi-specialty centers with multiple doctors and operatories.
3. **Reseller & Enterprise Channel Monetization:** Allow IT consultants, web agencies, and hospital groups to purchase extended deployment and customization rights.

> [!NOTE] Empirical Disclaimer
> The pricing tiers proposed in this document represent **initial strategic recommendations formulated for marketplace positioning and market testing**. They are not certified or empirically verified market prices and should be refined through A/B testing on commercial platforms (e.g., CodeCanyon, direct store) based on initial conversion metrics.

---

## 2. Proposed Commercial Licensing Tiers (USD)

```
+---------------------------------------------------------------------------------------------------+
| TIER                    | SUGGESTED PRICE | TARGET CUSTOMER          | CORE RIGHTS & SUPPORT      |
+---------------------------------------------------------------------------------------------------+
| 1. Entry License        | $59 – $79       | Solo Doctor / Small      | Single domain / single     |
| (Regular Commercial)    | (Intro: $49)    | Single-Specialty Clinic  | practice. 6 mos updates.   |
|                         |                 |                          | Standard ticket support.   |
+-------------------------+-----------------+--------------------------+----------------------------+
| 2. Standard Pro License | $129 – $149     | Multi-Specialty          | Multi-branch clinic entity.|
| (Polyclinic Commercial) | (Intro: $99)    | Polyclinic / Dental Ctr  | 12 mos priority updates.   |
|                         |                 |                          | Priority email support.    |
+-------------------------+-----------------+--------------------------+----------------------------+
| 3. Extended Enterprise  | $349 – $499     | IT Resellers, Agencies,  | Customization for client,  |
| (Commercial / Reseller) | (Intro: $299)   | Hospital Networks        | client deployment rights,  |
|                         |                 |                          | Direct developer support.  |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Licensing Comparison Matrix

| Commercial Dimension | Tier 1: Entry License | Tier 2: Standard Pro License | Tier 3: Extended Enterprise |
| :--- | :--- | :--- | :--- |
| **Proposed Price Point** | **\$69 USD** (Launch promo: \$49) | **\$139 USD** (Launch promo: \$99) | **\$399 USD** (Launch promo: \$299) |
| **Target Audience** | Solo Doctor, Dentist, Optometrist | Outpatient Polyclinic, Medical Center | Software Resellers, Web Agencies, Groups |
| **Permitted Deployment Scope**| 1 Live Domain / 1 Local Server | 1 Live Domain / Multi-Branch Org | Deployment on behalf of a paying client |
| **Doctor / Staff Limit** | Unlimited | Unlimited | Unlimited |
| **Patient Record Limit** | Unlimited | Unlimited | Unlimited |
| **Branch Hierarchy** | 1 Main Clinic Location | Multi-Branch (Up to 5 Branches) | Multi-Branch (Unlimited Locations) |
| **Source Code Access** | **100% Full Source Code** | **100% Full Source Code** | **100% Full Source Code** |
| **Ready-to-Install Package** | Included (`vendor/` pre-bundled)| Included (`vendor/` pre-bundled) | Included (`vendor/` pre-bundled) |
| **White-Labeling / Rebranding**| Internal Clinic Logo & Colors | Complete Clinic White-Labeling | Full Rebranding for Client Deliverables |
| **Specialty Modules Included**| All (General, Dental, Eye) | All (General, Dental, Eye, Forms) | All (General, Dental, Eye, Forms) |
| **Free Product Updates** | 6 Months (Version 1.x) | 12 Months (Version 1.x & 2.x) | Lifetime Version 1.x Updates |
| **Technical Support Window** | 6 Months Standard Support | 12 Months Priority Support | 12 Months Direct Senior Dev Support |
| **Support Response Time (SLA)**| Within 48 business hours | Within 24 business hours | Within 12 business hours |
| **Sublicensing / Reselling** | **Strictly Prohibited** | **Strictly Prohibited** | Permitted as bundled service for 1 client |
| **Public Multi-Tenant SaaS** | **Prohibited** | **Prohibited** | Requires Separate Distributor Agreement |

---

## 4. Legal Rights, Intellectual Property & EULA Analysis

The commercial terms are governed by [`LICENSE_AGREEMENT.md`](file:///d:/work/MEDICORE-CLINIC/LICENSE_AGREEMENT.md) and establish a clear boundary between licensee usage rights and licensor intellectual property retention.

### 4.1 Usage & Operational Rights
- **Perpetual Right to Execute:** The licensee receives a non-exclusive, perpetual commercial right to install, execute, and utilize the software for the operations of the permitted clinic entity.
- **Data Sovereignty:** All clinical, financial, and patient records generated by the software are the sole and exclusive property of the licensee.
- **Air-Gapped & Offline Deployment:** The licensee is permitted to operate the system inside private networks, offline Local Area Networks, and air-gapped environments without mandatory internet access or cloud pingbacks.

### 4.2 Modification & Adaptation Rights
- **Full Code Modification:** The licensee is granted the right to inspect, debug, modify, and extend both backend (PHP/Laravel) and frontend (React/TypeScript) source code.
- **Integration Rights:** The licensee may build custom integrations with local laboratory hardware, PACS servers, accounting software, and SMS gateways.
- **White-Labeling:** The licensee may adapt the system interface to display their clinic's brand, logo, and color schemes.

### 4.3 Restrictions & Prohibitions
- **No Standalone Redistribution:** The licensee shall **NOT** sell, resell, sublicense, rent, lease, or publicly share the source code or derivative works as a standalone software package.
- **No Public Multi-Tenant SaaS:** Operating a public SaaS platform that rents subscriptions to competing third-party clinics using this source code is strictly prohibited under standard and extended licenses.
- **Retention of Intellectual Property:** Purchase of a license confers usage rights only. It **does NOT transfer copyright ownership, patents, or intellectual property of the core architecture**, which remains with MediCore Technologies.

### 4.4 Warranty & Medical Disclaimer
- **Administrative & Documentation Tool:** MediCore Clinic is an operational and clinical documentation tool. It is **NOT** an autonomous diagnostic medical device or clinical decision authority.
- **Healthcare Professional Responsibility:** Attending physicians, dentists, and healthcare professionals maintain sole ethical and legal responsibility for patient diagnosis, drug prescriptions, and treatment plans.
- **Limitation of Liability:** Licensor disclaims liability for medical malpractice, clinical misdiagnosis, hardware failures, or data loss resulting from customer server administration.

---

## 5. Support & Updates Lifecycle Policy

### 5.1 Standard Support Inclusions
- Assisting buyers with environment prerequisite validation (PHP extensions, web server settings).
- Troubleshooting installation wizard errors on supported operating systems.
- Diagnosing and fixing verified software bugs in core uncustomized files.
- Providing guidance on configuring cron jobs, database backups, and language selection.

### 5.2 Exclusions from Standard Support
- Custom feature development or modifying core business logic for specific customer preferences.
- Server operating system administration, DNS configuration, SSL certificate procurement, or mail server setup.
- Debugging errors caused by customer modifications to the PHP or React source code.
- Remote hands-on installation on unmanaged VPS servers (available as an optional paid service add-on).

### 5.3 Optional Service Add-Ons (Additional Revenue Streams)
To maximize customer lifetime value (LTV), the following optional professional services should be offered on the marketplace checkout page:
1. **White-Glove Server Installation Service:** \$49 – \$79 (We install and configure MediCore on the buyer's cPanel or VPS).
2. **Custom Medical Specialty Form Setup:** \$39 – \$59 (We build 3 custom clinical specialty templates using the Form Builder).
3. **SMS Gateway Integration:** \$69 (We configure the buyer's local SMS gateway for automated appointment reminders).
4. **Extended 12-Month Support Renewal:** \$39 – \$59 per year.

---

## 6. Marketplace Launch Promotion & Discount Strategy

To generate initial sales velocity, marketplace algorithm ranking, and positive customer reviews, the following introductory rollout is recommended:

- **Launch Week Special (First 30 Days):**
  - Entry License: **\$49 USD** (Regular \$69) — *Save 29%*.
  - Standard Pro License: **\$99 USD** (Regular \$139) — *Save 28%*.
  - Extended Enterprise: **\$299 USD** (Regular \$399) — *Save 25%*.
- **Review Incentive Program:** Provide priority technical onboarding for buyers who submit a verified review on the marketplace.
- **Price Escalation:** Raise prices to standard levels after the first 50 verified sales or 30 days post-launch.
