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

# Try mysqladmin first, but show error if it fails
MAX_ATTEMPTS=5
ATTEMPT=0
MYSQL_READY=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    if mysqladmin ping -h"${DB_HOST}" -P"${DB_PORT:-3306}" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent 2>/tmp/mysql_error.log; then
        MYSQL_READY=1
        break
    fi
    echo "MySQL ping failed (attempt $ATTEMPT/$MAX_ATTEMPTS) - sleeping"
    sleep 2
done

# If mysqladmin failed, show the error and try Laravel connection
if [ $MYSQL_READY -eq 0 ]; then
    echo "WARNING: mysqladmin ping failed. Error:"
    cat /tmp/mysql_error.log 2>/dev/null || echo "No error details available"
    echo ""
    echo "Attempting connection using Laravel artisan..."

    # Try using Laravel's connection test instead
    MAX_ATTEMPTS=15
    ATTEMPT=0
    until php artisan db:show 2>/dev/null | grep -q "mysql\|Mysql\|MySQL"; do
        ATTEMPT=$((ATTEMPT + 1))
        if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
            echo "ERROR: Failed to connect to MySQL after $MAX_ATTEMPTS attempts"
            echo "Last error from mysqladmin:"
            cat /tmp/mysql_error.log 2>/dev/null
            echo ""
            echo "Please verify:"
            echo "1. Database user '${DB_USERNAME}' exists in MySQL"
            echo "2. Password is correct"
            echo "3. User has permissions: GRANT ALL ON ${DB_DATABASE}.* TO '${DB_USERNAME}'@'%'"
            exit 1
        fi
        echo "Laravel database connection not ready (attempt $ATTEMPT/$MAX_ATTEMPTS) - sleeping"
        sleep 2
    done
fi

echo "MySQL is up - executing migrations and seeding"

# Run migrations
php artisan migrate --force --no-interaction

# Seed the database with demo data
php artisan db:seed --force --no-interaction

echo "Database setup complete!"

# Start supervisor to manage NGINX and PHP-FPM
exec /usr/bin/supervisord -c /etc/supervisord.conf
