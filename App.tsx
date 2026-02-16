
import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Layout from './components/Layout';
import Auth from './views/Auth';
import LandingPage from './views/LandingPage';
import { 
  SuperAdminDashboard, 
  AuthorDashboard, 
  StudentDashboard 
} from './views/Dashboards';
import { QuestionForm, QuestionModeration } from './views/QuestionManagement';
import { UserManagement } from './views/UserManagement';
import { ExamManagement } from './views/ExamManagement';
import { AuthorExamManagement } from './views/AuthorExamManagement';
import { SiteSettingsView } from './views/SiteSettingsView';
import { Reports } from './views/Reports';
import { CertificateManagement } from './views/CertificateManagement';
import ExamSession from './views/ExamSession';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { UserRole, Exam, ExamResult, User, Category, MCQ } from './types';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Home, 
  FileText, 
  BookOpen, 
  Camera, 
  Calendar, 
  Mail, 
  Edit3,
  TrendingUp,
  Clock,
  History,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  Check,
  User as UserIcon,
  Save,
  RotateCcw,
  UserCheck,
  Zap,
  Plus,
  Layers,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const Toast: React.FC<{ message: string; type: 'SUCCESS' | 'ERROR'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[250] animate-in slide-in-from-right-12 duration-300">
      <div className={`px-5 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center gap-4 md:gap-5 border ${
        type === 'SUCCESS' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
      }`}>
        <div className={`p-2.5 md:p-3 rounded-xl ${type === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'}`}>
          {type === 'SUCCESS' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        </div>
        <p className="font-black uppercase tracking-widest text-[9px] md:text-xs">{message}</p>
        <button onClick={onClose} className="ml-2 md:ml-4 p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <X size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

const CategoryManagement: React.FC = () => {
  const { categories, upsertCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; catId: string; catName: string }>({
    isOpen: false,
    catId: '',
    catName: ''
  });

  const openModal = (cat: Category | null = null) => {
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
    upsertCategory({
      id: editingCategory?.id || Math.random().toString(36).substr(2, 9),
      ...formData
    });
    setIsModalOpen(false);
  };

  const initiateDelete = (cat: Category) => {
    setDeleteModal({
      isOpen: true,
      catId: cat.id,
      catName: cat.name
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => deleteCategory(deleteModal.catId)}
        title="Delete Category"
        message="Removing a category will also affect exams and questions associated with it."
        itemName={deleteModal.catName}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Exam Categories</h3>
        <button onClick={() => openModal()} className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100">
          <Plus size={18} /> Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                <Layers size={20} md-size={24} />
              </div>
              <div className="flex gap-1 md:gap-2">
                <button onClick={() => openModal(cat)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 size={18} /></button>
                <button onClick={() => initiateDelete(cat)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
            <h4 className="text-lg md:text-xl font-black text-slate-800">{cat.name}</h4>
            <p className="text-xs md:text-sm text-slate-500 mt-3 leading-relaxed font-medium line-clamp-3">{cat.description}</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="font-black text-lg md:text-xl uppercase tracking-widest">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} md-size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 md:space-y-6">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category Name</label>
                <input required className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Description</label>
                <textarea required className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-medium min-h-[100px] md:min-h-[120px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="flex gap-3 md:gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 md:py-4 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 md:py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfirmModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  title: string;
  message: string;
  isSaving: boolean;
  changes: { label: string; from: string; to: string }[];
}> = ({ isOpen, onClose, onConfirm, title, message, isSaving, changes }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-6 md:p-12">
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-indigo-50 text-indigo-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-inner shrink-0">
              <ShieldCheck size={32} md-size={40} />
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">{title}</h3>
              <p className="text-slate-400 text-[9px] md:text-xs font-black uppercase tracking-widest mt-1 md:mt-3">Verification Required</p>
            </div>
          </div>
          
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 md:mb-10 font-medium">
            {message}
          </p>
          
          <div className="space-y-4 md:space-y-5 mb-8 md:mb-12">
            {changes.map((change, idx) => (
              <div key={idx} className="bg-slate-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-400"></div>
                   {change.label}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-6">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs md:text-sm text-slate-400 line-through truncate block opacity-60 italic">{change.from}</span>
                  </div>
                  <div className="p-1 md:p-2 bg-indigo-100 text-indigo-600 rounded-lg w-fit group-hover:scale-110 transition-transform hidden sm:block">
                    <ArrowRight size={16} md-size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm md:text-base font-black text-indigo-700 truncate block">{change.to}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
            <button 
              disabled={isSaving}
              onClick={onClose}
              className="flex-1 py-4 md:py-5 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Abort
            </button>
            <button 
              disabled={isSaving}
              onClick={onConfirm}
              className="flex-1 py-4 md:py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Pending...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Confirm Change
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ onViewResult: (result: ExamResult) => void }> = ({ onViewResult }) => {
  const { currentUser, updateUser, results, exams } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [toast, setToast] = useState<{ message: string; type: 'SUCCESS' | 'ERROR' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const myResults = results.filter(r => r.studentId === currentUser.id);
  const totalExams = myResults.length;
  const passCount = myResults.filter(r => r.status === 'PASS').length;
  const avgScore = totalExams > 0 
    ? Math.round(myResults.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0) / totalExams * 100) 
    : 0;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ ...currentUser, avatar: reader.result as string });
        setToast({ message: 'Profile picture updated!', type: 'SUCCESS' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEditing = () => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setIsEditing(false);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      setToast({ message: 'Name cannot be empty.', type: 'ERROR' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setToast({ message: 'Please enter a valid email address.', type: 'ERROR' });
      return false;
    }
    return true;
  };

  const initiateSave = () => {
    if (!validateInputs()) return;
    
    const hasChanges = name.trim() !== currentUser.name || email.trim() !== currentUser.email;
    if (hasChanges) {
      setShowConfirmModal(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmSave = async () => {
    setSaveStatus('SAVING');
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateUser({ 
        ...currentUser, 
        name: name.trim() || currentUser.name, 
        email: email.trim() || currentUser.email 
      });
      setSaveStatus('SUCCESS');
      setToast({ message: 'Identity node updated!', type: 'SUCCESS' });
      setTimeout(() => {
        setSaveStatus('IDLE');
        setShowConfirmModal(false);
        setIsEditing(false);
      }, 500);
    } catch (err) {
      setSaveStatus('ERROR');
      setToast({ message: 'Write operation failed.', type: 'ERROR' });
      setTimeout(() => {
        setSaveStatus('IDLE');
        setShowConfirmModal(false);
      }, 3000);
    }
  };

  const getChangesSummary = () => {
    const changes = [];
    if (name.trim() !== currentUser.name) {
      changes.push({ label: 'Legal Identity', from: currentUser.name, to: name.trim() });
    }
    if (email.trim() !== currentUser.email) {
      changes.push({ label: 'System Email', from: currentUser.email, to: email.trim() });
    }
    return changes;
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmModal 
        isOpen={showConfirmModal}
        onClose={() => !saveStatus.includes('SAVING') && setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        isSaving={saveStatus === 'SAVING'}
        title="Sync Profile Changes"
        message="Review adjustments to your system identity. These will be reflected on all academic credentials."
        changes={getChangesSummary()}
      />

      {/* Profile Header Card */}
      <div className={`
        bg-white rounded-[2rem] md:rounded-[3rem] border transition-all duration-500 shadow-sm overflow-hidden
        ${isEditing ? 'border-indigo-400 ring-4 md:ring-[12px] ring-indigo-50 shadow-2xl' : 'border-slate-200'}
      `}>
        {/* Dynamic Header Background */}
        <div className={`
          h-40 md:h-56 relative transition-all duration-700 ease-in-out overflow-hidden
          ${isEditing 
            ? 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-800' 
            : 'bg-gradient-to-br from-indigo-600 to-indigo-700'}
        `}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
          
          <div className={`absolute top-4 md:top-10 right-4 md:right-10 flex items-center gap-3 md:gap-4`}>
            {isEditing ? (
              <div className="flex gap-2 md:gap-3 animate-in fade-in zoom-in-95">
                <button 
                  onClick={handleCancelEditing}
                  className="px-4 md:px-6 py-2 md:py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl md:rounded-[1.5rem] font-bold text-[10px] md:text-sm backdrop-blur-xl border border-white/20 transition-all flex items-center gap-2"
                >
                  <RotateCcw size={16} /> Discard
                </button>
                <button 
                  onClick={initiateSave}
                  className="px-4 md:px-8 py-2 md:py-4 bg-white text-indigo-700 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm shadow-xl hover:scale-[1.03] transition-all flex items-center gap-2"
                >
                  <Save size={16} /> Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4 px-3 md:px-6 py-1.5 md:py-3 bg-black/20 backdrop-blur-xl rounded-full md:rounded-[1.5rem] border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[8px] md:text-xs font-black text-white uppercase tracking-widest">Active Status</span>
              </div>
            )}
          </div>

          <div className="absolute -bottom-16 md:-bottom-20 left-4 md:left-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12 w-full md:w-auto">
            {/* Avatar Section */}
            <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
              <div className={`
                w-32 h-32 md:w-52 md:h-52 rounded-[2rem] md:rounded-[3.5rem] bg-white p-1.5 md:p-2 shadow-2xl transition-all duration-700
                ${isEditing ? 'border-4 md:border-[8px] border-indigo-400 rotate-3' : 'border-2 border-slate-50'}
              `}>
                <div className="w-full h-full rounded-[1.75rem] md:rounded-[3rem] overflow-hidden bg-slate-100 ring-2 md:ring-4 ring-slate-50">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 font-black text-4xl md:text-7xl">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-indigo-900/40 rounded-[2rem] md:rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-2 md:gap-4 backdrop-blur-[4px]">
                <Camera size={24} md-size={48} className="animate-bounce" />
                <span className="text-[8px] md:text-xs font-black uppercase tracking-widest">Update</span>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Profile Identity Section */}
            <div className="mb-4 md:mb-8 text-center md:text-left flex-1 px-4 md:px-0">
              {isEditing ? (
                <div className="relative animate-in slide-in-from-left max-w-full">
                  <input 
                    className="text-2xl md:text-5xl font-black text-slate-900 bg-amber-50 border-2 md:border-[4px] border-amber-400 rounded-xl md:rounded-[2rem] px-4 md:px-8 py-3 md:py-5 outline-none focus:ring-4 md:ring-[8px] focus:ring-amber-100 focus:border-amber-500 transition-all shadow-xl w-full placeholder:text-slate-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Identity Label"
                    autoFocus
                  />
                  <div className="absolute -top-3 md:-top-5 left-4 md:left-8 px-2 md:px-4 py-1 bg-amber-500 text-[8px] md:text-xs font-black text-white uppercase tracking-[0.3em] rounded-lg shadow-lg">
                    Editing Identity
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="flex items-center gap-3 md:gap-6">
                    <h2 className="text-3xl md:text-6xl font-black text-slate-800 tracking-tight leading-none truncate max-w-[200px] sm:max-w-md">{currentUser.name}</h2>
                    <button 
                      onClick={handleStartEditing}
                      className="p-2 md:p-4 bg-white text-slate-400 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:text-indigo-600 transition-all"
                    >
                      <Edit3 size={18} md-size={32} />
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 mt-2">
                    <span className="px-3 py-1 md:px-5 md:py-2 bg-indigo-50 text-indigo-700 rounded-lg text-[8px] md:text-xs font-black uppercase tracking-widest border border-indigo-100">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest">Verified Profile</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Content Section */}
        <div className={`
          pt-20 md:pt-36 pb-12 md:pb-16 px-6 md:px-16 transition-all duration-700
          ${isEditing ? 'bg-indigo-50/40' : 'bg-white'}
        `}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-12 md:mb-20">
            <div className="space-y-8 md:space-y-12">
              <h3 className={`text-[10px] md:text-sm font-black uppercase tracking-[0.4em] flex items-center gap-4 md:gap-8 ${isEditing ? 'text-indigo-600' : 'text-slate-400'}`}>
                Contact Node
                <span className={`h-px flex-1 ${isEditing ? 'bg-indigo-200' : 'bg-slate-100'}`}></span>
              </h3>
              
              <div className="space-y-4 md:space-y-8">
                <div className={`
                  group relative transition-all duration-500 rounded-2xl md:rounded-[2.5rem]
                  ${isEditing ? 'p-2 bg-amber-100 shadow-inner' : 'p-0'}
                `}>
                  <div className={`
                    flex items-center gap-4 md:gap-8 p-4 md:p-8 rounded-xl md:rounded-[2rem] border transition-all duration-500
                    ${isEditing ? 'bg-amber-50 border-amber-300 shadow-lg' : 'bg-slate-50/40 border-slate-100'}
                  `}>
                    <div className={`
                      p-3 md:p-5 rounded-lg md:rounded-2xl transition-all duration-700 shrink-0
                      ${isEditing ? 'bg-amber-500 text-white shadow-md' : 'bg-indigo-50 text-indigo-600'}
                    `}>
                      <Mail size={20} md-size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isEditing ? 'text-amber-600' : 'text-slate-400'}`}>Email Address</p>
                      {isEditing ? (
                        <input 
                          className="w-full bg-white border border-amber-200 px-3 py-1.5 rounded-lg text-sm md:text-xl font-black outline-none text-slate-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      ) : (
                        <span className="font-black text-slate-800 text-sm md:text-xl truncate block">{currentUser.email}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 p-4 md:p-8 rounded-xl md:rounded-[2rem] border border-slate-100 bg-slate-50/20">
                  <div className="p-3 md:p-5 bg-slate-100 text-slate-500 rounded-lg md:rounded-2xl shrink-0">
                    <Calendar size={20} md-size={32} />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined Date</p>
                    <span className="font-black text-slate-800 text-sm md:text-lg">
                      {new Date(currentUser.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 md:space-y-12">
              <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4 md:gap-8">
                Performance Metrics
                <span className="h-px flex-1 bg-slate-100"></span>
              </h3>
              <div className="grid grid-cols-3 gap-4 md:gap-10">
                {[
                  { label: "Total Exams", value: totalExams, icon: FileText, color: "indigo" },
                  { label: "Success Rate", value: `${avgScore}%`, icon: TrendingUp, color: "green" },
                  { label: "Credentials", value: passCount, icon: Award, color: "amber" }
                ].map((stat, i) => (
                  <div key={i} className={`bg-white p-4 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm hover:border-${stat.color}-300 hover:shadow-xl transition-all text-center`}>
                    <div className={`h-10 w-10 md:h-16 md:w-16 mx-auto bg-${stat.color}-50 text-${stat.color}-600 rounded-lg md:rounded-[1.5rem] flex items-center justify-center mb-3 md:mb-6`}>
                      <stat.icon size={24} md-size={32} />
                    </div>
                    <p className="text-xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 md:mt-4 line-clamp-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completed Exams Section */}
          <div className="space-y-8 md:space-y-12 pt-8 border-t border-slate-100">
            <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4 md:gap-8">
              Completed Records
              <span className="h-px flex-1 bg-slate-100"></span>
            </h3>

            {myResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {myResults.map((result) => {
                  const exam = exams.find(e => e.id === result.examId);
                  return (
                    <div 
                      key={result.id} 
                      className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className={`
                            px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                            ${result.status === 'PASS' 
                              ? 'bg-green-50 text-green-700 border-green-100' 
                              : 'bg-red-50 text-red-700 border-red-100'}
                          `}>
                            {result.status}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                          {exam?.title || 'System Audit Log'}
                        </h4>
                        <div className="flex items-end gap-2 md:gap-3">
                          <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                            {Math.round((result.score / result.totalMarks) * 100)}%
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mastery</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 md:mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={14} />
                          <span className="text-[10px] md:text-xs font-bold">{Math.floor(result.timeTakenSeconds / 60)}m elapsed</span>
                        </div>
                        <button 
                          onClick={() => onViewResult(result)}
                          className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <ExternalLink size={16} md-size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50/50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 p-12 md:p-20 text-center">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No academic records logged</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Certificate component to display and print student results.
const Certificate: React.FC<{ result: ExamResult; exam: Exam; onDone: () => void }> = ({ result, exam, onDone }) => {
  const { settings, currentUser } = useApp();
  const handlePrint = () => { window.print(); };
  const template = settings.certificateTemplate;
  const body = template.body
    .replace('[STUDENT_NAME]', currentUser?.name || 'Student')
    .replace('[EXAM_NAME]', exam.title)
    .replace('[SCORE]', Math.round((result.score / result.totalMarks) * 100).toString());

  return (
    <div className="max-w-4xl w-full bg-white p-6 md:p-12 rounded-[2rem] shadow-2xl border-[12px] border-double border-indigo-50 relative animate-in zoom-in-95 duration-500 overflow-hidden print:p-0 print:border-0 print:shadow-none print:max-w-none print:w-full">
      <div className="border-4 border-indigo-200 p-8 md:p-16 flex flex-col items-center text-center space-y-8 relative z-10 bg-white/80 backdrop-blur-sm print:bg-white print:border-2 print:border-slate-300">
        <div className="flex items-center gap-4 mb-4">
          <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 md:w-20 md:h-20" />
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter uppercase">{settings.siteName}</h1>
        </div>
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-4xl md:text-6xl font-black uppercase tracking-[0.2em]">{template.header}</h2>
          <div className="h-1.5 w-48 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div className="py-8 space-y-6">
           <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">This is to certify that</p>
           <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{currentUser?.name}</h3>
           <p className="text-lg md:text-xl text-slate-600 font-medium leading-loose max-w-2xl mx-auto">{body}</p>
        </div>
        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 w-full text-left">
          <div className="border-t-2 border-slate-200 pt-6">
            <p className="text-xl font-black text-slate-800">{template.footer}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">EduQuest Academic Board</p>
          </div>
          <div className="border-t-2 border-slate-200 pt-6 text-right">
            <p className="font-mono text-sm md:text-lg font-black text-indigo-600 tracking-widest">{result.certificateId}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Verification Registry ID</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 no-print pt-12 w-full sm:w-auto">
          <button onClick={handlePrint} className="flex-1 sm:flex-none px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3">
            <Download size={20} /> Download PDF
          </button>
          <button onClick={onDone} className="flex-1 sm:flex-none px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Return to Terminal</button>
        </div>
      </div>
    </div>
  );
};

const ResultSummary: React.FC<{ result: ExamResult; exam: Exam; onDone: () => void }> = ({ result, exam, onDone }) => {
  const [showCert, setShowCert] = useState(false);
  if (showCert) return <Certificate result={result} exam={exam} onDone={onDone} />;

  return (
    <div className="max-w-3xl w-full bg-white rounded-[3rem] md:rounded-[5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-12 duration-1000">
      <div className={`p-10 md:p-24 text-center text-white relative overflow-hidden ${result.status === 'PASS' ? 'bg-green-600' : 'bg-red-600'}`}>
        <div className="w-24 h-24 md:w-36 md:h-36 bg-white/20 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto mb-8 md:mb-12 shadow-2xl backdrop-blur-2xl ring-4 ring-white/10">
          {result.status === 'PASS' ? <CheckCircle2 size={48} md-size={84} /> : <XCircle size={48} md-size={84} />}
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter">Attempt {result.status === 'PASS' ? 'Verified' : 'Failed'}</h2>
        <p className="text-white/80 font-black uppercase text-[8px] md:text-xs bg-black/10 px-6 md:px-8 py-2 md:py-3 rounded-full inline-block">Subject: {exam.title}</p>
      </div>
      <div className="p-8 md:p-16 grid grid-cols-2 gap-6 md:gap-12 bg-slate-50/40">
        <div className="p-6 md:p-12 bg-white rounded-[2.5rem] md:rounded-[4rem] text-center shadow-sm">
          <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Accuracy</p>
          <p className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter">{Math.round((result.score / result.totalMarks) * 100)}%</p>
        </div>
        <div className="p-6 md:p-12 bg-white rounded-[2.5rem] md:rounded-[4rem] text-center shadow-sm">
          <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Time</p>
          <p className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter">{Math.floor(result.timeTakenSeconds / 60)}<span className="text-xl ml-1">M</span></p>
        </div>
      </div>
      <div className="p-8 md:p-20 bg-white border-t border-slate-100 flex flex-col gap-4">
        {result.status === 'PASS' && (
          <button onClick={() => setShowCert(true)} className="w-full py-5 md:py-8 bg-indigo-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-sm flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all">
            <Award size={24} /> Issue Credential
          </button>
        )}
        <button onClick={onDone} className="w-full py-5 md:py-8 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-sm flex items-center justify-center gap-4 hover:bg-black transition-all">
          <Home size={24} /> Exit Terminal
        </button>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, saveResult, results, exams, settings, isLoading } = useApp();
  const [activeView, setActiveView] = useState('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<MCQ | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', `${settings.baseFontSize}px`);
  }, [settings.baseFontSize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <h2 className="font-black text-xl text-slate-800 uppercase tracking-widest">Synchronizing Nodes</h2>
      </div>
    );
  }
  if (!currentUser && !isAuthOpen) return <LandingPage onEnterAuth={() => setIsAuthOpen(true)} />;
  if (!currentUser && isAuthOpen) return <Auth onGoBack={() => setIsAuthOpen(false)} />;
  if (activeExam) {
    return (
      <ExamSession 
        exam={activeExam} 
        onCancel={() => setActiveExam(null)} 
        onComplete={(result) => {
          saveResult(result);
          setLastResult(result);
          setActiveExam(null);
        }} 
      />
    );
  }
  if (lastResult) {
    const exam = exams.find(e => e.id === lastResult.examId)!;
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-16">
        <ResultSummary result={lastResult} exam={exam} onDone={() => setLastResult(null)} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        if (currentUser!.role === UserRole.SUPER_ADMIN || currentUser!.role === UserRole.ADMIN) return <SuperAdminDashboard />;
        if (currentUser!.role === UserRole.AUTHOR) return <AuthorDashboard />;
        if (currentUser!.role === UserRole.STUDENT) return <StudentDashboard onStartExam={setActiveExam} />;
        return null;
      case 'users': return <UserManagement />;
      case 'exams': return <ExamManagement />;
      case 'my-exams': return <AuthorExamManagement />;
      case 'settings': return <SiteSettingsView />;
      case 'categories': return <CategoryManagement />;
      case 'questions': return <QuestionModeration />;
      case 'reports': return <Reports />;
      case 'certificates': return <CertificateManagement />;
      case 'add-question':
        return <QuestionForm 
          initialData={editingQuestion}
          onComplete={() => {
            setActiveView(currentUser!.role === UserRole.AUTHOR ? 'my-questions' : 'questions');
            setEditingQuestion(null);
          }} 
        />;
      case 'my-questions':
        return (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">My Submissions</h3>
              </div>
              <button 
                onClick={() => { setEditingQuestion(null); setActiveView('add-question'); }}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"
              >
                <Plus size={20} /> New Asset
              </button>
            </div>
            <QuestionModeration 
              authorId={currentUser!.id} 
              onEdit={(q) => { setEditingQuestion(q); setActiveView('add-question'); }}
            />
          </div>
        );
      case 'my-results':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {results.filter(r => r.studentId === currentUser!.id).map(res => (
              <div key={res.id} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
                <div>
                  <div className="flex justify-between items-start mb-8">
                     <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border ${res.status === 'PASS' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{res.status}</span>
                     <span className="text-[9px] text-slate-400 font-black">{new Date(res.completedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-xl md:text-3xl mb-6 leading-tight truncate">{exams.find(e => e.id === res.examId)?.title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tighter">{Math.round((res.score / res.totalMarks) * 100)}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Mastery</span>
                  </div>
                </div>
                <button onClick={() => setLastResult(res)} className="mt-10 w-full py-4 bg-slate-50 text-slate-800 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase hover:border-indigo-200 transition-all">View Audit</button>
              </div>
            ))}
          </div>
        );
      case 'profile': return <ProfileView onViewResult={setLastResult} />;
      default: return <div className="p-20 text-center">Section Offline</div>;
    }
  };

  return <Layout activeView={activeView} setActiveView={setActiveView}>{renderContent()}</Layout>;
};

const App: React.FC = () => (
  <AppProvider><AppContent /></AppProvider>
);
export default App;
