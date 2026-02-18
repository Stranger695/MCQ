import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { UserRole, QuestionStatus, Difficulty, UserStatus } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart, 
  Pie,
  Area,
  AreaChart
} from 'recharts';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Users, 
  FileText, 
  TrendingUp, 
  HelpCircle, 
  Target, 
  ChevronRight, 
  BarChart3, 
  Layers, 
  Flame, 
  Star, 
  Zap, 
  Gauge, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  MoreVertical,
  Briefcase,
  Lock,
  Library
} from 'lucide-react';

const DashboardCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; trend?: string }> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[3rem] shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-start justify-between mb-3 md:mb-4">
      <div className={`p-3 md:p-5 rounded-xl md:rounded-3xl ${color} shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[8px] md:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 md:px-2.5 py-1 rounded-full border border-emerald-100">
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{title}</p>
      <h3 className="text-2xl md:text-5xl font-black text-slate-800 tracking-tight truncate">{value}</h3>
    </div>
  </div>
);

const getDifficultyUI = (diff?: Difficulty) => {
  switch (diff) {
    case Difficulty.EASY:
      return {
        label: 'Foundational',
        icon: <Zap size={12} className="text-emerald-500" />,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
      };
    case Difficulty.HARD:
      return {
        label: 'Master Tier',
        icon: <Flame size={12} className="text-rose-500" />,
        color: 'bg-rose-50 text-rose-700 border-rose-100'
      };
    default:
      return {
        label: 'Intermediate',
        icon: <Star size={12} className="text-amber-500" />,
        color: 'bg-amber-50 text-amber-700 border-amber-100'
      };
  }
};

export const SuperAdminDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const { users, questions, exams, results } = useApp();
  
  const stats = [
    { title: 'Registry', value: users.length, icon: <Users />, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { title: 'Clusters', value: exams.length, icon: <BookOpen />, color: 'bg-indigo-50 text-indigo-600', trend: '+4' },
    { title: 'MCQs', value: questions.length, icon: <HelpCircle />, color: 'bg-amber-50 text-amber-600', trend: '+128' },
    { title: 'Yield', value: results.filter(r => r.status === 'PASS').length, icon: <Award />, color: 'bg-emerald-50 text-emerald-600', trend: '84%' }
  ];

  const volumeData = [
    { day: 'Mon', attempts: 120, pass: 80 }, { day: 'Tue', attempts: 150, pass: 95 },
    { day: 'Wed', attempts: 210, pass: 140 }, { day: 'Thu', attempts: 180, pass: 110 },
    { day: 'Fri', attempts: 240, pass: 175 }, { day: 'Sat', attempts: 190, pass: 130 },
    { day: 'Sun', attempts: 160, pass: 105 },
  ];

  const difficultyPieData = useMemo(() => {
    return Object.values(Difficulty).map(diff => ({
      name: diff,
      value: questions.filter(q => q.difficulty === diff).length
    }));
  }, [questions]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        {stats.map((s, i) => <DashboardCard key={i} {...s} />)}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        <div className="xl:col-span-2 bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="mb-8 md:mb-10">
            <h3 className="text-sm md:text-lg font-black flex items-center gap-3 uppercase tracking-[0.2em] text-slate-800">
              <Activity size={18} className="text-indigo-600" /> Activity Stream
            </h3>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold mt-1">Platform volume vs. success rates</p>
          </div>
          <div className="h-60 md:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} fontWeight="900" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="900" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttempts)" />
                <Area type="monotone" dataKey="pass" stroke="#10b981" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm md:text-lg font-black mb-8 md:mb-10 flex items-center gap-3 uppercase tracking-[0.2em] text-slate-800">
             <Layers size={18} className="text-amber-500" /> Knowledge Mix
           </h3>
           <div className="h-60 md:h-80 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={difficultyPieData} innerRadius={60} outerRadius={80} paddingAngle={6} dataKey="value" stroke="none">
                    {difficultyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-1 gap-2">
              {difficultyPieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-600">{d.name}</span>
                  <span className="text-xs font-black text-slate-800">{d.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm md:text-lg font-black flex items-center gap-3 uppercase tracking-[0.2em] text-slate-800">
              <TrendingUp size={18} className="text-indigo-600" /> Global Log
            </h3>
            <button onClick={() => onNavigate?.('reports')} className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Reports</button>
          </div>
          <div className="space-y-4">
            {results.slice(-4).reverse().map(res => {
              const student = users.find(u => u.id === res.studentId);
              const exam = exams.find(e => e.id === res.examId);
              return (
                <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-black shrink-0 text-sm">
                      {student?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">{student?.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{exam?.title}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-black text-indigo-600">{Math.round((res.score / res.totalMarks) * 100)}%</p>
                    <p className={`text-[8px] font-black uppercase tracking-widest ${res.status === 'PASS' ? 'text-emerald-500' : 'text-rose-500'}`}>{res.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] text-white overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-[10px] font-black mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-white/60">
                <ShieldCheck size={18} className="text-indigo-400" /> Infrastructure Nodes
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Compute</span>
                  <p className="text-xl font-black">99.98% <span className="text-[9px] text-emerald-400 ml-1">UP</span></p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Storage</span>
                  <p className="text-xl font-black">34.2 GB <span className="text-[9px] text-indigo-400 ml-1">MAP</span></p>
                </div>
              </div>
           </div>

           <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
             <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-slate-800">
               <Briefcase size={18} className="text-blue-600" /> Top Authors
             </h3>
             <div className="space-y-4">
               {users.filter(u => u.role === UserRole.AUTHOR).slice(0, 3).map((author, i) => (
                 <div key={author.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-4 min-w-0">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xs shrink-0">{i + 1}</div>
                     <div className="min-w-0">
                       <p className="text-sm font-black text-slate-800 truncate">{author.name}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase">{questions.filter(q => q.authorId === author.id).length} Subs</p>
                     </div>
                   </div>
                   <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden shrink-0 ml-4">
                     <div className="h-full bg-indigo-500" style={{ width: '75%' }}></div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const AuthorDashboard: React.FC = () => {
  const { questions, currentUser, categories } = useApp();
  const myQuestions = questions.filter(q => q.authorId === currentUser?.id);
  
  const totalApproved = myQuestions.filter(q => q.status === QuestionStatus.APPROVED).length;
  const globalApprovalRate = myQuestions.length > 0 ? Math.round((totalApproved / myQuestions.length) * 100) : 0;

  const stats = [
    { title: 'Submissions', value: myQuestions.length, icon: <FileText />, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Approved', value: totalApproved, icon: <CheckCircle />, color: 'bg-green-50 text-green-600' },
    { title: 'Pending', value: myQuestions.filter(q => q.status === QuestionStatus.PENDING).length, icon: <Clock />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Quality Index', value: `${globalApprovalRate}%`, icon: <Gauge />, color: 'bg-purple-50 text-purple-600' }
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        {stats.map((s, i) => <DashboardCard key={i} {...s} />)}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-slate-800">
            <BarChart3 size={18} className="text-indigo-600" /> Activity Analytics
          </h3>
          <div className="h-60 md:h-80 w-full flex items-center justify-center text-slate-300">
             <Activity size={48} className="opacity-10" />
             <p className="text-[10px] font-black uppercase tracking-widest ml-4">Chart node initializing...</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-slate-800">
            <Layers size={18} className="text-indigo-600" /> Subject Coverage
          </h3>
          <div className="space-y-4">
             {categories.slice(0, 5).map((cat, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-black text-slate-600 truncate mr-4">{cat.name}</span>
                  <span className="text-xs font-black text-indigo-600">Active</span>
               </div>
             ))}
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

  const isInactive = currentUser?.status === UserStatus.INACTIVE;

  return (
    <div className="space-y-8 md:space-y-16 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-10">
        <DashboardCard title="Logged" value={myResults.length} icon={<BookOpen />} color="bg-indigo-50 text-indigo-600" />
        <DashboardCard title="Mastery" value={`${avgScore}%`} icon={<TrendingUp />} color="bg-green-50 text-green-600" />
        <DashboardCard title="Credentials" value={passCount} icon={<Award />} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="space-y-6 md:space-y-12">
        <div className="px-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">Active Assessments</h3>
            <p className="text-[10px] md:text-base text-slate-500 mt-1 font-medium uppercase tracking-widest">Select a cluster to initiate.</p>
          </div>
          {isInactive && (
            <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 w-fit">
              <Lock size={14} />
              <span className="text-[10px] font-black uppercase">Attempts Locked</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
          {exams.filter(e => e.isEnabled).map(exam => {
            const diffUI = getDifficultyUI(exam.difficulty);
            return (
              <div key={exam.id} className={`group bg-white rounded-[1.5rem] md:rounded-[4rem] border-2 border-slate-100 p-6 md:p-12 transition-all duration-500 flex flex-col relative overflow-hidden h-full ${isInactive ? 'opacity-75 grayscale-[0.5]' : 'hover:border-indigo-200 hover:shadow-2xl'}`}>
                <div className="flex items-center justify-between mb-6 md:mb-10 relative z-10">
                  <span className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 truncate max-w-[100px]">
                    {categories.find(c => c.id === exam.categoryId)?.name}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-xl border text-[7px] md:text-[8px] font-black uppercase tracking-widest ${diffUI.color}`}>
                    {diffUI.icon} {diffUI.label}
                  </div>
                </div>

                <div className="mb-8 md:mb-12 relative z-10">
                  <h3 className="text-lg md:text-3xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 md:mb-12 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={12} className="text-indigo-300" /> Time
                    </div>
                    <p className="text-sm md:text-xl font-black text-slate-800">{exam.durationMinutes}<span className="text-[9px] md:text-xs text-slate-400 ml-1">min</span></p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Target size={12} className="text-indigo-300" /> Items
                    </div>
                    <p className="text-sm md:text-xl font-black text-slate-800">{exam.totalQuestions}<span className="text-[9px] md:text-xs text-slate-400 ml-1">MCQ</span></p>
                  </div>
                </div>

                <button 
                  disabled={isInactive}
                  onClick={() => onStartExam(exam)}
                  className={`mt-auto w-full py-4 md:py-6 font-black uppercase tracking-widest text-[9px] md:text-xs rounded-xl md:rounded-[2rem] transition-all flex items-center justify-center gap-3 relative z-10 ${
                    isInactive 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-2xl active:scale-95'
                  }`}
                >
                  {isInactive ? <><Lock size={14} /> Locked</> : <><Library size={14} /> Enter Session</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};