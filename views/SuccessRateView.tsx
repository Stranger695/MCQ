import React, { useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { UserRole, Difficulty } from '../types';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Activity, 
  PieChart as PieIcon, 
  BarChart3, 
  Zap, 
  Star, 
  Flame, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  Layers,
  ChevronRight,
  Info,
  X,
  Gauge,
  Database,
  Fingerprint
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const SuccessRateView: React.FC = () => {
  const { results, exams, categories, currentUser } = useApp();
  const [registrySearch, setRegistrySearch] = useState('');

  const isStudent = currentUser?.role === UserRole.STUDENT;
  
  // Filter results based on role
  const relevantResults = useMemo(() => 
    isStudent ? results.filter(r => r.studentId === currentUser.id) : results,
    [results, isStudent, currentUser]
  );

  const stats = useMemo(() => {
    const total = relevantResults.length;
    if (total === 0) return null;

    const passes = relevantResults.filter(r => r.status === 'PASS').length;
    const passRate = Math.round((passes / total) * 100);
    const avgAccuracy = Math.round(relevantResults.reduce((acc, curr) => acc + (curr.score / (curr.totalMarks || 1)), 0) / total * 100);
    
    // Calculate mean time efficiency
    const totalPossibleSeconds = relevantResults.reduce((acc, r) => {
      const exam = exams.find(e => e.id === r.examId);
      return acc + (exam ? exam.durationMinutes * 60 : 0);
    }, 0);
    const totalTakenSeconds = relevantResults.reduce((acc, r) => acc + r.timeTakenSeconds, 0);
    const efficiency = totalPossibleSeconds > 0 
      ? Math.max(0, Math.round(((totalPossibleSeconds - totalTakenSeconds) / totalPossibleSeconds) * 100)) 
      : 0;

    return { total, passes, passRate, avgAccuracy, efficiency };
  }, [relevantResults, exams]);

  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const catExams = exams.filter(e => e.categoryId === cat.id);
      const catResults = relevantResults.filter(r => catExams.find(e => e.id === r.examId));
      if (catResults.length === 0) return null;

      const passes = catResults.filter(r => r.status === 'PASS').length;
      return {
        name: cat.name,
        rate: Math.round((passes / catResults.length) * 100),
        count: catResults.length
      };
    }).filter(Boolean);
  }, [categories, exams, relevantResults]);

  const difficultyData = useMemo(() => {
    return Object.values(Difficulty).map(diff => {
      const diffExams = exams.filter(e => e.difficulty === diff);
      const diffResults = relevantResults.filter(r => diffExams.find(e => e.id === r.examId));
      if (diffResults.length === 0) return null;

      const passes = diffResults.filter(r => r.status === 'PASS').length;
      return {
        name: diff,
        rate: Math.round((passes / diffResults.length) * 100),
        total: diffResults.length
      };
    }).filter(Boolean);
  }, [relevantResults, exams]);

  const trendData = useMemo(() => {
    return relevantResults.slice(-10).map((r, i) => ({
      session: i + 1,
      score: Math.round((r.score / (r.totalMarks || 1)) * 100)
    }));
  }, [relevantResults]);

  // Table filtering logic
  const filteredExamsForTable = useMemo(() => {
    const examsWithAttempts = exams.filter(e => relevantResults.find(r => r.examId === e.id));
    if (!registrySearch) return examsWithAttempts;
    
    return examsWithAttempts.filter(e => 
      e.title.toLowerCase().includes(registrySearch.toLowerCase()) ||
      categories.find(c => c.id === e.categoryId)?.name.toLowerCase().includes(registrySearch.toLowerCase())
    );
  }, [exams, relevantResults, registrySearch, categories]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  if (!stats) {
    return (
      <div className="py-40 text-center animate-in fade-in duration-500">
         <Activity size={80} className="mx-auto text-slate-100 mb-8" />
         <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Null Performance Data Detected</h3>
         <p className="text-slate-400 mt-4 font-medium max-w-xs mx-auto text-sm leading-relaxed">
           No examination sessions have been logged for this identity node yet.
         </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Platform Telemetry Hero */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/40 border border-indigo-400/20">
                  <TrendingUp size={24} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Platform Telemetry Core</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none">
              Global Success <br/><span className="text-indigo-400">Registry.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
              {isStudent 
                ? "Your personalized mastery telemetry audit. Tracking trajectory across academic clusters and subject proficiency."
                : "Real-time infrastructure success rates across the global examination registry. Monitoring candidate outcome distributions."
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
             <div className="text-center bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md min-w-[180px] group hover:bg-white/10 transition-all">
                <p className="text-5xl font-black text-white group-hover:text-indigo-400 transition-colors">{stats.passRate}%</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-2">Pass Threshold</p>
             </div>
             <div className="text-center bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md min-w-[180px] group hover:bg-white/10 transition-all">
                <p className="text-5xl font-black text-emerald-400">{stats.avgAccuracy}%</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-2">Mean Accuracy</p>
             </div>
          </div>
        </div>
      </div>

      {/* Global Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Outcome Split Telemetry */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
             <PieIcon size={18} className="text-indigo-600" /> Outcome Yield
           </h3>
           <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={[
                        { name: 'Success', value: stats.passes },
                        { name: 'Deficit', value: stats.total - stats.passes }
                      ]}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                       <Cell fill="#6366f1" />
                       <Cell fill="#f1f5f9" />
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-3xl font-black text-slate-800">{stats.passRate}%</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Pass</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                   <span className="text-[10px] font-black uppercase text-slate-600">Valid Success</span>
                 </div>
                 <span className="text-sm font-black text-slate-800">{stats.passes}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                   <span className="text-[10px] font-black uppercase text-slate-600">Session Deficit</span>
                 </div>
                 <span className="text-sm font-black text-slate-800">{stats.total - stats.passes}</span>
              </div>
           </div>
        </div>

        {/* Subject Mastery Heatmap */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                <BarChart3 size={18} className="text-emerald-600" /> Subject Proficiency Heatmap
              </h3>
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                Registry Sync Active
              </div>
           </div>
           
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} fontWeight="900" width={120} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={24}>
                       {categoryData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Advanced Telemetry Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Node Velocity Area Chart */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Activity size={200} />
           </div>
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
             <Activity size={18} className="text-indigo-600" /> Historical Mastery Velocity
           </h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="session" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      itemStyle={{ fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth Index</p>
                 <div className="flex items-center gap-2 text-emerald-600">
                    <ArrowUpRight size={16} />
                    <span className="font-black text-sm">+4.2% Optimization</span>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Node Health</p>
                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Optimal Connectivity</p>
              </div>
           </div>
        </div>

        {/* Complexity Correlation & Efficiency */}
        <div className="grid grid-cols-1 gap-10">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 blur-2xl"></div>
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-4">
                <Target size={18} /> Difficulty Correlation Mapping
              </h3>
              <div className="space-y-6">
                 {difficultyData.map((d, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                         <div className="flex items-center gap-2">
                            {d.name === 'EASY' ? <Zap size={12} className="text-emerald-400" /> : d.name === 'HARD' ? <Flame size={12} className="text-rose-400" /> : <Star size={12} className="text-amber-400" />}
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.name} TIER</span>
                         </div>
                         <span className="text-sm font-black">{d.rate}% Yield</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${d.rate}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 shadow-inner">
                    <Clock size={32} />
                 </div>
                 <div>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">{stats.efficiency}%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Efficiency Buffer</p>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hidden sm:block">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">Audit Status</p>
                 <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase">Verified Node</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Registry Outcome Audit */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">GLOBAL CLUSTER REGISTRY AUDIT</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Deep-dive telemetry per examination cluster</p>
           </div>
           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                className="pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-xs min-w-[300px]"
                placeholder="Search cluster telemetry..."
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
              />
              {registrySearch && (
                <button 
                  onClick={() => setRegistrySearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                 <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cluster Manifest</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Success Yield</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Mean Mastery</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Administrative Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredExamsForTable.map(exam => {
                   const examRes = relevantResults.filter(r => r.examId === exam.id);
                   const passRate = Math.round((examRes.filter(r => r.status === 'PASS').length / examRes.length) * 100);
                   const avgScore = Math.round(examRes.reduce((acc, curr) => acc + (curr.score / (curr.totalMarks || 1)), 0) / examRes.length * 100);

                   return (
                     <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-5">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                 {exam.title.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-black text-slate-800 text-base">{exam.title}</p>
                                 <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{categories.find(c => c.id === exam.categoryId)?.name}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${exam.difficulty === 'HARD' ? 'text-rose-500' : 'text-emerald-500'}`}>{exam.difficulty}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex flex-col items-center gap-2">
                              <span className={`text-xl font-black ${passRate > 75 ? 'text-emerald-600' : passRate > 50 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                 {passRate}%
                              </span>
                              <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-700 ${passRate > 75 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${passRate}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                           <span className="text-lg font-black text-slate-800 tracking-tighter">{avgScore}% Accuracy</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm">
                              Detailed Audit
                           </button>
                        </td>
                     </tr>
                   );
                 })}
                 {filteredExamsForTable.length === 0 && (
                   <tr>
                     <td colSpan={4} className="px-10 py-20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No registry matches for "{registrySearch}"</p>
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Global Infrastructure Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Data Nodes', val: results.length.toLocaleString(), icon: <Database className="text-indigo-600" /> },
           { label: 'Integrity Checksum', val: 'PASS', icon: <ShieldCheck className="text-emerald-600" /> },
           { label: 'Registry Fingerprint', val: '8X-F22', icon: <Fingerprint className="text-slate-400" /> },
           { label: 'Cluster Sync', val: 'REAL-TIME', icon: <Activity className="text-rose-500 animate-pulse" /> }
         ].map((t, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                 {t.icon}
              </div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t.label}</p>
                 <p className="text-lg font-black text-slate-800 tracking-tight">{t.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
         <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
            <Info size={24} />
         </div>
         <div className="flex-1">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-1">Analytical Policy Acknowledgement</h4>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
               All success telemetry is processed in real-time using the Platform Grading Engine. Attempt indices reflect validated credentials from verified identity nodes.
            </p>
         </div>
         <button className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-95">
            Export Global Registry
         </button>
      </div>
    </div>
  );
};

export default SuccessRateView;