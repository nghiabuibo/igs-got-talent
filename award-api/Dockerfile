# Use a PHP base image
FROM php:apache

# Install dependencies and required tools
RUN apt-get update && apt-get install -y wget

# Install Git
RUN apt-get install git -y

# Confirm Git version
RUN git --version

# Copy apache config
COPY ./conf/ports.conf /etc/apache2/ports.conf
COPY ./conf/000-default.conf /etc/apache2/sites-available/000-default.conf

# Download and install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Confirm Composer installation
RUN composer --version

# set working directory
WORKDIR /var/www/html

# Your Dockerfile can include additional configurations and steps as needed
ENTRYPOINT composer install --no-interaction && chown -R www-data /var/www/html/vendor && apachectl -D FOREGROUND