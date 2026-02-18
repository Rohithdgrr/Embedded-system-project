#!/bin/bash

echo ""
echo "=============================================="
echo "  ExamShield AI - Vite Frontend"
echo "=============================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Access:  http://localhost:5173"
echo ""
echo "Login:"
echo "  Admin:        admin / admin"
echo "  Invigilator:  invigilator / invigi123"
echo ""

npm run dev
