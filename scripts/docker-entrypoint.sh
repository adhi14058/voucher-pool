#!/bin/bash
set -ex

echo "Starting with CONFIG_ENVIRONMENT=${CONFIG_ENVIRONMENT:-not set}"

# migration
npm run prisma:migrate-prod

# start the server
npm run start:prod