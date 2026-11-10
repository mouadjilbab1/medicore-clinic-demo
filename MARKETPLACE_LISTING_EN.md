# MediCore Clinic Management System — Official Commercial Marketplace Listing

**Marketplace Category:** PHP Scripts / Miscellaneous / Medical & Health  
**Target Marketplaces:** CodeCanyon / Envato Market / Direct Digital Software Store  
**Language:** English (US)  
**Author:** MediCore Technologies  
**Release Version:** 1.0.0 Commercial Edition  

---

# MediCore Clinic — Multi-Specialty Medical Clinic Management System (Self-Hosted · Full Source Code)

> **The Sovereign, Subscription-Free Medical Practice Platform with Electronic Medical Records (EMR), Interactive Dental Odontogram, Ophthalmology Refraction, Smart Queue, Pharmacy Inventory & Invoicing.**

---

## Short Description (Item Summary — 250 characters max)
Complete self-hosted clinic management system & EMR. Built with Laravel 12 & React 19. Features dental odontogram, optical refraction, appointments queue, billing, inventory, and full Arabic RTL / English / French support. 100% full source code.

---

## Product Overview & Value Proposition

**Tired of paying expensive monthly cloud subscriptions per doctor? Concerned about storing confidential patient medical records on foreign third-party cloud servers?**

**MediCore Clinic Management System** is a powerful, modern, enterprise-grade clinic management system designed specifically for independent outpatient clinics, polyclinics, dental surgery practices, and eye centers.

Unlike subscription-based SaaS platforms that lock your data into recurring monthly fees, MediCore is delivered as a **100% self-hosted software package with complete, unencrypted source code**. You purchase the software once and deploy it permanently on your own private cloud VPS, shared cPanel hosting, or local on-premise clinic server.

With native support for **Arabic (العربية with complete RTL layout)**, **English**, and **French**, MediCore combines general outpatient care, specialized dental charting, optometry exams, electronic prescribing, pharmacy inventory, and billing into one unified, intuitive platform.

---

## Why Choose MediCore Clinic?

- **No Monthly Subscriptions:** Pay once, own it forever. Add unlimited doctors, staff, and patients without per-seat charges.
- **100% Full Source Code:** Full Laravel 12 PHP backend + React 19 / TypeScript frontend. No IonCube loaders, no encrypted files, no obfuscation.
- **Total Patient Data Sovereignty:** Patient records reside 100% on your own server. Operates completely in air-gapped Local Area Networks (LAN) with zero external internet dependencies or telemetry.
- **Native Trilingual & RTL Support:** Switch seamlessly between Arabic (RTL with Tajawal font), English (LTR), and French (LTR) at any time.
- **Multi-Specialty Ready:** General medicine, dental surgery (FDI odontogram), ophthalmology (optical refraction), plus a visual form builder for custom medical specialties.
- **Zero-CLI Web Installer:** Non-technical buyers can extract the Ready-to-Install package onto cPanel and complete setup through an intuitive 5-step web browser wizard in under 5 minutes.

---

## Comprehensive Feature Breakdown

### 1. Patient Directory & Medical History (MPI)
- **Master Patient Index:** Unique medical record numbering (`PID-YYYYMMDD-XXXX`), demographic intake, blood group, national ID, and civil registration numbers.
- **Longitudinal Medical History:** Chronic disease registries, severe drug and environmental allergies with high-visibility safety badges, and previous surgical history.
- **Patient Merging & Deduplication:** Automated duplicate detection by phone number and national ID with an auditable patient merge workflow.
- **Emergency & Relative Contacts:** Family relationships, legal guardians, and primary emergency contacts.

### 2. Clinical Encounters & Electronic Medical Records (EMR)
- **SOAP Medical Charting:** Structured documentation for Subjective complaints, Objective clinical findings, Assessment (diagnoses), and Treatment Plans.
- **Automated Vital Signs & BMI:** Captures temperature, heart rate, respiratory rate, blood pressure (systolic/diastolic), oxygen saturation ($SpO_2$), height, weight, and automated BMI calculation.
- **Diagnostic Coding:** Integrated diagnostic catalog supporting ICD-10 and ICD-11 coding standards.
- **Clinical Note Sealing & Audit Trails:** Electronic doctor signing locks records permanently against unauthorized tampering; subsequent corrections generate an immutable append-only revision trail.

