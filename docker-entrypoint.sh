#!/bin/sh
# Substitute environment variables in nginx config
envsubst '$API_BASE_URL,$LOGIN_URL,$MINIO_URL,$RABBIT_URL,$SWAGGER_URL,$DOZZLE_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Create env-config.js with environment variables
cat > /usr/share/nginx/html/env-config.js << EOF
window.ENV_CONFIG = {
    API_BASE_URL: "${API_BASE_URL}",
    LOGIN_URL: "${LOGIN_URL}",
    MINIO_URL: "${MINIO_URL}",
    RABBIT_URL: "${RABBIT_URL}",
    SWAGGER_URL: "${SWAGGER_URL}",
    DOZZLE_URL: "${DOZZLE_URL}"
};
EOF

# Start nginx
exec nginx -g 'daemon off;'
