import React, { useState } from 'react';
import {
  Type,
  Sun,
  Volume2,
  VolumeX,
  Mic,
  Brain,
  Keyboard,
  Sliders,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FontSizeOption } from '../../types';

export const AccessibilityQuickBar: React.FC = () => {
  const {
    accessibility,
    updateAccessibility,
    setIsAccessibilityModalOpen,
    setIsAccessibilityHelpOpen,
    speakText,
    isSpeaking,
    stopSpeaking,
    announceToScreenReader,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const cycleFontSize = () => {
    const order: FontSizeOption[] = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = order.indexOf(accessibility.fontSize);
    const nextIndex = (currentIndex + 1) % order.length;
    const nextSize = order[nextIndex];
    updateAccessibility({ fontSize: nextSize });
  };

  const toggleHighContrast = () => {
    updateAccessibility({ highContrast: !accessibility.highContrast });
  };

  const toggleSimpleLanguage = () => {
    updateAccessibility({ simpleLanguage: !accessibility.simpleLanguage });
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(
        'Welcome to SPC AI, Self-Promising Caretaker AI System. All accessibility features are active and ready.'
      );
    }
  };

  return (
    <nav
      aria-label="Accessibility Quick Access Toolbar"
      className="bg-slate-900/90 text-white border-b border-slate-800 text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto shadow-xs"
    >
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          Accessibility:
        </span>

        {/* 1. Text Size Cycle */}
        <button
          type="button"
          onClick={cycleFontSize}
          aria-label={`Cycle font size. Current is ${accessibility.fontSize}`}
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-slate-700 transition"
          title="Change Font Size"
        >
          <Type className="w-3.5 h-3.5 text-teal-400" />
          <span className="capitalize">{accessibility.fontSize}</span>
        </button>

        {/* 2. Contrast Toggle */}
        <button
          type="button"
          onClick={toggleHighContrast}
          aria-pressed={accessibility.highContrast}
          className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border transition ${
            accessibility.highContrast
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Toggle High Contrast"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Contrast {accessibility.highContrast ? 'ON' : 'Off'}</span>
        </button>

        {/* 3. Simple Language Mode */}
        <button
          type="button"
          onClick={toggleSimpleLanguage}
          aria-pressed={accessibility.simpleLanguage}
          className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border transition ${
            accessibility.simpleLanguage
              ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Plain / Simplified Language Mode"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Simple Language {accessibility.simpleLanguage ? 'ON' : 'Off'}</span>
        </button>

        {/* 4. Read Aloud */}
        <button
          type="button"
          onClick={handleReadAloud}
          aria-label={isSpeaking ? 'Stop reading aloud' : 'Read page summary aloud'}
          className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border transition ${
            isSpeaking
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Read Aloud (Text to Speech)"
        >
          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
          <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Keyboard Help trigger */}
        <button
          type="button"
          onClick={() => setIsAccessibilityHelpOpen(true)}
          className="text-[11px] text-slate-300 hover:text-white font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          title="Keyboard shortcuts & guidance"
        >
          <Keyboard className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Keyboard Guide</span>
        </button>

        {/* All Accessibility Preferences */}
        <button
          type="button"
          onClick={() => setIsAccessibilityModalOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-xs transition"
          title="Open Full Accessibility Panel"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>All Settings (♿)</span>
        </button>
      </div>
    </nav>
  );
};
