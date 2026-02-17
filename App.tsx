import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Layout from './components/Layout';
import Auth from './views/Auth';
import LandingPage from './views/LandingPage';
import { 
  SuperAdminDashboard, 
  AuthorDashboard, 
  StudentDashboard 
} from './views/Dashboards';
import { QuestionForm, QuestionModeration } from './views/QuestionManagement';
import { UserManagement } from './views/UserManagement';
import { ExamManagement } from './views/ExamManagement';
import { AuthorExamManagement } from './views/AuthorExamManagement';
import { SiteSettingsView } from './views/SiteSettingsView';
import { Reports } from './views/Reports';
import { CertificateManagement } from './views/CertificateManagement';
import { ProfileSettings } from './views/ProfileSettings';
import ExamSession from './views/ExamSession';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { UserRole, Exam, ExamResult, User, Category, MCQ, UserStatus } from './types';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Home, 
  FileText, 
  BookOpen, 
  Camera, 
  Calendar, 
  Mail, 
  Edit3,
  TrendingUp,
  Clock,
  History,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  Check,
  User as UserIcon,
  Save,
  RotateCcw,
  UserCheck,
  Zap,
  Plus,
  Layers,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Eye,
  Settings,
  Hash,
  Phone
} from 'lucide-react';

const Toast: React.FC<{ message: string; type: 'SUCCESS' | 'ERROR'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[250] animate-in slide-in-from-right-12 duration-300">
      <div className={`px-5 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center gap-4 md:gap-5 border ${
        type === 'SUCCESS' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
      }`}>
        <div className={`p-2.5 md:p-3 rounded-xl ${type === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'}`}>
          {type === 'SUCCESS' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        </div>
        <p className="font-black uppercase tracking-widest text-[9px] md:text-xs">{message}</p>
        <button onClick={onClose} className="ml-2 md:ml-4 p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <X size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

const ResultSummary: React.FC<{ result: ExamResult; exam: Exam; onDone: () => void }> = ({ result, exam, onDone }) => {
  return (
    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-2xl w-full border border-slate-200 animate-in zoom-in-95 duration-500">
      <div className={`p-12 text-center text-white ${result.status === 'PASS' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
          {result.status === 'PASS' ? <Award size={48} /> : <XCircle size={48} />}
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{result.status === 'PASS' ? 'Academic Success' : 'Session Deficit'}</h2>
        <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{exam.title}</p>
      </div>
      <div className="p-12 space-y-10">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-4xl font-black text-slate-800 tracking-tighter">{Math.round((result.score / result.totalMarks) * 100)}%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Mastery Index</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-4xl font-black text-slate-800 tracking-tighter">{result.correctAnswers}/{result.totalMarks}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Correct Items</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Expended</span>
            <span className="font-bold text-slate-700">{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</span>
          </div>
          {result.certificateId && (
            <div className="flex justify-between items-center py-4 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification ID</span>
              <code className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black">{result.certificateId}</code>
            </div>
          )}
        </div>
        <button onClick={onDone} className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">Finish Session Audit</button>
      </div>
    </div>
  );
};

const CategoryManagement: React.FC = () => {
  const { categories, upsertCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const openModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name, description: cat.description });
    } else {
      setEditingCat(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catData: Category = {
      id: editingCat?.id || Math.random().toString(36).substr(2, 9),
      ...formData
    };
    upsertCategory(catData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Academic Classifications</h3>
          <p className="text-slate-500 text-sm mt-1">Manage subject categories for exam organization.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-indigo-100"><Plus size={18} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Layers size={24} /></div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(cat)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>
            <h4 className="font-black text-slate-800 text-xl mb-3">{cat.name}</h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{cat.description}</p>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {cat.id}</div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-black text-xl uppercase tracking-widest">{editingCat ? 'Modify Class' : 'New Class Node'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                <input required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                <textarea required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none min-h-[120px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-100">{editingCat ? 'Sync Changes' : 'Deploy Category'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDetailView: React.FC<{ user: User; onBack: () => void; onViewResult: (result: ExamResult) => void; onEditProfile?: () => void }> = ({ user, onBack, onViewResult, onEditProfile }) => {
  const { results, exams, questions, currentUser } = useApp();
  
  const myResults = results.filter(r => r.studentId === user.id);
  const myQuestions = questions.filter(q => q.authorId === user.id);
  const totalExams = myResults.length;
  const passCount = myResults.filter(r => r.status === 'PASS').length;
  const avgScore = totalExams > 0 
    ? Math.round(myResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / totalExams * 100) 
    : 0;

  const isSelf = currentUser?.id === user.id;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back
        </button>
        {isSelf && (
          <button 
            onClick={onEditProfile}
            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Settings size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-40 md:h-56 bg-gradient-to-r from-slate-800 to-slate-900 relative">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute -bottom-16 md:-bottom-20 left-4 md:left-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
            <div className="w-32 h-32 md:w-52 md:h-52 rounded-[2.5rem] md:rounded-[3.5rem] bg-white p-2 shadow-2xl border-4 border-white">
              <div className="w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-100 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl md:text-7xl font-black text-indigo-200">{user.name.charAt(0)}</span>
                )}
              </div>
            </div>
            <div className="mb-4 md:mb-8 text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-black text-slate-800 tracking-tight leading-none truncate max-w-[280px] sm:max-w-md">{user.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${
                  user.role === UserRole.SUPER_ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                  user.role === UserRole.AUTHOR ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {user.role.replace('_', ' ')}
                </span>
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${
                  user.status === UserStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  user.status === UserStatus.BLOCKED ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-24 md:pt-36 pb-12 px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-12">
            <div className="space-y-8">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                Identity Credentials <span className="h-px flex-1 bg-slate-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Academic Email</p>
                    <span className="font-black text-slate-800 text-sm break-all truncate block">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Hash size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">System Handle</p>
                    <span className="font-black text-slate-800 text-sm truncate block">@{user.username || 'unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Phone size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Comms Uplink</p>
                    <span className="font-black text-slate-800 text-sm truncate block">{user.phoneNumber || 'not verified'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Registry Date</p>
                    <span className="font-black text-slate-800 text-sm truncate block">{new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                Ecosystem Metrics <span className="h-px flex-1 bg-slate-100"></span>
              </h3>
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {user.role === UserRole.STUDENT ? (
                  <>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                      <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{totalExams}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Attempts</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                      <p className="text-2xl md:text-4xl font-black text-emerald-600 tracking-tighter">{avgScore}%</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Accuracy</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                      <p className="text-2xl md:text-4xl font-black text-amber-500 tracking-tighter">{passCount}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Credentials</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                      <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{myQuestions.length}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Submissions</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                      <p className="text-2xl md:text-4xl font-black text-emerald-600 tracking-tighter">{myQuestions.filter(q => q.status === 'APPROVED').length}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Approved</p>
                    </div>
                    <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm ${myQuestions.filter(q => q.status === 'REJECTED').length > 0 ? 'border-rose-100' : ''}`}>
                      <p className={`text-2xl md:text-4xl font-black tracking-tighter ${myQuestions.filter(q => q.status === 'REJECTED').length > 0 ? 'text-rose-500' : 'text-slate-900'}`}>{myQuestions.filter(q => q.status === 'REJECTED').length}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Rejected</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-10 border-t border-slate-100">
             <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                Activity History <span className="h-px flex-1 bg-slate-100"></span>
             </h3>
             {user.role === UserRole.STUDENT ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {myResults.map(res => {
                     const exam = exams.find(e => e.id === res.examId);
                     return (
                       <div key={res.id} className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                          <div className="flex justify-between items-start mb-4">
                             <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${res.status === 'PASS' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{res.status}</span>
                             <button onClick={() => onViewResult(res)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={16}/></button>
                          </div>
                          <h4 className="font-black text-slate-800 text-base leading-tight mb-3 line-clamp-1">{exam?.title || 'System Audit Log'}</h4>
                          <div className="flex items-baseline gap-2">
                             <span className="text-3xl font-black text-slate-900 tracking-tighter">{Math.round((res.score / res.totalMarks) * 100)}%</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase">Mastery</span>
                          </div>
                       </div>
                     );
                   })}
                   {myResults.length === 0 && (
                     <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No attempt clusters logged</p>
                     </div>
                   )}
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {myQuestions.slice(0, 6).map(q => (
                     <div key={q.id} className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                           <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${q.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' : q.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{q.status}</span>
                        </div>
                        <p className="font-black text-slate-800 text-sm line-clamp-2 leading-relaxed mb-3">{q.questionText}</p>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{q.difficulty} Level</span>
                     </div>
                   ))}
                   {myQuestions.length === 0 && (
                     <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No knowledge submissions logged</p>
                     </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ onViewResult: (result: ExamResult) => void; onEditProfile: () => void }> = ({ onViewResult, onEditProfile }) => {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  return <UserDetailView user={currentUser} onBack={() => {}} onViewResult={onViewResult} onEditProfile={onEditProfile} />;
};

const AppContent: React.FC = () => {
  const { currentUser, saveResult, results, exams, settings, isLoading } = useApp();
  const [activeView, setActiveView] = useState('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [sandboxExam, setSandboxExam] = useState<Exam | null>(null); // State for sandbox previews
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<MCQ | null>(null);
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', `${settings.baseFontSize}px`);
  }, [settings.baseFontSize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <h2 className="font-black text-xl text-slate-800 uppercase tracking-widest">Synchronizing Nodes</h2>
      </div>
    );
  }

  if (!currentUser && !isAuthOpen) return <LandingPage onEnterAuth={() => setIsAuthOpen(true)} />;
  if (!currentUser && isAuthOpen) return <Auth onGoBack={() => setIsAuthOpen(false)} />;

  // Render Sandbox Simulation
  if (sandboxExam) {
    return (
      <ExamSession 
        exam={sandboxExam} 
        onCancel={() => setSandboxExam(null)} 
        onComplete={() => setSandboxExam(null)} 
        isSandbox={true}
      />
    );
  }

  if (activeExam) {
    return (
      <ExamSession 
        exam={activeExam} 
        onCancel={() => setActiveExam(null)} 
        onComplete={(result) => {
          saveResult(result);
          setLastResult(result);
          setActiveExam(null);
        }} 
      />
    );
  }

  if (lastResult) {
    const exam = exams.find(e => e.id === lastResult.examId);
    if (exam) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-16">
          <ResultSummary result={lastResult} exam={exam} onDone={() => setLastResult(null)} />
        </div>
      );
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        if (currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.ADMIN) return <SuperAdminDashboard />;
        if (currentUser?.role === UserRole.AUTHOR) return <AuthorDashboard />;
        if (currentUser?.role === UserRole.STUDENT) return <StudentDashboard onStartExam={setActiveExam} />;
        return null;
      case 'users': 
        return (
          <UserManagement 
            onViewUser={(user) => {
              setInspectingUser(user);
              setActiveView('inspect-user');
            }} 
          />
        );
      case 'inspect-user':
        return inspectingUser ? (
          <UserDetailView 
            user={inspectingUser} 
            onBack={() => {
              setActiveView('users');
              setInspectingUser(null);
            }}
            onViewResult={setLastResult}
          />
        ) : null;
      case 'exams': return <ExamManagement onLaunchSimulation={setSandboxExam} />;
      case 'my-exams': return <AuthorExamManagement onLaunchSimulation={setSandboxExam} />;
      case 'settings': return <SiteSettingsView />;
      case 'categories': return <CategoryManagement />;
      case 'questions': return <QuestionModeration />;
      case 'reports': return <Reports />;
      case 'certificates': return <CertificateManagement />;
      case 'profile-settings': 
        return <ProfileSettings onBack={() => setActiveView('profile')} />;
      case 'add-question':
        return <QuestionForm 
          initialData={editingQuestion}
          onComplete={() => {
            setActiveView(currentUser?.role === UserRole.AUTHOR ? 'my-questions' : 'questions');
            setEditingQuestion(null);
          }} 
        />;
      case 'my-questions':
        return (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">My Submissions</h3>
              </div>
              <button 
                onClick={() => { setEditingQuestion(null); setActiveView('add-question'); }}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"
              >
                <Plus size={20} /> New Asset
              </button>
            </div>
            <QuestionModeration 
              authorId={currentUser?.id} 
              onEdit={(q) => { setEditingQuestion(q); setActiveView('add-question'); }}
            />
          </div>
        );
      case 'my-results':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {results.filter(r => r.studentId === currentUser?.id).map(res => (
              <div key={res.id} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
                <div>
                  <div className="flex justify-between items-start mb-8">
                     <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border ${res.status === 'PASS' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{res.status}</span>
                     <span className="text-[9px] text-slate-400 font-black">{new Date(res.completedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-xl md:text-3xl mb-6 leading-tight truncate">{exams.find(e => e.id === res.examId)?.title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tighter">{Math.round((res.score / res.totalMarks) * 100)}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Mastery</span>
                  </div>
                </div>
                <button onClick={() => setLastResult(res)} className="mt-10 w-full py-4 bg-slate-50 text-slate-800 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase hover:border-indigo-200 transition-all">View Audit</button>
              </div>
            ))}
          </div>
        );
      case 'profile': return <ProfileView onViewResult={setLastResult} onEditProfile={() => setActiveView('profile-settings')} />;
      default: return <div className="p-20 text-center">Section Offline</div>;
    }
  };

  return <Layout activeView={activeView} setActiveView={setActiveView}>{renderContent()}</Layout>;
};

const App: React.FC = () => (
  <AppProvider><AppContent /></AppProvider>
);

export default App;