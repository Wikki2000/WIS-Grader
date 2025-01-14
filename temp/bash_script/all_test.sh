#!/bin/bash
# Run all unittest in a directory
if [ $# -ne 1 ]; then
  echo "Usage: <script> <path_to_directory>"
  exit 1
fi
python3 -m unittest discover -s $1
