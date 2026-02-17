import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmString?: string;
  variant?: 'DANGER' | 'WARNING';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmString = 'Yes',
  variant = 'DANGER'
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const isMatched = confirmText === confirmString;

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isMatched) {
      onConfirm();
      onClose();
    }
  };

  const colors = variant === 'DANGER' 
    ? { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100', btn: 'bg-red-600 hover:bg-red-700', ring: 'focus:ring-red-100', accent: 'text-red-600' }
    : { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100', btn: 'bg-amber-600 hover:bg-amber-700', ring: 'focus:ring-amber-100', accent: 'text-amber-600' };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 ${isAnimating ? 'animate-in zoom-in-95 slide-in-from-bottom-4 duration-300' : ''}`}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center shadow-inner`}>
              <AlertTriangle size={32} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{title}</h3>
          <div className="space-y-4 mb-8">
            <p className="text-slate-500 text-sm leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 inline-block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Target Resource</span>
                <span className="font-bold text-slate-700 italic">"{itemName}"</span>
              </div>
            )}
          </div>

          <div className={`${colors.bg} border ${colors.border} rounded-2xl p-4 mb-8`}>
            <p className={`text-[10px] font-black ${colors.accent} uppercase tracking-widest mb-1 flex items-center gap-2`}>
              <ShieldCheck size={12} /> Verification Protocol
            </p>
            <p className={`text-xs ${variant === 'DANGER' ? 'text-red-700' : 'text-amber-700'} font-medium leading-relaxed`}>
              This action is critical. Type <span className="font-black underline italic">{confirmString}</span> below to authorize the operation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                autoFocus
                className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-black text-center text-lg placeholder:font-normal placeholder:text-slate-300 ${
                  isMatched 
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100' 
                    : `border-slate-200 focus:border-${variant === 'DANGER' ? 'red' : 'amber'}-500 ${colors.ring}`
                }`}
                placeholder={`Type '${confirmString}'`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              />
              {isMatched && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-300">
                  <CheckCircle2 size={24} />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
              >
                Abort
              </button>
              <button
                disabled={!isMatched}
                onClick={handleConfirm}
                className={`flex-1 py-4 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                  isMatched 
                  ? `${colors.btn} shadow-indigo-100` 
                  : 'bg-slate-300 cursor-not-allowed opacity-50'
                }`}
              >
                {variant === 'DANGER' ? <Trash2 size={16} /> : <CheckCircle2 size={16} />}
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;