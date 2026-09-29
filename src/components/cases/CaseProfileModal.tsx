import React, { useState } from 'react';
import { VictimCase, SafetyState, DistressState } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  AlertTriangle,
  Heart,
  Shield,
  Clock,
  Phone,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Minus,
  TrendingDown,
  Info,
  HelpCircle,
} from 'lucide-react';

interface CaseProfileModalProps {
  caseData: VictimCase;
  onClose: () => void;
  onOpenEmergency: () => void;
}

export const CaseProfileModal: React.FC<CaseProfileModalProps> = ({
  caseData,
  onClose,
  onOpenEmergency,
}) => {
  const {
    unmaskPII,
    assignCounsellorToCase,
    addIntervention,
    addFollowUp,
    alerts,
    interventions,
    followUps,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'distress_trend' | 'safety' | 'support_profile' | 'interactions' | 'explanation' | 'interventions'
  >('overview');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [counsellorInput, setCounsellorInput] = useState(caseData.assignedCounsellor || 'Dr. Kavita Singhania');
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('2025-06-28');
  const [followUpType, setFollowUpType] = useState<'Clinical Check-in' | 'Legal Status Review' | 'Safety Verification' | 'Compensation Follow-up'>('Clinical Check-in');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [reviewMarked, setReviewMarked] = useState(false);
  const [contactInitiated, setContactInitiated] = useState(false);

  // Relevant alerts for this case
  const caseAlerts = alerts.filter((a) => a.caseId === caseData.id);
  const caseInterventions = interventions.filter((i) => i.caseId === caseData.id);
  const caseFollowUps = followUps.filter((f) => f.caseId === caseData.id);

  const getSafetyBadge = (st: SafetyState) => {
    switch (st) {
      case 'CRITICAL_SAFETY_PROTOCOL':
        return { label: 'CRITICAL SAFETY PROTOCOL', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'URGENT_REVIEW':
        return { label: 'URGENT REVIEW REQUIRED', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'SAFETY_CONCERN':
        return { label: 'SAFETY CONCERN CONFIRMED', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'NO_CRITICAL_SIGNAL':
        return { label: 'NO CRITICAL SIGNAL', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      default:
        return { label: 'SAFETY STATE: UNKNOWN', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const safetyBadge = getSafetyBadge(caseData.safetyState);

  const handleAssignCounsellor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counsellorInput.trim()) return;
    assignCounsellorToCase(caseData.id, counsellorInput.trim());
    setShowAssignModal(false);
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    addFollowUp({
      caseId: caseData.id,
      scheduledDate: followUpDate,
      type: followUpType,
      assignedTo: caseData.assignedCounsellor || 'Dr. Kavita Singhania',
      status: 'Pending',
      notes: followUpNotes || 'Scheduled human caseworker review.',
    });
    setShowFollowUpModal(false);
    setFollowUpNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 animate-in fade-in flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 sticky top-0 z-20 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {caseData.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${safetyBadge.bg}`}>
                {safetyBadge.label}
              </span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-900/40 px-2 py-0.5 rounded border border-amber-600/40">
                DEMO CASE PROFILE
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {unmaskPII ? caseData.fullName : caseData.maskedName}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
              <span>{caseData.category}</span>
              <span>·</span>
              <span>{caseData.district}, {caseData.state}</span>
              <span>·</span>
              <span>Stage: {caseData.stage}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Disclaimer Banner */}
        <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-2 flex items-center justify-between text-[11px] text-amber-900 font-medium">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Clinical &amp; Legal Stance:</strong> Dynamic Distress Score (DDS) is a monitoring &amp; prioritisation indicator — <strong>NOT a clinical diagnosis</strong>. Authorised human professionals review all signals.
            </span>
          </div>
          <span className="font-bold text-[10px] text-amber-800 uppercase tracking-wider shrink-0 hidden sm:inline">
            Non-Diagnostic
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-slate-50/60 overflow-x-auto text-xs font-bold text-slate-600">
          {[
            { id: 'overview', label: 'A. Overview' },
            { id: 'distress_trend', label: 'B. Distress Timeline' },
            { id: 'safety', label: 'C. Safety State' },
            { id: 'support_profile', label: 'D. Support Profile' },
            { id: 'interactions', label: 'E. Interactions' },
            { id: 'explanation', label: 'F. AI Explanation' },
            { id: 'interventions', label: 'G. Interventions & Follow-ups' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-900 bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 text-xs">
          {/* TAB A: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Key Indicator Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Current DDS</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">{caseData.distressScore}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold mt-1">
                    {caseData.trend === 'up' && <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> Increasing</span>}
                    {caseData.trend === 'stable' && <span className="text-slate-500 flex items-center"><Minus className="w-3.5 h-3.5" /> Stable</span>}
                    {caseData.trend === 'down' && <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> Decreasing</span>}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Distress State</span>
                  <p className="text-lg font-black text-slate-900 mt-1">{caseData.distressState}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">
                    Prev: {caseData.previousScore ?? 42}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Data Quality</span>
                  <p className="text-lg font-black text-teal-800 mt-1">{caseData.dataQuality}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">
                    Confidence: {caseData.confidenceScore}%
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Counsellor</span>
                  <p className="text-xs font-black text-slate-900 mt-1 truncate">{caseData.assignedCounsellor}</p>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="text-[10px] text-teal-700 font-bold hover:underline mt-1 block"
                  >
                    Reassign Caseworker &rarr;
                  </button>
                </div>
              </div>

              {/* Case Metadata */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                  Judicial &amp; Administrative Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-semibold">FIR Number:</span>
                    <p className="font-bold text-slate-900">{caseData.firNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Jurisdictional Police Station:</span>
                    <p className="font-bold text-slate-900">{caseData.policeStation}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Sessions Court:</span>
                    <p className="font-bold text-slate-900">{caseData.courtName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Next Scheduled Hearing:</span>
                    <p className="font-bold text-slate-900">{caseData.nextHearingDate || 'Pending'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Engagement Status:</span>
                    <p className="font-bold text-slate-900">{caseData.engagementStatus}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Next Review Date:</span>
                    <p className="font-bold text-slate-900">{caseData.followUpDate || '26 Jun 2025'}</p>
                  </div>
                </div>
              </div>

              {/* Caseworker Notes */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">
                  Confidential Caseworker Observations
                </h4>
                <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed font-medium">
                  {caseData.notes}
                </p>
              </div>
            </div>
          )}

          {/* TAB B: DISTRESS TIMELINE & LONGITUDINAL TREND */}
          {activeTab === 'distress_trend' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Longitudinal Distress Timeline</h3>
                  <p className="text-slate-500 text-[11px]">Monthly tracking of calculated demonstration distress indicators.</p>
                </div>

                {caseData.trend === 'up' && (
                  <div className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Emerging increase in distress indicators</span>
                  </div>
                )}
              </div>

              {/* Data Table of Longitudinal Points */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3 text-center">Score</th>
                      <th className="py-2.5 px-3">State</th>
                      <th className="py-2.5 px-3">Engagement</th>
                      <th className="py-2.5 px-3">Safety Signals Logged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {caseData.distressHistory.map((dp, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{dp.month}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${
                            dp.score >= 75 ? 'bg-rose-100 text-rose-700' :
                            dp.score >= 50 ? 'bg-amber-100 text-amber-700' :
                            dp.score > 0 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {dp.score}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-[11px]">{dp.distressState}</span>
                        </td>
                        <td className="py-2.5 px-3">{dp.engagement}</td>
                        <td className="py-2.5 px-3 text-slate-600">{dp.safetySignal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                Longitudinal velocity: <strong className="text-slate-800">{caseData.trendVelocity || '+1.2 pts/wk'}</strong> · Persistence: <strong className="text-slate-800">{caseData.persistenceDays || 20} days</strong>.
              </div>
            </div>
          )}

          {/* TAB C: SAFETY STATUS */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border space-y-2 bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Separate Safety State
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${safetyBadge.bg}`}>
                    {safetyBadge.label}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Safety decisions are governed by deterministic human-in-the-loop rules, never by an unconstrained LLM alone. Immediate safety concerns require human review and inter-agency police coordination.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Threat Level</span>
                  <p className="text-lg font-black text-rose-600">{caseData.threatLevel}</p>
                  <p className="text-[11px] text-slate-500">Jurisdictional police station on patrol notice.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Missed Check-ins</span>
                  <p className="text-lg font-black text-slate-900">{caseData.missedCheckInsCount}</p>
                  <p className="text-[11px] text-slate-500">Automated wellness prompts unanswered.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onOpenEmergency}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>Activate Critical Safety Protocol (112)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB D: SUPPORT PROFILE (7 DIMENSIONS) */}
          {activeTab === 'support_profile' && (
            <div className="space-y-4">
              <p className="text-slate-500 text-[11px]">
                7 Dimensions evaluated through confirmed human-in-the-loop signals:
              </p>

              <div className="space-y-2.5">
                {[
                  { key: 'psychological', label: 'Psychological Well-being', val: caseData.supportProfile.psychological, level: 'High' },
                  { key: 'safety', label: 'Safety & Security', val: caseData.supportProfile.safety, level: 'Moderate' },
                  { key: 'legalCourtStress', label: 'Legal / Court Stress', val: caseData.supportProfile.legalCourtStress, level: 'Moderate' },
                  { key: 'financialSupport', label: 'Financial Support', val: caseData.supportProfile.financialSupport, level: 'Low' },
                  { key: 'socialSupport', label: 'Social Support', val: caseData.supportProfile.socialSupport, level: 'Low' },
                  { key: 'rehabilitationNeeds', label: 'Rehabilitation Needs', val: caseData.supportProfile.rehabilitationNeeds, level: 'Moderate' },
                  { key: 'familyImpact', label: 'Family Impact', val: caseData.supportProfile.familyImpact, level: 'Low' },
                ].map((dim) => (
                  <div key={dim.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{dim.label}</span>
                      <span className="font-black text-teal-800">{dim.level} ({dim.val}/100)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${dim.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB E: INTERACTIONS & CONFIRMED SIGNALS */}
          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Interaction History &amp; Confirmed Signals</h3>

              <div className="space-y-2.5">
                {caseData.interactions.length > 0 ? (
                  caseData.interactions.map((ix) => (
                    <div key={ix.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span className="uppercase text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                          {ix.type} interaction
                        </span>
                        <span>{ix.date}</span>
                      </div>
                      <p className="font-medium text-slate-800">{ix.summary}</p>
                      <div className="flex gap-1 pt-1">
                        {ix.extractedSignals.map((s, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                            #{s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No historical interaction sessions logged.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB F: AI EXPLANATION */}
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider">
                  Why was this case flagged by SPC?
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  The automated signal detection engine identified the following contributing indicators for human caseworker review:
                </p>
                <div className="space-y-1.5 pt-1">
                  {(caseData.flaggingReasons || [
                    'Distress indicators increased from baseline',
                    'Missed scheduled morning check-in',
                    'Engagement frequency reduced',
                    'Pre-trial court proximity stress',
                  ]).map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                <strong>Disclaimer:</strong> These are contributing indicators, not proof of causation. They are designed to prioritize human review, not replace human judgment.
              </div>
            </div>
          )}

          {/* TAB G: INTERVENTIONS & FOLLOW-UPS */}
          {activeTab === 'interventions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Interventions &amp; Follow-up Queue</h3>
                <button
                  onClick={() => setShowFollowUpModal(true)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs"
                >
                  Schedule Follow-up
                </button>
              </div>

              {/* Interventions list */}
              <div className="space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Active Interventions</span>
                {caseInterventions.map((inv) => (
                  <div key={inv.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{inv.type}</p>
                      <p className="text-[11px] text-slate-500">Provider: {inv.assignedTo} · {inv.frequency}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-100 text-teal-800">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Follow-ups list */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Scheduled Follow-ups</span>
                {caseFollowUps.map((fu) => (
                  <div key={fu.id} className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{fu.type} ({fu.scheduledDate})</p>
                      <p className="text-[11px] text-slate-500">{fu.notes}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800">
                      {fu.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Human Review Actions Footer (Section 3.J) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Human Caseworker Actions:</span>
            {reviewMarked && (
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Reviewed by Human
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setContactInitiated(true);
                setTimeout(() => setContactInitiated(false), 4000);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              {contactInitiated ? (
                <span className="text-emerald-700 font-bold">Calling {caseData.maskedName}...</span>
              ) : (
                <span>Contact</span>
              )}
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Assign Counsellor
            </button>
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Create Follow-up
            </button>
            <button
              onClick={() => setReviewMarked(true)}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm"
            >
              Mark Reviewed
            </button>
          </div>
        </div>
      </div>

      {/* Assign Counsellor Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Assign Designated Caseworker</h4>
            <form onSubmit={handleAssignCounsellor} className="space-y-3">
              <input
                type="text"
                value={counsellorInput}
                onChange={(e) => setCounsellorInput(e.target.value)}
                placeholder="Counsellor Name..."
                className="w-full p-2.5 border rounded-xl text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 border rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-xl text-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Schedule Closed-Loop Follow-up</h4>
            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Type</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value as any)}
                  className="w-full p-2 border rounded-xl"
                >
                  <option value="Clinical Check-in">Clinical Check-in</option>
                  <option value="Legal Status Review">Legal Status Review</option>
                  <option value="Safety Verification">Safety Verification</option>
                  <option value="Compensation Follow-up">Compensation Follow-up</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Notes</label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Focus areas for follow-up..."
                  className="w-full p-2 border rounded-xl"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-3 py-1.5 border rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-xl text-xs"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
