#!/bin/bash

# Variables
DB_NAME="wis_test_db"
DB_USER="wis_test"
DB_PWD="wis_test_pwd"
REPO_DIR="/home/wikki2000/App-Data-Backups/wisgrader"
DATE=$(date +'%Y-%m-%d')
BACKUP_FILE="backup_$DATE.sql"
ARCHIVE_FILE="backup_$DATE.tar.gz"

# step 0: Change directory to the repository
cd "$REPO_DIR"  || {
    echo "Error: Failed to change directory to $REPO_DIR."
    exit 1
}

# Step 1: Create a backup of the database
echo "Creating backup of the database: $DB_NAME..."
mysqldump -u "$DB_USER" -p"$DB_PWD" "$DB_NAME" > "$REPO_DIR/$BACKUP_FILE" || {
    echo "Error: Failed to create database backup."
    exit 1
}

# Step 2: Archive and compress the backup
echo "Archiving and compressing the backup..."
tar -czvf "$ARCHIVE_FILE" "$BACKUP_FILE"
if [ $? -ne 0 ]; then
    echo "Error: Failed to archive and compress the backup."
    exit 1
fi

# Step 3: Commit and push the changes to the repository
echo "Pushing the backup to the repository..."
git add "$ARCHIVE_FILE"
git commit -m "Weekly backup: $DATE"
git push
if [ $? -ne 0 ]; then
    echo "Error: Failed to push the backup to the repository."
    exit 1
fi

# Step 4: Clean up local backup files
echo "Cleaning up local backup files..."
rm "$BACKUP_FILE"
rm "$ARCHIVE_FILE"

echo "Backup, archive, and push completed successfully."
