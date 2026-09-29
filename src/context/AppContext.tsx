import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';
import {
  VictimCase,
  RiskAlert,
  InterventionRecord,
  FollowUpRecord,
  UserRole,
  SupportedLanguage,
  ConfirmedSignal,
  SafetyState,
  DistressState,
  AuditLogEntry,
  ConsentRecord,
  UserPreferences,
  AccessibilityPreferences,
  ConnectionStatus,
  TimelineEvent,
  InteractionRecord,
} from '../types';
import {
  mockCasesList,
  mockRiskAlerts,
  mockInterventions,
  mockFollowUps,
  mockBeneficiaryCase,
  mockAuditLogs,
  mockInitialConsent,
  mockPreferences,
  defaultAccessibilityPreferences,
} from '../data/mockData';

export interface UserProfile {
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  avatar: string;
  badgeText: string;
  badgeBg: string;
}

export function getProfileForRole(role: UserRole): UserProfile {
  switch (role) {
    case 'admin':
      return {
        name: 'Dr. Meera Sharma',
        role: 'admin',
        roleTitle: 'Nodal Director & National Admin',
        email: 'meera.sharma@mha.gov.in',
        avatar: 'MS',
        badgeText: 'National Directorate',
        badgeBg: 'bg-indigo-100 text-indigo-800',
      };
    case 'counsellor':
      return {
        name: 'Dr. Kavita Singhania',
        role: 'counsellor',
        roleTitle: 'Senior Psychosocial Caseworker',
        email: 'kavita.singhania@support.gov.in',
        avatar: 'KS',
        badgeText: 'Triage Caseworker',
        badgeBg: 'bg-teal-100 text-teal-800',
      };
    case 'beneficiary':
      return {
        name: 'Asha K.',
        role: 'beneficiary',
        roleTitle: 'Protected Survivor & Beneficiary',
        email: 'asha.k@protected.spc',
        avatar: 'AK',
        badgeText: 'Protected Beneficiary',
        badgeBg: 'bg-purple-100 text-purple-800',
      };
    case 'district_official':
      return {
        name: 'Insp. V. Raghavan',
        role: 'district_official',
        roleTitle: 'District Magistrate & Protection Officer',
        email: 'v.raghavan@police.tn.gov.in',
        avatar: 'VR',
        badgeText: 'District Official',
        badgeBg: 'bg-blue-100 text-blue-800',
      };
    case 'mobile_demo':
      return {
        name: 'Asha K. (Mobile)',
        role: 'mobile_demo',
        roleTitle: 'Mobile Simulator Beneficiary',
        email: 'asha.mobile@protected.spc',
        avatar: 'AK',
        badgeText: 'Mobile Simulator',
        badgeBg: 'bg-amber-100 text-amber-800',
      };
  }
}

interface AppContextType {
  cases: VictimCase[];
  alerts: RiskAlert[];
  interventions: InterventionRecord[];
  followUps: FollowUpRecord[];
  auditLogs: AuditLogEntry[];
  consent: ConsentRecord;
  preferences: UserPreferences;
  accessibility: AccessibilityPreferences;
  connectionStatus: ConnectionStatus;
  currentRole: UserRole;
  isAuthenticated: boolean;
  currentUser: UserProfile;
  isSwitchUserModalOpen: boolean;
  setIsSwitchUserModalOpen: (open: boolean) => void;
  login: (role: UserRole, credentials?: any) => void;
  logout: () => void;
  switchUser: (role: UserRole) => void;
  currentLanguage: SupportedLanguage;
  selectedCaseId: string | null;
  selectedCase: VictimCase;
  activeAlertModal: RiskAlert | null;
  isDemoMode: boolean;
  demoScenarioStep: number;
  unmaskPII: boolean;
  filterDistrict: string | null;
  filterRisk: string | null;
  filterStage: string | null;

  // Accessibility & Inclusive UX states
  announcement: { message: string; priority: 'polite' | 'assertive'; id: number } | null;
  isSpeaking: boolean;
  speechPaused: boolean;
  activeCaption: string | null;
  isQuickExitActive: boolean;
  isAccessibilityModalOpen: boolean;
  isAccessibilityHelpOpen: boolean;

