import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { SocialLink } from '../types';
import { 
  Globe, 
  Save, 
  Mail, 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook, 
  Instagram, 
  Youtube, 
  Plus, 
  Trash2, 
  ChevronDown, 
  Share2,
  ExternalLink,
  ShieldCheck
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

export const SiteSettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('System environment configuration nodes updated successfully.');
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'Globe',
      url: 'https://'
    };
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, newLink]
    });
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    });
  };

  const deleteSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter(link => link.id !== id)
    });
  };

  const platforms: SocialLink['platform'][] = ['Twitter', 'LinkedIn', 'GitHub', 'Facebook', 'Instagram', 'YouTube', 'Globe'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">System Environment Controller</h3>
          <p className="text-slate-500 text-base mt-2 font-medium">Calibrate global identity, visual scaling, and connectivity nodes.</p>
        </div>
        <button 
          onClick={handleSubmit} 
          className="flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 shrink-0"
        >
          <Save size={18} /> Deploy Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Core Configuration */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-4 text-indigo-600">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Globe size={24} />
            </div>
            <h4 className="font-black uppercase text-xs tracking-widest">Platform Core</h4>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Display Name</label>
              <input 
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-lg" 
                value={formData.siteName} 
                onChange={e => setFormData({ ...formData, siteName: e.target.value })} 
              />
            </div>
            
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                  <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-500">Global Font Scaling</h5>
                  <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full font-black text-indigo-600 text-xs shadow-sm">{formData.baseFontSize}px</span>
               </div>
               <input 
                 type="range" 
                 min="12" 
                 max="24" 
                 step="1" 
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                 value={formData.baseFontSize} 
                 onChange={e => setFormData({ ...formData, baseFontSize: parseInt(e.target.value) })} 
               />
               <p className="mt-4 text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">Adjust for regional accessibility compliance</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Primary Brand Identity Color</label>
              <div className="flex items-center gap-6">
                <input 
                  type="color" 
                  className="w-20 h-20 rounded-3xl cursor-pointer border-4 border-white shadow-xl" 
                  value={formData.primaryColor} 
                  onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} 
                />
                <div>
                  <code className="text-sm font-black text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 uppercase">{formData.primaryColor}</code>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Hexadecimal Cluster Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Contact Nodes */}
        <div className="space-y-12">
          {/* Support Channels */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            <div className="flex items-center gap-4 text-slate-800">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <Mail size={24} />
              </div>
              <h4 className="font-black uppercase text-xs tracking-widest">Communication Nodes</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Official Support Email</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-sm" 
                  value={formData.contactEmail} 
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Academic Hotline</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-sm" 
                  value={formData.contactPhone} 
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} 
                />
              </div>
            </div>
          </div>

          {/* Social Links Management */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-indigo-600">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <Share2 size={24} />
                </div>
                <h4 className="font-black uppercase text-xs tracking-widest">Connectivity Nodes</h4>
              </div>
              <button 
                onClick={addSocialLink}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                title="Append New Node"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {formData.socialLinks.map((link) => (
                <div key={link.id} className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] group hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <SocialIcon platform={link.platform} />
                  </div>
                  
                  <div className="flex-1 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <select 
                        className="w-full pl-5 pr-10 py-3 bg-white border-2 border-slate-100 rounded-xl outline-none appearance-none font-black text-[10px] uppercase tracking-widest cursor-pointer focus:border-indigo-300"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as SocialLink['platform'] })}
                      >
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                    </div>
                    
                    <div className="relative">
                      <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl outline-none font-bold text-xs focus:border-indigo-300"
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteSocialLink(link.id)}
                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                    title="Revoke Node"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {formData.socialLinks.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                  <Share2 className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Zero connectivity nodes active</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] flex items-center justify-center">
              <ShieldCheck size={32} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-2xl font-black tracking-tight">Configuration Integrity</h4>
              <p className="text-slate-400 text-sm font-medium mt-1">Changes to connectivity nodes affect global footer visibility across all registries.</p>
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full md:w-auto px-12 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
          >
            Authorize Deployment
          </button>
        </div>
      </div>
    </div>
  );
};