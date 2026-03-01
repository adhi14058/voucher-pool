#!/bin/bash
set -e

echo "Starting with CONFIG_ENVIRONMENT=${CONFIG_ENVIRONMENT:-unknown}"

# migration
npm run prisma:migrate-prod

# start the server
npm run start:prod
