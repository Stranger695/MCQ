import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../AppContext';
import { MCQ, QuestionStatus, Difficulty } from '../types';
import { 
  Plus, 
  Check, 
  X, 
  Edit2, 
  AlertCircle, 
  Eye, 
  Trash2, 
  Save, 
  RotateCcw, 
  BarChart,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
  Layers,
  Sparkles,
  Loader2,
  GripVertical,
  CheckCircle2
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { generateAIQuestions } from '../services/gemini';

export const QuestionForm: React.FC<{ initialData?: MCQ | null; onComplete: () => void }> = ({ initialData, onComplete }) => {
  const { categories, upsertQuestion, currentUser } = useApp();
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    categoryId: categories[0]?.id || '',
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: '',
    difficulty: Difficulty.MEDIUM
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        categoryId: initialData.categoryId,
        questionText: initialData.questionText,
        options: [...initialData.options],
        correctOptionIndex: initialData.correctOptionIndex,
        explanation: initialData.explanation,
        difficulty: initialData.difficulty
      });
    }
  }, [initialData]);

  const handleAiGeneration = async () => {
    if (!aiTopic.trim()) return;
    setIsAiGenerating(true);
    try {
      const generated = await generateAIQuestions(aiTopic, formData.difficulty, 1);
      if (generated.length > 0) {
        const q = generated[0];
        setFormData({
          ...formData,
          questionText: q.questionText || '',
          options: q.options || ['', '', '', ''],
          correctOptionIndex: q.correctOptionIndex || 0,
          explanation: q.explanation || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 4) return;
    setFormData(prev => {
      const newOptions = prev.options.filter((_, i) => i !== index);
      let newCorrectIndex = prev.correctOptionIndex;
      if (index === prev.correctOptionIndex) newCorrectIndex = 0;
      else if (index < prev.correctOptionIndex) newCorrectIndex = prev.correctOptionIndex - 1;
      return { ...prev, options: newOptions, correctOptionIndex: newCorrectIndex };
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newOptions = [...formData.options];
    const [movedItem] = newOptions.splice(draggedIndex, 1);
    newOptions.splice(index, 0, movedItem);

    // Update correct option index
    let newCorrectIndex = formData.correctOptionIndex;
    if (draggedIndex === formData.correctOptionIndex) {
      newCorrectIndex = index;
    } else if (draggedIndex < formData.correctOptionIndex && index >= formData.correctOptionIndex) {
      newCorrectIndex = formData.correctOptionIndex - 1;
    } else if (draggedIndex > formData.correctOptionIndex && index <= formData.correctOptionIndex) {
      newCorrectIndex = formData.correctOptionIndex + 1;
    }

    setFormData({
      ...formData,
      options: newOptions,
      correctOptionIndex: newCorrectIndex
    });
    setDraggedIndex(null);
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!formData.questionText.trim()) errors.push("Question inquiry text is required.");
    if (!formData.categoryId) errors.push("Please select an academic classification.");
    if (formData.options.length < 4) errors.push("At least four options must be provided.");
    const emptyOptions = formData.options.some(opt => !opt.trim());
    if (emptyOptions) errors.push("All provided options must contain text.");
    if (!formData.explanation.trim()) errors.push("A rationale is required.");
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errors = validate();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    if (!currentUser) return;
    
    const newQ: MCQ = {
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      authorId: initialData?.authorId || currentUser.id,
      authorName: initialData?.authorName || currentUser.name,
      status: initialData ? initialData.status : QuestionStatus.PENDING,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };
    upsertQuestion(newQ);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {initialData ? 'Refine Knowledge Asset' : 'Contribute New MCQ'}
          </h2>
        </div>
        <button onClick={onComplete} className="p-3 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
          <X size={28} />
        </button>
      </div>

      <div className="mb-10 p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
         <div className="flex items-center gap-4 mb-4">
            <Sparkles size={24} className="animate-pulse text-indigo-300" />
            <h3 className="font-black text-xs uppercase tracking-widest">AI Content Forge</h3>
         </div>
         <div className="flex flex-col sm:flex-row gap-4">
            <input 
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm font-bold placeholder:text-white/40 outline-none focus:bg-white/20"
              placeholder="Enter specific topic (e.g. photosynthesis, sorting algorithms)..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
            />
            <button 
              onClick={handleAiGeneration}
              disabled={isAiGenerating || !aiTopic}
              className="px-8 py-3 bg-white text-indigo-600 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAiGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Generate MCQ
            </button>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Category</label>
            <select
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-indigo-50 font-black"
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Difficulty</label>
            <select
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-indigo-50 font-black"
              value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
            >
              {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Question Text</label>
          <textarea
            className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-indigo-50 font-bold min-h-[160px] text-xl"
            value={formData.questionText}
            onChange={e => setFormData({ ...formData, questionText: e.target.value })}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Options Registry</label>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Drag handle to reorder • Click label to mark correct</p>
            </div>
            <button type="button" onClick={addOption} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors">Add Option Node</button>
          </div>
          
          <div className="space-y-4">
            {formData.options.map((opt, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                className={`flex items-center gap-4 p-2 rounded-[1.75rem] border-2 transition-all ${draggedIndex === i ? 'opacity-40 border-dashed border-indigo-300 scale-95' : 'border-transparent'}`}
              >
                <div className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                  <GripVertical size={20} />
                </div>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, correctOptionIndex: i })}
                  className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl font-black text-lg transition-all relative group ${formData.correctOptionIndex === i ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  {String.fromCharCode(65 + i)}
                  {formData.correctOptionIndex === i && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                  )}
                </button>
                
                <input
                  className={`flex-1 px-6 py-4 bg-slate-50 border-2 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-50 font-black transition-all ${formData.correctOptionIndex === i ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 focus:border-indigo-600'}`}
                  value={opt}
                  placeholder={`Enter Option ${String.fromCharCode(65 + i)}`}
                  onChange={e => {
                    const newOpts = [...formData.options];
                    newOpts[i] = e.target.value;
                    setFormData({ ...formData, options: newOpts });
                  }}
                />
                
                {formData.options.length > 4 && (
                  <button type="button" onClick={() => removeOption(i)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <MinusCircle size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Rationale & Explanation</label>
          <textarea
            className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-indigo-50 min-h-[140px] font-medium text-slate-600"
            value={formData.explanation}
            placeholder="Provide a logical justification for the correct answer..."
            onChange={e => setFormData({ ...formData, explanation: e.target.value })}
          />
        </div>

        {formErrors.length > 0 && touched && (
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-2">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} /> Validation Protocol Failure
            </p>
            <ul className="list-disc list-inside text-[10px] font-bold text-rose-500/80 uppercase tracking-wider">
              {formErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-6 pt-10 border-t border-slate-100">
           <button type="button" onClick={onComplete} className="px-10 py-4 text-slate-400 font-black uppercase text-[11px] hover:text-slate-800 transition-colors">Discard Draft</button>
           <button type="submit" className="px-12 py-4 bg-indigo-600 text-white font-black uppercase text-[11px] rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3">
             <Save size={18} /> Deploy Asset
           </button>
        </div>
      </form>
    </div>
  );
};

export const QuestionModeration: React.FC<{ authorId?: string; onEdit?: (q: MCQ) => void }> = ({ authorId, onEdit }) => {
  const { questions, upsertQuestion, deleteQuestion, categories } = useApp();
  const [viewingQ, setViewingQ] = useState<MCQ | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState<string>('ALL');
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | 'ALL'>(authorId ? 'ALL' : QuestionStatus.PENDING);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; qId: string; qText: string }>({ isOpen: false, qId: '', qText: '' });

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (authorId && q.authorId !== authorId) return false;
      if (!q.questionText.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (catFilter !== 'ALL' && q.categoryId !== catFilter) return false;
      if (diffFilter !== 'ALL' && q.difficulty !== diffFilter) return false;
      if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
      return true;
    });
  }, [questions, authorId, searchTerm, catFilter, diffFilter, statusFilter]);

  const handleStatus = (q: MCQ, status: QuestionStatus) => {
    upsertQuestion({ ...q, status });
  };

  return (
    <div className="space-y-8">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => deleteQuestion(deleteModal.qId)}
        title="Delete Question"
        message="This action is irreversible."
        itemName={deleteModal.qText}
      />

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text"
            placeholder="Search knowledge fragments..."
            className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">Question Fragment</th>
                {!authorId && <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">Author</th>}
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-50/40 group">
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-800 line-clamp-1">{q.questionText}</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mt-1.5">{categories.find(c => c.id === q.categoryId)?.name}</p>
                  </td>
                  {!authorId && <td className="px-10 py-6 text-sm font-black text-slate-600">{q.authorName}</td>}
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${
                      q.status === QuestionStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-100' : 
                      q.status === QuestionStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>{q.status}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setViewingQ(q)} className="p-2.5 text-slate-400 hover:text-indigo-600"><Eye size={20} /></button>
                      {authorId ? (
                        <>
                          <button onClick={() => onEdit?.(q)} className="p-2.5 text-slate-400 hover:text-indigo-600"><Edit2 size={20} /></button>
                          <button onClick={() => setDeleteModal({ isOpen: true, qId: q.id, qText: q.questionText })} className="p-2.5 text-slate-400 hover:text-red-600"><Trash2 size={20} /></button>
                        </>
                      ) : (
                        q.status === QuestionStatus.PENDING && (
                          <>
                            <button onClick={() => handleStatus(q, QuestionStatus.APPROVED)} className="p-2.5 bg-green-50 text-green-600 rounded-xl"><Check size={20} /></button>
                            <button onClick={() => handleStatus(q, QuestionStatus.REJECTED)} className="p-2.5 bg-red-50 text-red-700 rounded-xl"><X size={20} /></button>
                          </>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingQ && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-black text-2xl">Fragment Detail</h3>
              <button onClick={() => setViewingQ(null)}><X size={24} /></button>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-2xl font-black text-slate-800">{viewingQ.questionText}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewingQ.options.map((opt, i) => (
                  <div key={i} className={`p-5 rounded-3xl border-2 ${viewingQ.correctOptionIndex === i ? 'bg-green-50 border-green-400' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="font-black text-sm">{String.fromCharCode(65 + i)}: {opt}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 italic">
                <p className="text-sm text-indigo-900">{viewingQ.explanation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};