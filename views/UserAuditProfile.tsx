import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { User, UserRole, UserStatus, MCQ, ExamResult, Difficulty } from '../types';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Building2, 
  Shield, 
  Activity, 
  Award, 
  FileText, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Hash,
  ShieldCheck,
  Zap,
  Star,
  Flame,
  Users
} from 'lucide-react';

interface UserAuditProfileProps {
  user: User;
  onBack: () => void;
}

const UserAuditProfile: React.FC<UserAuditProfileProps> = ({ user, onBack }) => {
  const { results, questions, exams } = useApp();

  const userResults = useMemo(() => results.filter(r => r.studentId === user.id), [results, user.id]);
  const userQuestions = useMemo(() => questions.filter(q => q.authorId === user.id), [questions, user.id]);
  
  const stats = useMemo(() => {
    const totalAttempts = userResults.length;
    const passes = userResults.filter(r => r.status === 'PASS').length;
    const avgScore = totalAttempts > 0 
      ? Math.round(userResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / totalAttempts * 100) 
      : 0;
    
    return { totalAttempts, passes, avgScore, authored: userQuestions.length };
  }, [userResults, userQuestions]);

  const getDifficultyIcon = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return <Zap size={12} className="text-emerald-500" />;
      case Difficulty.HARD: return <Flame size={12} className="text-rose-500" />;
      default: return <Star size={12} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">User Identity Node</h2>
          <p className="text-slate-500 mt-1 font-medium font-mono text-xs uppercase tracking-widest">Global Registry ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
            </div>
            <div className="px-8 pb-10 -mt-16 relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white border-4 border-white shadow-2xl mx-auto flex items-center justify-center overflow-hidden mb-6">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} /> : <UserIcon size={48} className="text-slate-200" />}
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-800">{user.name}</h3>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 inline-block px-4 py-1.5 rounded-full border border-indigo-100">
                  {user.role.replace('_', ' ')}
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className={`w-2 h-2 rounded-full ${user.status === UserStatus.ACTIVE ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.status} STATUS</span>
                </div>
              </div>

              <div className="mt-10 space-y-4 pt-10 border-t border-slate-100">
                <div className="flex items-center gap-4 text-slate-600">
                  <Mail size={18} className="text-slate-300 shrink-0" />
                  <span className="text-sm font-bold truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <Hash size={18} className="text-slate-300 shrink-0" />
                  <span className="text-sm font-bold">@{user.username || 'unmapped'}</span>
                </div>
                {user.gender && (
                   <div className="flex items-center gap-4 text-slate-600">
                    <Users size={18} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold uppercase tracking-wide text-xs">{user.gender.replace(/_/g, ' ')}</span>
                  </div>
                )}
                {user.birthdate && (
                   <div className="flex items-center gap-4 text-slate-600">
                    <Calendar size={18} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold">{new Date(user.birthdate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-4 text-slate-600">
                    <Phone size={18} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold">{user.phoneNumber}</span>
                  </div>
                )}
                {(user.division || user.district) && (
                  <div className="flex items-center gap-4 text-slate-600">
                    <MapPin size={18} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold">{[user.district, user.division].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {user.work && (
                  <div className="flex items-center gap-4 text-slate-600">
                    <Briefcase size={18} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold">{user.work}</span>
                  </div>
                )}
                {user.organization && (
                  <div className="flex items-center gap-4 text-slate-600">
                    <Building2 size={18} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-bold">{user.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Activity size={14} /> Protocol Engagement
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase mb-1">Joined System</p>
                <p className="text-sm font-black">{new Date(user.joinedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase mb-1">Clearance Level</p>
                <p className="text-sm font-black">{user.role.split('_')[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Activity (Conditional) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Performance Dashboard - Only for Students or if they have results */}
          {(user.role === UserRole.STUDENT || userResults.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <TrendingUp size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mean Mastery</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{stats.avgScore}%</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <Award size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Credentials</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{stats.passes}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <FileText size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Attempts</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{stats.totalAttempts}</p>
              </div>
            </div>
          )}

          {/* Knowledge Nodes - Only for Authors or if they have questions */}
          {userQuestions.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Shield size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authored knowledge Nodes</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{stats.authored}</p>
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs (Results) - Only for Students or if results exist */}
          {userResults.length > 0 && (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                  <Activity size={18} className="text-indigo-600" /> Historical Session Audit
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Examination Node</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userResults.map(res => {
                      const exam = exams.find(e => e.id === res.examId);
                      return (
                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-black text-slate-800">{exam?.title || 'System Audit'}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {res.examId}</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <p className="text-lg font-black text-slate-800 tracking-tighter">{Math.round((res.score / res.totalMarks) * 100)}%</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${res.status === 'PASS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase">
                            {new Date(res.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Authored Fragments - Detailed List */}
          {userQuestions.length > 0 && (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                  <FileText size={18} className="text-indigo-600" /> Authored Fragments
                </h4>
              </div>
              <div className="p-8 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {userQuestions.map(q => (
                  <div key={q.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-[8px] font-black uppercase tracking-widest text-slate-500">
                        {getDifficultyIcon(q.difficulty)}
                        {q.difficulty} LVL
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${q.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-700 leading-snug line-clamp-2">{q.questionText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No Data State for Admins with no activity */}
          {userResults.length === 0 && userQuestions.length === 0 && (
             <div className="py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
                <UserIcon size={64} className="mx-auto text-slate-100 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No activity clusters recorded for this node</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuditProfile;