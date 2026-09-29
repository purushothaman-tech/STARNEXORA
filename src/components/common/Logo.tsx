import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'beneficiary';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'beneficiary') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img src="/spc_logo.svg" alt="SPC AI Logo" className="w-10 h-10 object-contain" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-indigo-950 font-sans">SPC <span className="text-purple-600">AI</span></span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">एसपीसी</span>
          </div>
          <p className="text-[11px] font-bold text-purple-700">Self-Promising Caretaker AI</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img src="/spc_logo.svg" alt="SPC AI Logo" className="w-9 h-9 object-contain" />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1 leading-none">
            <span className="font-black text-slate-950 tracking-tight text-base font-sans">SPC</span>
            <span className="text-[11px] font-black text-purple-600 font-sans">AI</span>
          </div>
          <span className="text-[10px] font-bold text-slate-600 leading-tight">Self-Promising Caretaker</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Emblem Mark */}
      <img src="/spc_logo.svg" alt="SPC AI Logo" className="w-11 h-11 object-contain drop-shadow-xs" />

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xl font-black tracking-tight text-slate-950 font-sans">SPC</span>
          <span className="text-xl font-black tracking-tight text-purple-600 font-sans">AI</span>
        </div>
        <p className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5">Self-Promising Caretaker AI</p>
        <p className="text-[9px] text-slate-500 font-medium tracking-tight">Listen • Understand • Care • Monitor • Predict • Support</p>
      </div>
    </div>
  );
};
