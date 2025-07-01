-- Simplified Test Schema for Quatrain Core
-- PostgreSQL schema for testing environments
-- This is a minimal version without constraints and triggers for easier testing

-- Drop tables if they exist
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS entities CASCADE;

-- Create entities table
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'created',
    createdby UUID,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedby UUID,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deletedby UUID,
    deletedat TIMESTAMP WITH TIME ZONE
);

-- Create user table
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) DEFAULT '',
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    birthday TIMESTAMP WITH TIME ZONE,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(100),
    password VARCHAR(256) NOT NULL,
    entity UUID,
    status VARCHAR(20) DEFAULT 'created',
    createdby UUID,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedby UUID,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deletedby UUID,
    deletedat TIMESTAMP WITH TIME ZONE
);

-- Basic indexes for performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_status ON "user"(status);
CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_status ON entities(status);

-- Insert minimal test data
INSERT INTO entities (id, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Test Entity');

INSERT INTO "user" (id, firstname, lastname, email, password, entity) VALUES 
    ('660e8400-e29b-41d4-a716-446655440000', 'Test', 'User', 'test@example.com', 'test_password', '550e8400-e29b-41d4-a716-446655440000');