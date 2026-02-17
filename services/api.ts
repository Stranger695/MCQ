import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { User, MCQ, Exam, ExamResult, SiteSettings, UserRole } from '../types';

const supabaseUrl = 'https://bvjzuwulwdqubzifpeyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2anp1d3Vsd2RxdWJ6aWZwZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzc1NDgsImV4cCI6MjA4NjcxMzU0OH0.rivYIgGP4C9B4aDY9jeHizHgfS_8EiwbBkZZGVUqJ50';
const supabase = createClient(supabaseUrl, supabaseKey);

// Point to the custom backend server for secure logic
const BACKEND_URL = 'http://localhost:3001/api/v1';

/**
 * Backend Service Layer
 * Interfaces with both Supabase (Data) and Custom Backend (Logic)
 */
export const BackendAPI = {
  // Profiles
  async getProfiles() {
    return await supabase.from('profiles').select('*');
  },
  async upsertProfile(user: User) {
    return await supabase.from('profiles').upsert({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phoneNumber,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      joined_at: user.joinedAt,
      password: user.password 
    });
  },
  async deleteProfile(userId: string) {
    return await supabase.from('profiles').delete().eq('id', userId);
  },

  // Exams
  async getExams() {
    return await supabase.from('exams').select('*');
  },
  async upsertExam(exam: Exam) {
    return await supabase.from('exams').upsert({
      id: exam.id,
      title: exam.title,
      category_id: exam.categoryId,
      author_id: exam.authorId,
      author_name: exam.authorName,
      duration_minutes: exam.durationMinutes,
      total_questions: exam.totalQuestions,
      question_ids: exam.questionIds,
      pass_percentage: exam.passPercentage,
      negative_marking: exam.negativeMarking,
      is_enabled: exam.isEnabled,
      difficulty: exam.difficulty,
      created_at: exam.createdAt
    });
  },

  // Questions
  async getQuestions() {
    return await supabase.from('questions').select('*');
  },
  async upsertQuestion(q: MCQ) {
    return await supabase.from('questions').upsert({
      id: q.id,
      author_id: q.authorId,
      author_name: q.authorName,
      category_id: q.categoryId,
      question_text: q.questionText,
      options: q.options,
      correct_option_index: q.correctOptionIndex,
      explanation: q.explanation,
      difficulty: q.difficulty,
      status: q.status,
      created_at: q.createdAt
    });
  },

  // Results & SECURE GRADING
  async getResults() {
    return await supabase.from('results').select('*');
  },
  async saveResult(res: ExamResult, answers?: Record<string, number>) {
    // Call custom backend for secure server-side grading
    const response = await fetch(`${BACKEND_URL}/exams/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': res.studentId
      },
      body: JSON.stringify({
        studentId: res.studentId,
        examId: res.examId,
        answers, // Send answers for server validation
        timeTakenSeconds: res.timeTakenSeconds
      })
    });
    return await response.json();
  },

  // Analytics
  async getGlobalStats(userId: string) {
    const response = await fetch(`${BACKEND_URL}/reports/summary`, {
      headers: { 'x-user-id': userId }
    });
    return await response.json();
  },

  // Settings
  async getSettings() {
    return await supabase.from('site_settings').select('settings').single();
  },
  async updateSettings(settings: SiteSettings) {
    return await supabase.from('site_settings').upsert({ id: 1, settings });
  },

  // Notifications
  async getNotifications() {
    return await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  },
  async insertNotifications(notifs: any[]) {
    return await supabase.from('notifications').insert(notifs).select();
  },
  async markNotifRead(id: string) {
    return await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  }
};
