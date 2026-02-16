
import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { FooterSection, FooterLink, SocialLink } from '../types';
import { 
  Settings, Globe, Palette, FileBadge, Save, Layout, Mail, Phone, Twitter, Linkedin, Github, Facebook, Instagram, Youtube, Plus, Trash2, ChevronDown, Type, Database, FileJson
} from 'lucide-react';

const SocialIcon = ({ platform, size = 20 }: { platform: string, size?: number }) => {
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
    alert('System configuration nodes updated!');
  };

  const platforms: SocialLink['platform'][] = ['Twitter', 'LinkedIn', 'GitHub', 'Facebook', 'Instagram', 'YouTube', 'Globe'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">System Environment Controller</h3>
          <p className="text-slate-500 text-base mt-2">Calibrate global identity and visual scaling.</p>
        </div>
        <button onClick={handleSubmit} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">
          <Save size={20} /> Deploy Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-4 text-indigo-600">
            <Globe size={32} />
            <h4 className="font-black uppercase text-sm">Platform Core</h4>
          </div>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Display Name</label>
              <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-lg" value={formData.siteName} onChange={e => setFormData({ ...formData, siteName: e.target.value })} />
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                  <h5 className="font-black text-sm text-slate-800">Global Font Scaling</h5>
                  <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full font-black text-indigo-600">{formData.baseFontSize}px</span>
               </div>
               <input type="range" min="12" max="24" step="1" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={formData.baseFontSize} onChange={e => setFormData({ ...formData, baseFontSize: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Primary Color</label>
              <input type="color" className="w-16 h-16 rounded-2xl cursor-pointer" value={formData.primaryColor} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-4 text-slate-800">
            <Mail size={32} />
            <h4 className="font-black uppercase text-sm">Communication Nodes</h4>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Support Email</label>
              <input className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Support Phone</label>
              <input className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
