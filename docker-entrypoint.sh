#!/bin/sh

# Set default backend URL if not provided
# For local development: http://host.docker.internal:8180
# For production: https://api.reshala.n4d3sh1k4.site (or whatever your API is)
export BACKEND_URL=${BACKEND_URL:-"http://host.docker.internal:8180/api"}
export API_BASE_URL=${API_BASE_URL:-"/api"}
export LOGIN_URL=${LOGIN_URL:-"/v0/auth/login"}
export MINIO_URL=${MINIO_URL:-"/admin/minio/"}
export RABBIT_URL=${RABBIT_URL:-"/admin/rabbit/"}
export SWAGGER_URL=${SWAGGER_URL:-"/admin/swagger/index.html"}
export DOZZLE_URL=${DOZZLE_URL:-"/admin/monitoring/"}

envsubst '$BACKEND_URL,$API_BASE_URL,$LOGIN_URL,$MINIO_URL,$RABBIT_URL,$SWAGGER_URL,$DOZZLE_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

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
