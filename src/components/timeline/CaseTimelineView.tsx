import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineEvent } from '../../types';
import {
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  AlertCircle,
  Plus,
  Shield,
  ChevronRight,
  ExternalLink,
  X,
} from 'lucide-react';

export const CaseTimelineView: React.FC = () => {
  const { selectedCase, addTimelineMilestone, unmaskPII, announceToScreenReader } = useApp();
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<'legal' | 'counselling' | 'financial' | 'police' | 'safety'>('legal');
  const [newDesc, setNewDesc] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showAddMilestone) return;
    closeBtnRef.current?.focus();
    announceToScreenReader('Record Milestone dialog opened', 'polite');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAddMilestone(false);
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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
  }, [showAddMilestone, announceToScreenReader]);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTimelineMilestone(selectedCase.id, {
      title: newTitle.trim(),
      date: newDate || 'Today',
      category: newCategory,
      description: newDesc || 'Milestone registered by nodal caseworker.',
      status: 'upcoming',
      officerOrProvider: 'Case Officer',
    });

    setShowAddMilestone(false);
    setNewTitle('');
    setNewDesc('');
    announceToScreenReader(`Milestone "${newTitle.trim()}" added to timeline successfully.`, 'polite');
  };

  const timeline = selectedCase.timeline || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold text-slate-900">Case Journey &amp; Closed-Loop Timeline</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Case {selectedCase.id} • {unmaskPII ? selectedCase.fullName : selectedCase.maskedName} • {selectedCase.firNumber} • {selectedCase.policeStation}
          </p>
        </div>

        <button
          onClick={() => setShowAddMilestone(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Judicial Milestone</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs max-w-3xl mx-auto">
        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {timeline.map((item) => {
            const isDone = item.status === 'completed';
            const isUpcoming = item.status === 'upcoming';

            return (
              <div key={item.id} className="relative group text-xs">
                {/* Status Dot / Icon */}
                <div
                  className={`absolute -left-9 top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-xs ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isUpcoming
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>

                {/* Content Box */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition space-y-1.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-600">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">{item.description}</p>

                  <div className="flex items-center justify-between pt-1.5 text-[10px] text-slate-400 font-medium">
                    <span>Officer / Provider: <strong>{item.officerOrProvider || 'Automated Surveillance'}</strong></span>
                    <span className="font-bold text-slate-700">{item.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddMilestone && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="milestone-modal-title"
          aria-describedby="milestone-modal-desc"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs space-y-4 animate-in fade-in my-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 id="milestone-modal-title" className="text-base font-bold text-slate-900">Record Judicial / Support Milestone</h3>
                <p id="milestone-modal-desc" className="text-[11px] text-slate-500">Appends to closed-loop journey for {selectedCase.id}</p>
              </div>
              <button
                ref={closeBtnRef}
                onClick={() => setShowAddMilestone(false)}
                aria-label="Close dialog"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chargesheet Filed, Interim Compensation Disbursed, Hearing Concluded"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="legal">Legal &amp; Court</option>
                  <option value="counselling">Psychosocial Counselling</option>
                  <option value="financial">Financial &amp; Compensation</option>
                  <option value="police">Police &amp; Witness Protection</option>
                  <option value="safety">Safety Posture</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. Today, 10 Jul 2025"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary &amp; Case Notes</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Official record details, courtroom orders, or escort confirmation..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
