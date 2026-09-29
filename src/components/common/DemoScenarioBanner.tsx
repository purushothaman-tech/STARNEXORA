import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, RotateCcw, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const DemoScenarioBanner: React.FC = () => {
  const { demoScenarioStep, runDemoScenarioStep, resetDemoScenario } = useApp();

  const steps = [
    { title: 'Baseline', desc: 'Case Asha K. · DDS = 42 (Moderate)' },
    { title: 'Chat Anxiety', desc: 'Beneficiary reports heightened anxiety in check-in' },
    { title: 'Missed Call', desc: 'IVRS morning check-in unanswered (Engagement down)' },
    { title: 'Safety Signal', desc: 'Beneficiary confirms safety concern near home' },
    { title: 'DDS Surge', desc: 'DDS recalculated to 67 · Trend becomes INCREASING' },
    { title: 'Alert Generated', desc: 'High review alert generated with Explainable AI reasons' },
    { title: 'Human Action', desc: 'Counsellor reviews, assigns counselling & schedules follow-up' },
    { title: 'Closed Loop', desc: 'Full loop executed: Case stabilized & timeline updated' },
  ];

  const current = steps[demoScenarioStep];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 shadow-md">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Demo mode & Non-clinical notice */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/30">
            SIH Interactive Prototype
          </span>
          <span className="text-slate-300 font-medium hidden sm:inline text-[11px]">
            De-identified Demo Data · <strong className="text-white">NOT a Clinical Diagnostic System</strong>
          </span>
        </div>

        {/* Center: Current Scenario Step Progress */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="font-extrabold text-teal-400 shrink-0 text-[11px]">
            Demo Step {demoScenarioStep}/7:
          </span>
          <span className="font-bold text-white shrink-0 text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {current.title}
          </span>
          <span className="text-slate-400 text-[11px] truncate hidden lg:inline max-w-md">
            → {current.desc}
          </span>
        </div>

        {/* Right: Step Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runDemoScenarioStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold rounded-lg shadow-sm transition text-xs"
            title="Advance SIH demonstration sequence"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {demoScenarioStep === 7
                ? 'Loop Completed (Restart Step 0)'
                : `Run Step ${demoScenarioStep + 1} &rarr;`}
            </span>
          </button>

          <button
            onClick={resetDemoScenario}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Reset to Baseline Step 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