### 3. Specialized Medical Modules
- **Dental Surgery (FDI Two-Digit Odontogram):**
  - Interactive anatomical tooth chart mapping all 32 adult teeth (quadrants 1–4) and 20 primary/deciduous teeth (quadrants 5–8).
  - 5 anatomical surfaces per tooth: Occlusal, Mesial, Distal, Buccal, and Lingual.
  - Clinical pathology mapping: Caries, filled, crown, missing, impacted, extracted, root canal.
  - Linked dental treatment procedure planning and surface-specific fees.
- **Ophthalmology & Optometry Refraction:**
  - OD (Right Eye) and OS (Left Eye) optical refraction metrics: Sphere (SPH), Cylinder (CYL), Axis, Addition (ADD), Pupillary Distance (PD), and Visual Acuity (VA).
  - Intraocular Pressure (IOP) tonometry tracking.
  - Slit-lamp anterior segment and fundoscopy documentation.
  - Automated optical prescription generation for corrective lenses.
- **Dynamic Specialty Form Builder:**
  - Drag-and-drop constructor allowing clinics to design custom medical intake forms.
  - Supports text, numeric, date, dropdown selects, checkboxes, and radio fields for custom specialties (Dermatology, Pediatrics, Cardiology, Physiotherapy).

### 4. Smart Scheduling & Digital Waiting Room
- **Doctor Roster & Availability:** Configurable weekly schedules, room operatory assignments, and approved doctor leave tracking.
- **Collision Prevention:** Real-time scheduling conflict engine prevents double-booking across doctors and procedure operatories.
- **Waiting Room Queue Board:** Daily sequential ticketing with triage urgency categorization (`Normal`, `Urgent`, `Emergency`, `Special Needs`).
- **Public Display Monitor:** Dedicated full-screen waiting room display screen (`/waiting-room/display`) for clinic waiting area TV monitors showing current ticket calls.

### 5. Electronic Prescriptions (e-Rx) & Diagnostics
- **Electronic Prescriptions:** Medication search, dosage instructions, administration route, frequency, quantity, and duration.
- **Official Print Layout:** One-click generation of professional A4 printable prescriptions featuring clinic header, doctor details, and Rx symbol.
- **Laboratory Orders:** Test order generation, specimen collection tracking, status workflows, and result documentation with reference ranges.
- **Radiology Records:** Examination requests, imaging study details, radiologist reports, and external PACS/DICOM server link archiving.

### 6. Billing, Invoicing & Financial Control
- **Itemized Invoicing:** Automatic invoice generation for consultations, procedures, lab tests, and medications with itemized discounts and tax rates.
- **Multi-Method Payment Receipting:** Split payments, deposit tracking, cash, credit/debit card, bank transfer, and health insurance billing.
- **Daily Cash Register Closing:** Shift reconciliation, physical cash counting, discrepancy calculation, and end-of-day register sealing.
- **Clinic Expense Tracking:** Categorized expense tracking (medical supplies, utilities, maintenance, salaries) with financial summaries.

### 7. Pharmacy & Inventory Management
- **Medical Stock Catalog:** Item catalog with SKU, brand, generic name, dosage form, unit of measurement, and reorder levels.
- **Batch & Expiry Tracking:** Batch number management with automated 30-day expiration warnings.
- **Stock Movement Ledger:** Audited inventory transactions for purchase receipts, dispensing deductions, and physical count adjustments.

### 8. Dedicated Patient Self-Service Portal
- **Independent Patient Login:** Strict architectural isolation via the `/portal` route tree.
- **Online Appointment Requests:** Patients can submit appointment booking requests directly to the clinic front desk.
- **Prescription & Invoice History:** Patients can securely view active prescriptions and historical medical bills.

