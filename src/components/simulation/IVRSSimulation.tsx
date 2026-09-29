import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Grid,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface IVRSSimulationProps {
  onOpenEmergency?: () => void;
}

export const IVRSSimulation: React.FC<IVRSSimulationProps> = ({ onOpenEmergency }) => {
  const { selectedCase, confirmSignalForCase, updateCaseDDS } = useApp();

  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('connected');
  const [callDuration, setCallDuration] = useState(42);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');
  const [completedStep, setCompletedStep] = useState<number>(3); // 1 to 6
  const [checkinCompleteNotice, setCheckinCompleteNotice] = useState(false);

  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; time: string }>>([
    {
      speaker: 'IVRS Automated System',
      text: 'Namaste! Welcome to SPC automated welfare check-in. This is a confidential call under Ministry of Home Affairs.',
      time: '00:05',
    },
    {
      speaker: 'IVRS Automated System',
      text: 'Step 3: How are you feeling today? Press 1 for emotional support, 2 to log safety concern, 3 for legal and compensation updates, or 4 for counsellor callback.',
      time: '00:15',
    },
  ]);

  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Support direct keyboard input for DTMF IVRS simulation (Accessibility Req 6 & 13)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*'].includes(e.key) && callState === 'connected') {
        handleKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callState, callDuration, language, selectedCase]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const speakPrompt = (text: string) => {
    if (!isSpeaker || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyPress = (digit: string) => {
    const timeStr = formatTimer(callDuration);
    let botResponse = '';

    setCompletedStep(4);

    if (digit === '1') {
      botResponse = 'Recorded Key 1 (Emotional Support). A calming 2-minute breathing exercise is ready, or your counsellor Dr. Kavita will call you today.';
      confirmSignalForCase(selectedCase.id, {
        type: 'anxiety',
        label: 'Voice check-in: Requested emotional support (DTMF 1)',
        source: 'ivrs',
        confidence: 0.96,
        userConfirmed: true,
      });
    } else if (digit === '2') {
      botResponse = 'Recorded Key 2 (Safety Priority Alert). Threat assessment notice forwarded to jurisdictional police special cell. Please remain in a safe location.';
      confirmSignalForCase(selectedCase.id, {
        type: 'safety_concern',
        label: 'Voice check-in: Logged safety priority alert (DTMF 2)',
        source: 'ivrs',
        confidence: 0.98,
        userConfirmed: true,
      });
    } else if (digit === '3') {
      botResponse = `Case ${selectedCase.id}: Next hearing is scheduled on ${selectedCase.nextHearingDate || '10 Jul 2025'} at Sessions Court with DLSA Legal Aid Counsel.`;
    } else if (digit === '4') {
      botResponse = 'Counsellor Call-Back request confirmed. Dr. Kavita Singhania will contact you on your registered phone within 30 minutes.';
    } else if (digit === '9' || digit === '0') {
      botResponse = 'Connecting to National Emergency Helpline 112... Transferring with GPS location coordinates.';
      if (onOpenEmergency) onOpenEmergency();
    } else {
      botResponse = `Key ${digit} received. Please press 1 for emotional support, 2 for safety alert, 3 for court status, or 4 for counsellor callback.`;
    }

    setTranscript((prev) => [
      ...prev,
      { speaker: 'Beneficiary (DTMF Tone)', text: `Pressed Key [ ${digit} ]`, time: timeStr },
      { speaker: 'IVRS Automated System', text: botResponse, time: timeStr },
    ]);

    speakPrompt(botResponse);
    setCompletedStep(5);
  };

  const startCall = () => {
    setCallState('calling');
    setCheckinCompleteNotice(false);
    setCompletedStep(1);

    setTimeout(() => {
      setCallState('connected');
      setCallDuration(0);
      setCompletedStep(2);
      speakPrompt('Namaste! Welcome to SPC automated welfare check-in.');
    }, 1500);
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ended');
    setCompletedStep(6);
    setCheckinCompleteNotice(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Left 6 Cols: Hyper-realistic Handset Calling UI */}
      <div className="lg:col-span-6 flex justify-center">
        <div className="w-full max-w-sm bg-slate-950 text-white rounded-[44px] p-6 shadow-2xl border-4 border-slate-800 flex flex-col justify-between h-[700px] relative overflow-hidden">
          {/* Phone Speaker Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-12 h-1.5 rounded-full bg-slate-800"></span>
          </div>

          {/* Top Status */}
          <div className="pt-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SPC Voice Check-in</span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">Voice Call (IVRS)</h2>
            <p className="text-xs text-slate-400 mt-0.5">We are here to listen</p>

            <div className="text-3xl font-mono font-bold mt-4 tracking-wider text-emerald-400">
              {callState === 'connected' && formatTimer(callDuration)}
              {callState === 'calling' && 'Initiating Call...'}
              {callState === 'ended' && 'Call Completed'}
              {callState === 'idle' && '00:00'}
            </div>
          </div>

          {/* Center: Audio Waveform Animation */}
          <div className="my-auto py-6 flex flex-col items-center justify-center">
            {callState === 'connected' ? (
              <div className="flex items-center justify-center gap-1.5 h-24 w-full">
                {[24, 48, 72, 36, 85, 95, 60, 40, 75, 55, 90, 65, 30, 80, 45].map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-teal-500 via-indigo-400 to-pink-400 rounded-full animate-pulse"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${(i * 0.1).toFixed(1)}s`,
                      animationDuration: '1.2s',
                    }}
                  />
                ))}
              </div>
            ) : callState === 'calling' ? (
              <div className="w-24 h-24 rounded-full border-4 border-teal-500/40 border-t-teal-400 animate-spin flex items-center justify-center">
                <PhoneCall className="w-8 h-8 text-teal-400" />
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                <p className="text-sm font-bold text-teal-300">Check-in recorded successfully.</p>
                <p className="text-slate-400 text-xs">Signals updated in case record.</p>
              </div>
            )}

            {/* Quick Language switcher on call */}
            <div className="mt-4 flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-xs">
              <span className="text-slate-400">Language:</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded font-bold ${language === 'en' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-0.5 rounded font-bold ${language === 'ta' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded font-bold ${language === 'hi' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* DTMF Keypad Overlay or Call Controls */}
          {showKeypad ? (
            <div className="bg-slate-900/95 p-4 rounded-3xl border border-slate-800 animate-in fade-in">
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeyPress(k)}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-teal-600 active:scale-95 text-white font-bold text-base transition shadow-sm"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowKeypad(false)}
                className="w-full py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Hide Keypad
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Audio Controls Row */}
              <div className="flex items-center justify-around">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex flex-col items-center gap-1 text-[11px] ${isMuted ? 'text-rose-400' : 'text-slate-300'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 hover:bg-slate-700'}`}>
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </div>
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                <button
                  onClick={() => setShowKeypad(true)}
                  className="flex flex-col items-center gap-1 text-[11px] text-slate-300"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center">
                    <Grid className="w-5 h-5" />
                  </div>
                  <span>Keypad</span>
                </button>

                <button
                  onClick={() => {
                    setIsSpeaker(!isSpeaker);
                    if (isSpeaker) window.speechSynthesis?.cancel();
                  }}
                  className={`flex flex-col items-center gap-1 text-[11px] ${isSpeaker ? 'text-teal-400' : 'text-slate-500'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSpeaker ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800'}`}>
                    {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <span>{isSpeaker ? 'Speaker' : 'Muted Audio'}</span>
                </button>
              </div>

              {/* End / Start Call Button */}
              <div className="flex justify-center pt-2">
                {callState === 'connected' || callState === 'calling' ? (
                  <button
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-rose-600/40 transition"
                    title="End Call"
                  >
                    <PhoneOff className="w-7 h-7" />
                  </button>
                ) : (
                  <button
                    onClick={startCall}
                    className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-emerald-600/40 transition"
                    title="Start Call"
                  >
                    <PhoneCall className="w-7 h-7" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right 6 Cols: IVRS Step by Step Architecture & Live Transcript */}
      <div className="lg:col-span-6 space-y-6">
        {/* Step-by-Step Progress Module (Requirement 15) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">IVRS Workflow Execution (6 Steps)</h3>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              Step {completedStep}/6
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { step: 1, label: '1. Call Initiated' },
              { step: 2, label: '2. Language Selected' },
              { step: 3, label: '3. Questions Asked' },
              { step: 4, label: '4. User Responses' },
              { step: 5, label: '5. Signals Extracted' },
              { step: 6, label: '6. Check-in Completed' },
            ].map((st) => (
              <div
                key={st.step}
                className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
                  completedStep >= st.step
                    ? 'bg-teal-50 border-teal-200 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {completedStep >= st.step ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">
                    {st.step}
                  </span>
                )}
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          {checkinCompleteNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Check-in recorded successfully. Dynamic signals synced with case dossier.</span>
            </div>
          )}
        </div>

        {/* Live Audio Transcript & Dynamic Distress Impact */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Live Call Transcript &amp; Logs</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <button
                onClick={() => setTranscript([])}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[280px] pr-2 text-xs">
              {transcript.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border ${
                    item.speaker.includes('Beneficiary')
                      ? 'bg-teal-50/60 border-teal-100'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="font-bold text-slate-800">{item.speaker}</span>
                    <span className="text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Case: {selectedCase.id} ({selectedCase.maskedName})</span>
            </span>
            <span className="font-bold text-teal-800">Simulated Call — No Real Charges</span>
          </div>
        </div>
      </div>
    </div>
  );
};