  // Actions
  setRole: (role: UserRole) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  updateAccessibility: (prefs: Partial<AccessibilityPreferences>) => void;
  resetAccessibility: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  announceToScreenReader: (msg: string, priority?: 'polite' | 'assertive') => void;
  speakText: (text: string, options?: { lang?: SupportedLanguage; isSensitive?: boolean; onEnd?: () => void }) => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  stopSpeaking: () => void;
  triggerQuickExit: () => void;
  resumeFromQuickExit: () => void;
  setIsAccessibilityModalOpen: (open: boolean) => void;
  setIsAccessibilityHelpOpen: (open: boolean) => void;
  selectCaseById: (id: string | null) => void;
  setActiveAlertModal: (alert: RiskAlert | null) => void;
  toggleUnmaskPII: () => void;
  setFilterDistrict: (dist: string | null) => void;
  setFilterRisk: (risk: string | null) => void;
  setFilterStage: (stage: string | null) => void;
  resolveAlert: (alertId: string) => void;
  createAlert: (alertData: Omit<RiskAlert, 'id' | 'timeAgo' | 'timestamp'>) => void;
  assignCounsellorToCase: (caseId: string, counsellorName: string) => void;
  addIntervention: (intervention: Omit<InterventionRecord, 'id'>) => void;
  updateInterventionStatus: (id: string, status: InterventionRecord['status']) => void;
  addFollowUp: (followUp: Omit<FollowUpRecord, 'id'>) => void;
  completeFollowUp: (id: string) => void;
  confirmSignalForCase: (caseId: string, signal: Omit<ConfirmedSignal, 'id' | 'timestamp'>) => void;
  calculateDemonstrationDDS: (caseObj: VictimCase) => number;
  updateCaseDDS: (caseId: string, newScore: number, reason: string) => void;
  updateCaseSafetyState: (caseId: string, safetyState: SafetyState, reason: string) => void;
  addTimelineMilestone: (caseId: string, event: Omit<TimelineEvent, 'id'>) => void;
  addInteractionToCase: (caseId: string, interaction: Omit<InteractionRecord, 'id'>) => void;
  updateConsent: (accepted: boolean, pref: 'chat' | 'ivrs' | 'sms' | 'phone', lang: SupportedLanguage) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  logAuditEvent: (action: string, caseId: string, details: string, prevValue?: string, newValue?: string) => void;
  runDemoScenarioStep: () => void;
  resetDemoScenario: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe LocalStorage helpers
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`spc_${key}`) || localStorage.getItem(`carels_${key}`) || localStorage.getItem(`sahaara_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Private browsing or quota exceeded
  }
  return fallback;
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`spc_${key}`, JSON.stringify(data));
  } catch (e) {
    // Storage full or unavailable
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Centralized State hydrated from localStorage or realistic defaults
  const [cases, setCases] = useState<VictimCase[]>(() => loadStorage('cases', mockCasesList));
  const [alerts, setAlerts] = useState<RiskAlert[]>(() => loadStorage('alerts', mockRiskAlerts));
  const [interventions, setInterventions] = useState<InterventionRecord[]>(() => loadStorage('interventions', mockInterventions));
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(() => loadStorage('followUps', mockFollowUps));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadStorage('auditLogs', mockAuditLogs));
  const [consent, setConsent] = useState<ConsentRecord>(() => loadStorage('consent', mockInitialConsent));
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadStorage('preferences', mockPreferences));
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(() =>
    loadStorage('accessibility', defaultAccessibilityPreferences)
  );
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadStorage('currentRole', 'admin'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadStorage('isAuthenticated', false));
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState<boolean>(false);
  const { currentLanguage, setLanguage: setLanguageInLangContext } = useLanguage();
  const [demoScenarioStep, setDemoScenarioStep] = useState<number>(() => loadStorage('demoScenarioStep', 0));

  const currentUser = getProfileForRole(currentRole);

  // Sync to LocalStorage whenever state entities change
  useEffect(() => { saveStorage('cases', cases); }, [cases]);
  useEffect(() => { saveStorage('alerts', alerts); }, [alerts]);
  useEffect(() => { saveStorage('interventions', interventions); }, [interventions]);
  useEffect(() => { saveStorage('followUps', followUps); }, [followUps]);
  useEffect(() => { saveStorage('auditLogs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveStorage('consent', consent); }, [consent]);
  useEffect(() => { saveStorage('preferences', preferences); }, [preferences]);
  useEffect(() => { saveStorage('accessibility', accessibility); }, [accessibility]);
  useEffect(() => { saveStorage('currentRole', currentRole); }, [currentRole]);
  useEffect(() => { saveStorage('isAuthenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveStorage('currentLanguage', currentLanguage); }, [currentLanguage]);
  useEffect(() => { saveStorage('demoScenarioStep', demoScenarioStep); }, [demoScenarioStep]);

  // Transient UI states
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeAlertModal, setActiveAlertModal] = useState<RiskAlert | null>(null);
  const [isDemoMode] = useState<boolean>(true);
  const [unmaskPII, setUnmaskPII] = useState<boolean>(false);
  const [filterDistrict, setFilterDistrict] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<string | null>(null);

  // Inclusive UX & Accessibility Transient states
  const [announcement, setAnnouncement] = useState<{ message: string; priority: 'polite' | 'assertive'; id: number } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechPaused, setSpeechPaused] = useState<boolean>(false);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [isQuickExitActive, setIsQuickExitActive] = useState<boolean>(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isAccessibilityHelpOpen, setIsAccessibilityHelpOpen] = useState<boolean>(false);

  const login = (role: UserRole, _credentials?: { username?: string; password?: string }) => {
    console.log('[AUTH] Login started');
    console.log('[AUTH] Logging in as role:', role);
    setCurrentRole(role);
    setIsAuthenticated(true);
    saveStorage('isAuthenticated', true);
    saveStorage('currentRole', role);
    console.log('[AUTH] Auth state after login: true');
  };

  const logout = () => {
    console.log('[AUTH] Logout started');
    console.log('[AUTH] Current user before logout:', currentUser?.name);
    console.log('[AUTH] Current role before logout:', currentRole);
    console.log('[AUTH] Auth state before logout:', isAuthenticated);

    setIsAuthenticated(false);

    try {
      localStorage.removeItem('spc_isAuthenticated');
      localStorage.removeItem('carels_isAuthenticated');
      localStorage.removeItem('sahaara_isAuthenticated');
      saveStorage('isAuthenticated', false);
      sessionStorage.clear();
    } catch (e) {
      console.warn('[AUTH] Error clearing storage on logout:', e);
    }

    console.log('[AUTH] Storage cleared');
    console.log('[AUTH] Auth state after logout: false');
    console.log('[AUTH] Redirecting to /login');

    setSelectedCaseId(null);
    setActiveAlertModal(null);
    setIsQuickExitActive(false);
    setIsSwitchUserModalOpen(false);
  };

  const switchUser = (newRole: UserRole) => {
    console.log('[AUTH] Switching user session to role:', newRole);
    setCurrentRole(newRole);
    setIsAuthenticated(true);
    saveStorage('isAuthenticated', true);
    saveStorage('currentRole', newRole);
    console.log('[AUTH] Auth state after switch user: true');
  };
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('a11y-font-small', 'a11y-font-medium', 'a11y-font-large', 'a11y-font-xlarge');
    root.classList.add(`a11y-font-${accessibility.fontSize}`);

    if (accessibility.highContrast) root.classList.add('a11y-high-contrast');
    else root.classList.remove('a11y-high-contrast');

    if (accessibility.extraContrast) root.classList.add('a11y-extra-contrast');
    else root.classList.remove('a11y-extra-contrast');

    if (accessibility.reduceMotion) root.classList.add('a11y-reduce-motion');
    else root.classList.remove('a11y-reduce-motion');

    if (accessibility.largerTouchTargets) root.classList.add('a11y-large-targets');
    else root.classList.remove('a11y-large-targets');

    if (accessibility.focusHighlight) root.classList.add('a11y-focus-highlight');
    else root.classList.remove('a11y-focus-highlight');
  }, [accessibility]);

  // Detect network online/offline events for low-connectivity support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => {
      setConnectionStatus('online');
      announceToScreenReader('Network restored. You are now online.', 'polite');
    };
    const handleOffline = () => {
      setConnectionStatus('offline');
      announceToScreenReader('Network connection lost. Offline mode active. All inputs are safely saved on this device.', 'assertive');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Selected case resolver: fallback to SAH-DEMO-001 or TN-2025-0912 or first case
  const selectedCase =
    cases.find((c) => c.id === selectedCaseId) ||
    cases.find((c) => c.id === 'SAH-DEMO-001' || c.id === 'TN-2025-0912') ||
    cases[0];

  const logAuditEvent = (action: string, caseId: string, details: string, prevValue?: string, newValue?: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentRole === 'admin' ? 'Dr. Meera Sharma (Admin)' : currentRole === 'counsellor' ? 'Dr. Kavita Singhania (Counsellor)' : 'Beneficiary Portal',
      action,
      caseId,
      details,
      prevValue,
      newValue,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    logAuditEvent('ROLE_SWITCH', selectedCase.id, `User switched session role to ${role}`);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageInLangContext(lang);
    announceToScreenReader(`Language changed to ${lang === 'ta' ? 'Tamil' : lang === 'hi' ? 'Hindi' : 'English'}`, 'polite');
  };

  const updateAccessibility = (prefs: Partial<AccessibilityPreferences>) => {
    setAccessibility((prev) => {
      const next = { ...prev, ...prefs };
      saveStorage('accessibility', next);
      return next;
    });
    const key = Object.keys(prefs)[0] || 'setting';
    announceToScreenReader(`Accessibility preference ${key} updated.`, 'polite');
  };

  const resetAccessibility = () => {
    setAccessibility(defaultAccessibilityPreferences);
    saveStorage('accessibility', defaultAccessibilityPreferences);
    announceToScreenReader('Accessibility settings restored to defaults.', 'polite');
  };

  const announceToScreenReader = (msg: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message: msg, priority, id: Date.now() });
  };

  const speakText = (text: string, options?: { lang?: SupportedLanguage; isSensitive?: boolean; onEnd?: () => void }) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      announceToScreenReader('Text to speech is not available on this browser.', 'polite');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return;

    setActiveCaption(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = options?.lang || currentLanguage;
    if (targetLang === 'ta') utterance.lang = 'ta-IN';
    else if (targetLang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = accessibility.fontSize === 'extra-large' ? 0.9 : 1.0;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
      setActiveCaption(null);
      if (options?.onEnd) options.onEnd();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
      setActiveCaption(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setSpeechPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setSpeechPaused(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechPaused(false);
      setActiveCaption(null);
    }
  };

  const triggerQuickExit = () => {
    stopSpeaking();
    setIsQuickExitActive(true);
  };

  const resumeFromQuickExit = () => {
    setIsQuickExitActive(false);
  };

  const selectCaseById = (id: string | null) => {
    setSelectedCaseId(id);
  };

  const toggleUnmaskPII = () => {
    setUnmaskPII((prev) => {
      const next = !prev;
      logAuditEvent('PII_PRIVACY_TOGGLE', selectedCase.id, `PII privacy shield set to ${next ? 'UNMASKED' : 'MASKED'}`);
      return next;
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, actionTaken: true, status: 'Resolved' }
          : a
      )
    );
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (targetAlert) {
      logAuditEvent('ALERT_RESOLVED', targetAlert.caseId, `Alert ${alertId} marked as reviewed and resolved by caseworker`, 'Active', 'Resolved');
    }
  };

  const createAlert = (alertData: Omit<RiskAlert, 'id' | 'timeAgo' | 'timestamp'>) => {
    const newAlert: RiskAlert = {
      ...alertData,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    logAuditEvent('ALERT_GENERATED', alertData.caseId, `New triage alert created: ${alertData.headline}`, 'None', alertData.severity);
    announceToScreenReader('New high-priority alert created.', 'assertive');
  };

  const assignCounsellorToCase = (caseId: string, counsellorName: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const prevCounsellor = c.assignedCounsellor;
          return {
            ...c,
            assignedCounsellor: counsellorName,
            timeline: [
              {
                id: `t-${Date.now()}`,
                title: `Counsellor Assigned: ${counsellorName}`,
                date: 'Today',
                category: 'counselling',
                description: `Human caseworker ${counsellorName} assigned to oversee clinical care and protective planning.`,
                status: 'completed',
                officerOrProvider: counsellorName,
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );
    logAuditEvent('COUNSELLOR_ASSIGNED', caseId, `Assigned caseworker: ${counsellorName}`);
  };

  const addIntervention = (intervention: Omit<InterventionRecord, 'id'>) => {
    const newRecord: InterventionRecord = {
      ...intervention,
      id: `INT-${Date.now().toString().slice(-4)}`,
    };
    setInterventions((prev) => [newRecord, ...prev]);

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === intervention.caseId) {
          return {
            ...c,
            interventionStatus: `${intervention.type} (${intervention.status})`,
            timeline: [
              {
                id: `t-${Date.now()}`,
                title: `Intervention Initiated: ${intervention.type}`,
                date: 'Today',
                category: 'counselling',
                description: `${intervention.type} authorized for delivery. Assigned provider: ${intervention.assignedTo}.`,
                status: 'completed',
                officerOrProvider: intervention.assignedTo,
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );
    logAuditEvent('INTERVENTION_CREATED', intervention.caseId, `Created ${intervention.type} (${intervention.status}) assigned to ${intervention.assignedTo}`);
    announceToScreenReader('Intervention assigned successfully.', 'polite');
  };

  const updateInterventionStatus = (id: string, status: InterventionRecord['status']) => {
    setInterventions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    const target = interventions.find((i) => i.id === id);
    if (target) {
      logAuditEvent('INTERVENTION_STATUS_UPDATE', target.caseId, `Intervention ${target.type} status changed to ${status}`, target.status, status);
      announceToScreenReader(`Intervention status updated to ${status}.`, 'polite');
    }
  };

  const addFollowUp = (followUp: Omit<FollowUpRecord, 'id'>) => {
    const newRecord: FollowUpRecord = {
      ...followUp,
      id: `FU-${Date.now().toString().slice(-4)}`,
    };
    setFollowUps((prev) => [newRecord, ...prev]);

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === followUp.caseId) {
          return {
            ...c,
            followUpDate: followUp.scheduledDate,
            timeline: [
              {
                id: `t-${Date.now()}`,
                title: `Follow-up Scheduled: ${followUp.type}`,
                date: followUp.scheduledDate,
                category: 'counselling',
                description: `Review session scheduled with ${followUp.assignedTo}. Focus: ${followUp.notes}`,
                status: 'upcoming',
                officerOrProvider: followUp.assignedTo,
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );
    logAuditEvent('FOLLOWUP_SCHEDULED', followUp.caseId, `Follow-up ${followUp.type} scheduled for ${followUp.scheduledDate} with ${followUp.assignedTo}`);
    announceToScreenReader(`Follow-up scheduled for ${followUp.scheduledDate}.`, 'polite');
  };

  const completeFollowUp = (id: string) => {
    setFollowUps((prev) =>
      prev.map((fu) => (fu.id === id ? { ...fu, status: 'Completed' } : fu))
    );
    const target = followUps.find((f) => f.id === id);
    if (target) {
      logAuditEvent('FOLLOWUP_COMPLETED', target.caseId, `Follow-up ${target.type} completed successfully`);
    }
  };

  // Deterministic demonstration Dynamic Distress Score (DDS) formula:
  // DDS = Self-report component (max 30) + text signal component (max 25) + missed check-in penalty (max 20) + confirmed safety contribution (max 20) + legal proximity bonus (max 10)
  // Transparent, explainable, and clearly stated as non-diagnostic prioritisation indicator.
  const calculateDemonstrationDDS = (caseObj: VictimCase): number => {
    const selfReport = Math.min(30, (caseObj.supportProfile?.psychological || 40) * 0.3);
    const textSignals = Math.min(25, (caseObj.confirmedSignals?.length || 0) * 6.5);
    const missedCheckinPenalty = Math.min(20, (caseObj.missedCheckInsCount || 0) * 7);
    const safetySignalContribution =
      caseObj.safetyState === 'CRITICAL_SAFETY_PROTOCOL'
        ? 20
        : caseObj.safetyState === 'URGENT_REVIEW'
        ? 15
        : caseObj.safetyState === 'SAFETY_CONCERN'
        ? 12
        : 2;
    const legalProximityBonus = caseObj.stage === 'Trial' ? 8 : 4;

    const raw = Math.round(selfReport + textSignals + missedCheckinPenalty + safetySignalContribution + legalProximityBonus);
    return Math.min(100, Math.max(10, raw));
  };

  const updateCaseDDS = (caseId: string, newScore: number, reason: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const prevScore = c.distressScore;
          const trend = newScore > prevScore ? 'up' : newScore < prevScore ? 'down' : 'stable';
          const distressState: DistressState =
            newScore >= 75 ? 'HIGH' : newScore >= 50 ? 'ELEVATED' : newScore > 0 ? 'LOW' : 'UNKNOWN';

          const velocity = newScore > prevScore ? `+${((newScore - prevScore) / 4).toFixed(1)} pts/wk` : '-0.5 pts/wk';

          return {
            ...c,
            previousScore: prevScore,
            distressScore: newScore,
            trend,
            trendVelocity: velocity,
            distressState,
            flaggingReasons: [reason, ...(c.flaggingReasons || [])],
            distressHistory: [
              ...c.distressHistory,
              {
                month: 'Jun (Reassessed)',
                score: newScore,
                distressState,
                engagement: 'Active',
                safetySignal: reason,
              },
            ],
            timeline: [
              {
                id: `t-${Date.now()}`,
                title: `Dynamic Distress Score Calibrated: ${newScore}/100`,
                date: 'Today',
                category: 'counselling',
                description: `Distress indicator adjusted from ${prevScore} to ${newScore} (${trend.toUpperCase()}). Trigger: ${reason}`,
                status: 'completed',
                officerOrProvider: 'SPC Monitoring Engine',
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );
    logAuditEvent('DDS_RECALCULATED', caseId, `Dynamic Distress Score changed due to: ${reason}`, String(selectedCase.distressScore), String(newScore));
    announceToScreenReader(`Dynamic Distress Score updated from ${selectedCase.distressScore} to ${newScore}.`, 'assertive');
  };

  const updateCaseSafetyState = (caseId: string, safetyState: SafetyState, reason: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const prevSafety = c.safetyState;
          return {
            ...c,
            safetyState,
            timeline: [
              {
                id: `t-${Date.now()}`,
                title: `Safety State Updated: ${safetyState.replace(/_/g, ' ')}`,
                date: 'Today',
                category: 'safety',
                description: `Safety posture transitioned from ${prevSafety} to ${safetyState}. Reason: ${reason}`,
                status: 'completed',
                officerOrProvider: 'Human Case Officer Review',
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );
    logAuditEvent('SAFETY_STATE_CHANGED', caseId, `Safety state set to ${safetyState}: ${reason}`);
  };

  const confirmSignalForCase = (
    caseId: string,
    signal: Omit<ConfirmedSignal, 'id' | 'timestamp'>
  ) => {
    const confirmed: ConfirmedSignal = {
      ...signal,
      id: `sig-${Date.now()}`,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedSignals = [confirmed, ...(c.confirmedSignals || [])];
          const isSafety = signal.type === 'safety_concern' || signal.type === 'fear';
          const newScore = Math.min(100, c.distressScore + (isSafety ? 15 : 8));
          const newSafetyState: SafetyState = isSafety ? 'SAFETY_CONCERN' : c.safetyState;

          return {
            ...c,
            confirmedSignals: updatedSignals,
            distressScore: newScore,
            trend: 'up',
            safetyState: newSafetyState,
            supportProfile: {
              ...c.supportProfile,
              psychological: Math.min(100, c.supportProfile.psychological + 10),
              safety: isSafety ? Math.min(100, c.supportProfile.safety + 18) : c.supportProfile.safety,
            },
            timeline: [
              {
                id: `t-${Date.now()}`,
                title: `Confirmed Signal Logged: ${signal.label}`,
                date: 'Today',
                category: isSafety ? 'safety' : 'counselling',
                description: `Human-in-the-loop verification completed by beneficiary via ${signal.source}. Signal verified: ${signal.label}`,
                status: 'completed',
                officerOrProvider: 'Beneficiary Confirmation',
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );
    logAuditEvent('SIGNAL_CONFIRMED', caseId, `Verified signal (${signal.type}): ${signal.label} via ${signal.source}`);
    announceToScreenReader('Signal confirmed.', 'polite');
  };

  const addTimelineMilestone = (caseId: string, event: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `t-${Date.now()}`,
    };
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, timeline: [newEvent, ...c.timeline] } : c))
    );
    logAuditEvent('TIMELINE_MILESTONE_ADDED', caseId, `Added milestone: ${event.title}`);
  };

  const addInteractionToCase = (caseId: string, interaction: Omit<InteractionRecord, 'id'>) => {
    const newRecord: InteractionRecord = {
      ...interaction,
      id: `ix-${Date.now()}`,
    };
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              lastInteraction: 'Just now',
              interactions: [newRecord, ...c.interactions],
            }
          : c
      )
    );
    logAuditEvent('INTERACTION_RECORDED', caseId, `Recorded ${interaction.type} check-in: ${interaction.summary}`);
  };

  const updateConsent = (accepted: boolean, communicationPreference: 'chat' | 'ivrs' | 'sms' | 'phone', language: SupportedLanguage) => {
    setConsent({
      id: `consent-${selectedCase.id}`,
      caseId: selectedCase.id,
      accepted,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      communicationPreference,
      language,
      allowPeriodicCheckins: accepted,
      emergencyContactAuthorized: accepted,
    });
    logAuditEvent('CONSENT_UPDATED', selectedCase.id, `Beneficiary consent status set to: ${accepted ? 'GRANTED' : 'DECLINED'}`);
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  // MAIN DEMO SCENARIO RUNNER (Repeatable, deterministic 8-step pipeline)
  // Step 0: Baseline state: Asha K., DDS = 42, No Critical Signal, Normal engagement.
  // Step 1: Beneficiary reports anxiety & distress via conversational check-in.
  // Step 2: Signal verified by beneficiary.
  // Step 3: Unanswered scheduled morning IVRS check-in (reduced engagement registered).
  // Step 4: Beneficiary confirms physical safety concern (loitering near residence).
  // Step 5: DDS recalculates 42 → 67 (Surge +25, Trend Increasing, Safety Concern).
  // Step 6: Priority alert generated: HIGH REVIEW REQUIRED with Explainable AI reasoning.
  // Step 7: Counsellor reviews, assigns Counselling Support + police patrol, schedules follow-up.
  const runDemoScenarioStep = () => {
    const nextStep = (demoScenarioStep + 1) % 8;
    setDemoScenarioStep(nextStep);

    const targetCaseId = cases.some((c) => c.id === 'SAH-DEMO-001') ? 'SAH-DEMO-001' : 'TN-2025-0912';

    if (nextStep === 1) {
      // Step 1: Beneficiary reports increased anxiety during conversational check-in
      addInteractionToCase(targetCaseId, {
        type: 'chat',
        date: 'Just now',
        summary: 'Conversational check-in: Beneficiary reported sleep disturbance and heightened panic about court date.',
        extractedSignals: ['anxiety', 'fear'],
        status: 'completed',
      });
    } else if (nextStep === 2) {
      // Step 2: Signal verified by user
      confirmSignalForCase(targetCaseId, {
        type: 'anxiety',
        label: 'Acute pre-trial anxiety & panic symptoms confirmed',
        source: 'chat',
        confidence: 0.94,
        userConfirmed: true,
        notes: 'Beneficiary explicitly confirmed apprehension regarding court date.',
      });
    } else if (nextStep === 3) {
      // Step 3: Missed check-in detected
      setCases((prev) =>
        prev.map((c) =>
          c.id === targetCaseId
            ? {
                ...c,
                missedCheckInsCount: 1,
                engagementStatus: 'Reduced',
                notes: 'Scheduled morning IVRS check-in unanswered. Telemetry flagged engagement drop.',
                interactions: [
                  {
                    id: `ix-${Date.now()}`,
                    type: 'ivrs',
                    date: '10:00 AM',
                    summary: 'Automated voice check-in timed out. Call unanswered.',
                    extractedSignals: ['missed_checkin'],
                    status: 'missed',
                  },
                  ...c.interactions,
                ],
              }
            : c
        )
      );
      logAuditEvent('ENGAGEMENT_DROP_DETECTED', targetCaseId, 'Morning IVRS check-in unanswered. Engagement shifted to Reduced.');
    } else if (nextStep === 4) {
      // Step 4: Safety concern confirmed by beneficiary
      confirmSignalForCase(targetCaseId, {
        type: 'safety_concern',
        label: 'Unfamiliar individuals loitering near residence',
        source: 'checkin',
        confidence: 0.96,
        userConfirmed: true,
        notes: 'Beneficiary confirmed YES to physical safety verification inquiry.',
      });
      updateCaseSafetyState(targetCaseId, 'SAFETY_CONCERN', 'Beneficiary explicitly verified suspicious presence near home perimeter.');
    } else if (nextStep === 5) {
      // Step 5: DDS recalculated 42 -> 67, Trend Increasing
      updateCaseDDS(
        targetCaseId,
        67,
        'DDS increased 42 → 67: Anxiety signals + Missed check-in + Confirmed safety concern'
      );
      setCases((prev) =>
        prev.map((c) =>
          c.id === targetCaseId
            ? {
                ...c,
                status: 'Escalating',
                trendVelocity: '+3.2 pts/wk',
              }
            : c
        )
      );
    } else if (nextStep === 6) {
      // Step 6: Priority Alert generated with Explainable AI reasoning
      createAlert({
        caseId: targetCaseId,
        maskedName: 'Asha K.',
        riskType: 'Escalating',
        headline: 'HIGH REVIEW REQUIRED: Significant Distress Surge (42 → 67)',
        description: 'Dynamic Distress Score increased sharply. Engagement decreased (1 missed check-in) & physical safety concern confirmed.',
        trigger: 'Multifactor threshold breach (+25 pts) + Confirmed safety signal',
        reasons: [
          'DDS increased from 42 → 67 (+25 points in 7 days)',
          'Engagement dropped: Unanswered morning check-in',
          'Confirmed safety concern: Suspicious presence reported near home',
          'Trial bail hearing proximity: Within 16 days',
        ],
        severity: 'critical',
        actionTaken: false,
        recommendedAction: 'Assign caseworker for urgent tele-counselling & coordinate police picket with Mylapore PS.',
        assignedReviewer: 'Dr. Kavita Singhania (Counsellor)',
        status: 'Pending Review',
      });
    } else if (nextStep === 7) {
      // Step 7: Counsellor reviews, assigns Counselling Support & schedules follow-up
      addIntervention({
        caseId: targetCaseId,
        victimName: 'Asha K.',
        type: 'Counselling Support',
        status: 'In Progress',
        assignedTo: 'Dr. Kavita Singhania',
        dateInitiated: 'Today',
        frequency: 'Daily Check-in & Crisis Stabilization',
        outcomes: 'Caseworker contacted beneficiary. Parasympathetic breathing coping plan refreshed. Police patrol alerted.',
        aiSuggested: true,
      });

      addFollowUp({
        caseId: targetCaseId,
        scheduledDate: 'Tomorrow 10:00 AM',
        type: 'Safety Verification',
        assignedTo: 'Dr. Kavita Singhania',
        status: 'Pending',
        notes: 'Post-intervention review following perimeter check by Mylapore Police Special Cell.',
      });

      // Mark the demo alert as reviewed
      setAlerts((prev) =>
        prev.map((a) =>
          a.caseId === targetCaseId ? { ...a, actionTaken: true, status: 'Reviewed' } : a
        )
      );

      // Complete closed loop
      setCases((prev) =>
        prev.map((c) =>
          c.id === targetCaseId
            ? {
                ...c,
                status: 'Under Review',
                timeline: [
                  {
                    id: `t-${Date.now()}`,
                    title: 'Closed-Loop Reassessment Completed',
                    date: 'Today',
                    category: 'counselling',
                    description: 'Full SIH loop executed: Detection → Review → Intervention → Follow-up → Stabilization.',
                    status: 'completed',
                    officerOrProvider: 'Dr. Kavita Singhania',
                  },
                  ...c.timeline,
                ],
              }
            : c
        )
      );
    }
  };

  const resetDemoScenario = () => {
    setDemoScenarioStep(0);
    // Reset demo subject SAH-DEMO-001 or TN-2025-0912 back to pristine baseline
    const targetCaseId = cases.some((c) => c.id === 'SAH-DEMO-001') ? 'SAH-DEMO-001' : 'TN-2025-0912';

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === targetCaseId) {
          return {
            ...mockBeneficiaryCase,
            id: targetCaseId,
            distressScore: 42,
            previousScore: 48,
            distressState: 'ELEVATED',
            safetyState: 'NO_CRITICAL_SIGNAL',
            trend: 'stable',
            trendVelocity: '-0.8 pts/wk',
            engagementStatus: 'Active',
            missedCheckInsCount: 0,
            status: 'Moderate Risk',
          };
        }
        return c;
      })
    );

    // Remove active demo alerts, demo interventions, demo follow-ups
    setAlerts((prev) => prev.filter((a) => a.caseId !== targetCaseId || a.id === 'ALT-2025-001'));
    setInterventions((prev) => prev.filter((i) => i.caseId !== targetCaseId || i.id === 'INT-2025-001'));
    setFollowUps((prev) => prev.filter((f) => f.caseId !== targetCaseId || f.id === 'FU-2025-001'));

    logAuditEvent('DEMO_RESET', targetCaseId, 'Demo scenario reset to baseline state (DDS 42, Safe, Active engagement).');
  };

  return (
    <AppContext.Provider
      value={{
        cases,
        alerts,
        interventions,
        followUps,
        auditLogs,
        consent,
        preferences,
        accessibility,
        connectionStatus,
        currentRole,
        isAuthenticated,
        currentUser,
        isSwitchUserModalOpen,
        setIsSwitchUserModalOpen,
        login,
        logout,
        switchUser,
        currentLanguage,
        selectedCaseId,
        selectedCase,
        activeAlertModal,
        isDemoMode,
        demoScenarioStep,
        unmaskPII,
        filterDistrict,
        filterRisk,
        filterStage,
        announcement,
        isSpeaking,
        speechPaused,
        activeCaption,
        isQuickExitActive,
        isAccessibilityModalOpen,
        isAccessibilityHelpOpen,
        setRole,
        setLanguage,
        updateAccessibility,
        resetAccessibility,
        setConnectionStatus,
        announceToScreenReader,
        speakText,
        pauseSpeaking,
        resumeSpeaking,
        stopSpeaking,
        triggerQuickExit,
        resumeFromQuickExit,
        setIsAccessibilityModalOpen,
        setIsAccessibilityHelpOpen,
        selectCaseById,
        setActiveAlertModal,
        toggleUnmaskPII,
        setFilterDistrict,
        setFilterRisk,
        setFilterStage,
        resolveAlert,
        createAlert,
        assignCounsellorToCase,
        addIntervention,
        updateInterventionStatus,
        addFollowUp,
        completeFollowUp,
        confirmSignalForCase,
        calculateDemonstrationDDS,
        updateCaseDDS,
        updateCaseSafetyState,
        addTimelineMilestone,
        addInteractionToCase,
        updateConsent,
        updatePreferences,
        logAuditEvent,
        runDemoScenarioStep,
        resetDemoScenario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
