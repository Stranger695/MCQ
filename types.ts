
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
  STUDENT = 'STUDENT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum QuestionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinedAt: string;
}

export interface MCQ {
  id: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: Difficulty;
  status: QuestionStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Exam {
  id: string;
  title: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  durationMinutes: number;
  totalQuestions: number;
  questionIds?: string[];
  passPercentage: number;
  negativeMarking: number;
  isEnabled: boolean;
  difficulty?: Difficulty;
  createdAt: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTakenSeconds: number;
  status: 'PASS' | 'FAIL';
  completedAt: string;
  certificateId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
  isRead: boolean;
  createdAt: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  platform: 'Twitter' | 'LinkedIn' | 'GitHub' | 'Facebook' | 'Instagram' | 'YouTube' | 'Globe';
  url: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  primaryColor: string;
  baseFontSize: number;
  footerDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: SocialLink[];
  footerSections: FooterSection[];
  certificateTemplate: {
    header: string;
    body: string;
    footer: string;
  };
}
