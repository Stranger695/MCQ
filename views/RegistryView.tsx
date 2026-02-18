import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Exam, Difficulty, UserRole } from '../types';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Award, 
  Target, 
  Layers, 
  ChevronRight, 
  Zap, 
  Star, 
  Flame, 
  Activity,
  LayoutGrid,
  List,
  AlertCircle,
  HelpCircle,
  Hash,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

interface RegistryViewProps {
  onStartExam: (exam: Exam) => void;
}

const RegistryView: React.FC<RegistryViewProps> = ({ onStartExam }) => {
  const { exams, categories, questions, results, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      if (!e.isEnabled && currentUser?.role === UserRole.STUDENT) return false;
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === 'ALL' || e.categoryId === activeCategory;
      const matchesDiff = activeDifficulty === 'ALL' || e.difficulty === activeDifficulty;
      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [exams, searchTerm, activeCategory, activeDifficulty, currentUser]);

  const stats = useMemo(() => ({
    total: exams.length,
    active: exams.filter(e => e.isEnabled).length,
    subjects: categories.length,
    questions: questions.length
  }), [exams, categories, questions]);

  const getDifficultyUI = (diff?: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY:
        return { label: 'Foundational', icon: <Zap size={14} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case Difficulty.HARD:
        return { label: 'Master Tier', icon: <Flame size={14} />, color: 'text-rose-600 bg-rose-50 border-rose-100' };
      default:
        return { label: 'Intermediate', icon: <Star size={14} />, color: 'text-amber-600 bg-amber-50 border-amber-100' };
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Registry Hero Header */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Global Academic Repository</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest mb-6 leading-tight">Examination <br/><span className="text-indigo-400">Registry.</span></h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Access the centralized manifest of all active academic clusters, proctored assessments, and knowledge validation nodes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[
              { label: 'Active Clusters', val: stats.active, icon: <Layers className="text-indigo-400" /> },
              { label: 'Subject Nodes', val: stats.subjects, icon: <Hash className="text-amber-400" /> },
              { label: 'Knowledge Points', val: stats.questions, icon: <ShieldCheck className="text-emerald-400" /> },
              { label: 'Mean Integrity', val: '99.9%', icon: <Activity className="text-rose-400" /> }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                <div className="mb-4">{s.icon}</div>
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold"
              placeholder="Search registry by cluster title or keywords..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border-2 border-slate-100">
            <button 
              onClick={() => setViewMode('GRID')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('LIST')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeCategory === 'ALL' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
              >
                All Subjects
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeCategory === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty:</span>
            <div className="flex gap-2">
              {['ALL', ...Object.values(Difficulty)].map(diff => (
                <button 
                  key={diff}
                  onClick={() => setActiveDifficulty(diff as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeDifficulty === diff ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registry Grid */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExams.map(exam => {
            const diffUI = getDifficultyUI(exam.difficulty);
            const myAttempt = results.find(r => r.examId === exam.id && r.studentId === currentUser?.id);
            
            return (
              <div key={exam.id} className="group bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden">
                {myAttempt && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-1.5 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-widest shadow-xl">
                    Validated Attempt
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                      {categories.find(c => c.id === exam.categoryId)?.name || 'General'}
                    </span>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${diffUI.color}`}>
                      {diffUI.icon} {diffUI.label}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Timeframe</span>
                    </div>
                    <p className="text-xl font-black text-slate-800">{exam.durationMinutes}<span className="text-xs ml-1 text-slate-400 font-bold">MINS</span></p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Layers size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Pool Size</span>
                    </div>
                    <p className="text-xl font-black text-slate-800">{exam.totalQuestions}<span className="text-xs ml-1 text-slate-400 font-bold">ITEMS</span></p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8 space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score Weights</span>
                     <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Standard Protocol</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                       <span className="text-[10px] font-bold text-slate-600">Correct: +{exam.marksPerQuestion}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                       <span className="text-[10px] font-bold text-slate-600">Penalty: -{exam.negativeMarking}</span>
                     </div>
                   </div>
                </div>

                <button 
                  onClick={() => onStartExam(exam)}
                  className="mt-auto w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group/btn"
                >
                  Initiate Assessment <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cluster Manifest</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map(exam => (
                <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div>
                      <p className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{exam.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getDifficultyUI(exam.difficulty).color}`}>
                          {exam.difficulty} LEVEL
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      {categories.find(c => c.id === exam.categoryId)?.name || 'General'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-300" />
                        <span className="text-sm font-black text-slate-700">{exam.durationMinutes}m</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers size={14} className="text-slate-300" />
                        <span className="text-sm font-black text-slate-700">{exam.totalQuestions}q</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => onStartExam(exam)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black uppercase text-[10px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Enter Node <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredExams.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
          <HelpCircle size={64} className="mx-auto text-slate-100 mb-6" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Null registry results detected</p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveCategory('ALL'); setActiveDifficulty('ALL'); }}
            className="mt-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline"
          >
            Reset Identity Search Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistryView;