import React from 'react';
import { CloudSun, ArrowLeft, RefreshCw, ExternalLink, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickExitOverlay: React.FC = () => {
  const { isQuickExitActive, resumeFromQuickExit } = useApp();

  if (!isQuickExitActive) return null;

  return (
    <div
      role="region"
      aria-label="Discreet Neutral Safety Screen"
      className="fixed inset-0 z-50 bg-slate-100 text-slate-800 flex flex-col font-sans"
    >
      {/* Neutral Civic Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              National Weather &amp; Civic Information Service
            </h1>
            <p className="text-[10px] text-slate-500">
              India Meteorological Department · Public Forecast Bulletin
            </p>
          </div>
        </div>

        {/* Discreet Resume Link */}
        <button
          onClick={resumeFromQuickExit}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          title="Return"
        >
          Return to Portal
        </button>
      </header>

      {/* Neutral Content (Weather / News) */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                LIVE METEOROLOGICAL TELEMETRY
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">New Delhi &amp; Northern Region Forecast</h2>
            </div>
            <span className="text-2xl font-black text-slate-900">28°C · Clear Sky</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Humidity</span>
              <span className="text-base font-bold text-slate-800">46%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Wind Velocity</span>
              <span className="text-base font-bold text-slate-800">12 km/h NW</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Air Quality (AQI)</span>
              <span className="text-base font-bold text-emerald-700">78 (Moderate)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Precipitation</span>
              <span className="text-base font-bold text-slate-800">0.0 mm</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Weekly Public Agricultural &amp; Civic Bulletins</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Normal seasonal weather conditions are projected across standard administrative zones over the forthcoming 7-day period. Standard civic transport and transit schedules remain fully operational.
          </p>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-4 text-center text-xs text-slate-400">
        Public Information Portal · Official Public Service Feed
      </footer>
    </div>
  );
};
