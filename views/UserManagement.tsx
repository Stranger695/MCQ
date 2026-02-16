
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { User, UserRole, UserStatus } from '../types';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Mail, 
  User as UserIcon, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  PauseCircle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Users as UsersIcon, 
  ChevronDown,
  Activity,
  UserX
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export const UserManagement: React.FC = () => {
  const { users, setUsers, deleteUser, currentUser, updateUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false,
    userId: '',
    userName: ''
  });
  
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE
  });

  const visibleUsers = users.filter(user => {
    let isVisible = false;
    if (isSuperAdmin) isVisible = true;
    else if (isAdmin) {
      isVisible = user.role === UserRole.AUTHOR || user.role === UserRole.STUDENT;
    }

    if (!isVisible) return false;

    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: UserRole.STUDENT, status: UserStatus.ACTIVE });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUser = { ...editingUser, ...formData };
      updateUser(updatedUser);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        joinedAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleStatusUpdate = (user: User, newStatus: UserStatus) => {
    if (user.id === currentUser?.id) return;
    updateUser({ ...user, status: newStatus });
  };

  const initiateDelete = (user: User) => {
    setDeleteModal({
      isOpen: true,
      userId: user.id,
      userName: user.name
    });
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl border border-emerald-100 shadow-sm animate-in fade-in zoom-in-95">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            Operational
          </div>
        );
      case UserStatus.INACTIVE:
        return (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95">
            <PauseCircle size={14} className="text-slate-400" />
            Hibernating
          </div>
        );
      case UserStatus.BLOCKED:
        return (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-600 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl border border-rose-700 shadow-lg shadow-rose-100 animate-in fade-in zoom-in-95">
            <UserX size={14} className="text-white" />
            Restricted
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => deleteUser(deleteModal.userId)}
        title="Remove User Account"
        message="Are you sure you want to permanently delete this user? All their associated records and access will be revoked immediately."
        itemName={deleteModal.userName}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <UsersIcon size={32} className="text-indigo-600" />
            {isAdmin ? 'Candidate Registry' : 'Master User Directory'}
          </h3>
          <p className="text-slate-500 text-base mt-2 font-medium">
            {isAdmin ? 'Administrative jurisdiction over creators and examinees.' : 'Global control of all ecosystem identity nodes.'}
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 shrink-0"
        >
          <UserPlus size={20} /> Deploy New User
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by identity label or email..."
            className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm border border-slate-100"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="relative min-w-[200px] w-full md:w-auto">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
          <select 
            className="w-full pl-14 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'ALL')}
          >
            <option value="ALL">All Status Nodes</option>
            <option value={UserStatus.ACTIVE}>Active Only</option>
            <option value={UserStatus.INACTIVE}>Inactive Only</option>
            <option value={UserStatus.BLOCKED}>Blocked Only</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
        <div className="hidden md:flex flex-col items-center justify-center px-4 border-l border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched</span>
          <span className="text-xl font-black text-indigo-600">{visibleUsers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Validated Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition-all group border-l-4 ${
                  user.status === UserStatus.BLOCKED ? 'border-l-rose-500 bg-rose-50/30' : 
                  user.status === UserStatus.ACTIVE ? 'hover:border-l-indigo-500 border-l-transparent' : 'border-l-transparent'
                }`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform ${user.status === UserStatus.BLOCKED ? 'grayscale' : ''}`}>
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-black text-base ${user.status === UserStatus.BLOCKED ? 'text-rose-900' : 'text-slate-800'}`}>{user.name}</p>
                        <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border-2 ${
                      user.role === UserRole.SUPER_ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-[0_0_10px_rgba(147,51,234,0.1)]' :
                      user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_0_10_rgba(79,70,229,0.1)]' :
                      user.role === UserRole.AUTHOR ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_0_10_rgba(245,158,11,0.1)]' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{new Date(user.joinedAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      {user.id !== currentUser?.id && (
                        <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                          <button 
                            onClick={() => handleStatusUpdate(user, UserStatus.ACTIVE)}
                            className={`p-2 rounded-lg transition-all ${user.status === UserStatus.ACTIVE ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300 hover:text-emerald-500'}`}
                            title="Activate Node"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(user, UserStatus.INACTIVE)}
                            className={`p-2 rounded-lg transition-all ${user.status === UserStatus.INACTIVE ? 'bg-slate-500 text-white shadow-md' : 'text-slate-300 hover:text-slate-600'}`}
                            title="Deactivate Node"
                          >
                            <PauseCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(user, UserStatus.BLOCKED)}
                            className={`p-2 rounded-lg transition-all ${user.status === UserStatus.BLOCKED ? 'bg-rose-600 text-white shadow-md' : 'text-slate-300 hover:text-rose-600'}`}
                            title="Restrict Access"
                          >
                            <Ban size={18} />
                          </button>
                        </div>
                      )}
                      <button 
                        onClick={() => openModal(user)}
                        className="p-3 text-slate-400 bg-white border border-slate-200 rounded-xl hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all ml-1"
                        title="Modify Profile"
                      >
                        <Edit2 size={18} />
                      </button>
                      {user.id !== currentUser?.id && (
                        <button 
                          onClick={() => initiateDelete(user)}
                          className="p-3 text-slate-400 bg-white border border-slate-200 rounded-xl hover:text-rose-600 hover:border-rose-300 hover:shadow-md transition-all"
                          title="Purge Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-slate-300">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                      <ShieldAlert size={48} className="opacity-20" />
                    </div>
                    <p className="font-black uppercase tracking-[0.3em] text-[10px]">No identity nodes found matching current filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <h3 className="font-black text-2xl tracking-tight relative z-10">{editingUser ? 'Sync Identity Profile' : 'Provision User Access'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors relative z-10"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-2">Legal Identity Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      required
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Johnathan Q. Public"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-2">Primary Email Hub</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      required
                      type="email"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="address@academic.edu"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-2">System Role</label>
                    <div className="relative">
                      <select
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                      >
                        {isSuperAdmin ? (
                          Object.values(UserRole).map(role => (
                            <option key={role} value={role}>{role.replace('_', ' ')}</option>
                          ))
                        ) : (
                          <>
                            <option value={UserRole.AUTHOR}>AUTHOR</option>
                            <option value={UserRole.STUDENT}>STUDENT</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-2">Node Status</label>
                    <div className="relative">
                      <select
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as UserStatus })}
                      >
                        {Object.values(UserStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 font-black uppercase tracking-[0.3em] text-[10px] text-slate-400 hover:text-slate-800 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <ShieldCheck size={18} />
                  {editingUser ? 'Update Node' : 'Commit Provision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
