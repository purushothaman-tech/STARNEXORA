import React, { useState } from 'react';
import { Send, Smartphone, ShieldAlert, Sparkles, MessageCircle, RefreshCw, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SMSMessage {
  id: string;
  from: 'spc' | 'user';
  text: string;
  time: string;
}

export const SMSSimulation: React.FC = () => {
  const { selectedCase, confirmSignalForCase, updateCaseDDS } = useApp();
  const [messages, setMessages] = useState<SMSMessage[]>([
    {
      id: 'sms-1',
      from: 'spc',
      text: 'SPC-GOV: Namaste Asha ji. This is your scheduled well-being check-in.\nReply 1 if you feel SAFE & STABLE.\nReply 2 if ANXIOUS or needing support.\nReply SOS if in immediate danger.',
      time: 'Today 09:00 AM',
    },
    {
      id: 'sms-2',
      from: 'user',
      text: '1. I am at home today, feeling fine.',
      time: '09:04 AM',
    },
    {
      id: 'sms-3',
      from: 'spc',
      text: 'SPC-GOV: Thank you. Your response has been logged. Your well-being score is STABLE (42). Your next check-in is in 3 days. Helplines: 112 (Police), 181 (OSC).',
      time: '09:05 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendSMS = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: SMSMessage = {
      id: `sms-${Date.now()}`,
      from: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      const upper = text.toUpperCase();

      if (upper.includes('SOS') || upper.includes('HELP') || upper.includes('DANGER')) {
        replyText = 'SPC-EMERGENCY: ALERT DISPATCHED! Your distress signal has been routed to Dwarka Police Station (PCR Van Enroute) & Counsellor Dr. Kavita. Call 112 directly if safe.';
        confirmSignalForCase(selectedCase.id, {
          type: 'safety_concern',
          label: 'SMS Check-in: Emergency SOS received via SMS shortcode 51969',
          source: 'sms',
          confidence: 0.99,
          userConfirmed: true,
          notes: `Raw text: "${text}"`,
        });
      } else if (upper.includes('2') || upper.includes('ANXIOUS') || upper.includes('FEAR') || upper.includes('SCARED')) {
        replyText = 'SPC-SUPPORT: We acknowledge your distress signal. Counsellor Dr. Kavita Singhania will phone you today at 04:00 PM. Reply CALLBACK if you need urgent call.';
        confirmSignalForCase(selectedCase.id, {
          type: 'anxiety',
          label: 'SMS Check-in: Beneficiary reported emotional distress / anxiety (Reply 2)',
          source: 'sms',
          confidence: 0.95,
          userConfirmed: true,
          notes: `Raw text: "${text}"`,
        });
      } else if (upper.includes('1') || upper.includes('SAFE')) {
        replyText = 'SPC-GOV: Logged: Safe and stable. Your welfare index is maintained at Moderate/Stable (42). Remember we are always here.';
      } else if (upper.includes('LEGAL') || upper.includes('COURT')) {
        replyText = `SPC-COURT: Case ${selectedCase.id}: Next hearing date ${selectedCase.nextHearingDate || '10 Jul 2025'}, Sessions Court. Free legal aid escort arranged.`;
      } else {
        replyText = 'SPC-GOV: Message received. To check-in, reply 1 for Safe, 2 for Anxious, or SOS for Emergency help.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `sms-${Date.now() + 1}`,
          from: 'spc',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Handset Mockup (5 Cols) */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="w-full max-w-sm bg-slate-900 rounded-[40px] p-5 shadow-2xl border-4 border-slate-700 flex flex-col justify-between h-[680px]">
          {/* Top phone header */}
          <div className="pt-2 pb-3 border-b border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-mono">VK-SPC • Shortcode 51969</div>
            <h3 className="text-sm font-bold text-white mt-0.5">Government SMS Gateway</h3>
            <p className="text-[10px] text-emerald-400">Toll-Free 2-Way Protocol</p>
          </div>

          {/* Messages bubble container */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 px-1 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
                    m.from === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1 px-1">
                  <span>{m.time}</span>
                  {m.from === 'user' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-[11px] text-slate-400 italic">SPC gateway is processing response...</div>
            )}
          </div>

          {/* Quick Reply Chips for 2G / basic phone simulation */}
          <div className="py-2 flex gap-1.5 overflow-x-auto border-t border-slate-800">
            {['1 (Safe)', '2 (Anxious)', 'SOS', 'COURT DATE', 'CALLBACK'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSendSMS(opt)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold shrink-0 border border-slate-700"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendSMS();
            }}
            className="pt-2 flex items-center gap-2 border-t border-slate-800"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type SMS or reply 1, 2, SOS..."
              className="flex-1 py-2 px-3 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: SMS Infrastructure Architecture & Analytics (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">National SMS Check-in Network</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              Active in 740+ Districts
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Over 68% of protected witnesses and rural survivors in India utilize basic feature phones (2G/GSM) without internet connectivity. SPC’s bi-directional SMS engine integrates with National Informatics Centre (NIC) SMS Gateway to provide automated wellness prompts, distress keywords detection, and silent alarm triggers.
          </p>

          {/* Trigger keywords table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
              <span>SMS Command Keyword</span>
              <span>Automated Backend Pipeline</span>
            </div>
            <div className="divide-y divide-slate-100 font-medium text-slate-600">
              <div className="px-4 py-2.5 flex justify-between items-center">
                <span className="font-bold text-emerald-700">Reply &apos;1&apos; or &apos;SAFE&apos;</span>
                <span className="text-slate-500">Logs stable score, resets countdown timer</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center bg-rose-50/40">
                <span className="font-bold text-rose-700">Reply &apos;SOS&apos; or &apos;DANGER&apos;</span>
                <span className="text-rose-600 font-bold">Instantly dispatches local PCR Van &amp; SHO</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center">
                <span className="font-bold text-amber-700">Reply &apos;2&apos; or &apos;ANXIOUS&apos;</span>
                <span className="text-slate-500">Flags distress alert to Caseworker for call</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center">
                <span className="font-bold text-indigo-700">Reply &apos;COURT&apos;</span>
                <span className="text-slate-500">Pulls live e-Courts hearing date &amp; DLSA contact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            SMS Engagement &amp; Response Rate (Last 30 Days)
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-black text-slate-900">94.2%</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Response Rate</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-black text-indigo-600">&lt; 4 mins</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Avg. Reply Time</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-black text-rose-600">38</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">SOS Alerts Handled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
