import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Difficulty, UserRole } from '../types';
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
  Mail,
  X,
  Zap,
  Flame,
  Star,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Award,
  ShieldCheck,
  FileText,
  Lock,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import Footer from '../components/Footer';

const supabaseUrl = 'https://bvjzuwulwdqubzifpeyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2anp1d3Vsd2RxdWJ6aWZwZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzc1NDgsImV4cCI6MjA4NjcxMzU0OH0.rivYIgGP4C9B4aDY9jeHizHgfS_8EiwbBkZZGVUqJ50';
const supabase = createClient(supabaseUrl, supabaseKey);

interface LandingPageProps {
  onEnterAuth: () => void;
}

const PolicyModal: React.FC<{ type: string; onClose: () => void }> = ({ type, onClose }) => {
  const contentMap: Record<string, { title: string, text: string }> = {
    'Privacy Policy': {
      title: 'Privacy Infrastructure Protocol',
      text: "Our Academic Infrastructure Protocol ensures that all candidate identity nodes and examination metadata are stored using military-grade encryption. We do not transmit telemetry to third-party clusters. Your educational journey is strictly confidential within the EduQuest core."
    },
    'Terms of Service': {
      title: 'Academic Terms of Engagement',
      text: "By engaging with the EduQuest Exam Registry, you agree to uphold academic integrity standards. Any attempt to bypass the Secure Session Environment or manipulate result nodes will result in immediate identity revocation. All intellectual property fragments remain the sole property of the respective authors."
    },
    'GDPR Audit': {
      title: 'Global Data Protection Compliance',
      text: "EduQuest is fully compliant with European Data Protection Protocols. Every user has the right to a full purge of their identity node. We maintain detailed logs of data access and ensure that no personally identifiable information is processed without explicit cryptographic consent."
    }
  };

  const activeDoc = contentMap[type] || { title: type, text: "Standard Platform Documentation." };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-10 bg-slate-900 text-white flex justify-between items-center relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
           <div className="relative z-10">
             <h3 className="font-black text-xl uppercase tracking-widest">{activeDoc.title}</h3>
             <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Official Registry Copy</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"><X size={24} /></button>
        </div>
        <div className="p-10 space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            {activeDoc.text}
          </p>
          <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-600">
               <ShieldCheck size={18} />
               <span className="text-[9px] font-black uppercase tracking-widest">Protocol Verified</span>
            </div>
            <button onClick={onClose} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Acknowledged</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth }) => {
  const { settings, exams, categories, results, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const [inquiryData, setInquiryData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Partnership Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Real-time Telemetry Calculations
  const platformStats = useMemo(() => {
    const studentsCount = users.filter(u => u.role === UserRole.STUDENT).length;
    const examsCount = exams.length;
    const totalResults = results.length;
    const passCount = results.filter(r => r.status === 'PASS').length;
    const globalPassRate = totalResults > 0 ? Math.round((passCount / totalResults) * 100) : 0;
    
    return {
      activeStudents: studentsCount,
      totalExams: examsCount,
      passRate: globalPassRate
    };
  }, [users, exams, results]);

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
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        };
      case Difficulty.HARD:
        return {
          label: 'Master Tier',
          icon: <Flame size={14} className="text-rose-500" />,
          color: 'bg-rose-50 text-rose-700 border-rose-100'
        };
      default:
        return {
          label: 'Intermediate',
          icon: <Star size={14} className="text-amber-500" />,
          color: 'bg-amber-50 text-amber-700 border-amber-100'
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
      setInquiryData({ firstName: '', lastName: '', email: '', subject: 'Partnership Inquiry', message: '' });
      setTimeout(() => setSubmissionStatus('IDLE'), 5000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setSubmissionStatus('ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-x-hidden scroll-smooth">
      {activePolicy && <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />}
      
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

      {/* Hero Section */}
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

      {/* Platform Telemetry Section (Redesigned White Background) */}
      <section id="stats" className="py-20 md:py-40 bg-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] border-[40px] border-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6 border border-indigo-100">
               <TrendingUp size={14} className="text-indigo-600" />
               <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">Real-time Performance Metrics</span>
            </div>
            <h2 className="text-3xl md:text-7xl font-black text-slate-900 tracking-tightest leading-tight">Global Success <span className="text-indigo-600">Registry.</span></h2>
            <p className="text-slate-500 text-sm md:text-xl font-medium max-w-2xl mx-auto mt-6">Monitoring academic infrastructure health and candidate outcome distributions across the entire EduQuest cluster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { 
                label: 'Active Candidates', 
                val: platformStats.activeStudents.toLocaleString(), 
                icon: <Users />, 
                color: 'text-indigo-600', 
                bg: 'bg-indigo-50',
                border: 'border-indigo-100',
                desc: 'Verified identity nodes currently engaged in active assessment tracks.'
              },
              { 
                label: 'Success Yield', 
                val: `${platformStats.passRate}%`, 
                icon: <Trophy />, 
                color: 'text-emerald-600', 
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                desc: 'Mean pass percentage maintained across all examination protocols.'
              },
              { 
                label: 'Academic Clusters', 
                val: platformStats.totalExams.toLocaleString(), 
                icon: <BookOpen />, 
                color: 'text-amber-600', 
                bg: 'bg-amber-50',
                border: 'border-amber-100',
                desc: 'Curated knowledge groups mapped to professional validation standards.'
              }
            ].map((stat, i) => (
              <div key={i} className="group bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 hover:bg-white hover:border-indigo-200 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.1)] transition-all duration-500 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border ${stat.border}`}>
                   {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <div className="flex-1">
                   <p className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter">{stat.val}</p>
                   <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{stat.label}</p>
                   <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
                </div>
                <div className="pt-8 mt-8 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-indigo-600">
                   <span className="text-[10px] font-black uppercase tracking-widest">View Detailed Audit</span>
                   <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Registry Section */}
      <section id="exams" className="py-12 md:py-40 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
            <div>
              <h2 className="text-2xl md:text-6xl font-black text-slate-900 tracking-tight">Explore the Registry.</h2>
              <p className="text-slate-500 text-sm md:text-lg mt-2 md:mt-4 font-medium">Curated academic assessments for professional validation.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                className="w-full pl-12 pr-6 py-3 md:py-4 bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold"
                placeholder="Search examination title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
            {filteredExams.map(exam => {
              const diffUI = getDifficultyUI(exam.difficulty);
              const catName = categories.find(c => c.id === exam.categoryId)?.name || 'General';
              return (
                <div key={exam.id} className="group bg-white rounded-3xl md:rounded-[3.5rem] border-2 border-slate-100 p-8 md:p-14 hover:border-indigo-200 hover:shadow-[0_60px_100px_-20px_rgba(79,70,229,0.12)] transition-all duration-700 flex flex-col relative overflow-hidden h-full transform hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  <div className="flex items-center justify-between mb-8 md:mb-12 relative z-10">
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 text-[9px] md:text-[11px] font-black uppercase tracking-widest rounded-xl border border-indigo-100 shadow-sm">
                      {catName}
                    </span>
                    <div className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl border text-[8px] md:text-[10px] font-black uppercase tracking-widest ${diffUI.color} shadow-sm`}>
                      {diffUI.icon}
                      {diffUI.label}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-4xl font-black text-slate-900 leading-tight mb-10 md:mb-14 group-hover:text-indigo-600 transition-colors duration-500 relative z-10 tracking-tight">
                    {exam.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-y-10 mb-10 md:mb-14 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={16} className="text-indigo-400" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Timeframe</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-slate-800">{exam.durationMinutes}<span className="text-[11px] md:text-xs ml-1 text-slate-400 font-bold uppercase">Mins</span></p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FileText size={16} className="text-indigo-400" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Knowledge</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-slate-800">{exam.totalQuestions}<span className="text-[11px] md:text-xs ml-1 text-slate-400 font-bold uppercase">MCQS</span></p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/80 rounded-2xl md:rounded-[2rem] border border-slate-100 mb-10 md:mb-14 space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={12} className="text-emerald-500" /> Success Metrics</span>
                       <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Standard Protocol</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                         <CheckCircle2 size={14} className="text-emerald-500" />
                         <span className="text-[10px] font-bold text-slate-600">Yield: +{exam.marksPerQuestion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <AlertTriangle size={14} className="text-rose-500" />
                         <span className="text-[10px] font-bold text-slate-600">Penalty: -{exam.negativeMarking}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={onEnterAuth} className="mt-auto w-full py-5 md:py-7 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-[12px] rounded-2xl md:rounded-[2.5rem] group-hover:bg-slate-900 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 active:scale-95 relative z-10">
                    Start Assessment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 md:mb-8">Reach Out.</h2>
            <p className="text-sm md:text-2xl text-slate-500 font-medium leading-relaxed mb-10 md:mb-12">
              Have questions about enterprise deployment or academic partnerships? Our team is ready to assist.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-[1.5rem] shadow-xl flex items-center justify-center text-indigo-600 shrink-0 border border-slate-100">
                <Mail size={28} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</p>
                <p className="text-sm md:text-3xl font-black text-slate-800 break-all">{settings.contactEmail}</p>
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

      <Footer variant="FULL" onPolicyClick={setActivePolicy} onPortalClick={onEnterAuth} />
    </div>
  );
};

export default LandingPage;