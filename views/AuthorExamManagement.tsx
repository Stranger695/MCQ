
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Exam, MCQ, ExamResult, Difficulty } from '../types';
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
  TrendingUp, 
  Trophy, 
  Users, 
  Eye,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const AuthorExamManagement: React.FC = () => {
  const { exams, categories, questions, upsertExam, deleteExam, currentUser, results, users } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [viewingStats, setViewingStats] = useState<Exam | null>(null);
  const [qSearchTerm, setQSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; examId: string; examTitle: string }>({
    isOpen: false,
    examId: '',
    examTitle: ''
  });

  const myExams = useMemo(() => {
    return exams.filter(e => e.authorId === currentUser?.id);
  }, [exams, currentUser]);

  const [formData, setFormData] = useState<Partial<Exam>>({
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

  const availableCategoryQuestions = useMemo(() => {
    return questions.filter(q => q.categoryId === formData.categoryId && q.status === 'APPROVED');
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
      totalQuestions: newIds.length
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionIds || formData.questionIds.length === 0) {
      alert("Please select knowledge fragments.");
      return;
    }

    const examData: Exam = {
      id: editingExam?.id || Math.random().toString(36).substr(2, 9),
      createdAt: editingExam?.createdAt || new Date().toISOString(),
      authorId: currentUser?.id || '',
      authorName: currentUser?.name || 'Unknown Author',
      ...(formData as Omit<Exam, 'id' | 'createdAt' | 'authorId' | 'authorName'>)
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

  const ExamStats = ({ exam }: { exam: Exam }) => {
    const examResults = results.filter(r => r.examId === exam.id);
    const passCount = examResults.filter(r => r.status === 'PASS').length;
    const failCount = examResults.length - passCount;
    const avgScore = examResults.length > 0 
      ? Math.round(examResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / examResults.length * 100) 
      : 0;

    const pieData = [
      { name: 'Success', value: passCount, color: '#10b981' },
      { name: 'Deficit', value: failCount, color: '#ef4444' }
    ].filter(d => d.value > 0);

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
            <div>
              <h3 className="font-black text-xl uppercase tracking-widest">Performance Analytics</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Audit Data: {exam.title}</p>
            </div>
            <button onClick={() => setViewingStats(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
          </div>
          <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Attempts</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{examResults.length}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mean Mastery</p>
                  <p className="text-4xl font-black text-indigo-600 tracking-tighter">{avgScore}%</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recent Candidate Attempts</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {examResults.slice(-5).reverse().map(res => (
                    <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                        <p className="text-xs font-black text-slate-800">{users.find(u => u.id === res.studentId)?.name || 'Deleted User'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(res.completedAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${res.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {Math.round((res.score / res.totalMarks) * 100)}% {res.status}
                      </span>
                    </div>
                  ))}
                  {examResults.length === 0 && <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase">Null attempts recorded</p>}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center p-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Pass / Fail Ratio</p>
              <div className="h-64 w-full">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <Activity size={48} className="mb-4 opacity-20" />
                    <span className="text-[10px] font-black uppercase">No Data Map</span>
                  </div>
                )}
              </div>
              <div className="flex gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => deleteExam(deleteModal.examId)}
        title="Purge Examination Cluster"
        message="This will permanently delete your exam and all associated student result nodes."
        itemName={deleteModal.examTitle}
      />

      {viewingStats && <ExamStats exam={viewingStats} />}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">My Examination Clusters</h3>
          <p className="text-slate-500 text-base mt-2 font-medium">Manage and audit knowledge assessments authored by you.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} /> Deploy New Cluster
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {myExams.map(exam => (
          <div key={exam.id} className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 relative">
            <div className={`h-2.5 w-full ${exam.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}></div>
            
            <div className="p-10 flex-1 space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 w-fit">
                    {categories.find(c => c.id === exam.categoryId)?.name}
                  </span>
                  <span className={`px-3 py-1 bg-slate-50 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100 w-fit ${
                    exam.difficulty === Difficulty.EASY ? 'text-emerald-600' :
                    exam.difficulty === Difficulty.MEDIUM ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {exam.difficulty} LEVEL
                  </span>
                </div>
                <button 
                  onClick={() => toggleStatus(exam)}
                  className={`p-3 rounded-xl transition-all shadow-sm ${exam.isEnabled ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                >
                  {exam.isEnabled ? <Play size={20} /> : <Pause size={20} />}
                </button>
              </div>

              <div>
                <h4 className="font-black text-slate-800 text-2xl leading-tight group-hover:text-indigo-600 transition-colors">{exam.title}</h4>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authored on {new Date(exam.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-10 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Time</span>
                  </div>
                  <p className="text-lg font-black text-slate-700">{exam.durationMinutes}m</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Layers size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Items</span>
                  </div>
                  <p className="text-lg font-black text-slate-700">{exam.totalQuestions}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setViewingStats(exam)}
                className="flex-1 py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white border border-indigo-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Activity size={18} /> Analytics
              </button>
              <button 
                onClick={() => openModal(exam)}
                className="p-4 text-slate-400 bg-white border border-slate-100 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => initiateDelete(exam)}
                className="p-4 text-slate-400 bg-white border border-slate-100 rounded-2xl hover:text-red-600 transition-all shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {myExams.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
            <ListTodo size={80} className="mx-auto text-slate-100 mb-8" />
            <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-300">No authored clusters in registry</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <h3 className="font-black text-2xl tracking-tight relative z-10">{editingExam ? 'Synchronize Cluster' : 'Provision Exam Cluster'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors relative z-10"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Exam Designation</label>
                    <input
                      required
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg"
                      value={formData.title}
                      placeholder="e.g. Molecular Biology Audit"
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Category</label>
                      <div className="relative">
                        <select
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none"
                          value={formData.categoryId}
                          onChange={e => setFormData({ ...formData, categoryId: e.target.value, questionIds: [] })}
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Complexity</label>
                      <div className="relative">
                        <select
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none"
                          value={formData.difficulty}
                          onChange={e => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                        >
                          {Object.values(Difficulty).map(d => (
                            <option key={d} value={d}>{d} Level</option>
                          ))}
                        </select>
                        <BarChart className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Mins</label>
                      <input required type="number" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 transition-all font-black text-lg" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Pass %</label>
                      <input required type="number" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 transition-all font-black text-lg" value={formData.passPercentage} onChange={e => setFormData({ ...formData, passPercentage: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Question Matrix</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {formData.questionIds?.length} Selected
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 space-y-6 h-full min-h-[400px] flex flex-col">
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        className="w-full pl-12 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-sm"
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
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.questionIds?.includes(q.id) ? 'bg-white border-indigo-500 shadow-lg' : 'bg-white/50 border-transparent hover:border-indigo-200'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-all ${formData.questionIds?.includes(q.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                              {formData.questionIds?.includes(q.id) ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 border-2 border-slate-200 rounded"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] font-bold leading-snug line-clamp-2 ${formData.questionIds?.includes(q.id) ? 'text-indigo-900' : 'text-slate-600'}`}>
                                {q.questionText}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{q.difficulty}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredQuestions.length === 0 && <p className="text-center py-20 text-[10px] font-black text-slate-300 uppercase">Null matches</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-800 transition-all">Discard Build</button>
                <button type="submit" className="flex-1 py-6 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-3xl hover:bg-indigo-700 shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                  <CheckCircle2 size={20} /> Deploy To Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
