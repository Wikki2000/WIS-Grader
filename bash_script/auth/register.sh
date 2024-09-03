#!/bin/bash
# Sent curl request to send-token endpoint

if [ $# -ne 5 ]; then
  echo "Usage: <script> <first_name> <last_name> <email> <password> <token>"
  exit 1
fi

curl -X POST http://localhost:5001/api/v1/auth/register \
-H "Content-Type: application/json" \
-d "{\"first_name\": \"$1\", \"last_name\": \"$2\", \"email\": \"$3\", \"password\": \"$4\", \"token\": \"$5\"}"

