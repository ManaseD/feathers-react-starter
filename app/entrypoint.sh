#!/bin/bash
set -e

npm run build-client && npm run build-server

exec "$@"
