# MediCore Clinic Management System
### Complete Enterprise Medical Clinic Management System
**Version:** 1.0.0 Commercial Release · **Architecture:** Self-Hosted · Full Source Code Delivery · Single-Clinic Perpetual License

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mouadjilbab1/medicore-clinic-demo)
[![Laravel Version](https://img.shields.io/badge/Laravel-11.x%20%7C%2012.x-red.svg)](https://laravel.com)
[![React Version](https://img.shields.io/badge/React-18.x%20%7C%2019.x-blue.svg)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2%20%7C%208.3-777BB4.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-Proprietary%20Commercial-emerald.svg)](LICENSE_AGREEMENT.md)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Self--Hosted%20Sovereign-success.svg)](RELEASE/Commercial-Launch/B2B_OUTREACH_COMPLIANCE_REPORT.md)

---

## 🌟 Interactive Live Demo

Experience MediCore Clinic instantly in your browser without local installation:

### 🚀 Public 24/7 Live Web Demo:
👉 **[https://medicore-clinic-demo.onrender.com](https://medicore-clinic-demo.onrender.com)**

### ⚡ 1-Click Cloud Sandbox (GitHub Codespaces):
Click the badge below to launch a private cloud container with PHP, SQLite, and pre-seeded realistic clinic data in under 45 seconds:

👉 [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mouadjilbab1/medicore-clinic-demo)

### Demo Credentials (Pre-Seeded)
| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Doctor / General Practice** | `doctor@medicore.local` | `DoctorPass123!` | Full EMR, Consultations, e-Rx Prescriptions |
| **Dental Surgeon** | `dentist@medicore.local` | `DentistPass123!` | Interactive 32-Tooth FDI Odontogram, Restorations |
| **Receptionist / Triage** | `receptionist@medicore.local` | `ReceptionPass123!` | Patient Intake, Queue Tickets, Calendar |
| **Master Administrator** | `admin@medicore.local` | `AdminPass123!` | System Settings, Roles, Backups, Analytics |
| **Patient Portal** | `patient@medicore.local` | `PatientPass123!` | Personal Prescriptions, Appointments, Invoices |

---

## 📸 Visual Showcase

![MediCore Clinic Dashboard & Overview](RELEASE/Commercial-Assets/Main-Preview.png)

<p align="center">
  <img src="RELEASE/Commercial-Assets/Screenshots/08_Dental_Odontogram_FDI.png" width="48%" alt="Dental FDI Odontogram" />
  <img src="RELEASE/Commercial-Assets/Screenshots/09_Ophthalmology_Refraction.png" width="48%" alt="Ophthalmology Refraction" />
</p>
<p align="center">
  <img src="RELEASE/Commercial-Assets/Screenshots/06_Public_Waiting_Room_Display.png" width="48%" alt="Waiting Room TV Board" />
  <img src="RELEASE/Commercial-Assets/Screenshots/14_Arabic_RTL_Dashboard.png" width="48%" alt="Arabic RTL Support" />
</p>

---

## Overview

**MediCore Clinic** is a comprehensive, self-hosted medical clinic management system engineered for independent polyclinics, private hospitals, dental centers, eye clinics, and multi-specialty outpatient practices. 

Unlike subscription-based SaaS products, MediCore Clinic gives you **100% source code ownership and total data sovereignty**. The system installs directly on your own on-premise hardware, private cloud VPS, or shared cPanel hosting with zero mandatory subscriptions, zero external telemetry, and zero remote licensing dependencies.

---

## Key Features

### 1. Multi-Specialty Clinical Electronic Medical Records (EMR)
- **General Medicine:** Complete encounter charting, chief complaints, history of present illness, examination findings, clinical assessments, treatment plans, and follow-up scheduling.
- **Dental Surgery (FDI Two-Digit Odontogram):** Interactive 32 adult / 20 deciduous tooth chart with 5-surface anatomy (Occlusal, Mesial, Distal, Buccal, Lingual), pathology mapping (caries, fractures, missing, impacted), periodontal pocket depth tracking, and restorative treatment stages.
- **Ophthalmology & Optometry:** Comprehensive OD (right eye) / OS (left eye) refraction charting: Sphere, Cylinder, Axis, Addition, Pupillary Distance (PD), visual acuity, intraocular pressure (IOP), slit-lamp examination, fundoscopy, and optical lens prescriptions.
- **Dermatology:** Anatomical lesion mapping, Fitzpatrick skin phototype classification, ABCDE melanoma screening, morphological descriptors, and dermatological procedures.
- **Pediatrics:** Growth tracking across age milestones with automated WHO growth percentile scoring (weight-for-age, height-for-age, head circumference) and immunization tracking.
- **Physiotherapy & Rehabilitation:** Visual Analog Scale (VAS) pain scoring, range-of-motion (ROM) degree assessments, postural evaluation, and physical therapy session logging.
- **Dynamic Specialty Form Builder:** Visual drag-and-drop form builder allowing clinics to construct custom clinical intake templates with text, numeric, date, select, checkbox, and radio inputs.

### 2. Clinical Workflow & Patient Operations
- **Patient Registration & Longitudinal Records:** Demographic intake, national ID tracking, blood group, emergency contacts, allergy alerts, photo upload, duplicate detection, and record merging.
- **Smart Scheduling & Conflict Prevention:** Real-time doctor availability and room operatory conflict detection preventing double-booking and schedule collisions.
- **Waiting Room & Digital Queue Management:** Sequential daily ticketing with triage prioritization (normal, urgent, emergency, special needs), operatory calling, and a public waiting room display board.
- **Electronic Prescriptions (e-Rx):** Medication dosage, route, frequency, quantity, and patient instructions with one-click printable official clinic prescription layout.
- **Laboratory & Diagnostic Imaging:** Order placement, specimen status tracking, diagnostic result entry, and radiological report archiving.

### 3. Financial & Revenue Cycle Management
- **Invoicing & Billing:** Comprehensive invoicing for consultations, procedures, medications, and laboratory tests with itemized discounts and tax rates.
- **Multi-Method Payments:** Split payments, deposit tracking, cash, credit/debit cards, bank transfers, and health insurance billing with automated receipt generation.
- **Daily Cash Register Closing:** Shift reconciliation, physical cash counting, discrepancy calculation, and end-of-day register sealing.
- **Clinic Expense Tracking:** Category-based expense logging (supplies, utilities, equipment maintenance) with accounting balance reporting.

### 4. Enterprise Security & Architecture
- **Strict Role-Based Access Control (RBAC):** 13 discrete roles (`admin`, `director`, `manager`, `doctor`, `dentist`, `nurse`, `receptionist`, `accountant`, `pharmacist`, `lab_tech`, `imaging_tech`, `inventory_mgr`, `patient`) enforced at the HTTP boundary.
- **Medical Privacy Separation:** Receptionists and billing staff are architecturally barred from accessing confidential medical notes and diagnoses.
- **Clinical Immutability & Audit Trail:** Signed clinical encounters are permanently locked; all subsequent revisions and modifications are tracked in an append-only audit log.
- **Isolated Patient Self-Service Portal:** Dedicated patient dashboard for appointment requests, active prescription access, and invoice history strictly scoped to the authenticated patient's profile.
- **Automated Disaster Recovery & Backups:** One-click full database backup snapshot generation and 100% data fidelity restoration.
- **Internationalization (i18n) & RTL:** Native trilingual support in Arabic (العربية - RTL), English (LTR), and French (Français - LTR).

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | PHP 8.2+ / Laravel 12 |
| **Frontend Architecture** | React 19 + TypeScript |
| **SPA Bridge** | Inertia.js 2.0 (Zero REST boilerplate, server-driven routing) |
| **Styling & Design System** | Tailwind CSS 3.4 + Headless UI + Lucide Icons |
| **Database** | MySQL 8.0 / MariaDB 10.5+ / SQLite 3.35+ |
| **Asset Bundler** | Vite 7.3 |

---

## Quick Start (Installation)

MediCore Clinic provides both an intuitive web-based Installation Wizard and an automated command-line installation.

### Web Installation Wizard
1. Extract the release archive to your web server document root.
2. Ensure directory permissions on `storage/` and `bootstrap/cache/` are writable (`chmod -R 775`).
3. Open your browser and navigate to `http://your-domain.com/install`.
4. Follow the 3-step wizard to verify server requirements, test your database connection, set up your clinic profile, and create your Master Administrator account.

For detailed server configuration (Nginx, Apache, cPanel, Docker), please refer to [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md).

---

## Included Documentation

- [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) — Step-by-step setup for cPanel, VPS, Docker, and Windows.
- [USER_MANUAL.md](USER_MANUAL.md) — Operational guide for doctors, dentists, nurses, receptionists, and accountants.
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) — Clinic management, staff accounts, roles, and system configuration.
- [BACKUP_RESTORE_GUIDE.md](BACKUP_RESTORE_GUIDE.md) — Disaster recovery runbook and automated backup scheduling.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Solutions for common installation and server configuration issues.
- [LICENSE_AGREEMENT.md](LICENSE_AGREEMENT.md) — Commercial Single-Clinic Self-Hosted License terms.
- [CHANGELOG.md](CHANGELOG.md) — Detailed version release notes.

---

## License & Commercial Rights

MediCore Clinic is commercial proprietary software distributed under the **Single-Clinic Perpetual Self-Hosted Commercial License**. 

- You have full rights to install, run, modify, and customize the source code for your clinic.
- You have permanent operational rights with no ongoing subscription fees.
- Redistribution, resale, or sublicensing of the source code is strictly prohibited.

For complete legal terms, review [LICENSE_AGREEMENT.md](LICENSE_AGREEMENT.md).

---
*(c) 2026 MediCore Technologies. All Rights Reserved.*
