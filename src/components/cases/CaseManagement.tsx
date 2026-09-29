import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VictimCase, RiskLevel, CaseStage, SafetyState, DistressState } from '../../types';
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Shield,
  Phone,
  Calendar,
  AlertTriangle,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Minus,
  ArrowDownRight,
  X,
  CheckCircle2,
  ChevronLeft,
  ArrowUpDown,
  RotateCcw,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';

interface CaseManagementProps {
  onSelectCase?: (c: VictimCase) => void;
  onOpenEmergency?: () => void;
}

export const CaseManagement: React.FC<CaseManagementProps> = ({ onSelectCase }) => {
  const {
    cases,
    unmaskPII,
    toggleUnmaskPII,
    selectCaseById,
    filterDistrict,
    filterRisk,
    filterStage,
    setFilterDistrict,
    setFilterRisk,
    setFilterStage,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>(filterRisk || 'all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>(filterDistrict || 'all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>(filterStage || 'all');
  const [selectedSafetyFilter, setSelectedSafetyFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distress_desc' | 'distress_asc' | 'recent' | 'id'>('distress_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.maskedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRiskFilter === 'all' || c.status === selectedRiskFilter;
    const matchesDistrict = selectedDistrictFilter === 'all' || c.district === selectedDistrictFilter;
    const matchesStage = selectedStageFilter === 'all' || c.stage === selectedStageFilter;
    const matchesSafety = selectedSafetyFilter === 'all' || c.safetyState === selectedSafetyFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || c.category.includes(selectedCategoryFilter);

    return matchesSearch && matchesRisk && matchesDistrict && matchesStage && matchesSafety && matchesCategory;
  });

  // Sort logic
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'distress_desc') return b.distressScore - a.distressScore;
    if (sortBy === 'distress_asc') return a.distressScore - b.distressScore;
    if (sortBy === 'id') return a.id.localeCompare(b.id);
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedCases.length / pageSize) || 1;
  const paginatedCases = sortedCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSelectedRiskFilter('all');
    setSelectedDistrictFilter('all');
    setSelectedStageFilter('all');
    setSelectedSafetyFilter('all');
    setSelectedCategoryFilter('all');
    setFilterRisk(null);
    setFilterDistrict(null);
    setFilterStage(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const renderSafetyBadge = (st: SafetyState) => {
    switch (st) {
      case 'CRITICAL_SAFETY_PROTOCOL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase border bg-rose-100 text-rose-800 border-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-700 shrink-0" aria-hidden="true" />
            <span>CRITICAL PROTOCOL</span>
          </span>
        );
      case 'URGENT_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase border bg-orange-100 text-orange-800 border-orange-300">
            <AlertTriangle className="w-3 h-3 text-orange-700 shrink-0" aria-hidden="true" />
            <span>URGENT REVIEW</span>
          </span>
        );
      case 'SAFETY_CONCERN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-amber-100 text-amber-800 border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" aria-hidden="true" />
            <span>SAFETY CONCERN</span>
          </span>
        );
      case 'NO_CRITICAL_SIGNAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase border bg-emerald-100 text-emerald-800 border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>NO CRITICAL SIGNAL</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase border bg-slate-100 text-slate-700 border-slate-200">
            <span>{st.replace(/_/g, ' ')}</span>
          </span>
        );
    }
  };

  const renderDistressScore = (score: number, trend: 'up' | 'stable' | 'down') => {
    const isHigh = score >= 75;
    const isMod = score >= 50;
    const label = isHigh ? 'HIGH' : isMod ? 'MODERATE' : 'LOW';
    const bg = isHigh
      ? 'bg-rose-100 text-rose-800 border-rose-300 font-black'
      : isMod
      ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
      : 'bg-teal-100 text-teal-800 border-teal-300 font-semibold';
    return (
      <div className="inline-flex items-center justify-center gap-1">
        <span className={`px-2.5 py-0.5 rounded-full text-xs border ${bg}`}>
          <span className="text-[10px] uppercase mr-1">{label}</span>
          {score}/100
        </span>
        {trend === 'up' && <span className="text-rose-600 text-xs font-bold" title="Trending Up">↑</span>}
        {trend === 'stable' && <span className="text-slate-400 text-xs font-bold" title="Stable">→</span>}
        {trend === 'down' && <span className="text-emerald-600 text-xs font-bold" title="Improving">↓</span>}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Victim Case Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200">
              Interactive Case Registry ({cases.length} Records)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multilateral monitoring registry tracking dynamic indicators, judicial stages, and human caseworker interventions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleUnmaskPII}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              unmaskPII
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Toggle PII Privacy Masking"
          >
            {unmaskPII ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{unmaskPII ? 'PII Unmasked (Authorized Mode)' : 'PII Masked (Privacy Shield ON)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search cases by ID, name, district, FIR, category..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="distress_desc">Distress Score (High &rarr; Low)</option>
              <option value="distress_asc">Distress Score (Low &rarr; High)</option>
              <option value="id">Case ID (Alphabetical)</option>
            </select>

            <button
              onClick={resetFilters}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Category Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Risk Tier</label>
            <select
              value={selectedRiskFilter}
              onChange={(e) => {
                setSelectedRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700"
            >
              <option value="all">All Tiers</option>
              <option value="High Risk">High Risk</option>
              <option value="Escalating">Escalating</option>
              <option value="Moderate Risk">Moderate Risk</option>
              <option value="Under Review">Under Review</option>
              <option value="Stable">Stable</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">District</label>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => {
                setSelectedDistrictFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700"
            >
              <option value="all">All Districts</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Salem">Salem</option>
              <option value="Tiruchirappalli">Tiruchirappalli</option>
              <option value="Tirunelveli">Tirunelveli</option>
              <option value="Vellore">Vellore</option>
              <option value="Thanjavur">Thanjavur</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Stage</label>
            <select
              value={selectedStageFilter}
              onChange={(e) => {
                setSelectedStageFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700"
            >
              <option value="all">All Stages</option>
              <option value="Investigation">Investigation</option>
              <option value="Trial">Trial</option>
              <option value="Rehabilitation">Rehabilitation</option>
              <option value="Compensation">Compensation</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Safety State</label>
            <select
              value={selectedSafetyFilter}
              onChange={(e) => {
                setSelectedSafetyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700"
            >
              <option value="all">All Safety States</option>
              <option value="CRITICAL_SAFETY_PROTOCOL">Critical Protocol</option>
              <option value="URGENT_REVIEW">Urgent Review</option>
              <option value="SAFETY_CONCERN">Safety Concern</option>
              <option value="NO_CRITICAL_SIGNAL">No Critical Signal</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Category</label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="Witness Intimidation">Witness Intimidation</option>
              <option value="Rape">Rape &amp; Gang Rape</option>
              <option value="SC/ST">SC/ST (PoA)</option>
              <option value="Murder">Murder / Grievous Hurt</option>
              <option value="Arson">Arson</option>
              <option value="Domestic Violence">Domestic Violence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-center">Distress Score</th>
                <th className="py-3 px-4">Safety State</th>
                <th className="py-3 px-4">Assigned Counsellor</th>
                <th className="py-3 px-4">Last Check-in</th>
                <th className="py-3 px-4 text-right">Case Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedCases.length > 0 ? (
                paginatedCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      selectCaseById(c.id);
                      if (onSelectCase) onSelectCase(c);
                    }}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-900">{c.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {unmaskPII ? c.fullName : c.maskedName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Age {c.age} · {c.gender}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{c.district}</div>
                      <div className="text-[10px] text-slate-400">{c.state}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.category.split('&')[0]}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {c.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {renderDistressScore(c.distressScore, c.trend)}
                    </td>
                    <td className="py-3 px-4">
                      {renderSafetyBadge(c.safetyState)}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold truncate max-w-[120px]">
                      {c.assignedCounsellor}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {c.lastInteraction}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCaseById(c.id);
                          if (onSelectCase) onSelectCase(c);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-teal-600 text-indigo-700 hover:text-white rounded-xl font-bold text-xs transition shadow-2xs"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, sortedCases.length)}</strong> of{' '}
            <strong>{sortedCases.length}</strong> cases
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