### 9. Enterprise Security & Administration
- **13 Granular Roles (RBAC):** Strict separation of duties between Administrators, Medical Directors, Managers, Doctors, Dentists, Nurses, Receptionists, Accountants, Pharmacists, Lab Techs, Imaging Techs, and Patients.
- **Medical Confidentiality Boundary:** Non-clinical staff (receptionists, accountants) are strictly barred from accessing confidential clinical SOAP notes and diagnoses.
- **Brute-Force Rate Limiting:** Automatic 60-second IP/email lockout with security audit logging upon 5 failed login attempts.
- **Integrated Database Backup Manager:** One-click SQLite and pure-PHP MySQL database snapshot generation, download, and restoration directly from the browser.

---

## Technical Specifications

| Component | Specification |
| :--- | :--- |
| **Backend Framework** | Laravel 12 (PHP 8.2 or 8.3) |
| **Frontend Framework**| React 19 + TypeScript |
| **SPA Bridge** | Inertia.js 2.0 (Fast Single-Page App with zero REST overhead) |
| **Styling** | Tailwind CSS 4.0 (Responsive, Dark / Light UI elements) |
| **Iconography** | Lucide React Icons |
| **Supported Databases**| MySQL 8.0+, MariaDB 10.5+, or SQLite 3.35+ |
| **Web Server** | Nginx 1.20+ or Apache 2.4+ (with `mod_rewrite`) |
| **Architecture** | Single-Clinic / Multi-Branch Enterprise Monolith |

---

## System Requirements

### Server Requirements
- **PHP Version:** PHP 8.2 or PHP 8.3
- **PHP Extensions Required:** `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `gd`, `intl`, `json`, `mbstring`, `openssl`, `pcre`, `pdo`, `pdo_mysql` (or `pdo_sqlite`), `tokenizer`, `xml`, `zip`.
- **Database:** MySQL 8.0+ (InnoDB with UTF8MB4), MariaDB 10.5+, or SQLite 3.35+.
- **Web Server:** Apache (with `mod_rewrite` enabled) or Nginx.
- **Server RAM:** 1 GB minimum (4 GB+ recommended for busy polyclinics).
- **Disk Storage:** 500 MB for core application files; SSD recommended.

---

## Installation & Deployment Options

MediCore Clinic is engineered for both non-technical users and experienced system administrators:

### Option A: Web Installation Wizard (cPanel / Shared Hosting — Zero CLI)
1. Upload and extract `MediCore-Clinic-v1.0.0-Ready-to-Install.zip` into your web hosting directory.
2. Point your domain's **Document Root** to the `/public` folder.
3. Open your browser and navigate to `http://your-domain.com/install`.
4. Follow the 5-step graphical wizard to verify server requirements, test your database, set up your clinic profile, and create your Master Administrator.
5. The installer provisions all tables, seeds medical catalogs, permanently locks itself, and redirects you to login!

### Option B: Linux VPS / Docker / CLI Deployment (Source Edition)
1. Extract `MediCore-Clinic-v1.0.0.zip` to `/var/www/medicore`.
2. Run `composer install --no-dev --optimize-autoloader`.
3. Copy environment configuration: `cp .env.production.example .env && php artisan key:generate`.
4. Configure database settings in `.env` and run migrations: `php artisan migrate --force && php artisan db:seed --force`.
5. Point Nginx/Apache to `/var/www/medicore/public` and ensure permissions on `storage/` and `bootstrap/cache/`.

---

## What’s Included in the Download?

When you purchase MediCore Clinic, you receive a comprehensive package:
- **`MediCore-Clinic-v1.0.0-Ready-to-Install.zip`:** Pre-bundled with all production vendor dependencies (6,444 files) for one-click shared hosting / cPanel setup.
- **`MediCore-Clinic-v1.0.0.zip`:** Clean, pristine source edition for developers and VPS deployments.
- **Complete TypeScript Frontend Source:** Full React 19 source code, components, hooks, and Tailwind configurations.
- **Precompiled Production Assets:** Pre-built minified JavaScript and CSS in `public/build/` (no Node.js installation required).
- **Full Database Migrations & Seeders:** 15 structured relational migrations and sample clinical demo data.
- **Comprehensive Documentation Suite:**
  - `INSTALLATION_GUIDE.md` (cPanel, Nginx, Apache, Docker)
  - `USER_MANUAL.md` (Operational guides for doctors, dentists, nurses, receptionists, accountants)
  - `ADMIN_GUIDE.md` (Clinic management, roles, and branch configuration)
  - `BACKUP_RESTORE_GUIDE.md` (Disaster recovery runbook)
  - `TROUBLESHOOTING.md` (Common server setup resolutions)
  - `LICENSE_AGREEMENT.md` (Full commercial EULA)
  - `CHANGELOG.md` (Release history)

