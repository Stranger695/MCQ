-- EDUQUEST ADVANCED EXAMINATION SYSTEM - DATABASE SCHEMA
-- Target: PostgreSQL / Supabase
-- Updated: Replaced UUID with TEXT for compatibility with arbitrary string IDs

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'AUTHOR', 'STUDENT');
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
    CREATE TYPE question_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- PROFILES (Identity Nodes)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, -- Changed from UUID
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    password TEXT,
    role user_role DEFAULT 'STUDENT',
    status user_status DEFAULT 'ACTIVE',
    avatar TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES (Academic Classification)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, -- Changed from UUID
    name TEXT NOT NULL,
    description TEXT
);

-- QUESTIONS (Knowledge Fragments)
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY, -- Changed from UUID
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

-- EXAMS (Curated Clusters)
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY, -- Changed from UUID
    title TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    author_name TEXT,
    duration_minutes INTEGER DEFAULT 30,
    total_questions INTEGER DEFAULT 0,
    question_ids TEXT[] DEFAULT '{}', -- Changed from UUID[]
    pass_percentage INTEGER DEFAULT 50,
    negative_marking FLOAT DEFAULT 0.0,
    is_enabled BOOLEAN DEFAULT TRUE,
    difficulty difficulty_level DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESULTS (Audit Logs)
CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY, -- Changed from UUID
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

-- NOTIFICATIONS (Comms Uplink)
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INQUIRIES (External Flux)
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS (System Config)
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policies for Questions (Only Admins/Authors can see pending)
CREATE POLICY "Anyone can see approved questions" ON questions FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Admins see everything" ON questions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role IN ('ADMIN', 'SUPER_ADMIN'))
);

-- 5. TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();