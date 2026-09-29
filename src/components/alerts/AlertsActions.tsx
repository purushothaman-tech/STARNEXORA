import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskAlert, AppModule } from '../../types';
import {
  BellRing,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  AlertTriangle,
  UserCheck,
  Building,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface AlertsActionsProps {
  onNavigate: (module: AppModule) => void;
  onOpenEmergency: () => void;
}

export const AlertsActions: React.FC<AlertsActionsProps> = ({ onNavigate, onOpenEmergency }) => {
  const { alerts, resolveAlert, setActiveAlertModal, cases, selectCaseById } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [resolvedTab, setResolvedTab] = useState<'pending' | 'resolved'>('pending');

  const filtered = alerts.filter((a) => {
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchesResolved = resolvedTab === 'pending' ? !a.actionTaken : a.actionTaken;
    return matchesSeverity && matchesResolved;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-slate-900">Alerts &amp; Rapid Actions Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated triaging engine dispatching immediate police protection, psychological intervention, and administrative escorts.
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setResolvedTab('pending')}
            className={`px-4 py-2 rounded-xl transition ${
              resolvedTab === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending Actions ({alerts.filter((a) => !a.actionTaken).length})
          </button>
          <button
            onClick={() => setResolvedTab('resolved')}
            className={`px-4 py-2 rounded-xl transition ${
              resolvedTab === 'resolved' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Resolved ({alerts.filter((a) => a.actionTaken).length})
          </button>
        </div>
      </div>

      {/* Severity Filter pills */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-slate-400">Severity:</span>
        {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-full font-bold capitalize transition ${
              filterSeverity === sev
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
            No alerts found under this view filter.
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-400 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs cursor-pointer group"
              onClick={() => setActiveAlertModal(alert)}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm font-mono">{alert.caseId}</span>
                  <span className="text-slate-500 font-semibold">• {alert.maskedName}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-[11px] ml-auto md:ml-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timeAgo}</span>
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-teal-900 transition">
                  {alert.headline}
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">{alert.description}</p>

                <div className="pt-1 flex items-center gap-1.5 text-teal-800 font-bold text-[11px]">
                  <span>Action Directive:</span>
                  <span className="text-slate-700 font-medium">{alert.recommendedAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveAlertModal(alert)}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-200"
                  title="View Explainable AI Reasons"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>AI Explanation</span>
                </button>

                {!alert.actionTaken ? (
                  <>
                    <button
                      onClick={() => onOpenEmergency()}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1.5 transition border border-rose-200"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>Dispatch Patrol</span>
                    </button>
                    <button
                      onClick={() => onNavigate('counselling_services')}
                      className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl flex items-center gap-1.5 transition border border-purple-200"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Assign Counsellor</span>
                    </button>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolved &amp; Logged</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
