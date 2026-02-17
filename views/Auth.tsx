import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { UserRole, UserStatus, User } from '../types';
import { 
  ArrowLeft, 
  Ban, 
  ShieldCheck, 
  Key, 
  User as UserIcon, 
  Phone, 
  AtSign, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Hash
} from 'lucide-react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Initialize Supabase Client
const supabaseUrl = 'https://bvjzuwulwdqubzifpeyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2anp1d3Vsd2RxdWJ6aWZwZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzc1NDgsImV4cCI6MjA4NjcxMzU0OH0.rivYIgGP4C9B4aDY9jeHizHgfS_8EiwbBkZZGVUqJ50';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthProps {
  onGoBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onGoBack }) => {
  const { users, setCurrentUser, setUsers, settings } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      if (password !== '123' && !isLogin) { // Only check '123' for demo users
        setError('Invalid credentials.');
        return;
      }

      if (user.status === UserStatus.BLOCKED) {
        setError('Session blocked by central authority.');
        return;
      }
      setCurrentUser(user);
    } else {
      setError('Identity not recognized in active registry.');
    }
  };

  const validateRegistration = () => {
    if (!name || !email || !password || !username || !phoneNumber || !confirmPassword) {
      return 'All identification nodes must be populated.';
    }
    if (password !== confirmPassword) {
      return 'Credential mismatch: Passwords do not align.';
    }
    if (passwordStrength < 4) {
      return 'Security protocol failure: Password complexity requirements not satisfied.';
    }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return 'Email node already mapped to an existing identity.';
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateRegistration();
    if (validationError) return setError(validationError);

    setIsProcessing(true);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phoneNumber,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      joinedAt: new Date().toISOString()
    };

    try {
      const { error: dbError } = await supabase.from('profiles').insert({
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phoneNumber,
        role: newUser.role,
        status: newUser.status,
        joined_at: newUser.joinedAt
      });

      if (dbError) throw dbError;

      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(`Persistence error: ${err.message || 'Node synchronization failed.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
      {met ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
      {text}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-50 relative overflow-hidden py-10 md:py-20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full -mr-48 -mt-48 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full -ml-48 -mb-48 opacity-50 blur-3xl"></div>

      <div className={`bg-white w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'} rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-100 animate-in zoom-in-95 duration-500`}>
        <button 
          onClick={onGoBack}
          className="absolute top-4 md:top-6 left-4 md:left-6 p-2.5 md:p-3 bg-white/20 hover:bg-white/40 text-white rounded-xl md:rounded-2xl transition-all z-20 backdrop-blur-md border border-white/20"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="p-8 md:p-10 pt-12 md:pt-16 text-center border-b border-slate-100 bg-slate-900 text-white relative">
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16"></div>
          <img src={settings.logoUrl} alt="Logo" className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-white p-2 rounded-xl md:rounded-2xl shadow-2xl relative z-10" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight relative z-10">{settings.siteName}</h1>
          <p className="text-slate-400 mt-2 md:mt-3 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] relative z-10 opacity-80">Security Authorization Protocol</p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="p-6 md:p-12 space-y-5 md:space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-rose-100 animate-in slide-in-from-top-2">
              <Ban size={16} />
              <span className="flex-1">{error}</span>
            </div>
          )}
          
          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Legal Identity</label>
                <div className="relative group">
                   <UserIcon className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={14} />
                   <input
                     required
                     disabled={isProcessing}
                     type="text"
                     className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50 text-sm"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Full Name"
                   />
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Username</label>
                <div className="relative group">
                   <Hash className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={14} />
                   <input
                     required
                     disabled={isProcessing}
                     type="text"
                     className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50 text-sm"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     placeholder="handle"
                   />
                </div>
              </div>
            </div>
          )}

          <div className={`${!isLogin ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6' : 'space-y-5 md:space-y-6'}`}>
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Academic Email</label>
              <div className="relative group">
                 <AtSign className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={14} />
                 <input
                   required
                   disabled={isProcessing}
                   type="email"
                   className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50 text-sm"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="identity@eduquest.com"
                 />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Phone</label>
                <div className="relative group">
                   <Phone className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={14} />
                   <input
                     required
                     disabled={isProcessing}
                     type="tel"
                     className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50 text-sm"
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     placeholder="+1 (555) 000-0000"
                   />
                </div>
              </div>
            )}
          </div>

          <div className={`${!isLogin ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6' : 'space-y-5 md:space-y-6'}`}>
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Access Credential</label>
              <div className="relative group">
                 <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={14} />
                 <input
                   required
                   disabled={isProcessing}
                   type="password"
                   className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50 text-sm"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                 />
              </div>
              {!isLogin && (
                <div className="px-2 space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Strength</span>
                    <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${strengthLabel.text.includes('Threshold') ? 'text-slate-400' : 'text-slate-800'}`}>{strengthLabel.text}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3, 4].map(step => (
                      <div 
                        key={step} 
                        className={`h-full flex-1 transition-all duration-500 ${passwordStrength >= step ? strengthLabel.color : 'bg-transparent'}`} 
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                    <RequirementItem met={password.length >= 6} text="6+ Chars" />
                    <RequirementItem met={/[A-Z]/.test(password)} text="Uppercase" />
                    <RequirementItem met={/[a-z]/.test(password)} text="Lowercase" />
                    <RequirementItem met={/[^A-Za-z0-9]/.test(password)} text="Symbol" />
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Verify</label>
                <div className="relative group">
                   <ShieldCheck className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={14} />
                   <input
                     required
                     disabled={isProcessing}
                     type="password"
                     className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 bg-slate-50 focus:bg-white focus:ring-4 md:focus:ring-8 outline-none transition-all font-bold disabled:opacity-50 text-sm ${confirmPassword && (password === confirmPassword ? 'border-emerald-100 focus:border-emerald-500 focus:ring-emerald-50' : 'border-rose-100 focus:border-rose-500 focus:ring-rose-50')}`}
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="Verify Password"
                   />
                </div>
                {confirmPassword && (
                  <p className={`px-2 text-[7px] md:text-[8px] font-black uppercase tracking-widest mt-1 ${password === confirmPassword ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {password === confirmPassword ? 'Registry Aligned' : 'Drift Detected'}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            disabled={isProcessing}
            type="submit"
            className="w-full py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-700 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isProcessing ? 'Syncing...' : (isLogin ? <><ShieldCheck size={16} /> Authorize</> : 'Finalize Identity')}
          </button>

          <div className="text-center mt-6 md:mt-8">
            <button
              disabled={isProcessing}
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-indigo-600 font-black uppercase tracking-widest text-[8px] md:text-[10px] hover:underline disabled:opacity-50"
            >
              {isLogin ? "Provision New Identity" : 'Return to Login'}
            </button>
          </div>
        </form>

        {isLogin && (
          <div className="p-6 md:p-10 bg-slate-50 border-t border-slate-100">
             <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="h-px flex-1 bg-slate-200"></span>
                <p className="text-[7px] md:text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">Quick Access</p>
                <span className="h-px flex-1 bg-slate-200"></span>
             </div>
             <div className="grid grid-cols-2 gap-2 md:gap-3">
               {[
                 { e: 'super@eduquest.com', l: 'Super' },
                 { e: 'admin@eduquest.com', l: 'Admin' },
                 { e: 'author@eduquest.com', l: 'Author' },
                 { e: 'student@eduquest.com', l: 'Student' }
               ].map(btn => (
                 <button 
                   key={btn.e}
                   disabled={isProcessing} 
                   onClick={() => { setEmail(btn.e); setPassword('123'); }} 
                   className={`text-[8px] md:text-[9px] font-black uppercase bg-white border border-slate-200 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm ${email === btn.e ? 'border-indigo-500 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100' : ''}`}
                 >
                   {btn.l}
                 </button>
               ))}
             </div>
             <p className="text-center text-[7px] md:text-[8px] font-black text-slate-300 uppercase mt-4 md:mt-6 tracking-widest">Master Key: 123 (Simulated)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;