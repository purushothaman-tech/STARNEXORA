import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../../types';
import {
  Search,
  Bell,
  ChevronDown,
  ShieldAlert,
  Globe,
  UserCheck,
  Shield,
  Building2,
  Heart,
  Smartphone,
  Activity,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Wifi,
  WifiOff,
  Sliders,
  EyeOff,
  RefreshCw,
  Clock,
  Trash2,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../i18n/translations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenEmergency: () => void;
  unreadAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedState,
  onStateChange,
  searchQuery,
  onSearchChange,
  onOpenEmergency,
  unreadAlertsCount = 5,
}) => {
  const {
    alerts,
    setActiveAlertModal,
    cases,
    selectCaseById,
    setFilterDistrict,
    accessibility,
    connectionStatus,
    setConnectionStatus,
    announceToScreenReader,
    setIsAccessibilityModalOpen,
    triggerQuickExit,
    logout,
  } = useApp();
  const { currentLanguage, setLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showScopeMenu, setShowScopeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showConnectionMenu, setShowConnectionMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Search History State with localStorage Persistence
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spc_search_history') || localStorage.getItem('carels_search_history') || localStorage.getItem('sahaara_search_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // ignore read error
    }
    return ['Chennai', 'High Risk', 'Domestic Violence', 'Lucknow'];
  });

  const saveSearchTerm = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('spc_search_history', JSON.stringify(updated));
      } catch (e) {
        // ignore write error
      }
      return updated;
    });
  };

  const removeSearchTerm = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchHistory((prev) => {
      const updated = prev.filter((term) => term !== termToRemove);
      try {
        localStorage.setItem('spc_search_history', JSON.stringify(updated));
      } catch (e) {
        // ignore write error
      }
      return updated;
    });
  };

  const clearSearchHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchHistory([]);
    try {
      localStorage.removeItem('spc_search_history');
      localStorage.removeItem('carels_search_history');
      localStorage.removeItem('sahaara_search_history');
    } catch (e) {
      // ignore remove error
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global "/" keyboard shortcut to instantly focus intelligent search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowRoleMenu(false);
        setShowScopeMenu(false);
        setShowLangMenu(false);
        setMobileSearchOpen(false);
        setSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const jurisdictions = [
    { label: 'National Jurisdiction (All 36 States & UTs)', value: 'National View', type: 'National' },
    { label: 'Uttar Pradesh (Central Command)', value: 'Uttar Pradesh', type: 'State' },
    { label: 'Maharashtra (Western Command)', value: 'Maharashtra', type: 'State' },
    { label: 'Delhi NCT (Capital Command)', value: 'Delhi NCT', type: 'UT' },
    { label: 'Tamil Nadu (Southern Command)', value: 'Tamil Nadu', type: 'State' },
    { label: 'Bihar (Eastern Command)', value: 'Bihar', type: 'State' },
    { label: 'Rajasthan (North-West Command)', value: 'Rajasthan', type: 'State' },
    { label: 'Karnataka (South-West Command)', value: 'Karnataka', type: 'State' },
  ];

  // Filter matching cases based on search query
  const matchingCases = searchQuery.trim().length > 1
    ? cases.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.maskedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingDistricts = searchQuery.trim().length > 1
    ? ['Chennai', 'Lucknow', 'Pune', 'South Delhi', 'Patna', 'Jaipur', 'Bengaluru'].filter((d) =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalMonitoredCount = '12,482';
  const requireReviewCount = alerts.filter((a) => !a.actionTaken).length * 128 + 2;

  return (
    <>
      {/* Skip to Main Content Link for Keyboard and Screen Readers (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-to-content">
        {t('skipToContent', currentLanguage)}
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(15,23,42,0.05)] transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 lg:gap-5">

        {/* 1. LEFT BRAND AREA: Official SPC AI Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <img src="/spc_logo.svg" alt="SPC AI Official Logo" className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-xs" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>

          {/* Typography Lockup */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-slate-950 tracking-tight text-base sm:text-xl font-sans">
                SPC
              </span>
              <span className="font-black text-purple-600 tracking-tight text-base sm:text-xl font-sans">
                AI
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-1.5 py-0.5 rounded-full tracking-wide ml-1">
                Self-Promising Caretaker
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">
              <span className="text-slate-800 font-bold tracking-tight">Self-Promising Caretaker AI</span>
              <span className="hidden xl:inline text-slate-300">·</span>
              <span className="hidden xl:inline text-[10px] text-slate-500 font-medium">Listen • Understand • Care • Monitor • Predict • Support</span>
            </div>

            {/* Support Network Active Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-teal-700 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-600" />
              </span>
              <span className="tracking-tight">Support Network Active</span>
            </div>
          </div>
        </div>

        {/* 2. CENTER AREA: Wide Intelligent Search Component */}
        <div ref={searchContainerRef} className="w-full min-w-[220px] max-w-[320px] lg:max-w-[360px] hidden md:block relative">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  saveSearchTerm(searchQuery);
                }
              }}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSearchFocused(true);
              }}
              placeholder={t('searchPlaceholder', currentLanguage)}
              className="w-full pl-10 pr-12 py-2 bg-slate-50/80 hover:bg-white focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200/90 focus:border-teal-700 focus:ring-3 focus:ring-teal-600/10 focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
            />
            {/* Keyboard Shortcut Hint */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200/90 px-1.5 py-0.5 rounded shadow-2xs">
                /
              </kbd>
            </div>
          </div>

          {/* Search History Dropdown (when query is empty or <= 1 char) */}
          {searchFocused && searchQuery.trim().length <= 1 && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-[280px] sm:w-[320px] md:w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
              <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{t('recentSearches', currentLanguage)}</span>
                </div>
                <button
                  type="button"
                  onClick={clearSearchHistory}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-800 transition flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-rose-50 cursor-pointer shrink-0"
                  title={t('clearHistory', currentLanguage)}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t('clearHistory', currentLanguage)}</span>
                </button>
              </div>

              <div className="space-y-1 pt-1">
                {searchHistory.map((term) => (
                  <div
                    key={term}
                    onClick={() => {
                      onSearchChange(term);
                      saveSearchTerm(term);
                      setSearchFocused(true);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-teal-50/60 cursor-pointer transition text-xs group"
                  >
                    <div className="flex items-center gap-2 text-slate-700 group-hover:text-teal-900 font-medium truncate pr-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                      <span className="truncate">{term}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => removeSearchTerm(term, e)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                      title={`Remove "${term}" from history`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intelligent Search Dropdown */}
          {searchFocused && searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 mt-2 w-[280px] sm:w-[320px] md:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
              {matchingCases.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                    Matching Victim Cases ({matchingCases.length})
                  </div>
                  <div className="space-y-1">
                    {matchingCases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          saveSearchTerm(c.maskedName);
                          selectCaseById(c.id);
                          setSearchFocused(false);
                        }}
                        className="p-2 rounded-xl hover:bg-teal-50 cursor-pointer flex items-center justify-between transition text-xs group"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-teal-900">
                            <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-1 rounded">{c.id}</span>
                            <span>{c.maskedName}</span>
                            <span className="text-[11px] text-slate-400 font-normal">· {c.district}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate max-w-sm mt-0.5">{c.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.distressScore >= 75 ? 'bg-rose-100 text-rose-700' :
                            c.distressScore >= 50 ? 'bg-amber-100 text-amber-700' :
                            'bg-teal-100 text-teal-700'
                          }`}>
                            DDS {c.distressScore}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingDistricts.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Jurisdiction / Districts
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {matchingDistricts.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          saveSearchTerm(d);
                          setFilterDistrict(d);
                          onStateChange(d);
                          setSearchFocused(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 text-xs font-semibold transition"
                      >
                        {d} Command Area &rarr;
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingCases.length === 0 && matchingDistricts.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching cases found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. SUPPORT PULSE: Unique Continuous Monitoring Status Module */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs shadow-2xs shrink-0">
          {/* Animated Telemetry Pulse Wave */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {t('supportPulse', currentLanguage)}
              </span>
            </div>
          </div>

          <span className="w-px h-4 bg-slate-200" aria-hidden="true" />

          {/* Telemetry Numbers (Zero-pill, clean unboxed typography) */}
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-800 font-bold">{totalMonitoredCount}</span>
            <span className="text-slate-500 text-[11px]">{t('monitored', currentLanguage)}</span>

            <span className="text-slate-300">·</span>

            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-rose-600 font-extrabold">{requireReviewCount}</span>
              <span className="text-rose-700/80 text-[11px] font-semibold">{t('requireReview', currentLanguage)}</span>
            </span>
          </div>
        </div>

        {/* 4. RIGHT AREA: Controls, Jurisdiction, SOS Beacon, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Mobile search trigger button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Search cases"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Search cases"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Multilingual Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select language"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/90 text-xs font-bold text-slate-800 transition cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="font-bold">
                {currentLanguage === 'ta' ? 'தமிழ்' : currentLanguage === 'hi' ? 'हिन्दी' : 'English'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('language', currentLanguage)}
                </div>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ta', label: 'தமிழ் (Tamil)' },
                  { code: 'hi', label: 'हिन्दी (Hindi)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as 'en' | 'ta' | 'hi');
                      setShowLangMenu(false);
                      announceToScreenReader(`Language changed to ${l.label}`, 'polite');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                      currentLanguage === l.code
                        ? 'bg-teal-50 text-teal-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span>{l.label}</span>
                    {currentLanguage === l.code && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Jurisdiction / Scope Selector (National / State / District) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowScopeMenu(!showScopeMenu)}
              aria-label="Select jurisdiction"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-semibold text-slate-800 transition cursor-pointer"
              title={t('selectJurisdiction', currentLanguage)}
            >
              <Globe className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="truncate max-w-[110px] lg:max-w-[130px] font-bold">
                {selectedState}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Scope Dropdown */}
            {showScopeMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('jurisdictionCommandLevel', currentLanguage)}
                </div>
                <div className="space-y-1">
                  {jurisdictions.map((j) => {
                    const isSelected = selectedState === j.value;
                    return (
                      <button
                        key={j.value}
                        onClick={() => {
                          onStateChange(j.value);
                          setShowScopeMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-teal-50 text-teal-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{j.value}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{j.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Connection Status Indicator */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setShowConnectionMenu(!showConnectionMenu)}
              aria-label={`Connection Status: ${connectionStatus}. Click to inspect offline resilience`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-[11px] font-bold transition cursor-pointer"
            >
              {connectionStatus === 'online' ? (
                <span className="flex items-center gap-1 text-emerald-700">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xl:inline">{t('online', currentLanguage)}</span>
                </span>
              ) : connectionStatus === 'syncing' ? (
                <span className="flex items-center gap-1 text-teal-700 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                  <span>{t('syncing', currentLanguage)}</span>
                </span>
              ) : connectionStatus === 'sync_failed' ? (
                <span className="flex items-center gap-1 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('syncFailed', currentLanguage)}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-800">
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('offline', currentLanguage)}</span>
                </span>
              )}
            </button>

            {showConnectionMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px]">Resilient Data Sync Status</span>
                  <button onClick={() => setShowConnectionMenu(false)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-[11px] font-medium text-slate-700">
                    {connectionStatus === 'online'
                      ? 'Network active. All check-ins and records sync directly with National Central Directory.'
                      : connectionStatus === 'syncing'
                      ? 'Syncing cached responses with secure cloud backend...'
                      : connectionStatus === 'sync_failed'
                      ? 'Sync failed. Tap to retry.'
                      : 'Offline mode: your response has been saved on this device and will be synced when the network returns.'}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  {connectionStatus === 'online' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setConnectionStatus('offline');
                        announceToScreenReader('Offline mode: your response has been saved on this device and will be synced when the network returns.', 'assertive');
                        setShowConnectionMenu(false);
                      }}
                      className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition text-center cursor-pointer"
                    >
                      Simulate 2G / Offline
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setConnectionStatus('syncing');
                        announceToScreenReader('Syncing queued check-ins...', 'polite');
                        setTimeout(() => {
                          setConnectionStatus('online');
                          announceToScreenReader('Synced successfully.', 'polite');
                          setShowConnectionMenu(false);
                        }, 1200);
                      }}
                      className="w-full py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] transition text-center shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{connectionStatus === 'sync_failed' ? 'Tap to retry' : 'Sync Queued Data Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Accessibility Settings Trigger */}
          <button
            type="button"
            onClick={() => setIsAccessibilityModalOpen(true)}
            aria-label="Open accessibility settings and preferences"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/90 text-xs font-bold text-slate-800 transition cursor-pointer"
            title="Accessibility Preferences (WCAG 2.2 AA)"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden sm:inline">{t('accessibility', currentLanguage)}</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          </button>

          {/* Discreet Quick Exit Button for Protected Beneficiaries */}
          {currentRole === 'beneficiary' && (
            <button
              type="button"
              onClick={triggerQuickExit}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              title="Discreet Safe Exit: Instantly hides sensitive details"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">{t('quickExit', currentLanguage)}</span>
            </button>
          )}

          {/* Emergency Support Action */}
          <button
            type="button"
            onClick={onOpenEmergency}
            aria-label={t('emergencySupport', currentLanguage)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-rose-600/30 transition group shrink-0 cursor-pointer"
            title="Immediate Police & Crisis Dispatch (112)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white animate-pulse shrink-0" />
            <span className="tracking-tight hidden xs:inline">{t('emergencySupport', currentLanguage)}</span>
            <span className="text-[10px] bg-white/20 font-black px-1.5 py-0.2 rounded ml-0.5">112</span>
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-xs">{t('priorityTriageAlerts', currentLanguage)}</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                      {unreadAlertsCount} {t('unresolved', currentLanguage)}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    {t('close', currentLanguage)}
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setActiveAlertModal(alert);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 text-xs transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 font-mono text-[11px]">{alert.caseId}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            alert.actionTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {alert.actionTaken ? t('resolved', currentLanguage) : t('active', currentLanguage)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{alert.timeAgo}</span>
                      </div>
                      <p className="font-bold text-rose-600 group-hover:text-teal-900 text-[11px] mt-0.5">{alert.headline}</p>
                      <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Administrator / User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-950 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {currentRole === 'admin' && 'MS'}
                {currentRole === 'district_official' && 'RK'}
                {currentRole === 'counsellor' && 'KS'}
                {currentRole === 'beneficiary' && 'AK'}
                {currentRole === 'mobile_demo' && '📱'}
              </div>

              <div className="hidden xl:block leading-none pr-1">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentRole === 'admin' && 'Dr. Meera Sharma'}
                  {currentRole === 'district_official' && 'Rajesh Kumar'}
                  {currentRole === 'counsellor' && 'Dr. Kavita Singhania'}
                  {currentRole === 'beneficiary' && 'Asha K.'}
                  {currentRole === 'mobile_demo' && 'Mobile Mode'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {currentRole === 'admin' && t('nationalAdministrator', currentLanguage)}
                  {currentRole === 'district_official' && 'District Coordinator'}
                  {currentRole === 'counsellor' && t('caseworkerPsychologist', currentLanguage)}
                  {currentRole === 'beneficiary' && t('protectedSurvivor', currentLanguage)}
                  {currentRole === 'mobile_demo' && t('handsetSimulation', currentLanguage)}
                </p>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Platform User Identity (4 Roles)
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onRoleChange('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition text-xs font-semibold ${
                      currentRole === 'admin'
                        ? 'bg-indigo-50 text-indigo-950 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-indigo-700 shrink-0" />
                    <div>
                      <div>1. National Administrator</div>
                      <div className="text-[10px] text-slate-400 font-normal">Super Admin (Dr. Meera Sharma)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('district_official');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition text-xs font-semibold ${
                      currentRole === 'district_official'
                        ? 'bg-blue-50 text-blue-950 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <div>
                      <div>2. District Coordinator</div>
                      <div className="text-[10px] text-slate-400 font-normal">District Command (Rajesh Kumar)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('counsellor');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition text-xs font-semibold ${
                      currentRole === 'counsellor'
                        ? 'bg-teal-50 text-teal-950 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-teal-700 shrink-0" />
                    <div>
                      <div>3. Caseworker / Psychologist</div>
                      <div className="text-[10px] text-slate-400 font-normal">Clinical Lead (Dr. Kavita)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('beneficiary');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition text-xs font-semibold ${
                      currentRole === 'beneficiary'
                        ? 'bg-purple-50 text-purple-950 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div>4. Protected Survivor</div>
                      <div className="text-[10px] text-slate-400 font-normal">Beneficiary Portal (Asha K.)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('mobile_demo');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition text-xs font-semibold ${
                      currentRole === 'mobile_demo'
                        ? 'bg-amber-50 text-amber-950 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div>Mobile View Simulation</div>
                      <div className="text-[10px] text-slate-400 font-normal">Interactive Handset</div>
                    </div>
                  </button>

                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleMenu(false);
                        logout();
                      }}
                      className="w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div>Log Out</div>
                        <div className="text-[10px] text-slate-400 font-normal">End authenticated session</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay Bar when toggled */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 py-2 bg-slate-50 flex flex-col gap-2 animate-in slide-in-from-top-2 relative">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  saveSearchTerm(searchQuery);
                }
              }}
              placeholder={t('searchPlaceholder', currentLanguage)}
              className="flex-1 py-1.5 px-2 bg-transparent text-xs text-slate-800 focus:outline-none font-medium"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Search History Chips */}
          {searchQuery.trim().length === 0 && searchHistory.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-teal-600" />
                <span>{t('recentSearches', currentLanguage)}:</span>
              </div>
              {searchHistory.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    onSearchChange(term);
                    saveSearchTerm(term);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-teal-900 font-medium shrink-0 text-[11px] flex items-center gap-1 shadow-2xs"
                >
                  <span>{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
    </>
  );
};
