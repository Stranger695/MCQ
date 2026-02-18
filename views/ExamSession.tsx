import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { Exam, MCQ, ExamResult } from '../types';
import { 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Menu, 
  X, 
  ShieldCheck,
  ShieldAlert,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface ExamSessionProps {
  exam: Exam;
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
  isSandbox?: boolean;
}

const ExamSession: React.FC<ExamSessionProps> = ({ exam, onComplete, onCancel, isSandbox = false }) => {
  const { questions, currentUser } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [examQuestions, setExamQuestions] = useState<MCQ[]>([]);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    let selected: MCQ[] = [];
    if (exam.questionIds && exam.questionIds.length > 0) {
      selected = exam.questionIds
        .map(id => questions.find(q => q.id === id))
        .filter((q): q is MCQ => q !== undefined);
    } else {
      const pool = questions.filter(q => q.categoryId === exam.categoryId && q.status === 'APPROVED');
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, exam.totalQuestions);
    }
    setExamQuestions(selected);
  }, [exam, questions]);

  const finishExam = useCallback(() => {
    if (isSandbox) {
      onCancel();
      return;
    }
    if (!currentUser) return;
    let correctCount = 0;
    let wrongCount = 0;
    examQuestions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      } else if (answers[q.id] !== undefined) {
        wrongCount++;
      }
    });

    const marksPerQ = exam.marksPerQuestion || 1.0;
    const penaltyPerQ = exam.negativeMarking || 0.0;
    const rawScore = (correctCount * marksPerQ) - (wrongCount * penaltyPerQ);
    const score = Math.max(0, rawScore);
    const totalPossibleMarks = examQuestions.length * marksPerQ;
    const percentage = totalPossibleMarks > 0 ? (score / totalPossibleMarks) * 100 : 0;
    const status = percentage >= exam.passPercentage ? 'PASS' : 'FAIL';

    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      studentId: currentUser.id,
      examId: exam.id,
      score,
      totalMarks: Math.round(totalPossibleMarks),
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      timeTakenSeconds: (exam.durationMinutes * 60) - timeLeft,
      status,
      completedAt: new Date().toISOString(),
      certificateId: status === 'PASS' ? `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : undefined
    });
  }, [answers, examQuestions, currentUser, exam, timeLeft, onComplete, isSandbox, onCancel]);

  useEffect(() => {
    if (timeLeft <= 0) { finishExam(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finishExam]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (examQuestions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
      <AlertCircle size={48} className="text-amber-500 mb-4" />
      <h3 className="text-xl font-black">Registry Deficit</h3>
      <p className="text-slate-500 text-sm mt-2">Insufficient questions to initiate session.</p>
      <button onClick={onCancel} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px]">Exit Interface</button>
    </div>
  );

  const currentQ = examQuestions[currentIdx];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100">
        <div className="bg-slate-900 rounded-2xl aspect-video mb-4 flex flex-col items-center justify-center text-center p-4">
          {isSandbox ? <ShieldAlert className="text-indigo-400 mb-2" size={32} /> : <ShieldCheck className="text-emerald-400 mb-2" size={32} />}
          <span className="text-[9px] font-black uppercase tracking-widest text-white">{isSandbox ? 'Sandbox Environment' : 'Secure Session Active'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers size={14} className="text-indigo-600" /> MATRIX NODE
          </h4>
          <div className="grid grid-cols-5 gap-1.5">
            {examQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => { setCurrentIdx(i); setIsNavOpen(false); }}
                className={`
                  h-10 rounded-lg flex items-center justify-center font-black transition-all text-[10px] border-2
                  ${currentIdx === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : (answers[q.id] !== undefined ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-50')}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-black text-slate-400 uppercase">Progress</span>
            <span className="text-[10px] font-black text-slate-800">{Math.round((Object.keys(answers).length / examQuestions.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(Object.keys(answers).length / examQuestions.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-[150] flex flex-col font-sans overflow-hidden">
      <header className="h-16 md:h-24 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs md:text-lg font-black text-slate-900 truncate tracking-tight">{exam.title}</h2>
            <p className="text-[8px] md:text-xs text-slate-400 font-bold uppercase mt-0.5">Attempt: {currentIdx + 1}/{examQuestions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-black text-xs md:text-base ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock size={14} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button onClick={() => setIsNavOpen(true)} className="p-2 lg:hidden bg-slate-100 text-slate-600 rounded-lg"><Menu size={20} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="hidden lg:block w-72 border-r border-slate-200"><SidebarContent /></aside>

        {isNavOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[160] lg:hidden" onClick={() => setIsNavOpen(false)} />
        )}
        <div className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-[170] shadow-2xl transition-transform duration-300 lg:hidden ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-end p-4"><button onClick={() => setIsNavOpen(false)} className="p-2 text-slate-400"><X size={24} /></button></div>
          <SidebarContent />
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100/30 p-4 md:p-12">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-14 shadow-xl border border-slate-200 flex-1 flex flex-col justify-center">
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-indigo-100">Fragment {currentIdx + 1}</span>
                  <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentQ.difficulty} LEVEL</span>
                </div>
                <h3 className="text-lg md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  {currentQ.questionText}
                </h3>
              </div>

              <div className="space-y-3 md:space-y-4">
                {currentQ.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${answers[currentQ.id] === i ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-indigo-100'}`}
                  >
                    <span className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-black text-xs md:text-lg shrink-0 ${answers[currentQ.id] === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>{String.fromCharCode(65 + i)}</span>
                    <span className="text-sm md:text-lg font-bold text-slate-700">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 md:mt-10 flex gap-3 md:gap-6 pb-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="flex-1 py-4 md:py-6 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Back
              </button>
              {currentIdx === examQuestions.length - 1 ? (
                <button onClick={() => {if(confirm('Finalize session?')) finishExam();}} className="flex-[2] py-4 md:py-6 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Finish
                </button>
              ) : (
                <button onClick={() => setCurrentIdx(prev => prev + 1)} className="flex-[2] py-4 md:py-6 bg-indigo-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;