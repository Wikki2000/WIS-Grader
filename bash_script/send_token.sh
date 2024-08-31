#!/bin/bash
# Sent curl request to send-token endpoint

if [ $# -ne 2 ]; then
  echo "Usage: <script> <name> <email>"
  exit 1
fi

curl -X POST http://localhost:5001/api/v1/auth/send-token \
-H "Content-Type: application/json" \
-d "{\"name\": \"$1\", \"email\": \"$2\"}"

