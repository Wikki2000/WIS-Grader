-- Create database if not exists
CREATE DATABASE IF NOT EXISTS wis_test_db;

-- Create user if not exists
CREATE USER IF NOT EXISTS "wis_test"@"localhost" IDENTIFIED BY "12345aA@";

-- Grant priviledges
GRANT ALL ON wis_test_db.* TO "wis_test"@"localhost";
