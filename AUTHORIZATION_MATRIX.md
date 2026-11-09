# MediCore Clinic — Role-Based Access Control (RBAC) & Authorization Matrix

**Audit Standard:** Strict HTTP/API Boundary Enforcement (No Front-End UI Obscurity Fallbacks)  
**Verification Suite:** `Tests\Feature\RoleAuthorizationTest` (6 tests · 40 assertions passing)  
**Framework Enforcement:** `App\Http\Middleware\CheckRole` + Route Group Protection in `routes/web.php`  

---

## 1. System Role Definitions

MediCore Clinic supports 13 discrete operational roles divided into 4 tiers:

1. **Executive & Governance Tier:**
   - `admin`: System IT Administrator (full operational and technical control).
   - `director`: Medical Director / Executive Clinic Owner (full clinical, financial, and governance access).
   - `manager`: Practice Operations Manager (clinic workflow, patient administrative management, reporting).

2. **Clinical Healthcare Tier:**
   - `doctor`: General Physician / Medical Specialist (consultations, clinical notes, diagnoses, signing, prescriptions).
   - `dentist`: Dental Surgeon (odontogram, tooth-level pathology, periodontal charting, restorative treatments).
   - `nurse`: Clinical Staff Nurse (vital signs intake, queue progression, patient triage).

3. **Allied Health & Operations Tier:**
   - `receptionist`: Front Desk Officer (patient registration, appointment booking, queue intake, cashier billing).
   - `accountant`: Financial Officer (invoicing, payments, clinic expenses, cash register closing, financial reporting).
   - `pharmacist`: Pharmacy Dispensary Officer (prescriptions view/dispensing, stock dispensing).
   - `lab_tech`: Laboratory Technician (lab test orders, specimen tracking, diagnostic result entry).
   - `imaging_tech`: Radiology Technician (X-Ray/ultrasound/CT request fulfillment, radiologic reports).
   - `inventory_mgr`: Supply Chain Manager (medicines, consumables, POs, supplier management).

4. **Patient Self-Service Tier:**
   - `patient`: Registered Clinic Patient (dedicated self-service portal, appointments request, view own records).

---

## 2. Granular Role-Based Access Control (RBAC) Matrix

**Legend:**
- `CRUD`: Create, Read, Update, Delete
- `CRU`: Create, Read, Update (Cannot Delete)
- `CR`: Create, Read
- `R`: Read Only
- `Vitals`: Vitals intake only
- `Self`: Scoped strictly to authenticated patient's own records
- `DENIED`: HTTP 403 Forbidden

| Module / Action | Admin | Director | Manager | Doctor | Dentist | Nurse | Receptionist | Accountant | Pharmacist | Lab Tech | Imaging Tech | Patient |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Clinical Dashboard** | Full | Full | Full | Clinical | Clinical | Clinical | Queue/Desk | Financial | Dispensary | Lab | Imaging | `DENIED` |
| **Patient Demographics (CRU)**| Full | Full | Full | CRU | CRU | R | CRU | `DENIED` | R | R | R | `DENIED` |
| **Patient Merging & Deletion**| Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Appointment Scheduling** | Full | Full | Full | CRU | CRU | CRU | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | Request Only |
| **Waiting Room & Queue** | Full | Full | Full | Call/Done| Call/Done| Call/Next| Check-in | `DENIED` | `DENIED` | `DENIED` | `DENIED` | Public Disp |
| **EMR Medical Notes (View)** | Full | Full | Full | Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Vital Signs Intake** | Full | Full | Full | Create | Create | Create | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **ICD-10 Diagnoses** | Full | Full | Full | Create | Create | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Electronic Signature** | Full | Full | `DENIED` | Sign | Sign | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Dental Odontogram** | Full | Full | Full | `DENIED` | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Ophthalmology Refraction** | Full | Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Prescriptions (Issue)** | Full | Full | `DENIED` | Create | Create | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Prescriptions (View/Print)**| Full | Full | Full | R/Print | R/Print | R/Print | `DENIED` | `DENIED` | R/Dispense| `DENIED` | `DENIED` | `DENIED` |
| **Invoicing & Cashier Desk** | Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | CRU | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Expenses & Register Close**| Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Inventory & Pharmacy Stock**| Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | Full | `DENIED` | `DENIED` | `DENIED` |
| **Laboratory Orders & Entry** | Full | Full | Full | Order | Order | R | `DENIED` | `DENIED` | `DENIED` | Enter/Done| `DENIED` | `DENIED` |
| **Imaging Orders & Reports** | Full | Full | Full | Order | Order | R | `DENIED` | `DENIED` | `DENIED` | `DENIED` | Enter/Done| `DENIED` |
| **Staff & HR Administration**| Full | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **System Backups & Restore** | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` |
| **Patient Portal Access** | Full | Full | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | Self Records |

---

## 3. Verified Security Invariants (Audit Proof)

1. **Medical Privacy Barrier:**
   - Any HTTP request to `/consultations` by a `receptionist`, `accountant`, or `patient` immediately terminates with **HTTP 403 Forbidden**. Front desk staff and billing clerks are cryptographically and architecturally prevented from accessing sensitive patient health records.
2. **Clinical Signature Immutability:**
   - Only licensed medical practitioners (`doctor`, `dentist`) or executive administrators can sign a medical consultation. Nurses, receptionists, and accountants receive **HTTP 403 Forbidden**.
   - Once signed, the consultation record cannot be modified in place. Subsequent additions require an append-only addendum audited in `clinical_note_revisions`.
3. **Financial Separation of Duties:**
   - Clinical staff (`doctor`, `nurse`) cannot create clinic expenses, record payments, or close cash registers (**HTTP 403 Forbidden**).
   - Cash register closing is restricted to `accountant`, `manager`, `director`, and `admin`.
4. **Patient Data Isolation:**
   - Users with the `patient` role are strictly barred from all internal staff endpoints (`/`, `/patients`, `/consultations`, `/billing`, `/staff`).
   - In the Patient Portal (`/portal`), the controller resolves the patient record dynamically from `$request->user()->email`. Attempts to inject or alter `patient_id` in appointment request payloads are ignored; the system binds the appointment strictly to the authenticated patient's profile.
5. **System Disaster Recovery Protection:**
   - Database backup generation (`POST /settings/backup/create`) and restoration (`POST /settings/backup/{id}/restore`) are restricted exclusively to `admin` and `director`. Doctors, nurses, receptionists, accountants, and patients all receive **HTTP 403 Forbidden**.
