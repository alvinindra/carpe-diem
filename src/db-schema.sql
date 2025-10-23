-- Database schema for Dead Poets Society

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poets table for storing poetry with rich text content
CREATE TABLE IF NOT EXISTS poets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content JSONB NOT NULL, -- Store Plate.js content as JSON
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_poets_author_id ON poets(author_id);
CREATE INDEX IF NOT EXISTS idx_poets_created_at ON poets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

