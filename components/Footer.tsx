import React from 'react';
import { useApp } from '../AppContext';
import { 
  Mail, 
  Phone, 
  Globe, 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook, 
  Instagram, 
  Youtube, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface FooterProps {
  variant?: 'FULL' | 'COMPACT';
  onPolicyClick?: (policy: string) => void;
  onPortalClick?: () => void;
  onViewChange?: (view: string) => void;
}

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

const Footer: React.FC<FooterProps> = ({ variant = 'FULL', onPolicyClick, onPortalClick, onViewChange }) => {
  const { settings } = useApp();

  const handleLinkClick = (e: React.MouseEvent, url: string, label: string) => {
    // Priority 1: Auth portal trigger
    if (url === '/auth' && onPortalClick) {
      e.preventDefault();
      onPortalClick();
      return;
    }

    // Priority 2: Static policy modals (for landing page)
    if (url === '#' && onPolicyClick) {
      e.preventDefault();
      onPolicyClick(label);
      return;
    }

    // Priority 3: Internal view routing (for logged-in users)
    if (onViewChange) {
      const labelMap: Record<string, string> = {
        'Privacy Policy': 'privacy',
        'Terms of Service': 'terms',
        'GDPR Audit': 'gdpr',
        'Exam Registry': 'registry',
        'Candidate Portal': 'dashboard',
        'Success Rates': 'success-rates'
      };
      
      if (labelMap[label]) {
        e.preventDefault();
        onViewChange(labelMap[label]);
        // Scroll to top on view change
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
  };

  if (variant === 'COMPACT') {
    return (
      <footer className="mt-auto pt-10 pb-6 border-t border-slate-100 w-full no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
               <ShieldCheck size={18} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 © {new Date().getFullYear()} {settings.siteName} Core Protocol.
               </p>
               <div className="flex gap-4 mt-1">
                 <button onClick={(e) => handleLinkClick(e as any, '#', 'Privacy Policy')} className="text-[8px] font-black text-slate-300 hover:text-indigo-600 uppercase tracking-widest">Privacy</button>
                 <button onClick={(e) => handleLinkClick(e as any, '#', 'Terms of Service')} className="text-[8px] font-black text-slate-300 hover:text-indigo-600 uppercase tracking-widest">Terms</button>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-6">
            {settings.socialLinks.map(link => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <SocialIcon platform={link.platform} size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 overflow-hidden relative no-print">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/30 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20">
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center gap-3">
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl shadow-lg" />
              <span className="font-black text-2xl tracking-tighter text-slate-900">{settings.siteName}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {settings.footerDescription}
            </p>
            <div className="flex items-center gap-4 pt-4">
              {settings.socialLinks.map(link => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>

          {settings.footerSections.map(section => (
            <div key={section.id} className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map(link => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      onClick={(e) => handleLinkClick(e, link.url, link.label)}
                      className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Direct Connectivity</h4>
            <div className="space-y-4">
              <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Uplink</p>
                  <p className="text-xs font-black text-slate-800 break-all">{settings.contactEmail}</p>
                </div>
              </a>
              <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hotline Node</p>
                  <p className="text-xs font-black text-slate-800">{settings.contactPhone}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Infrastructure v2.9.1 Operational</span>
           </div>
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center md:text-right leading-loose">
             © {new Date().getFullYear()} {settings.siteName} Online Examination Framework. All intellectual property nodes reserved.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;