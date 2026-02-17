import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Layers, 
  BookOpen, 
  LogOut,
  CheckCircle,
  Award,
  User as UserIcon,
  Menu,
  X,
  FileBarChart2,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Shield,
  Globe,
  ClipboardList,
  Bell,
  Clock,
  PlusCircle
} from 'lucide-react';

const SocialIcon = ({ platform, size = 18 }: { platform: string; size?: number }) => {
  switch (platform) {
    case 'Twitter': return <Twitter size={size} />;
    case 'LinkedIn': return <Linkedin size={size} />;
    case 'GitHub': return <Github size={size} />;
    case 'Facebook': return <Facebook size={size} />;
    case 'Instagram': return <Instagram size={size} />;
    case 'YouTube': return <Youtube size={size} />;
    default: return <Globe size={size} />;
  }
};

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const { currentUser, logout, settings, notifications, markNotificationRead } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return <>{children}</>;

  const menuItems = {
    [UserRole.SUPER_ADMIN]: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Registry', icon: Users },
      { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart2 },
      { id: 'categories', label: 'Categories', icon: Layers },
      { id: 'exams', label: 'Exam Hub', icon: BookOpen },
      { id: 'questions', label: 'Question Moderation', icon: CheckCircle },
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'my-exams', label: 'My Exams', icon: ClipboardList },
      { id: 'my-questions', label: 'My Questions', icon: FileText },
      { id: 'add-question', label: 'Add Question', icon: PlusCircle },
      { id: 'settings', label: 'Site Settings', icon: Settings },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ],
    [UserRole.ADMIN]: [
      { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'Authors & Students', icon: Users },
      { id: 'categories', label: 'Categories', icon: Layers },
      { id: 'exams', label: 'Exam Management', icon: BookOpen },
      { id: 'questions', label: 'Review Questions', icon: CheckCircle },
      { id: 'certificates', label: 'Manage Certificates', icon: Award },
      { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart2 },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ],
    [UserRole.AUTHOR]: [
      { id: 'dashboard', label: 'My Stats', icon: LayoutDashboard },
      { id: 'my-exams', label: 'My Exams', icon: ClipboardList },
      { id: 'my-questions', label: 'My Questions', icon: FileText },
      { id: 'add-question', label: 'Add Question', icon: BookOpen },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ],
    [UserRole.STUDENT]: [
      { id: 'dashboard', label: 'Available Exams', icon: BookOpen },
      { id: 'my-results', label: 'My Results', icon: Award },
      { id: 'profile', label: 'My Profile', icon: UserIcon }
    ]
  };

  const currentMenuItems = menuItems[currentUser.role] || [];
  const myNotifs = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = myNotifs.filter(n => !n.isRead).length;

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 md:p-6 flex items-center gap-3">
        <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
        {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-lg md:text-xl tracking-tight text-slate-800">{settings.siteName}</span>}
      </div>

      <nav className="flex-1 px-3 md:px-4 space-y-1 overflow-y-auto custom-scrollbar pb-10">
        {currentMenuItems.map((item, idx) => {
          const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
          const showSeparator = isSuperAdmin && (idx === 3 || idx === 7 || idx === 10);
          const separatorLabel = idx === 3 ? 'Governance' : idx === 7 ? 'Authoring' : 'System';

          return (
            <React.Fragment key={item.id}>
              {showSeparator && (isSidebarOpen || isMobileMenuOpen) && (
                <div className="pt-5 pb-1.5 px-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{separatorLabel}</span>
                </div>
              )}
              <button
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${activeView === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={18} />
                {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-xs md:text-sm">{item.label}</span>}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-xs md:text-sm">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`hidden lg:flex flex-col fixed h-full z-40 bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-[70] w-72 max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-1.5 md:gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-slate-500"><Menu size={20} /></button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-slate-500"><Menu size={20} /></button>
            <h2 className="text-xs md:text-lg font-semibold text-slate-800 truncate max-w-[120px] md:max-w-none">
              {currentMenuItems.find(m => m.id === activeView)?.label || 'Sector'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
             {currentUser.role === UserRole.STUDENT && (
               <div className="relative" ref={notifRef}>
                 <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 md:p-2.5 bg-slate-50 text-slate-500 rounded-xl relative">
                   <Bell size={18} />
                   {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[8px] md:text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">{unreadCount}</span>}
                 </button>
                 {isNotifOpen && (
                   <div className="absolute right-0 mt-3 w-[85vw] md:w-96 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                     <div className="p-4 md:p-5 bg-indigo-600 text-white flex justify-between items-center"><h4 className="font-black text-[10px] uppercase">Notifications</h4></div>
                     <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
                        {myNotifs.length > 0 ? myNotifs.map(notif => (
                          <div key={notif.id} onClick={() => !notif.isRead && markNotificationRead(notif.id)} className={`p-4 md:p-5 border-b border-slate-50 cursor-pointer ${notif.isRead ? 'bg-white opacity-60' : 'bg-indigo-50/30'}`}>
                            <p className="text-xs md:text-sm font-black mb-1">{notif.title}</p>
                            <p className="text-[10px] md:text-xs text-slate-500">{notif.message}</p>
                          </div>
                        )) : <div className="p-10 text-center text-slate-300"><p className="text-[10px] font-black uppercase">No Alerts</p></div>}
                     </div>
                   </div>
                 )}
               </div>
             )}
             <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-xs font-black text-slate-800">{currentUser.name}</span>
                   <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{currentUser.role.replace('_', ' ')}</span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black border-2 border-white shadow-sm overflow-hidden text-sm">
                  {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <div className="p-3 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;