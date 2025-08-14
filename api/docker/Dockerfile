FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    acl \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_pgsql pgsql
RUN a2enmod rewrite

COPY ./docker/000-default.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

#install dependecies
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY . .
RUN composer install

#set permission to the entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]
