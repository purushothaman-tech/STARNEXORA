import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  BellRing,
  ShieldAlert,
  X,
  EyeOff,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencySupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  victimName?: string;
  caseId?: string;
}

export const EmergencySupportModal: React.FC<EmergencySupportModalProps> = ({
  isOpen,
  onClose,
  victimName = 'Asha K.',
  caseId = 'DL-2025-0912',
}) => {
  const { announceToScreenReader, triggerQuickExit } = useApp();
  const [locationShared, setLocationShared] = useState(false);
  const [counsellorNotified, setCounsellorNotified] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  // Explicit Confirmation state to prevent accidental single-click emergency dispatches (Requirement 34)
  const [pendingAction, setPendingAction] = useState<'call112' | 'silentSOS' | 'shareLocation' | 'notifyCounsellor' | null>(null);

  const [coordinates] = useState<{ lat: number; lng: number }>({
    lat: 28.5823,
    lng: 77.0500,
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPendingAction(null);
      return;
    }

    closeBtnRef.current?.focus();
    announceToScreenReader('Emergency Support console opened. All actions require confirmation to prevent accidental triggers.', 'assertive');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, announceToScreenReader]);

  if (!isOpen) return null;

  const handleConfirmAction = () => {
    if (pendingAction === 'call112') {
      announceToScreenReader('Helpline 112 emergency simulation initiated.', 'assertive');
      setPendingAction(null);
      setSosActive(true);
    } else if (pendingAction === 'silentSOS') {
      setLocationShared(true);
      setCounsellorNotified(true);
      setSosActive(true);
      setPendingAction(null);
      announceToScreenReader('Silent distress signal transmitted to District Police Control Room.', 'assertive');
    } else if (pendingAction === 'shareLocation') {
      setLocationShared(true);
      setPendingAction(null);
      announceToScreenReader('Live GPS coordinates shared with local PCR response unit.', 'polite');
    } else if (pendingAction === 'notifyCounsellor') {
      setCounsellorNotified(true);
      setPendingAction(null);
      announceToScreenReader('Urgent notification dispatched to your assigned counsellor.', 'polite');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
      aria-describedby="emergency-desc"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Top Emergency Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-5 sm:p-6 text-center relative">
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close emergency support modal"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition focus:outline-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-2.5 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 id="emergency-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Emergency Support Console
            </h2>
            <span className="text-[10px] font-extrabold bg-white/25 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              DEMO SIMULATION
            </span>
          </div>

          <p id="emergency-desc" className="text-rose-100 text-xs font-medium">
            Immediate 24/7 Police, Ambulance &amp; Crisis Response System
          </p>

          <div className="mt-2 text-[11px] bg-black/25 inline-block px-3 py-0.5 rounded-full font-semibold border border-white/20">
            Protected Dossier: {caseId} • {victimName}
          </div>
        </div>

        {/* ACCIDENTAL TRIGGER PREVENTION CONFIRMATION STEP */}
        {pendingAction ? (
          <div className="p-6 bg-amber-50 border-b border-amber-200 space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Are you sure you want to contact emergency support?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {pendingAction === 'call112' && 'This will connect you to Emergency Helpline 112 (Simulated Police & Ambulance Dispatch).'}
                  {pendingAction === 'silentSOS' && 'This will silently alert the Special Police Cell and your assigned counsellor Dr. Kavita Singhania.'}
                  {pendingAction === 'shareLocation' && 'This will transmit your live GPS beacon to the nearest Sakhi One Stop Centre.'}
                  {pendingAction === 'notifyCounsellor' && 'This will send an urgent crisis outreach prompt to Dr. Kavita Singhania.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/30 transition"
              >
                Yes, Confirm Dispatch
              </button>
            </div>
          </div>
        ) : null}

        {/* Main Action Buttons */}
        <div className="p-5 sm:p-6 space-y-3.5 text-xs">
          {/* Action 1: Call 112 */}
          <button
            type="button"
            onClick={() => setPendingAction('call112')}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/25 transition group cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Call National Emergency 112 (Police / Medical)</span>
          </button>

          {/* Action 2: Silent SOS */}
          <button
            type="button"
            onClick={() => setPendingAction('silentSOS')}
            className={`w-full py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition ${
              sosActive
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/60 hover:bg-rose-50 text-rose-700'
            }`}
          >
            {sosActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Distress Beacon Active · PCR Unit Alerted</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Transmit Silent SOS (Auto-alert Police &amp; Caseworker)</span>
              </>
            )}
          </button>

          {/* Action 3: Live GPS Location */}
          <button
            type="button"
            onClick={() => setPendingAction('shareLocation')}
            disabled={locationShared}
            className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
              locationShared
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <MapPin className={`w-4 h-4 ${locationShared ? 'text-emerald-600' : 'text-rose-500'}`} />
            <span>
              {locationShared
                ? `GPS Transmitted: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
                : 'Share Live GPS Coordinates'}
            </span>
          </button>

          {/* Action 4: Notify Assigned Counsellor */}
          <button
            type="button"
            onClick={() => setPendingAction('notifyCounsellor')}
            disabled={counsellorNotified}
            className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
              counsellorNotified
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <BellRing className={`w-4 h-4 ${counsellorNotified ? 'text-indigo-600' : 'text-indigo-600'}`} />
            <span>
              {counsellorNotified
                ? 'Counsellor Dr. Kavita Alerted via Priority Dispatch'
                : 'Notify Assigned Caseworker (Dr. Kavita Singhania)'}
            </span>
          </button>

          {/* National Toll-Free Helplines Grid */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              National Emergency Helplines (Toll-Free 24/7)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-slate-700">
                <span className="font-medium">Women Helpline</span>
                <span className="font-extrabold text-rose-600">1091</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-slate-700">
                <span className="font-medium">Sakhi OSC</span>
                <span className="font-extrabold text-rose-600">181</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-slate-700">
                <span className="font-medium">DLSA Legal Aid</span>
                <span className="font-extrabold text-indigo-600">15100</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-slate-700">
                <span className="font-medium">Tele-MANAS</span>
                <span className="font-extrabold text-emerald-600">14416</span>
              </div>
            </div>
          </div>

          {/* Quick Exit trigger & Close */}
          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onClose();
                triggerQuickExit();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-bold transition"
              title="Discreet Safe Exit replaces the screen with neutral weather info"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Discreet Quick Exit</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-100 rounded-lg transition"
            >
              Close Console
            </button>
          </div>
        </div>

        {/* Disclaimer footer */}
        <div className="bg-slate-50 p-3 text-center text-[10px] text-slate-500 border-t border-slate-200">
          This console provides simulated emergency coordination under the Victim Protection Protocol. For actual emergencies, dial 112 directly from any mobile handset.
        </div>
      </div>
    </div>
  );
};
