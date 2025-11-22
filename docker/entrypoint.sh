#!/bin/sh

set -e

echo "Waiting for MySQL to be ready..."
echo "DB_HOST: ${DB_HOST}"
echo "DB_PORT: ${DB_PORT:-3306}"
echo "DB_USERNAME: ${DB_USERNAME}"
echo "DB_DATABASE: ${DB_DATABASE}"

# Wait for MySQL port to be open first
until nc -z "${DB_HOST}" "${DB_PORT:-3306}" 2>/dev/null; do
    echo "MySQL port is not open - sleeping"
    sleep 2
done

echo "MySQL port is open, checking if database is ready..."

# Now check if MySQL is actually ready to accept connections
MAX_ATTEMPTS=30
ATTEMPT=0
until mysqladmin ping -h"${DB_HOST}" -P"${DB_PORT:-3306}" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent 2>/dev/null; do
    ATTEMPT=$((ATTEMPT + 1))
    if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
        echo "ERROR: Failed to connect to MySQL after $MAX_ATTEMPTS attempts"
        echo "Please verify your database credentials and network connectivity"
        exit 1
    fi
    echo "MySQL is not ready (attempt $ATTEMPT/$MAX_ATTEMPTS) - sleeping"
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
