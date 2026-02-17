
import { UserRole, Difficulty, QuestionStatus, UserStatus, SiteSettings, Exam } from './types';

export const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'super@eduquest.com',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    joinedAt: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'Admin',
    email: 'admin@eduquest.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    joinedAt: new Date().toISOString()
  },
  {
    id: 'u3',
    name: 'Author',
    email: 'author@eduquest.com',
    role: UserRole.AUTHOR,
    status: UserStatus.ACTIVE,
    joinedAt: new Date().toISOString()
  },
  {
    id: 'u4',
    name: 'Student',
    email: 'student@eduquest.com',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    joinedAt: new Date().toISOString()
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'c1', name: 'Computer Science', description: 'Core CS topics like Data Structures, OS, and Networking.' },
  { id: 'c2', name: 'Mathematics', description: 'Algebra, Calculus, and Statistics.' },
  { id: 'c3', name: 'General Knowledge', description: 'Current affairs and history.' }
];

export const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    authorId: 'u3',
    authorName: 'Author',
    categoryId: 'c1',
    questionText: 'What does CPU stand for?',
    options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Processor Utility'],
    correctOptionIndex: 1,
    explanation: 'The CPU (Central Processing Unit) is the primary component of a computer.',
    difficulty: Difficulty.EASY,
    status: QuestionStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q2',
    authorId: 'u3',
    authorName: 'Author',
    categoryId: 'c1',
    questionText: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
    correctOptionIndex: 2,
    explanation: 'Stacks use Last-In-First-Out (LIFO) order.',
    difficulty: Difficulty.MEDIUM,
    status: QuestionStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q3',
    authorId: 'u3',
    authorName: 'Author',
    categoryId: 'c2',
    questionText: 'What is the value of Pi to two decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctOptionIndex: 1,
    explanation: 'Pi is approximately 3.14159...',
    difficulty: Difficulty.EASY,
    status: QuestionStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q4',
    authorId: 'u3',
    authorName: 'Author',
    categoryId: 'c2',
    questionText: 'Which of these is a prime number?',
    options: ['4', '6', '9', '11'],
    correctOptionIndex: 3,
    explanation: '11 is only divisible by 1 and itself.',
    difficulty: Difficulty.MEDIUM,
    status: QuestionStatus.PENDING,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q5',
    authorId: 'u3',
    authorName: 'Author',
    categoryId: 'c1',
    questionText: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
    correctOptionIndex: 1,
    explanation: 'Binary search halves the search space in each step.',
    difficulty: Difficulty.HARD,
    status: QuestionStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q6',
    authorId: 'u3',
    authorName: 'Author',
    categoryId: 'c3',
    questionText: 'Who was the first person to walk on the moon?',
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Michael Collins'],
    correctOptionIndex: 1,
    explanation: 'Neil Armstrong walked on the moon in 1969.',
    difficulty: Difficulty.EASY,
    status: QuestionStatus.REJECTED,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'e1',
    title: 'CS Fundamentals Quiz',
    categoryId: 'c1',
    authorId: 'u2',
    authorName: 'Admin',
    durationMinutes: 10,
    totalQuestions: 2,
    questionIds: ['q1', 'q2'],
    passPercentage: 50,
    // Fix: Added missing marksPerQuestion property which is required in the Exam interface
    marksPerQuestion: 1.0,
    negativeMarking: 0.25,
    difficulty: Difficulty.EASY,
    isEnabled: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'EduQuest',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3413/3413535.png',
  primaryColor: '#4f46e5',
  baseFontSize: 16,
  footerDescription: 'The global benchmark for academic and corporate MCQ examination deployments. Verified. Secure. Analytical.',
  contactEmail: 'academic-support@eduquest.com',
  contactPhone: '+1 (888) EDU-QUEST',
  socialLinks: [
    { id: 's1', platform: 'Twitter', url: 'https://twitter.com' },
    { id: 's2', platform: 'LinkedIn', url: 'https://linkedin.com' },
    { id: 's3', platform: 'GitHub', url: 'https://github.com' }
  ],
  footerSections: [
    {
      id: 'fs1',
      title: 'Platform',
      links: [
        { id: 'l1', label: 'Exam Registry', url: '#exams' },
        { id: 'l2', label: 'Candidate Portal', url: '/auth' },
        { id: 'l3', label: 'Success Rates', url: '#stats' }
      ]
    },
    {
      id: 'fs2',
      title: 'Compliance',
      links: [
        { id: 'l4', label: 'Privacy Policy', url: '#' },
        { id: 'l5', label: 'Terms of Service', url: '#' },
        { id: 'l6', label: 'GDPR Audit', url: '#' }
      ]
    }
  ],
  certificateTemplate: {
    header: 'Certificate of Excellence',
    body: 'This is to certify that [STUDENT_NAME] has successfully completed the [EXAM_NAME] with a score of [SCORE]%.',
    footer: 'EduQuest Academic Board'
  }
};
