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
  Eye,
  ShieldAlert
} from 'lucide-react';

interface ExamSessionProps {
  exam: Exam;
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
  isSandbox?: boolean; // New prop for preview mode
}

const ExamSession: React.FC<ExamSessionProps> = ({ exam, onComplete, onCancel, isSandbox = false }) => {
  const { questions, currentUser } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [examQuestions, setExamQuestions] = useState<MCQ[]>([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [proctorStatus, setProctorStatus] = useState(isSandbox ? 'Simulation Active' : 'Initializing AI...');

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

  useEffect(() => {
    if (isSandbox) return; // Skip camera in simulation
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setProctorStatus('Active Monitoring');
      } catch (err) {
        setProctorStatus('Camera Offline');
      }
    }
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isSandbox]);

  const finishExam = useCallback(() => {
    if (isSandbox) {
      onCancel(); // Just exit simulation
      return;
    }
    if (!currentUser) return;
    let correct = 0;
    let wrong = 0;
    examQuestions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) correct++;
      else if (answers[q.id] !== undefined) wrong++;
    });
    const score = Math.max(0, correct - (wrong * exam.negativeMarking));
    const status = (score / examQuestions.length) * 100 >= exam.passPercentage ? 'PASS' : 'FAIL';
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      studentId: currentUser.id,
      examId: exam.id,
      score,
      totalMarks: examQuestions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <AlertCircle size={48} className="text-amber-500 mb-4" />
      <h3 className="text-xl font-black text-center">Registry Deficit</h3>
      <p className="text-slate-500 text-sm text-center mt-2">Insufficient knowledge fragments to initiate session.</p>
      <button onClick={onCancel} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px]">Exit Interface</button>
    </div>
  );

  const currentQ = examQuestions[currentIdx];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 md:p-6 border-b border-slate-100">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-900 aspect-video mb-3 md:mb-4 shadow-xl border-2 border-slate-800 flex items-center justify-center">
          {isSandbox ? (
            <div className="text-center p-4">
              <ShieldAlert className="text-indigo-400 mx-auto mb-2" size={32} />
              <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest block">Sandbox Environment</span>
              <span className="text-[7px] text-indigo-400/60 uppercase block">Proctoring Disabled</span>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-md">
                 <div className={`w-1 h-1 rounded-full ${proctorStatus.includes('Offline') ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                 <span className="text-[7px] font-black text-white uppercase tracking-widest">SECURE FEED</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between px-1">
           <div className="flex flex-col">
              <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol status</span>
              <span className={`text-[9px] md:text-[10px] font-black uppercase ${proctorStatus.includes('Offline') ? 'text-red-500' : 'text-indigo-600'}`}>{proctorStatus}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Layers size={14} className="text-indigo-600" /> MATRIX NODE
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {examQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => { setCurrentIdx(i); setIsNavOpen(false); }}
                className={`
                  h-9 md:h-11 rounded-lg flex items-center justify-center font-black transition-all text-[10px] border-2
                  ${currentIdx === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : (answers[q.id] !== undefined ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200')}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-[150] flex flex-col font-sans overflow-hidden">
      {isSandbox && (
        <div className="bg-indigo-600 text-white py-1.5 text-center font-black uppercase tracking-[0.5em] text-[8px] relative z-[160]">
          Simulation Mode: Data Persistence Disabled
        </div>
      )}
      <div className="h-16 md:h-24 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3 md:gap-5 min-w-0">
          <div className="bg-indigo-600 text-white p-2 rounded-lg md:rounded-xl shrink-0">
            <BookOpen size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs md:text-xl font-black text-slate-900 truncate tracking-tight">{exam.title}</h2>
            <p className="text-[7px] md:text-xs text-slate-400 font-black uppercase tracking-widest mt-0.5">Attempt: {currentIdx + 1}/{examQuestions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full font-mono font-black text-xs md:text-lg ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock size={16} className="md:w-5 md:h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button onClick={() => setIsNavOpen(true)} className="p-2 lg:hidden bg-slate-100 text-slate-600 rounded-lg"><Menu size={20} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="hidden lg:block w-72 border-r border-slate-200"><SidebarContent /></aside>

        {isNavOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[160] lg:hidden" onClick={() => setIsNavOpen(false)} />}
        <div className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-[170] shadow-2xl transition-transform duration-300 lg:hidden ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-end p-4"><button onClick={() => setIsNavOpen(false)} className="p-2 text-slate-400"><X size={24} /></button></div>
          <SidebarContent />
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100/30 p-4 md:p-8 lg:p-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-12 lg:p-16 shadow-xl border border-slate-200">
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-indigo-100">FRAGMENT {currentIdx + 1}</span>
                  <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentQ.difficulty} LVL</span>
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
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${answers[currentQ.id] === i ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-indigo-100'}`}
                  >
                    <div className="flex items-center gap-4 md:gap-6 min-w-0">
                      <span className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-black text-sm md:text-xl shrink-0 ${answers[currentQ.id] === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>{String.fromCharCode(65 + i)}</span>
                      <span className="text-sm md:text-lg font-bold text-slate-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="flex-1 py-4 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 disabled:opacity-30"
              >
                Back
              </button>
              {currentIdx === examQuestions.length - 1 ? (
                <button onClick={() => {if(confirm(isSandbox ? 'Exit simulation?' : 'Finalize session?')) finishExam();}} className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
                  {isSandbox ? 'End Simulation' : 'Finalize Session'}
                </button>
              ) : (
                <button onClick={() => setCurrentIdx(prev => prev + 1)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Next Node</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;