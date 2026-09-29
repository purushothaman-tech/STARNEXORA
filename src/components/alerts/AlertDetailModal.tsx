import React, { useState, useEffect, useRef } from 'react';
import { RiskAlert } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  UserCheck,
  Calendar,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: RiskAlert;
  onClose: () => void;
  onOpenCaseProfile: (caseId: string) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onOpenCaseProfile,
}) => {
  const { resolveAlert, announceToScreenReader } = useApp();
  const [outreachSent, setOutreachSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    announceToScreenReader(`Alert Details opened: ${alert.headline}`, 'polite');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

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
  }, [alert.headline, onClose, announceToScreenReader]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-desc"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in text-xs space-y-4 my-auto"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-bold">{alert.id}</span>
              <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                {alert.riskType}
              </span>
            </div>
            <h3 id="alert-modal-title" className="text-base font-black mt-1 text-white">{alert.headline}</h3>
            <p id="alert-modal-desc" className="text-slate-400 text-[11px] mt-0.5">
              Case {alert.caseId} · {alert.maskedName} · {alert.timeAgo}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close alert details"
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px]">Trigger Event</span>
            <p className="font-semibold text-slate-900 mt-0.5 text-xs">{alert.trigger}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
              Why was this alert triggered? (Explainable AI)
            </span>
            <div className="space-y-1 text-slate-700">
              {alert.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200">
              These are contributing indicators, not proof of causation.
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px]">Recommended Action</span>
            <p className="text-slate-800 font-medium mt-0.5 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100">
              {alert.recommendedAction}
            </p>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
            <span>Assigned Reviewer: <strong className="text-slate-800">{alert.assignedReviewer}</strong></span>
            <button
              onClick={() => {
                onClose();
                onOpenCaseProfile(alert.caseId);
              }}
              className="text-teal-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Case Dossier</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {outreachSent && (
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Direct caseworker outreach protocol dispatched for case {alert.caseId}.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setOutreachSent(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 font-bold rounded-xl text-slate-700 transition"
          >
            {outreachSent ? 'Outreach Dispatched ✓' : 'Initiate Caseworker Outreach'}
          </button>
          <button
            onClick={() => {
              resolveAlert(alert.id);
              onClose();
            }}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 font-bold rounded-xl text-white shadow-xs transition"
          >
            Mark Reviewed &amp; Resolve
          </button>
        </div>
      </div>
    </div>
  );
};
