import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Trophy, Medal, Star, Users, Award, TrendingUp, Search } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { results, users } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');

  const rankings = useMemo(() => {
    const studentPerformance: Record<string, { 
      id: string; 
      name: string; 
      username?: string; 
      avatar?: string; 
      score: number; 
      attempts: number;
      passes: number;
    }> = {};

    results.forEach(res => {
      const student = users.find(u => u.id === res.studentId);
      if (student) {
        if (!studentPerformance[student.id]) {
          studentPerformance[student.id] = { 
            id: student.id, 
            name: student.name, 
            username: student.username,
            avatar: student.avatar,
            score: 0, 
            attempts: 0,
            passes: 0
          };
        }
        studentPerformance[student.id].score += (res.score / res.totalMarks) * 100;
        studentPerformance[student.id].attempts += 1;
        if (res.status === 'PASS') studentPerformance[student.id].passes += 1;
      }
    });

    return Object.values(studentPerformance)
      .map(s => ({ ...s, avgScore: Math.round(s.score / s.attempts) }))
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [results, users, searchTerm]);

  const topThree = rankings.slice(0, 3);
  const remaining = rankings.slice(3);

  const RankBadge = ({ rank }: { rank: number }) => {
    switch (rank) {
      case 1: return <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shadow-sm"><Trophy size={20} /></div>;
      case 2: return <div className="bg-slate-100 p-2 rounded-lg text-slate-500 shadow-sm"><Medal size={20} /></div>;
      case 3: return <div className="bg-orange-100 p-2 rounded-lg text-orange-600 shadow-sm"><Star size={20} /></div>;
      default: return <div className="w-9 h-9 flex items-center justify-center font-black text-slate-300 text-sm">{rank}</div>;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Academic Honor Roll</h2>
          <p className="text-slate-500 text-lg mt-2 font-medium">Celebrating our top performing knowledge explorers.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={20} />
          <input 
            className="pl-14 pr-8 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all text-sm font-black min-w-[320px] shadow-sm"
            placeholder="Find a candidate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Podium for Top 3 */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {/* Second Place */}
          {topThree[1] && (
            <div className="order-2 md:order-1 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 md:h-[320px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="mx-auto w-20 h-20 rounded-3xl bg-slate-100 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden relative">
                {topThree[1].avatar ? <img src={topThree[1].avatar} className="w-full h-full object-cover" /> : <Users size={32} className="text-slate-300" />}
                <div className="absolute bottom-0 right-0 bg-slate-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-tl-lg">#2</div>
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-800 line-clamp-1">{topThree[1].name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">@{topThree[1].username || 'candidate'}</p>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-slate-700 tracking-tighter">{topThree[1].avgScore}%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase">Mastery</span>
              </div>
            </div>
          )}

          {/* First Place */}
          {topThree[0] && (
            <div className="order-1 md:order-2 bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-center space-y-8 relative overflow-hidden group md:h-[400px] flex flex-col justify-center transform hover:scale-105 transition-all duration-500 border-4 border-indigo-500/20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -ml-16 -mt-16 blur-2xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
              <div className="mx-auto w-24 h-24 rounded-[2rem] bg-indigo-600 border-4 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden relative">
                {topThree[0].avatar ? <img src={topThree[0].avatar} className="w-full h-full object-cover" /> : <Users size={40} className="text-indigo-200" />}
                <div className="absolute bottom-0 right-0 bg-amber-400 text-slate-900 text-xs font-black px-2 py-1 rounded-tl-xl shadow-lg">#1</div>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-3xl text-white tracking-tight line-clamp-1">{topThree[0].name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={16} className="text-amber-400 fill-amber-400" />
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Global Sovereign</p>
                </div>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black text-white tracking-tightest">{topThree[0].avgScore}%</span>
                <span className="text-[10px] font-black text-indigo-400 uppercase">Mastery Index</span>
              </div>
            </div>
          )}

          {/* Third Place */}
          {topThree[2] && (
            <div className="order-3 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 md:h-[320px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="mx-auto w-20 h-20 rounded-3xl bg-orange-50 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden relative">
                {topThree[2].avatar ? <img src={topThree[2].avatar} className="w-full h-full object-cover" /> : <Users size={32} className="text-orange-200" />}
                <div className="absolute bottom-0 right-0 bg-orange-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-tl-lg">#3</div>
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-800 line-clamp-1">{topThree[2].name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">@{topThree[2].username || 'candidate'}</p>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-slate-700 tracking-tighter">{topThree[2].avgScore}%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase">Mastery</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">{rankings.length}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Candidates</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20} /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">{rankings.reduce((acc, curr) => acc + curr.attempts, 0)}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Attempts</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Award size={20} /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">{rankings.reduce((acc, curr) => acc + curr.passes, 0)}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Credentials Issued</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><Star size={20} /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">{rankings.length > 0 ? Math.round(rankings.reduce((acc, curr) => acc + curr.avgScore, 0) / rankings.length) : 0}%</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Group Avg Efficiency</p>
          </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">RANKING REGISTRY</h3>
           <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pos</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Candidate Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Engagement</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Efficiency</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Credentials</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {remaining.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <RankBadge rank={idx + 4} />
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 font-black shrink-0 shadow-sm border border-white">
                         {student.avatar ? <img src={student.avatar} className="w-full h-full object-cover rounded-xl" /> : student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">@{student.username || 'user'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-600">{student.attempts} Valid Sessions</span>
                      <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, student.attempts * 10)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">{student.avgScore}%</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-amber-500">
                       <Award size={16} />
                       <span className="text-sm font-black">{student.passes}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                     <Users size={64} className="mx-auto text-slate-100 mb-6" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Null registry results detected</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};