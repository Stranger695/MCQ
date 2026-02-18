import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { 
  Trophy, 
  Award, 
  Activity, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  Calendar,
  ShieldCheck,
  Star,
  Target,
  Zap,
  Flame,
  ArrowUpRight,
  Library,
  User as UserIcon,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface CandidatePortalProps {
  onNavigate: (view: string) => void;
  onStartExam: (exam: any) => void;
}

const CandidatePortal: React.FC<CandidatePortalProps> = ({ onNavigate, onStartExam }) => {
  const { currentUser, results, exams, categories } = useApp();
  
  const myResults = useMemo(() => 
    results.filter(r => r.studentId === currentUser?.id).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
    [results, currentUser]
  );

  const stats = useMemo(() => {
    const total = myResults.length;
    const passed = myResults.filter(r => r.status === 'PASS').length;
    const avgScore = total > 0 
      ? Math.round(myResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / total * 100) 
      : 0;
    
    // Performance trend data
    const trendData = myResults.slice(0, 7).reverse().map((r, i) => ({
      name: `T-${7-i}`,
      score: Math.round((r.score / r.totalMarks) * 100)
    }));

    return { total, passed, avgScore, trendData };
  }, [myResults]);

  const categoryMastery = useMemo(() => {
    return categories.map(cat => {
      const catExams = exams.filter(e => e.categoryId === cat.id);
      const catResults = myResults.filter(r => catExams.find(e => e.id === r.examId));
      const score = catResults.length > 0 
        ? Math.round(catResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / catResults.length * 100) 
        : 0;
      return { name: cat.name, score, count: catResults.length };
    }).filter(c => c.count > 0);
  }, [categories, exams, myResults]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Portal Hero Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40">Candidate Node</div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticated Session</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest leading-tight">Welcome Back,<br/><span className="text-indigo-400">{currentUser?.name.split(' ')[0]}.</span></h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Your academic trajectory is currently at <span className="text-white font-black">{stats.avgScore}% mastery</span>. Review your recent audit logs or initiate a new assessment cluster.
            </p>
            <div className="flex gap-4 pt-4">
               <button onClick={() => onNavigate('registry')} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                 <Library size={18} /> Exam Registry
               </button>
               <button onClick={() => onNavigate('profile')} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all border border-slate-700 active:scale-95">
                 Calibration
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md text-center">
              <p className="text-4xl font-black text-white">{stats.total}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mt-1">Total Attempts</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md text-center">
              <p className="text-4xl font-black text-emerald-400">{stats.passed}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600/60 mt-1">Credentials</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md text-center">
              <p className="text-4xl font-black text-amber-400">{stats.avgScore}%</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-600/60 mt-1">Mastery Index</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md text-center">
              <p className="text-4xl font-black text-rose-400">#12</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-rose-600/60 mt-1">Global Rank</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Performance Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Performance Trend */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <TrendingUp size={18} className="text-indigo-600" /> Mastery Trajectory
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Historical analysis of latest 7 sessions</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                  <Target size={12} /> Optimized Path
               </div>
             </div>
             
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trendData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Subject Mastery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                 <ShieldCheck size={18} className="text-emerald-500" /> Subject Nodes
               </h3>
               <div className="space-y-6">
                 {categoryMastery.map((cat, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
                        <span className="text-[10px] font-black text-indigo-600">{cat.score}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${cat.score}%` }}></div>
                     </div>
                   </div>
                 ))}
                 {categoryMastery.length === 0 && <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase">Null mastery nodes detected</p>}
               </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 mb-8">
                 <Award size={18} className="text-amber-500" /> Latest Credential
               </h3>
               {myResults.find(r => r.status === 'PASS') ? (
                 <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner">
                       <Trophy size={40} />
                    </div>
                    <div>
                       <p className="text-xl font-black text-slate-800 leading-tight">
                         {exams.find(e => e.id === myResults.find(r => r.status === 'PASS')?.examId)?.title}
                       </p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Verified Academic Record</p>
                    </div>
                    <button onClick={() => onNavigate('my-results')} className="w-full py-4 bg-slate-50 text-slate-800 border-2 border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-200 transition-all">
                      View Certificate Vault
                    </button>
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col justify-center items-center text-center opacity-40">
                    <Activity size={48} className="text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase text-slate-400">Zero credentials issued</p>
                 </div>
               )}
            </div>
          </div>

          {/* Recent History Feed */}
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Historical Activity</h3>
              <button onClick={() => onNavigate('my-results')} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Full Audit</button>
            </div>
            <div className="divide-y divide-slate-50">
               {myResults.slice(0, 5).map(res => {
                 const exam = exams.find(e => e.id === res.examId);
                 return (
                   <div key={res.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                     <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm ${res.status === 'PASS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {res.status === 'PASS' ? <ShieldCheck size={20} /> : <Flame size={20} />}
                       </div>
                       <div>
                         <p className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{exam?.title}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={10} /> {new Date(res.completedAt).toLocaleDateString()}
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xl font-black text-slate-800 tracking-tighter">{Math.round((res.score / res.totalMarks) * 100)}%</p>
                       <p className={`text-[8px] font-black uppercase tracking-widest ${res.status === 'PASS' ? 'text-emerald-500' : 'text-rose-500'}`}>{res.status}</p>
                     </div>
                   </div>
                 );
               })}
               {myResults.length === 0 && (
                 <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Null audit records found</div>
               )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-10">
          {/* Identity Calibration Widget */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl overflow-hidden shadow-inner border-2 border-white">
                 {currentUser?.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser?.name.charAt(0)}
               </div>
               <div>
                  <h4 className="font-black text-slate-800 text-lg">{currentUser?.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">@{currentUser?.username || 'user'}</p>
               </div>
             </div>
             <div className="grid grid-cols-1 gap-4 pt-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Protocol</p>
                  <p className="text-sm font-black text-slate-700">{currentUser?.role.replace('_', ' ')}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled Since</p>
                  <p className="text-sm font-black text-slate-700">{new Date(currentUser?.joinedAt || '').toLocaleDateString()}</p>
               </div>
             </div>
             <button onClick={() => onNavigate('profile')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl active:scale-95">
               Identity Settings
             </button>
          </div>

          {/* Recommended Clusters */}
          <div className="bg-indigo-900 rounded-[3rem] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <div>
                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.4em] mb-2 flex items-center gap-3">
                  <Star size={18} /> Recommended
                </h3>
                <p className="text-lg font-black text-white leading-tight">Curated clusters for your profile tier.</p>
             </div>
             
             <div className="space-y-4">
                {exams.filter(e => e.isEnabled && !myResults.find(r => r.examId === e.id)).slice(0, 3).map(exam => (
                  <div key={exam.id} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group" onClick={() => onStartExam(exam)}>
                     <div className="flex justify-between items-start mb-3">
                       <span className="px-2.5 py-1 bg-white/10 text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                         {categories.find(c => c.id === exam.categoryId)?.name}
                       </span>
                       <ArrowUpRight size={14} className="text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                     </div>
                     <p className="font-black text-sm leading-snug group-hover:text-indigo-300 transition-colors">{exam.title}</p>
                     <div className="flex items-center gap-4 mt-4 text-[9px] font-black text-white/40 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {exam.durationMinutes}m</span>
                        <span className="flex items-center gap-1.5"><BookOpen size={12} /> {exam.totalQuestions}q</span>
                     </div>
                  </div>
                ))}
             </div>
             
             <button onClick={() => onNavigate('registry')} className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-white/20 transition-all">
               Explore Full Registry
             </button>
          </div>

          {/* Quick Integrity Check */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-4 text-emerald-600">
                <CheckCircle2 size={24} />
                <h4 className="font-black uppercase text-xs tracking-widest">Security Health</h4>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
               Your identity node is compliant with all academic proctoring protocols. Multi-factor encryption is active for all session transcripts.
             </p>
             <div className="flex items-center gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Core Status: Optimal</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePortal;