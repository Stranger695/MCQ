
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { UserRole, UserStatus, User } from '../types';
import { ArrowLeft, Ban } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    
    if (user) {
      if (user.status === UserStatus.BLOCKED) {
        setError('Your account has been blocked by an administrator.');
        return;
      }
      if (user.status === UserStatus.INACTIVE) {
        setError('Your account is currently inactive. Please contact support.');
        return;
      }
      setCurrentUser(user);
    } else {
      setError('Invalid credentials. Note: Ensure you have registered or used demo accounts.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return setError('Please fill all fields');
    if (users.find(u => u.email === email)) return setError('Email already exists');

    setIsProcessing(true);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      joinedAt: new Date().toISOString()
    };

    try {
      // Persist to Supabase 'profiles' table
      const { error: dbError } = await supabase.from('profiles').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        joined_at: newUser.joinedAt
      });

      if (dbError) throw dbError;

      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.code === 'PGRST205') {
        setError('Database schema not initialized. Please run the SQL setup script.');
      } else {
        setError(`System persistence error: ${err.message || 'Check Supabase logs'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">
        <button 
          onClick={onGoBack}
          className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="p-8 pt-12 text-center border-b border-slate-100 bg-indigo-600 text-white">
          <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 mx-auto mb-4 bg-white p-2 rounded-xl" />
          <h1 className="text-2xl font-bold">{settings.siteName}</h1>
          <p className="text-indigo-100 mt-2 text-xs font-black uppercase tracking-widest">Supabase Cloud Sync Active</p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 border border-red-100">
              <Ban size={16} />
              {error}
            </div>
          )}
          
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Full Name</label>
              <input
                disabled={isProcessing}
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Email Address</label>
            <input
              disabled={isProcessing}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@academic.edu"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Access Token (Password)</label>
            <input
              disabled={isProcessing}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={isProcessing}
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? 'Syncing...' : (isLogin ? 'Sign In' : 'Create Identity')}
          </button>

          <div className="text-center mt-6">
            <button
              disabled={isProcessing}
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:underline disabled:opacity-50"
            >
              {isLogin ? "Join the Registry" : 'Return to Portal'}
            </button>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <p className="text-[10px] text-slate-400 text-center uppercase font-black tracking-widest mb-3">Instant Login (Dev Access)</p>
           <div className="grid grid-cols-2 gap-2">
             <button disabled={isProcessing} onClick={() => {setEmail('super@eduquest.com'); setPassword('123');}} className="text-[9px] font-black uppercase bg-white border border-slate-200 py-2 rounded hover:bg-slate-100 transition-colors">Super Admin</button>
             <button disabled={isProcessing} onClick={() => {setEmail('admin@eduquest.com'); setPassword('123');}} className="text-[9px] font-black uppercase bg-white border border-slate-200 py-2 rounded hover:bg-slate-100 transition-colors">Admin</button>
             <button disabled={isProcessing} onClick={() => {setEmail('author@eduquest.com'); setPassword('123');}} className="text-[9px] font-black uppercase bg-white border border-slate-200 py-2 rounded hover:bg-slate-100 transition-colors">Author</button>
             <button disabled={isProcessing} onClick={() => {setEmail('student@eduquest.com'); setPassword('123');}} className="text-[9px] font-black uppercase bg-white border border-slate-200 py-2 rounded hover:bg-slate-100 transition-colors">Student</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
