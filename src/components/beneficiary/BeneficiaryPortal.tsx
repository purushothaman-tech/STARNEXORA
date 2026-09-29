import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockSupportCenters } from '../../data/mockData';
import { AppModule, SupportedLanguage } from '../../types';
import {
  Heart,
  AlertCircle,
  Clock,
  Calendar,
  ChevronRight,
  MessageSquare,
  PhoneCall,
  MessageCircle,
  UserCheck,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Smile,
  Shield,
  HelpCircle,
  CheckCircle2,
  X,
  FileText,
  Sliders,
  Volume2,
} from 'lucide-react';

interface BeneficiaryPortalProps {
  onNavigate: (module: AppModule) => void;
  onOpenEmergency: () => void;
}

export const BeneficiaryPortal: React.FC<BeneficiaryPortalProps> = ({ onNavigate, onOpenEmergency }) => {
  const {
    cases,
    currentLanguage,
    setLanguage,
    interventions,
    followUps,
    alerts,
    confirmSignalForCase,
    addInteractionToCase,
    consent,
    updateConsent,
    accessibility,
    speakText,
  } = useApp();

  const [trendFilter, setTrendFilter] = useState<'1 Month' | '3 Months' | '6 Months'>('1 Month');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Check-in questionnaire state
  const [checkInStep, setCheckInStep] = useState(1);
  const [q1Mood, setQ1Mood] = useState<string | null>(null);
  const [q2Safe, setQ2Safe] = useState<string | null>(null);
  const [q3Worry, setQ3Worry] = useState<string | null>(null);
  const [q4Legal, setQ4Legal] = useState<string | null>(null);
  const [q5Counsellor, setQ5Counsellor] = useState<string | null>(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);

  // Resolve active beneficiary case (SAH-DEMO-001 or first case)
  const bCase = cases.find((c) => c.id === 'SAH-DEMO-001' || c.id === 'TN-2025-0912') || cases[0];

  // Relevant interventions and followups for Asha
  const ashaInterventions = interventions.filter((i) => i.caseId === bCase.id);
  const ashaFollowUps = followUps.filter((f) => f.caseId === bCase.id && f.status === 'Pending');
  const hasActiveAlert = alerts.some((a) => a.caseId === bCase.id && !a.actionTaken);
  const hasReviewedIntervention = ashaInterventions.some((i) => i.status === 'In Progress' || i.status === 'Assigned');

  const handleCompleteCheckIn = () => {
    // Record interaction
    addInteractionToCase(bCase.id, {
      type: 'chat',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      summary: `Periodic check-in: Mood: ${q1Mood || 'Unspecified'}, Safe: ${q2Safe || 'Unspecified'}, Worry: ${q3Worry || 'None'}, Counsellor: ${q5Counsellor || 'No'}`,
      extractedSignals: [
        ...(q1Mood === 'Anxious' || q1Mood === 'Scared' ? ['anxiety'] : []),
        ...(q2Safe === 'No' ? ['safety_concern'] : []),
        ...(q3Worry === 'Court Hearing' ? ['legal_stress'] : []),
      ],
      status: 'completed',
    });

    // If beneficiary answered not feeling safe, confirm safety signal
    if (q2Safe === 'No') {
      confirmSignalForCase(bCase.id, {
        type: 'safety_concern',
        label: 'Periodic check-in: Beneficiary reported not feeling safe right now',
        source: 'checkin',
        confidence: 0.95,
        userConfirmed: true,
        notes: 'Beneficiary answered NO to immediate safety inquiry.',
      });
    } else if (q1Mood === 'Anxious' || q1Mood === 'Scared') {
      confirmSignalForCase(bCase.id, {
        type: 'anxiety',
        label: `Periodic check-in: Beneficiary reported feeling ${q1Mood.toLowerCase()}`,
        source: 'checkin',
        confidence: 0.90,
        userConfirmed: true,
      });
    }

    setCheckInSubmitted(true);
    setTimeout(() => {
      setShowCheckInModal(false);
      setCheckInSubmitted(false);
      setCheckInStep(1);
    }, 1800);
  };

  const getWellbeingText = (score: number) => {
    if (score >= 75) return { status: 'High Support Needed', color: 'text-rose-600', bg: 'bg-rose-50', badge: 'High' };
    if (score >= 50) return { status: 'Elevated Support Needed', color: 'text-orange-600', bg: 'bg-orange-50', badge: 'Elevated' };
    if (score >= 35) return { status: 'Moderate / Stable', color: 'text-amber-600', bg: 'bg-amber-50', badge: 'Moderate' };
    return { status: 'Stable & Safe', color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'Stable' };
  };

  const wb = getWellbeingText(bCase.distressScore);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner (Trauma-Informed & Gentle) */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/70 to-pink-50 rounded-3xl p-6 md:p-8 border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200">
              PROTECTED SURVIVOR PORTAL
            </span>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200">
              CONFIDENTIAL &amp; SAFE
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {bCase.maskedName} 🌿
          </h1>
          <p className="mt-1 text-slate-600 font-medium text-sm md:text-base">
            You are stronger than you think. We are here to support you at every step.
          </p>

          {/* Quick Check-in trigger */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>How are you feeling today? (Quick Check-in)</span>
            </button>
            <button
              onClick={() => setShowConsentModal(true)}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-purple-900 border border-purple-200 rounded-xl text-xs font-semibold shadow-2xs transition"
            >
              Consent Preferences
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-purple-900 border border-purple-200 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Accessibility Settings</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Language selector */}
          <div className="bg-white/90 border border-purple-200 rounded-xl px-3 py-1.5 text-xs font-bold text-purple-900 flex items-center gap-1.5 shadow-2xs">
            <span>🌐</span>
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="bg-white/90 border border-purple-200 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-2xs hidden sm:flex items-center gap-1.5">
            <span>Every step forward is progress</span>
            <span>💛</span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Notifications (Non-Technical & Supportive) */}
      {hasReviewedIntervention && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between text-xs text-teal-950 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-teal-900">Your support request has been reviewed.</p>
              <p className="text-teal-700 mt-0.5">
                Caseworker <strong>{bCase.assignedCounsellor}</strong> has been assigned to support you. Active care protocol: {bCase.interventionStatus || 'Counselling & Legal Escort'}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('case_timeline')}
            className="px-3 py-1.5 bg-white text-teal-800 border border-teal-300 font-bold rounded-xl hover:bg-teal-100 transition shrink-0 ml-3"
          >
            View Status &rarr;
          </button>
        </div>
      )}

      {hasActiveAlert && !hasReviewedIntervention && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between text-xs text-purple-950 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-purple-900">
                Your recent check-ins suggest that you may benefit from additional support.
              </p>
              <p className="text-purple-700 mt-0.5">
                Our care coordinator Dr. Kavita Singhania is reviewing your profile to schedule supportive check-ins and legal assistance.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('chat_spc')}
            className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shrink-0 ml-3"
          >
            Talk to SPC
          </button>
        </div>
      )}

      {/* Scheduled Follow-Up Reminder */}
      {bCase.followUpDate && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-sky-950">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Next Scheduled Follow-up:</strong> {bCase.followUpDate} with caseworker {bCase.assignedCounsellor}.
            </span>
          </div>
          <span className="text-[11px] font-bold text-sky-700">Scheduled ✓</span>
        </div>
      )}

      {/* 4 Top Cards (Genuinely Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Well-being */}
        <div
          onClick={() => onNavigate('dynamic_distress_score')}
          className="bg-white rounded-2xl p-4 border border-purple-100/80 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shadow-inner">
              <Smile className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">My Well-being Indicator</p>
              <p className="text-base font-extrabold text-slate-900">{wb.status}</p>
              <p className="text-[10px] text-slate-400">DDS {bCase.distressScore}/100 · Non-clinical</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 2: Support Needs */}
        <div
          onClick={() => onNavigate('support_profile')}
          className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base shadow-inner">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-100" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Support Needs</p>
              <p className="text-base font-extrabold text-rose-600">
                {bCase.distressScore >= 60 ? 'Counselling & Escort Active' : '2 areas monitored'}
              </p>
              <p className="text-[10px] text-slate-400">Legal &amp; Psychological Support</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 3: Next Check-in */}
        <div
          onClick={() => setShowCheckInModal(true)}
          className="bg-white rounded-2xl p-4 border border-amber-100/80 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shadow-inner">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Next Welfare Check-in</p>
              <p className="text-base font-extrabold text-slate-900">Thursday, 11:00 AM</p>
              <p className="text-[10px] text-slate-400">Via {consent.communicationPreference.toUpperCase()}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 4: Upcoming Court Date */}
        <div
          onClick={() => onNavigate('case_timeline')}
          className="bg-white rounded-2xl p-4 border border-emerald-100/80 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shadow-inner">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Upcoming Court Date</p>
              <p className="text-base font-extrabold text-slate-900">{bCase.nextHearingDate || '10 Jul 2025'}</p>
              <p className="text-[10px] text-slate-400">Legal companion assigned</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
        </div>
      </div>

      {/* Middle Row: Longitudinal Well-being Trend + Support Profile Progress + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Well-being Trend */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Well-being Monitoring Trend</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 p-0.5 rounded-lg">
                {(['1 Month', '3 Months', '6 Months'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendFilter(r)}
                    className={`px-2 py-0.5 rounded-md transition ${trendFilter === r ? 'bg-white text-purple-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-44 relative flex items-end pt-4">
              <svg viewBox="0 0 360 160" className="w-full h-full overflow-visible">
                <line x1="20" y1="40" x2="340" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="20" y1="80" x2="340" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="20" y1="120" x2="340" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

                {/* SVG Curve */}
                <path
                  d="M 30,120 Q 90,80 150,110 T 270,90 T 330,85"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {bCase.distressHistory.map((dp, i) => {
                  const cx = 30 + i * 60;
                  const cy = 160 - (dp.score / 100) * 140;
                  return (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                      <text x={cx} y="155" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">
                        {dp.month.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Current: <strong>{bCase.distressScore}/100</strong>
            </span>
            <span className="font-bold text-purple-700">Non-Diagnostic Tracker</span>
          </div>
        </div>

        {/* Middle 4 Cols: Support Profile (7 Dimensions) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Your Support Profile</h3>
            <button
              onClick={() => onNavigate('support_profile')}
              className="text-xs text-purple-600 font-bold hover:underline"
            >
              Full Profile &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Psychological Well-being', icon: '🧠', val: bCase.supportProfile.psychological, text: bCase.supportProfile.psychological >= 60 ? 'High' : 'Moderate', color: 'bg-rose-500' },
              { label: 'Safety & Security', icon: '🛡️', val: bCase.supportProfile.safety, text: bCase.supportProfile.safety >= 60 ? 'High Concern' : 'Moderate', color: 'bg-orange-500' },
              { label: 'Legal / Court Stress', icon: '⚖️', val: bCase.supportProfile.legalCourtStress, text: 'Moderate', color: 'bg-purple-500' },
              { label: 'Financial Vulnerability', icon: '💰', val: bCase.supportProfile.financialSupport, text: 'Low Relief', color: 'bg-blue-500' },
              { label: 'Social & Community Support', icon: '🤝', val: bCase.supportProfile.socialSupport, text: 'Low', color: 'bg-emerald-500' },
              { label: 'Rehabilitation Needs', icon: '🌱', val: bCase.supportProfile.rehabilitationNeeds, text: 'Moderate', color: 'bg-amber-500' },
              { label: 'Family Impact', icon: '🏡', val: bCase.supportProfile.familyImpact, text: 'Low', color: 'bg-rose-400' },
            ].map((p) => (
              <div key={p.label} className="text-xs">
                <div className="flex justify-between items-center mb-0.5 text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </span>
                  <span className={`font-bold text-[10px] ${
                    p.text.includes('High') ? 'text-rose-600' :
                    p.text.includes('Moderate') ? 'text-amber-600' : 'text-blue-600'
                  }`}>
                    {p.text}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
            <span>Evaluated weekly via confirmed check-in cues</span>
            <span className="font-semibold text-purple-600">Updated today</span>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions (4 Big Buttons) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900">Quick Support Actions</h3>
            <p className="text-[11px] text-slate-500">Reach out anytime you need confidential support</p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Action 1: Talk to SPC (Chatbot) */}
            <button
              onClick={() => onNavigate('chat_spc')}
              className="p-3.5 rounded-2xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/80 active:scale-98 transition text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs group-hover:text-purple-700 transition">
                  Talk to SPC
                </h4>
                <p className="text-[10px] text-slate-500">(Support Chat)</p>
              </div>
            </button>

            {/* Action 2: Request a Call (IVRS) */}
            <button
              onClick={() => onNavigate('ivrs_simulation')}
              className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/80 active:scale-98 transition text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 mb-2">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs group-hover:text-emerald-700 transition">
                  Request a Call
                </h4>
                <p className="text-[10px] text-slate-500">(Voice IVRS)</p>
              </div>
            </button>

            {/* Action 3: Send SMS Update */}
            <button
              onClick={() => onNavigate('sms_simulation')}
              className="p-3.5 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/80 active:scale-98 transition text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs group-hover:text-blue-700 transition">
                  Send SMS Update
                </h4>
                <p className="text-[10px] text-slate-500">Two-way text</p>
              </div>
            </button>

            {/* Action 4: Speak to a Counsellor */}
            <button
              onClick={() => onNavigate('counselling_services')}
              className="p-3.5 rounded-2xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100/80 active:scale-98 transition text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-2">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs group-hover:text-amber-700 transition">
                  Speak to Counsellor
                </h4>
                <p className="text-[10px] text-slate-500">{bCase.assignedCounsellor}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Messages + Recommended for You + Support Services Near You */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Messages (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Recent Messages</h3>
              <button
                onClick={() => onNavigate('chat_spc')}
                className="text-xs text-purple-600 font-bold hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-purple-950">
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                    S
                  </div>
                  <span>SPC Support</span>
                </div>
                <span className="text-[10px] text-slate-400">10:30 AM</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                Hello Asha! How have you been feeling lately? We are here to listen. You can share in your preferred language.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('chat_spc')}
            className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition text-center shadow-xs"
          >
            Reply in Chat
          </button>
        </div>

        {/* Recommended for You (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">💡</span>
              <h3 className="text-sm font-bold text-slate-900">Recommended for You</h3>
            </div>
            <button
              onClick={() => onNavigate('schemes_resources')}
              className="text-xs text-purple-600 font-bold hover:underline"
            >
              View All &rarr;
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mb-2">Based on your confirmed support profile</p>

          <div className="space-y-2.5">
            {/* Rec 1 */}
            <div
              onClick={() => onNavigate('counselling_services')}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs group-hover:text-purple-700">Counselling Support</h4>
                  <p className="text-[11px] text-slate-500">Talk to trained clinical caseworker Dr. Kavita</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
            </div>

            {/* Rec 2 */}
            <div
              onClick={() => onNavigate('schemes_resources')}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs group-hover:text-purple-700">Financial Assistance</h4>
                  <p className="text-[11px] text-slate-500">SC/ST (PoA) Act Statutory Relief Tranche 2</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
            </div>

            {/* Rec 3 */}
            <div
              onClick={() => onOpenEmergency()}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs group-hover:text-purple-700">Safety &amp; Protection</h4>
                  <p className="text-[11px] text-slate-500">Witness Protection Picket &amp; Police 112</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
            </div>
          </div>
        </div>

        {/* Support Services Near You (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Support Services Near You</h3>
            <button
              onClick={() => onNavigate('support_services')}
              className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1"
            >
              View Map &rarr;
            </button>
          </div>

          <div className="relative h-24 w-full bg-slate-100 rounded-xl overflow-hidden mb-3 border border-slate-200">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <rect width="300" height="100" fill="#e2e8f0" />
              <path d="M0,40 Q100,50 200,30 T300,60" fill="none" stroke="#cbd5e1" strokeWidth="6" />
              <path d="M120,0 L120,100" fill="none" stroke="#cbd5e1" strokeWidth="4" />
              <path d="M220,0 L220,100" fill="none" stroke="#cbd5e1" strokeWidth="4" />
              <circle cx="80" cy="45" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="150" cy="35" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <circle cx="210" cy="65" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="260" cy="40" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-1 right-2 bg-white/90 px-2 py-0.5 rounded text-[9px] font-bold text-slate-600">
              {bCase.district}, {bCase.state} (Within 5 km)
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {mockSupportCenters.slice(0, 4).map((center) => (
              <div key={center.id} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                  <span className="font-medium truncate max-w-[170px]">{center.name}</span>
                </div>
                <span className="font-bold text-slate-500 text-[11px] shrink-0">{center.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Periodic Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-purple-200 text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Periodic Well-being Check-in</h3>
                <p className="text-[11px] text-slate-500">Confidential, voluntary check-in for {bCase.maskedName}</p>
              </div>
              <button onClick={() => setShowCheckInModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkInSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Thank you, {bCase.maskedName}</h4>
                <p className="text-slate-600 text-xs">Your responses have been securely logged. Your support profile is refreshed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {checkInStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-sm">1. How have you been feeling recently?</p>
                      <button
                        type="button"
                        onClick={() => speakText('How have you been feeling recently?')}
                        className="p-1 text-slate-500 hover:text-purple-700"
                        title="Read question aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Calm & Stable', 'A Bit Stressed', 'Anxious', 'Scared / Overwhelmed'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQ1Mood(opt)}
                          className={`p-3 rounded-xl border text-left font-semibold transition ${
                            q1Mood === opt ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {checkInStep === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-sm">2. Do you feel safe right now?</p>
                      <button
                        type="button"
                        onClick={() => speakText('Do you feel safe right now?')}
                        className="p-1 text-slate-500 hover:text-purple-700"
                        title="Read question aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Yes, Safe', 'No, Feeling Unsafe', 'Not Sure', 'Prefer Not To Say'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQ2Safe(opt.startsWith('Yes') ? 'Yes' : opt.startsWith('No') ? 'No' : opt)}
                          className={`p-3 rounded-xl border text-left font-semibold transition ${
                            q2Safe === (opt.startsWith('Yes') ? 'Yes' : opt.startsWith('No') ? 'No' : opt)
                              ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {checkInStep === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-sm">3. Is anything causing you significant worry?</p>
                      <button
                        type="button"
                        onClick={() => speakText('Is anything causing you significant worry?')}
                        className="p-1 text-slate-500 hover:text-purple-700"
                        title="Read question aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Upcoming Court Date', 'Threats or Intimidation', 'Financial Needs', 'No Major Worry'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQ3Worry(opt)}
                          className={`p-3 rounded-xl border text-left font-semibold transition ${
                            q3Worry === opt ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {checkInStep === 4 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-sm">4. Would you like to speak with your counsellor?</p>
                      <button
                        type="button"
                        onClick={() => speakText('Would you like to speak with your counsellor?')}
                        className="p-1 text-slate-500 hover:text-purple-700"
                        title="Read question aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Yes, Request Call', 'Not Right Now', 'Already in Touch', 'Send Message in Chat'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQ5Counsellor(opt)}
                          className={`p-3 rounded-xl border text-left font-semibold transition ${
                            q5Counsellor === opt ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stress-Sensitive Quick Options (Requirement 20) */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t text-[11px] text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      if (checkInStep < 4) setCheckInStep((s) => s + 1);
                      else handleCompleteCheckIn();
                    }}
                    className="hover:underline font-medium text-slate-600"
                  >
                    Skip Question
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (checkInStep < 4) setCheckInStep((s) => s + 1);
                      else handleCompleteCheckIn();
                    }}
                    className="hover:underline font-medium text-slate-600"
                  >
                    Prefer Not To Answer
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckInModal(false);
                    }}
                    className="hover:underline font-medium text-slate-600"
                  >
                    Pause &amp; Return Later
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-[11px] text-slate-400">Step {checkInStep} of 4</span>
                  <div className="flex gap-2">
                    {checkInStep > 1 && (
                      <button
                        onClick={() => setCheckInStep((s) => s - 1)}
                        className="px-3 py-1.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Back
                      </button>
                    )}
                    {checkInStep < 4 ? (
                      <button
                        onClick={() => setCheckInStep((s) => s + 1)}
                        className="px-4 py-1.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
                      >
                        Next &rarr;
                      </button>
                    ) : (
                      <button
                        onClick={handleCompleteCheckIn}
                        className="px-4 py-1.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-xs"
                      >
                        Submit Check-in
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consent Preferences Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-purple-200 text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Communication &amp; Support Consent</h3>
                <p className="text-[11px] text-slate-500">Ministry of Home Affairs &amp; Social Justice</p>
              </div>
              <button onClick={() => setShowConsentModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-slate-700 leading-relaxed">
                SPC monitors well-being signals with your voluntary consent. You have full control over check-in channels and language.
              </p>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-2">
                <span className="font-bold text-purple-900 block">Preferred Check-in Channel:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['chat', 'ivrs', 'sms'] as const).map((channel) => (
                    <button
                      key={channel}
                      onClick={() => updateConsent(true, channel, currentLanguage)}
                      className={`p-2 rounded-lg border text-center font-bold uppercase text-[11px] transition ${
                        consent.communicationPreference === channel
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">Emergency Dispatch Authorization</span>
                  <span className="text-[10px] text-slate-500">Allow SPC to alert Police 112 if SOS is triggered</span>
                </div>
                <input
                  type="checkbox"
                  checked={consent.emergencyContactAuthorized}
                  readOnly
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-xs"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
