
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { Trophy, Users, BarChart3, TrendingUp, Search, FileSpreadsheet, FileJson } from 'lucide-react';

export const Reports: React.FC = () => {
  const { results, users, exams, categories } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');

  const stats = useMemo(() => {
    const totalAttempts = results.length;
    const passes = results.filter(r => r.status === 'PASS').length;
    const passRate = totalAttempts > 0 ? Math.round((passes / totalAttempts) * 100) : 0;
    const avgScore = totalAttempts > 0 ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / totalAttempts * 100) : 0;
    return { totalAttempts, passRate, avgScore, students: users.filter(u => u.role === 'STUDENT').length };
  }, [results, users]);

  const categoryPerformance = useMemo(() => {
    return categories.map(cat => {
      const catExams = exams.filter(e => e.categoryId === cat.id);
      const catResults = results.filter(r => catExams.find(e => e.id === r.examId));
      const avg = catResults.length > 0 ? Math.round(catResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / catResults.length * 100) : 0;
      return { name: cat.name, avg };
    });
  }, [categories, exams, results]);

  const rankings = useMemo(() => {
    const studentPerformance: Record<string, { name: string; score: number; attempts: number }> = {};
    results.forEach(res => {
      const student = users.find(u => u.id === res.studentId);
      if (student) {
        if (!studentPerformance[student.id]) studentPerformance[student.id] = { name: student.name, score: 0, attempts: 0 };
        studentPerformance[student.id].score += (res.score / res.totalMarks) * 100;
        studentPerformance[student.id].attempts += 1;
      }
    });
    return Object.values(studentPerformance)
      .map(s => ({ ...s, avgScore: Math.round(s.score / s.attempts) }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);
  }, [results, users]);

  const filteredResults = results.filter(res => {
    const student = users.find(u => u.id === res.studentId);
    const exam = exams.find(e => e.id === res.examId);
    const query = searchTerm.toLowerCase();
    return student?.name.toLowerCase().includes(query) || exam?.title.toLowerCase().includes(query);
  }).slice().reverse();

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Performance Reports</h2>
          <p className="text-slate-500 text-lg mt-2 font-medium">Real-time analytical insights into student engagement and examination outcomes.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-3 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
            <FileSpreadsheet size={20} /> Export CSV
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
            <FileJson size={20} /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 text-indigo-600 mb-6">
            <Users size={28} />
            <span className="text-xs font-black uppercase tracking-widest">Active Candidates</span>
          </div>
          <p className="text-5xl font-black text-slate-800">{stats.students}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 text-green-600 mb-6">
            <TrendingUp size={28} />
            <span className="text-xs font-black uppercase tracking-widest">Global Attempts</span>
          </div>
          <p className="text-5xl font-black text-slate-800">{stats.totalAttempts}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 text-amber-500 mb-6">
            <Trophy size={28} />
            <span className="text-xs font-black uppercase tracking-widest">Success Rate</span>
          </div>
          <p className="text-5xl font-black text-slate-800">{stats.passRate}%</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 text-rose-500 mb-6">
            <BarChart3 size={28} />
            <span className="text-xs font-black uppercase tracking-widest">Mean Accuracy</span>
          </div>
          <p className="text-5xl font-black text-slate-800">{stats.avgScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
            <BarChart3 size={20} className="text-indigo-600" /> CATEGORY METRICS
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} fontStyle="bold" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="avg" fill="#6366f1" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 14, fill: '#6366f1', fontWeight: 'bold' }}>
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
            <Trophy size={20} className="text-amber-500" /> TOP PERFORMERS
          </h3>
          <div className="space-y-6">
            {rankings.map((student, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                <div className="flex items-center gap-6">
                  <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-base font-black ${idx < 3 ? 'bg-amber-100 text-amber-700 shadow-inner' : 'bg-slate-200 text-slate-500'}`}>
                    {idx + 1}
                  </span>
                  <p className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{student.avgScore}%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.attempts} Valid Attempts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">EXAMINATION ARCHIVE</h3>
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={20} />
            <input 
              className="pl-14 pr-8 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all text-sm font-black min-w-[400px]"
              placeholder="Search student or exam title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Candidate</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center">Efficiency</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center">Outcome</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Validated On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map(res => {
                const student = users.find(u => u.id === res.studentId);
                const exam = exams.find(e => e.id === res.examId);
                return (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <p className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{student?.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{student?.email}</p>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-base font-bold text-slate-700">{exam?.title}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {res.examId}</p>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-2xl font-black text-slate-800 tracking-tighter">{Math.round((res.score / res.totalMarks) * 100)}%</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${res.status === 'PASS' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          {res.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right text-xs font-black text-slate-400 uppercase">
                      {new Date(res.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
