-- EDUQUEST COMPREHENSIVE DATABASE SCHEMA (PROD-READY)
-- Target Environment: Supabase / PostgreSQL 14+

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

-- 3. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. CORE IDENTITY NODES (PROFILES)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    password TEXT,
    role user_role DEFAULT 'STUDENT',
    status user_status DEFAULT 'ACTIVE',
    avatar TEXT,
    gender TEXT,
    birthdate DATE,
    division TEXT,
    district TEXT,
    work TEXT,
    organization TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix: Use DROP TRIGGER IF EXISTS to prevent "already exists" error
DROP TRIGGER IF EXISTS update_profiles_modtime ON profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. ACADEMIC INFRASTRUCTURE
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
    options JSONB NOT NULL,
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
    marks_per_question FLOAT DEFAULT 1.0,
    negative_marking FLOAT DEFAULT 0.0,
    is_enabled BOOLEAN DEFAULT TRUE,
    difficulty difficulty_level DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 6. SYSTEM & ENGAGEMENT TABLES
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix: Use DROP TRIGGER IF EXISTS to prevent "already exists" error
DROP TRIGGER IF EXISTS update_settings_modtime ON site_settings;
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

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

-- 7. SECURITY POLICIES (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Note: These policies use DROP POLICY IF EXISTS to allow re-running the script
DROP POLICY IF EXISTS "Enable Read Access" ON profiles;
CREATE POLICY "Enable Read Access" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable Update Access" ON profiles;
CREATE POLICY "Enable Update Access" ON profiles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable Insert Access" ON profiles;
CREATE POLICY "Enable Insert Access" ON profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable Read Questions" ON questions;
CREATE POLICY "Enable Read Questions" ON questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable Manage Questions" ON questions;
CREATE POLICY "Enable Manage Questions" ON questions FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable Read Exams" ON exams;
CREATE POLICY "Enable Read Exams" ON exams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable Manage Exams" ON exams;
CREATE POLICY "Enable Manage Exams" ON exams FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable Read Categories" ON categories;
CREATE POLICY "Enable Read Categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable Manage Categories" ON categories;
CREATE POLICY "Enable Manage Categories" ON categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable Read Results" ON results;
CREATE POLICY "Enable Read Results" ON results FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable Insert Results" ON results;
CREATE POLICY "Enable Insert Results" ON results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable Read Settings" ON site_settings;
CREATE POLICY "Enable Read Settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable Manage Settings" ON site_settings;
CREATE POLICY "Enable Manage Settings" ON site_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable Manage Notifications" ON notifications;
CREATE POLICY "Enable Manage Notifications" ON notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable Insert Inquiries" ON inquiries;
CREATE POLICY "Enable Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable Read Inquiries" ON inquiries;
CREATE POLICY "Enable Read Inquiries" ON inquiries FOR SELECT USING (true);

-- 8. INITIAL SEED DATA
INSERT INTO profiles (id, name, email, role, status, joined_at) VALUES 
('u1', 'Super Admin', 'super@eduquest.com', 'SUPER_ADMIN', 'ACTIVE', NOW()),
('u2', 'Admin', 'admin@eduquest.com', 'ADMIN', 'ACTIVE', NOW()),
('u3', 'Author', 'author@eduquest.com', 'AUTHOR', 'ACTIVE', NOW()),
('u4', 'Student', 'student@eduquest.com', 'STUDENT', 'ACTIVE', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, description) VALUES 
('c1', 'Computer Science', 'Core CS topics like Data Structures, OS, and Networking.'),
('c2', 'Mathematics', 'Algebra, Calculus, and Statistics.'),
('c3', 'General Knowledge', 'Current affairs and history.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_settings (id, settings) VALUES (1, '{
  "siteName": "EduQuest",
  "logoUrl": "https://cdn-icons-png.flaticon.com/512/3413/3413535.png",
  "primaryColor": "#4f46e5",
  "baseFontSize": 16,
  "footerDescription": "The global benchmark for academic and corporate MCQ examination deployments. Verified. Secure. Analytical.",
  "contactEmail": "academic-support@eduquest.com",
  "contactPhone": "+1 (888) EDU-QUEST",
  "socialLinks": [
    {"id": "s1", "platform": "Twitter", "url": "https://twitter.com"},
    {"id": "s2", "platform": "LinkedIn", "url": "https://linkedin.com"},
    {"id": "s3", "platform": "GitHub", "url": "https://github.com"}
  ],
  "footerSections": [
    {
      "id": "fs1",
      "title": "Platform",
      "links": [
        {"id": "l1", "label": "Exam Registry", "url": "#exams"},
        {"id": "l2", "label": "Candidate Portal", "url": "/auth"},
        {"id": "l3", "label": "Success Rates", "url": "#stats"}
      ]
    },
    {
      "id": "fs2",
      "title": "Compliance",
      "links": [
        {"id": "l4", "label": "Privacy Policy", "url": "#"},
        {"id": "l5", "label": "Terms of Service", "url": "#"},
        {"id": "l6", "label": "GDPR Audit", "url": "#"}
      ]
    }
  ],
  "certificateTemplate": {
    "header": "Certificate of Excellence",
    "body": "This is to certify that [STUDENT_NAME] has successfully completed the [EXAM_NAME] with a score of [SCORE]%.",
    "footer": "EduQuest Academic Board"
  }
}') ON CONFLICT (id) DO NOTHING;