#!/bin/bash

echo "Starting ChronoDivide Replays with Docker..."

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "Building and starting the application..."
docker-compose up --build

echo "Application should be available at http://localhost:3000"
