
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Exam, Category, MCQ, QuestionStatus, Difficulty } from '../types';
import { Plus, Edit2, Trash2, X, Clock, HelpCircle, Target, Percent, Play, Pause, Search, CheckCircle2, ChevronDown, ListTodo, BarChart, Layers } from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export const ExamManagement: React.FC = () => {
  const { exams, categories, questions, upsertExam, deleteExam } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [qSearchTerm, setQSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; examId: string; examTitle: string }>({
    isOpen: false,
    examId: '',
    examTitle: ''
  });

  const [formData, setFormData] = useState<Partial<Exam>>({
    title: '',
    categoryId: categories[0]?.id || '',
    durationMinutes: 30,
    totalQuestions: 10,
    questionIds: [],
    passPercentage: 50,
    negativeMarking: 0,
    difficulty: Difficulty.MEDIUM,
    isEnabled: true
  });

  const availableCategoryQuestions = useMemo(() => {
    return questions.filter(q => q.categoryId === formData.categoryId && q.status === QuestionStatus.APPROVED);
  }, [questions, formData.categoryId]);

  const filteredQuestions = useMemo(() => {
    return availableCategoryQuestions.filter(q => 
      q.questionText.toLowerCase().includes(qSearchTerm.toLowerCase())
    );
  }, [availableCategoryQuestions, qSearchTerm]);

  const openModal = (exam: Exam | null = null) => {
    setQSearchTerm('');
    if (exam) {
      setEditingExam(exam);
      setFormData({
        ...exam,
        questionIds: exam.questionIds || [],
        difficulty: exam.difficulty || Difficulty.MEDIUM
      });
    } else {
      setEditingExam(null);
      setFormData({
        title: '',
        categoryId: categories[0]?.id || '',
        durationMinutes: 30,
        totalQuestions: 0,
        questionIds: [],
        passPercentage: 50,
        negativeMarking: 0,
        difficulty: Difficulty.MEDIUM,
        isEnabled: true
      });
    }
    setIsModalOpen(true);
  };

  const toggleQuestionSelection = (qId: string) => {
    const currentIds = formData.questionIds || [];
    const newIds = currentIds.includes(qId) 
      ? currentIds.filter(id => id !== qId)
      : [...currentIds, qId];
    
    setFormData({ 
      ...formData, 
      questionIds: newIds,
      totalQuestions: newIds.length // Sync totalQuestions count with selection
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionIds || formData.questionIds.length === 0) {
      alert("Please select at least one question fragment for this examination.");
      return;
    }

    const examData: Exam = {
      id: editingExam?.id || Math.random().toString(36).substr(2, 9),
      createdAt: editingExam?.createdAt || new Date().toISOString(),
      ...(formData as Omit<Exam, 'id' | 'createdAt'>)
    };
    upsertExam(examData);
    setIsModalOpen(false);
  };

  const toggleStatus = (exam: Exam) => {
    upsertExam({ ...exam, isEnabled: !exam.isEnabled });
  };

  const initiateDelete = (exam: Exam) => {
    setDeleteModal({
      isOpen: true,
      examId: exam.id,
      examTitle: exam.title
    });
  };

  return (
    <div className="space-y-6">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => deleteExam(deleteModal.examId)}
        title="Delete Examination"
        message="Warning: This action will permanently delete this exam and all associated attempt history for all students. This cannot be undone."
        itemName={deleteModal.examTitle}
      />

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Examination Hub</h3>
          <p className="text-slate-500 text-sm mt-1">Configure academic assessments and Curated MCQ clusters.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={18} /> Deploy Exam Cluster
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 relative">
            <div className={`h-2.5 w-full ${exam.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}></div>
            
            <div className="p-8 flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-100 w-fit">
                    {categories.find(c => c.id === exam.categoryId)?.name}
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 bg-slate-50 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100 w-fit ${
                      exam.difficulty === Difficulty.EASY ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      exam.difficulty === Difficulty.MEDIUM ? 'text-amber-600 bg-amber-50 border-amber-100' :
                      'text-rose-600 bg-rose-50 border-rose-100'
                    }`}>
                      {exam.difficulty || 'MEDIUM'} LEVEL
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[8px] font-black uppercase tracking-widest rounded-lg border border-blue-100 w-fit flex items-center gap-1 shadow-sm">
                      <Layers size={10} /> {exam.totalQuestions} ITEMS
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleStatus(exam)}
                  className={`p-2.5 rounded-xl transition-all shadow-sm ${exam.isEnabled ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                >
                  {exam.isEnabled ? <Play size={18} /> : <Pause size={18} />}
                </button>
              </div>

              <div>
                <h4 className="font-black text-slate-800 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{exam.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {exam.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Timeframe</span>
                  </div>
                  <p className="text-sm font-black text-slate-700">{exam.durationMinutes} Minutes</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ListTodo size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Structure</span>
                  </div>
                  <p className="text-sm font-black text-slate-700">{exam.totalQuestions} Selected MCQs</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Percent size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Threshold</span>
                  </div>
                  <p className="text-sm font-black text-slate-700">{exam.passPercentage}% Mastery</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Target size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Audit Policy</span>
                  </div>
                  <p className="text-sm font-black text-slate-700">-{exam.negativeMarking} Penalty</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => openModal(exam)}
                className="flex-1 py-3.5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
              >
                <Edit2 size={16} /> Refine Configuration
              </button>
              <button 
                onClick={() => initiateDelete(exam)}
                className="p-3.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border border-transparent hover:border-red-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <ListTodo size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">No examination clusters in active registry</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-black text-2xl tracking-tight">{editingExam ? 'Sync Exam Cluster' : 'Deploy New Exam Cluster'}</h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Architecture Protocol v2.5</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Exam Designation</label>
                    <input
                      required
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg"
                      value={formData.title}
                      placeholder="e.g. Advanced Cybersecurity Audit"
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Academic Category</label>
                      <div className="relative">
                        <select
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                          value={formData.categoryId}
                          onChange={e => setFormData({ ...formData, categoryId: e.target.value, questionIds: [] })}
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Complexity Tier</label>
                      <div className="relative">
                        <select
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                          value={formData.difficulty}
                          onChange={e => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                        >
                          {Object.values(Difficulty).map(d => (
                            <option key={d} value={d}>{d} Level</option>
                          ))}
                        </select>
                        <BarChart className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Timeframe (Mins)</label>
                      <input
                        required
                        type="number"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg"
                        value={formData.durationMinutes}
                        onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Mastery Threshold %</label>
                      <input
                        required
                        type="number"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg"
                        value={formData.passPercentage}
                        onChange={e => setFormData({ ...formData, passPercentage: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Audit Penalty</label>
                      <input
                        required
                        type="number"
                        step="0.05"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg"
                        value={formData.negativeMarking}
                        onChange={e => setFormData({ ...formData, negativeMarking: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group transition-all hover:bg-indigo-50 hover:border-indigo-200">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox"
                        id="isEnabled"
                        className="w-8 h-8 rounded-xl border-2 border-slate-200 text-indigo-600 focus:ring-0 cursor-pointer appearance-none checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                        checked={formData.isEnabled}
                        onChange={e => setFormData({ ...formData, isEnabled: e.target.checked })}
                      />
                      {formData.isEnabled && <CheckCircle2 size={16} className="absolute text-white pointer-events-none" />}
                    </div>
                    <label htmlFor="isEnabled" className="text-sm font-black text-slate-700 uppercase tracking-widest cursor-pointer select-none">Deploy to Live Registry</label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated Question Matrix</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {formData.questionIds?.length} / {availableCategoryQuestions.length} Selected
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 space-y-6 h-full min-h-[400px] flex flex-col">
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input 
                        className="w-full pl-12 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-sm"
                        placeholder="Search fragments..."
                        value={qSearchTerm}
                        onChange={e => setQSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {filteredQuestions.map(q => (
                        <div 
                          key={q.id}
                          onClick={() => toggleQuestionSelection(q.id)}
                          className={`
                            p-4 rounded-2xl border-2 transition-all cursor-pointer group/q
                            ${formData.questionIds?.includes(q.id) 
                              ? 'bg-white border-indigo-500 shadow-lg shadow-indigo-100' 
                              : 'bg-white/50 border-white hover:border-indigo-200'}
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`
                              w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all
                              ${formData.questionIds?.includes(q.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}
                            `}>
                              {formData.questionIds?.includes(q.id) ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 border-2 border-slate-200 rounded-lg"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-black leading-snug line-clamp-2 transition-colors ${formData.questionIds?.includes(q.id) ? 'text-indigo-900' : 'text-slate-600'}`}>
                                {q.questionText}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                  q.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  q.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Fragment ID: {q.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredQuestions.length === 0 && (
                        <div className="py-20 text-center">
                          <HelpCircle size={32} className="mx-auto text-slate-200 mb-4" />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zero fragments detected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-6 font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 hover:text-slate-800 transition-all"
                >
                  Discard Build
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-6 bg-indigo-600 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  <CheckCircle2 size={20} />
                  {editingExam ? 'Synchronize Configuration' : 'Commit To Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
