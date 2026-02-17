import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { User, UserRole, UserStatus } from '../types';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  Users as UsersIcon, 
  ChevronDown,
  ShieldCheck,
  Mail,
  User as UserIcon,
  ShieldAlert,
  Save
} from 'lucide-react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface UserManagementProps {
  onViewUser?: (user: User) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onViewUser }) => {
  const { users, setUsers, deleteUser, currentUser, updateUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null
  });
  const [blockModal, setBlockModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null
  });
  
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE
  });

  const visibleUsers = useMemo(() => {
    return users.filter(user => {
      let isVisible = false;
      // Per instructions, Admins and Super Admins now have broad oversight
      if (isSuperAdmin || isAdmin) isVisible = true;
      
      if (!isVisible) return false;
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, isSuperAdmin, isAdmin, searchTerm, statusFilter]);

  const openModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        status: user.status 
      });
    } else {
      setEditingUser(null);
      setFormData({ 
        name: '', 
        email: '', 
        role: UserRole.STUDENT, 
        status: UserStatus.ACTIVE 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser({ ...editingUser, ...formData });
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

  const confirmBlock = () => {
    if (blockModal.user) {
      updateUser({ ...blockModal.user, status: UserStatus.BLOCKED });
    }
    setBlockModal({ isOpen: false, user: null });
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-xl border border-emerald-100">
            <div className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </div>
            Operational
          </div>
        );
      case UserStatus.INACTIVE:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-xl border border-slate-200">
            Hibernating
          </div>
        );
      case UserStatus.BLOCKED:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-xl border border-rose-700">
            Restricted
          </div>
        );
    }
  };

  // Define selectable roles based on user's request: Super Admins and Admins can assign all roles
  const availableRoles = useMemo(() => {
    if (isSuperAdmin || isAdmin) {
      return [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AUTHOR, UserRole.STUDENT];
    }
    return [UserRole.STUDENT];
  }, [isSuperAdmin, isAdmin]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => {
          if (deleteModal.user) deleteUser(deleteModal.user.id);
          setDeleteModal({ isOpen: false, user: null });
        }}
        title="Remove User Account"
        message="Are you sure you want to permanently delete this user? This cannot be undone."
        itemName={deleteModal.user?.name}
      />

      <DeleteConfirmationModal 
        isOpen={blockModal.isOpen}
        onClose={() => setBlockModal({ isOpen: false, user: null })}
        onConfirm={confirmBlock}
        title="Restrict User Access"
        message="This operation will immediately revoke this user's ability to log into the platform."
        itemName={blockModal.user?.name}
        confirmString="Block"
        variant="WARNING"
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <UsersIcon size={28} className="text-indigo-600 md:w-8 md:h-8" />
            Registry Management
          </h3>
          <p className="text-slate-500 text-sm md:text-base mt-1 font-medium">
            Administrative control of ecosystem identity nodes.
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
        >
          <UserPlus size={18} /> Provision User
        </button>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search identity..."
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-auto">
          <select 
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none font-black text-[9px] md:text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'ALL')}
          >
            <option value="ALL">All Status Nodes</option>
            <option value={UserStatus.ACTIVE}>Active Only</option>
            <option value={UserStatus.INACTIVE}>Inactive Only</option>
            <option value={UserStatus.BLOCKED}>Blocked Only</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                <th className="px-6 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 md:px-10 py-5">
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-base overflow-hidden border-2 border-white shadow-sm shrink-0">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} /> : user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm md:text-base text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${
                      user.role === UserRole.SUPER_ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      user.role === UserRole.AUTHOR ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-5">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 md:px-10 py-5 text-right">
                    <div className="flex justify-end gap-1.5 md:gap-2">
                      <button onClick={() => openModal(user)} className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit"><Edit2 size={16}/></button>
                      {user.id !== currentUser?.id && (
                        <button onClick={() => setDeleteModal({ isOpen: true, user })} className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors" title="Delete"><Trash2 size={16}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-black text-xl uppercase tracking-widest">
                  {editingUser ? 'Calibrate Identity' : 'Provision User'}
                </h3>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Protocol Architecture v2.5</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      required
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold"
                      value={formData.name}
                      placeholder="e.g. Alexander Pierce"
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">System Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      required
                      type="email"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold"
                      value={formData.email}
                      placeholder="identity@eduquest.com"
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Operational Role</label>
                    <div className="relative">
                      <select
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role.replace('_', ' ')}</option>
                        ))}
                      </select>
                      <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Operational Status</label>
                    <div className="relative">
                      <select
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as UserStatus })}
                      >
                        <option value={UserStatus.ACTIVE}>Active</option>
                        <option value={UserStatus.INACTIVE}>Inactive</option>
                        <option value={UserStatus.BLOCKED}>Restricted</option>
                      </select>
                      <ShieldAlert className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-800 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-2 px-12 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} />
                  {editingUser ? 'Update Protocol' : 'Finalize Identity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
