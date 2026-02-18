import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { UserRole, UserStatus } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Layers, 
  BookOpen, 
  LogOut,
  ShieldCheck,
  Award,
  User as UserIcon,
  Menu,
  FileBarChart2,
  PlusCircle,
  Trophy,
  AlertTriangle,
  Bell,
  Mail,
  Library,
  UserCheck,
  Scale,
  TrendingUp,
  X
} from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  badge?: number | string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const { currentUser, logout, settings, inquiries } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const isInactive = currentUser.status === UserStatus.INACTIVE;
  const newInquiriesCount = inquiries.filter(i => i.status === 'NEW').length;

  const menuItems: Record<UserRole, MenuItem[]> = {
    [UserRole.SUPER_ADMIN]: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Registry', icon: Users },
      { id: 'message', label: 'Messages', icon: Mail, badge: newInquiriesCount },
      { id: 'reports', label: 'System Analytics', icon: FileBarChart2 },
      { id: 'success-rates', label: 'Success Rates', icon: TrendingUp },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
      { id: 'registry', label: 'Exam Registry', icon: Library },
      { id: 'categories', label: 'Categories', icon: Layers },
      { id: 'exams', label: 'Exam Hub', icon: BookOpen },
      { id: 'questions', label: 'Moderation', icon: ShieldCheck },
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'my-exams', label: 'My Exams', icon: BookOpen },
      { id: 'my-questions', label: 'My Questions', icon: FileText },
      { id: 'settings', label: 'Site Settings', icon: Settings },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ],
    [UserRole.ADMIN]: [
      { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'Authors & Students', icon: Users },
      { id: 'message', label: 'Messages', icon: Mail, badge: newInquiriesCount },
      { id: 'reports', label: 'System Analytics', icon: FileBarChart2 },
      { id: 'success-rates', label: 'Success Rates', icon: TrendingUp },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
      { id: 'registry', label: 'Exam Registry', icon: Library },
      { id: 'categories', label: 'Category', icon: Layers },
      { id: 'exams', label: 'Exam Hub', icon: BookOpen },
      { id: 'questions', label: 'Moderation', icon: ShieldCheck },
      { id: 'my-questions', label: 'My Questions', icon: FileText },
      { id: 'settings', label: 'Site Settings', icon: Settings },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ],
    [UserRole.AUTHOR]: [
      { id: 'dashboard', label: 'My Stats', icon: LayoutDashboard },
      { id: 'registry', label: 'Exam Registry', icon: Library },
      { id: 'my-exams', label: 'My Exams', icon: BookOpen },
      { id: 'my-questions', label: 'My Questions', icon: FileText },
      { id: 'add-question', label: 'Add Question', icon: PlusCircle },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ],
    [UserRole.STUDENT]: [
      { id: 'dashboard', label: 'Candidate Portal', icon: UserCheck },
      { id: 'registry', label: 'Exam Registry', icon: Library },
      { id: 'my-results', label: 'My Results', icon: Award },
      { id: 'success-rates', label: 'Success Rates', icon: TrendingUp },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
      { id: 'gdpr', label: 'GDPR Audit', icon: Scale },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ]
  };

  const currentMenuItems = menuItems[currentUser.role] || [];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between no-print">
        <div className="flex items-center gap-3 text-indigo-600">
          <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-xl tracking-tight text-slate-800">{settings.siteName}</span>}
        </div>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-10 no-print">
        {currentMenuItems.map((item, idx) => {
          const isSuperAdminOrAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ADMIN;
          const showSeparator = isSuperAdminOrAdmin && (idx === 6 || idx === 11 || idx === 13);
          const separatorLabel = idx === 6 ? 'Academic' : idx === 11 ? 'Authoring' : 'System';

          return (
            <React.Fragment key={item.id}>
              {showSeparator && (isSidebarOpen || isMobileMenuOpen) && (
                <div className="pt-6 pb-2 px-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{separatorLabel}</span>
                </div>
              )}
              <button
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors
                  ${activeView === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                </div>
                {item.badge && (isSidebarOpen || isMobileMenuOpen) ? (
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center">{item.badge}</span>
                ) : null}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 no-print">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed h-full z-40 bg-white border-r border-slate-200 transition-all duration-300 no-print ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden no-print" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 z-[110] w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 lg:hidden no-print ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 no-print">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-slate-500"><Menu size={20} /></button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-slate-500"><Menu size={20} /></button>
            <h2 className="text-sm md:text-lg font-bold text-slate-800 truncate">
              {currentMenuItems.find(m => m.id === activeView)?.label || settings.siteName}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-xs font-black text-slate-800">{currentUser.name}</span>
                   <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{currentUser.role.replace('_', ' ')}</span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black border-2 border-white shadow-sm overflow-hidden">
                  {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        {isInactive && (
          <div className="bg-amber-50 border-b border-amber-100 px-4 md:px-8 py-3 flex items-center gap-3 no-print">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            <p className="text-[10px] md:text-xs font-black text-amber-800 uppercase tracking-widest leading-none">
              Account Inactive. Restricted access mode.
            </p>
          </div>
        )}

        <div className="p-4 md:p-8 flex-1 w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </div>
        
        <div className="px-4 md:px-8">
          <Footer variant="COMPACT" onViewChange={setActiveView} />
        </div>
      </main>
    </div>
  );
};

export default Layout;