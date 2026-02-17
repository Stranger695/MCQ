import React, { useMemo } from 'react';
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
  Legend,
  ComposedChart,
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
  AlertCircle, 
  Sparkles, 
  Target, 
  Percent, 
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
  Briefcase
} from 'lucide-react';

const DashboardCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; trend?: string }> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[3rem] shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-start justify-between mb-3 md:mb-4">
      <div className={`p-2.5 md:p-5 rounded-xl md:rounded-3xl ${color} shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18 }) : icon}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 md:px-2.5 py-1 rounded-full border border-emerald-100">
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
    <div className="min-w-0">
      <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{title}</p>
      <h3 className="text-xl md:text-5xl font-black text-slate-800 tracking-tight truncate">{value}</h3>
    </div>
  </div>
);

// Helper function to provide UI configuration based on exam difficulty
const getDifficultyUI = (diff?: Difficulty) => {
  switch (diff) {
    case Difficulty.EASY:
      return {
        label: 'Foundational',
        icon: <Zap size={12} className="text-emerald-500" />,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        dots: 'bg-emerald-400'
      };
    case Difficulty.HARD:
      return {
        label: 'Master Tier',
        icon: <Flame size={12} className="text-rose-500" />,
        color: 'bg-rose-50 text-rose-700 border-rose-100',
        dots: 'bg-rose-400'
      };
    default:
      return {
        label: 'Intermediate',
        icon: <Star size={12} className="text-amber-500" />,
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        dots: 'bg-amber-400'
      };
  }
};

export const SuperAdminDashboard: React.FC = () => {
  const { users, questions, exams, results, categories } = useApp();
  
  const stats = [
    { title: 'Total Registry', value: users.length, icon: <Users />, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { title: 'Live Clusters', value: exams.length, icon: <BookOpen />, color: 'bg-indigo-50 text-indigo-600', trend: '+4' },
    { title: 'Knowledge Nodes', value: questions.length, icon: <HelpCircle />, color: 'bg-amber-50 text-amber-600', trend: '+128' },
    { title: 'Credentials', value: results.filter(r => r.status === 'PASS').length, icon: <Award />, color: 'bg-emerald-50 text-emerald-600', trend: '84%' }
  ];

  // System Volume Data (Simulated 7 days)
  const volumeData = [
    { day: 'Mon', attempts: 120, pass: 80 },
    { day: 'Tue', attempts: 150, pass: 95 },
    { day: 'Wed', attempts: 210, pass: 140 },
    { day: 'Thu', attempts: 180, pass: 110 },
    { day: 'Fri', attempts: 240, pass: 175 },
    { day: 'Sat', attempts: 190, pass: 130 },
    { day: 'Sun', attempts: 160, pass: 105 },
  ];

  // Difficulty Distribution
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
        {/* Primary Activity Stream */}
        <div className="xl:col-span-2 bg-white p-5 md:p-12 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-20"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 relative z-10 gap-4">
            <div>
              <h3 className="text-xs md:text-lg font-black flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
                <Activity size={18} className="text-indigo-600" /> Activity Stream
              </h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold mt-1">Platform attempt volume vs. success rates</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                 <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-400">Attempts</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-400">Success</span>
               </div>
            </div>
          </div>
          
          <div className="h-56 md:h-96 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={8} fontWeight="900" dy={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={8} fontWeight="900" />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: '900', fontSize: '9px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttempts)" />
                <Area type="monotone" dataKey="pass" stroke="#10b981" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Mix */}
        <div className="bg-white p-5 md:p-12 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm">
           <h3 className="text-xs md:text-lg font-black mb-8 md:mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
             <Layers size={18} className="text-amber-500" /> Knowledge Mix
           </h3>
           <div className="h-56 md:h-80 w-full mb-6 md:mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyPieData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {difficultyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3">
              {difficultyPieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-600">{d.name}</span>
                  </div>
                  <span className="text-xs md:sm font-black text-slate-800">{d.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Recent Activity Registry */}
        <div className="bg-white p-5 md:p-12 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-xs md:text-lg font-black flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
              <TrendingUp size={18} className="text-indigo-600" /> Global Log
            </h3>
            <button className="text-[8px] md:text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Full Audit</button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {results.slice(-6).reverse().map(res => {
              const student = users.find(u => u.id === res.studentId);
              const exam = exams.find(e => e.id === res.examId);
              return (
                <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl md:rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-3 md:gap-6 min-w-0">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-black shrink-0 shadow-sm text-sm">
                      {student?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm md:text-lg font-black text-slate-800 truncate">{student?.name}</p>
                      <p className="text-[8px] md:text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{exam?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs md:text-base font-black text-indigo-600">{Math.round((res.score / res.totalMarks) * 100)}%</p>
                      <p className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${res.status === 'PASS' ? 'text-emerald-500' : 'text-rose-500'}`}>{res.status}</p>
                    </div>
                    <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health & Leaderboard */}
        <div className="space-y-6 md:gap-10">
           {/* System Status */}
           <div className="bg-slate-900 p-6 md:p-12 rounded-2xl md:rounded-[4rem] text-white overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full -mr-16 -mt-16 md:-mr-24 md:-mt-24"></div>
              <h3 className="text-xs font-black mb-6 md:mb-8 flex items-center gap-4 uppercase tracking-[0.2em] text-white/60">
                <ShieldCheck size={18} className="text-indigo-400" /> Infrastructure Nodes
              </h3>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/80">Compute</span>
                  </div>
                  <p className="text-sm md:text-lg font-black">99.98% <span className="text-[7px] md:text-[9px] text-white/40 uppercase ml-1">Up</span></p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/80">Storage</span>
                  </div>
                  <p className="text-sm md:text-lg font-black">34.2 GB <span className="text-[7px] md:text-[9px] text-white/40 uppercase ml-1">Used</span></p>
                </div>
              </div>
           </div>

           {/* Author Leaderboard */}
           <div className="bg-white p-6 md:p-12 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm">
             <h3 className="text-xs font-black mb-8 md:mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-slate-800">
               <Briefcase size={18} className="text-blue-600" /> Author Leaderboard
             </h3>
             <div className="space-y-4 md:space-y-6">
               {users.filter(u => u.role === UserRole.AUTHOR).slice(0, 4).map((author, i) => (
                 <div key={author.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-3 md:gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] md:text-xs">{i + 1}</div>
                     <div className="min-w-0">
                       <p className="text-xs md:text-sm font-black text-slate-800 truncate">{author.name}</p>
                       <p className="text-[7px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{questions.filter(q => q.authorId === author.id).length} Subs</p>
                     </div>
                   </div>
                   <div className="h-1 w-16 md:h-1.5 md:w-24 bg-slate-100 rounded-full overflow-hidden shrink-0">
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
  const globalApprovalRate = myQuestions.length > 0 
    ? Math.round((totalApproved / myQuestions.length) * 100) 
    : 0;

  const stats = [
    { title: 'Submissions', value: myQuestions.length, icon: <FileText />, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Approved', value: totalApproved, icon: <CheckCircle />, color: 'bg-green-50 text-green-600' },
    { title: 'Pending', value: myQuestions.filter(q => q.status === QuestionStatus.PENDING).length, icon: <Clock />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Quality Index', value: `${globalApprovalRate}%`, icon: <Gauge />, color: 'bg-purple-50 text-purple-600' }
  ];

  const difficultyData = Object.values(Difficulty).map(diff => {
    const total = myQuestions.filter(q => q.difficulty === diff).length;
    const approved = myQuestions.filter(q => q.difficulty === diff && q.status === QuestionStatus.APPROVED).length;
    const rate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return { name: diff, Total: total, Approved: approved, Rate: rate };
  });

  const categoryData = categories.map(cat => {
    const total = myQuestions.filter(q => q.categoryId === cat.id).length;
    const approved = myQuestions.filter(q => q.categoryId === cat.id && q.status === QuestionStatus.APPROVED).length;
    const rate = total > 0 ? Math.round((approved / total) * 100) : 0;
    if (total === 0) return null;
    return { name: cat.name, Total: total, Approved: approved, Rate: rate };
  }).filter(item => item !== null) as { name: string; Total: number; Approved: number; Rate: number }[];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        {stats.map((s, i) => <DashboardCard key={i} {...s} />)}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-xs md:text-lg font-black flex items-center gap-3 md:gap-4 uppercase tracking-[0.2em] text-slate-800">
              <BarChart3 size={18} className="text-indigo-600" /> Complexity Approval
            </h3>
          </div>
          <div className="h-56 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={8} fontWeight="900" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" fontSize={8} fontWeight="900" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} hide />
                <Tooltip />
                <Bar yAxisId="left" dataKey="Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="left" dataKey="Approved" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                <Line yAxisId="right" type="monotone" dataKey="Rate" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[4rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-xs md:text-lg font-black flex items-center gap-3 md:gap-4 uppercase tracking-[0.2em] text-slate-800">
              <Layers size={18} className="text-indigo-600" /> Subject Proficiency
            </h3>
          </div>
          <div className="h-56 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 5, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" fontSize={8} fontWeight="900" axisLine={false} tickLine={false} width={60} />
                <Tooltip />
                <Bar dataKey="Rate" radius={[0, 4, 4, 0]} barSize={16}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Rate > 75 ? '#10b981' : entry.Rate > 50 ? '#6366f1' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
    <div className="space-y-8 md:space-y-16 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10">
        <DashboardCard title="Attempts Logged" value={myResults.length} icon={<BookOpen />} color="bg-indigo-50 text-indigo-600" />
        <DashboardCard title="Mean Mastery" value={`${avgScore}%`} icon={<TrendingUp />} color="bg-green-50 text-green-600" />
        <DashboardCard title="Credentials" value={passCount} icon={<Award />} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="space-y-6 md:space-y-12">
        <div className="px-1">
          <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">Available Sessions</h3>
          <p className="text-[10px] md:text-base text-slate-500 mt-1 font-medium uppercase tracking-widest">Select a cluster to initiate assessment.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {exams.filter(e => e.isEnabled).map(exam => {
            const diffUI = getDifficultyUI(exam.difficulty);
            return (
              <div key={exam.id} className="group bg-white rounded-2xl md:rounded-[4rem] border-2 border-slate-100 p-6 md:p-14 hover:border-indigo-200 hover:shadow-2xl transition-all duration-700 flex flex-col relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-6 md:mb-12 relative z-10">
                  <span className="text-[8px] md:text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-2.5 md:px-3 py-1.5 rounded-lg border border-indigo-100 truncate max-w-[120px]">
                    {categories.find(c => c.id === exam.categoryId)?.name}
                  </span>
                  <div className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-xl border text-[7px] md:text-[8px] font-black uppercase tracking-widest ${diffUI.color}`}>
                    {diffUI.icon}
                    {diffUI.label}
                  </div>
                </div>

                <div className="mb-8 md:mb-14 relative z-10">
                  <h3 className="text-lg md:text-4xl font-black text-slate-900 leading-tight md:leading-[1.15] tracking-tight group-hover:text-indigo-600 transition-colors duration-500">
                    {exam.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-4 md:gap-x-14 mb-8 md:mb-16 relative z-10">
                  <div className="space-y-1 md:space-y-3">
                    <div className="flex items-center gap-1.5 md:gap-2.5 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Clock size={10} className="text-indigo-300 md:w-4 md:h-4" />
                      Time
                    </div>
                    <p className="text-sm md:text-2xl font-black text-slate-800 tracking-tighter">{exam.durationMinutes}<span className="text-[9px] md:text-xs text-slate-400 ml-1 font-bold">Mins</span></p>
                  </div>
                  <div className="space-y-1 md:space-y-3">
                    <div className="flex items-center gap-1.5 md:gap-2.5 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <BookOpen size={10} className="text-indigo-300 md:w-4 md:h-4" />
                      Items
                    </div>
                    <p className="text-sm md:text-2xl font-black text-slate-800 tracking-tighter">{exam.totalQuestions}<span className="text-[9px] md:text-xs text-slate-400 ml-1 font-bold">MCQs</span></p>
                  </div>
                </div>

                <button 
                  onClick={() => onStartExam(exam)}
                  className="mt-auto w-full py-4 md:py-7 bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] md:text-xs rounded-xl md:rounded-[2.5rem] hover:bg-slate-900 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 active:scale-95 relative z-10"
                >
                  Initiate Attempt 
                  <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};