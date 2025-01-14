#!/bin/bash

# Update and upgrade the system package list
sudo apt update && sudo apt upgrade -y

# Install Python 3 and necessary Python development tools
sudo apt install -y python3 python3-dev python3-pip python3.10-venv

# Install pkg-config for managing compile and link flags for libraries
sudo apt install -y pkg-config

# Install MySQL client library and development headers
sudo apt install -y libmysqlclient-dev

# Install MySQL server
sudo apt install -y mysql-server

# Install Redis server
sudo apt install -y redis-server

# Clean up unnecessary files after installation
sudo apt autoremove -y

echo "Installation completed successfully."
