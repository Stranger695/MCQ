
import React, { useState, useEffect } from 'react';
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
import { Leaderboard } from './views/Leaderboard';
import { CertificateManagement } from './views/CertificateManagement';
import { ProfileSettings } from './views/ProfileSettings';
import { InquiriesView } from './views/InquiriesView';
import { CategoryManagement } from './views/CategoryManagement';
import UserAuditProfile from './views/UserAuditProfile';
import ExamSession from './views/ExamSession';
import RegistryView from './views/RegistryView';
import LegalView from './views/LegalView';
import CandidatePortal from './views/CandidatePortal';
import SuccessRateView from './views/SuccessRateView';
import GdprAuditView from './views/GdprAuditView';
import CertificateView from './views/CertificateView';
import { UserRole, Exam, ExamResult, MCQ, User } from './types';
import { 
  Award, 
  XCircle, 
  Plus, 
  ShieldAlert,
  FileText,
  ShieldCheck
} from 'lucide-react';

const ResultSummary: React.FC<{ result: ExamResult; exam: Exam; onDone: () => void; onViewCertificate?: () => void }> = ({ result, exam, onDone, onViewCertificate }) => {
  const percentage = (result.score / (result.totalMarks || 1)) * 100;
  return (
    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-2xl w-full border border-slate-200 animate-in zoom-in-95 duration-500">
      <div className={`p-12 text-center text-white ${result.status === 'PASS' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
          {result.status === 'PASS' ? <Award size={48} /> : <XCircle size={48} />}
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{result.status === 'PASS' ? 'Academic Success' : 'Session Deficit'}</h2>
        <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{exam.title}</p>
      </div>
      <div className="p-12 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-4xl font-black text-slate-800 tracking-tighter">
              {percentage % 1 === 0 ? percentage : percentage.toFixed(2)}%
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Mastery Index</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-4xl font-black text-slate-800 tracking-tighter">
              {result.score % 1 === 0 ? result.score : result.score.toFixed(2)}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Earned Points</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {result.status === 'PASS' && onViewCertificate && (
            <button 
              onClick={onViewCertificate}
              className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <ShieldCheck size={18} /> Generate Official Certificate
            </button>
          )}
          <button 
            onClick={onDone} 
            className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Finish Session Audit
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, saveResult, results, exams, settings, isLoading } = useApp();
  const [activeView, setActiveView] = useState('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [sandboxExam, setSandboxExam] = useState<Exam | null>(null);
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<ExamResult | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<MCQ | null>(null);
  const [auditingUser, setAuditingUser] = useState<User | null>(null);
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

  if (activeCertificate) {
    return <CertificateView result={activeCertificate} onBack={() => setActiveCertificate(null)} />;
  }

  if (sandboxExam) {
    return <ExamSession exam={sandboxExam} onCancel={() => setSandboxExam(null)} onComplete={() => setSandboxExam(null)} isSandbox={true} />;
  }

  if (activeExam) {
    return <ExamSession exam={activeExam} onCancel={() => setActiveExam(null)} onComplete={(result) => { saveResult(result); setLastResult(result); setActiveExam(null); }} />;
  }

  if (lastResult) {
    const exam = exams.find(e => e.id === lastResult.examId);
    if (exam) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-16">
          <ResultSummary 
            result={lastResult} 
            exam={exam} 
            onDone={() => setLastResult(null)} 
            onViewCertificate={() => {
              setActiveCertificate(lastResult);
              setLastResult(null);
            }}
          />
        </div>
      );
    }
  }

  const renderContent = () => {
    const role = currentUser?.role;

    const restrictTo = (allowedRoles: UserRole[], component: React.ReactNode) => {
      if (role && allowedRoles.includes(role)) return component;
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <ShieldAlert size={64} className="text-rose-500 mb-6" />
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Access Denied</h3>
          <p className="text-slate-500 mt-2">Your current identity node does not have sufficient clearance for this sector.</p>
          <button onClick={() => setActiveView('dashboard')} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px]">Return to Terminal</button>
        </div>
      );
    };

    switch (activeView) {
      case 'dashboard':
        if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) return <SuperAdminDashboard onNavigate={setActiveView} />;
        if (role === UserRole.AUTHOR) return <AuthorDashboard />;
        if (role === UserRole.STUDENT) return <CandidatePortal onNavigate={setActiveView} onStartExam={setActiveExam} />;
        return <div className="p-20 text-center font-black text-slate-400">ROLE_UNRECOGNIZED: {role}</div>;

      case 'registry':
        return <RegistryView onStartExam={setActiveExam} />;

      case 'success-rates':
        return <SuccessRateView />;

      case 'gdpr':
        return <GdprAuditView />;

      case 'users': 
        if (auditingUser) return <UserAuditProfile user={auditingUser} onBack={() => setAuditingUser(null)} />;
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <UserManagement onViewUser={setAuditingUser} />);

      case 'message': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <InquiriesView />);

      case 'reports': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <Reports />);

      case 'categories': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <CategoryManagement />);

      case 'exams': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <ExamManagement onLaunchSimulation={setSandboxExam} />);

      case 'questions': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <QuestionModeration onEdit={(q) => { setEditingQuestion(q); setActiveView('add-question'); }} />);

      case 'certificates': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <CertificateManagement onViewCertificate={setActiveCertificate} />);

      case 'settings': 
        return restrictTo([UserRole.SUPER_ADMIN, UserRole.ADMIN], <SiteSettingsView />);

      case 'my-exams': 
        return restrictTo([UserRole.AUTHOR, UserRole.SUPER_ADMIN], <AuthorExamManagement onLaunchSimulation={setSandboxExam} />);

      case 'my-questions':
        return restrictTo([UserRole.AUTHOR, UserRole.SUPER_ADMIN, UserRole.ADMIN], (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">My Submissions</h3>
              <button onClick={() => { setEditingQuestion(null); setActiveView('add-question'); }} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-indigo-700 flex items-center gap-4"><Plus size={20} /> New Asset</button>
            </div>
            <QuestionModeration authorId={currentUser?.id} onEdit={(q) => { setEditingQuestion(q); setActiveView('add-question'); }} />
          </div>
        ));

      case 'add-question':
        return <QuestionForm initialData={editingQuestion} onComplete={() => { setActiveView(role === UserRole.AUTHOR ? 'my-questions' : 'questions'); setEditingQuestion(null); }} />;

      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <ProfileSettings onBack={() => setActiveView('dashboard')} />;
      
      // Legal Views
      case 'privacy': return <LegalView type="privacy" onBack={() => setActiveView('dashboard')} />;
      case 'terms': return <LegalView type="terms" onBack={() => setActiveView('dashboard')} />;

      case 'my-results':
        if (role !== UserRole.STUDENT) return restrictTo([UserRole.STUDENT], null);
        const myRes = results.filter(r => r.studentId === currentUser?.id);
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {myRes.map(res => {
              const perc = (res.score / (res.totalMarks || 1)) * 100;
              const hasCertificate = !!res.certificateId;
              return (
                <div key={res.id} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                       <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border ${res.status === 'PASS' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{res.status}</span>
                       <span className="text-[9px] text-slate-400 font-black">{new Date(res.completedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-black text-slate-800 text-xl md:text-3xl mb-6 leading-tight truncate">{exams.find(e => e.id === res.examId)?.title || 'Audit Log'}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tighter">{perc % 1 === 0 ? perc : perc.toFixed(2)}%</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Mastery</span>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-col gap-3">
                    {hasCertificate && (
                       <button 
                        onClick={() => setActiveCertificate(res)}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                       >
                         <Award size={16} /> View Certificate
                       </button>
                    )}
                    <button 
                      onClick={() => setLastResult(res)} 
                      className="w-full py-4 bg-slate-50 text-slate-800 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> Session Audit
                    </button>
                  </div>
                </div>
              );
            })}
            {myRes.length === 0 && <div className="col-span-full p-20 text-center text-slate-400 font-black uppercase">No Results Found</div>}
          </div>
        );

      default: return <div className="p-20 text-center font-black text-slate-400">UNMAPPED_SECTOR: {activeView}</div>;
    }
  };

  return <Layout activeView={activeView} setActiveView={setActiveView}>{renderContent()}</Layout>;
};

const App: React.FC = () => (
  <AppProvider><AppContent /></AppProvider>
);

export default App;
