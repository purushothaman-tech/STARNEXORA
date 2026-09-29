import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  Globe,
  Shield,
  Wifi,
  CheckCircle2,
  Lock,
  Moon,
  Volume2,
  RefreshCw,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessibilityPreferencesPanel } from '../accessibility/AccessibilityPreferencesPanel';

type SettingsTab = 'accessibility' | 'notifications' | 'language' | 'privacy' | 'offline' | 'account';

export const AppSettingsView: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    currentLanguage,
    setLanguage,
    unmaskPII,
    toggleUnmaskPII,
    connectionStatus,
    setConnectionStatus,
    announceToScreenReader,
    setIsAccessibilityHelpOpen,
    currentUser,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('accessibility');

  const tabs: { id: SettingsTab; label: string; icon: any; desc: string }[] = [
    {
      id: 'accessibility',
      label: 'Accessibility Settings',
      icon: Sliders,
      desc: 'Typography scale, high contrast, reduced motion & simple language',
    },
    {
      id: 'notifications',
      label: 'Notifications & Alerts',
      icon: Bell,
      desc: 'Triage alert triggers, sound chimes & quiet hours',
    },
    {
      id: 'language',
      label: 'Language & Locale',
      icon: Globe,
      desc: 'Regional language support (English, Hindi, Tamil)',
    },
    {
      id: 'privacy',
      label: 'Privacy & Shielding',
      icon: Shield,
      desc: 'Survivor PII masking & session protection',
    },
    {
      id: 'offline',
      label: 'Offline & Resilience',
      icon: Wifi,
      desc: '2G low-bandwidth queuing & local cache management',
    },
    {
      id: 'account',
      label: 'Session & Security',
      icon: Lock,
      desc: 'Current user session, role identity & logout',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded uppercase border border-teal-200">
              System Configuration &amp; Inclusivity
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Saved to localStorage
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Application Settings &amp; Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage accessibility, inclusive communication, notification preferences, and privacy protection protocols.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAccessibilityHelpOpen(true)}
          className="px-3.5 py-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 self-start md:self-auto"
        >
          <span>♿ Open A11y Guide</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div
        role="tablist"
        aria-label="Application Settings Sections"
        className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto border border-slate-200/80"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                announceToScreenReader(`Switched to ${tab.label}.`, 'polite');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* 1. Accessibility Settings Tab Panel */}
        {activeTab === 'accessibility' && (
          <div
            id="tabpanel-accessibility"
            role="tabpanel"
            aria-labelledby="tab-accessibility"
            className="animate-in fade-in"
          >
            <AccessibilityPreferencesPanel
              showHeader={true}
              onOpenHelp={() => setIsAccessibilityHelpOpen(true)}
            />
          </div>
        )}

        {/* 2. Notifications & Alerts Tab Panel */}
        {activeTab === 'notifications' && (
          <div
            id="tabpanel-notifications"
            role="tabpanel"
            aria-labelledby="tab-notifications"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in text-xs"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Notification &amp; Triage Alert Dispatch</h2>
              <p className="text-slate-500 text-xs">Configure notifications for high-risk flags and emergency updates.</p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notificationsEnabled}
                  onChange={(e) => updatePreferences({ notificationsEnabled: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block text-xs">High-Priority Triage Notifications</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Receive immediate in-app alerts whenever a beneficiary reaches High Risk or triggers a safety protocol.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quietHours}
                  onChange={(e) => updatePreferences({ quietHours: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Quiet Hours (22:00 – 07:00 IST)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Mute non-urgent follow-up prompts and routine check-in notifications during night hours to avoid disturbing survivors.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 3. Language & Locale Tab Panel */}
        {activeTab === 'language' && (
          <div
            id="tabpanel-language"
            role="tabpanel"
            aria-labelledby="tab-language"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in text-xs"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Regional Language &amp; Localization</h2>
              <p className="text-slate-500 text-xs">Choose the primary operational language for beneficiary check-ins and prompts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { code: 'en', label: 'English', desc: 'Standard administrative & judicial terminology' },
                { code: 'hi', label: 'हिन्दी (Hindi)', desc: 'देवनागरी लिपि में संपूर्ण इंटरफ़ेस' },
                { code: 'ta', label: 'தமிழ் (Tamil)', desc: 'முழுமையான தமிழ் மொழிபெயர்ப்பு' },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code as any)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    currentLanguage === l.code
                      ? 'border-teal-700 bg-teal-50 text-teal-950 font-bold ring-2 ring-teal-700/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{l.label}</span>
                    {currentLanguage === l.code && <CheckCircle2 className="w-4 h-4 text-teal-700" />}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Privacy & Shielding Tab Panel */}
        {activeTab === 'privacy' && (
          <div
            id="tabpanel-privacy"
            role="tabpanel"
            aria-labelledby="tab-privacy"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in text-xs"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Privacy, Masking &amp; Data Shielding</h2>
              <p className="text-slate-500 text-xs">Compliant with Indian DPDP Act 2023 &amp; Witness Protection Scheme.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Personally Identifiable Information (PII) Masking</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Currently: {unmaskPII ? 'Unmasked (Audited session)' : 'Masked (e.g. Asha K. · 98765***** · Confidential)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleUnmaskPII}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 transition"
                >
                  {unmaskPII ? 'Mask PII' : 'Unmask PII (Logged)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Offline & Resilience Tab Panel */}
        {activeTab === 'offline' && (
          <div
            id="tabpanel-offline"
            role="tabpanel"
            aria-labelledby="tab-offline"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in text-xs"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Offline Resilience &amp; Data Synchronization</h2>
              <p className="text-slate-500 text-xs">Ensures uninterrupted operation in remote tribal and low-connectivity regions.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Current Connectivity Status</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  connectionStatus === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {connectionStatus}
                </span>
              </div>

              <p className="text-[11px] text-slate-600">
                All records, check-in answers, and milestone creations are automatically cached in local storage and queued for synchronization when connectivity is re-established.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConnectionStatus(connectionStatus === 'online' ? 'offline' : 'online');
                    announceToScreenReader(`Connection mode set to ${connectionStatus === 'online' ? 'offline' : 'online'}.`, 'polite');
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 font-bold rounded-xl text-slate-800 text-xs transition"
                >
                  {connectionStatus === 'online' ? 'Simulate Offline' : 'Restore Online'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 6. Session & Security Tab Panel */}
        {activeTab === 'account' && (
          <div
            id="tabpanel-account"
            role="tabpanel"
            aria-labelledby="tab-account"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in text-xs"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Active Session &amp; Security Controls</h2>
              <p className="text-slate-500 text-xs">Manage active identity session, authentication state, and session termination.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">{currentUser.name}</span>
                  <span className="text-[11px] font-semibold text-slate-500">{currentUser.roleTitle} ({currentUser.email})</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${currentUser.badgeBg}`}>
                  {currentUser.badgeText}
                </span>
              </div>

              <p className="text-[11px] text-slate-600">
                You are currently signed into an active session. Clicking Log Out will securely terminate your session, clear session tokens, and block protected routes until you re-authenticate.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Log Out &amp; Terminate Session &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
