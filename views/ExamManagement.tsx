import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Exam, Category, MCQ, QuestionStatus, Difficulty } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Clock, 
  HelpCircle, 
  Target, 
  Percent, 
  Play, 
  Pause, 
  Search, 
  CheckCircle2, 
  ChevronDown, 
  ListTodo, 
  BarChart, 
  Layers, 
  Info,
  Eye,
  ShieldCheck,
  ArrowRight,
  ClipboardCheck,
  Zap,
  Layout,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Coins
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface ExamManagementProps {
  onLaunchSimulation: (exam: Exam) => void;
}

export const ExamManagement: React.FC<ExamManagementProps> = ({ onLaunchSimulation }) => {
  const { exams, categories, questions, upsertExam, deleteExam } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
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
    totalQuestions: 0,
    questionIds: [],
    passPercentage: 50,
    marksPerQuestion: 1.0,
    negativeMarking: 0,
    difficulty: Difficulty.MEDIUM,
    isEnabled: true
  });

  const availableCategoryQuestions = useMemo(() => {
    return questions.filter(q => q.categoryId === formData.categoryId && q.status === QuestionStatus.APPROVED);
  }, [questions, formData.categoryId]);

  const selectedQuestionsData = useMemo(() => {
    return (formData.questionIds || [])
      .map(id => questions.find(q => q.id === id))
      .filter((q): q is MCQ => q !== undefined);
  }, [formData.questionIds, questions]);

  const difficultyStats = useMemo(() => {
    const counts = { [Difficulty.EASY]: 0, [Difficulty.MEDIUM]: 0, [Difficulty.HARD]: 0 };
    selectedQuestionsData.forEach(q => {
      counts[q.difficulty]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [selectedQuestionsData]);

  const DIFF_COLORS = {
    [Difficulty.EASY]: '#10b981',
    [Difficulty.MEDIUM]: '#f59e0b',
    [Difficulty.HARD]: '#ef4444'
  };

  const filteredQuestions = useMemo(() => {
    return availableCategoryQuestions.filter(q => 
      q.questionText.toLowerCase().includes(qSearchTerm.toLowerCase())
    );
  }, [availableCategoryQuestions, qSearchTerm]);

  const openModal = (exam: Exam | null = null) => {
    setQSearchTerm('');
    setIsPreviewActive(false);
    if (exam) {
      setEditingExam(exam);
      setFormData({
        ...exam,
        questionIds: exam.questionIds || [],
        difficulty: exam.difficulty || Difficulty.MEDIUM,
        marksPerQuestion: exam.marksPerQuestion || 1.0,
        negativeMarking: exam.negativeMarking || 0.0
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
        marksPerQuestion: 1.0,
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
      totalQuestions: newIds.length
    });
  };

  const constructExamObject = (): Exam => {
    return {
      id: editingExam?.id || Math.random().toString(36).substr(2, 9),
      createdAt: editingExam?.createdAt || new Date().toISOString(),
      authorId: editingExam?.authorId || 'system',
      authorName: editingExam?.authorName || 'Administrator',
      marksPerQuestion: formData.marksPerQuestion || 1.0,
      negativeMarking: formData.negativeMarking || 0.0,
      ...(formData as Omit<Exam, 'id' | 'createdAt' | 'marksPerQuestion' | 'negativeMarking'>)
    };
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.questionIds || formData.questionIds.length === 0) {
      alert("Please select at least one question fragment for this examination.");
      return;
    }
    upsertExam(constructExamObject());
    setIsModalOpen(false);
  };

  const DeploymentPreview = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/40">
              <ClipboardCheck size={32} />
            </div>
            <div>
              <h4 className="text-2xl font-black tracking-tight">Architectural Audit</h4>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Reviewing: {formData.title}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onLaunchSimulation(constructExamObject())}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 active:scale-95 shadow-xl"
          >
            <Zap size={16} className="text-indigo-600" /> Start Sandbox Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Complexity</p>
              <p className="text-lg font-black text-indigo-400">{formData.difficulty} LVL</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Duration</p>
              <p className="text-lg font-black text-white">{formData.durationMinutes}m</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Score Weight</p>
              <p className="text-lg font-black text-emerald-400">+{formData.marksPerQuestion?.toFixed(2)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Penalty</p>
              <p className="text-lg font-black text-rose-400">-{formData.negativeMarking?.toFixed(2)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Threshold</p>
              <p className="text-lg font-black text-white">{formData.passPercentage}%</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between">
             <div className="h-20 w-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyStats}
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {difficultyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DIFF_COLORS[entry.name as Difficulty]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Mix</p>
                <div className="flex gap-2 justify-end">
                   {difficultyStats.map((d, i) => d.value > 0 && (
                     <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: DIFF_COLORS[d.name as Difficulty] }}></div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
            <Layers size={16} className="text-indigo-600" /> Structure Registry ({selectedQuestionsData.length} fragments)
          </h5>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {selectedQuestionsData.map((q, i) => (
              <div key={q.id} className="bg-white border-2 border-slate-100 rounded-3xl p-8 hover:border-indigo-200 transition-all group relative">
                <div className="absolute top-8 right-8">
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                     q.difficulty === Difficulty.EASY ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                     q.difficulty === Difficulty.MEDIUM ? 'bg-amber-50 text-amber-600 border-amber-100' :
                     'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                     {q.difficulty}
                   </span>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-xl leading-snug mb-8 pr-12">{q.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`px-5 py-4 rounded-2xl text-sm font-bold border flex items-center gap-3 ${optIdx === q.correctOptionIndex ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                          <span className="w-6 h-6 rounded-lg bg-white/50 flex items-center justify-center text-[10px]">{String.fromCharCode(65 + optIdx)}</span>
                          <span className="flex-1">{opt}</span>
                          {optIdx === q.correctOptionIndex && <CheckCircle2 size={16} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Integrity Scan</h5>
           <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle2 size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Question Validity</span>
                 </div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">All selected fragments have passed internal moderation and contain valid correct indices.</p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <Clock size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Time Estimates</span>
                 </div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">Average of <span className="font-black text-indigo-600">{(formData.durationMinutes! / (selectedQuestionsData.length || 1)).toFixed(1)} mins</span> per question node.</p>
              </div>

              {formData.negativeMarking! > 0 && (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                   <div className="flex items-center gap-3 text-amber-700">
                      <AlertTriangle size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Penalty Warning</span>
                   </div>
                   <p className="text-xs text-amber-700/70 font-medium">Negative marking is active (-{formData.negativeMarking?.toFixed(2)} pts). Advise candidates to skip uncertain fragments.</p>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Complexity</span>
                    <span className="text-xs font-black text-slate-800">Balanced Registry</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    {difficultyStats.map((d, i) => (
                      <div 
                        key={i} 
                        style={{ width: `${(d.value / (selectedQuestionsData.length || 1)) * 100}%`, backgroundColor: DIFF_COLORS[d.name as Difficulty] }} 
                        className="h-full transition-all duration-1000"
                      />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, examId: '', examTitle: '' })}
        onConfirm={() => deleteExam(deleteModal.examId)}
        title="Delete Examination"
        message="Warning: This action will permanently delete this exam and all associated attempt history for all students. This cannot be undone."
        itemName={deleteModal.examTitle}
      />

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Examination Registry</h3>
          <p className="text-slate-500 text-sm md:text-base mt-1">Configure academic assessments and curated MCQ clusters.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={18} /> Provision Exam Cluster
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.map(exam => {
          const categoryPoolCount = questions.filter(q => q.categoryId === exam.categoryId && q.status === QuestionStatus.APPROVED).length;
          const selectedCount = exam.questionIds?.length || exam.totalQuestions;
          const saturationPercentage = categoryPoolCount > 0 ? (selectedCount / categoryPoolCount) * 100 : 0;

          return (
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
                    </div>
                  </div>
                  <button 
                    onClick={() => upsertExam({ ...exam, isEnabled: !exam.isEnabled })}
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

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Layers size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question Matrix</span>
                     </div>
                     <span className="text-[11px] font-black text-slate-800">{selectedCount} <span className="text-slate-400 text-[9px]">of</span> {categoryPoolCount} <span className="text-slate-400 text-[9px] font-bold">FRAGMENTS</span></span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-1000 group-hover:bg-indigo-600" 
                        style={{ width: `${Math.min(100, saturationPercentage)}%` }}
                      ></div>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => openModal(exam)}
                  className="flex-1 py-3.5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
                >
                  <Edit2 size={16} /> Refine Protocol
                </button>
                <button 
                  onClick={() => setDeleteModal({ isOpen: true, examId: exam.id, examTitle: exam.title })}
                  className="p-3.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}

        {exams.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <ListTodo size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">No examination clusters in active registry</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-6xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white relative shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-black text-2xl tracking-tight">
                  {isPreviewActive ? 'Deployment Manifest Audit' : (editingExam ? 'Synchronize Exam Node' : 'Provision New Exam')}
                </h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Architecture Wizard v2.9</p>
              </div>
              <button 
                onClick={() => isPreviewActive ? setIsPreviewActive(false) : setIsModalOpen(false)} 
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors shrink-0"
              >
                {isPreviewActive ? <ArrowLeft size={24} /> : <X size={24} />}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
              {!isPreviewActive ? (
                <form onSubmit={(e) => { e.preventDefault(); setIsPreviewActive(true); }} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Exam Title</label>
                        <input
                          required
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg"
                          value={formData.title}
                          placeholder="e.g. Quantitative Physics Audit"
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Classification</label>
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
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-3">Target Complexity</label>
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

                      <div className="p-8 bg-slate-900 rounded-[2.5rem] space-y-8 border border-slate-800">
                        <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3">
                          <Coins size={16} /> Scoring Protocol
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mark per Correct Answer</label>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-lg">+</div>
                              <input 
                                type="number"
                                step="0.01"
                                className="w-full pl-12 pr-6 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-black text-white text-lg"
                                value={formData.marksPerQuestion}
                                onChange={e => setFormData({ ...formData, marksPerQuestion: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">Positive value (e.g. 1.0, 2.5)</p>
                          </div>

                          <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Penalty per Wrong Answer</label>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500 font-black text-lg">-</div>
                              <input 
                                type="number"
                                step="0.01"
                                className="w-full pl-12 pr-6 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all font-black text-white text-lg"
                                value={formData.negativeMarking}
                                onChange={e => setFormData({ ...formData, negativeMarking: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">Penalty magnitude (e.g. 0.25, 0.33)</p>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Live Formula</p>
                          <p className="text-sm text-indigo-300 font-black mt-1 tracking-tight">Score = (Correct × {formData.marksPerQuestion?.toFixed(2)}) − (Wrong × {formData.negativeMarking?.toFixed(2)})</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Knowledge Matrix</label>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                          {formData.questionIds?.length} Nodes Selected
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 space-y-6 min-h-[400px] flex flex-col">
                        <div className="relative group">
                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            className="w-full pl-12 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-sm"
                            placeholder="Search available fragments..."
                            value={qSearchTerm}
                            onChange={e => setQSearchTerm(e.target.value)}
                          />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[300px]">
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 pt-10 border-t border-slate-100 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-6 font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 hover:text-slate-800 transition-all"
                    >
                      Discard Prototype
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-6 bg-indigo-50 text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px] rounded-[2.5rem] hover:bg-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                      <Eye size={20} />
                      Verify Architecture
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-10">
                  <DeploymentPreview />
                  <div className="flex gap-6 pt-10 border-t border-slate-100 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => setIsPreviewActive(false)}
                      className="flex-1 py-6 font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 hover:text-slate-800 transition-all flex items-center justify-center gap-3"
                    >
                      <ArrowLeft size={18} /> Modify Architecture
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSubmit()}
                      className="flex-1 py-6 bg-indigo-600 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[2.5rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                      <ShieldCheck size={20} />
                      Commit to Registry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
