FROM php:8.3-fpm-alpine

# Set working directory
WORKDIR /var/www

# Install system dependencies, PHP extensions, NGINX, and supervisor
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip \
    git \
    mysql-client \
    nginx \
    supervisor \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www

# Copy NGINX configuration
COPY docker/nginx/nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisord.conf

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/log/nginx \
    && chown -R www-data:www-data /var/lib/nginx

# Install PHP dependencies (including dev dependencies for seeding)
RUN composer install --optimize-autoloader --no-interaction

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Health check - longer start period for migrations/seeding
# Check both NGINX and PHP-FPM are running
HEALTHCHECK --interval=30s --timeout=3s --start-period=90s --retries=3 \
    CMD pgrep -f "nginx: master" && pgrep -f "php-fpm: master" || exit 1

# Expose port 80 for NGINX
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
