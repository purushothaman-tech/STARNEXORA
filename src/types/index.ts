export type UserRole =
  | 'admin'
  | 'counsellor'
  | 'beneficiary'
  | 'district_official'
  | 'mobile_demo';

export type AppModule =
  | 'dashboard'
  | 'victim_cases'
  | 'risk_monitoring'
  | 'alerts_actions'
  | 'interventions'
  | 'counselling_services'
  | 'support_services'
  | 'case_timeline'
  | 'dynamic_distress_score'
  | 'support_profile'
  | 'chat_spc'
  | 'ivrs_simulation'
  | 'sms_simulation'
  | 'emergency_support'
  | 'schemes_resources'
  | 'reports_analytics'
  | 'map_view'
  | 'counsellor_dashboard'
  | 'settings';

export type RiskLevel = 'High Risk' | 'Escalating' | 'Moderate Risk' | 'Under Review' | 'Stable';

export type DistressState = 'LOW' | 'ELEVATED' | 'HIGH' | 'UNKNOWN';

export type SafetyState =
  | 'NO_CRITICAL_SIGNAL'
  | 'SAFETY_CONCERN'
  | 'URGENT_REVIEW'
  | 'CRITICAL_SAFETY_PROTOCOL'
  | 'UNKNOWN';

export type DimensionLevel = 'Low' | 'Moderate' | 'High' | 'Unknown';

export type CaseStage =
  | 'FIR Registered'
  | 'Investigation'
  | 'Charge Sheet'
  | 'Trial'
  | 'Rehabilitation'
  | 'Compensation'
  | 'Other';

export interface ConfirmedSignal {
  id: string;
  type:
    | 'distress'
    | 'fear'
    | 'anxiety'
    | 'repeated_concern'
    | 'safety_concern'
    | 'legal_stress'
    | 'financial_difficulty'
    | 'social_isolation';
  label: string;
  source: 'chat' | 'ivrs' | 'sms' | 'counsellor' | 'checkin';
  confidence: number;
  timestamp: string;
  userConfirmed: boolean;
  notes?: string;
}

export interface SupportProfileData {
  psychological: number; // 0-100
  safety: number;
  legalCourtStress: number;
  financialSupport: number;
  socialSupport: number;
  rehabilitationNeeds: number;
  familyImpact: number;
  signals?: Record<string, string[]>;
}

export interface DistressDataPoint {
  month: string;
  score: number;
  distressState: DistressState;
  engagement: 'Active' | 'Moderate' | 'Reduced' | 'Missed';
  safetySignal: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  category: 'legal' | 'counselling' | 'financial' | 'police' | 'safety';
  description: string;
  status: 'completed' | 'upcoming' | 'pending';
  officerOrProvider?: string;
  documentRef?: string;
}

export interface InteractionRecord {
  id: string;
  type: 'chat' | 'ivrs' | 'sms' | 'in_person' | 'counselling';
  date: string;
  summary: string;
  duration?: string;
  extractedSignals: string[];
  status: 'completed' | 'missed';
}

export interface FollowUpRecord {
  id: string;
  caseId: string;
  scheduledDate: string;
  type: 'Clinical Check-in' | 'Legal Status Review' | 'Safety Verification' | 'Compensation Follow-up';
  assignedTo: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  notes: string;
}

export interface InterventionRecord {
  id: string;
  caseId: string;
  victimName: string;
  type:
    | 'Counselling Support'
    | 'Medical Support / Referral'
    | 'Legal Aid'
    | 'Financial Assistance'
    | 'Witness Protection Review'
    | 'Relocation Support'
    | 'Rehabilitation Support';
  status: 'Recommended' | 'Assigned' | 'In Progress' | 'Completed' | 'Rejected';
  assignedTo: string;
  dateInitiated: string;
  frequency: string;
  outcomes: string;
  aiSuggested?: boolean;
}

