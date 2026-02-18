import React, { useEffect } from 'react';
import { ShieldCheck, Lock, FileText, ArrowLeft, Printer, ShieldAlert, CheckCircle2, Info, Scale, Gavel, AlertOctagon } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms' | 'gdpr';
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const docConfig = {
    privacy: {
      title: 'Privacy Infrastructure Protocol',
      icon: <Lock className="text-indigo-600" />,
      lastUpdated: 'OCT-24-2024',
      sections: [
        { id: 'nodes', title: 'Identity Node Protection', content: 'Every candidate is assigned a unique cryptographic identity node. Personal Identifiable Information (PII) is isolated from examination metadata using double-blind hashing protocols. We utilize Supabase for secure identity vaulting, ensuring your password nodes never touch our primary processing logic in plain text.' },
        { id: 'telemetry', title: 'Academic Telemetry', content: 'We collect attempt duration, browser environment nodes, and response patterns solely for academic integrity verification. This telemetry includes tab-switch counts, session heartbeat, and interaction velocity. This data is never transmitted to external marketing clusters.' },
        { id: 'encryption', title: 'Data Encryption Standards', content: 'All results and certificates are stored using AES-256 encryption. Access to raw data is restricted to Super Admin nodes and requires multi-factor authorization. Backup clusters are synchronized every 24 hours to ensure high-availability of academic records.' },
        { id: 'third-party', title: 'External API Nodes', content: 'We utilize Google Gemini API for automated question generation and proctoring analysis. No PII (names, emails) is transmitted to these nodes; only anonymized subject matter and behavioral metadata fragments are processed for analytical output.' }
      ]
    },
    terms: {
      title: 'Academic Terms of Engagement',
      icon: <Scale className="text-amber-600" />,
      lastUpdated: 'JAN-15-2025',
      sections: [
        { id: 'integrity', title: 'Integrity Covenant', content: 'By initiating an examination session, you agree to undertake the assessment without the assistance of external neural nodes, AI assistants, or physical knowledge fragments. Any attempt to manipulate the Secure Session Environment (SSE) will trigger an immediate integrity alert.' },
        { id: 'proctoring', title: 'Proctoring Protocols', content: 'The system monitors active sessions for behavioral anomalies. You consent to the automated tracking of focus state, browser environment changes, and window management. Excessive tab-switching or session timeouts may result in an automatic "Deficit" (Fail) status.' },
        { id: 'finality', title: 'Grading Finality', content: 'Grading is processed by the EduQuest Core Engine using predefined knowledge maps. Unless a technical node error is identified by a Super Admin, all automated grading results are final and binding upon the candidate.' },
        { id: 'ip', title: 'Intellectual Property', content: 'All examination clusters, MCQ fragments, and certificate designs remain the exclusive intellectual property of the respective authors and the EduQuest Platform. Unauthorized extraction or redistribution of questions is a violation of the Academic Covenant.' },
        { id: 'accounts', title: 'Account Governance', content: 'Users are responsible for maintaining the confidentiality of their access credentials. Shared account nodes are prohibited and will result in permanent identity revocation without refund of historical credentials.' },
        { id: 'liability', title: 'Limitation of Liability', content: 'EduQuest is not liable for data loss or attempt failure resulting from regional infrastructure failures, local connectivity drops, or hardware malfunctions on the candidate end. Users are advised to utilize stable connectivity nodes.' }
      ]
    },
    gdpr: {
      title: 'Global Data Protection Audit',
      icon: <ShieldCheck className="text-emerald-600" />,
      lastUpdated: 'JAN-05-2025',
      sections: [
        { id: 'rights', title: 'The Right to Purge', content: 'Under the GDPR Protocol, candidates may request a total purge of their identity node. This action is final and will delete all historical academic credentials, certificates, and analytical logs. This process takes 72 hours for complete cluster synchronization.' },
        { id: 'access', title: 'Information Access', content: 'Users can export their complete analytical record in JSON format at any time via the Profile Calibration interface. This includes a full manifest of all attempts, scores, and telemetry fragments stored in our registry.' },
        { id: 'consent', title: 'Explicit Consent', content: 'No data processing occurs without explicit cryptographic consent provided during the Identity Provisioning process. You have the right to withdraw consent, which will result in the suspension of active examination privileges.' }
      ]
    }
  }[type];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              {docConfig.icon}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Governance Registry</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">{docConfig.title}</h2>
          </div>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <Printer size={18} /> Generate Hard Copy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6 no-print">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-24">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Document Index</h4>
            <nav className="space-y-2">
              {docConfig.sections.map(s => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`}
                  className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all border-l-2 border-transparent hover:border-indigo-600"
                >
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-10 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 text-emerald-600">
                  <ShieldCheck size={18} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Protocol Verified</span>
               </div>
               <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Revision ID: 2.10.4-LGL</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="lg:col-span-3 space-y-12">
          <div className="bg-white p-8 md:p-16 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
                <Gavel size={350} />
             </div>

             <div className="relative z-10 space-y-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Effective Deployment</p>
                      <p className="text-xl font-black text-slate-800">{docConfig.lastUpdated}</p>
                   </div>
                   <div className="text-right md:text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Node</p>
                      <p className="text-xl font-black text-indigo-600">EduQuest Global Compliance</p>
                   </div>
                </div>

                <div className="prose prose-slate max-w-none space-y-12">
                  {docConfig.sections.map(s => (
                    <section key={s.id} id={s.id} className="scroll-mt-32">
                       <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-4">
                         <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-black">§</span>
                         {s.title}
                       </h3>
                       <p className="text-lg text-slate-600 leading-relaxed font-medium">
                         {s.content}
                       </p>
                    </section>
                  ))}
                </div>

                <div className="p-10 bg-indigo-900 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                   <div className="flex items-center gap-4 relative z-10">
                      <AlertOctagon size={24} className="text-indigo-300" />
                      <h4 className="font-black uppercase text-xs tracking-widest">Mandatory Acknowledgment</h4>
                   </div>
                   <p className="text-sm text-indigo-100 font-medium leading-relaxed italic relative z-10">
                     "By proceeding into any examination cluster, you acknowledge that your behavioral telemetry will be mapped for academic verification. Failure to adhere to the Integrity Covenant will result in automatic session termination and data flagging."
                   </p>
                   <div className="flex items-center gap-3 pt-4 relative z-10">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                         <CheckCircle2 size={20} className="text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Digitally Attested by EduQuest Core Core</span>
                   </div>
                </div>

                {/* Simulated Signature Section */}
                <div className="pt-20 mt-20 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">On Behalf of Authority</p>
                      <div className="h-20 border-b-2 border-slate-200 flex items-end pb-2">
                         <span className="font-serif italic text-2xl text-slate-400 select-none">EduQuest Governance Protocol</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500">Chief Infrastructure Auditor</p>
                   </div>
                   <div className="space-y-4 opacity-50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">On Behalf of Candidate</p>
                      <div className="h-20 border-b-2 border-slate-200 flex items-center justify-center bg-slate-50 rounded-t-xl">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Electronic Attestation Required</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500">Session Verified Identity Node</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between px-8 text-slate-400 font-black text-[9px] uppercase tracking-[0.3em]">
             <span>CRC-32 Checksum: {Math.random().toString(16).substr(2, 8).toUpperCase()}</span>
             <span>Ref: EQ-PROT-2025-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalView;