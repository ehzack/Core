-- Quatrain Core Database Schema
-- PostgreSQL schema for User and Entity tables
-- This script creates the necessary tables for development and testing

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS entities CASCADE;

-- Create entities table first (referenced by user table)
CREATE TABLE entities (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- BaseObject properties
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'active', 'deleted')),
    
    -- Audit fields - these would typically be populated by middleware
    -- For development, we'll allow them to be nullable initially
    createdby UUID, -- References user.id, but can't add FK constraint due to circular dependency
    createdat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedby UUID, -- References user.id
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deletedby UUID, -- References user.id
    deletedat TIMESTAMP WITH TIME ZONE,
    
    -- Indexes for performance
    CONSTRAINT entities_name_not_empty CHECK (length(trim(name)) > 0)
);

-- Create user table
CREATE TABLE "user" (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- BaseObject properties
    name VARCHAR(100) NOT NULL DEFAULT '', -- Auto-populated from firstname + lastname
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'active', 'deleted')),
    
    -- User-specific properties
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'nonbinary')),
    birthday TIMESTAMP WITH TIME ZONE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(100),
    password VARCHAR(256) NOT NULL, -- Hashed password (SHA256 or similar)
    
    -- Foreign key to entity
    entity UUID REFERENCES entities(id) ON DELETE SET NULL,
    
    -- Audit fields
    createdby UUID, -- References user.id (self-referential)
    createdat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedby UUID, -- References user.id (self-referential)
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deletedby UUID, -- References user.id (self-referential)
    deletedat TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT user_firstname_not_empty CHECK (length(trim(firstname)) > 0),
    CONSTRAINT user_lastname_not_empty CHECK (length(trim(lastname)) > 0),
    CONSTRAINT user_email_not_empty CHECK (length(trim(email)) > 0),
    CONSTRAINT user_password_not_empty CHECK (length(trim(password)) >= 5)
);

-- Add self-referential foreign key constraints for audit fields
ALTER TABLE "user" 
    ADD CONSTRAINT fk_user_createdby FOREIGN KEY (createdby) REFERENCES "user"(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_user_updatedby FOREIGN KEY (updatedby) REFERENCES "user"(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_user_deletedby FOREIGN KEY (deletedby) REFERENCES "user"(id) ON DELETE SET NULL;

-- Add foreign key constraints for entities audit fields
ALTER TABLE entities
    ADD CONSTRAINT fk_entities_createdby FOREIGN KEY (createdby) REFERENCES "user"(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_entities_updatedby FOREIGN KEY (updatedby) REFERENCES "user"(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_entities_deletedby FOREIGN KEY (deletedby) REFERENCES "user"(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_firstname ON "user"(firstname);
CREATE INDEX idx_user_lastname ON "user"(lastname);
CREATE INDEX idx_user_status ON "user"(status);
CREATE INDEX idx_user_entity ON "user"(entity);
CREATE INDEX idx_user_createdat ON "user"(createdat);

CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_status ON entities(status);
CREATE INDEX idx_entities_createdat ON entities(createdat);

-- Create function to auto-update the 'name' field for users
CREATE OR REPLACE FUNCTION update_user_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.name = TRIM(NEW.firstname || ' ' || NEW.lastname);
    NEW.updatedat = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user name on insert/update
CREATE TRIGGER trigger_update_user_name
    BEFORE INSERT OR UPDATE OF firstname, lastname ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_user_name();

-- Create function to auto-update updatedat timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updatedat timestamps
CREATE TRIGGER trigger_user_updatedat
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_entities_updatedat
    BEFORE UPDATE ON entities
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Insert sample data for development/testing

-- Create a sample entity
INSERT INTO entities (id, name, status, createdat) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'ACME Corporation', 'active', NOW()),
    ('550e8400-e29b-41d4-a716-446655440001', 'Tech Solutions Inc', 'active', NOW());

-- Create sample users
INSERT INTO "user" (id, firstname, lastname, email, password, entity, status, createdat)
VALUES 
    (
        '660e8400-e29b-41d4-a716-446655440000', 
        'John', 
        'Doe', 
        'john.doe@example.com', 
        'hashed_password_here', 
        '550e8400-e29b-41d4-a716-446655440000',
        'active',
        NOW()
    ),
    (
        '660e8400-e29b-41d4-a716-446655440001', 
        'Jane', 
        'Smith', 
        'jane.smith@example.com', 
        'hashed_password_here', 
        '550e8400-e29b-41d4-a716-446655440001',
        'active',
        NOW()
    ),
    (
        '660e8400-e29b-41d4-a716-446655440002', 
        'Admin', 
        'User', 
        'admin@example.com', 
        'hashed_password_here', 
        NULL,
        'active',
        NOW()
    );

-- Set audit fields for the sample data (admin user as creator)
UPDATE "user" SET createdby = '660e8400-e29b-41d4-a716-446655440002' WHERE createdby IS NULL;
UPDATE entities SET createdby = '660e8400-e29b-41d4-a716-446655440002' WHERE createdby IS NULL;

-- Create a view for easier user queries (optional)
CREATE VIEW user_details AS
SELECT 
    u.id,
    u.name,
    u.firstname,
    u.lastname,
    u.email,
    u.phone,
    u.gender,
    u.birthday,
    u.status,
    e.name as entity_name,
    u.createdat,
    u.updatedat,
    creator.name as created_by_name,
    updater.name as updated_by_name
FROM "user" u
LEFT JOIN entities e ON u.entity = e.id
LEFT JOIN "user" creator ON u.createdby = creator.id
LEFT JOIN "user" updater ON u.updatedby = updater.id;

-- Grant permissions (adjust as needed for your environment)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON "user" TO quatrain_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON entities TO quatrain_app;
-- GRANT SELECT ON user_details TO quatrain_app;

-- Show table structure
\d "user"
\d entities

-- Show sample data
SELECT 'Users:' as table_name;
SELECT id, name, email, status, entity FROM "user";

SELECT 'Entities:' as table_name;
SELECT id, name, status FROM entities;

COMMENT ON TABLE "user" IS 'User accounts with authentication and profile information';
COMMENT ON TABLE entities IS 'Organizations or entities that users can belong to';
COMMENT ON COLUMN "user".password IS 'Hashed password (SHA256 with salt)';
COMMENT ON COLUMN "user".name IS 'Auto-generated from firstname + lastname';
COMMENT ON FUNCTION update_user_name() IS 'Automatically updates user.name when firstname or lastname changes';