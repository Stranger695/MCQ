
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../AppContext';
import { Exam, MCQ, ExamResult } from '../types';
import { 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  BookOpen, 
  Layers, 
  Menu, 
  X, 
  Camera, 
  ShieldCheck,
  UserCheck,
  Eye
} from 'lucide-react';

interface ExamSessionProps {
  exam: Exam;
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
}

const ExamSession: React.FC<ExamSessionProps> = ({ exam, onComplete, onCancel }) => {
  const { questions, currentUser } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [examQuestions, setExamQuestions] = useState<MCQ[]>([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [proctorStatus, setProctorStatus] = useState('Initializing AI...');

  // Initialize Exam Questions
  useEffect(() => {
    let selected: MCQ[] = [];
    
    if (exam.questionIds && exam.questionIds.length > 0) {
      // Use explicitly selected questions
      selected = exam.questionIds
        .map(id => questions.find(q => q.id === id))
        .filter((q): q is MCQ => q !== undefined);
    } else {
      // Fallback to random category selection if none explicitly chosen
      const pool = questions.filter(q => q.categoryId === exam.categoryId && q.status === 'APPROVED');
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, exam.totalQuestions);
    }
    
    setExamQuestions(selected);
  }, [exam, questions]);

  // Camera Proctoring Setup
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setProctorStatus('Active Monitoring');
      } catch (err) {
        setProctorStatus('Camera Error');
      }
    }
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const finishExam = useCallback(() => {
    if (!currentUser) return;
    
    let correct = 0;
    let wrong = 0;
    examQuestions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        correct++;
      } else if (answers[q.id] !== undefined) {
        wrong++;
      }
    });

    const score = (correct * 1) - (wrong * exam.negativeMarking);
    const finalScore = Math.max(0, score);
    const scorePercentage = (finalScore / examQuestions.length) * 100;
    const status = scorePercentage >= exam.passPercentage ? 'PASS' : 'FAIL';

    const result: ExamResult = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: currentUser.id,
      examId: exam.id,
      score: finalScore,
      totalMarks: examQuestions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      timeTakenSeconds: (exam.durationMinutes * 60) - timeLeft,
      status,
      completedAt: new Date().toISOString(),
      certificateId: status === 'PASS' ? `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : undefined
    };

    onComplete(result);
  }, [answers, examQuestions, currentUser, exam, timeLeft, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finishExam]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (examQuestions.length === 0) return (
    <div className="flex flex-col items-center justify-center p-6 md:p-16 bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-200 m-4 md:m-12">
      <AlertCircle size={48} md-size={64} className="text-amber-500 mb-6" />
      <h3 className="text-xl md:text-3xl font-black tracking-tight text-center">Insufficient Question Data</h3>
      <p className="text-base md:text-lg text-slate-500 mt-3 font-medium text-center">This exam sector requires more approved knowledge fragments to initiate.</p>
      <button onClick={onCancel} className="mt-10 px-8 md:px-10 py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-xs">Exit Terminal</button>
    </div>
  );

  const currentQ = examQuestions[currentIdx];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Proctoring Feed */}
      <div className="p-6 border-b border-slate-100">
        <div className="relative group overflow-hidden rounded-[2rem] bg-slate-900 aspect-video mb-4 shadow-xl border-2 border-slate-800">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 pointer-events-none border-[12px] border-indigo-500/10"></div>
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${proctorStatus.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
             <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE FEED</span>
          </div>
          <div className="absolute bottom-3 right-3 bg-indigo-600 px-3 py-1 rounded-full shadow-lg">
             <Eye size={12} className="text-white" />
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Proctor Status</span>
              <span className={`text-[10px] font-black uppercase ${proctorStatus.includes('Error') ? 'text-red-500' : 'text-indigo-600'}`}>{proctorStatus}</span>
           </div>
           <ShieldCheck size={18} className="text-indigo-200" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
            <Layers size={16} className="text-indigo-600" /> PROGRESS MATRIX
          </h4>
          <div className="grid grid-cols-5 md:grid-cols-4 gap-2">
            {examQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => { setCurrentIdx(i); setIsNavOpen(false); }}
                className={`
                  h-10 md:h-12 rounded-xl flex items-center justify-center font-black transition-all text-xs border-2
                  ${currentIdx === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : ''}
                  ${answers[q.id] !== undefined 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                    : (currentIdx !== i ? 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200' : '')}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Completion</span>
              <span className="text-xs font-black text-indigo-600">{Math.round((Object.keys(answers).length / examQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out rounded-full" 
                style={{ width: `${(Object.keys(answers).length / examQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
             <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                {currentUser?.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-800 truncate">{currentUser?.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Candidate ID: {currentUser?.id}</p>
             </div>
             <UserCheck size={16} className="text-green-500" />
          </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-[150] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="h-20 md:h-24 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-12 shadow-sm shrink-0">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="bg-indigo-600 text-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg">
            <BookOpen size={20} md-size={28} />
          </div>
          <div className="max-w-[150px] sm:max-w-none">
            <h2 className="text-sm md:text-2xl font-black text-slate-900 tracking-tight truncate">{exam.title}</h2>
            <div className="text-[8px] md:text-xs text-slate-400 flex items-center gap-1.5 uppercase tracking-[0.2em] font-black mt-0.5">
              <span>Section Audit: {currentIdx + 1}/{examQuestions.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <div className={`flex items-center gap-1.5 md:gap-3 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-mono font-black text-sm md:text-xl ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock size={16} md-size={24} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => { if(confirm('Finalize and submit session audit?')) finishExam(); }}
            className="hidden sm:flex bg-emerald-600 text-white px-6 md:px-10 py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 items-center gap-2 md:gap-3 active:scale-95"
          >
            <Check size={18} /> Finalize Attempt
          </button>
          <button 
            onClick={() => setIsNavOpen(true)}
            className="p-3 lg:hidden bg-slate-100 text-slate-600 rounded-xl"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block w-80 border-r border-slate-200">
          <SidebarContent />
        </aside>

        {/* Mobile Navigation Drawer */}
        {isNavOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[160] lg:hidden" onClick={() => setIsNavOpen(false)} />
        )}
        <div className={`fixed top-0 bottom-0 left-0 w-80 bg-white z-[170] shadow-2xl transition-transform duration-300 lg:hidden ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-end p-4">
             <button onClick={() => setIsNavOpen(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
          </div>
          <SidebarContent />
        </div>

        {/* Question Panel */}
        <div className="flex-1 overflow-y-auto bg-slate-100/30 p-4 md:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 shadow-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="mb-10 md:mb-16 relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.3em] border border-indigo-100">ITEM {currentIdx + 1} OF {examQuestions.length}</span>
                  <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    <AlertCircle size={14} /> Difficulty: {currentQ.difficulty}
                  </div>
                </div>
                <h3 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                  {currentQ.questionText}
                </h3>
              </div>

              <div className="space-y-4 md:space-y-6 relative z-10">
                {currentQ.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
                    className={`
                      w-full p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-[3px] text-left transition-all flex items-center justify-between group
                      ${answers[currentQ.id] === i 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xl scale-[1.01]' 
                        : 'border-slate-50 bg-slate-50 hover:border-indigo-200 hover:bg-white'}
                    `}
                  >
                    <div className="flex items-center gap-5 md:gap-8">
                      <span className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-base md:text-2xl transition-all
                        ${answers[currentQ.id] === i ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 group-hover:text-indigo-400'}
                      `}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={`text-base md:text-2xl font-bold ${answers[currentQ.id] === i ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </div>
                    {answers[currentQ.id] === i && (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                        <Check size={20} md-size={24} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 md:mt-16 flex justify-between items-center gap-6">
              <button
                onClick={() => {
                  setCurrentIdx(Math.max(0, currentIdx - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentIdx === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 md:px-12 py-5 md:py-6 bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] text-slate-600 hover:bg-slate-50 disabled:opacity-30 font-black uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft size={20} /> <span className="hidden sm:inline">Backward</span>
              </button>
              
              <button
                onClick={() => { if(confirm('Finalize session and submit data clusters?')) finishExam(); }}
                className="sm:hidden flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100"
              >
                <Check size={20} /> Finalize
              </button>

              <button
                onClick={() => {
                  setCurrentIdx(Math.min(examQuestions.length - 1, currentIdx + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentIdx === examQuestions.length - 1}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 md:px-12 py-5 md:py-6 bg-indigo-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 shadow-xl shadow-indigo-100 hover:bg-indigo-700"
              >
                <span className="hidden sm:inline">Forward</span> <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;
