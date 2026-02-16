
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

// Initialize Supabase Client with User Provided Credentials
const supabaseUrl = 'https://bvjzuwulwdqubzifpeyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2anp1d3Vsd2RxdWJ6aWZwZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzc1NDgsImV4cCI6MjA4NjcxMzU0OH0.rivYIgGP4C9B4aDY9jeHizHgfS_8EiwbBkZZGVUqJ50';
const supabase = createClient(supabaseUrl, supabaseKey);

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

interface LandingPageProps {
  onEnterAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth }) => {
  const { settings, exams, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Inquiry Form State
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

  const faqs = [
    { q: "How do I start an exam?", a: "To start an exam, you need to create a student account and sign in. Once logged in, you can choose from the available exams in your dashboard." },
    { q: "Are the certificates verified?", a: "Yes, every certificate comes with a unique Verification ID that can be used to authenticate your achievements." },
    { q: "Is there negative marking?", a: "Some exams have negative marking as specified in their details. Be sure to check the exam rules before starting." },
    { q: "Can I take the same exam twice?", a: "Currently, our platform allows multiple attempts, but your most recent result will be the one recorded for ranking." }
  ];

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
            message: inquiryData.message.trim(),
          },
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
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmissionStatus('IDLE'), 5000);
    } catch (err) {
      console.error('Error submitting inquiry to Supabase:', err);
      setSubmissionStatus('ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
            <div className="relative">
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <span className="font-black text-xl md:text-3xl tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">{settings.siteName}</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-12">
            <a href="#exams" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors relative group">
              Exams
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#stats" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors relative group">
              Success
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#faq" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors relative group">
              Help
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors relative group">
              Contact
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={onEnterAuth}
              className="hidden sm:flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
            >
              Portal Login <Zap size={14} className="group-hover:fill-current" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300 overflow-hidden">
            <div className="flex flex-col p-4 gap-4">
              <a href="#exams" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-black uppercase tracking-widest text-xs text-slate-600 border-b border-slate-50">Exams</a>
              <a href="#stats" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-black uppercase tracking-widest text-xs text-slate-600 border-b border-slate-50">Success</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-black uppercase tracking-widest text-xs text-slate-600 border-b border-slate-50">Help</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-black uppercase tracking-widest text-xs text-slate-600">Contact</a>
              <button 
                onClick={() => { onEnterAuth(); setIsMobileMenuOpen(false); }}
                className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-xl"
              >
                Enter Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-white overflow-hidden relative pt-12 md:pt-24 pb-20 md:pb-40">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/50 -skew-x-12 transform origin-top translate-x-1/2 pointer-events-none hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center lg:text-left">
          <div className="max-w-4xl mx-auto lg:mx-0">
            <span className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-indigo-50 text-indigo-600 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-8 md:mb-12 border border-indigo-100 animate-bounce">
              <Globe size={16} /> Global Educational Hub
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[0.95] tracking-tightest mb-8 md:mb-10">
              Verify Your Knowledge with <span className="text-indigo-600">Precision.</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium mb-12 md:mb-16 max-w-3xl mx-auto lg:mx-0">
              {settings.footerDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-8">
              <button 
                onClick={onEnterAuth}
                className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-[1.5rem] md:rounded-[2rem] hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 md:gap-5 group"
              >
                Join the Platform <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <a href="#exams" className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-slate-400 hover:text-indigo-600 transition-colors underline decoration-2 underline-offset-[10px] md:underline-offset-[12px]">Browse Examinations</a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-16 md:py-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            {[
              { label: "Active Learners", value: "12k+", icon: Users, color: "text-indigo-600" },
              { label: "Certificates Issued", value: "45k+", icon: Trophy, color: "text-green-600" },
              { label: "Curated Exams", value: "850+", icon: BookOpen, color: "text-amber-600" },
              { label: "Security Uptime", value: "99.9%", icon: Shield, color: "text-rose-600" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-4 md:space-y-6">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto transition-transform hover:scale-110 group cursor-default">
                  <stat.icon className={`w-8 h-8 md:w-12 md:h-12 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exams Section */}
      <section id="exams" className="py-20 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 md:gap-16 mb-16 md:mb-24">
            <div className="max-w-3xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 md:mb-8">Explore the <span className="text-indigo-600 underline decoration-indigo-100 decoration-[8px] md:decoration-[12px] underline-offset-8">Registry.</span></h2>
              <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed">Discover professional-grade examinations across diverse academic and technical fields.</p>
            </div>
            
            <div className="w-full lg:max-w-lg">
               <div className="relative group">
                 <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} md-size={24} />
                 <input 
                   className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-3xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-sm md:text-base"
                   placeholder="Search exam title..."
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
               </div>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-4 gap-3 md:gap-4 mb-16 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-8 md:px-10 py-4 md:py-5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              All Subjects
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-8 md:px-10 py-4 md:py-5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredExams.map(exam => {
              const diffUI = getDifficultyUI(exam.difficulty);
              return (
                <div key={exam.id} className="group bg-white rounded-[2.5rem] md:rounded-[4.5rem] border-2 border-slate-100 p-8 md:p-14 hover:border-indigo-200 hover:shadow-[0_64px_128px_-32px_rgba(79,70,229,0.12)] transition-all duration-700 flex flex-col relative overflow-hidden h-full">
                  {/* Glassmorphism Background Pattern */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full -mr-24 -mt-24 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  
                  <div className="flex flex-col gap-4 mb-8 md:mb-12 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          {categories.find(c => c.id === exam.categoryId)?.name}
                        </span>
                        {exam.totalQuestions > 5 && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 text-[8px] font-black uppercase tracking-widest animate-pulse">
                            <Flame size={10} /> Hot
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${diffUI.color}`}>
                        {diffUI.icon}
                        {diffUI.label}
                      </div>
                    </div>
                    
                    {/* Topic visualization dots */}
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= (exam.difficulty === Difficulty.HARD ? 5 : exam.difficulty === Difficulty.MEDIUM ? 3 : 1) ? diffUI.dots + ' w-4' : 'bg-slate-100 w-2'}`}></div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-10 md:mb-14 relative z-10">
                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight group-hover:text-indigo-600 transition-colors duration-500">
                      {exam.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-y-10 md:gap-y-12 gap-x-10 md:gap-x-14 mb-12 md:mb-16 relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Clock size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                        Time limit
                      </div>
                      <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{exam.durationMinutes}<span className="text-[10px] text-slate-400 ml-1 font-bold">MINS</span></p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <BookOpen size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                        Clusters
                      </div>
                      <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{exam.totalQuestions}<span className="text-[10px] text-slate-400 ml-1 font-bold">MCQS</span></p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Target size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                        Penalty
                      </div>
                      <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">-{exam.negativeMarking}<span className="text-[10px] text-slate-400 ml-1 font-bold">PTS</span></p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Percent size={16} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                        Mastery
                      </div>
                      <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{exam.passPercentage}<span className="text-[10px] text-slate-400 ml-1 font-bold">% MIN</span></p>
                    </div>
                  </div>

                  <div className="mt-auto relative z-10 pt-4">
                    <button 
                      onClick={onEnterAuth}
                      className="w-full py-5 md:py-7 bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] md:text-[11px] rounded-[1.5rem] md:rounded-[2.5rem] hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 group/btn active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10">Initiate Assessment</span> 
                      <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:translate-x-2 transition-transform">
                        <ChevronRight size={18} />
                      </div>
                      {/* Shine effect on hover */}
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredExams.length === 0 && (
              <div className="col-span-full py-32 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
                <Search size={64} className="mx-auto text-slate-200 mb-8" />
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400">Zero search clusters detected in registry</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-40 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20 md:mb-32">
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6 block">KNOWLEDGE BASE</span>
             <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight">Got Questions?</h2>
             <p className="text-lg md:text-2xl text-slate-400 font-medium">Everything you need to know about the EduQuest platform.</p>
          </div>
          
          <div className="space-y-6 md:space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className={`bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden group transition-all duration-500 ${expandedFaq === i ? 'ring-2 ring-indigo-500/50 bg-white/10' : ''}`}>
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 md:px-12 py-8 md:py-12 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg md:text-2xl font-black pr-8 tracking-tight">{faq.q}</span>
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${expandedFaq === i ? 'bg-indigo-600 text-white rotate-180' : 'bg-white/5 text-slate-500'}`}>
                    <ChevronDown size={24} />
                  </div>
                </button>
                {expandedFaq === i && (
                  <div className="px-6 md:px-12 pb-10 md:pb-12 text-base md:text-xl text-slate-400 leading-relaxed font-medium animate-in fade-in slide-in-from-top-4 duration-500">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-40 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8 md:mb-10">Reach Out to our <span className="text-indigo-600">Experts.</span></h2>
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed mb-12 md:mb-16">
              Have questions about enterprise deployment or academic partnerships? Our coordination team is ready to assist.
            </p>
            <div className="space-y-6 md:space-y-10">
               <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 group">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shrink-0 border border-slate-100">
                   <Mail size={28} md-size={36} />
                 </div>
                 <div className="text-center md:text-left">
                   <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</p>
                   <p className="text-lg md:text-3xl font-black text-slate-800 break-all tracking-tight">{settings.contactEmail}</p>
                 </div>
               </div>
               <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 group">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shrink-0 border border-slate-100">
                   <MessageSquare size={28} md-size={36} />
                 </div>
                 <div className="text-center md:text-left">
                   <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Direct Assistance</p>
                   <p className="text-lg md:text-3xl font-black text-slate-800 tracking-tight">{settings.contactPhone}</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-14 rounded-[3rem] md:rounded-[5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] border border-slate-100 relative">
            {submissionStatus === 'SUCCESS' && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 rounded-[3rem] md:rounded-[5rem]">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle2 size={64} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Message Dispatched</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Your inquiry has been successfully transmitted to our core academic board. We will reach out to you shortly via the provided email node.
                </p>
                <button 
                  onClick={() => setSubmissionStatus('IDLE')}
                  className="mt-10 px-10 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            )}

            <form className="space-y-6 md:space-y-8" onSubmit={handleInquirySubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-2">First Name</label>
                  <input 
                    required
                    disabled={isSubmitting}
                    className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-sm md:text-lg disabled:opacity-50" 
                    placeholder="John" 
                    value={inquiryData.firstName}
                    onChange={(e) => setInquiryData({...inquiryData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-2">Last Name</label>
                  <input 
                    required
                    disabled={isSubmitting}
                    className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-sm md:text-lg disabled:opacity-50" 
                    placeholder="Doe" 
                    value={inquiryData.lastName}
                    onChange={(e) => setInquiryData({...inquiryData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-2">Email Address</label>
                <input 
                  required
                  type="email"
                  disabled={isSubmitting}
                  className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-sm md:text-lg disabled:opacity-50" 
                  placeholder="john.doe@academic.edu" 
                  value={inquiryData.email}
                  onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-2">Subject Context</label>
                <div className="relative">
                  <select 
                    disabled={isSubmitting}
                    className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-black text-sm md:text-lg appearance-none cursor-pointer disabled:opacity-50"
                    value={inquiryData.subject}
                    onChange={(e) => setInquiryData({...inquiryData, subject: e.target.value})}
                  >
                    <option>Partnership Inquiry</option>
                    <option>Support Ticket</option>
                    <option>Academic Audit</option>
                  </select>
                  <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-2">Official Message</label>
                <textarea 
                  required
                  disabled={isSubmitting}
                  className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-medium text-sm md:text-lg min-h-[150px] disabled:opacity-50" 
                  placeholder="Tell us how we can assist with your academic goals..." 
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                />
              </div>
              
              {submissionStatus === 'ERROR' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                  <AlertCircle size={20} />
                  <p className="text-xs font-black uppercase tracking-widest">Transmission Failure. Please attempt again.</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 md:py-8 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-[2rem] md:rounded-[3rem] hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={24} className="animate-spin" /> DISPATCHING PROTOCOL...
                  </>
                ) : (
                  'Dispatch Official Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Dynamic Global Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-24 md:mb-40">
            <div className="col-span-1">
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-inner" />
                <span className="font-black text-2xl md:text-3xl tracking-tighter text-slate-800">{settings.siteName}</span>
              </div>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium max-w-sm">
                {settings.footerDescription}
              </p>
            </div>

            {/* Dynamic Custom Navigation Columns */}
            {settings.footerSections.map(section => (
              <div key={section.id} className="hidden sm:block">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 md:mb-12">{section.title}</h4>
                <ul className="space-y-4 md:space-y-7 text-[11px] md:text-sm font-black text-slate-600 uppercase tracking-[0.2em]">
                  {section.links.map(link => (
                    <li key={link.id}>
                      <a href={link.url} className="hover:text-indigo-600 transition-colors flex items-center gap-2 group/link">
                        {link.label}
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 md:mb-12">Ecosystem</h4>
              <div className="flex items-center gap-4 md:gap-6">
                {settings.socialLinks.map((social) => (
                  <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm border border-slate-100">
                    <SocialIcon platform={social.platform} size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-10 md:pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} {settings.siteName}. Validated Academic Protocol.
            </p>
            <div className="flex items-center gap-4 md:gap-12">
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 md:px-6 py-2 rounded-full border border-indigo-100">
                v2.5.4-Stable
              </span>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nodes Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
