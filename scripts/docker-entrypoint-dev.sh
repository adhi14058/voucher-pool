#!/bin/bash
set -ex

echo "Starting with CONFIG_ENVIRONMENT=${CONFIG_ENVIRONMENT:-unknown}"

# migration
npm run prisma:migrate-prod

# start the server
npm run start:dev