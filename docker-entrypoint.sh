#!/bin/bash
set -e

# Support Render dynamic PORT environment variable (default: 80 or 10000)
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Initialize .env for production if not present
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Ensure SQLite connection for standalone instant zero-configuration demo
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/g' .env
touch database/database.sqlite
chown -R www-data:www-data database storage bootstrap/cache
chmod -R 775 database storage bootstrap/cache

# Generate APP_KEY if empty
php artisan key:generate --force

# Mark application as installed so visitors jump straight to login
touch storage/installed
chown www-data:www-data storage/installed

# Run database migrations and seed realistic clinical demo accounts
php artisan migrate:fresh --seed --force

# Cache routes and configuration for maximum performance
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "==> MediCore Clinic Live Demo is ready on port ${PORT}!"

# Execute container command (apache2-foreground)
exec "$@"
