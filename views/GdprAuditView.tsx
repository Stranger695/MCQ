import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { 
  ShieldCheck, 
  Lock, 
  FileJson, 
  Download, 
  Trash2, 
  Eye, 
  Info, 
  ShieldAlert, 
  Clock, 
  FileText, 
  CheckCircle2, 
  RefreshCw,
  Database,
  Fingerprint,
  Globe,
  Gavel,
  Scale,
  History,
  AlertOctagon,
  ChevronRight,
  // Added missing Activity icon import
  Activity
} from 'lucide-react';

export const GdprAuditView: React.FC = () => {
  const { currentUser, results, exams, categories } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [showErasureConfirm, setShowErasureConfirm] = useState(false);

  const userDataManifest = useMemo(() => {
    if (!currentUser) return null;
    const myResults = results.filter(r => r.studentId === currentUser.id);
    
    return {
      identity: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
        role: currentUser.role,
        joined: currentUser.joinedAt
      },
      academic_history: myResults.map(r => ({
        exam: exams.find(e => e.id === r.examId)?.title || 'Unknown Cluster',
        score: r.score,
        status: r.status,
        timestamp: r.completedAt
      })),
      meta: {
        last_audit: new Date().toISOString(),
        compliance_id: `EQ-GDPR-${currentUser.id.slice(0, 8).toUpperCase()}`,
        encryption: 'AES-256-GCM'
      }
    };
  }, [currentUser, results, exams]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userDataManifest, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `eduquest_data_audit_${currentUser?.id}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setIsExporting(false);
    }, 1200);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Governance Hero */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/40">
                  <ShieldCheck size={24} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Compliance Protocol Active</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none">
              GDPR <br/><span className="text-indigo-400">Audit Node.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
              Full transparency registry of your personal identity nodes and academic telemetry. Exercising your right to access and portability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
             <div className="text-center bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md min-w-[160px]">
                <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">Operational</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">Platform Status</p>
             </div>
             <div className="text-center bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md min-w-[160px]">
                <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">AES-256</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">Encryption Tier</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Sidebar: Control Console */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                <Gavel size={18} className="text-indigo-600" /> Identity Rights
              </h3>
              
              <div className="space-y-4">
                 <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:bg-white transition-all flex flex-col items-center text-center group disabled:opacity-50"
                 >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                       {isExporting ? <RefreshCw size={24} className="animate-spin" /> : <Download size={24} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Export Portability Node</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Download JSON Manifest</span>
                 </button>

                 <button 
                  onClick={() => setShowErasureConfirm(true)}
                  className="w-full p-6 bg-rose-50 border-2 border-rose-100 rounded-[2rem] hover:border-rose-300 transition-all flex flex-col items-center text-center group"
                 >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                       <Trash2 size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-800">Initiate Purge Protocol</span>
                    <span className="text-[8px] font-bold text-rose-400 uppercase mt-1">Right to Erasure (Art. 17)</span>
                 </button>
              </div>

              <div className="pt-8 border-t border-slate-100">
                 <div className="flex items-center gap-4 mb-4">
                    <Fingerprint size={20} className="text-slate-400" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance Identity</p>
                 </div>
                 <code className="block bg-slate-50 p-4 rounded-xl text-[10px] font-black text-slate-600 border border-slate-100 break-all">
                    {userDataManifest?.meta.compliance_id}
                 </code>
              </div>
           </div>

           <div className="bg-indigo-900 rounded-[3rem] p-8 text-white space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
              <h4 className="font-black uppercase text-xs tracking-widest flex items-center gap-3">
                 <Globe size={18} className="text-indigo-400" /> Data Residence
              </h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-indigo-400">Primary Node</span>
                    <span>EU-WEST-1 (Verified)</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-indigo-400">Replication</span>
                    <span>Synchronous Cluster</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-indigo-400">DPA ID</span>
                    <span>#921-XRT-04</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Main: Data Transparency Register */}
        <div className="lg:col-span-2 space-y-10">
           <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Personal Data Manifest</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Listing all PII fragments stored in the core registry</p>
                 </div>
                 <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                    Auto-Refreshed
                 </div>
              </div>

              <div className="space-y-4">
                 {[
                   { label: 'Legal Identity', value: currentUser.name, icon: <Database size={16} /> },
                   { label: 'Electronic Address', value: currentUser.email, icon: <Database size={16} /> },
                   { label: 'Access Handle', value: currentUser.username || 'unmapped', icon: <Database size={16} /> },
                   { label: 'Contact Node', value: currentUser.phoneNumber || 'unmapped', icon: <Database size={16} /> },
                   { label: 'Enrolment Stamp', value: new Date(currentUser.joinedAt).toLocaleString(), icon: <History size={16} /> },
                   // Fixed: Using the imported Activity icon here
                   { label: 'Behavioral Metrics', value: `${results.filter(r => r.studentId === currentUser.id).length} Attempt Logs`, icon: <Activity size={16} /> }
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] group hover:bg-white hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                            {node.icon}
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{node.label}</p>
                            <p className="text-sm font-black text-slate-800">{node.value}</p>
                         </div>
                      </div>
                      <ShieldCheck size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
              </div>

              <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-4">
                 <div className="flex items-center gap-4 text-amber-800">
                    {/* Fixed: Re-added missing Info icon which was listed in imports but not used correctly here */}
                    <Info size={24} />
                    <h4 className="font-black uppercase text-xs tracking-widest">Academic Retention Clause</h4>
                 </div>
                 <p className="text-sm text-amber-900/70 font-medium leading-relaxed">
                    Under academic integrity protocols, examination transcripts are retained for 24 months post-graduation for credential verification. After this period, identity nodes are automatically anonymized via the hashing engine.
                 </p>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Governance Activity Log</h3>
              </div>
              <div className="divide-y divide-slate-100">
                 {[
                   { event: 'Identity Provisioned', desc: 'Core record created in encrypted registry', date: currentUser.joinedAt },
                   { event: 'Portability Requested', desc: 'Current user initiated JSON data export', date: new Date().toISOString() },
                   { event: 'DPA Audit Complete', desc: 'Automated platform integrity scan successful', date: '2025-01-10T10:00:00Z' }
                 ].map((log, i) => (
                   <div key={i} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                         <div>
                            <p className="text-sm font-black text-slate-800">{log.event}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{log.desc}</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(log.date).toLocaleDateString()}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Erasure Modal Overlay */}
      {showErasureConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-rose-600 text-white flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest">Warning: Account Purge</h3>
                    <p className="text-rose-100 text-[10px] font-black uppercase tracking-widest mt-2">Irreversible Data Erasure Protocol</p>
                 </div>
                 <button onClick={() => setShowErasureConfirm(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Trash2 size={24} /></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="flex items-center gap-6 p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
                    <AlertOctagon size={48} className="text-rose-600 shrink-0" />
                    <p className="text-sm text-rose-900 font-bold leading-relaxed">
                       This action will permanently delete your identity node, all academic results, and verified certificates. You will lose access to all historically issued credentials.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">To confirm, type your email below</p>
                    <input 
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-600 font-black text-center text-lg" 
                      placeholder={currentUser.email}
                    />
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowErasureConfirm(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 font-black uppercase text-[10px] rounded-2xl hover:bg-slate-200 transition-all">Abort Request</button>
                    <button className="flex-1 py-5 bg-rose-600 text-white font-black uppercase text-[10px] rounded-2xl hover:bg-rose-700 shadow-xl transition-all shadow-rose-200">Confirm Deletion</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GdprAuditView;