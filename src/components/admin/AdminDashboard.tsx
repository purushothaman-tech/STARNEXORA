import React, { useState } from 'react';
import { IndiaMapSvg } from '../common/IndiaMapSvg';
import { RiskBadge } from '../common/RiskBadge';
import {
  Users,
  AlertTriangle,
  Heart,
  Sprout,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Filter,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VictimCase, AppModule } from '../../types';

interface AdminDashboardProps {
  onSelectCase: (c: VictimCase) => void;
  onNavigate: (module: AppModule) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectCase, onNavigate }) => {
  const {
    cases,
    alerts,
    interventions,
    followUps,
    setActiveAlertModal,
    setFilterDistrict,
    setFilterRisk,
    setFilterStage,
  } = useApp();

  const [selectedState, setSelectedState] = useState<string | null>('Tamil Nadu');
  const [trendRange, setTrendRange] = useState<'6 Months' | '3 Months' | '1 Year'>('6 Months');

  // Dynamic Metrics from AppContext
  const totalMonitored = 12482; // Baseline scale indicator for demonstration
  const highRiskCount = cases.filter((c) => c.distressScore >= 75 || c.status === 'High Risk' || c.status === 'Escalating').length * 48;
  const activeCounsellingCount = cases.filter((c) => c.assignedCounsellor).length * 245;
  const interventionsProvidedCount = interventions.length * 812;
  const pendingFollowupsCount = followUps.filter((f) => f.status === 'Pending').length * 311;

  const handleFilterAndGo = (type: 'risk' | 'stage' | 'district', val: string) => {
    if (type === 'risk') setFilterRisk(val);
    if (type === 'stage') setFilterStage(val);
    if (type === 'district') setFilterDistrict(val);
    onNavigate('victim_cases');
  };

  const getSvgY = (val: number) => {
    return 180 - (val / 100) * 160;
  };

  const highPoints = "40," + getSvgY(55) + " 100," + getSvgY(70) + " 160," + getSvgY(66) + " 220," + getSvgY(72) + " 280," + getSvgY(68) + " 340," + getSvgY(74);
  const modPoints = "40," + getSvgY(42) + " 100," + getSvgY(48) + " 160," + getSvgY(45) + " 220," + getSvgY(48) + " 280," + getSvgY(46) + " 340," + getSvgY(50);
  const lowPoints = "40," + getSvgY(22) + " 100," + getSvgY(28) + " 160," + getSvgY(24) + " 220," + getSvgY(26) + " 280," + getSvgY(29) + " 340," + getSvgY(31);
  const stablePoints = "40," + getSvgY(10) + " 100," + getSvgY(12) + " 160," + getSvgY(11) + " 220," + getSvgY(14) + " 280," + getSvgY(16) + " 340," + getSvgY(15);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner with Skyline Graphic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-slate-200/80 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200">
              NATIONAL SURVEILLANCE &amp; MONITORING CONSOLE
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200">
              DE-IDENTIFIED DEMO DATA
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, Dr. Meera Sharma
          </h1>
          <p className="mt-1.5 text-sm md:text-base text-slate-600 font-medium">
            Together for safer lives. Monitor, support and ensure timely human intervention for every victim.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onNavigate('victim_cases')}
              className="px-3 py-1 bg-white/90 hover:bg-white font-semibold text-slate-700 rounded-full border border-slate-200 shadow-2xs transition"
            >
              National Jurisdiction · 12,482 Active Cases &rarr;
            </button>
            <button
              onClick={() => handleFilterAndGo('risk', 'High Risk')}
              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 font-bold text-rose-700 rounded-full transition"
            >
              642 High Risk Triage Required &rarr;
            </button>
          </div>
        </div>

        {/* Delhi / India Gate & Heritage Silhouette Illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-30 pointer-events-none hidden md:flex items-end justify-end pr-6">
          <svg className="h-28 w-auto text-indigo-400 fill-current" viewBox="0 0 500 200">
            <path d="M50,180 L50,140 L70,140 L70,110 L90,110 L90,90 L120,90 L120,180 Z" />
            <path d="M160,180 L160,80 L180,60 L200,60 L220,80 L220,180 L200,180 L200,120 C200,105 180,105 180,120 L180,180 Z" />
            <path d="M260,180 L260,100 L300,100 L300,80 L320,60 L340,80 L340,100 L380,100 L380,180 Z" />
            <circle cx="320" cy="40" r="15" />
            <path d="M100,40 Q105,35 110,40 Q115,35 120,40" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M220,30 Q225,25 230,30 Q235,25 240,30" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M360,35 Q365,30 370,35 Q375,30 380,35" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>

      {/* 5 Top Stat / KPI Cards (Fully Interactive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Total Victims Monitored */}
        <div
          onClick={() => onNavigate('victim_cases')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Total Victims Monitored</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalMonitored.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>12% from last month</span>
          </div>
        </div>

        {/* Card 2: High-Risk Cases */}
        <div
          onClick={() => handleFilterAndGo('risk', 'High Risk')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">High-Risk Cases</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{highRiskCount.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>18% from last month</span>
          </div>
        </div>

        {/* Card 3: Active Counselling */}
        <div
          onClick={() => onNavigate('counselling_services')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Active Counselling</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeCounsellingCount.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>9% from last month</span>
          </div>
        </div>

        {/* Card 4: Interventions Provided */}
        <div
          onClick={() => onNavigate('interventions')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Sprout className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Interventions Provided</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{interventionsProvidedCount.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>21% from last month</span>
          </div>
        </div>

        {/* Card 5: Pending Follow-ups */}
        <div
          onClick={() => onNavigate('alerts_actions')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Pending Follow-ups</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{pendingFollowupsCount.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>7% from last month</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Map, Trend of Distress, Case Stage Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Geographical Distribution of Risk Cases */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Geographical Distribution of Risk Cases</h3>
              <p className="text-[11px] text-slate-500">Click a state or district to filter registry</p>
            </div>
            <button
              onClick={() => onNavigate('map_view')}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Full Map &rarr;
            </button>
          </div>

          <IndiaMapSvg
            onSelectState={(state) => {
              setSelectedState(state);
              handleFilterAndGo('district', state);
            }}
          />
        </div>

        {/* Middle 4 Cols: Trend of Distress Score (Last 6 Months) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trend of Distress Score</h3>
              <p className="text-[11px] text-slate-500">Non-Clinical Monitoring Aggregate</p>
            </div>
            <select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value as any)}
              aria-label="Select trend timeline"
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 cursor-pointer"
            >
              <option value="6 Months">6 Months</option>
              <option value="3 Months">3 Months</option>
              <option value="1 Year">1 Year</option>
            </select>
          </div>

          {/* Series Legend */}
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 px-1 mb-2">
            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleFilterAndGo('risk', 'High Risk')}>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk
            </span>
            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleFilterAndGo('risk', 'Moderate Risk')}>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleFilterAndGo('risk', 'Under Review')}>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Low
            </span>
            <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleFilterAndGo('risk', 'Stable')}>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stable
            </span>
          </div>

          {/* SVG Multi-Line Chart */}
          <div className="relative h-60 w-full pt-2">
            <svg viewBox="0 0 380 200" className="w-full h-full overflow-visible">
              <line x1="30" y1="20" x2="360" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="60" x2="360" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="100" x2="360" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="360" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="180" x2="360" y2="180" stroke="#e2e8f0" strokeWidth="1" />

              <text x="15" y="24" fontSize="9" fill="#94a3b8" textAnchor="middle">100</text>
              <text x="15" y="64" fontSize="9" fill="#94a3b8" textAnchor="middle">80</text>
              <text x="15" y="104" fontSize="9" fill="#94a3b8" textAnchor="middle">60</text>
              <text x="15" y="144" fontSize="9" fill="#94a3b8" textAnchor="middle">40</text>
              <text x="15" y="184" fontSize="9" fill="#94a3b8" textAnchor="middle">0</text>

              <polyline fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={highPoints} />
              <polyline fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={modPoints} />
              <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={lowPoints} />
              <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={stablePoints} />

              <line x1="220" y1="20" x2="220" y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="220" cy={getSvgY(72)} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <circle cx="220" cy={getSvgY(48)} r="4" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
              <circle cx="220" cy={getSvgY(26)} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="220" cy={getSvgY(14)} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
                <text key={m} x={40 + i * 60} y="195" fontSize="9" fontWeight="600" fill="#64748b" textAnchor="middle">
                  {m}
                </text>
              ))}
            </svg>

            {/* Apr Tooltip */}
            <div className="absolute top-6 right-8 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md rounded-xl p-2.5 text-[11px] w-36 pointer-events-none">
              <p className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 mb-1">Apr 2025</p>
              <div className="space-y-0.5 font-medium">
                <div className="flex justify-between items-center text-rose-600">
                  <span>High Risk:</span>
                  <span className="font-bold">72</span>
                </div>
                <div className="flex justify-between items-center text-amber-600">
                  <span>Moderate:</span>
                  <span className="font-bold">48</span>
                </div>
                <div className="flex justify-between items-center text-blue-600">
                  <span>Low:</span>
                  <span className="font-bold">26</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span>Stable:</span>
                  <span className="font-bold">14</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3 Cols: Case Stage Distribution Donut */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900">Case Stage Distribution</h3>
            <p className="text-[11px] text-slate-500">Click stage to filter cases</p>
          </div>

          <div className="relative w-44 h-44 mx-auto my-2 cursor-pointer" onClick={() => onNavigate('victim_cases')}>
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="36" fill="transparent" stroke="#3b82f6" strokeWidth="14" strokeDasharray="63.3 226.2" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="36" fill="transparent" stroke="#10b981" strokeWidth="14" strokeDasharray="49.7 226.2" strokeDashoffset="-63.3" />
              <circle cx="50" cy="50" r="36" fill="transparent" stroke="#f59e0b" strokeWidth="14" strokeDasharray="40.7 226.2" strokeDashoffset="-113.0" />
              <circle cx="50" cy="50" r="36" fill="transparent" stroke="#06b6d4" strokeWidth="14" strokeDasharray="33.9 226.2" strokeDashoffset="-153.7" />
              <circle cx="50" cy="50" r="36" fill="transparent" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="38.4 226.2" strokeDashoffset="-187.6" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-black text-slate-900 leading-tight">12,482</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Total Cases</span>
            </div>
          </div>

          <div className="space-y-1 text-[11px] font-medium text-slate-600 mt-2">
            <div
              className="flex justify-between items-center hover:text-blue-700 cursor-pointer"
              onClick={() => handleFilterAndGo('stage', 'Investigation')}
            >
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Investigation</span>
              <span className="font-bold text-slate-800">28% (3,495)</span>
            </div>
            <div
              className="flex justify-between items-center hover:text-emerald-700 cursor-pointer"
              onClick={() => handleFilterAndGo('stage', 'Trial')}
            >
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Trial</span>
              <span className="font-bold text-slate-800">22% (2,746)</span>
            </div>
            <div
              className="flex justify-between items-center hover:text-amber-700 cursor-pointer"
              onClick={() => handleFilterAndGo('stage', 'Rehabilitation')}
            >
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Rehabilitation</span>
              <span className="font-bold text-slate-800">18% (2,247)</span>
            </div>
            <div
              className="flex justify-between items-center hover:text-cyan-700 cursor-pointer"
              onClick={() => handleFilterAndGo('stage', 'Compensation')}
            >
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"></span>Compensation</span>
              <span className="font-bold text-slate-800">15% (1,872)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Cases by Category & Recommended Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Cases by Category</h3>
            <span
              onClick={() => onNavigate('victim_cases')}
              className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              View Registry &rarr;
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Rape & Gang Rape', pct: 28, count: '3,495', color: 'bg-blue-600' },
              { label: 'Murder & Grievous Hurt', pct: 22, count: '2,746', color: 'bg-indigo-400' },
              { label: 'Arson', pct: 8, count: '998', color: 'bg-rose-400' },
              { label: 'Witness Intimidation', pct: 15, count: '1,872', color: 'bg-orange-400' },
              { label: 'Caste-based Violence', pct: 18, count: '2,247', color: 'bg-amber-400' },
              { label: 'SC/ST (PoA) Beneficiaries', pct: 9, count: '1,124', color: 'bg-fuchsia-400' },
            ].map((cat) => (
              <div
                key={cat.label}
                className="text-xs cursor-pointer hover:opacity-85 transition"
                onClick={() => onNavigate('victim_cases')}
              >
                <div className="flex justify-between items-center mb-1 text-slate-700 font-medium">
                  <span>{cat.label}</span>
                  <span className="font-bold text-slate-900">{cat.pct}% <span className="text-slate-400 font-normal">({cat.count})</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`${cat.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${cat.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Interventions (AI Suggested) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Recommended Interventions</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                  AI Suggested · Human Approved
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Automated triage recommendations based on support profile gaps</p>
            </div>
            <button
              onClick={() => onNavigate('interventions')}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              View All ({interventions.length}) &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Counselling Support', desc: 'Recommended for 320 cases', icon: Users, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200/60' },
              { title: 'Financial Assistance', desc: 'Recommended for 142 cases', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200/60' },
              { title: 'Medical Treatment', desc: 'Recommended for 87 cases', icon: AlertTriangle, color: 'bg-rose-100 text-rose-700', border: 'border-rose-200/60' },
              { title: 'Legal Aid', desc: 'Recommended for 211 cases', icon: ShieldAlert, color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200/60' },
              { title: 'Witness Protection', desc: 'Recommended for 54 cases', icon: ShieldAlert, color: 'bg-teal-100 text-teal-700', border: 'border-teal-200/60' },
              { title: 'Rehabilitation Services', desc: 'Recommended for 96 cases', icon: Heart, color: 'bg-rose-100 text-rose-700', border: 'border-rose-200/60' },
            ].map((rec) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.title}
                  onClick={() => onNavigate('interventions')}
                  className={`p-3 rounded-xl border ${rec.border} bg-slate-50/50 hover:bg-white hover:shadow-xs transition cursor-pointer flex items-center gap-3`}
                >
                  <div className={`w-9 h-9 rounded-lg ${rec.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500">{rec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Recent High-Risk Cases Table & Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent High-Risk Cases Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Recent High-Risk Cases</h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px]">
                {cases.filter(c => c.distressScore >= 70).length} Critical
              </span>
            </div>
            <button
              onClick={() => onNavigate('victim_cases')}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              View All ({cases.length}) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Case ID</th>
                  <th className="pb-2.5">Name (Masked)</th>
                  <th className="pb-2.5">Category</th>
                  <th className="pb-2.5">District</th>
                  <th className="pb-2.5">Distress Score</th>
                  <th className="pb-2.5">Trend</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {cases.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-bold text-indigo-900">{item.id}</td>
                    <td className="py-3 font-semibold text-slate-900">{item.maskedName}</td>
                    <td className="py-3 text-slate-600">{item.category.split('&')[0]}</td>
                    <td className="py-3 text-slate-600">{item.district}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        item.distressScore >= 75 ? 'bg-rose-100 text-rose-700' :
                        item.distressScore >= 50 ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.distressScore}
                      </span>
                    </td>
                    <td className="py-3">
                      {item.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-rose-600 inline" />}
                      {item.trend === 'stable' && <Minus className="w-4 h-4 text-slate-400 inline" />}
                      {item.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-emerald-600 inline" />}
                    </td>
                    <td className="py-3">
                      <RiskBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectCase(item)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg font-bold text-[11px] transition shadow-2xs"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Alerts & Pending Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Recent Risk Alerts</h3>
              <button
                onClick={() => onNavigate('alerts_actions')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                View All ({alerts.length}) &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setActiveAlertModal(alert)}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition text-xs cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">{alert.caseId}</span>
                    <span className="text-[10px] text-slate-400">{alert.timeAgo}</span>
                  </div>
                  <p className="font-bold text-rose-600 text-[11px] truncate">{alert.headline}</p>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mt-0.5">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Pending Actions</h3>
              <button
                onClick={() => onNavigate('alerts_actions')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                Queue ({followUps.length}) &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {followUps.slice(0, 4).map((action) => (
                <div
                  key={action.id}
                  onClick={() => onNavigate('alerts_actions')}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{action.type} ({action.caseId})</h4>
                    <p className="text-[10px] text-slate-500">{action.notes}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">
                    {action.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
