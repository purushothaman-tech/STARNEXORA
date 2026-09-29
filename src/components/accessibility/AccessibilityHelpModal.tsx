import React, { useEffect, useRef } from 'react';
import {
  X,
  Type,
  Mic,
  Keyboard,
  Globe,
  ShieldAlert,
  PhoneCall,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AccessibilityHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityHelpModal: React.FC<AccessibilityHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLanguage, speakText } = useApp();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const helpTopics = [
    {
      icon: Type,
      title: '1. How to increase text size',
      content:
        'Tap the Accessibility button (♿) in the top header or quick toolbar. Choose "Large" or "Extra Large". All cards, tables, check-in forms, and messages will enlarge immediately without overlapping or cutting off.',
    },
    {
      icon: Mic,
      title: '2. How to use voice input (Speech-to-Text)',
      content:
        'In "Chat with SPC", tap the microphone (🎙 Speak) button. Speak clearly in English, Hindi, or Tamil. You will see a preview of your words on screen. You can review, edit, or retry before confirming to submit.',
    },
    {
      icon: Volume2,
      title: '3. How to listen to text (Text-to-Speech)',
      content:
        'Tap the speaker icon (🔊 Listen) beside any check-in question or message. SPC will read the text aloud in your chosen language. For sensitive safety information, the system will ask for your confirmation before playing audio.',
    },
    {
      icon: Keyboard,
      title: '4. Keyboard navigation shortcuts',
      content:
        'Press Tab to move to the next button or field. Press Shift + Tab to go back. Press Enter or Space to activate buttons. Press Escape to close any open dialog or modal. A visible high-contrast outline shows your active position at all times.',
    },
    {
      icon: Globe,
      title: '5. How to change language',
      content:
        'Select English, தமிழ் (Tamil), or हिन्दी (Hindi) from the language selector in the top bar. All check-in flows, distress prompts, and assistive audio will match your chosen language.',
    },
    {
      icon: ShieldAlert,
      title: '6. How to use Emergency Support safely',
      content:
        'Tap the red Emergency Support 112 button. To prevent accidental triggers, an explicit confirmation screen will ask: "Are you sure you want to contact emergency support?". When confirmed, emergency guidance and simulated PCR dispatch coordinates are presented.',
    },
    {
      icon: PhoneCall,
      title: '7. How to connect with a human caseworker',
      content:
        'In the Beneficiary Portal or Chat, select "Request a Call from Counsellor". Your assigned designated psychologist Dr. Kavita Singhania will be notified for a direct telephonic check-in.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-help-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 sticky top-0 z-20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold text-lg">
              📖
            </div>
            <div>
              <h2 id="a11y-help-title" className="text-lg sm:text-xl font-black text-white">
                Accessibility &amp; Inclusive Guide
              </h2>
              <p className="text-xs text-slate-300">
                Simple instructions on how to use voice, large text, screen readers, and safe emergency help.
              </p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close accessibility guide"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 sm:p-6 space-y-4 text-xs flex-1">
          {helpTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-teal-50/30 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Icon className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{topic.title}</span>
                  </div>

                  <button
                    onClick={() => speakText(topic.title + '. ' + topic.content)}
                    aria-label={`Listen to ${topic.title}`}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium pl-6">{topic.content}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end sticky bottom-0 z-20">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-sm transition"
          >
            Understood, Return to SPC
          </button>
        </div>
      </div>
    </div>
  );
};