---

## Technical Support Policy

We take pride in providing transparent, reliable technical support:
- **What is Covered:** Installation guidance, bug fixes, questions regarding core functionality, and troubleshooting verified system errors on compatible server environments.
- **What is Not Covered:** Free custom feature programming, third-party server administration, or troubleshooting unsupported PHP extensions.
- **Support Channels:** Dedicated helpdesk ticketing, email support, and detailed community documentation.

---

## Frequently Asked Questions (FAQ)

#### Q1: Do I have to pay any monthly or annual subscription fees?
**No.** MediCore Clinic is sold under a perpetual one-time purchase license. Once purchased, you own the operational rights forever. There are zero recurring cloud fees, per-doctor charges, or per-patient costs.

#### Q2: Can MediCore Clinic run on my local office network without internet?
**Yes.** MediCore Clinic has zero external cloud dependencies and contains no external tracking beacons. You can install it on a local computer or office server running Ubuntu or Windows, and access it across your local clinic Wi-Fi or Ethernet network completely offline.

#### Q3: Does MediCore support both Arabic and English?
**Yes.** MediCore features full bidirectional internationalization. When switched to Arabic, the entire interface flips into a native Right-to-Left (RTL) layout using the beautiful Arabic `Tajawal` font. English and French use standard Left-to-Right (LTR) layouts with the modern `Inter` font.

#### Q4: What is the difference between Ready-to-Install and Source Edition?
The **Ready-to-Install Edition** includes all pre-compiled PHP vendor libraries and frontend assets. You can upload it directly to shared hosting or cPanel without needing Composer, Node.js, or SSH terminal access. The **Source Edition** is a clean source tree designed for developers who wish to run `composer install` and customize the React TypeScript codebase.

#### Q5: Can I manage multiple branches under one installation?
**Yes.** MediCore includes multi-branch organizational architecture. You can define multiple clinic locations, assign doctors to specific branches, and switch active operational branches seamlessly.

#### Q6: Can I customize or white-label the software for my clinic?
**Yes.** You receive 100% full, unencrypted source code. You are permitted to customize layouts, upload your clinic logo, add custom medical fields using the Form Builder, and modify the code to fit your internal clinic workflows.

#### Q7: Can I resell or distribute copies of MediCore Clinic?
**No.** Your purchase licenses the software for use by your single clinic or healthcare organization. You may not resell, redistribute, sub-license, or rent the source code or derivative works to third parties.

---

## Version 1.0.0 Release Notes (Changelog)

```
Version 1.0.0 (Commercial Gold Master Release - November 2026)
- Initial commercial release of MediCore Clinic Management System.
- Master Patient Index (MPI) with duplicate detection and merging.
- Outpatient EMR with SOAP clinical notes, vitals, and electronic signing.
- Interactive Dental Surgery module with 32 adult / 20 deciduous tooth FDI odontogram.
- Ophthalmology & Optometry module with optical refraction (OD/OS) metrics.
- Dynamic Specialty Form Builder for custom medical specialties.
- Smart appointment calendar with collision detection and doctor rosters.
- Waiting room queue board with daily tickets and public TV display monitor.
- Electronic prescriptions (e-Rx) with official printable A4 layout.
- Billing, multi-method payment receipting, and cash register reconciliation.
- Pharmacy inventory with batch expiry monitoring and stock movement ledgers.
- Native Arabic (RTL), English (LTR), and French (LTR) trilingual localization.
- Pure-PHP MySQL and SQLite database backup and restore manager.
- Zero-CLI Web Installation Wizard for cPanel and shared hosting.
```
