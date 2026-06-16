#!/bin/sh
# Substitute environment variables in nginx config
envsubst '$API_BASE_URL,$LOGIN_URL,$MINIO_URL,$RABBIT_URL,$SWAGGER_URL,$DOZZLE_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
