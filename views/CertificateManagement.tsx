
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Award, ShieldCheck, ShieldAlert, Download, Search, RefreshCw, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { ExamResult } from '../types';

interface CertificateManagementProps {
  onViewCertificate?: (res: ExamResult) => void;
}

export const CertificateManagement: React.FC<CertificateManagementProps> = ({ onViewCertificate }) => {
  const { results, updateResult, users, exams } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [revokeModal, setRevokeModal] = useState<{ isOpen: boolean; result: ExamResult | null }>({
    isOpen: false,
    result: null
  });

  const certifiedResults = results.filter(r => r.status === 'PASS');

  const confirmRevoke = () => {
    if (revokeModal.result) {
      updateResult({ ...revokeModal.result, certificateId: undefined });
    }
  };

  const handleIssue = (res: ExamResult) => {
    const newId = `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    updateResult({ ...res, certificateId: newId });
  };

  const filtered = certifiedResults.filter(r => {
    const student = users.find(u => u.id === r.studentId);
    const exam = exams.find(e => e.id === r.examId);
    const query = searchTerm.toLowerCase();
    return (
      student?.name.toLowerCase().includes(query) || 
      exam?.title.toLowerCase().includes(query) || 
      r.certificateId?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <DeleteConfirmationModal 
        isOpen={revokeModal.isOpen}
        onClose={() => setRevokeModal({ isOpen: false, result: null })}
        onConfirm={confirmRevoke}
        title="Revoke Certificate"
        message="This action will clear the verification ID. The student will no longer be able to verify this credential."
        itemName={revokeModal.result?.id}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Credential Registry</h2>
          <p className="text-slate-500 text-sm">Review, verify, and manage all issued student certificates.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={18} />
          <input 
            className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm font-bold min-w-[320px]"
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(res => {
          const student = users.find(u => u.id === res.studentId);
          const exam = exams.find(e => e.id === res.examId);
          const isRevoked = !res.certificateId;
          return (
            <div key={res.id} className={`bg-white rounded-3xl border overflow-hidden transition-all duration-500 hover:shadow-2xl ${isRevoked ? 'opacity-80' : 'border-slate-200 shadow-sm'}`}>
              <div className={`h-1.5 w-full ${isRevoked ? 'bg-red-400' : 'bg-indigo-600'}`}></div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${isRevoked ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {isRevoked ? <ShieldAlert size={24} /> : <Award size={24} />}
                  </div>
                  {!isRevoked && onViewCertificate && (
                    <button 
                      onClick={() => onViewCertificate(res)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="View Certificate"
                    >
                      <Eye size={20} />
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">{student?.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{student?.email}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-700 text-sm mb-2 line-clamp-1">{exam?.title}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-black text-slate-800">{Math.round((res.score / res.totalMarks) * 100)}%</p>
                    <span className="text-[8px] font-black text-slate-400 uppercase">Mastery</span>
                  </div>
                </div>
                {!isRevoked && (
                  <div className="flex items-center gap-2 py-2 px-3 bg-indigo-50 rounded-xl">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    <code className="text-[10px] font-black text-indigo-700">{res.certificateId}</code>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-50 flex gap-2">
                  {!isRevoked ? (
                    <button onClick={() => setRevokeModal({ isOpen: true, result: res })} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Revoke</button>
                  ) : (
                    <button onClick={() => handleIssue(res)} className="flex-1 py-2.5 bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all">Re-issue</button>
                  )}
                  {!isRevoked && onViewCertificate && (
                    <button onClick={() => onViewCertificate(res)} className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">View</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
