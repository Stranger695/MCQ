-- EDUQUEST COMPREHENSIVE DATABASE SCHEMA (FIXED & IDEMPOTENT)
-- This script initializes all tables, enums, and security policies safely.
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMERATIONS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'AUTHOR', 'STUDENT');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_status') THEN
        CREATE TYPE question_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
        CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');
    END IF;
END $$;

-- 3. PROFILES TABLE (Core Identity Node)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    password TEXT, -- For demo/local authentication persistence
    role user_role DEFAULT 'STUDENT',
    status user_status DEFAULT 'ACTIVE',
    avatar TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist even if table was created previously
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Safely add unique constraint to username if not present
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
END $$;

-- 4. ACADEMIC INFRASTRUCTURE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    author_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    author_name TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_option_index INTEGER NOT NULL,
    explanation TEXT,
    difficulty difficulty_level DEFAULT 'MEDIUM',
    status question_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    author_name TEXT,
    duration_minutes INTEGER DEFAULT 30,
    total_questions INTEGER DEFAULT 0,
    question_ids TEXT[] DEFAULT '{}',
    pass_percentage INTEGER DEFAULT 50,
    marks_per_question FLOAT DEFAULT 1.0, -- Added for scoring weight
    negative_marking FLOAT DEFAULT 0.0,
    is_enabled BOOLEAN DEFAULT TRUE,
    difficulty difficulty_level DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for existing exams table
ALTER TABLE exams ADD COLUMN IF NOT EXISTS marks_per_question FLOAT DEFAULT 1.0;

CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    exam_id TEXT REFERENCES exams(id) ON DELETE CASCADE,
    score FLOAT NOT NULL,
    total_marks INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_answers INTEGER NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    status TEXT CHECK (status IN ('PASS', 'FAIL')),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_id TEXT UNIQUE
);

-- 5. SYSTEM & ENGAGEMENT TABLES
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one settings row
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure updated_at exists for site_settings too
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'NEW',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEED INITIAL SETTINGS
INSERT INTO site_settings (id, settings)
VALUES (1, '{
    "siteName": "EduQuest",
    "logoUrl": "https://cdn-icons-png.flaticon.com/512/3413/3413535.png",
    "primaryColor": "#4f46e5",
    "baseFontSize": 16,
    "footerDescription": "The global benchmark for academic MCQ examination deployments.",
    "contactEmail": "support@eduquest.com",
    "contactPhone": "+1 (888) EDU-QUEST"
}')
ON CONFLICT (id) DO NOTHING;

-- 7. SECURITY POLICIES (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Public Read Access" ON profiles;
DROP POLICY IF EXISTS "Public Update Access" ON profiles;
DROP POLICY IF EXISTS "Public Read Questions" ON questions;
DROP POLICY IF EXISTS "Public Manage Questions" ON questions;
DROP POLICY IF EXISTS "Public Read Exams" ON exams;
DROP POLICY IF EXISTS "Public Manage Exams" ON exams;
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Public Manage Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Results" ON results;
DROP POLICY IF EXISTS "Public Insert Results" ON results;
DROP POLICY IF EXISTS "Public Update Results" ON results;
DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Manage Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Manage Notifications" ON notifications;
DROP POLICY IF EXISTS "Public Insert Inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public Read Inquiries" ON inquiries;

-- Re-create policies
CREATE POLICY "Public Read Access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Update Access" ON profiles FOR ALL USING (true);

CREATE POLICY "Public Read Questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public Manage Questions" ON questions FOR ALL USING (true);

CREATE POLICY "Public Read Exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Public Manage Exams" ON exams FOR ALL USING (true);

CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Manage Categories" ON categories FOR ALL USING (true);

CREATE POLICY "Public Read Results" ON results FOR SELECT USING (true);
CREATE POLICY "Public Insert Results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Results" ON results FOR UPDATE USING (true);

CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Manage Settings" ON site_settings FOR ALL USING (true);

CREATE POLICY "Public Manage Notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Public Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Inquiries" ON inquiries FOR SELECT USING (true);

-- 8. AUTOMATION (Updated at triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Safely handle trigger creation for profiles
DROP TRIGGER IF EXISTS update_profiles_modtime ON profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Safely handle trigger creation for site_settings
DROP TRIGGER IF EXISTS update_site_settings_modtime ON site_settings;
CREATE TRIGGER update_site_settings_modtime
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();