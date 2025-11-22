#!/bin/sh

set -e

echo "Waiting for MySQL to be ready..."
# Use native MySQL client for faster connection check
until mysqladmin ping -h"${DB_HOST}" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent 2>/dev/null; do
    echo "MySQL is unavailable - sleeping"
    sleep 2
done

echo "MySQL is up - executing migrations and seeding"

# Run migrations
php artisan migrate --force --no-interaction

# Seed the database with demo data
php artisan db:seed --force --no-interaction

echo "Database setup complete!"

# Start supervisor to manage NGINX and PHP-FPM
exec /usr/bin/supervisord -c /etc/supervisord.conf
