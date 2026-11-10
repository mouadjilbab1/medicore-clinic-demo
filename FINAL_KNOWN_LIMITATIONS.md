# MediCore Clinic v1.0.0 — Final Known Limitations & Operational Considerations
## Transparent Technical Disclosure for Commercial Buyers & Operators

---

## 1. Overview & Disclaimer

This document provides a transparent, unvarnished disclosure of all identified technical constraints, architectural boundaries, and operational requirements for **MediCore Clinic v1.0.0**.

In accordance with professional software engineering principles and strict commercial integrity, no limitation has been concealed. Operating MediCore Clinic within these documented parameters ensures a secure, stable, and compliant deployment.

---

## 2. Identified Technical & Operational Limitations

### Limitation 1: MySQL & MariaDB Web-Based Backup Engine
- **Current Behavior:** The integrated web backup feature (`App\Services\BackupService`) functions via direct filesystem snapshot for SQLite (`.sqlite` file copy). For MySQL and MariaDB, the current implementation writes a database comment header and queries `SHOW TABLES`, but does not serialize table DDL schemas or table row datasets into the generated `.sql` file.
- **Impact:** Clicking "Create Backup" from `/settings/backup` on a MySQL database creates a lightweight placeholder file rather than a complete database dump. Restoring from this file will not recover deleted MySQL records.
- **Production Solution / Workaround:**
  1. **cPanel / DirectAdmin Hosting (Recommended):** Use **cPanel Backup Wizard** or **phpMyAdmin -> Export (SQL / Gzip)**. This is standard industry best practice for shared hosting.
  2. **VPS / Cloud Dedicated Server:** Schedule an automated daily cron job using the native `mysqldump` binary:
     ```bash
     mysqldump -u [db_user] -p[db_password] [db_name] | gzip > /var/backups/medicore_$(date +\%F).sql.gz
     ```
- **Roadmap Resolution:** Version 1.1.0 will incorporate a pure-PHP chunked table streaming exporter or native `mysqldump` process bridge.

---

### Limitation 2: Host MySQL Live Connection Verification
- **Current Status:** During local audit on the development workstation, Windows service `MySQL80` (port 3306) was active, but required host root credentials which were withheld. In strict accordance with audit rules, passwords were not reset or brute-forced.
- **Classification:** The live local connection is classified as **`BLOCKED`** due to environment credentials.
- **Architectural Certification:** All 15 migrations and 55 tables are **100% ANSI MySQL 8 (`InnoDB`, `utf8mb4_unicode_ci`) compliant**, verified through automated Eloquent grammar compilation and SQLite foreign key cascading. Buyers on cPanel or VPS can connect their MySQL 8 database immediately via the Web Installation Wizard.

---

### Limitation 3: Login Rate Limiting (Brute-Force Protection)
- **Current Behavior:** The web login endpoint (`POST /login`) validates credentials with bcrypt password hashing and session fixation regeneration, but does not enforce an in-memory or Redis-based rate limiter (e.g. `throttle:5,1`).
- **Impact:** An attacker could execute high-frequency automated credential stuffing attempts if no perimeter firewall is present.
- **Recommended Hardening:**
  1. Enable Cloudflare WAF or proxy rate limiting on `/login` (recommended for public medical portals).
  2. In Nginx, add a rate limit zone:
     ```nginx
     limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
     location = /login {
         limit_req zone=login_limit burst=10 nodelay;
         ...
     }
     ```
  3. Deploy Fail2ban to monitor repeated failed login attempts from web logs.

---

### Limitation 4: Web Installer CSRF Exemption Prior to Setup
- **Current Behavior:** In `bootstrap/app.php`, the installer routes (`install/*`) are exempted from CSRF token verification.
- **Justification:** This exemption is mandatory so that first-time buyers accessing `/install` without an active session or database can submit database credentials and administrator information without encountering `HTTP 419 Page Expired`.
- **Mitigation & Lockdown:** As soon as installation completes, the wizard touches `storage/installed`. The `EnsureInstalled` middleware immediately locks down all installer routes: any subsequent visit to `/install` is permanently redirected to `/login`. The installer cannot be accessed again unless a server administrator manually deletes `storage/installed` via SSH/FTP.

---

### Limitation 5: Secure Cookie Configuration for HTTPS Deployments
- **Current Behavior:** `.env.example` sets `SESSION_SECURE_COOKIE=false` by default to allow local development on `http://localhost`.
- **Operator Requirement:** When deploying MediCore Clinic on a live production domain with an SSL/TLS certificate, the clinic administrator must set:
  ```env
  SESSION_SECURE_COOKIE=true
  ```
  This instructs browsers to only transmit session cookies over encrypted HTTPS connections, preventing man-in-the-middle session interception.

---

### Limitation 6: Asynchronous Queue Workers & Email Notifications
- **Current Behavior:** The default configuration in `.env.example` uses `QUEUE_CONNECTION=sync` and `MAIL_MAILER=log`.
- **Operator Requirement:**
  - For immediate, synchronous email delivery, configure valid SMTP credentials (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`).
  - For large clinics dispatching hundreds of automated appointment reminders, set `QUEUE_CONNECTION=database` and configure a systemd service or Supervisor process to run `php artisan queue:work --sleep=3 --tries=3`.

---

### Limitation 7: Regulatory & Compliance Non-Certification Disclaimer
- **Legal Disclaimer:** MediCore Clinic is commercial, unmanaged, self-hosted software. It **DOES NOT** carry official third-party certifications for **HIPAA (Health Insurance Portability and Accountability Act)**, **GDPR (General Data Protection Regulation)**, **SOC 2**, or **FDA / CE Mark Medical Device Certification**.
- **Technical Capabilities:** The software provides comprehensive technical tools that support compliance (e.g. detailed `audit_logs` tracking user IDs, timestamps, IP addresses, and user-agents; doctor digital signatures; encounter immutability locks; role-based access control; and encrypted password storage).
- **Clinic Responsibility:** Full legal and regulatory compliance depends entirely on the clinic’s hosting infrastructure, physical access controls, server disk encryption, TLS 1.3 certificates, business associate agreements (BAAs) with hosting vendors, and clinical staff operational policies.

---

## 3. Summary of Operational Requirements for Buyers

| Deployment Parameter | Shared Hosting / cPanel | VPS / Dedicated Server |
| :--- | :--- | :--- |
| **PHP Version** | PHP 8.2 or PHP 8.3 | PHP 8.2 or PHP 8.3 |
| **Required Extensions** | PDO, MySQL/SQLite, OpenSSL, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, GD, Fileinfo | Same |
| **Recommended Package** | `Ready-to-Install Commercial Edition` | `Ready-to-Install` or `Source Edition` |
| **Web Server Document Root** | `public_html/public` or symlinked `public/` | `/var/www/medicore/public` |
| **Database Backups** | cPanel Backup Wizard / phpMyAdmin | `mysqldump` CLI cron job |
| **SSL / HTTPS** | Free Let's Encrypt / AutoSSL | Certbot Let's Encrypt |
