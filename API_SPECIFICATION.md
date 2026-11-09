# MediCore Clinic Management System
## REST API & Inertia Endpoint Specifications (OpenAPI Compliant)

---

### 1. Protocol & Conventions
- **Base URL:** `/api/v1` (REST API) and `/` (Inertia Application Routes)
- **Authentication:** Laravel Sanctum Bearer Token (`Authorization: Bearer <token>`) or Session Cookie (Inertia Web)
- **Payload Format:** `application/json` (Content-Type & Accept)
- **Standard HTTP Status Codes:**
  - `200 OK`: Successful retrieval or synchronous operation
  - `201 Created`: Resource successfully created
  - `400 Bad Request`: Validation failure or semantic logic violation
  - `401 Unauthorized`: Missing or invalid authentication token
  - `403 Forbidden`: Insufficient role or policy authorization
  - `404 Not Found`: Resource does not exist
  - `409 Conflict`: Scheduling collision or duplicate record
  - `422 Unprocessable Entity`: Form validation errors with field dictionary
  - `500 Server Error`: Unexpected runtime failure with safe logging

---

### 2. Core API Endpoints

#### 2.1 Authentication & Profile
- `POST /api/v1/auth/login`
  - Body: `{ email, password, device_name }`
  - Response: `{ token, user: { id, name, email, role, branch_id, locale } }`
- `POST /api/v1/auth/logout`
  - Revokes current personal access token or clears web session.
- `GET /api/v1/auth/me`
  - Returns authenticated user details, assigned permissions, and active branch context.

#### 2.2 Patient Management
- `GET /api/v1/patients`
  - Query params: `search`, `branch_id`, `gender`, `blood_group`, `page`, `per_page`
  - Response: Paginated list of patient summaries.
- `POST /api/v1/patients`
  - Body: `{ first_name, last_name, date_of_birth, gender, phone, email, national_id, address, blood_group, emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions }`
  - Response 201: Created patient resource with generated `patient_uid`.
- `GET /api/v1/patients/{id}`
  - Returns complete demographic, medical baseline, allergies, and contact details.
- `PUT /api/v1/patients/{id}`
  - Updates patient profile with audit logging of changed fields.
- `GET /api/v1/patients/{id}/timeline`
  - Unified chronological timeline of consultations, appointments, vitals, prescriptions, lab results, and invoices.
- `POST /api/v1/patients/merge`
  - Body: `{ source_patient_id, target_patient_id, reason }`
  - Consolidates appointments, medical records, and invoices to target patient.

#### 2.3 Appointments & Calendar
- `GET /api/v1/appointments`
  - Query params: `doctor_id`, `branch_id`, `start_date`, `end_date`, `status`
  - Returns calendar events array with patient name, doctor, status color, and time block.
- `POST /api/v1/appointments`
  - Body: `{ patient_id, doctor_id, branch_id, room_id, appointment_date, start_time, end_time, type, reason_for_visit }`
  - Conflict Check: Returns `409 Conflict` if doctor or room is occupied.
  - Response 201: Created appointment resource.
- `PATCH /api/v1/appointments/{id}/status`
  - Body: `{ status: "confirmed"|"arrived"|"completed"|"cancelled"|"no_show", cancellation_reason? }`
- `POST /api/v1/appointments/{id}/reschedule`
  - Body: `{ appointment_date, start_time, end_time, reason }`

#### 2.4 Waiting Room & Live Queue
- `GET /api/v1/queue`
  - Query params: `branch_id`, `doctor_id`, `status` (waiting/called/in_consultation)
  - Returns active queue list ordered by priority and check-in time.
- `POST /api/v1/queue/check-in`
  - Body: `{ patient_id, doctor_id, branch_id, appointment_id?, priority }`
  - Response: Queue ticket with assigned `queue_number` and estimated wait.
- `POST /api/v1/queue/{id}/call`
  - Marks status as `called` and triggers waiting room audio chime / visual board.
- `POST /api/v1/queue/{id}/transfer`
  - Body: `{ new_doctor_id, reason }`

