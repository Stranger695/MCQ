import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MCQ, Category, Exam, ExamResult, SiteSettings, UserRole, QuestionStatus, UserStatus, Difficulty, Notification } from './types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_QUESTIONS, INITIAL_EXAMS, INITIAL_SETTINGS } from './constants';
import { BackendAPI } from './services/api';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  questions: MCQ[];
  setQuestions: React.Dispatch<React.SetStateAction<MCQ[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  results: ExamResult[];
  setResults: React.Dispatch<React.SetStateAction<ExamResult[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  updateUser: (updatedUser: User) => Promise<void>;
  deleteUser: (userId: string) => void;
  upsertExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  upsertCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  upsertQuestion: (question: MCQ) => void;
  deleteQuestion: (questionId: string) => void;
  saveResult: (result: ExamResult, studentAnswers?: Record<string, number>) => Promise<void>;
  updateResult: (result: ExamResult) => void;
  updateSettings: (settings: SiteSettings) => void;
  broadcastToStudents: (title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  logout: () => void;
  importBackup: (data: any) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eq_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [questions, setQuestions] = useState<MCQ[]>(INITIAL_QUESTIONS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eq_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eq_current_user');
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [
        { data: profiles },
        { data: cats },
        { data: qs },
        { data: exms },
        { data: res },
        { data: stngs },
        { data: notifs }
      ] = await Promise.all([
        BackendAPI.getProfiles(),
        BackendAPI.getCategories(), 
        BackendAPI.getQuestions(),
        BackendAPI.getExams(),
        BackendAPI.getResults(),
        BackendAPI.getSettings(),
        BackendAPI.getNotifications()
      ]);

      const dbUsers = (profiles || []).map(p => ({
        id: p.id,
        name: p.name,
        username: p.username || '',
        email: p.email,
        phoneNumber: p.phone_number || '', // Critical fallback
        role: p.role as UserRole,
        status: p.status as UserStatus,
        avatar: p.avatar || '',
        joinedAt: p.joined_at,
        password: p.password || ''
      }));

      const mergedUsers = [...INITIAL_USERS];
      dbUsers.forEach(dbU => {
        const index = mergedUsers.findIndex(u => u.id === dbU.id);
        if (index !== -1) {
          mergedUsers[index] = { ...mergedUsers[index], ...dbU };
        } else {
          mergedUsers.push(dbU);
        }
      });
      setUsers(mergedUsers);

      if (currentUser) {
        const freshUser = mergedUsers.find(u => u.id === currentUser.id);
        if (freshUser) setCurrentUser(freshUser);
      }

      if (cats) setCategories(cats.map(c => ({ id: c.id, name: c.name, description: c.description })));
      if (qs) setQuestions(qs.map(q => ({
        id: q.id,
        authorId: q.author_id,
        authorName: q.author_name,
        categoryId: q.category_id,
        questionText: q.question_text,
        options: q.options,
        correctOptionIndex: q.correct_option_index,
        explanation: q.explanation,
        difficulty: q.difficulty as Difficulty,
        status: q.status as QuestionStatus,
        createdAt: q.created_at
      })));
      if (exms) setExams(exms.map(e => ({
        id: e.id,
        title: e.title,
        categoryId: e.category_id,
        authorId: e.author_id,
        authorName: e.author_name,
        durationMinutes: e.duration_minutes,
        totalQuestions: e.total_questions,
        questionIds: e.question_ids,
        passPercentage: e.pass_percentage,
        marksPerQuestion: e.marks_per_question || 1.0, // Added
        negativeMarking: e.negative_marking || 0.0,
        isEnabled: e.is_enabled,
        difficulty: e.difficulty as Difficulty,
        createdAt: e.created_at
      })));
      if (res) setResults(res.map(r => ({
        id: r.id,
        studentId: r.student_id,
        examId: r.exam_id,
        score: r.score,
        totalMarks: r.total_marks,
        correctAnswers: r.correct_answers,
        wrongAnswers: r.wrong_answers,
        timeTakenSeconds: r.time_taken_seconds,
        status: r.status as 'PASS' | 'FAIL',
        completedAt: r.completed_at,
        certificateId: r.certificate_id
      })));
      if (notifs) setNotifications(notifs.map(n => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        message: n.message,
        type: n.type as 'INFO' | 'SUCCESS' | 'WARNING',
        isRead: n.is_read,
        createdAt: n.created_at
      })));
      if (stngs?.settings) setSettings(stngs.settings);
    } catch (err) {
      console.error('Data Sync Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateUser = async (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
    const { error } = await BackendAPI.upsertProfile(updatedUser);
    if (error) {
      console.error('Persistence Failure:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?.id) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    await BackendAPI.deleteProfile(userId);
  };

  const upsertExam = async (exam: Exam) => {
    setExams(prev => {
      const exists = prev.find(e => e.id === exam.id);
      return exists ? prev.map(e => e.id === exam.id ? exam : e) : [...prev, exam];
    });
    await BackendAPI.upsertExam(exam);
  };

  const deleteExam = async (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    await BackendAPI.deleteExam(examId);
  };

  const upsertCategory = async (category: Category) => {
    setCategories(prev => {
      const exists = prev.find(c => c.id === category.id);
      return exists ? prev.map(c => c.id === category.id ? category : c) : [...prev, category];
    });
    await BackendAPI.upsertCategory(category);
  };

  const deleteCategory = async (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    await BackendAPI.deleteCategory(categoryId);
  };

  const upsertQuestion = async (q: MCQ) => {
    setQuestions(prev => {
      const exists = prev.find(item => item.id === q.id);
      return exists ? prev.map(item => item.id === q.id ? q : item) : [...prev, q];
    });
    await BackendAPI.upsertQuestion(q);
  };

  const deleteQuestion = async (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    await BackendAPI.deleteQuestion(questionId);
  };

  const saveResult = async (res: ExamResult, studentAnswers?: Record<string, number>) => {
    try {
      const response = await BackendAPI.saveResult(res, studentAnswers);
      if (response && response.success && response.result) {
        const result: ExamResult = {
          id: response.result.id,
          studentId: response.result.student_id,
          examId: response.result.exam_id,
          score: response.result.score,
          totalMarks: response.result.total_marks,
          correctAnswers: response.result.correct_answers,
          wrongAnswers: response.result.wrong_answers,
          timeTakenSeconds: response.result.time_taken_seconds,
          status: response.result.status as 'PASS' | 'FAIL',
          completedAt: response.result.completed_at,
          certificateId: response.result.certificate_id
        };
        setResults(prev => [...prev, result]);
      } else {
        setResults(prev => [...prev, res]);
        await BackendAPI.insertResultDirect(res);
      }
    } catch (err) {
      setResults(prev => [...prev, res]);
      await BackendAPI.insertResultDirect(res);
    }
  };

  const updateResult = async (result: ExamResult) => {
    setResults(prev => prev.map(r => r.id === result.id ? result : r));
    await BackendAPI.updateResult(result);
  };

  const broadcastToStudents = async (title: string, message: string) => {
    const students = users.filter(u => u.role === UserRole.STUDENT);
    const notifBatch = students.map(s => ({
      user_id: s.id,
      title,
      message,
      type: 'INFO',
      is_read: false
    }));
    if (notifBatch.length > 0) {
      const { data } = await BackendAPI.insertNotifications(notifBatch);
      if (data) {
        const mapped = data.map(n => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type as 'INFO' | 'SUCCESS' | 'WARNING',
          isRead: n.is_read,
          createdAt: n.created_at
        }));
        setNotifications(prev => [...mapped, ...prev]);
      }
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await BackendAPI.markNotifRead(id);
  };

  const updateSettings = async (stngs: SiteSettings) => {
    setSettings(stngs);
    await BackendAPI.updateSettings(stngs);
  };

  const logout = () => { 
    setCurrentUser(null); 
    setResults([]);
    setNotifications([]);
    localStorage.removeItem('eq_current_user');
  };

  const importBackup = (data: any) => {};

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      users, setUsers,
      questions, setQuestions,
      categories, setCategories,
      exams, setExams,
      results, setResults,
      notifications, setNotifications,
      settings, setSettings,
      updateUser, deleteUser,
      upsertExam, deleteExam,
      upsertCategory, deleteCategory,
      upsertQuestion, deleteQuestion,
      saveResult, updateResult,
      updateSettings,
      broadcastToStudents,
      markNotificationRead,
      logout, importBackup, isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};