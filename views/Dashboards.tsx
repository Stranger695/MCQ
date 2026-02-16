
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { UserRole, QuestionStatus, ExamResult, MCQ, Difficulty, Exam } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Award, CheckCircle, Clock, BookOpen, Users, FileText, TrendingUp, HelpCircle, AlertCircle, Sparkles, Target, Percent, ChevronRight, BarChart3, Layers, Flame, Star, Zap } from 'lucide-react';

const DashboardCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-xl transition-all duration-300 group">
    <div>
      <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-xl md:text-4xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
    <div className={`p-3 md:p-5 rounded-2xl md:rounded-3xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

const getDifficultyUI = (diff?: Difficulty) => {
  switch (diff) {
    case Difficulty.EASY:
      return {
        label: 'Foundational',
        icon: <Zap size={14} className="text-emerald-500" />,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        dots: 'bg-emerald-400'
      };
    case Difficulty.HARD:
      return {
        label: 'Master Tier',
        icon: <Flame size={14} className="text-rose-500" />,
        color: 'bg-rose-50 text-rose-700 border-rose-100',
        dots: 'bg-rose-400'
      };
    default:
      return {
        label: 'Intermediate',
        icon: <Star size={14} className="text-amber-500" />,
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        dots: 'bg-amber-400'
      };
  }
};

export const SuperAdminDashboard: React.FC = () => {
  const { users, questions, exams, results } = useApp();
  
  const stats = [
    { title: 'Total Users', value: users.length, icon: <Users size={20} md-size={28} />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Total Exams', value: exams.length, icon: <BookOpen size={20} md-size={28} />, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Questions', value: questions.length, icon: <HelpCircle size={20} md-size={28} />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Certificates', value: results.filter(r => r.status === 'PASS').length, icon: <Award size={20} md-size={28} />, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((s, i) => <DashboardCard key={i} {...s} />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
            <TrendingUp size={24} className="text-indigo-600" /> Recent Activity
          </h3>
          <div className="space-y-4 md:space-y-5">
            {results.slice(-6).reverse().map(res => (
              <div key={res.id} className="flex items-center justify-between p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${res.status === 'PASS' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                  <div className="max-w-[120px] md:max-w-none">
                    <p className="text-xs md:text-lg font-black text-slate-800 truncate">{users.find(u => u.id === res.studentId)?.name}</p>
                    <p className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{exams.find(e => e.id === res.examId)?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xs md:text-xl font-black text-indigo-600 bg-white md:bg-transparent px-3 py-1.5 md:px-0 md:py-0 rounded-xl border md:border-0 border-slate-100 shadow-sm md:shadow-none">{Math.round((res.score / res.totalMarks) * 100)}%</span>
                  <div className={`p-2 rounded-lg bg-white shadow-sm border border-slate-50 transition-transform group-hover:scale-110 ${res.status === 'PASS' ? 'text-green-500' : 'text-red-500'}`}>
                    {res.status === 'PASS' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  </div>
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Null activity logs found</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
             <Users size={24} className="text-blue-600" /> User Distribution
           </h3>
           <div className="h-72 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { role: 'Student', count: users.filter(u => u.role === UserRole.STUDENT).length },
                  { role: 'Author', count: users.filter(u => u.role === UserRole.AUTHOR).length },
                  { role: 'Admin', count: users.filter(u => u.role === UserRole.ADMIN).length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="role" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={50}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#6366f1" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export const AuthorDashboard: React.FC = () => {
  const { questions, currentUser, categories } = useApp();
  const myQuestions = questions.filter(q => q.authorId === currentUser?.id);
  
  const stats = [
    { title: 'Submissions', value: myQuestions.length, icon: <FileText size={20} md-size={28} />, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Approved', value: myQuestions.filter(q => q.status === QuestionStatus.APPROVED).length, icon: <CheckCircle size={20} md-size={28} />, color: 'bg-green-50 text-green-600' },
    { title: 'Pending', value: myQuestions.filter(q => q.status === QuestionStatus.PENDING).length, icon: <Clock size={20} md-size={28} />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Rejected', value: myQuestions.filter(q => q.status === QuestionStatus.REJECTED).length, icon: <AlertCircle size={20} md-size={28} />, color: 'bg-red-50 text-red-600' },
  ];

  // Difficulty performance metrics
  const difficultyData = Object.values(Difficulty).map(diff => {
    const total = myQuestions.filter(q => q.difficulty === diff).length;
    const approved = myQuestions.filter(q => q.difficulty === diff && q.status === QuestionStatus.APPROVED).length;
    return { name: diff, Total: total, Approved: approved };
  });

  // Category performance metrics
  const categoryData = categories.map(cat => {
    const total = myQuestions.filter(q => q.categoryId === cat.id).length;
    const approved = myQuestions.filter(q => q.categoryId === cat.id && q.status === QuestionStatus.APPROVED).length;
    if (total === 0) return null;
    return { name: cat.name, Total: total, Approved: approved };
  }).filter(Boolean);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((s, i) => <DashboardCard key={i} {...s} />)}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Approval Rate by Difficulty */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
            <BarChart3 size={24} className="text-indigo-600" /> Difficulty Performance
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="Total" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={32} />
                <Bar dataKey="Approved" fill="#10b981" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Rate by Category */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
            <Layers size={24} className="text-indigo-600" /> Category Performance
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="Total" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={32} />
                <Bar dataKey="Approved" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complexity Distribution Pie */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-sm text-center">
        <h3 className="text-sm md:text-lg font-black mb-10 uppercase tracking-[0.4em] text-slate-800 flex items-center justify-center gap-4">
          <TrendingUp size={24} className="text-indigo-600" /> Submission Volume Matrix
        </h3>
        <div className="h-72 md:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Easy', value: myQuestions.filter(q => q.difficulty === 'EASY').length },
                  { name: 'Medium', value: myQuestions.filter(q => q.difficulty === 'MEDIUM').length },
                  { name: 'Hard', value: myQuestions.filter(q => q.difficulty === 'HARD').length }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={12}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-16 mt-8">
           <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-emerald-100">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Easy Submissions
           </div>
           <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 text-amber-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-amber-100">
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> Medium Submissions
           </div>
           <div className="flex items-center gap-3 px-6 py-3 bg-rose-50 text-rose-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-rose-100">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Hard Submissions
           </div>
        </div>
      </div>
    </div>
  );
};

export const StudentDashboard: React.FC<{ onStartExam: (exam: any) => void }> = ({ onStartExam }) => {
  const { exams, results, currentUser, categories } = useApp();
  
  const myResults = results.filter(r => r.studentId === currentUser?.id);
  const passCount = myResults.filter(r => r.status === 'PASS').length;
  const avgScore = myResults.length > 0 
    ? Math.round(myResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / myResults.length * 100) 
    : 0;

  return (
    <div className="space-y-12 md:space-y-16 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
        <DashboardCard title="Attempts Logged" value={myResults.length} icon={<BookOpen size={24} md-size={32} />} color="bg-indigo-50 text-indigo-600" />
        <DashboardCard title="Mean Mastery" value={`${avgScore}%`} icon={<TrendingUp size={24} md-size={32} />} color="bg-green-50 text-green-600" />
        <DashboardCard title="Credentials" value={passCount} icon={<Award size={24} md-size={32} />} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="space-y-10 md:space-y-12">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">Available Sessions</h3>
            <p className="text-xs md:text-base text-slate-500 mt-1 font-medium">Select a cluster to initiate academic assessment.</p>
          </div>
          <span className="hidden sm:flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 shadow-sm animate-pulse">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div> Live Registry
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {exams.filter(e => e.isEnabled).map(exam => {
            const diffUI = getDifficultyUI(exam.difficulty);
            return (
              <div key={exam.id} className="group bg-white rounded-[2.5rem] md:rounded-[4.5rem] border-2 border-slate-100 p-8 md:p-14 hover:border-indigo-200 hover:shadow-[0_64px_128px_-32px_rgba(79,70,229,0.12)] transition-all duration-700 flex flex-col relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                
                <div className="flex flex-col gap-4 mb-8 md:mb-12 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] md:text-xs font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                        {categories.find(c => c.id === exam.categoryId)?.name}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${diffUI.color}`}>
                      {diffUI.icon}
                      {diffUI.label}
                    </div>
                  </div>
                  {/* Topic visualization dots */}
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= (exam.difficulty === Difficulty.HARD ? 5 : exam.difficulty === Difficulty.MEDIUM ? 3 : 1) ? diffUI.dots + ' w-4' : 'bg-slate-100 w-2'}`}></div>
                    ))}
                  </div>
                </div>

                <div className="mb-10 md:mb-14 relative z-10">
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight group-hover:text-indigo-600 transition-colors duration-500">
                    {exam.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-y-10 md:gap-y-12 gap-x-10 md:gap-x-14 mb-12 md:mb-16 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Clock size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                      Duration
                    </div>
                    <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{exam.durationMinutes}<span className="text-xs text-slate-400 ml-1 font-bold">Mins</span></p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <BookOpen size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                      Items
                    </div>
                    <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{exam.totalQuestions}<span className="text-xs text-slate-400 ml-1 font-bold">MCQs</span></p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Target size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                      Negative
                    </div>
                    <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">-{exam.negativeMarking}<span className="text-xs text-slate-400 ml-1 font-bold">Penalty</span></p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Percent size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                      Pass Rate
                    </div>
                    <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{exam.passPercentage}<span className="text-xs text-slate-400 ml-1 font-bold">% Threshold</span></p>
                  </div>
                </div>

                <div className="mt-auto relative z-10 pt-4">
                  <button 
                    onClick={() => onStartExam(exam)}
                    className="w-full py-5 md:py-7 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-[1.5rem] md:rounded-[2.5rem] hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 group/btn active:scale-95"
                  >
                    Initiate Attempt 
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:translate-x-2 transition-transform">
                      <ChevronRight size={18} />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
          {exams.filter(e => e.isEnabled).length === 0 && (
             <div className="col-span-full py-32 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
                <BookOpen size={64} className="mx-auto text-slate-200 mb-8" />
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-300">No active examinations in current sector</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
