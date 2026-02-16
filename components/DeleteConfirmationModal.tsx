
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmText === 'Yes') {
      onConfirm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 ${isAnimating ? 'animate-in zoom-in-95 slide-in-from-bottom-4 duration-300' : ''}`}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            {message}
            {itemName && <span className="block mt-2 font-bold text-slate-700 italic">Target: "{itemName}"</span>}
          </p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Trash2 size={12} /> Destructive Action Warning
            </p>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              This operation is permanent. Type <span className="font-black underline italic">Yes</span> in the field below to verify authorization.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              autoFocus
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all font-black text-center text-lg placeholder:font-normal placeholder:text-slate-300"
              placeholder="Type 'Yes' here"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
              >
                Abort
              </button>
              <button
                disabled={confirmText !== 'Yes'}
                onClick={handleConfirm}
                className={`flex-1 py-4 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                  confirmText === 'Yes' 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-100' 
                  : 'bg-slate-300 cursor-not-allowed opacity-50'
                }`}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
