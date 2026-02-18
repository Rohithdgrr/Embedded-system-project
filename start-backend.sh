#!/bin/bash

echo ""
echo "=============================================="
echo "  ExamShield AI - Spring Boot Backend"
echo "=============================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"

echo "Access:  http://localhost:8080"
echo "API:     http://localhost:8080/api/sessions"
echo "Notify:  http://localhost:8080/api/notifications/send"
echo ""

if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw clean spring-boot:run -DskipTests
else
    mvn clean spring-boot:run -DskipTests
fi
