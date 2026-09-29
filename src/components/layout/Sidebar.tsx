import React, { useState } from 'react';
import { AppModule, UserRole } from '../../types';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../i18n/translations';
import {
  LayoutDashboard,
  Users,
  Activity,
  BellRing,
  GitBranch,
  HeartHandshake,
  BookOpen,
  BarChart3,
  Map,
  Clock,
  Zap,
  UserCheck,
  MessageSquare,
  PhoneCall,
  MessageCircle,
  ShieldAlert,
  HelpCircle,
  LogOut,
  Sliders,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  currentRole: UserRole;
  unreadAlertsCount?: number;
  onOpenEmergency: () => void;
}

interface NavItem {
  id: AppModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isEmergency?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  currentRole,
  unreadAlertsCount = 5,
  onOpenEmergency,
}) => {
  const { logout, setIsAccessibilityModalOpen, setIsAccessibilityHelpOpen } = useApp();
  const { currentLanguage } = useLanguage();
  const isBeneficiary = currentRole === 'beneficiary';
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Admin / Staff navigation items
  const adminNavItems: NavItem[] = [
    { id: 'dashboard' as AppModule, label: t('dashboard', currentLanguage), icon: LayoutDashboard },
    { id: 'victim_cases' as AppModule, label: t('victimCases', currentLanguage), icon: Users },
    { id: 'risk_monitoring' as AppModule, label: t('riskMonitoring', currentLanguage), icon: Activity },
    { id: 'alerts_actions' as AppModule, label: t('alertsActions', currentLanguage), icon: BellRing, badge: unreadAlertsCount },
    { id: 'interventions' as AppModule, label: t('interventions', currentLanguage), icon: GitBranch },
    { id: 'counselling_services' as AppModule, label: t('counsellingServices', currentLanguage), icon: HeartHandshake },
    { id: 'schemes_resources' as AppModule, label: t('schemesResources', currentLanguage), icon: BookOpen },
    { id: 'reports_analytics' as AppModule, label: t('reportsAnalytics', currentLanguage), icon: BarChart3 },
    { id: 'map_view' as AppModule, label: t('mapView', currentLanguage), icon: Map },
    { id: 'dynamic_distress_score' as AppModule, label: t('dynamicDistressScore', currentLanguage), icon: Zap },
    { id: 'case_timeline' as AppModule, label: t('caseTimeline', currentLanguage), icon: Clock },
    { id: 'support_profile' as AppModule, label: t('supportProfile', currentLanguage), icon: UserCheck },
    { id: 'chat_spc' as AppModule, label: t('chatWithSPC', currentLanguage), icon: MessageSquare },
    { id: 'ivrs_simulation' as AppModule, label: t('ivrsSimulation', currentLanguage), icon: PhoneCall },
    { id: 'sms_simulation' as AppModule, label: t('smsSimulation', currentLanguage), icon: MessageCircle },
    { id: 'settings' as AppModule, label: t('settings', currentLanguage), icon: Settings },
  ];

  // Beneficiary navigation items
  const beneficiaryNavItems: NavItem[] = [
    { id: 'dashboard' as AppModule, label: t('dashboard', currentLanguage), icon: LayoutDashboard },
    { id: 'support_profile' as AppModule, label: t('mySupportNeeds', currentLanguage), icon: HeartHandshake },
    { id: 'chat_spc' as AppModule, label: t('chatWithSPC', currentLanguage), icon: MessageSquare },
    { id: 'ivrs_simulation' as AppModule, label: t('requestACall', currentLanguage), icon: PhoneCall },
    { id: 'sms_simulation' as AppModule, label: t('sendSMSUpdate', currentLanguage), icon: MessageCircle },
    { id: 'case_timeline' as AppModule, label: t('myCaseStatus', currentLanguage), icon: Clock },
    { id: 'schemes_resources' as AppModule, label: t('resourcesSchemes', currentLanguage), icon: BookOpen },
    { id: 'support_services' as AppModule, label: t('supportServicesNearMe', currentLanguage), icon: Map },
    { id: 'settings' as AppModule, label: t('settings', currentLanguage), icon: Settings },
  ];

  const navItems = isBeneficiary ? beneficiaryNavItems : adminNavItems;

  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-full overflow-hidden">
      {/* 1. FLEX-SHRINK-0: Top Header Logo & Welcome Card */}
      <div className="flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <Logo variant={isBeneficiary ? 'beneficiary' : 'full'} />
        </div>

        {isBeneficiary && (
          <div className="p-3 mx-3 my-2 bg-gradient-to-b from-purple-50 to-indigo-50/50 rounded-2xl border border-purple-100 text-center relative overflow-hidden">
            <h4 className="font-bold text-slate-800 text-xs tracking-tight">A safe space to listen</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              Your well-being matters. We are here to listen, understand and protect you.
            </p>
            <div className="mt-1.5 py-0.5 px-2 rounded-full bg-purple-600 text-white font-bold text-[9px] inline-block shadow-2xs">
              You are not alone 💜
            </div>
          </div>
        )}
      </div>

      {/* 2. FLEX-1 MIN-H-0 OVERFLOW-Y-AUTO: Middle Independently Scrollable Navigation List */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. FLEX-SHRINK-0: Fixed Footer Section containing Emergency SOS Help + Quick Tools */}
      <div className="flex-shrink-0 p-3 space-y-2 border-t border-slate-200/80 bg-slate-50/80 z-10">
        {/* Emergency SOS Help Button - ALWAYS Visible & Never Clipped */}
        <button
          onClick={onOpenEmergency}
          className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 transition shadow-sm shadow-rose-600/20 group"
          title="Activate 112 National Emergency Support"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 animate-pulse shrink-0" />
            <span>{t('emergencyHelp', currentLanguage)}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">112</span>
        </button>

        {/* Quick Help Guide */}
        <div
          onClick={() => setIsAccessibilityHelpOpen(true)}
          className="p-2 bg-white hover:bg-teal-50/60 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2 cursor-pointer transition"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsAccessibilityHelpOpen(true)}
          title="Open Accessibility & Support Guide"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-bold text-slate-800 text-[11px] truncate">Quick Help &amp; A11y Guide</h5>
            <p className="text-[10px] text-slate-500 truncate">Access user guidelines</p>
          </div>
        </div>

        {/* Accessibility Preferences Button */}
        <button
          onClick={() => setIsAccessibilityModalOpen(true)}
          className="w-full py-1.5 px-2.5 text-[11px] font-semibold text-teal-800 hover:text-teal-950 flex items-center justify-between transition hover:bg-teal-50 rounded-xl border border-slate-200 bg-white"
          title="Accessibility Preferences (WCAG 2.2 AA)"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>Accessibility (♿)</span>
          </div>
          <span className="text-[10px] bg-teal-100 text-teal-900 font-extrabold px-1.5 py-0.2 rounded shrink-0">AA</span>
        </button>

        {/* Log Out */}
        <button
          onClick={logout}
          className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-between transition rounded-xl border border-rose-100 bg-rose-50/50 cursor-pointer"
          title="Log Out of SPC AI"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Log Out</span>
          </div>
          <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded shrink-0">Exit</span>
        </button>
      </div>
    </aside>
  );
};
