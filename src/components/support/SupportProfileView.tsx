import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Shield, Heart, Scale, DollarSign, Users, Briefcase, Home, CheckCircle2 } from 'lucide-react';

export const SupportProfileView: React.FC = () => {
  const { selectedCase, unmaskPII } = useApp();
  const profile = selectedCase.supportProfile || {
    psychological: 74,
    safety: 55,
    legalCourtStress: 58,
    financialSupport: 28,
    socialSupport: 25,
    rehabilitationNeeds: 52,
    familyImpact: 32,
  };

  const getPillarLevel = (score: number) => {
    if (score === 0) return 'Unknown / Insufficient Data';
    if (score >= 65) return 'High Need';
    if (score >= 40) return 'Moderate Need';
    return 'Low Need';
  };

  const pillars = [
    {
      id: 'psychological',
      title: 'Psychological Well-being',
      score: profile.psychological,
      level: getPillarLevel(profile.psychological),
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50 border-rose-200',
      icon: Heart,
      desc: 'Evaluates post-incident trauma, sleep disturbance, hypervigilance, and acute court apprehension.',
      intervention: `Assigned caseworker: ${selectedCase.assignedCounsellor}. Cognitive grounding and coping stabilization active.`,
    },
    {
      id: 'safety',
      title: 'Safety & Physical Security',
      score: profile.safety,
      level: getPillarLevel(profile.safety),
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgLight: 'bg-orange-50 border-orange-200',
      icon: Shield,
      desc: 'Monitors threat environment, suspicious perimeter activity, and intimidation attempts against survivor.',
      intervention: `${selectedCase.policeStation} regular picket patrolling; Special Witness Protection escort on court dates.`,
    },
    {
      id: 'legal',
      title: 'Legal / Court Stress',
      score: profile.legalCourtStress,
      level: getPillarLevel(profile.legalCourtStress),
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50 border-purple-200',
      icon: Scale,
      desc: `Anxiety centered around upcoming hearing (${selectedCase.nextHearingDate || 'Scheduled date'}) at ${selectedCase.courtName}.`,
      intervention: 'Free legal representation via DLSA Front Office; pre-trial orientation scheduled.',
    },
    {
      id: 'financial',
      title: 'Financial Vulnerability',
      score: profile.financialSupport,
      level: getPillarLevel(profile.financialSupport),
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50 border-blue-200',
      icon: DollarSign,
      desc: 'Statutory compensation entitlement under SC/ST (PoA) Act Rules and Central Victim Compensation Fund.',
      intervention: 'Interim relief grant verification being expedited with District Welfare Officer.',
    },
    {
      id: 'social',
      title: 'Social & Community Support',
      score: profile.socialSupport,
      level: getPillarLevel(profile.socialSupport),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50 border-emerald-200',
      icon: Users,
      desc: 'Assesses community stigmatization, caregiver isolation, and family resilience buffer.',
      intervention: 'Local One Stop Centre (OSC) support group connectivity and family counselling.',
    },
    {
      id: 'rehabilitation',
      title: 'Rehabilitation Needs',
      score: profile.rehabilitationNeeds,
      level: getPillarLevel(profile.rehabilitationNeeds),
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50 border-teal-200',
      icon: Briefcase,
      desc: 'Livelihood continuity, vocational training, and long-term socio-economic independence.',
      intervention: 'PMKVY vocational skilling quota referral initiated with monthly training stipend.',
    },
    {
      id: 'family',
      title: 'Family Impact & Dependents',
      score: profile.familyImpact,
      level: getPillarLevel(profile.familyImpact),
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50 border-amber-200',
      icon: Home,
      desc: 'Educational continuity of children, dependent elderly care, and household stability.',
      intervention: 'Child educational allowance application submitted to Department of Social Welfare.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold text-slate-900">7-Pillar Multi-Dimensional Support Profile</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Case {selectedCase.id} • {unmaskPII ? selectedCase.fullName : selectedCase.maskedName} • Comprehensive human vulnerability assessment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Overall DDS: <strong className="text-teal-800">{selectedCase.distressScore}/100</strong>
          </span>
        </div>
      </div>

      {/* Grid of 7 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-3 flex flex-col justify-between text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-xs">{pillar.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${pillar.textColor} bg-slate-50 border border-slate-200`}>
                    {pillar.level}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                    <span>Intensity Level</span>
                    <span className="font-bold text-slate-800">{pillar.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${pillar.color} h-2 rounded-full transition-all`} style={{ width: `${pillar.score}%` }} />
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 p-3 rounded-b-2xl text-[10px] text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Active Intervention:</span>
                <span>{pillar.intervention}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
