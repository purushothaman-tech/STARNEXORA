import React, { useState, useEffect, useRef } from 'react';
import {
  GitBranch,
  Users,
  AlertTriangle,
  Shield,
  ExternalLink,
  TrendingUp,
  Heart,
  Plus,
  CheckCircle2,
  Clock,
  Filter,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InterventionRecord } from '../../types';

export const InterventionsView: React.FC = () => {
  const { interventions, addIntervention, updateInterventionStatus, cases, selectCaseById, announceToScreenReader } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showAddModal) return;
    closeBtnRef.current?.focus();
    announceToScreenReader('Authorize New Intervention dialog opened', 'polite');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAddModal(false);
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
  }, [showAddModal, announceToScreenReader]);

  const [newType, setNewType] = useState<InterventionRecord['type']>('Counselling Support');
  const [newCaseId, setNewCaseId] = useState('SAH-DEMO-001');
  const [newAssignedTo, setNewAssignedTo] = useState('Dr. Kavita Singhania');
  const [newFrequency, setNewFrequency] = useState('Weekly Support');
  const [newNotes, setNewNotes] = useState('');

  const streamTypes = [
    'all',
    'Counselling Support',
    'Medical Support / Referral',
    'Legal Aid',
    'Financial Assistance',
    'Witness Protection Review',
    'Relocation Support',
    'Rehabilitation Support',
  ];

  const filteredInterventions = interventions.filter(
    (i) => selectedType === 'all' || i.type === selectedType
  );

  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCase = cases.find((c) => c.id === newCaseId) || cases[0];
    addIntervention({
      type: newType,
      caseId: targetCase.id,
      victimName: targetCase.maskedName,
      status: 'Assigned',
      assignedTo: newAssignedTo,
      dateInitiated: 'Today',
      frequency: newFrequency || 'As Scheduled',
      outcomes: newNotes || 'Intervention authorized under Nodal Support Directive.',
      aiSuggested: false,
    });
    setShowAddModal(false);
    setNewNotes('');
    announceToScreenReader('Intervention assigned successfully.', 'polite');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">7-Stream Multi-Agency Interventions</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking psychosocial, legal, financial, and witness protection interventions across authorized agencies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Intervention</span>
        </button>
      </div>

      {/* Stream Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {streamTypes.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize whitespace-nowrap transition ${
              selectedType === t
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All Interventions' : t}
          </button>
        ))}
      </div>

      {/* Interventions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInterventions.map((int) => (
          <div
            key={int.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-3 flex flex-col justify-between text-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {int.caseId}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  int.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                  int.status === 'In Progress' ? 'bg-teal-100 text-teal-800' :
                  int.status === 'Recommended' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {int.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{int.type}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Beneficiary: <strong>{int.victimName}</strong></p>
              </div>

              <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Assigned Provider:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px]">{int.assignedTo}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-semibold text-slate-800">{int.frequency}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Date Initiated:</span>
                  <span>{int.dateInitiated}</span>
                </div>
              </div>

              <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                {int.outcomes}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <select
                value={int.status}
                onChange={(e) => updateInterventionStatus(int.id, e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 cursor-pointer"
              >
                <option value="Recommended">Recommended</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => selectCaseById(int.caseId)}
                className="text-teal-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Case Dossier</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Intervention Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="intervention-modal-title"
          aria-describedby="intervention-modal-desc"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs space-y-4 animate-in fade-in my-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 id="intervention-modal-title" className="text-base font-bold text-slate-900">Authorize New Intervention</h3>
                <p id="intervention-modal-desc" className="text-[11px] text-slate-500">Deploy support stream to active victim case</p>
              </div>
              <button
                ref={closeBtnRef}
                onClick={() => setShowAddModal(false)}
                aria-label="Close dialog"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddIntervention} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Victim Case</label>
                <select
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.maskedName} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Intervention Stream (7 Streams)</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Counselling Support">Counselling Support (Psychosocial)</option>
                  <option value="Medical Support / Referral">Medical Support / Referral</option>
                  <option value="Legal Aid">Legal Aid &amp; Court Companion</option>
                  <option value="Financial Assistance">Financial Assistance &amp; Relief Grant</option>
                  <option value="Witness Protection Review">Witness Protection Review &amp; Picket</option>
                  <option value="Relocation Support">Relocation Support &amp; Safe Housing</option>
                  <option value="Rehabilitation Support">Rehabilitation &amp; Vocational Skilling</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Agency / Officer</label>
                <input
                  type="text"
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  placeholder="e.g. Dr. Kavita Singhania, DLSA Counsel, Special Cell"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cadence / Frequency</label>
                <input
                  type="text"
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  placeholder="e.g. Weekly Tele-therapy, 24/7 Police Detail, Bi-weekly grant"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Directives &amp; Scope</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Scope of intervention, protection guidelines, or expected milestones..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Authorize Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
