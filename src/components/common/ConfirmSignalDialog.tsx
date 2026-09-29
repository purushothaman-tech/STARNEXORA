import React, { useEffect, useRef } from 'react';
import { HelpCircle, Check, X, ShieldAlert } from 'lucide-react';

interface ConfirmSignalDialogProps {
  isOpen: boolean;
  question: string;
  inferredSignal: string;
  onConfirm: (choice: 'YES' | 'NO' | 'NOT_SURE' | 'PREFER_NOT_TO_ANSWER') => void;
  onCancel: () => void;
}

export const ConfirmSignalDialog: React.FC<ConfirmSignalDialogProps> = ({
  isOpen,
  question,
  inferredSignal,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    yesBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-signal-title"
      aria-describedby="confirm-signal-desc"
      className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-xs space-y-4 animate-in fade-in my-auto relative"
      >
        <button
          onClick={onCancel}
          aria-label="Cancel and close signal confirmation"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded uppercase">
              Human Confirmation Gate
            </span>
            <h3 id="confirm-signal-title" className="text-sm font-bold text-slate-900 mt-1">
              Confirming Signal Accuracy
            </h3>
          </div>
        </div>

        <div id="confirm-signal-desc" className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-slate-700 font-medium">
          <p className="text-[11px] text-slate-500">Inferred Signal: <strong className="text-slate-800">{inferredSignal}</strong></p>
          <p className="text-xs font-semibold text-slate-900 leading-relaxed pt-1">
            &ldquo;{question}&rdquo;
          </p>
        </div>

        <div className="text-[10px] text-slate-400">
          SPC does not automatically log unconfirmed interpretations. Only responses confirmed by you become structured case records.
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            ref={yesBtnRef}
            onClick={() => onConfirm('YES')}
            className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-center shadow-xs transition"
          >
            YES
          </button>
          <button
            onClick={() => onConfirm('NO')}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center transition"
          >
            NO
          </button>
          <button
            onClick={() => onConfirm('NOT_SURE')}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold rounded-xl text-center transition"
          >
            NOT SURE
          </button>
          <button
            onClick={() => onConfirm('PREFER_NOT_TO_ANSWER')}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 font-medium rounded-xl text-center transition"
          >
            PREFER NOT TO ANSWER
          </button>
        </div>
      </div>
    </div>
  );
};
