import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Inquiry, InquiryStatus } from '../types';
import { 
  Mail, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Archive, 
  Clock, 
  User as UserIcon, 
  AtSign, 
  X,
  ChevronDown,
  Filter,
  AlertCircle,
  MoreVertical,
  MessageSquare
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export const InquiriesView: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry, refreshInquiries } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'ALL'>('ALL');
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const filtered = useMemo(() => {
    return inquiries.filter(i => {
      const matchesSearch = 
        i.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      new: inquiries.filter(i => i.status === 'NEW').length,
      total: inquiries.length,
      archived: inquiries.filter(i => i.status === 'ARCHIVED').length
    };
  }, [inquiries]);

  const handleOpenInquiry = (inquiry: Inquiry) => {
    setViewingInquiry(inquiry);
    if (inquiry.status === InquiryStatus.NEW) {
      updateInquiryStatus(inquiry.id, InquiryStatus.READ);
    }
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.NEW:
        return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase rounded-lg border border-indigo-200">New Response</span>;
      case InquiryStatus.READ:
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Review Pending</span>;
      case InquiryStatus.ARCHIVED:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-200">Archived</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        onConfirm={() => deleteInquiry(deleteModal.id)}
        title="Purge Communication Node"
        message="This will permanently delete this inquiry from the central database. This action is irreversible."
        itemName={deleteModal.name}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Mail size={32} className="text-indigo-600" />
            Communication Hub
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and audit external inquiries and platform feedback clusters.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MessageSquare size={18} /></div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unread Buffer</p>
                 <p className="text-xl font-black text-slate-800">{stats.new}</p>
              </div>
           </div>
           <button 
             onClick={() => refreshInquiries()}
             className="px-6 py-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
           >
             Synchronize Registry
           </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by sender, email, or subject..."
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <select 
            className="w-full pl-6 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">Global Log</option>
            <option value={InquiryStatus.NEW}>New Messages</option>
            <option value={InquiryStatus.READ}>Reviewed</option>
            <option value={InquiryStatus.ARCHIVED}>Archived</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Protocol</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(inquiry => (
                <tr key={inquiry.id} className={`hover:bg-slate-50/50 transition-all group ${inquiry.status === InquiryStatus.NEW ? 'bg-indigo-50/10 font-bold' : ''}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm ${inquiry.status === InquiryStatus.NEW ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {inquiry.first_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800">{inquiry.first_name} {inquiry.last_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-sm font-bold text-slate-700 line-clamp-1">{inquiry.subject}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{inquiry.message}</p>
                  </td>
                  <td className="px-10 py-6 text-center">
                    {getStatusBadge(inquiry.status)}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">{new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenInquiry(inquiry)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm transition-all" title="Open Response">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => updateInquiryStatus(inquiry.id, InquiryStatus.ARCHIVED)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 rounded-xl shadow-sm transition-all" title="Archive Node">
                        <Archive size={18} />
                      </button>
                      <button onClick={() => setDeleteModal({ isOpen: true, id: inquiry.id, name: `${inquiry.first_name} ${inquiry.last_name}` })} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl shadow-sm transition-all" title="Purge Record">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Mail size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Null communication nodes in registry</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingInquiry && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-8 md:p-10 bg-slate-900 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-widest">Inquiry Node Detail</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Transmission ID: {viewingInquiry.id}</p>
              </div>
              <button onClick={() => setViewingInquiry(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors relative z-10">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><UserIcon size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sender Identity</p>
                      <p className="text-lg font-black text-slate-800">{viewingInquiry.first_name} {viewingInquiry.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><AtSign size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Uplink</p>
                      <p className="text-lg font-black text-slate-800 break-all">{viewingInquiry.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shadow-sm"><Clock size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transmitted On</p>
                      <p className="text-lg font-black text-slate-800">{new Date(viewingInquiry.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shadow-sm"><AlertCircle size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Response Status</p>
                      <div className="mt-1">{getStatusBadge(viewingInquiry.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Subject Payload</p>
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-xl font-black text-slate-800 leading-tight">{viewingInquiry.subject}</p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Message Body</p>
                 <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 text-slate-300 relative overflow-hidden shadow-2xl">
                    <div className="absolute bottom-0 right-0 p-8 opacity-5">
                       <MessageSquare size={120} />
                    </div>
                    <p className="text-lg font-medium leading-relaxed italic relative z-10">"{viewingInquiry.message}"</p>
                 </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-slate-100">
                <button 
                  onClick={() => { updateInquiryStatus(viewingInquiry.id, InquiryStatus.ARCHIVED); setViewingInquiry(null); }}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                >
                  <Archive size={18} /> Archive Record
                </button>
                <a 
                  href={`mailto:${viewingInquiry.email}?subject=RE: ${viewingInquiry.subject}`}
                  className="flex-[2] py-5 bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-indigo-700 shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  <Mail size={18} /> Direct Response
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};