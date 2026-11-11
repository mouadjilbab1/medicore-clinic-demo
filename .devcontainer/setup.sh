#!/bin/bash
set -e

echo "==> Configuring MediCore Clinic Demo Environment..."

# Setup .env if not present
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Configure SQLite for instant zero-config database
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/g' .env
touch database/database.sqlite

# Install Composer dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader

# Generate Application Key
php artisan key:generate --force

# Run migrations and seed realistic clinical demo data
php artisan migrate:fresh --seed --force

# Install Node dependencies and compile production assets
npm install
npm run build

echo "==> MediCore Clinic Demo Environment successfully initialized!"
