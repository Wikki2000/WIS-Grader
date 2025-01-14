#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -lt 4 ]; then
    echo "Usage: $0 <email> <password> <course_id> <PUT/DELETE> [course_title] [course_code] [credit_load] [semester]"
    exit 1
fi

email=$1
password=$2
course_id=$3
method=$4
api_base_url="http://127.0.0.1:5000"  # Replace with your API's base URL

# Login to get cookies
echo "Logging in with email: $email"
login_response=$(curl -i -s -X POST "${api_base_url}/account/signin" \
    -H "Content-Type: application/json" \
    --data '{
               "email": "'"$email"'",
               "password": "'"$password"'"
             }' \
    --cookie-jar cookies.txt)

# Check if login was successful
if echo "$login_response" | grep -q "200 OK"; then
    echo "Login successful."
    echo ""
else
    echo "Login failed or no cookies saved"
    exit 1
fi

# Send the request based on the method (DELETE or PUT)
if [ "$method" == "DELETE" ]; then
    echo "Sending DELETE request to delete course with ID: $course_id"
    curl -s -X DELETE "${api_base_url}/courses/${course_id}" \
        -H "Content-Type: application/json" \
        --cookie cookies.txt

elif [ "$method" == "PUT" ]; then
    # Check if the required course data is provided for PUT
    if [ "$#" -lt 8 ]; then
        echo "For PUT request, you must provide course_title, course_code, credit_load, and semester."
        echo "Usage: $0 <email> <password> <course_id> PUT <course_title> <course_code> <credit_load> <semester>"
        exit 1
    fi
    
    course_title=$5
    course_code=$6
    credit_load=$7
    semester=$8

    echo "Sending PUT request to update course with ID: $course_id"
    echo ""
    curl -i -X PUT "${api_base_url}/courses/${course_id}" \
        -H "Content-Type: application/json" \
        --cookie cookies.txt \
        -d '{
                "course_title": "'"$course_title"'",
                "course_code": "'"$course_code"'",
                "credit_load": '"$credit_load"',
                "semester": "'"$semester"'"
            }'
    
else
    echo "Invalid method. Use PUT or DELETE."
    exit 1
fi
