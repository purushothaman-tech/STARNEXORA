import React, { useState } from 'react';
import { mockSupportCenters } from '../../data/mockData';
import { SupportCenter } from '../../types';
import { MapPin, Phone, Clock, Shield, Search, ExternalLink, CheckCircle2, Navigation } from 'lucide-react';

export const SupportServicesView: React.FC = () => {
  const [centers, setCenters] = useState<SupportCenter[]>(mockSupportCenters);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCenter, setSelectedCenter] = useState<SupportCenter>(mockSupportCenters[0]);
  const [referralSubmitted, setReferralSubmitted] = useState<string | null>(null);

  const filtered = centers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.services.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Support Services &amp; Institutional Network</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Geolocated directory of One Stop Centres (OSC Sakhi), DLSA Legal Aid Cells, Government Hospitals &amp; Shelters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Location: South West Delhi / National Network
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search centres, hospitals, legal aid cells, services..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Service Category:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Service Facilities ({centers.length})</option>
            <option value="One Stop Centre">One Stop Centre (Sakhi)</option>
            <option value="DLSA Legal Aid">DLSA Legal Aid Cells</option>
            <option value="District Hospital">Government Hospitals</option>
            <option value="Counselling Centre">Mental Health Units</option>
            <option value="Police Special Cell">Police Special Cells</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Directory List & Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Directory Cards */}
        <div className="lg:col-span-6 space-y-3">
          {filtered.map((c) => {
            const isSelected = selectedCenter.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCenter(c)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {c.type}
                  </span>
                  <span className="font-extrabold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-lg text-[11px]">
                    {c.distance}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{c.address}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.services.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-slate-700 font-bold hover:text-indigo-600"
                    >
                      <Phone className="w-3 h-3 text-indigo-600" />
                      <span>{c.phone}</span>
                    </a>
                    {c.tollFree && (
                      <span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">
                        Toll-Free: {c.tollFree}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{c.availableHours}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 6 Cols: Interactive Map & Detailed Facility Profile */}
        <div className="lg:col-span-6 space-y-6">
          {/* Map Representation */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">Geographic Proximity Map</h3>
              <span className="text-xs text-slate-500 font-medium">Dwarka / South West Delhi Cluster</span>
            </div>

            <div className="relative h-64 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
              <svg viewBox="0 0 400 240" className="w-full h-full">
                {/* Background Roads */}
                <rect width="400" height="240" fill="#e2e8f0" />
                <path d="M0,60 Q150,70 400,50" fill="none" stroke="#cbd5e1" strokeWidth="8" />
                <path d="M0,160 Q200,140 400,170" fill="none" stroke="#cbd5e1" strokeWidth="8" />
                <path d="M120,0 L120,240" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                <path d="M260,0 L260,240" fill="none" stroke="#cbd5e1" strokeWidth="6" />

                {/* Markers */}
                {mockSupportCenters.map((item, idx) => {
                  const isCur = item.id === selectedCenter.id;
                  const x = 80 + (idx % 3) * 110;
                  const y = 50 + Math.floor(idx / 2) * 80;
                  return (
                    <g key={item.id} className="cursor-pointer" onClick={() => setSelectedCenter(item)}>
                      {isCur && (
                        <circle cx={x} cy={y} r="18" fill="#6366f1" fillOpacity="0.2" className="animate-ping" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isCur ? "10" : "7"}
                        fill={isCur ? "#4f46e5" : "#ef4444"}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <text x={x} y={y - 14} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">
                        {item.name.substring(0, 14)}..
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                <span>Selected: {selectedCenter.name} ({selectedCenter.distance})</span>
              </div>
            </div>
          </div>

          {/* Facility Deep Dive Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                  {selectedCenter.type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedCenter.name}</h3>
                <p className="text-slate-500 mt-0.5">{selectedCenter.address}</p>
              </div>

              <a
                href={`tel:${selectedCenter.phone}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Center</span>
              </a>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
                Available Statutory &amp; Clinical Services
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedCenter.services.map((srv, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-700">{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-500 text-[11px]">
              <span>Dispatched under Victim Services Protocol</span>
              {referralSubmitted === selectedCenter.id ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Referral Dispatched
                </span>
              ) : (
                <button
                  onClick={() => {
                    setReferralSubmitted(selectedCenter.id);
                    setTimeout(() => setReferralSubmitted(null), 4000);
                  }}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Submit Formal Referral &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
