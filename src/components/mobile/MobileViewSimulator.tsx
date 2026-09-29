import React, { useState } from 'react';
import {
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  PhoneCall,
  MessageCircle,
  Clock,
  BookOpen,
  ShieldAlert,
  MapPin,
  BellRing,
  Mic,
  Send,
  Sparkles,
  Smile,
  CheckCircle2,
  PhoneOff,
  Grid,
  Volume2,
} from 'lucide-react';
import { mockBeneficiaryCase, mockSupportCenters, mockGovernmentSchemes } from '../../data/mockData';

interface MobileViewSimulatorProps {
  onOpenEmergency: () => void;
}

export const MobileViewSimulator: React.FC<MobileViewSimulatorProps> = ({ onOpenEmergency }) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [locationShared, setLocationShared] = useState(false);
  const [counsellorNotified, setCounsellorNotified] = useState(false);

  const screenTitles = [
    { title: '1. Home Portal', desc: 'Beneficiary Home & Safe Space' },
    { title: '2. Chat with SPC', desc: 'Trauma-Informed AI Chatbot' },
    { title: '3. Voice Call (IVRS)', desc: 'Interactive Audio Call' },
    { title: '4. My Well-being', desc: 'Dynamic Distress Score Dial' },
    { title: '5. Support Needs', desc: '7 Dimensions Breakdown' },
    { title: '6. Case Status', desc: 'Judicial Milestone Timeline' },
    { title: '7. Resources & Schemes', desc: 'Financial, Legal & Safety Grants' },
    { title: '8. Emergency Help', desc: 'SOS 112 & Location Beacon' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Smartphone Experience Simulation</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Replicating the 8 mobile handset interfaces engineered for victim accessibility across India.
          </p>
        </div>

        {/* Screen Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto text-xs max-w-full">
          {screenTitles.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreenIndex(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                activeScreenIndex === idx
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Handset Display Container */}
      <div className="flex flex-col items-center justify-center">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-6 mb-4">
          <button
            onClick={() => setActiveScreenIndex((prev) => (prev > 0 ? prev - 1 : 7))}
            className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 transition"
            title="Previous Screen"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="font-extrabold text-sm text-slate-900">{screenTitles[activeScreenIndex].title}</h3>
            <p className="text-xs text-slate-500">{screenTitles[activeScreenIndex].desc}</p>
          </div>
          <button
            onClick={() => setActiveScreenIndex((prev) => (prev < 7 ? prev + 1 : 0))}
            className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 transition"
            title="Next Screen"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Device Frame */}
        <div className="w-[360px] h-[720px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between select-none">
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full flex items-center justify-between px-3 z-30 pointer-events-none">
            <span className="text-[9px] text-white font-mono font-bold">9:41</span>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="flex items-center gap-1 text-[9px] text-white">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Screen Body with Inner Border */}
          <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-y-auto overflow-x-hidden pt-8 pb-4 px-3 relative flex flex-col justify-between text-xs text-slate-800">
            {/* SCREEN 1: Home Portal */}
            {activeScreenIndex === 0 && (
              <div className="space-y-3 pb-6">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                      C
                    </div>
                    <span className="font-black text-purple-900 text-xs">SPC</span>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    EN ▾
                  </span>
                </div>

                {/* Hero card */}
                <div className="p-4 bg-gradient-to-b from-purple-100/70 to-pink-50 rounded-2xl border border-purple-200 text-center relative">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-200/60 flex items-center justify-center text-purple-700">
                    <Heart className="w-8 h-8 fill-purple-400 text-purple-600" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">A safe space to listen,</h3>
                  <h3 className="font-extrabold text-purple-700 text-sm">support and stand with you</h3>
                  <div className="mt-2 text-[10px] text-slate-600 leading-snug">
                    Your well-being matters. We are here to listen and protect you.
                  </div>
                </div>

                {/* Mobile action buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveScreenIndex(1)}
                    className="w-full py-2.5 px-3 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with SPC</span>
                  </button>
                  <button
                    onClick={() => setActiveScreenIndex(2)}
                    className="w-full py-2.5 px-3 bg-white text-slate-800 border border-slate-200 rounded-xl font-bold flex items-center gap-2 text-xs"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span>Request a Call (IVRS)</span>
                  </button>
                  <button
                    onClick={() => setActiveScreenIndex(7)}
                    className="w-full py-2.5 px-3 bg-rose-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs text-xs"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Emergency Help (112)</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: Chat with SPC */}
            {activeScreenIndex === 1 && (
              <div className="flex flex-col h-full justify-between pb-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Chat with SPC</h4>
                    <span className="text-[9px] text-emerald-600 font-semibold">● Online • Trauma Assistant</span>
                  </div>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 pr-1 text-xs">
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-800 shadow-2xs">
                    Hello Asha! I&apos;m SPC, your support assistant. How are you feeling today?
                  </div>
                  <div className="p-2.5 bg-purple-600 text-white rounded-2xl ml-auto max-w-[80%] shadow-2xs">
                    I&apos;m feeling anxious these days...
                  </div>
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-800 shadow-2xs">
                    I&apos;m so sorry to hear that 💜. Would you like to tell me what has been troubling you the most?
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-1.5 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 py-1.5 px-3 bg-white rounded-xl border border-slate-200 text-xs"
                  />
                  <button className="p-1.5 bg-purple-600 text-white rounded-xl">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: Voice Call (IVRS) */}
            {activeScreenIndex === 2 && (
              <div className="flex flex-col h-full justify-between bg-slate-950 text-white -m-3 p-6 rounded-[38px]">
                <div className="text-center pt-4">
                  <h4 className="text-base font-extrabold">Voice Call (IVRS)</h4>
                  <p className="text-[10px] text-slate-400">We are here to listen</p>
                  <p className="text-xl font-mono font-bold text-emerald-400 mt-2">00:42</p>
                </div>

                <div className="flex items-center justify-center gap-1 h-20 my-auto">
                  {[30, 60, 90, 40, 75, 95, 55, 30, 70, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-indigo-400 rounded-full animate-pulse"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="space-y-4 pb-4">
                  <div className="flex justify-around text-[10px] text-slate-300">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </div>
                      <span>Mute</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Grid className="w-4 h-4" />
                      </div>
                      <span>Keypad</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <span>Speaker</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setActiveScreenIndex(0)}
                      className="w-14 h-14 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg"
                    >
                      <PhoneOff className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 4: My Well-being */}
            {activeScreenIndex === 3 && (
              <div className="space-y-3 pb-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-900 text-sm">My Well-being</h4>
                  <div className="flex bg-slate-200 rounded-lg p-0.5 text-[9px]">
                    <span className="bg-white px-2 py-0.5 rounded font-bold">Today</span>
                    <span className="px-2 py-0.5 text-slate-600">Week</span>
                    <span className="px-2 py-0.5 text-slate-600">Month</span>
                  </div>
                </div>

                {/* Dial meter */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                  <div className="w-28 h-28 mx-auto relative flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="3.8"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.8"
                        strokeDasharray="42, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Smile className="w-5 h-5 text-amber-500" />
                      <span className="text-xl font-black text-slate-900 leading-none mt-1">42</span>
                      <span className="text-[9px] font-bold text-amber-600">Moderate</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Your well-being is moderate. Keep going, we are with you.
                  </p>
                </div>

                {/* Trend line preview */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Trend (Last 6 Months)</span>
                  <div className="h-14 w-full mt-1 flex items-end justify-between px-1">
                    {[50, 68, 62, 70, 65, 42].map((v, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-3 bg-purple-500 rounded-t"
                          style={{ height: `${v * 0.5}px` }}
                        />
                        <span className="text-[8px] text-slate-400">
                          {['J', 'F', 'M', 'A', 'M', 'J'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 5: Support Needs */}
            {activeScreenIndex === 4 && (
              <div className="space-y-3 pb-6">
                <h4 className="font-extrabold text-slate-900 text-sm">My Support Needs</h4>

                <div className="space-y-2">
                  {[
                    { label: 'Psychological Well-being', status: 'High', color: 'text-rose-600', bar: 'bg-rose-500', pct: 74 },
                    { label: 'Safety & Security', status: 'Moderate', color: 'text-amber-600', bar: 'bg-amber-500', pct: 55 },
                    { label: 'Legal / Court Stress', status: 'Moderate', color: 'text-purple-600', bar: 'bg-purple-500', pct: 58 },
                    { label: 'Financial Support', status: 'Low', color: 'text-blue-600', bar: 'bg-blue-500', pct: 28 },
                    { label: 'Social Support', status: 'Low', color: 'text-emerald-600', bar: 'bg-emerald-500', pct: 25 },
                    { label: 'Rehabilitation Needs', status: 'Moderate', color: 'text-amber-600', bar: 'bg-amber-500', pct: 52 },
                  ].map((s) => (
                    <div key={s.label} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800 text-[11px]">{s.label}</span>
                        <span className={`font-bold text-[10px] ${s.color}`}>{s.status}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`${s.bar} h-1.5 rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 6: Case Status */}
            {activeScreenIndex === 5 && (
              <div className="space-y-3 pb-6">
                <h4 className="font-extrabold text-slate-900 text-sm">My Case Status</h4>

                <div className="space-y-2 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800">FIR Registered</p>
                    <p className="text-[10px] text-slate-400">12 Mar 2025</p>
                  </div>

                  <div className="relative p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800">Investigation in Progress</p>
                    <p className="text-[10px] text-slate-400">25 Mar 2025</p>
                  </div>

                  <div className="relative p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs">
                    <div className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-purple-600 ring-2 ring-purple-200" />
                    <p className="font-bold text-purple-900">Next Hearing</p>
                    <p className="text-[10px] text-purple-700">10 Jul 2025 • Court 4</p>
                    <button className="mt-1 text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold">
                      View Details
                    </button>
                  </div>

                  <div className="relative p-2.5 bg-white rounded-xl border border-slate-200 text-xs opacity-60">
                    <div className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-slate-300" />
                    <p className="font-bold text-slate-700">Compensation Process</p>
                    <p className="text-[10px] text-slate-400">Pending verification</p>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 7: Resources & Schemes */}
            {activeScreenIndex === 6 && (
              <div className="space-y-3 pb-6">
                <h4 className="font-extrabold text-slate-900 text-sm">Resources &amp; Schemes</h4>

                <div className="flex gap-1 overflow-x-auto text-[9px] font-bold">
                  <span className="px-2 py-1 bg-purple-600 text-white rounded-lg">Financial</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg">Legal</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg">Health</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg">Safety</span>
                </div>

                <div className="space-y-2">
                  {mockGovernmentSchemes.slice(0, 3).map((sch) => (
                    <div key={sch.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <h5 className="font-bold text-slate-800 text-[11px]">{sch.title}</h5>
                      <p className="font-bold text-emerald-600 text-[10px] mt-0.5">{sch.benefitAmount}</p>
                      <p className="text-[9px] text-slate-400 mt-1 line-clamp-2">{sch.eligibleCriteria}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 8: Emergency Help */}
            {activeScreenIndex === 7 && (
              <div className="flex flex-col h-full justify-between text-center pb-4 pt-2">
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600 animate-bounce">
                    <ShieldAlert className="w-8 h-8" />
                  </div>

                  <h4 className="text-lg font-black text-slate-900 leading-tight">Emergency Help</h4>
                  <p className="text-xs text-rose-600 font-bold">Do you feel unsafe right now?</p>

                  <a
                    href="tel:112"
                    className="w-full py-3.5 bg-rose-600 text-white rounded-2xl font-black text-sm block shadow-lg shadow-rose-600/30"
                  >
                    Call Helpline 112
                  </a>

                  <button
                    onClick={() => {
                      setLocationShared(true);
                      setTimeout(() => setLocationShared(false), 4000);
                    }}
                    className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                      locationShared ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{locationShared ? 'GPS Beacon Dispatched (PCR 112)' : 'Share My Location'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCounsellorNotified(true);
                      setTimeout(() => setCounsellorNotified(false), 4000);
                    }}
                    className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                      counsellorNotified ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    <BellRing className="w-4 h-4 text-indigo-600" />
                    <span>{counsellorNotified ? 'Urgent SMS Dispatched to Counsellor' : 'Notify My Counsellor'}</span>
                  </button>
                </div>

                <div className="text-[10px] text-slate-400">
                  Your safety is our priority. Help is always available.
                </div>
              </div>
            )}

            {/* Bottom App Nav Bar for phone */}
            <div className="pt-2 border-t border-slate-200 flex justify-around text-slate-400 text-[9px] font-semibold bg-white/80 rounded-b-2xl">
              <button
                onClick={() => setActiveScreenIndex(0)}
                className={`flex flex-col items-center ${activeScreenIndex === 0 ? 'text-purple-600 font-bold' : ''}`}
              >
                <span>🏠</span>
                <span>Home</span>
              </button>
              <button
                onClick={() => setActiveScreenIndex(4)}
                className={`flex flex-col items-center ${activeScreenIndex === 4 ? 'text-purple-600 font-bold' : ''}`}
              >
                <span>💜</span>
                <span>Support</span>
              </button>
              <button
                onClick={() => setActiveScreenIndex(5)}
                className={`flex flex-col items-center ${activeScreenIndex === 5 ? 'text-purple-600 font-bold' : ''}`}
              >
                <span>⚖️</span>
                <span>Case</span>
              </button>
              <button
                onClick={() => setActiveScreenIndex(7)}
                className={`flex flex-col items-center ${activeScreenIndex === 7 ? 'text-rose-600 font-bold' : ''}`}
              >
                <span>🚨</span>
                <span>Emergency</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
