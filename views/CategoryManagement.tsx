import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Category, UserStatus } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Search, 
  FileText, 
  BookOpen, 
  X, 
  Save, 
  AlertCircle,
  Hash,
  Activity,
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export const CategoryManagement: React.FC = () => {
  const { categories, questions, exams, upsertCategory, deleteCategory, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; cat: Category | null }>({
    isOpen: false,
    cat: null
  });

  const isInactive = currentUser?.status === UserStatus.INACTIVE;

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const openModal = (cat: Category | null = null) => {
    if (isInactive) return;
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name, description: cat.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInactive) return;
    const newCat: Category = {
      id: editingCategory?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description
    };
    upsertCategory(newCat);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cat: null })}
        onConfirm={() => {
          if (deleteModal.cat) deleteCategory(deleteModal.cat.id);
          setDeleteModal({ isOpen: false, cat: null });
        }}
        title="Purge Classification Node"
        message="Warning: Removing this category will leave orphaned questions and exams in the registry. Ensure all assets are re-mapped before execution."
        itemName={deleteModal.cat?.name}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <Layers size={32} className="text-indigo-600" />
            Category Architecture
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Manage the structural classifications of all academic knowledge fragments.</p>
        </div>
        <button 
          disabled={isInactive}
          onClick={() => openModal()}
          className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
            isInactive 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {isInactive ? <Lock size={18} /> : <Plus size={18} />} Provision Category
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text"
            placeholder="Filter subject clusters..."
            className="w-full pl-14 pr-8 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map(cat => {
          const questionCount = questions.filter(q => q.categoryId === cat.id).length;
          const examCount = exams.filter(e => e.categoryId === cat.id).length;

          return (
            <div key={cat.id} className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 flex flex-col group hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                 <Layers size={120} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                  <Hash size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    disabled={isInactive}
                    onClick={() => openModal(cat)} 
                    className={`p-3 rounded-xl transition-all ${isInactive ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    disabled={isInactive}
                    onClick={() => setDeleteModal({ isOpen: true, cat })} 
                    className={`p-3 rounded-xl transition-all ${isInactive ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{cat.name}</h3>
                <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">
                  {cat.description || 'No descriptive parameters established for this classification node.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                       <FileText size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Questions</span>
                    </div>
                    <p className="text-lg font-black text-slate-700">{questionCount}</p>
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                       <BookOpen size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Exams</span>
                    </div>
                    <p className="text-lg font-black text-slate-700">{examCount}</p>
                 </div>
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <AlertCircle size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Null classifications found in active registry</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
            <div className="p-8 md:p-10 bg-slate-900 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-widest">
                  {editingCategory ? 'Modify Classification' : 'Provision Classification'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors relative z-10">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Designation Name</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-all font-black text-lg"
                  placeholder="e.g. Theoretical Mathematics"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Operational Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-600 transition-all font-medium text-slate-600 resize-none"
                  placeholder="Define the scope and academic relevance of this category..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Structural Integrity Check</span>
                 </div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   Provisioning this node will allow authors to map new knowledge fragments to this classification across the global cluster.
                 </p>
              </div>

              <div className="flex gap-6 pt-6 border-t border-slate-100">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[11px] text-slate-400 tracking-widest">Abort Process</button>
                 <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-indigo-700 shadow-2xl transition-all flex items-center justify-center gap-4">
                   <Save size={20} /> {editingCategory ? 'Commit Changes' : 'Authorize Provisioning'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};