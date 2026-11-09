# MediCore Clinic Management System
## Security Architecture, Data Privacy & Regulatory Compliance Plan

---

### 1. Threat Modeling & Healthcare Security Imperatives
Healthcare information systems process highly sensitive personal health information (PHI) and financial transaction logs. A breach compromises both patient confidentiality and legal liability.

#### Core Security Objectives:
1. **Confidentiality:** Zero unauthorized inspection of patient diagnoses, clinical notes, and financial balances.
2. **Integrity:** Protection against unauthorized alteration of signed clinical notes, invoices, and drug prescriptions.
3. **Availability:** Resilience against data loss through automated snapshotting and local multi-point backups.
4. **Accountability:** Non-repudiation via comprehensive immutable audit logging (`audit_logs`) tracking the author, timestamp, IP address, and previous values of every mutation.

---

### 2. Authentication & Session Defense Architecture

- **Cryptographic Password Hashing:** Passwords hashed with bcrypt / Argon2id with work factor cost >= 12.
- **Session Security:**
  - `SameSite=Lax` cookies, with `Secure` flag automatically active when HTTPS is detected.
  - `HttpOnly` enabled on all authentication cookies preventing cross-site scripting (XSS) session theft.
  - Idle session expiration after configurable duration (default: 30 minutes in clinical settings).
- **Brute Force & Rate Limiting:**
  - Login endpoints throttled via Laravel Rate Limiter (`5 attempts per minute per IP/Email pair`).
  - Account temporary lockouts triggered on excessive failed authentications with security audit log entry.
- **Two-Factor Authentication (2FA):**
  - Optional Time-based One-Time Password (TOTP) compatible with Google Authenticator, Microsoft Authenticator, and 1Password.

---

### 3. Authorization & Access Control (RBAC)

The application enforces a 3-tier authorization model:
1. **Perimeter Middleware:**
   - `auth`: Guarantees active session.
   - `role:admin,doctor,...`: Restricts route trees according to user privileges.
   - `ensure.installed`: Redirects all requests to `/install` if setup is incomplete; permanently seals `/install` once configured.
2. **Resource Policies (Model Level):**
   - Every Eloquent model possesses a dedicated Policy class:
     - `ConsultationPolicy`: Only the assigned doctor or Medical Director can edit or sign notes. Other doctors cannot alter colleague notes.
     - `PatientPolicy`: Staff can view demographics; clinical history requires medical role; financial data requires billing role.
     - `InvoicePolicy`: Receptionists/Accountants can record payments; only Clinic Owner/Manager can issue refunds.
3. **Frontend Contextual Enforcement:**
   - Permissions dynamically exposed through Inertia shared props.
   - Unauthorized action buttons (e.g. "Delete Patient", "Refund Invoice", "Sign Prescription") are completely omitted from the DOM, backed by strict server-side validation.

---

### 4. Medical Document & File Storage Hardening

- **Private Vault Architecture:**
  - Patient scans, lab reports, imaging attachments, and signed certificates are saved to `storage/app/private/patients/`.
  - The web server's public directory (`public/`) contains **zero** patient files or medical attachments.
- **Strict File Upload Validation:**
  - Whitelist validation of MIME types: `image/jpeg`, `image/png`, `application/pdf`, `image/webp`. Executable files (`.exe`, `.php`, `.sh`, `.bat`, `.js`) are strictly rejected.
  - Magic byte inspection using PHP `finfo_file` (Fileinfo extension) to prevent MIME-type spoofing.
  - File size limits enforced at both form request and web server levels.
  - Random UUID-based file hashing upon disk write to eliminate directory traversal and filename injection vulnerabilities.
- **Secure File Streaming:**
  - Documents are downloaded or viewed exclusively via authenticated controller action with authorization check:
    ```php
    public function show(PatientDocument $document)
    {
        $this->authorize('view', $document);
        return Storage::disk('private')->response($document->file_path, $document->title);
    }
    ```

---

### 5. Input Sanitization & Attack Surface Mitigation

- **SQL Injection:** 100% prevented by using Laravel Eloquent ORM and PDO prepared statements with parameter binding for all database queries.
- **Cross-Site Scripting (XSS):**
  - All Blade templates and React JSX render text content encoded by default.
  - Rich-text editors sanitize HTML through strict tag whitelisting before saving to database.
- **Cross-Site Request Forgery (CSRF):**
  - Every mutating HTTP request (POST, PUT, PATCH, DELETE) verified against Laravel's CSRF token automatically managed by Inertia.js.
- **Security HTTP Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), camera=(), microphone=()`

---

### 6. Regulatory Compliance & Data Sovereignty

#### 6.1 Moroccan Law 09-08 & CNDP Guidelines
MediCore includes specific architectural provisions for healthcare practitioners in Morocco:
- **Direct Data Localization:** Data resides entirely on the clinic's local server or designated Moroccan hosting provider; zero automated outbound transmission to overseas third-party servers.
- **Right to Access & Rectification:** Patients have the right to request an export of their medical history or request corrections to personal identification records.
- **Audit Logging for Health Data Processing:** System maintains a tamper-evident log of all health data queries and edits, satisfying CNDP requirements for processing sensitive medical data.
- **Legal Disclaimer:** The software provides technical safeguards; the clinic must formally declare its data processing activities to the CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel).

#### 6.2 Data Retention & Safe Deletion
- Medical records default to soft-deletion to comply with statutory healthcare record retention periods (e.g. 10 to 20 years).
- When a permanent purge is legally mandated, a dual-authorization procedure (Clinic Director + Admin) is enforced with comprehensive audit logging.
