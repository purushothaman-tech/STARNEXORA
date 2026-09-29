import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Heart,
  FileText,
  AlertCircle,
  Phone,
  Clock,
  Shield,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Minus,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VictimCase, AppModule } from '../../types';

interface CounsellorDashboardProps {
  onSelectCase: (c: VictimCase) => void;
  onNavigate: (m: AppModule) => void;
  onOpenEmergency: () => void;
}

export const CounsellorDashboard: React.FC<CounsellorDashboardProps> = ({
  onSelectCase,
  onNavigate,
  onOpenEmergency,
}) => {
  const {
    cases,
    alerts,
    interventions,
    followUps,
    addIntervention,
    addFollowUp,
    addTimelineMilestone,
    resolveAlert,
    unmaskPII,
  } = useApp();

  // Find active cases for Dr. Kavita Singhania or priority cases
  const assignedCases = cases.filter(
    (c) =>
      c.assignedCounsellor.toLowerCase().includes('kavita') ||
      c.id === 'SAH-DEMO-001' ||
      c.id === 'TN-2025-0912'
  );

  const displayCases = assignedCases.length > 0 ? assignedCases : cases.slice(0, 5);
  const [selectedCase, setSelectedCase] = useState<VictimCase>(displayCases[0] || cases[0]);
  const [sessionNote, setSessionNote] = useState('');
  const [quickFollowUpDate, setQuickFollowUpDate] = useState('Tomorrow 10:00 AM');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionNote.trim()) return;

    addTimelineMilestone(selectedCase.id, {
      title: 'Clinical Caseworker Note: Dr. Kavita Singhania',
      date: 'Today',
      category: 'counselling',
      description: sessionNote.trim(),
      status: 'completed',
      officerOrProvider: 'Dr. Kavita Singhania (Counsellor)',
    });

    setSessionNote('');
    setActionSuccessMsg('Clinical session note saved to case timeline.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleQuickAssignCounselling = () => {
    addIntervention({
      caseId: selectedCase.id,
      victimName: unmaskPII ? selectedCase.fullName : selectedCase.maskedName,
      type: 'Counselling Support',
      status: 'In Progress',
      assignedTo: 'Dr. Kavita Singhania',
      dateInitiated: 'Today',
      frequency: 'Daily Trauma Stabilization Sessions',
      outcomes: 'Caseworker initiated 1-on-1 trauma care and safety plan.',
      aiSuggested: false,
    });
    setActionSuccessMsg('Counselling Support intervention created.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleQuickScheduleFollowUp = () => {
    addFollowUp({
      caseId: selectedCase.id,
      scheduledDate: quickFollowUpDate,
      type: 'Clinical Check-in',
      assignedTo: 'Dr. Kavita Singhania',
      status: 'Pending',
      notes: 'Scheduled telephonic grounding & safety review session.',
    });
    setActionSuccessMsg('Follow-up scheduled in central case calendar.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Counsellor alerts
  const counsellorAlerts = alerts.filter(
    (a) => a.caseId === selectedCase.id || a.assignedReviewer.toLowerCase().includes('kavita')
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Caseworker Workspace
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
            Dr. Kavita Singhania, Clinical Psychologist
          </h1>
          <p className="text-teal-100 text-xs md:text-sm mt-1">
            Nodal Caseworker Supervision • {displayCases.length} Active Survivor Cases Under Direct Care
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('chat_spc')}
            className="px-4 py-2 bg-white text-teal-800 font-bold rounded-xl text-xs hover:bg-teal-50 transition shadow-sm"
          >
            Review AI Chats
          </button>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/30 transition"
          >
            Dispatch Crisis Team (112)
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-teal-900 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Caseload stats (Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400">Total Active Caseload</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{displayCases.length}</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">100% check-in telemetry active</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400">High Risk Priority</p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {displayCases.filter((c) => c.distressScore >= 60 || c.status === 'High Risk' || c.status === 'Escalating').length}
          </p>
          <p className="text-[10px] text-rose-600 font-bold mt-1">Requires daily monitoring</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400">Active Interventions</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {interventions.filter((i) => i.assignedTo.includes('Kavita')).length || interventions.length}
          </p>
          <p className="text-[10px] text-indigo-600 font-bold mt-1">Counselling &amp; legal companions</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400">Scheduled Follow-ups</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {followUps.filter((f) => f.status === 'Pending').length}
          </p>
          <p className="text-[10px] text-slate-500 font-bold mt-1">Next review tomorrow 10:00 AM</p>
        </div>
      </div>

      {/* Main Grid: Assigned Cases & Clinical Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Assigned Cases Queue */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Priority Clinical Queue</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {displayCases.length} Cases
            </span>
          </div>

          <div className="space-y-2">
            {displayCases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-teal-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {c.id}
                      </span>
                      <span className="font-bold text-slate-900">
                        {unmaskPII ? c.fullName : c.maskedName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.distressScore >= 75 ? 'bg-rose-100 text-rose-700' :
                        c.distressScore >= 50 ? 'bg-amber-100 text-amber-700' :
                        'bg-teal-100 text-teal-700'
                      }`}>
                        DDS {c.distressScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 truncate">{c.category}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                    <span>District: {c.district}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c);
                      }}
                      className="text-teal-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Open Case Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Clinical Review & Working Actions */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Case Header Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    {unmaskPII ? selectedCase.fullName : selectedCase.maskedName} ({selectedCase.id})
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedCase.safetyState === 'SAFETY_CONCERN' ? 'bg-amber-100 text-amber-800' :
                    selectedCase.safetyState === 'URGENT_REVIEW' ? 'bg-orange-100 text-orange-800' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {selectedCase.safetyState.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {selectedCase.category} · {selectedCase.district}, {selectedCase.state} · Stage: {selectedCase.stage}
                </p>
              </div>

              <button
                onClick={() => onSelectCase(selectedCase)}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-2xs transition self-start sm:self-auto"
              >
                Open Full Dossier &rarr;
              </button>
            </div>

            {/* Quick Human Review Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">Intervention Stream</span>
                <p className="text-[11px] text-slate-500">Deploy clinical psychosocial support protocol to case.</p>
                <button
                  onClick={handleQuickAssignCounselling}
                  className="w-full py-2 bg-white hover:bg-teal-50 border border-slate-200 text-teal-800 font-bold rounded-xl transition shadow-2xs"
                >
                  Assign Counselling Support
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">Schedule Clinical Follow-up</span>
                <input
                  type="text"
                  value={quickFollowUpDate}
                  onChange={(e) => setQuickFollowUpDate(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium"
                />
                <button
                  onClick={handleQuickScheduleFollowUp}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-2xs"
                >
                  Confirm Follow-up Date
                </button>
              </div>
            </div>

            {/* Add Clinical Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-800 text-[11px] block">
                Record Clinical Supervision Note (Appends to Case Timeline)
              </label>
              <textarea
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                placeholder="Log observation on survivor emotional state, court apprehension, grounding exercises, or safety coordination..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-teal-600 text-xs"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!sessionNote.trim()}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 disabled:opacity-40 text-white font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Note to Case Timeline</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Alerts for this Caseworker */}
          {counsellorAlerts.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-xs">Active Triage Alerts for Caseworker Review</h4>
              <div className="space-y-2">
                {counsellorAlerts.map((alt) => (
                  <div key={alt.id} className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-700">{alt.headline}</span>
                      <span className="text-[10px] text-slate-400">{alt.timeAgo}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{alt.description}</p>
                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span className="text-slate-500">Case: <strong>{alt.caseId}</strong></span>
                      <button
                        onClick={() => resolveAlert(alt.id)}
                        className="text-teal-700 font-bold hover:underline"
                      >
                        {alt.actionTaken ? 'Resolved ✓' : 'Mark Reviewed &amp; Close Alert'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
