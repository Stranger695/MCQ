import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../AppContext';
import { MCQ, QuestionStatus, Difficulty, UserRole, UserStatus } from '../types';
import { 
  Plus, 
  Check, 
  X, 
  Edit2, 
  AlertCircle, 
  Eye, 
  Trash2, 
  Save, 
  Layers, 
  Sparkles, 
  Loader2, 
  GripVertical, 
  CheckCircle2, 
  User as UserIcon, 
  Lock,
  MinusCircle,
  Search,
  ChevronDown
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { generateAIQuestions } from '../services/gemini';

export const QuestionForm: React.FC<{ initialData?: MCQ | null; onComplete: () => void }> = ({ initialData, onComplete }) => {
  const { categories, upsertQuestion, currentUser } = useApp();
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  
  const isInactive = currentUser?.status === UserStatus.INACTIVE;

  const [formData, setFormData] = useState({
    categoryId: categories[0]?.id || '',
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: '',
    difficulty: Difficulty.MEDIUM
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, options: [...initialData.options] });
    }
  }, [initialData]);

  const handleAiGeneration = async () => {
    if (!aiTopic.trim() || isInactive) return;
    setIsAiGenerating(true);
    try {
      const generated = await generateAIQuestions(aiTopic, formData.difficulty, 1);
      if (generated.length > 0) {
        const q = generated[0];
        setFormData({ ...formData, ...q } as any);
      }
    } catch (err) { console.error(err); } 
    finally { setIsAiGenerating(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isInactive) return;
    upsertQuestion({
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      authorId: initialData?.authorId || currentUser.id,
      authorName: initialData?.authorName || currentUser.name,
      status: initialData ? initialData.status : QuestionStatus.PENDING,
      createdAt: initialData?.createdAt || new Date().toISOString()
    } as MCQ);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">{initialData ? 'Edit Asset' : 'New Fragment'}</h2>
        <button onClick={onComplete} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><X size={24} /></button>
      </div>

      <div className={`mb-8 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white shadow-xl ${isInactive ? 'bg-slate-400' : 'bg-indigo-600 shadow-indigo-100'}`}>
         <div className="flex items-center gap-3 mb-6">
            <Sparkles size={24} className={isInactive ? '' : 'animate-pulse text-indigo-300'} />
            <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">AI Content Forge</h3>
         </div>
         <div className="flex flex-col sm:flex-row gap-4">
            <input 
              disabled={isInactive}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-sm font-bold placeholder:text-white/40 outline-none focus:bg-white/20 disabled:opacity-50"
              placeholder="Topic (e.g. thermodynamics)..."
              value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
            />
            <button onClick={handleAiGeneration} disabled={isAiGenerating || !aiTopic || isInactive} className="px-8 py-3.5 bg-white text-indigo-600 font-black rounded-xl text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0">
              {isAiGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generate
            </button>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-slate-200 shadow-sm space-y-8 md:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Classification</label>
            <select disabled={isInactive} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest outline-none focus:border-indigo-600" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Difficulty</label>
            <select disabled={isInactive} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest outline-none focus:border-indigo-600" value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}>
              {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Question Inquiry</label>
          <textarea disabled={isInactive} className="w-full p-6 md:p-8 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] outline-none focus:border-indigo-600 font-bold min-h-[140px] text-lg md:text-xl" value={formData.questionText} onChange={e => setFormData({ ...formData, questionText: e.target.value })} />
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Clusters (Options)</label>
          <div className="space-y-3">
            {formData.options.map((opt, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 group">
                <button type="button" disabled={isInactive} onClick={() => setFormData({ ...formData, correctOptionIndex: i })} className={`w-12 h-12 md:w-14 md:h-14 shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl font-black text-sm transition-all ${formData.correctOptionIndex === i ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                  {String.fromCharCode(65 + i)}
                </button>
                <input disabled={isInactive} className={`flex-1 px-5 py-3.5 bg-slate-50 border-2 rounded-xl md:rounded-2xl outline-none font-bold text-sm transition-all ${formData.correctOptionIndex === i ? 'border-emerald-200' : 'border-slate-100 focus:border-indigo-600'}`} value={opt} onChange={e => {
                  const newOpts = [...formData.options]; newOpts[i] = e.target.value; setFormData({ ...formData, options: newOpts });
                }} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Knowledge Rationale</label>
          <textarea disabled={isInactive} className="w-full p-6 md:p-8 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-indigo-600 font-medium text-slate-600 min-h-[120px] text-sm" value={formData.explanation} placeholder="Explain the correct node logic..." onChange={e => setFormData({ ...formData, explanation: e.target.value })} />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-slate-100">
           <button type="button" onClick={onComplete} className="px-8 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-800">Discard</button>
           <button disabled={isInactive} type="submit" className={`px-12 py-4 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${isInactive ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}>
             <Save size={18} /> Commit Asset
           </button>
        </div>
      </form>
    </div>
  );
};

export const QuestionModeration: React.FC<{ authorId?: string; onEdit?: (q: MCQ) => void }> = ({ authorId, onEdit }) => {
  const { questions, upsertQuestion, deleteQuestion, categories, users, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (authorId && q.authorId !== authorId) return false;
      return q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [questions, authorId, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="Filter fragments..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-600 font-bold text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Fragment</th>
                <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4"><p className="font-black text-slate-800 text-sm line-clamp-1">{q.questionText}</p></td>
                  <td className="px-6 py-4"><span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{categories.find(c => c.id === q.categoryId)?.name}</span></td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border ${q.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{q.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onEdit?.(q)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};