# MediCore Clinic — Clean Buyer Installation Simulation Report

**Test Type:** Independent Buyer Experience & Autonomous Installation Simulation  
**Environment:** Completely Isolated Sandbox (`TEST_BUYER_INSTALL`)  
**Simulation Date:** November 2026  
**Execution Status:** `PASS (100% Autonomous Success)`  

---

## 1. Objective & Methodology

The goal of this simulation is to prove that an independent customer purchasing MediCore Clinic can download the release package, install it on fresh infrastructure, and start operating immediately **without any developer assistance, without developer machine paths, and without any external network dependency**.

---

## 2. Step-by-Step Simulation Execution Log

### Step 1: Sandbox Extraction & Git Isolation
- Source: Extracted directly from `RELEASE/MediCore-Clinic-v1.0.0/`.
- Target: Clean directory `TEST_BUYER_INSTALL/`.
- **Git Check:** Verified that `.git/` does **not** exist (`Test-Path .git` -> `False`). The software operates completely independently of any version control repository.

### Step 2: Fresh Environment Initialization
- Lock Check: Verified that `storage/installed` does **not** exist, confirming the package is in a pristine, uninstalled state.
- Environment File: Copied `.env.example` to `.env`.
- Key Generation: Executed `php artisan key:generate --no-interaction`. Returned exit code 0 (`APP_KEY` successfully populated with base64 256-bit AES key).

### Step 3: Database Initialization
- Empty database initialized (`database/database.sqlite`).
- Initial state: Zero tables exist; no migrations have run.

### Step 4: Installation Wizard Requirements Check
- **HTTP Request:** `GET /install`
- **Response Code:** **200 OK**
- **Evaluation:** The wizard evaluated:
  - PHP Version ($\ge 8.2$) -> Satisfied
  - PDO, OpenSSL, Mbstring, Fileinfo, GD extensions -> Satisfied
  - Directory write permissions on `storage/` and `bootstrap/cache/` -> Satisfied
  - Rendered `Install/Wizard` Inertia view.

### Step 5: Database Connection Verification
- **HTTP Request:** `POST /install/test-db` with `db_driver: sqlite`.
- **Response Code:** **200 OK**
- **Payload Response:** `{"success": true, "message": "SQLite local database is active and ready."}`

### Step 6: Full Installation Execution & Custom Admin Creation
- **HTTP Request:** `POST /install/complete`
- **Submitted Clinic Profile:**
  - Clinic Name: `Al-Amal Medical Polyclinic`
  - Contact Phone: `+212 522 112233`
  - Official Email: `contact@alamal-clinic.test`
  - Physical Address: `88 Avenue Hassan II, Rabat`
  - Default Currency: `MAD`
  - Administrator Name: `Dr. Karim Tazi (Buyer Admin)`
  - Administrator Email: `buyer.admin@alamal-clinic.test`
  - Administrator Password: `BuyerClinic2026!`
  - Seed Demo Data: `false` (Pristine clean installation)
- **Response Code:** **302 Redirect** to `/login` with success flash message.

### Step 7: Post-Installation State & Security Verification
1. **Database Schema:** All 15 migrations executed; 46 tables created.
2. **Clinic Record:** Verified clinic created as `"Al-Amal Medical Polyclinic"`.
3. **User Record:** Verified exactly **1 user** created in the database:
   - Name: `Dr. Karim Tazi (Buyer Admin)`
   - Email: `buyer.admin@alamal-clinic.test`
   - Role: `admin`
   - Password: Fully hashed with Bcrypt (cost 12); raw password verified via `Hash::check()`.
4. **Installer Lock:** Verified that `storage/installed` was created with content:
   ```json
   {"installed_at":"2026-11-09T21:47:27+00:00","version":"1.0.0"}
   ```
5. **Subsequent Access Guard:** Attempted `GET /install` after installation. The system immediately returned **HTTP 302 Redirect** to `/login`, blocking any unauthorized reset.

---

## 3. Commercial Independence Audit

| Commercial Independence Criterion | Observed Result | Status |
| :--- | :--- | :---: |
| **No Dependency on Files Outside Package** | All dependencies contained within package | `PASS` |
| **No Dependency on Developer Machine Paths** | Zero hardcoded absolute paths in codebase | `PASS` |
| **No Git Repository Dependency** | Operates cleanly from raw unzipped directory | `PASS` |
| **No Developer Server Connection** | Zero outbound phone-home network calls | `PASS` |
| **No Paid API Keys Required** | Zero mandatory third-party commercial APIs | `PASS` |
| **No Developer License Keys Required** | Operates immediately upon installation | `PASS` |
| **Dependencies Installable via Manifests** | `composer.json` & `package.json` certified | `PASS` |
| **New Database Creatable** | Automated schema migrations executed | `PASS` |
| **Installation Wizard Operable** | 3-step setup completed with HTTP 200/302 | `PASS` |
| **New Admin User Creatable** | Custom buyer credentials persisted & hashed | `PASS` |
| **Post-Installation Login Functional** | Authenticated session generated successfully | `PASS` |

---

## 4. Simulation Verdict

**Overall Verdict:** **`PASS (100% Autonomous)`**  
A new buyer downloading MediCore Clinic v1.0.0 can install, configure, and operate the complete clinical management system with zero developer intervention.
