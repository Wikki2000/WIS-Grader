# Base image
FROM python:3.9-slim

# Set working directory in the container
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application files
COPY . .

# Copy the .env file into the container
COPY .env .

# Install python-dotenv to handle environment variables
RUN pip install python-dotenv

# Expose both ports for Flask app and API
EXPOSE 5000
EXPOSE 5001

# Start both the main app and the API in parallel
CMD ["sh", "-c", "python3 app/app.py & python3 api/v1/app.py"]

