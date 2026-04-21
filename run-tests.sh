#!/bin/bash

# 1. Extract Playwright version from package.json
PW_VERSION=$(node -p "require('./package.json').devDependencies['@playwright/test'].replace(/[^0-9.]/g, '')")

echo "🚀 Detected Playwright v$PW_VERSION. Starting Docker environment..."

# 2. Run the tests using the matching Docker image
# We use 'up --build' to ensure any code changes are reflected
PW_VERSION=$PW_VERSION docker-compose -f docker-compose.test.yml up --build --exit-code-from playwright