# PostgreSQL Database Setup for Quatrain Core

This document provides instructions for setting up the PostgreSQL database for the Quatrain Core backend-postgres package.

## Prerequisites

- PostgreSQL 12+ installed and running
- Database user with CREATE privileges
- `psql` command-line tool available

## Database Setup

### Option 1: Full Development Schema (Recommended for Development)

The full schema includes foreign key constraints, triggers, and audit fields:

```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE quatrain_dev;"

# Run the full schema
psql -U postgres -d quatrain_dev -f schema.sql
```

### Option 2: Test Schema (Recommended for Testing)

The test schema is simplified without constraints for easier testing:

```bash
# Connect to PostgreSQL and create test database
psql -U postgres -c "CREATE DATABASE quatrain_test;"

# Run the test schema
psql -U postgres -d quatrain_test -f test-schema.sql
```

## Environment Variables

Set the following environment variables for your application:

### Development

```bash
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=quatrain_dev
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=your_password
```

### Testing

```bash
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=quatrain_test
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=your_password
```

## Schema Overview

### Tables Created

#### `entities` table

- Stores organization/entity information
- Used as foreign key reference for users
- Includes audit fields (created/updated/deleted by/at)

#### `user` table

- Stores user account information
- Includes authentication fields (email, hashed password)
- Profile fields (firstname, lastname, gender, birthday, phone)
- Optional relationship to entities table
- Includes audit fields

### Key Features

#### Full Schema (schema.sql)

- **Constraints**: Data validation and referential integrity
- **Triggers**: Auto-update name field and timestamps
- **Indexes**: Performance optimization for common queries
- **Sample Data**: Pre-populated test users and entities
- **View**: `user_details` for easier querying with joins

#### Test Schema (test-schema.sql)

- **Minimal Structure**: Just the essential fields and types
- **No Constraints**: Easier for testing edge cases
- **Basic Indexes**: Essential performance indexes only
- **Minimal Data**: One test user and entity

## Usage with PostgresAdapter

The PostgresAdapter expects tables to follow these naming conventions:

- Table names should be lowercase
- The `user` table must be quoted as `"user"` (PostgreSQL reserved word)
- Primary key field is always `id` (UUID type)
- Collection names map to table names (e.g., User.COLLECTION = 'user')

## Running Tests

Make sure your test database is set up before running tests:

```bash
# Setup test database
psql -U postgres -c "CREATE DATABASE quatrain_test;"
psql -U postgres -d quatrain_test -f test-schema.sql

# Run tests
yarn test-ci
```

## Docker Setup (Optional)

For a quick PostgreSQL setup using Docker:

```bash
# Start PostgreSQL container
docker run --name quatrain-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=quatrain_dev \
  -p 5432:5432 \
  -d postgres:14

# Wait for container to start, then run schema
sleep 10
docker exec -i quatrain-postgres psql -U postgres -d quatrain_dev < schema.sql
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure your PostgreSQL user has CREATE privileges
2. **Database Already Exists**: Drop the database first: `DROP DATABASE quatrain_dev;`
3. **Connection Refused**: Check if PostgreSQL is running and accepting connections
4. **UUID Extension**: If you get UUID errors, enable the extension: `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`

### Useful Commands

```sql
-- Check table structure
\d "user"
\d entities

-- View sample data
SELECT * FROM "user" LIMIT 5;
SELECT * FROM entities LIMIT 5;

-- Check indexes
\di

-- Drop and recreate database
DROP DATABASE quatrain_test;
CREATE DATABASE quatrain_test;
```

## Security Notes

- The sample passwords in the schema are placeholders
- In production, ensure proper password hashing with salt
- Use environment variables for database credentials
- Restrict database user permissions in production
- Consider using connection pooling for better performance