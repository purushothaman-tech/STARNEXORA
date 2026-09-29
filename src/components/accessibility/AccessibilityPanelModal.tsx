import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessibilityPreferencesPanel } from './AccessibilityPreferencesPanel';

interface AccessibilityPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

export const AccessibilityPanelModal: React.FC<AccessibilityPanelModalProps> = ({
  isOpen,
  onClose,
  onOpenHelp,
}) => {
  const { accessibility, announceToScreenReader } = useApp();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trapping and Escape key closing per WCAG 2.2 AA (Success Criterion 2.1.2)
  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        announceToScreenReader('Accessibility settings closed.', 'polite');
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, announceToScreenReader]);

  if (!isOpen) return null;

  const enabledCount = Object.values(accessibility).filter((v) => v === true || v === 'large' || v === 'extra-large').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-panel-title"
      aria-describedby="a11y-panel-desc"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 sticky top-0 z-20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold text-lg">
              ♿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="a11y-panel-title" className="text-lg sm:text-xl font-black text-white">
                  Accessibility Preferences
                </h2>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-900/60 border border-teal-500/40 px-2 py-0.5 rounded-full">
                  WCAG 2.2 AA
                </span>
              </div>
              <p id="a11y-panel-desc" className="text-xs text-slate-300">
                Customise typography, contrast, motion, and plain language. Saved automatically in localStorage.
              </p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close accessibility preferences"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-teal-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enabled Features Summary Badge Strip */}
        <div className="bg-teal-50/70 border-b border-teal-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-900">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Active Accessibility Features: {enabledCount} active</span>
          </div>

          <button
            onClick={onOpenHelp}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Accessibility Guide</span>
          </button>
        </div>

        {/* Modal Body: Rendering the AccessibilityPreferencesPanel */}
        <div className="p-5 sm:p-6 flex-1">
          <AccessibilityPreferencesPanel
            showHeader={false}
            onOpenHelp={onOpenHelp}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