export interface VictimCase {
  id: string;
  maskedName: string;
  fullName: string;
  category: string;
  district: string;
  state: string;
  distressScore: number;
  previousScore?: number;
  distressState: DistressState;
  safetyState: SafetyState;
  trend: 'up' | 'stable' | 'down';
  trendVelocity?: string; // e.g. "+1.8 pts/wk"
  persistenceDays?: number;
  dataQuality: 'High' | 'Moderate' | 'Low' | 'Insufficient';
  confidenceScore: number; // e.g. 88%
  lastInteraction: string;
  engagementStatus: 'Active' | 'Moderate' | 'Reduced' | 'Critical Silence';
  status: RiskLevel;
  stage: CaseStage;
  phone: string;
  gender: string;
  age: number;
  registeredDate: string;
  nextHearingDate?: string;
  assignedCounsellor: string;
  counsellorPhone: string;
  policeStation: string;
  firNumber: string;
  courtName: string;
  threatLevel: 'Critical' | 'Elevated' | 'Moderate' | 'Guarded' | 'Low';
  supportProfile: SupportProfileData;
  distressHistory: DistressDataPoint[];
  timeline: TimelineEvent[];
  interactions: InteractionRecord[];
  confirmedSignals: ConfirmedSignal[];
  recommendedInterventions: string[];
  recentAlerts: string[];
  missedCheckInsCount: number;
  notes: string;
  flaggingReasons?: string[];
  followUpDate?: string;
  interventionStatus?: string;
}

export interface RiskAlert {
  id: string;
  caseId: string;
  maskedName: string;
  riskType: RiskLevel;
  headline: string;
  description: string;
  trigger: string;
  reasons: string[];
  timeAgo: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  actionTaken: boolean;
  recommendedAction: string;
  assignedReviewer: string;
  status: 'Pending Review' | 'Reviewed' | 'Escalated' | 'Resolved';
}

export interface SupportCenter {
  id: string;
  name: string;
  type: 'One Stop Centre' | 'DLSA Legal Aid' | 'District Hospital' | 'Counselling Centre' | 'Police Special Cell' | 'Shelter Home';
  distance: string;
  district: string;
  state: string;
  phone: string;
  tollFree?: string;
  address: string;
  availableHours: string;
  lat: number;
  lng: number;
  services: string[];
}

export interface GovernmentScheme {
  id: string;
  title: string;
  category: 'Financial' | 'Legal' | 'Health' | 'Safety' | 'Rehabilitation';
  authority: string;
  eligibleCriteria: string;
  benefitAmount: string;
  processingTime: string;
  status: 'Eligible' | 'Applied' | 'Approved' | 'Disbursed' | 'Under Review';
  description: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  caseId: string;
  details: string;
  prevValue?: string;
  newValue?: string;
}

export interface ConsentRecord {
  id: string;
  caseId: string;
  accepted: boolean;
  timestamp: string;
  communicationPreference: 'chat' | 'ivrs' | 'sms' | 'phone';
  language: SupportedLanguage;
  allowPeriodicCheckins: boolean;
  emergencyContactAuthorized: boolean;
}

export type FontSizeOption = 'small' | 'medium' | 'large' | 'extra-large';

export type ConnectionStatus = 'online' | 'offline' | 'syncing' | 'saved_locally' | 'sync_failed';

export interface AccessibilityPreferences {
  fontSize: FontSizeOption;
  highContrast: boolean;
  extraContrast: boolean;
  reduceMotion: boolean;
  largerTouchTargets: boolean;
  screenReaderOptimized: boolean;
  simpleLanguage: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  captions: boolean;
  audioFeedback: boolean;
  focusHighlight: boolean;
  colorBlindFriendly: boolean;
  lowBandwidthMode: boolean;
}

export interface UserPreferences {
  theme: 'light';
  language: SupportedLanguage;
  notificationsEnabled: boolean;
  quietHours: boolean;
  highContrast: boolean;
  accessibility: AccessibilityPreferences;
}

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn' | 'ur';

export type CommunicationStyle = 'simple_short' | 'normal' | 'detailed';

export interface DDSComponents {
  T: number; // Text signals (0-100)
  V: number; // Voice signals (0-100)
  B: number; // Behavioural signals (0-100)
  E: number; // Engagement signals (0-100)
  H: number; // Historical trajectory (0-100)
  C: number; // Case-stage / context signals (0-100)
}
