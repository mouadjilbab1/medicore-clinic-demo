# MediCore Clinic — Installation & Deployment Guide

This guide covers complete installation instructions for the **MediCore Clinic Management System** across multiple hosting environments:
- **Method 1:** Web Installation Wizard (Recommended for all environments)
- **Method 2:** Command-Line Interface (CLI) Installation (VPS / Dedicated Server)
- **Method 3:** cPanel / Shared Hosting Deployment
- **Method 4:** Docker & Containerized Deployment

---

## 1. System Prerequisites

Before proceeding with installation, ensure your host satisfies the minimum requirements:

### Server Specifications
| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **PHP Version** | PHP 8.2 or 8.3 | PHP 8.3 |
| **Database** | MySQL 8.0, MariaDB 10.5+, or SQLite 3.35+ | MySQL 8.0 (InnoDB) |
| **Web Server** | Apache 2.4+ (with mod_rewrite) or Nginx 1.20+ | Nginx 1.24+ |
| **RAM** | 1 GB RAM (Single Doctor Practice) | 4 GB+ RAM (Multi-Branch Clinic) |
| **Disk Space** | 500 MB for core application | 20 GB+ SSD for patient documents |

### Required PHP Extensions
Ensure the following PHP modules are enabled:
```
bcmath, ctype, curl, dom, fileinfo, gd, intl, json, mbstring, openssl, pcre, pdo, pdo_mysql, pdo_sqlite, tokenizer, xml, zip
```

---

## 2. Method 1: Web Installation Wizard (GUI)

The Web Installation Wizard is the easiest and safest way to set up MediCore Clinic.

### Step 1: Upload and Extract Source Files
Extract the release package into your web server's web root (e.g., `/var/www/medicore` or `/home/username/public_html`).

### Step 2: Configure Web Server Document Root
Ensure your web server's Document Root points directly to the `/public` subdirectory, **NOT** the root application folder:
- **Correct Document Root:** `/var/www/medicore/public`
- **Incorrect Document Root:** `/var/www/medicore`

### Step 3: Set File Permissions
Ensure the web server user (`www-data`, `nginx`, or `nobody`) has write permissions to the storage and cache folders:
```bash
chmod -R 755 /var/www/medicore
chmod -R 775 /var/www/medicore/storage /var/www/medicore/bootstrap/cache
```

### Step 4: Run the Web Installer
1. Open your web browser and navigate to:
   ```
   http://your-clinic-domain.com/install
   ```
2. **Step 1 (Requirements Check):** The installer validates your PHP version, active extensions, and writable folders. Click **Continue**.
3. **Step 2 (Database Configuration):**
   - Select your database driver: **MySQL** or **SQLite**.
   - If using MySQL, input your Host (`127.0.0.1`), Port (`3306`), Database Name, Username, and Password.
   - Click **Test Database Connection** to verify connectivity before migrating.
4. **Step 3 (Clinic Profile & Administrator Setup):**
   - Enter your Clinic Name, Phone, Official Email, Physical Address, and Default Currency (e.g., USD, EUR, MAD, SAR, AED).
   - Enter your Master Administrator Name, Email, and a Secure Password (minimum 8 characters).
   - *(Optional)* Check **Seed Demo Data** if you wish to populate the system with sample doctors, patients, and sample clinical encounters. Leave unchecked for a pristine clinic setup.
5. Click **Complete Installation**.
6. The installer runs all database migrations, seeds foundational medical catalogs, creates your administrator account, and permanently locks the wizard by generating `storage/installed`.
7. You are automatically redirected to `/login` to access your new clinic system!

---

## 3. Method 2: Command-Line Installation (CLI on Linux VPS)

For system administrators deploying on Ubuntu 22.04 / 24.04 LTS or Debian 12:

### Step 1: Install Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-mysql php8.3-sqlite3 php8.3-mbstring \
    php8.3-xml php8.3-bcmath php8.3-curl php8.3-zip php8.3-gd php8.3-intl composer unzip
```

### Step 2: Deploy Source Code
```bash
sudo mkdir -p /var/www/medicore
sudo unzip MediCore-Clinic-v1.0.0.zip -d /var/www/medicore
cd /var/www/medicore

# Install production PHP dependencies
composer install --no-dev --optimize-autoloader
```
*(Note: Production frontend assets are already pre-compiled in `public/build`. You do NOT need to install Node.js or run npm build unless you customize the React source code).*

### Step 3: Configure Environment
```bash
cp .env.production.example .env
php artisan key:generate
```
Edit `.env` with your preferred text editor (e.g., `nano .env`) and set your database connection:
```env
APP_NAME="MediCore Clinic"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://clinic.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medicore_clinic
DB_USERNAME=medicore_user
DB_PASSWORD=YourSecurePasswordHere
```

### Step 4: Run Migrations and Set Permissions
```bash
php artisan migrate --force
php artisan db:seed --force
touch storage/installed

sudo chown -R www-data:www-data /var/www/medicore
sudo chmod -R 755 /var/www/medicore
sudo chmod -R 775 /var/www/medicore/storage /var/www/medicore/bootstrap/cache
```

### Step 5: Configure Nginx
Create `/etc/nginx/sites-available/medicore`:
```nginx
server {
    listen 80;
    server_name clinic.yourdomain.com;
    root /var/www/medicore/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/medicore /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. Method 3: cPanel / Shared Hosting Deployment

1. **Upload Archive:** In cPanel File Manager, upload `MediCore-Clinic-v1.0.0.zip` to your user home directory (e.g., `/home/username/`).
2. **Extract Files:** Extract the archive into a folder named `medicore` (e.g., `/home/username/medicore/`).
3. **Map Document Root:**
   - In cPanel, navigate to **Domains** or **Subdomains**.
   - Create or edit your domain so that its **Document Root** points to `/home/username/medicore/public`.
4. **Create MySQL Database:**
   - Open **MySQL Databases** in cPanel.
   - Create a new database (e.g., `username_medicore`).
   - Create a new user with a strong password and assign all privileges to the database.
5. **Launch Wizard:** Open `https://yourdomain.com/install` in your browser and complete the 3-step setup wizard.

---

## 5. Method 4: Automated Background Tasks & Cron

To enable automated appointment reminders, daily queue cleanups, and scheduled backups, add a single entry to your server's crontab:
```bash
crontab -e
```
Add the following line:
```bash
* * * * * cd /var/www/medicore && php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Post-Installation Verification

After installation, verify that:
1. Navigating to `http://your-domain.com/install` redirects immediately to `/login`.
2. Logging in with your Master Administrator credentials opens the Clinical Dashboard.
3. You can create a test patient profile and schedule an appointment.
