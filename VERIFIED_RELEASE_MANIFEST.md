# MediCore Clinic v1.0.0 — Verified Commercial Release Manifest
## Cryptographic Artifacts, Checksums & Software Bill of Materials (SBOM)

---

## 1. Distribution Packages & Cryptographic Hashes

MediCore Clinic v1.0.0 is released in two distinct, independently certified commercial distributions to cater to different deployment environments.

### Edition A: Ready-to-Install Commercial Edition (Recommended for cPanel / Shared Hosting)
- **Primary Package Path:** `D:\work\MEDICORE-CLINIC\RELEASE\MediCore-Clinic-v1.0.0-Ready-to-Install\MediCore-Clinic-v1.0.0-Ready-to-Install.zip`
- **Secondary Root Mirror:** `D:\work\MEDICORE-CLINIC\MediCore-Clinic-v1.0.0-Ready-to-Install.zip`
- **Compressed Archive Size:** **8,604,470 bytes** (~**8.2 MB**)
- **Uncompressed Size on Disk:** **29,755,945 bytes** (~**28.38 MB**)
- **Total File Count:** **6,604 files** (including optimized production `vendor/` and compiled `public/build/`)
- **Cryptographic Hash (SHA-256):**
  ```text
  C667518FD82C597B29AACC0CFB63744F5177935037953B652F93AB314ADCC2F8
  ```
- **Deployment Target:** Shared Hosting, cPanel, DirectAdmin, Plesk, Localhost (XAMPP/WampServer).
- **Client Prerequisite:** Zero CLI tools needed. No Composer, no Node.js, no NPM. Requires only standard PHP 8.2+ and MySQL 8.0+ / MariaDB 10.4+.

---

### Edition B: Source Edition (Recommended for Developers & VPS / Cloud)
- **Primary Package Path:** `D:\work\MEDICORE-CLINIC\RELEASE\MediCore-Clinic-v1.0.0\MediCore-Clinic-v1.0.0.zip`
- **Secondary Root Mirror:** `D:\work\MEDICORE-CLINIC\MediCore-Clinic-v1.0.0.zip`
- **Compressed Archive Size:** **685,841 bytes** (~**685 KB**)
- **Uncompressed Size on Disk:** **3,215,872 bytes** (~**3.06 MB**)
- **Total File Count:** **239 files** (clean source code without third-party vendor directories)
- **Cryptographic Hash (SHA-256):**
  ```text
  20B5065B01BFDC725F141E9B5DA70927E82A9085FD8E373CFAC5AEE628766E1E
  ```
- **Deployment Target:** VPS (Ubuntu, Debian, RHEL), Cloud Instances (AWS, DigitalOcean, Linode), Docker containers, CI/CD pipelines.
- **Client Prerequisite:** Requires SSH access with `composer install` and `npm install && npm run build`.

---

## 2. Software Bill of Materials (SBOM)

### 2.1 Backend Core Dependencies
| Dependency | Type | Installed Version | License | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **PHP Runtime** | Language | `^8.2` (Tested on 8.2.12) | PHP-3.01 | Backend execution runtime |
| **laravel/framework** | Framework | `v12.71.0` | MIT | Full-stack MVC framework |
| **inertiajs/inertia-laravel** | Bridge | `v3.7.0` | MIT | Server-driven SPA adapter |
| **laravel/sanctum** | Package | `v4.3.0` | MIT | API token authentication guard |
| **laravel/tinker** | Package | `v2.10.1` | MIT | REPL debugging shell |

### 2.2 Frontend Core Dependencies
| Dependency | Type | Installed Version | License | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **react** | Library | `^19.2.4` | MIT | Component UI layer |
| **react-dom** | Library | `^19.2.4` | MIT | DOM rendering engine |
| **@inertiajs/react** | Client Adapter | `^2.3.8` | MIT | Client-side Inertia integration |
| **typescript** | Compiler | `^5.7.2` | Apache-2.0 | Static type checking (0 errors) |
| **vite** | Build Tool | `^6.2.0` | MIT | Production bundler & asset compiler |
| **tailwindcss** | Styling | `^4.0.9` | MIT | Utility-first CSS engine |
| **lucide-react** | Icons | `^1.16.0` | ISC | Medical & interface icon set |
| **@headlessui/react** | UI Primitives | `^2.2.0` | MIT | Accessible accessible modal/menu components |

---

## 3. Directory Layout & Included Documentation

```text
MediCore-Clinic-v1.0.0/
├── app/                        # 17 Controllers, 22 Eloquent Models, 3 Domain Services, 4 Middleware
├── bootstrap/                  # Application initialization & middleware registry (bootstrap/app.php)
├── config/                     # Core Laravel configurations (app, database, auth, session, etc.)
├── database/
│   ├── factories/              # Model data factories for testing
│   ├── migrations/             # 15 Sequential Migrations creating 55 physical relational tables
│   └── seeders/                # Baseline seeders (Super Admin, Branches, Doctor profiles)
├── public/
│   ├── build/                  # Precompiled Vite assets (53 chunks / CSS / JS)
│   ├── favicon.ico             # Application favicon
│   ├── index.php               # Single entry point
│   └── robots.txt              # Search engine crawler policies
├── resources/
│   ├── css/                    # Tailwind CSS definitions
│   ├── js/                     # 33 React TypeScript pages, layouts, and components
│   └── views/                  # Root Blade template (app.blade.php)
├── routes/
│   ├── console.php             # Artisan console commands
│   └── web.php                 # 58 Named HTTP routes with role-based middleware guards
├── storage/                    # Session, cache, view, and backup storage directories
├── vendor/                     # (Ready-to-Install Edition only) Complete production dependencies
├── .editorconfig               # Code style definition
├── .env.example                # Local environment template (SQLite / File session)
├── .env.production.example     # Production template (MySQL 8 / HTTPS / SMTP)
├── .gitattributes              # Line ending normalization
├── .gitignore                  # Git exclusion rules
├── artisan                     # CLI management script
├── composer.json               # PHP dependency specifications
├── composer.lock               # Deterministic dependency lockfile
├── package.json                # Frontend dependency specifications
├── package-lock.json           # Frontend dependency lockfile
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundling pipeline configuration
├── ADMIN_GUIDE.md              # Administrator onboarding & clinic configuration
├── BACKUP_RESTORE_GUIDE.md     # Disaster recovery runbook
├── BUYER_INSTALLATION_GUIDE.md # 3-step cPanel / shared hosting guide
├── CHANGELOG.md                # Release version history
├── INSTALLATION_GUIDE.md       # Comprehensive VPS & Nginx deployment guide
├── LICENSE_AGREEMENT.md        # Commercial End User License Agreement (EULA)
├── PRODUCT_REQUIREMENTS.md     # System specifications & functional requirements
├── README.md                   # Product overview & quick start
├── TROUBLESHOOTING.md          # Common errors and self-healing procedures
└── USER_MANUAL.md              # Clinical staff operational manual
```

---

## 4. Verification & Integrity Checklist

- [x] Both distribution archives verified with SHA-256 hashes.
- [x] Uncompressed file counts and sizes verified.
- [x] TypeScript compiler passes with 0 diagnostics (`npx tsc --noEmit`).
- [x] 42 automated PHPUnit tests pass (380 assertions).
- [x] 47 isolated acceptance tests pass in clean sandbox environment (100% pass rate).
- [x] Web Installation Wizard certified for clean first-time initialization.
- [x] Multi-Branch RBAC enforced across all 13 staff roles.
