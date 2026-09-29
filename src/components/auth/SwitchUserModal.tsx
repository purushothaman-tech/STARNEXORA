import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  Heart,
  Scale,
  X,
  Check,
  ArrowRight,
} from 'lucide-react';

interface SwitchUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const SwitchUserModal: React.FC<SwitchUserModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const { currentRole, switchUser } = useApp();

  if (!isOpen) return null;

  const roles = [
    {
      id: 'admin' as UserRole,
      title: 'Nodal Director & National Admin',
      name: 'Dr. Meera Sharma',
      desc: 'National surveillance console, state/district distress triage, audit logs & inter-agency coordination.',
      icon: ShieldCheck,
      color: 'from-indigo-600 to-indigo-800',
      badge: 'Directorate Access',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'counsellor' as UserRole,
      title: 'Senior Psychosocial Caseworker',
      name: 'Dr. Kavita Singhania',
      desc: 'Triage queue management, trauma counselling supervision, signal validation & support assignment.',
      icon: Heart,
      color: 'from-teal-600 to-teal-800',
      badge: 'Caseworker Triage',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'beneficiary' as UserRole,
      title: 'Protected Survivor & Beneficiary',
      name: 'Asha K.',
      desc: 'Personal support portal, safe conversational check-in with SPC AI, case timeline & emergency SOS.',
      icon: UserCheck,
      color: 'from-purple-600 to-purple-800',
      badge: 'Protected Portal',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'district_official' as UserRole,
      title: 'District Magistrate & Protection Officer',
      name: 'Insp. V. Raghavan',
      desc: 'District case registry, BNS FIR tracking, witness protection orders & legal compensation review.',
      icon: Scale,
      color: 'from-blue-600 to-blue-800',
      badge: 'District Magistrate',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  ];

  const handleRoleClick = (roleId: UserRole) => {
    switchUser(roleId);
    if (onSelectRole) onSelectRole(roleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h2 className="text-lg font-extrabold text-slate-900 font-sans">
                Switch Role / User Account
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Select an authorized SPC AI role console below to switch view immediately.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Role Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = currentRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleRoleClick(r.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/30 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${r.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-900 transition">
                      {r.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500">{r.title}</p>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-purple-700">
                    {isCurrent ? 'Active Console' : 'Switch Role'}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCurrent ? 'bg-purple-600 text-white' : 'border border-slate-300 text-slate-400 group-hover:text-purple-600'}`}>
                    {isCurrent ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
