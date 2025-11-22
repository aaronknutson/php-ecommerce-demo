#!/bin/sh

set -e

echo "Waiting for MySQL to be ready..."
until php artisan db:show 2>/dev/null | grep -q "mysql"; do
    echo "MySQL is unavailable - sleeping"
    sleep 2
done

echo "MySQL is up - executing migrations and seeding"

# Run migrations
php artisan migrate --force --no-interaction

# Seed the database with demo data
php artisan db:seed --force --no-interaction

echo "Database setup complete!"

# Start PHP-FPM
exec php-fpm
