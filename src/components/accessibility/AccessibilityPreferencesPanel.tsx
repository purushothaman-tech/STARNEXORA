import React from 'react';
import {
  Type,
  Sun,
  Eye,
  Volume2,
  Mic,
  Subtitles,
  Activity,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Shield,
  Layers,
  Sparkle,
  Radio,
  Sliders,
  Move,
  MessageSquare,
  BookmarkCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FontSizeOption } from '../../types';

interface AccessibilityPreferencesPanelProps {
  showHeader?: boolean;
  onOpenHelp?: () => void;
  onClose?: () => void;
}

export const AccessibilityPreferencesPanel: React.FC<AccessibilityPreferencesPanelProps> = ({
  showHeader = true,
  onOpenHelp,
  onClose,
}) => {
  const { accessibility, updateAccessibility, resetAccessibility, announceToScreenReader } = useApp();

  const fontSizes: { value: FontSizeOption; label: string; desc: string; sizeRem: string }[] = [
    { value: 'small', label: 'Small', desc: 'Compact layout (14px root scale)', sizeRem: '14px' },
    { value: 'medium', label: 'Medium', desc: 'Standard comfortable reading (16px base)', sizeRem: '16px' },
    { value: 'large', label: 'Large', desc: 'Enlarged text legibility (18px root scale)', sizeRem: '18px' },
    { value: 'extra-large', label: 'Extra Large', desc: 'Maximum accessibility scale (20px root)', sizeRem: '20px' },
  ];

  const handleFontSizeChange = (size: FontSizeOption) => {
    updateAccessibility({ fontSize: size });
    announceToScreenReader(`Font size adjusted to ${size}.`, 'polite');
  };

  const handleToggle = (key: keyof typeof accessibility, label: string) => {
    const nextVal = !accessibility[key];
    updateAccessibility({ [key]: nextVal });
    announceToScreenReader(`${label} ${nextVal ? 'enabled' : 'disabled'}. Saved to local storage.`, 'polite');
  };

  const activeFeaturesCount = Object.entries(accessibility).filter(
    ([k, v]) => v === true || (k === 'fontSize' && (v === 'large' || v === 'extra-large'))
  ).length;

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                ♿
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Accessibility Preferences Panel
              </h2>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
                WCAG 2.2 AA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customise typography, high contrast, sensory motion, and plain language. Persisted globally on this browser via localStorage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>{activeFeaturesCount} active features</span>
            </span>

            {onOpenHelp && (
              <button
                type="button"
                onClick={onOpenHelp}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Typography & Font Size Scaling */}
      <fieldset className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <legend className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-1">
          <Type className="w-4 h-4 text-teal-700" />
          <span>Font Size &amp; Typography Scaling</span>
        </legend>
        <p className="text-slate-500 text-[11px]">
          Scales application-wide typography proportionally without overlapping or breaking layouts.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {fontSizes.map((f) => {
            const isSelected = accessibility.fontSize === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFontSizeChange(f.value)}
                aria-pressed={isSelected}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/90 font-bold text-teal-950 ring-2 ring-teal-700/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{f.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />}
                </div>
                <div className="mt-2">
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                    {f.sizeRem}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1 leading-snug line-clamp-2">{f.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 2. High Contrast & Visual Accessibility */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-teal-700" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              High Contrast &amp; Color Accessibility
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Low Vision &amp; Glare</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* High Contrast */}
          <div
            onClick={() => handleToggle('highContrast', 'High Contrast Mode')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('highContrast', 'High Contrast Mode')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.highContrast
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">High Contrast Mode</span>
                {accessibility.highContrast && (
                  <span className="text-[9px] bg-amber-200 text-amber-950 font-black px-1.5 py-0.2 rounded">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Deepens text contrast, reinforces borders, and provides dark button outlines.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.highContrast ? 'bg-amber-600' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.highContrast ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Extra Contrast */}
          <div
            onClick={() => handleToggle('extraContrast', 'Extra Contrast Mode')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('extraContrast', 'Extra Contrast Mode')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.extraContrast
                ? 'bg-slate-950 text-white border-black ring-2 ring-slate-900/30'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-xs ${accessibility.extraContrast ? 'text-white' : 'text-slate-900'}`}>
                  Extra Contrast (Maximum)
                </span>
                {accessibility.extraContrast && (
                  <span className="text-[9px] bg-white text-slate-950 font-black px-1.5 py-0.2 rounded">ACTIVE</span>
                )}
              </div>
              <p className={`text-[11px] leading-snug ${accessibility.extraContrast ? 'text-slate-300' : 'text-slate-600'}`}>
                Absolute stark black/white outlines on all controls and form elements.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.extraContrast ? 'bg-teal-400' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.extraContrast ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Colour-Blind Friendly Indicators */}
          <div
            onClick={() => handleToggle('colorBlindFriendly', 'Colour-Blind Friendly Mode')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('colorBlindFriendly', 'Colour-Blind Friendly Mode')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.colorBlindFriendly
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Colour-Blind Indicators</span>
                {accessibility.colorBlindFriendly && (
                  <span className="text-[9px] bg-teal-200 text-teal-950 font-black px-1.5 py-0.2 rounded">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Requires distinctive text labels and icon symbols beside every risk badge and alert.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.colorBlindFriendly ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.colorBlindFriendly ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Visible Focus Highlight */}
          <div
            onClick={() => handleToggle('focusHighlight', 'Focus Ring Highlight')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('focusHighlight', 'Focus Ring Highlight')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.focusHighlight
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Enhanced Visible Focus Ring</span>
                {accessibility.focusHighlight && (
                  <span className="text-[9px] bg-teal-200 text-teal-950 font-black px-1.5 py-0.2 rounded">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Thick high-visibility cyan ring on whichever button or input currently has focus.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.focusHighlight ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.focusHighlight ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reduced Motion & Motor Accessibility */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-teal-700" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Reduced Motion &amp; Motor Accessibility
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Vestibular &amp; Dexterity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Reduced Motion */}
          <div
            onClick={() => handleToggle('reduceMotion', 'Reduced Motion Mode')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('reduceMotion', 'Reduced Motion Mode')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.reduceMotion
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Reduced Motion Mode</span>
                {accessibility.reduceMotion && (
                  <span className="text-[9px] bg-teal-200 text-teal-950 font-black px-1.5 py-0.2 rounded">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Disables animated transitions, pulsing beacons, and chart animations to prevent vestibular dizziness.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.reduceMotion ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.reduceMotion ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Larger Touch Targets */}
          <div
            onClick={() => handleToggle('largerTouchTargets', 'Expanded Touch Targets (44px+)')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('largerTouchTargets', 'Expanded Touch Targets (44px+)')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.largerTouchTargets
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Expanded Touch Targets (44px+)</span>
                {accessibility.largerTouchTargets && (
                  <span className="text-[9px] bg-teal-200 text-teal-950 font-black px-1.5 py-0.2 rounded">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Enlarges button tap boundaries for tremors, motor limitations, or one-handed phone use.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.largerTouchTargets ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.largerTouchTargets ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Simplified Language Mode & Cognitive Accessibility */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-700" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Simplified Language Mode &amp; Reading Simplicity
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Low-Literacy &amp; Cognitive</span>
        </div>

        <div
          onClick={() => handleToggle('simpleLanguage', 'Simplified Language Mode')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('simpleLanguage', 'Simplified Language Mode')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
            accessibility.simpleLanguage
              ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
              : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Simplified Language Mode (Plain Language)</span>
              {accessibility.simpleLanguage && (
                <span className="text-[10px] bg-teal-200 text-teal-950 font-black px-2 py-0.5 rounded-full">ACTIVE</span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Replaces administrative jargon with everyday, reassuring language. Explains unfamiliar legal terms and shortens sentences.
            </p>

            {/* Practical Example Box */}
            <div className="mt-2 p-3 bg-white rounded-xl border border-teal-200/80 text-[11px] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 line-through">"Escalation review required"</span>
                <span className="text-slate-400">→</span>
                <strong className="text-teal-900">"Your recent check-ins show that you may need extra support"</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 line-through">"Dynamic Distress Score"</span>
                <span className="text-slate-400">→</span>
                <strong className="text-teal-900">"Well-being level"</strong>
              </div>
            </div>
          </div>

          <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 self-start sm:self-auto ${accessibility.simpleLanguage ? 'bg-teal-700' : 'bg-slate-300'}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.simpleLanguage ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* 5. Voice, Captions & Screen Reader Assistance */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-700" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Speech, Voice &amp; Auditory Assistance
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Audio &amp; Transcripts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Text-to-Speech */}
          <div
            onClick={() => handleToggle('textToSpeech', 'Text-to-Speech')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('textToSpeech', 'Text-to-Speech')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.textToSpeech
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <span className="font-bold text-xs text-slate-900 block">Text-to-Speech (Read Aloud)</span>
              <p className="text-[11px] text-slate-600 leading-snug">
                Enables audio read-aloud buttons for check-in questions, instructions, and scheme info.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.textToSpeech ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.textToSpeech ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Speech-to-Text */}
          <div
            onClick={() => handleToggle('speechToText', 'Speech-to-Text')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('speechToText', 'Speech-to-Text')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.speechToText
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <span className="font-bold text-xs text-slate-900 block">Speech-to-Text (Voice Check-in)</span>
              <p className="text-[11px] text-slate-600 leading-snug">
                Microphone voice input with transcription review before sending.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.speechToText ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.speechToText ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Live Captions */}
          <div
            onClick={() => handleToggle('captions', 'Simultaneous Captions')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('captions', 'Simultaneous Captions')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.captions
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <span className="font-bold text-xs text-slate-900 block">Simultaneous Captions</span>
              <p className="text-[11px] text-slate-600 leading-snug">
                Displays real-time subtitles and transcripts for all audio content.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.captions ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.captions ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Screen Reader Optimisation */}
          <div
            onClick={() => handleToggle('screenReaderOptimized', 'Screen Reader Optimisation')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToggle('screenReaderOptimized', 'Screen Reader Optimisation')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
              accessibility.screenReaderOptimized
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-600/20'
                : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <span className="font-bold text-xs text-slate-900 block">Screen Reader Optimisation</span>
              <p className="text-[11px] text-slate-600 leading-snug">
                Employs rich ARIA live announcements and landmark navigation traps.
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 shrink-0 ${accessibility.screenReaderOptimized ? 'bg-teal-700' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${accessibility.screenReaderOptimized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Persistence & Reset Footer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>All preferences are saved automatically in your browser (localStorage).</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 font-bold text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-xs transition"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
