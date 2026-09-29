import React, { useState } from 'react';
import { mockStateDistributions } from '../../data/mockData';

interface IndiaMapSvgProps {
  onSelectState?: (stateName: string) => void;
  selectedState?: string | null;
}

export const IndiaMapSvg: React.FC<IndiaMapSvgProps> = ({ onSelectState, selectedState: propSelected }) => {
  const [hoveredState, setHoveredState] = useState<any | null>(
    mockStateDistributions.find(s => s.state === 'Uttar Pradesh') || mockStateDistributions[0]
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  // States with relative positioning for clean interactive map
  const stateRegions = [
    { name: 'Jammu & Kashmir', cx: 160, cy: 60, r: 28, risk: 'Low Risk', cases: 290 },
    { name: 'Punjab', cx: 145, cy: 115, r: 18, risk: 'Stable', cases: 420 },
    { name: 'Himachal Pradesh', cx: 175, cy: 100, r: 16, risk: 'Stable', cases: 180 },
    { name: 'Haryana', cx: 160, cy: 140, r: 16, risk: 'Moderate Risk', cases: 490 },
    { name: 'Delhi NCT', cx: 178, cy: 145, r: 12, risk: 'High Risk', cases: 890 },
    { name: 'Rajasthan', cx: 120, cy: 185, r: 38, risk: 'Moderate Risk', cases: 840 },
    { name: 'Uttar Pradesh', cx: 215, cy: 180, r: 42, risk: 'High Risk', cases: 1246 },
    { name: 'Bihar', cx: 285, cy: 205, r: 28, risk: 'Moderate Risk', cases: 780 },
    { name: 'Gujarat', cx: 90, cy: 250, r: 32, risk: 'Low Risk', cases: 540 },
    { name: 'Madhya Pradesh', cx: 190, cy: 250, r: 44, risk: 'High Risk', cases: 920 },
    { name: 'West Bengal', cx: 310, cy: 260, r: 26, risk: 'Moderate Risk', cases: 690 },
    { name: 'Maharashtra', cx: 145, cy: 320, r: 42, risk: 'High Risk', cases: 1120 },
    { name: 'Odisha', cx: 275, cy: 300, r: 28, risk: 'Low Risk', cases: 480 },
    { name: 'Telangana', cx: 200, cy: 340, r: 25, risk: 'Moderate Risk', cases: 510 },
    { name: 'Andhra Pradesh', cx: 215, cy: 400, r: 30, risk: 'Low Risk', cases: 590 },
    { name: 'Karnataka', cx: 155, cy: 410, r: 34, risk: 'Moderate Risk', cases: 710 },
    { name: 'Tamil Nadu', cx: 190, cy: 480, r: 32, risk: 'Low Risk', cases: 650 },
    { name: 'Kerala', cx: 150, cy: 485, r: 20, risk: 'Stable', cases: 380 },
    { name: 'Assam', cx: 360, cy: 180, r: 24, risk: 'Moderate Risk', cases: 390 },
  ];

  const getRiskColor = (risk: string, isHovered: boolean) => {
    switch (risk) {
      case 'High Risk':
        return isHovered ? '#dc2626' : '#ef4444';
      case 'Moderate Risk':
        return isHovered ? '#ea580c' : '#f97316';
      case 'Low Risk':
        return isHovered ? '#3b82f6' : '#60a5fa';
      default:
        return isHovered ? '#10b981' : '#34d399';
    }
  };

  const getFillOpacity = (risk: string) => {
    switch (risk) {
      case 'High Risk': return '0.85';
      case 'Moderate Risk': return '0.70';
      case 'Low Risk': return '0.55';
      default: return '0.40';
    }
  };

  const currentDetails = hoveredState || mockStateDistributions[0];

  return (
    <div className="relative w-full h-[380px] bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center p-2">
      {/* Zoom Controls */}
      <div className="absolute left-3 bottom-3 flex flex-col gap-1 z-10">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
          className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 font-bold flex items-center justify-center hover:bg-slate-50 transition text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
          className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 font-bold flex items-center justify-center hover:bg-slate-50 transition text-sm"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* SVG Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg viewBox="50 30 360 500" className="w-full h-full max-h-[360px] drop-shadow-sm select-none">
          {/* India Boundary Outline Silhouette */}
          <path
            d="M160,50 L180,65 L190,95 L220,110 L250,140 L280,160 L320,165 L360,160 L380,180 L360,210 L320,220 L300,240 L315,280 L290,320 L230,370 L210,440 L195,510 L180,530 L165,510 L140,460 L135,390 L120,330 L80,280 L70,240 L110,210 L120,160 L140,110 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Regional circles representing states & risk density */}
          {stateRegions.map((region) => {
            const isHovered = hoveredState?.state === region.name;
            const stateData = mockStateDistributions.find(s => s.state === region.name) || {
              state: region.name,
              total: region.cases,
              highRisk: Math.round(region.cases * 0.18),
              moderateRisk: Math.round(region.cases * 0.35),
              lowRisk: Math.round(region.cases * 0.47),
              riskLevel: region.risk,
            };

            return (
              <g
                key={region.name}
                className="cursor-pointer group transition-all"
                onMouseEnter={() => setHoveredState(stateData)}
                onClick={() => onSelectState && onSelectState(region.name)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle
                    cx={region.cx}
                    cy={region.cy}
                    r={region.r + 6}
                    fill="none"
                    stroke={getRiskColor(region.risk, true)}
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ transformOrigin: `${region.cx}px ${region.cy}px` }}
                  />
                )}

                {/* State bubble */}
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={region.r}
                  fill={getRiskColor(region.risk, isHovered)}
                  fillOpacity={getFillOpacity(region.risk)}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200 group-hover:scale-105"
                />

                {/* State Label */}
                <text
                  x={region.cx}
                  y={region.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={region.r > 25 ? '10' : '8'}
                  fontWeight="700"
                  fill="#1e293b"
                  className="pointer-events-none drop-shadow-sm select-none"
                >
                  {region.name.length > 10 ? region.name.substring(0, 7) + '..' : region.name}
                </text>
                <text
                  x={region.cx}
                  y={region.cy + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fontWeight="600"
                  fill="#ffffff"
                  className="pointer-events-none"
                >
                  {region.cases}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating State Detail Card (Replicating the Uttar Pradesh Popup from Image 1) */}
      {currentDetails && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl p-3.5 w-60 z-20 transition-all text-xs">
          <div className="flex items-center justify-between mb-1.5 border-b border-slate-100 pb-1.5">
            <h4 className="font-bold text-slate-800 text-sm">{currentDetails.state}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentDetails.riskLevel === 'High Risk' ? 'bg-rose-100 text-rose-700' :
              currentDetails.riskLevel === 'Moderate Risk' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {currentDetails.riskLevel || 'Monitoring'}
            </span>
          </div>

          <div className="space-y-1 text-slate-600 font-medium">
            <div className="flex justify-between">
              <span>Total Cases:</span>
              <span className="font-bold text-slate-900">{currentDetails.total?.toLocaleString() || 1246}</span>
            </div>
            <div className="flex justify-between items-center text-rose-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                High Risk:
              </span>
              <span className="font-bold">{currentDetails.highRisk || 128}</span>
            </div>
            <div className="flex justify-between items-center text-amber-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Moderate Risk:
              </span>
              <span className="font-bold">{currentDetails.moderateRisk || 342}</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Low Risk:
              </span>
              <span className="font-bold">{currentDetails.lowRisk || 614}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectState && onSelectState(currentDetails.state)}
            className="mt-2.5 w-full py-1 text-center font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition text-[11px] flex items-center justify-center gap-1"
          >
            View District Details &rarr;
          </button>
        </div>
      )}

      {/* Map Risk Legend (Matches Image 1 bottom right) */}
      <div className="absolute right-4 bottom-3 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-lg p-2 flex items-center gap-3 text-[11px] shadow-sm">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Risk
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate Risk
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Low Risk
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Stable
        </span>
      </div>
    </div>
  );
};
