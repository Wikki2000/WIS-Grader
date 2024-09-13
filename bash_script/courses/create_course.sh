#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <email> <password>"
  exit 1
fi

# Declare variables for email and password
EMAIL="$1"
PASSWORD="$2"

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

# Send the stored cookies to the /courses endpoint
curl -X POST http://127.0.0.1:5000/courses \
     -H "Content-Type: application/json" \
     --cookie cookies.txt \
     -d '{
           "course_title": "Introduction to PHP",
           "course_code": "CS801",
           "semester": "Fall 2023",
           "credit_load": 5
         }'

