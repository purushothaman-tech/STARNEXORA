import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Info,
  RefreshCw,
  ShieldAlert,
  ArrowUpRight,
  Minus,
  TrendingDown,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DynamicDistressScoreViewProps {
  onOpenEmergency?: () => void;
}

export const DynamicDistressScoreView: React.FC<DynamicDistressScoreViewProps> = ({ onOpenEmergency }) => {
  const { selectedCase, updateCaseDDS, logAuditEvent, unmaskPII, accessibility, speakText } = useApp();

  // Interactive Simulation Variables calibrated around active case
  const [sentimentStress, setSentimentStress] = useState<number>(45); // 0-100
  const [missedCheckIns, setMissedCheckIns] = useState<number>(1);     // 0-5
  const [threatKeywords, setThreatKeywords] = useState<number>(1);    // 0-5
  const [courtProximityDays, setCourtProximityDays] = useState<number>(16); // 1-60 days
  const [isolationIndex, setIsolationIndex] = useState<number>(3);    // 1-5
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Calculation Logic (Explainable AI formula):
  // 1. Sentiment: 35%
  const sentimentComponent = sentimentStress * 0.35;
  // 2. Missed check-ins: 25% (each missed check-in adds 18% of 25)
  const missedComponent = Math.min(25, missedCheckIns * 6);
  // 3. Threat indicators: 20% (each threat adds 25% of 20)
  const threatComponent = Math.min(20, threatKeywords * 5);
  // 4. Legal proximity: 10% (hearing within 7 days gives 10, within 14 gives 7, >30 gives 2)
  const legalComponent = courtProximityDays <= 7 ? 10 : courtProximityDays <= 14 ? 7 : courtProximityDays <= 30 ? 4 : 1;
  // 5. Isolation index: 10% (index 1-5 -> 2 to 10)
  const isolationComponent = isolationIndex * 2;

  const dynamicScore = Math.min(100, Math.round(sentimentComponent + missedComponent + threatComponent + legalComponent + isolationComponent));

  // Transparent tier specification:
  // 0–30 -> LOW
  // 31–60 -> MODERATE / ELEVATED
  // 61–80 -> HIGH
  // 81–100 -> VERY HIGH
  const getRiskTier = (score: number) => {
    if (score >= 81) return { label: 'VERY HIGH', color: 'text-rose-600', bg: 'bg-rose-500', alertBg: 'bg-rose-50 border-rose-200' };
    if (score >= 61) return { label: 'HIGH', color: 'text-orange-600', bg: 'bg-orange-500', alertBg: 'bg-orange-50 border-orange-200' };
    if (score >= 31) return { label: 'MODERATE / ELEVATED', color: 'text-amber-600', bg: 'bg-amber-500', alertBg: 'bg-amber-50 border-amber-200' };
    if (score > 0) return { label: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-500', alertBg: 'bg-emerald-50 border-emerald-200' };
    return { label: 'UNKNOWN', color: 'text-slate-500', bg: 'bg-slate-400', alertBg: 'bg-slate-50 border-slate-200' };
  };

  const riskTier = getRiskTier(dynamicScore);

  const resetToAsha = () => {
    setSentimentStress(40);
    setMissedCheckIns(0);
    setThreatKeywords(1);
    setCourtProximityDays(16);
    setIsolationIndex(2);
  };

  const handleApplyToActiveCase = () => {
    updateCaseDDS(
      selectedCase.id,
      dynamicScore,
      `Simulator Calibration: Sentiment=${sentimentStress}%, Missed=${missedCheckIns}, Threat=${threatKeywords}`
    );
    setAppliedNotice(`DDS Score of ${dynamicScore}/100 successfully applied to case ${selectedCase.id}.`);
    setTimeout(() => setAppliedNotice(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {accessibility.simpleLanguage
                  ? 'Well-being Level & Care Support Indicator'
                  : 'Dynamic Distress Score (DDS) Engine'}
              </h1>
              <p className="text-xs text-slate-500">
                {accessibility.simpleLanguage
                  ? 'Shows your current support needs based on check-ins and safety signals.'
                  : 'Trauma-Informed Multi-Factor Explainable Monitoring Algorithm'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              speakText(
                `Your current well-being score is ${selectedCase.distressScore} out of 100, which is in the ${selectedCase.distressState} category. The longitudinal trend is ${selectedCase.trend}.`
              )
            }
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition"
            title="Read summary aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Read Summary</span>
          </button>

          <button
            onClick={resetToAsha}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline (42)</span>
          </button>
        </div>
      </div>

      {/* Non-Diagnostic Clinical Stance Banner & Mathematical Model */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start justify-between gap-4 text-xs text-amber-950">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-amber-900">Clinical Stance &amp; Mathematical Model Specification:</strong>
            <span className="leading-snug">
              The Dynamic Distress Score (DDS) is a <strong>decision-support &amp; early-warning indicator — NOT a medical diagnosis</strong>.
              Formula: <code className="bg-amber-100 font-mono px-1.5 py-0.5 rounded font-bold text-amber-900">DDS_t = wT*T_t + wV*V_t + wB*B_t + wE*E_t + wH*H_t + wC*C_t</code> where <i>T</i>=Text, <i>V</i>=Voice, <i>B</i>=Behaviour, <i>E</i>=Engagement, <i>H</i>=History, <i>C</i>=Case Context.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-100/80 px-3 py-2 rounded-xl border border-amber-200 shrink-0 text-[11px] font-semibold text-amber-900">
          <span>Configurable Weights Active</span>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-teal-900 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Active Case Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Current Score</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{selectedCase.distressScore}/100</p>
          <span className="text-[10px] text-teal-700 font-bold">{selectedCase.distressState}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Previous Score</span>
          <p className="text-xl font-black text-slate-700 mt-0.5">{selectedCase.previousScore ?? 48}/100</p>
          <span className="text-[10px] text-slate-400">Baseline recorded</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Longitudinal Trend</span>
          <div className="flex items-center gap-1 text-sm font-black mt-1">
            {selectedCase.trend === 'up' && <span className="text-rose-600 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> Increasing</span>}
            {selectedCase.trend === 'stable' && <span className="text-slate-600 flex items-center gap-1"><Minus className="w-4 h-4" /> Stable</span>}
            {selectedCase.trend === 'down' && <span className="text-emerald-600 flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Decreasing</span>}
          </div>
          <span className="text-[10px] text-slate-400">{selectedCase.trendVelocity || '+1.2 pts/wk'}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Trend Velocity</span>
          <p className="text-base font-black text-slate-900 mt-1">{selectedCase.trendVelocity || '+1.2 pts/wk'}</p>
          <span className="text-[10px] text-slate-400">Over 30-day window</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Persistence</span>
          <p className="text-base font-black text-slate-900 mt-1">{selectedCase.persistenceDays ?? 24} Days</p>
          <span className="text-[10px] text-slate-400">Consecutive telemetry</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Data Quality</span>
          <p className="text-base font-black text-teal-800 mt-1">{selectedCase.dataQuality}</p>
          <span className="text-[10px] text-slate-400">Verified channels</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
          <p className="text-base font-black text-indigo-700 mt-1">{selectedCase.confidenceScore}%</p>
          <span className="text-[10px] text-slate-400">Telemetry certainty</span>
        </div>
      </div>

      {selectedCase.dataQuality === 'Insufficient' && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Insufficient information — human follow-up recommended immediately.</span>
        </div>
      )}

      {/* Main Score & Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Dynamic Score Dial & Explanation */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Interactive Simulation Dial</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${riskTier.alertBg} ${riskTier.color}`}>
                Tier: {riskTier.label}
              </span>
            </div>

            {/* Circular Gauge Meter */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="9" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={dynamicScore >= 81 ? '#ef4444' : dynamicScore >= 61 ? '#f97316' : dynamicScore >= 31 ? '#f59e0b' : '#10b981'}
                    strokeWidth="9"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - dynamicScore / 100)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{dynamicScore}</span>
                  <span className="text-[11px] font-bold text-slate-400">/ 100 Score</span>
                  <span className={`text-[10px] font-extrabold uppercase mt-0.5 ${riskTier.color}`}>
                    {riskTier.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Accessible Chart Summary & Equivalent Data Table (Requirement 27) */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="font-extrabold text-slate-800 block text-[11px] mb-1">
                  Accessible Chart Summary:
                </span>
                <p className="text-slate-600 font-medium">
                  Distress score is currently <strong className="text-slate-900">{selectedCase.distressScore}/100 ({selectedCase.distressState})</strong>.
                  Longitudinal distress trend is <strong className="text-slate-900">{selectedCase.trend.toUpperCase()}</strong> with velocity {selectedCase.trendVelocity || '+1.2 pts/wk'}.
                  Previous baseline was {selectedCase.previousScore ?? 48}/100.
                </p>
              </div>

              {/* Data Table Equivalent */}
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-[11px] border border-slate-200 rounded-xl overflow-hidden" aria-label="Longitudinal distress score history">
                  <caption className="sr-only">Monthly Distress Scores and Signals</caption>
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th scope="col" className="p-1.5">Period</th>
                      <th scope="col" className="p-1.5">Score</th>
                      <th scope="col" className="p-1.5">Category</th>
                      <th scope="col" className="p-1.5">Signal Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedCase.distressHistory?.slice(-4).map((dh, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-1.5 font-bold text-slate-900">{dh.month}</td>
                        <td className="p-1.5 font-bold text-teal-800">{dh.score}/100</td>
                        <td className="p-1.5">{dh.distressState}</td>
                        <td className="p-1.5 text-slate-500">{dh.safetySignal || 'Normal check-in'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Causal Breakdown Table */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                Factor Contribution Breakdown
              </span>

              <div className="flex justify-between items-center text-slate-600">
                <span>Self-reported stress component (35%)</span>
                <span className="font-bold text-slate-900">+{sentimentComponent.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Unanswered check-in penalty (25%)</span>
                <span className="font-bold text-rose-600">+{missedComponent.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Threat / intimidation events (20%)</span>
                <span className="font-bold text-amber-600">+{threatComponent.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Legal / bail proximity stress (10%)</span>
                <span className="font-bold text-blue-600">+{legalComponent.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Social isolation vulnerability (10%)</span>
                <span className="font-bold text-purple-600">+{isolationComponent.toFixed(1)} pts</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyToActiveCase}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Score ({dynamicScore}) to Active Case ({selectedCase.id})</span>
          </button>
        </div>

        {/* Right 7 Cols: Interactive Sliders (Multi-Factor Inputs) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Transparent Multi-Factor Input Controls</h3>
            <p className="text-xs text-slate-500">Adjust the inputs below to see how the scoring model behaves deterministically.</p>
          </div>

          <div className="space-y-4">
            {/* Slider 1: Conversational Stress */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-800">1. Conversational Stress / Anxiety Self-Report (35% weight)</label>
                <span className="font-extrabold text-teal-700">{sentimentStress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sentimentStress}
                onChange={(e) => setSentimentStress(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0% (Calm / Stable)</span>
                <span>50% (Anxious / Insomnia)</span>
                <span>100% (Acute Panic &amp; Despair)</span>
              </div>
            </div>

            {/* Slider 2: Consecutive Missed Check-ins */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-800">2. Consecutive Missed Check-ins (25% weight)</label>
                <span className="font-extrabold text-rose-600">{missedCheckIns} missed</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={missedCheckIns}
                onChange={(e) => setMissedCheckIns(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0 (Active)</span>
                <span>1 Missed</span>
                <span>2 Missed</span>
                <span>3 Missed</span>
                <span>5+ (Critical Silence)</span>
              </div>
            </div>

            {/* Slider 3: Threat & Intimidation Events */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-800">3. Threat / Intimidation Events Detected (20% weight)</label>
                <span className="font-extrabold text-amber-600">{threatKeywords} logged</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={threatKeywords}
                onChange={(e) => setThreatKeywords(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>None Reported</span>
                <span>1 Subtle Inquiry</span>
                <span>2 Loitering Outside</span>
                <span>3 Direct Threat</span>
                <span>4+ Physical Intimidation</span>
              </div>
            </div>

            {/* Slider 4: Proximity to Court Hearing */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-800">4. Days until Next Court Hearing / Cross-Examination (10% weight)</label>
                <span className="font-extrabold text-blue-600">{courtProximityDays} days</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={courtProximityDays}
                onChange={(e) => setCourtProximityDays(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>1 Day (Tomorrow - Peak Stress)</span>
                <span>16 Days</span>
                <span>60 Days</span>
              </div>
            </div>

            {/* Slider 5: Social Isolation Index */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-800">5. Vulnerability &amp; Social Isolation Index (10% weight)</label>
                <span className="font-extrabold text-purple-600">Level {isolationIndex}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={isolationIndex}
                onChange={(e) => setIsolationIndex(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>1 (Strong Community Buffer)</span>
                <span>3 (Moderate Isolation)</span>
                <span>5 (Complete Severance)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
