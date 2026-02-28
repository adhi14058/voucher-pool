#!/bin/bash
set -ex

# migration
npm run prisma:migrate-prod

# start the server
npm run start:prod