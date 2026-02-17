import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../AppContext';
import { User, UserStatus } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Save, 
  Camera, 
  Lock, 
  AtSign, 
  Hash, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Upload,
  RefreshCw
} from 'lucide-react';

export const ProfileSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentUser, updateUser } = useApp();
  if (!currentUser) return null;

  const [formData, setFormData] = useState<User>({ ...currentUser });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'SUCCESS' | 'ERROR' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Strength Logic
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (passwordStrength) {
      case 0: return { text: 'Identity Threshold Not Met', color: 'bg-slate-200' };
      case 1: return { text: 'Weak Protocol', color: 'bg-rose-500' };
      case 2: return { text: 'Fair Security', color: 'bg-amber-500' };
      case 3: return { text: 'Strong Credentials', color: 'bg-blue-500' };
      case 4: return { text: 'Excellent Operational Shield', color: 'bg-emerald-500' };
      default: return { text: 'Analyzing...', color: 'bg-slate-200' };
    }
  }, [passwordStrength]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Media Overflow: File size exceeds 2MB threshold.', type: 'ERROR' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage(null);

    try {
      const updatedUser: User = { ...formData };
      
      if (password) {
        if (password !== confirmPassword) {
          throw new Error("Credential mismatch: Passwords do not align.");
        }
        if (passwordStrength < 4) {
          throw new Error("Security failure: Complexity requirement not satisfied.");
        }
        updatedUser.password = password;
      }

      await updateUser(updatedUser);
      setMessage({ text: 'Profile synchronization complete. Registry updated.', type: 'SUCCESS' });
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Synchronization failed.', type: 'ERROR' });
    } finally {
      setIsProcessing(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
      {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {text}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Profile Settings</h2>
          <p className="text-slate-500 text-sm md:text-base mt-2 font-medium">Manage your academic identity and security parameters.</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full md:w-auto px-6 py-3 bg-white border border-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
        >
          Discard Changes
        </button>
      </div>

      {message && (
        <div className={`p-6 rounded-[1.5rem] border ${message.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'} flex items-center gap-4 animate-in slide-in-from-top-2`}>
          {message.type === 'SUCCESS' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm text-center">
            <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto mb-8 group">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl flex items-center justify-center relative">
                {formData.avatar ? (
                  <img src={formData.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Profile" />
                ) : (
                  <UserIcon className="w-20 h-20 text-slate-200" />
                )}
                {/* Hover Overlay */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <RefreshCw size={32} className="text-white animate-spin-slow" />
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-90"
                title="Update Photo"
              >
                <Camera size={20} />
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo Identity Uplink</h4>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                <Upload size={16} /> Choose Media File
              </button>
              <p className="text-[8px] font-bold text-slate-400 uppercase">Max File Weight: 2.0 MB</p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 relative z-10">Registry Status</p>
             <div className="flex items-center gap-3 relative z-10">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="font-black text-lg uppercase tracking-tight">{formData.status} Identity</span>
             </div>
             <p className="text-[9px] text-white/40 mt-6 font-bold uppercase tracking-widest relative z-10">Provisioned on {new Date(formData.joinedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Right Column: Identity, Contact, and Security Forms */}
        <div className="lg:col-span-2 space-y-10">
          {/* Identity Section */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
              <UserIcon size={20} className="text-indigo-600" /> Identity Node
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Full Legal Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    required 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">System Username</label>
                <div className="relative group">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    required 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black" 
                    value={formData.username || ''} 
                    onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase() })} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
              <AtSign size={20} className="text-indigo-600" /> Comms Registry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Verified Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    required 
                    type="email"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Phone Uplink</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    required 
                    type="tel"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black" 
                    value={formData.phoneNumber || ''} 
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
              <Lock size={20} className="text-rose-500" /> Security Protocol
            </h3>
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-6 flex items-start gap-4">
               <AlertCircle size={20} className="text-slate-400 shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">Update your session credential. Leave blank if the current authorization remains valid.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">New Access Credential</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="password"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Verify New Credential</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="password"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 transition-all font-black outline-none ${confirmPassword && (password === confirmPassword ? 'border-emerald-200 bg-emerald-50 focus:bg-white' : 'border-rose-200 bg-rose-50 focus:bg-white')}`} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Strength Assessment</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${passwordStrength === 0 ? 'text-slate-400' : 'text-slate-800'}`}>{strengthLabel.text}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step} 
                      className={`h-full flex-1 transition-all duration-500 ${passwordStrength >= step ? strengthLabel.color : 'bg-transparent'}`} 
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <RequirementItem met={password.length >= 6} text="6+ Characters" />
                  <RequirementItem met={/[A-Z]/.test(password)} text="Uppercase" />
                  <RequirementItem met={/[a-z]/.test(password)} text="Lowercase" />
                  <RequirementItem met={/[^A-Za-z0-9]/.test(password)} text="Symbol" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-6">
             <button 
               type="submit" 
               disabled={isProcessing}
               className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3"
             >
               {isProcessing ? 'Syncing...' : <><Save size={20} /> Deploy Configuration</>}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};