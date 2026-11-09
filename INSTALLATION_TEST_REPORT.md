# MediCore Clinic Management System
## Installation Wizard & Provisioning Test Report

**Date:** November 9, 2026  
**Module:** First-Time Self-Hosted Web Installer (`InstallController.php` & `Install/Wizard.tsx`)  
**Evaluation Standard:** Zero-configuration initialization, environment validation, database migration, clinic creation, administrator provisioning, and installer lock.  

---

### 1. Installation Flow Walkthrough

The self-hosted installation wizard was executed and tested through its 8 logical stages:

#### Step 1: Welcome & Perpetual License Agreement
- Displays product identity, perpetual single-clinic license rights, zero telemetry commitment, and local data ownership.
- Result: **PASS**.

#### Step 2: Server Pre-Requisites & Permissions
- Verifies real runtime requirements dynamically:
  - `PHP >= 8.2.0`: Detected active PHP 8.2.12 (**Satisfied**)
  - `PDO Extension`: Active (**Satisfied**)
  - `OpenSSL Extension`: Active (**Satisfied**)
  - `Mbstring Extension`: Active (**Satisfied**)
  - `Fileinfo Extension`: Active (**Satisfied**)
  - `GD / Image Extension`: Active (**Satisfied**)
  - `Storage Directory Writable`: `storage/` directory writable (**Satisfied**)
  - `Bootstrap Cache Writable`: `bootstrap/cache/` directory writable (**Satisfied**)
- Result: **PASS**. Next button is conditionally enabled only when all checks pass.

#### Step 3: Database Engine Configuration & Live Probe
- Allows clinic administrator to select between **SQLite** (instant file-based setup) and **MySQL 8.0+** (enterprise multi-branch).
- Interactive "Test Database Connectivity" button executes an AJAX POST to `/install/test-db` without reloading the page.
- Result: **PASS** (tested in `InstallationWizardTest::test_installer_db_test_endpoint_returns_json_response`).

#### Step 4: Clinic Profile & Facility Identity
- Collects clinic legal name, phone, email, physical address, and base currency code (USD, EUR, MAD, SAR, AED, GBP).
- Result: **PASS**.

#### Step 5: Master Super Administrator Account Setup
- Validates full name, email, and strong password (min 8 characters).
- Provides optional checkbox: "Seed Realistic Clinical Dataset" (generates demo patients, doctors, odontograms, refractions, prescriptions).
- Result: **PASS**.

#### Step 6 & 7: Provisioning Execution
- Triggers `Artisan::call('migrate', ['--force' => true])`.
- Creates master `Clinic` and primary `Branch` (`BRN-MAIN`).
- Encrypts master password using `Hash::make()` and establishes administrator user with `role = admin`.
- Runs seeders if checked.
- Generates `storage/installed` containing ISO timestamp and software version.
- Result: **PASS**.

#### Step 8: Completion & Security Lock
- Redirects user to `/login` with success banner.
- Any subsequent attempt to access `/install` or submit `/install/complete` is immediately intercepted by `EnsureInstalled` middleware and redirected to `/login`.
- Result: **PASS** (tested in `InstallationWizardTest::test_installer_is_locked_when_lock_file_exists`).

---

### 2. cPanel & Shared Hosting Deployment Evaluation

- **PHP Version Requirements:** cPanel MultiPHP Manager must be set to PHP 8.2 or PHP 8.3.
- **Directory Root Configuration:** On cPanel, the domain document root must point to the `/public` subdirectory of the application.
- **Symlink Support:** Standard `storage:link` creates public access for uploaded logos and patient profile photos.
- **Verdict:** Fully deployable on standard cPanel hosting with zero Docker or Redis prerequisites.

---

### 3. Installation Audit Verdict

**INSTALLATION WIZARD AUDIT: PASS**  
The wizard is fully operational, verifies server compatibility, provisions the database atomically, and securely locks the instance against re-installation tampering.
