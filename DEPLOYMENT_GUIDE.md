# MediCore Clinic Management System
## Deployment, Installation & Hosting Guide

---

### 1. System Requirements & Compatibility

| Component | Minimum Requirement | Recommended Production |
|---|---|---|
| **Operating System** | Linux (Ubuntu 22.04+ / Debian 12 / AlmaLinux 9) or Windows Server | Ubuntu 22.04 LTS / 24.04 LTS |
| **PHP Version** | PHP 8.2.0 or higher | PHP 8.3 |
| **PHP Extensions** | `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `gd`, `json`, `mbstring`, `openssl`, `pdo_mysql` or `pdo_sqlite`, `tokenizer`, `xml`, `zip` | Same + `opcache` |
| **Database** | MySQL 8.0+ / MariaDB 10.6+ (or SQLite 3.35+ for small clinics) | MySQL 8.0+ with InnoDB |
| **Web Server** | Apache 2.4+ (with `mod_rewrite`) or Nginx 1.20+ | Nginx + PHP-FPM |
| **Memory (RAM)** | 2 GB RAM minimum | 4 GB - 8 GB RAM |
| **Disk Storage** | 10 GB SSD (depends on medical scan volume) | 50 GB+ NVMe SSD |

---

### 2. Method A: Self-Hosted Cloud VPS (Ubuntu + Nginx)

#### Step 1: Install System Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-cli php8.3-common php8.3-mysql \
    php8.3-zip php8.3-gd php8.3-mbstring php8.3-curl php8.3-xml php8.3-bcmath unzip git
```

#### Step 2: Configure MySQL
```sql
CREATE DATABASE medicore_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'medicore_user'@'localhost' IDENTIFIED BY 'StrongClinicPassword2026!';
GRANT ALL PRIVILEGES ON medicore_clinic.* TO 'medicore_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Step 3: Extract & Set Permissions
```bash
sudo mkdir -p /var/www/medicore
sudo unzip medicore-clinic-release.zip -d /var/www/medicore
cd /var/www/medicore

# Set ownership and permissions
sudo chown -R www-data:www-data /var/www/medicore
sudo chmod -R 755 /var/www/medicore
sudo chmod -R 775 /var/www/medicore/storage /var/www/medicore/bootstrap/cache
```

#### Step 4: Configure Nginx VirtualHost (`/etc/nginx/sites-available/medicore.conf`)
```nginx
server {
    listen 80;
    server_name clinic.yourdomain.com;
    root /var/www/medicore/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    client_max_body_size 50M;

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
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site and activate SSL with Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/medicore.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d clinic.yourdomain.com
```

#### Step 5: Configure Crontab for Automation & Scheduler
```bash
sudo crontab -u www-data -e
# Add the following line:
* * * * * cd /var/www/medicore && php artisan schedule:run >> /dev/null 2>&1
```

---

### 3. Method B: Shared Hosting / cPanel Deployment

1. **File Upload:**
   - Upload the MediCore package to your cPanel File Manager.
   - For security, place the application core files outside `public_html` (e.g., in `/home/username/medicore/`).
   - Move the contents of `public/` into `/home/username/public_html/`.
   - Update `index.php` in `public_html/` to point to the correct vendor and bootstrap paths:
     ```php
     require __DIR__.'/../medicore/vendor/autoload.php';
     $app = require_once __DIR__.'/../medicore/bootstrap/app.php';
     ```
2. **Database Setup:**
   - Open cPanel **MySQL Databases**.
   - Create a new database (e.g. `cpaneluser_medicore`) and user, granting all permissions.
3. **Run Web Installer:**
   - Open browser at `https://your-domain.com/install`.
   - The interactive 8-step wizard will test requirements, connect the database, migrate tables, and configure the clinic administrator.

---

### 4. Backup & Disaster Recovery Architecture

- **Automated Database Dumps:** Scheduled daily via `php artisan backup:run`.
- **Private Storage Snapshots:** Copies `storage/app/private/` containing patient scans and PDFs.
- **Manual Backup Button:** Available in Admin Settings for instant one-click download before system updates.
