#!/usr/bin/env bash

set -e

echo "======================================"
echo " Starting Backend Services"
echo "======================================"

# --------------------------------------
# Load environment variables
# --------------------------------------

ENV_FILE="ai-service-demo/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE not found."
    exit 1
fi

set -a
source "$ENV_FILE"
set +a

echo "Environment variables loaded."


# --------------------------------------
# CBOMKit environment
# --------------------------------------

export CBOMKIT_VERSION="2.3.0"
export CBOMKIT_VIEWER="false"
export POSTGRESQL_AUTH_USERNAME="cbomkit"
export POSTGRESQL_AUTH_PASSWORD="cbomkit"


# --------------------------------------
# Check Docker Engine
# --------------------------------------

echo "[1/3] Checking Docker Engine..."

if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker Engine is not running."
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "Docker Engine is running."


# --------------------------------------
# Start CBOMKit
# --------------------------------------

echo "[2/3] Starting CBOMKit..."

cd docker

docker compose -f docker-compose-cbomkit.yml  --profile prod up -d
cd ..

echo "CBOMKit started."


# --------------------------------------
# Start AI Service
# --------------------------------------

echo "[3/3] Starting AI service..."

uv run uvicorn "ai-service-demo.app:app" \
    --reload \
    --env-file "$ENV_FILE"