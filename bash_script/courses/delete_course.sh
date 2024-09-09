#!/bin/bash

# Check if the required parameters are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <email> <password> <course_id>"
    exit 1
fi

# Assign parameters to variables
EMAIL=$1
PASSWORD=$2
COURSE_ID=$3

# Send a POST request to the login endpoint and store cookies in cookies.txt
curl -i -X POST http://127.0.0.1:5000/account/signin \
     -H "Content-Type: application/json" \
     --data "{
               \"email\": \"$EMAIL\",
               \"password\": \"$PASSWORD\"
             }" \
     --cookie-jar cookies.txt

# Check if cookies were saved successfully
if [ ! -s cookies.txt ]; then
  echo "Login failed or no cookies saved"
  exit 1
fi

echo "Login successful. Sending DELETE request with cookie..."

# Send the stored cookies to the /courses endpoint to delete the course
curl -i -X DELETE http://127.0.0.1:5000/courses/$COURSE_ID \
     -H "Content-Type: application/json" \
     --cookie cookies.txt
