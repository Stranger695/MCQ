
import React, { useRef } from 'react';
import { useApp } from '../AppContext';
import { ExamResult, User, Exam } from '../types';
import { ArrowLeft, Printer, Download, ShieldCheck, Award, Share2 } from 'lucide-react';

interface CertificateViewProps {
  result: ExamResult;
  onBack: () => void;
}

const CertificateView: React.FC<CertificateViewProps> = ({ result, onBack }) => {
  const { users, exams, settings } = useApp();
  const certificateRef = useRef<HTMLDivElement>(null);

  const student = users.find(u => u.id === result.studentId);
  const exam = exams.find(e => e.id === result.examId);

  if (!result.certificateId || !student || !exam) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
        <Award size={64} className="text-slate-200 mb-6" />
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Credential Not Found</h3>
        <p className="text-slate-500 mt-2">This session does not have a verified certificate node attached.</p>
        <button onClick={onBack} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px]">Return</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Verified Credential</span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Academic Certificate</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
          >
            <Printer size={18} /> Print Certificate
          </button>
        </div>
      </div>

      {/* Formal Certificate Layout */}
      <div 
        ref={certificateRef}
        className="bg-white p-4 md:p-12 shadow-2xl rounded-[1rem] md:rounded-[2rem] border-[12px] border-double border-indigo-900/10 relative overflow-hidden print:shadow-none print:border-indigo-900 print:rounded-none print:p-8"
        style={{ minHeight: '700px' }}
      >
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <Award size={600} className="absolute -top-20 -right-20 rotate-12" />
        </div>
        
        <div className="border-2 border-indigo-900/20 p-8 md:p-16 h-full flex flex-col items-center text-center relative z-10 print:border-indigo-900 print:p-12">
          {/* Header */}
          <div className="mb-12">
            <img src={settings.logoUrl} alt="Logo" className="w-20 h-20 mx-auto mb-6 grayscale print:grayscale-0" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight mb-2">
              {settings.siteName}
            </h1>
            <div className="h-1 w-32 bg-indigo-900 mx-auto rounded-full"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-900 mt-4">
              Academic Excellence Registry
            </p>
          </div>

          <div className="space-y-10 flex-1">
            <p className="text-xl md:text-2xl font-serif italic text-slate-600">
              This is to certify that
            </p>
            
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight border-b-2 border-slate-100 inline-block px-12 pb-4">
                {student.name}
              </h2>
            </div>

            <p className="text-xl md:text-2xl font-serif italic text-slate-600 max-w-2xl mx-auto leading-relaxed">
              has successfully completed the assessment for
            </p>

            <div>
              <h3 className="text-2xl md:text-4xl font-black text-indigo-900 tracking-tight uppercase">
                {exam.title}
              </h3>
              <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">
                Mastery Score: {Math.round((result.score / result.totalMarks) * 100)}%
              </p>
            </div>
          </div>

          {/* Footer of Certificate */}
          <div className="w-full mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
            <div className="space-y-2">
              <div className="h-px bg-slate-200 w-full mb-4"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</p>
              <p className="font-bold text-slate-800">{new Date(result.completedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200/50 to-transparent"></div>
                <Award size={48} className="text-indigo-900 relative z-10" />
              </div>
              <div className="flex flex-col items-center">
                 <ShieldCheck size={16} className="text-emerald-500 mb-1" />
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Registry Verified</p>
              </div>
            </div>

            <div className="space-y-2">
               <div className="h-px bg-slate-200 w-full mb-4"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credential ID</p>
               <code className="text-xs font-black text-indigo-900 uppercase tracking-tighter">{result.certificateId}</code>
            </div>
          </div>
          
          <div className="mt-12 text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em] max-w-lg">
            This document is a verified academic record produced by the {settings.siteName} Online Examination Framework. Authenticity can be verified via the global registry node using the Credential ID.
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 no-print">
         <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Transmission</span>
         </div>
         <div className="flex items-center gap-2 text-slate-400">
            <Share2 size={16} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Sharing Enabled</span>
         </div>
      </div>
    </div>
  );
};

export default CertificateView;
