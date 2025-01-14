#!/bin/bash

# Check if email and password are provided as arguments
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <email> <password> <student_id>"
  exit 1
fi

# Declare variables from arguments
EMAIL="$1"
PASSWORD="$2"
STUDENT_ID="$3"

# Check if email and password are not empty
if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Error: Both email and password must be provided."
  exit 1
fi

# Send a POST request to the login endpoint and store cookies in cookies.txt
curl -i -X POST http://127.0.0.1:5000/account/signin \
     -H "Content-Type: application/json" \
     --data "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" \
     --cookie-jar cookies.txt

# Check if cookies were saved successfully
if [ ! -s cookies.txt ]; then
  echo "Login failed or no cookies saved"
  exit 1
fi

echo "Login successful. Sending request with cookie..."

# Send the stored cookies to the /students/<student_id> endpoint
curl -i -X GET http://127.0.0.1:5000/students/$STUDENT_ID  \
     -H "Content-Type: application/json" \
     --cookie cookies.txt
