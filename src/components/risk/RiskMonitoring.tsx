import React, { useState } from 'react';
import { IndiaMapSvg } from '../common/IndiaMapSvg';
import { mockStateDistributions, mockCasesList } from '../../data/mockData';
import { ShieldAlert, TrendingUp, AlertTriangle, MapPin, Activity, Filter, Eye } from 'lucide-react';
import { VictimCase } from '../../types';

interface RiskMonitoringProps {
  onSelectCase: (c: VictimCase) => void;
  onOpenEmergency: () => void;
}

export const RiskMonitoring: React.FC<RiskMonitoringProps> = ({ onSelectCase, onOpenEmergency }) => {
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('all');

  const filteredStates = mockStateDistributions.filter(s =>
    selectedRiskTier === 'all' ? true : s.riskLevel === selectedRiskTier
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-slate-900">National Risk Monitoring &amp; Anomaly Detection</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time geospatial heat indices and predictive distress trajectory across 28 States &amp; 8 UTs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs">
            642 Critical Cases
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-extrabold text-xs">
            1,840 Escalating Tiers
          </span>
        </div>
      </div>

      {/* Main Map & State Drilldown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Geographic Map */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Interactive Distress Density Map</h3>
            <span className="text-[11px] text-slate-400">Click any state bubble</span>
          </div>

          <IndiaMapSvg onSelectState={(state) => setSelectedState(state)} />
        </div>

        {/* Right 6 Cols: State Breakdown Table */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">State Risk Registry</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Filter:</span>
                <select
                  value={selectedRiskTier}
                  onChange={(e) => setSelectedRiskTier(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="all">All Tiers</option>
                  <option value="High Risk">High Risk</option>
                  <option value="Moderate Risk">Moderate Risk</option>
                  <option value="Low Risk">Low Risk</option>
                  <option value="Stable">Stable</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-2">State / UT</th>
                    <th className="pb-2 text-center">Total</th>
                    <th className="pb-2 text-center text-rose-600">High Risk</th>
                    <th className="pb-2 text-center text-amber-600">Moderate</th>
                    <th className="pb-2 text-center text-blue-600">Low</th>
                    <th className="pb-2 text-right">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredStates.map((st) => (
                    <tr
                      key={st.state}
                      onClick={() => setSelectedState(st.state)}
                      className={`cursor-pointer hover:bg-slate-50 transition ${
                        selectedState === st.state ? 'bg-indigo-50/50 font-bold' : ''
                      }`}
                    >
                      <td className="py-2.5 font-bold text-slate-800">{st.state}</td>
                      <td className="py-2.5 text-center font-bold text-slate-900">{st.total}</td>
                      <td className="py-2.5 text-center font-bold text-rose-600">{st.highRisk}</td>
                      <td className="py-2.5 text-center font-semibold text-amber-600">{st.moderateRisk}</td>
                      <td className="py-2.5 text-center text-blue-600">{st.lowRisk}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.riskLevel === 'High Risk' ? 'bg-rose-100 text-rose-700' :
                          st.riskLevel === 'Moderate Risk' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {st.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Selected Region: <strong className="text-slate-900">{selectedState}</strong></span>
            <span className="text-indigo-600 font-bold cursor-pointer hover:underline">
              Download Full State CSV Report &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* AI Anomaly Triggers Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Predictive Risk Triggers &amp; Anomaly Warnings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="font-extrabold text-rose-700 uppercase tracking-wider text-[10px]">
              Silence Anomaly (32 Cases)
            </span>
            <p className="font-bold text-slate-800">Cessation of Regular Communication</p>
            <p className="text-slate-600 text-[11px]">
              Victims who previously responded bi-weekly and have missed 2+ check-ins without notice.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-extrabold text-amber-700 uppercase tracking-wider text-[10px]">
              Acoustic Tremor Anomaly (19 Cases)
            </span>
            <p className="font-bold text-slate-800">Voice Stress Markers in IVRS</p>
            <p className="text-slate-600 text-[11px]">
              Micro-tremors and hesitations during IVRS voice notes indicative of acute coercion or threat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
            <span className="font-extrabold text-indigo-700 uppercase tracking-wider text-[10px]">
              Hearing Proximity Spikes (48 Cases)
            </span>
            <p className="font-bold text-slate-800">Pre-Trial Distress Escalation</p>
            <p className="text-slate-600 text-[11px]">
              Predictive 62% average distress surge observed 72 hours prior to court cross-examinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
