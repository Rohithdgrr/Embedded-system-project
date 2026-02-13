#!/bin/bash
cd "$(dirname "$0")/backend"
echo "Starting Spring Boot Backend..."
echo "Access: http://localhost:8080"
echo "API: http://localhost:8080/api/sessions"
echo ""
mvn spring-boot:run -DskipTests
