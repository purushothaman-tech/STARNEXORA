/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, AppModule, VictimCase } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BeneficiaryPortal } from './components/beneficiary/BeneficiaryPortal';
import { CounsellorDashboard } from './components/counsellor/CounsellorDashboard';
import { CaseManagement } from './components/cases/CaseManagement';
import { CaseProfileModal } from './components/cases/CaseProfileModal';
import { AlertDetailModal } from './components/alerts/AlertDetailModal';
import { RiskMonitoring } from './components/risk/RiskMonitoring';
import { AlertsActions } from './components/alerts/AlertsActions';
import { InterventionsView } from './components/interventions/InterventionsView';
import { SupportServicesView } from './components/services/SupportServicesView';
import { CaseTimelineView } from './components/timeline/CaseTimelineView';
import { DynamicDistressScoreView } from './components/distress/DynamicDistressScoreView';
import { SupportProfileView } from './components/support/SupportProfileView';
import { ChatWithSPC } from './components/chat/ChatWithSPC';
import { IVRSSimulation } from './components/simulation/IVRSSimulation';
import { SMSSimulation } from './components/simulation/SMSSimulation';
import { SchemesResourcesView } from './components/schemes/SchemesResourcesView';
import { AppSettingsView } from './components/settings/AppSettingsView';
import { MobileViewSimulator } from './components/mobile/MobileViewSimulator';
import { EmergencySupportModal } from './components/emergency/EmergencySupportModal';
import { LoginPage } from './components/auth/LoginPage';
import { useApp } from './context/AppContext';
import {
  Menu,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  const {
    cases,
    alerts,
    currentRole,
    isAuthenticated,
    setRole,
    selectedCaseId,
    selectCaseById,
    activeAlertModal,
    setActiveAlertModal,
    filterDistrict,
    setFilterDistrict,
    demoScenarioStep,
    runDemoScenarioStep,
    resetDemoScenario,
  } = useApp();

  const [currentModule, setCurrentModule] = useState<AppModule>('dashboard');
  const [selectedState, setSelectedState] = useState<string>(filterDistrict || 'National View');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCaseDossier, setActiveCaseDossier] = useState<VictimCase | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Sync window location state with authentication guard
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    } else {
      if (window.location.pathname === '/login') {
        window.history.replaceState(null, '', '/dashboard');
      }
    }
  }, [isAuthenticated]);

  // Intercept back button and route navigation when unauthenticated
  React.useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated && typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Strict Protected Route Guard: If not authenticated, render LoginPage
  if (!isAuthenticated) {
    console.log('[AUTH] Protected route check: unauthenticated (isAuthenticated = false) -> rendering LoginPage');
    return <LoginPage />;
  }
  console.log('[AUTH] Protected route check: authenticated (isAuthenticated = true) -> rendering App Shell');

  // Switch role helper
  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    if (role === 'mobile_demo') {
      setCurrentModule('dashboard');
    } else if (role === 'beneficiary') {
      setCurrentModule('dashboard');
    } else {
      setCurrentModule('dashboard');
    }
  };

  const handleSelectCase = (c: VictimCase) => {
    setActiveCaseDossier(c);
    selectCaseById(c.id);
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    if (stateName === 'National View') {
      setFilterDistrict(null);
    } else {
      setFilterDistrict(stateName);
    }
  };

  // Find demo subject case (Asha K. / TN-2025-0912 or DL-2025-0912)
  const demoCase = cases.find((c) => c.id === 'TN-2025-0912' || c.id === 'DL-2025-0912') || cases[0];

  const demoWorkflowSteps = [
    {
      step: 0,
      title: 'Baseline State',
      description: `Case ${demoCase.maskedName} stable at DDS ${demoCase.distressScore}/100. Routine bi-weekly monitoring active.`,
      actionLabel: '1. Report Distress',
    },
    {
      step: 1,
      title: 'Signal Extraction',
      description: 'Beneficiary reports heightened anxiety & sleep disruption during conversational check-in.',
      actionLabel: '2. Miss Check-in',
    },
    {
      step: 2,
      title: 'Engagement Drop',
      description: 'Scheduled morning voice IVRS check-in unanswered. Engagement index flagged as reduced.',
      actionLabel: '3. Confirm Safety Signal',
    },
    {
      step: 3,
      title: 'Safety Confirmation',
      description: 'Beneficiary explicitly confirms suspicious individuals loitering near residence.',
      actionLabel: '4. Recalculate DDS',
    },
    {
      step: 4,
      title: 'DDS Surge (42 → 67)',
      description: 'Dynamic Distress Score recalculates with Explainable AI attribution. Velocity +3.2 pts/wk.',
      actionLabel: '5. Dispatch Alert',
    },
    {
      step: 5,
      title: 'Priority Risk Alert',
      description: 'Critical triage alert generated with causal explainability & routed to Caseworker Dr. Kavita.',
      actionLabel: '6. Review & Intervene',
    },
    {
      step: 6,
      title: 'Human Caseworker Review',
      description: 'Caseworker initiates Crisis Counselling, alerts jurisdictional police & schedules follow-up.',
      actionLabel: '7. Closed-Loop Reassessment',
    },
    {
      step: 7,
      title: 'Closed Loop Complete',
      description: 'Full SIH pipeline executed: Detection → Review → Intervention → Follow-up → Stabilization.',
      actionLabel: 'Reset Demo Pipeline',
    },
  ];

  const currentStepInfo = demoWorkflowSteps[demoScenarioStep] || demoWorkflowSteps[0];
  const unreadAlertsCount = alerts.filter((a) => !a.actionTaken).length;

  return (
    <div className="h-screen min-h-screen max-w-full bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-700 selection:text-white overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedState={selectedState}
        onStateChange={handleStateChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      <div className="flex-1 flex min-h-0 w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <div className="hidden md:block shrink-0 h-full overflow-hidden">
          <Sidebar
            currentModule={currentModule}
            onSelectModule={(mod) => setCurrentModule(mod)}
            currentRole={currentRole}
            unreadAlertsCount={unreadAlertsCount}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3.5 rounded-2xl bg-teal-800 text-white shadow-xl shadow-teal-900/30 flex items-center justify-center active:scale-95 transition"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden flex">
            <div className="w-72 bg-white h-full shadow-2xl">
              <Sidebar
                currentModule={currentModule}
                onSelectModule={(mod) => {
                  setCurrentModule(mod);
                  setMobileMenuOpen(false);
                }}
                currentRole={currentRole}
                unreadAlertsCount={unreadAlertsCount}
                onOpenEmergency={() => {
                  setIsEmergencyOpen(true);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full space-y-6">
          {/* SIH Core Demo Workflow Controller Bar */}
          {showDemoBanner && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-slate-800 relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_top_right,#14b8a6_0%,transparent_70%)] opacity-15 pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
                {/* Left: Step Indicator & Explanation */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-extrabold text-[10px] tracking-wider uppercase border border-teal-400/30">
                      <Sparkles className="w-3 h-3" />
                      Live Demo Workflow · Step {demoScenarioStep} of 7
                    </span>

                    <span className="text-slate-400 text-xs hidden sm:inline">|</span>

                    <span className="text-xs font-bold text-slate-200">
                      {currentStepInfo.title}
                    </span>

                    <button
                      onClick={() => handleSelectCase(demoCase)}
                      className="text-[10px] font-semibold text-teal-300 hover:text-white underline underline-offset-2 flex items-center gap-1 ml-1"
                    >
                      <span>Inspect {demoCase.maskedName} (DDS: {demoCase.distressScore}/100)</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">
                    {currentStepInfo.description}
                  </p>
                </div>

                {/* Right: Step Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={runDemoScenarioStep}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition active:scale-95"
                    title="Simulate the next major step in the continuous monitoring workflow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Next: {currentStepInfo.actionLabel}</span>
                  </button>

                  <button
                    onClick={resetDemoScenario}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Reset to Baseline State"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Flow Ribbon */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto text-[10px] font-medium text-slate-400">
                {[
                  '1. Check-in',
                  '2. Signal Analysis',
                  '3. Missed Prompt',
                  '4. Safety Confirm',
                  '5. Dynamic DDS',
                  '6. Risk Alert',
                  '7. Intervention',
                  '8. Reassessment',
                ].map((name, idx) => {
                  const isActive = demoScenarioStep === idx;
                  const isPast = demoScenarioStep > idx;
                  return (
                    <div
                      key={name}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition whitespace-nowrap ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                          : isPast
                          ? 'text-slate-400 font-semibold'
                          : 'text-slate-600'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-3 h-3 text-teal-400" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-400 animate-pulse' : 'bg-slate-700'}`} />
                      )}
                      <span>{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If Role is Mobile Simulation Mode */}
          {currentRole === 'mobile_demo' ? (
            <MobileViewSimulator onOpenEmergency={() => setIsEmergencyOpen(true)} />
          ) : (
            <>
              {/* Module Routing */}
              {currentModule === 'dashboard' && (
                <>
                  {(currentRole === 'admin' || currentRole === 'district_official') && (
                    <AdminDashboard
                      onSelectCase={handleSelectCase}
                      onNavigate={(m) => setCurrentModule(m)}
                    />
                  )}
                  {currentRole === 'beneficiary' && (
                    <BeneficiaryPortal
                      onNavigate={(m) => setCurrentModule(m)}
                      onOpenEmergency={() => setIsEmergencyOpen(true)}
                    />
                  )}
                  {currentRole === 'counsellor' && (
                    <CounsellorDashboard
                      onSelectCase={handleSelectCase}
                      onNavigate={(m) => setCurrentModule(m)}
                      onOpenEmergency={() => setIsEmergencyOpen(true)}
                    />
                  )}
                </>
              )}

              {currentModule === 'victim_cases' && (
                <CaseManagement
                  onSelectCase={handleSelectCase}
                  onOpenEmergency={() => setIsEmergencyOpen(true)}
                />
              )}

              {currentModule === 'risk_monitoring' && (
                <RiskMonitoring
                  onSelectCase={handleSelectCase}
                  onOpenEmergency={() => setIsEmergencyOpen(true)}
                />
              )}

              {currentModule === 'alerts_actions' && (
                <AlertsActions
                  onNavigate={(m) => setCurrentModule(m)}
                  onOpenEmergency={() => setIsEmergencyOpen(true)}
                />
              )}

              {currentModule === 'interventions' && <InterventionsView />}

              {currentModule === 'counselling_services' && (
                <CounsellorDashboard
                  onSelectCase={handleSelectCase}
                  onNavigate={(m) => setCurrentModule(m)}
                  onOpenEmergency={() => setIsEmergencyOpen(true)}
                />
              )}

              {currentModule === 'support_services' && <SupportServicesView />}

              {currentModule === 'map_view' && <SupportServicesView />}

              {currentModule === 'schemes_resources' && <SchemesResourcesView />}

              {currentModule === 'reports_analytics' && (
                <AdminDashboard
                  onSelectCase={handleSelectCase}
                  onNavigate={(m) => setCurrentModule(m)}
                />
              )}

              {currentModule === 'dynamic_distress_score' && (
                <DynamicDistressScoreView onOpenEmergency={() => setIsEmergencyOpen(true)} />
              )}

              {currentModule === 'case_timeline' && <CaseTimelineView />}

              {currentModule === 'support_profile' && <SupportProfileView />}

              {currentModule === 'chat_spc' && (
                <ChatWithSPC onOpenEmergency={() => setIsEmergencyOpen(true)} />
              )}

              {currentModule === 'ivrs_simulation' && (
                <IVRSSimulation onOpenEmergency={() => setIsEmergencyOpen(true)} />
              )}

              {currentModule === 'sms_simulation' && <SMSSimulation />}

              {currentModule === 'settings' && <AppSettingsView />}

              {currentModule === 'emergency_support' && (
                <div className="max-w-xl mx-auto py-8">
                  <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600 animate-pulse">
                      <span className="text-3xl">🚨</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">National Emergency Support 112</h2>
                    <p className="text-xs text-slate-600">
                      Emergency dispatch center for immediate police rescue, medical ambulances and safe house shelter.
                    </p>
                    <button
                      onClick={() => setIsEmergencyOpen(true)}
                      className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-base shadow-lg shadow-rose-600/30 transition active:scale-98"
                    >
                      Open Emergency SOS Console
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Case Profile Detailed Dossier Modal */}
      {activeCaseDossier && (
        <CaseProfileModal
          caseData={activeCaseDossier}
          onClose={() => {
            setActiveCaseDossier(null);
            selectCaseById(null);
          }}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />
      )}

      {/* Alert Detail Modal */}
      {activeAlertModal && (
        <AlertDetailModal
          alert={activeAlertModal}
          onClose={() => setActiveAlertModal(null)}
          onOpenCaseProfile={(cId) => {
            const target = cases.find((c) => c.id === cId) || demoCase;
            setActiveCaseDossier(target);
            setActiveAlertModal(null);
          }}
        />
      )}

      {/* Emergency Modal Available from any screen */}
      <EmergencySupportModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        victimName={currentRole === 'beneficiary' ? 'Asha K.' : 'Asha Kumari'}
        caseId={demoCase.id}
      />
    </div>
  );
}
