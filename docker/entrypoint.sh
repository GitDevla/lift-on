#!/bin/sh
set -e

echo "DATABASE_URL: $DATABASE_URL"
mkdir -p ./db

echo "Seeding..."
npm run db:setup

echo "Starting app..."
exec "$@"