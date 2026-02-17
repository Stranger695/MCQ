import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Difficulty } from '../types';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { 
  Shield, 
  BookOpen, 
  Users, 
  Trophy, 
  ChevronRight, 
  HelpCircle, 
  Clock, 
  Percent, 
  Target, 
  MessageSquare, 
  Globe,
  ChevronDown,
  Search,
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Menu,
  X,
  Zap,
  Flame,
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const supabaseUrl = 'https://bvjzuwulwdqubzifpeyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2anp1d3Vsd2RxdWJ6aWZwZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzc1NDgsImV4cCI6MjA4NjcxMzU0OH0.rivYIgGP4C9B4aDY9jeHizHgfS_8EiwbBkZZGVUqJ50';
const supabase = createClient(supabaseUrl, supabaseKey);

const SocialIcon = ({ platform, size = 20 }: { platform: string; size?: number }) => {
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

interface LandingPageProps {
  onEnterAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth }) => {
  const { settings, exams, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [inquiryData, setInquiryData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Partnership Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const filteredExams = exams.filter(exam => {
    if (!exam.isEnabled) return false;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory ? exam.categoryId === selectedCategory : true;
    return matchesSearch && matchesCat;
  });

  const getDifficultyUI = (diff?: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY:
        return {
          label: 'Foundational',
          icon: <Zap size={14} className="text-emerald-500" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dots: 'bg-emerald-400'
        };
      case Difficulty.HARD:
        return {
          label: 'Master Tier',
          icon: <Flame size={14} className="text-rose-500" />,
          color: 'bg-rose-50 text-rose-700 border-rose-100',
          dots: 'bg-rose-400'
        };
      default:
        return {
          label: 'Intermediate',
          icon: <Star size={14} className="text-amber-500" />,
          color: 'bg-amber-50 text-amber-700 border-amber-100',
          dots: 'bg-amber-400'
        };
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('IDLE');

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            first_name: inquiryData.firstName.trim(),
            last_name: inquiryData.lastName.trim(),
            email: inquiryData.email.trim(),
            subject: inquiryData.subject,
            message: inquiryData.message.trim()
          }
        ]);

      if (error) throw error;

      setSubmissionStatus('SUCCESS');
      setInquiryData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'Partnership Inquiry',
        message: ''
      });
      
      setTimeout(() => setSubmissionStatus('IDLE'), 5000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setSubmissionStatus('ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 group cursor-pointer">
            <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl shadow-lg" />
            <span className="font-black text-lg md:text-3xl tracking-tighter text-slate-900">{settings.siteName}</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-12">
            <a href="#exams" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors">Exams</a>
            <a href="#stats" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors">Success</a>
            <a href="#contact" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
          </nav>

          <button 
            onClick={onEnterAuth}
            className="flex items-center gap-3 px-5 md:px-8 py-2 md:py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] md:text-xs rounded-xl md:rounded-2xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
          >
            Portal Login
          </button>
        </div>
      </header>

      <section className="bg-white relative pt-8 md:pt-24 pb-12 md:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/50 skew-x-12 transform origin-right translate-x-1/2 -z-0 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tightest mb-6 md:mb-10 leading-[1.15]">
            Verify Your Knowledge with <span className="text-indigo-600">Precision.</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium mb-8 md:mb-16 max-w-3xl mx-auto lg:mx-0">
            {settings.footerDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8">
            <button 
              onClick={onEnterAuth}
              className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-xl md:rounded-[2rem] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 group"
            >
              Join the Platform <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section id="exams" className="py-12 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
            <div>
              <h2 className="text-2xl md:text-6xl font-black text-slate-900 tracking-tight">Explore the Registry.</h2>
              <p className="text-slate-500 text-sm md:text-lg mt-2 md:mt-4 font-medium">Curated academic assessments for professional validation.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                className="w-full pl-12 pr-6 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold"
                placeholder="Search examination title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {filteredExams.map(exam => {
              const diffUI = getDifficultyUI(exam.difficulty);
              const catName = categories.find(c => c.id === exam.categoryId)?.name || 'General';
              
              return (
                <div key={exam.id} className="group bg-white rounded-2xl md:rounded-[3rem] border-2 border-slate-100 p-6 md:p-12 hover:border-indigo-200 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] transition-all duration-700 flex flex-col relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
                    <span className="px-3 md:px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                      {catName}
                    </span>
                    <div className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-xl border text-[7px] md:text-[8px] font-black uppercase tracking-widest ${diffUI.color}`}>
                      {diffUI.icon}
                      {diffUI.label}
                    </div>
                  </div>

                  <h3 className="text-lg md:text-3xl font-black text-slate-900 leading-tight mb-8 md:mb-10 group-hover:text-indigo-600 transition-colors duration-500 relative z-10">
                    {exam.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-10 mb-8 md:mb-12 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} className="text-indigo-300 md:w-4 md:h-4" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Timeframe</span>
                      </div>
                      <p className="text-base md:text-xl font-black text-slate-800">{exam.durationMinutes}<span className="text-[10px] md:text-xs ml-1 text-slate-400 font-bold">MINS</span></p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-400">
                        <BookOpen size={14} className="text-indigo-300 md:w-4 md:h-4" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Clusters</span>
                      </div>
                      <p className="text-base md:text-xl font-black text-slate-800">{exam.totalQuestions}<span className="text-[10px] md:text-xs ml-1 text-slate-400 font-bold">MCQS</span></p>
                    </div>
                  </div>

                  <button 
                    onClick={onEnterAuth}
                    className="mt-auto w-full py-4 md:py-6 bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl md:rounded-[1.5rem] hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 md:gap-4 active:scale-95 relative z-10"
                  >
                    Initiate Assessment <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {filteredExams.length === 0 && (
            <div className="col-span-full py-12 md:py-32 text-center bg-slate-50 rounded-2xl md:rounded-[4rem] border-4 border-dashed border-slate-200">
              <Search size={48} className="mx-auto text-slate-200 mb-6 md:mb-8 md:w-16 md:h-16" />
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Zero search clusters detected in registry</p>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-12 md:py-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 md:mb-8">Reach Out.</h2>
            <p className="text-sm md:text-2xl text-slate-500 font-medium leading-relaxed mb-10 md:mb-12">
              Have questions about enterprise deployment or academic partnerships? Our team is ready to assist.
            </p>
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-[1.5rem] shadow-xl flex items-center justify-center text-indigo-600 shrink-0">
                   <Mail size={28} className="md:w-9 md:h-9" />
                 </div>
                 <div className="text-center md:text-left">
                   <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</p>
                   <p className="text-sm md:text-3xl font-black text-slate-800 break-all">{settings.contactEmail}</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-14 rounded-2xl md:rounded-[3rem] shadow-2xl border border-slate-100">
            <form className="space-y-4 md:space-y-6" onSubmit={handleInquirySubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <input required className="w-full px-5 md:px-6 py-3.5 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none font-black text-sm" placeholder="First Name" value={inquiryData.firstName} onChange={(e) => setInquiryData({...inquiryData, firstName: e.target.value})} />
                <input required className="w-full px-5 md:px-6 py-3.5 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none font-black text-sm" placeholder="Last Name" value={inquiryData.lastName} onChange={(e) => setInquiryData({...inquiryData, lastName: e.target.value})} />
              </div>
              <input required type="email" className="w-full px-5 md:px-6 py-3.5 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none font-black text-sm" placeholder="Email Address" value={inquiryData.email} onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})} />
              <textarea required className="w-full px-5 md:px-6 py-3.5 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none font-medium min-h-[120px] md:min-h-[150px] text-sm" placeholder="Official Message" value={inquiryData.message} onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})} />
              <button type="submit" disabled={isSubmitting} className="w-full py-4 md:py-6 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                {isSubmitting ? 'Dispatching...' : 'Dispatch Official Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-8 md:py-10 text-center">
        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">
          © {new Date().getFullYear()} {settings.siteName}. Validated Academic Protocol.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;