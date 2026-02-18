import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { User, UserRole, UserStatus, Gender } from '../types';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  Users as UsersIcon, 
  ChevronDown, 
  User as UserIcon,
  Save,
  Zap,
  Moon,
  Hash,
  Lock,
  CheckCircle2,
  Ban,
  MapPin,
  Briefcase,
  Building2,
  ShieldAlert
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface UserManagementProps {
  onViewUser?: (user: User) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onViewUser }) => {
  const { users, deleteUser, currentUser, updateUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null
  });
  
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  const canManageUser = (targetUser: User) => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    if (isAdmin && targetUser.role === UserRole.SUPER_ADMIN) return false;
    return isAdmin;
  };

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    gender: '' as Gender | '',
    birthdate: '',
    division: '',
    district: '',
    work: '',
    organization: ''
  });

  const visibleUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const openModal = (user: User | null = null) => {
    if (user && !canManageUser(user)) return;
    if (user) {
      setEditingUser(user);
      setFormData({ ...user, username: user.username || '', gender: user.gender || '', birthdate: user.birthdate || '' } as any);
    } else {
      setEditingUser(null);
      setFormData({ 
        name: '', username: '', email: '', phoneNumber: '', password: '', 
        role: UserRole.STUDENT, status: UserStatus.ACTIVE, gender: '', 
        birthdate: '', division: '', district: '', work: '', organization: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser({ ...editingUser, ...formData } as User);
    } else {
      updateUser({ id: Math.random().toString(36).substr(2, 9), ...formData, joinedAt: new Date().toISOString() } as User);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => deleteModal.user && deleteUser(deleteModal.user.id)}
        title="Remove User Node"
        message="Permanently delete this identity from the global registry?"
        itemName={deleteModal.user?.name}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <UsersIcon size={24} className="text-indigo-600 shrink-0" /> Identity Hub
          </h3>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">Manage operational status of all platform nodes.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-lg w-full sm:w-auto">
          <UserPlus size={16} /> Provision Node
        </button>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" placeholder="Search identity..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-indigo-600 font-bold text-sm"
          />
        </div>
        <div className="relative">
          <select 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none font-black text-[10px] uppercase appearance-none"
          >
            <option value="ALL">All Status</option>
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.INACTIVE}>Inactive</option>
            <option value={UserStatus.BLOCKED}>Blocked</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 group transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 text-sm overflow-hidden border border-white shadow-sm shrink-0">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border border-slate-100 bg-slate-50 text-slate-600 whitespace-nowrap">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black uppercase ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {user.status === 'ACTIVE' ? <Zap size={10} /> : <Moon size={10} />}
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onViewUser?.(user)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-all"><UserIcon size={16}/></button>
                      {canManageUser(user) && (
                        <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-all"><Edit2 size={16}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
            <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
              <h3 className="font-black text-xl md:text-2xl uppercase tracking-widest">
                {editingUser ? 'Node Calibration' : 'Identity Provisioning'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-indigo-600 transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Handle</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-indigo-600 transition-all" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase() })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Email</label>
                  <input required type="email" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-indigo-600 transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Authority Role</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-[10px] uppercase outline-none" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}>
                    <option value={UserRole.STUDENT}>Candidate</option>
                    <option value={UserRole.AUTHOR}>Author</option>
                    <option value={UserRole.ADMIN}>Administrator</option>
                    {isSuperAdmin && <option value={UserRole.SUPER_ADMIN}>Super Admin</option>}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Identity Secret</label>
                <input required type="password" placeholder={editingUser ? "Retain current" : "Required"} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-indigo-600 transition-all" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black uppercase text-[10px] text-slate-400">Abort</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Deploy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};