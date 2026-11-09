# MediCore Clinic Management System
## Comprehensive User Manual & Operations Handbook

**Product:** MediCore Clinic Management System  
**Version:** 1.0.0 Commercial Release  
**Target Audience:** Clinic Administrators, Doctors, Dentists, Nurses, Front-Desk Receptionists, Accountants, and Technologists.  

---

## 1. Getting Started & Sign-in

1. Navigate to your clinic URL (e.g. `https://clinic.example.com/login` or `http://localhost:8000/login`).
2. Select your preferred language (العربية with native RTL, Français, or English) from the language selector in the top bar.
3. Sign in using your registered credentials.
4. If you have multi-branch permissions, use the Branch Selector in the header to focus on your active facility.

---

## 2. Front Desk & Patient Admission

### A. Quick Patient Registration
1. Click **Patients** in the left sidebar, then click **Register Patient**.
2. Fill in first name, last name, date of birth, gender, and primary mobile number.
3. The system scans in real time for duplicate mobile numbers, national IDs, or emails to prevent fragmented records.
4. Upon submission, an immutable Unique Patient UID (e.g. `PAT-2026-0004`) is deterministically generated.

### B. Duplicate Detection & Patient Merging
1. If duplicate profiles are discovered, open the primary profile.
2. Select **Merge Records**, choose the duplicate source profile, and enter a clinical justification.
3. MediCore transfers all past encounters, appointments, dental charts, prescriptions, and unpaid invoices to the target profile, marking the duplicate as inactive with an immutable audit log.

### C. Live Waiting Room & Triage
1. When a patient arrives, navigate to **Waiting Room** and click **Check In Patient**.
2. Assign the triage urgency category:
   - **Routine (Normal):** Regular queue ticket sequence (`A-001`, `A-002`).
   - **Urgent:** Priority queue call (`U-001`).
   - **Emergency:** Immediate STAT priority calling (`E-001`).
   - **Special Needs:** Wheelchair/elderly accessibility queue.
3. For patient waiting areas, open the **Public TV Queue Display** (`/waiting-room/display`) in fullscreen on your waiting room television. The display announces tickets and indicates which doctor's examination room is ready.

---

## 3. Clinical Consultations & EMR (Physician Workflow)

### A. Opening an Encounter
1. In the Waiting Room or Appointments screen, click **Call Patient into Consultation**.
2. The system transitions the appointment status to `In Consultation`.
3. Review patient historical allergies (highlighted in red banner) and past medical timeline.

### B. SOAP Clinical Documentation
1. **Chief Complaint:** Primary presenting symptom.
2. **HPI & Physical Examination:** Systematic clinical findings.
3. **Vital Signs:** Record blood pressure, pulse, temperature, SpO2, height, and weight. The system automatically computes and displays Body Mass Index (BMI).
4. **ICD-10 Diagnoses:** Search or type clinical diagnoses with standardized ICD-10 classification codes.

### C. Medical Specialty Tabs
- **Dental FDI Odontogram:** Click teeth on the interactive 2-digit FDI dental chart (Permanent 11–48, Deciduous 51–85). Select condition (Caries, Filled, Missing, Crown, Endo, Implant) and highlight specific surfaces (Occlusal, Mesial, Distal, Buccal, Lingual).
- **Ophthalmology & Optometry:** Record right eye (OD) and left eye (OS) refraction grids (Sphere, Cylinder, Axis, Add, Visual Acuity, Intraocular Pressure).
- **Dermatology:** Record anatomical lesion location, dermatoscopic findings, and track multi-session healing.
- **Pediatrics (WHO):** Record age in months, weight, height, and head circumference. The system calculates WHO standard growth percentiles.
- **Physiotherapy:** Record Visual Analog Scale (VAS) pain score (0–10), joint Range of Motion (ROM), and prescribed therapeutic exercise regimens.
- **Form Builder:** Fill out custom specialty intake questionnaires created by your clinic director.

### D. Signing & Clinical Note Locking
1. Review all clinical notes, diagnoses, and treatments.
2. Click **Sign & Finalize Medical Record**.
3. Once finalized, the record is locked against destructive editing. Any subsequent adjustments must be submitted as tracked addendums with stated clinical reasons.

---

## 4. Prescriptions & Pharmacy

1. In the consultation view or **Prescriptions** module, click **Create Prescription**.
2. Select medication name, dosage strength, dosing frequency (e.g. `Once daily`, `TID (Three times daily)`), duration, and route of administration (e.g. `Oral`, `Topical`, `Inhalation`).
3. Click **Print Rx Sheet** to generate a branded prescription slip featuring your clinic legal header, physician license number, QR verification code, and signature box.

---

## 5. Cashier, Invoicing & Financial Closing

### A. Generating Invoices
1. Open **Billing & Cashier** and select **New Invoice**.
2. Add line items: consultations, surgical procedures, dental restorations, laboratory tests, or pharmacy items.
3. Apply itemized discounts or VAT tax percentages.
4. System automatically computes subtotal, discounts, tax, and balance due.

### B. Recording Payments
1. Click **Record Payment** on any invoice.
2. Enter received amount and payment method (Cash, Credit Card, Bank Transfer, Insurance).
3. The system generates a numbered payment receipt (`REC-2026-XXXX`) and automatically transitions invoice status to `Partially Paid` or `Paid`.

### C. Daily Cash Register Closing
1. At the end of each shift or business day, the cashier clicks **Close Register**.
2. Enter the physical cash counted in the cash drawer.
3. The system contrasts counted cash against total logged cash receipts and logs any overage or shortage discrepancy into the financial audit report.

---

## 6. Diagnostic Laboratory & Radiology Hub

1. **Laboratory:** Technologists view incoming test requisitions, record validated parameter values, and flag critical abnormal findings outside biological reference ranges.
2. **Imaging / Radiology:** Requisitions for X-Ray, Ultrasound, CT Scan, and MRI. Radiologists author diagnostic assessment narratives and save findings directly into the patient's EMR.

---

## 7. Disaster Recovery & Backups

1. Practice managers navigate to **Settings > Database Backup**.
2. Click **Create Backup Snapshot** for instant local archive creation.
3. Download `.sqlite` or `.sql` archives to secure off-site physical storage.
4. Backups are automated daily at 02:00 AM via the internal scheduler.
