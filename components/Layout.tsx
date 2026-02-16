
import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';

const SocialIcon = ({ platform, size = 18 }: { platform: string, size?: number }) => {
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
  const { currentUser, logout, settings } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const menuItems = {
    [UserRole.SUPER_ADMIN]: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'questions', label: 'Question Moderation', icon: CheckCircle },
      { id: 'settings', label: 'Site Settings', icon: Settings },
      { id: 'profile', label: 'My Profile', icon: UserIcon },
    ],
    [UserRole.ADMIN]: [
      { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'Authors & Students', icon: Users },
      { id: 'categories', label: 'Categories', icon: Layers },
      { id: 'exams', label: 'Exam Management', icon: BookOpen },
      { id: 'questions', label: 'Review Questions', icon: CheckCircle },
      { id: 'certificates', label: 'Manage Certificates', icon: Award },
      { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart2 },
      { id: 'profile', label: 'My Profile', icon: UserIcon },
    ],
    [UserRole.AUTHOR]: [
      { id: 'dashboard', label: 'My Stats', icon: LayoutDashboard },
      { id: 'my-questions', label: 'My Questions', icon: FileText },
      { id: 'add-question', label: 'Add Question', icon: BookOpen },
      { id: 'profile', label: 'My Profile', icon: UserIcon },
    ],
    [UserRole.STUDENT]: [
      { id: 'dashboard', label: 'Available Exams', icon: BookOpen },
      { id: 'my-results', label: 'My Results', icon: Award },
      { id: 'profile', label: 'My Profile', icon: UserIcon },
    ]
  };

  const currentMenuItems = menuItems[currentUser.role] || [];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
        {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-xl tracking-tight text-slate-800">{settings.siteName}</span>}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {currentMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <item.icon size={20} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed h-full z-40 bg-white border-r border-slate-200 transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-[70] w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 hover:bg-slate-100 rounded-md transition-colors lg:hidden"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="hidden lg:block p-2 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <h2 className="text-sm md:text-lg font-semibold text-slate-800 truncate max-w-[150px] md:max-w-none">
              {currentMenuItems.find(m => m.id === activeView)?.label || 'Sector'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-sm font-semibold text-slate-800">{currentUser.name}</span>
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{currentUser.role.replace('_', ' ')}</span>
             </div>
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm overflow-hidden">
               {currentUser.avatar ? (
                 <img src={currentUser.avatar} alt="User Avatar" className="w-full h-full object-cover" />
               ) : (
                 currentUser.name.charAt(0)
               )}
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>

        {/* Dynamic Global Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto no-print">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-10">
              <div className="col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 rounded" />
                  <span className="font-bold text-lg tracking-tight text-slate-800">{settings.siteName}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium max-w-xs">
                  {settings.footerDescription}
                </p>
              </div>

              {/* Dynamic Sections */}
              {settings.footerSections.map(section => (
                <div key={section.id} className="hidden sm:block">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{section.title}</h4>
                  <ul className="space-y-4 text-xs font-bold text-slate-600">
                    {section.links.map(link => (
                      <li key={link.id}>
                        <a href={link.url} className="hover:text-indigo-600 transition-colors">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Connect</h4>
                <div className="flex items-center gap-4">
                  {settings.socialLinks.map((social) => (
                    <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">
                © {new Date().getFullYear()} {settings.siteName}. All Academic Rights Reserved.
              </p>
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Build v2.5.4
                </span>
                <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