#### 2.5 Consultations & Clinical Records
- `POST /api/v1/consultations`
  - Body: `{ patient_id, appointment_id?, doctor_id, chief_complaint, history_present_illness, physical_examination, clinical_assessment, treatment_plan, follow_up_date }`
- `GET /api/v1/consultations/{id}`
  - Returns consultation details with vital signs, diagnoses, specialty records, and prescriptions.
- `POST /api/v1/consultations/{id}/vitals`
  - Body: `{ systolic_bp, diastolic_bp, heart_rate, respiratory_rate, temperature, oxygen_saturation, weight, height }`
- `POST /api/v1/consultations/{id}/diagnoses`
  - Body: `{ icd10_code, diagnosis_name, type: "primary"|"secondary", notes }`
- `POST /api/v1/consultations/{id}/sign`
  - Locks consultation, generates cryptographic signature record, and marks `is_finalized = true`.
- `POST /api/v1/consultations/{id}/revisions`
  - Body: `{ revision_reason, modified_content }`
  - Creates tracked clinical note addendum.

#### 2.6 Specialty Modules
- `GET /api/v1/dental/{patient_id}/odontogram`
  - Returns condition matrix for all 32 adult and 20 deciduous teeth (conditions, surfaces, planned treatments).
- `POST /api/v1/dental/{patient_id}/tooth/{tooth_number}`
  - Body: `{ condition, surface_occlusal, surface_mesial, surface_distal, surface_buccal, surface_lingual, notes }`
- `POST /api/v1/dental/{patient_id}/treatments`
  - Body: `{ tooth_number?, procedure_name, stage: "planned"|"in_progress"|"completed", cost }`
- `POST /api/v1/specialties/ophthalmology`
  - Body: `{ consultation_id, patient_id, od_va, od_sph, od_cyl, od_axis, od_add, od_iop, os_va, os_sph, os_cyl, os_axis, os_add, os_iop, pd }`
- `POST /api/v1/specialties/pediatrics/growth`
  - Body: `{ patient_id, age_months, height_cm, weight_kg, head_circumference_cm }`

#### 2.7 Prescriptions & Documents
- `POST /api/v1/prescriptions`
  - Body: `{ patient_id, doctor_id, consultation_id?, items: [ { medicine_name, dosage, frequency, duration, route, quantity, instructions } ] }`
- `GET /api/v1/prescriptions/{id}/pdf`
  - Streams rendered medical prescription with clinic header, doctor license, and barcode.
- `POST /api/v1/documents/certificates`
  - Body: `{ patient_id, doctor_id, type: "sick_leave"|"medical_certificate", start_date, end_date, diagnosis_summary, content }`

#### 2.8 Billing, Invoicing & Payments
- `POST /api/v1/invoices`
  - Body: `{ patient_id, branch_id, consultation_id?, due_date, items: [ { item_name, item_type, quantity, unit_price, discount, tax_rate } ] }`
- `GET /api/v1/invoices/{id}`
  - Returns complete invoice breakdown with payments history, subtotal, discount, tax, balance.
- `POST /api/v1/invoices/{id}/payments`
  - Body: `{ amount, payment_method: "cash"|"card"|"bank_transfer"|"insurance", transaction_reference?, notes? }`
- `GET /api/v1/invoices/{id}/pdf`
  - Generates official receipt / invoice PDF.

#### 2.9 Inventory, Lab & Imaging
- `GET /api/v1/inventory/products`
  - Filterable by branch, category, low stock flag.
- `POST /api/v1/inventory/movements`
  - Stock in, stock out, damage, or consultation consumption.
- `GET /api/v1/lab/requests` & `POST /api/v1/lab/requests/{id}/results`
- `GET /api/v1/imaging/requests` & `POST /api/v1/imaging/requests/{id}/report`

#### 2.10 Backup & System Management
- `POST /api/v1/system/backup`
  - Triggers database snapshot and file vault archive; returns download URL.
- `GET /api/v1/system/audit-logs`
  - Paginated audit journal with entity and date filters.
