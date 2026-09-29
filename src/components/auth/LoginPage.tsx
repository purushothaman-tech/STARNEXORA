import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  Heart,
  Scale,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Info,
  Building2,
  Phone,
  Check,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setLanguage, currentLanguage } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('meera.sharma@mha.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'admin' as UserRole,
      title: 'Nodal Director & National Admin',
      subtitle: 'Dr. Meera Sharma',
      desc: 'National surveillance console, state/district distress triage, audit logs & inter-agency coordination.',
      icon: ShieldCheck,
      color: 'from-indigo-600 to-indigo-800',
      badge: 'Directorate Access',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      email: 'meera.sharma@mha.gov.in',
    },
    {
      id: 'counsellor' as UserRole,
      title: 'Senior Psychosocial Caseworker',
      subtitle: 'Dr. Kavita Singhania',
      desc: 'Triage queue management, trauma counselling supervision, signal validation & support assignment.',
      icon: Heart,
      color: 'from-teal-600 to-teal-800',
      badge: 'Caseworker Triage',
      badgeColor: 'bg-teal-100 text-teal-800',
      email: 'kavita.singhania@support.gov.in',
    },
    {
      id: 'beneficiary' as UserRole,
      title: 'Protected Survivor & Beneficiary',
      subtitle: 'Asha K.',
      desc: 'Personal support portal, safe conversational check-in with SPC AI, case timeline & emergency SOS.',
      icon: UserCheck,
      color: 'from-purple-600 to-purple-800',
      badge: 'Protected Portal',
      badgeColor: 'bg-purple-100 text-purple-800',
      email: 'asha.k@protected.spc',
    },
    {
      id: 'district_official' as UserRole,
      title: 'District Magistrate & Protection Officer',
      subtitle: 'Insp. V. Raghavan',
      desc: 'District case registry, BNS FIR tracking, witness protection orders & legal compensation review.',
      icon: Scale,
      color: 'from-blue-600 to-blue-800',
      badge: 'District Magistrate',
      badgeColor: 'bg-blue-100 text-blue-800',
      email: 'v.raghavan@police.tn.gov.in',
    },
  ];

  const handleRoleSelect = (roleObj: typeof roles[0]) => {
    setSelectedRole(roleObj.id);
    setUsername(roleObj.email);
    setPassword('••••••••••••');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole, { username, password });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Background Subtle Gradient Geometry */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <img src="/spc_logo.svg" alt="SPC AI Official Logo" className="w-10 h-10 object-contain drop-shadow" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                SPC <span className="text-purple-400">AI</span>
              </span>
              <span className="text-[10px] font-bold bg-purple-950/80 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full">
                Self-Promising Caretaker AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Listen → Understand → Care → Monitor → Predict → Support
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${currentLanguage === 'en' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${currentLanguage === 'hi' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${currentLanguage === 'ta' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            தமிழ்
          </button>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Demonstration &amp; Government Secure Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">SPC AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            An AI-powered, multilingual platform for continuous distress monitoring, early-risk identification, explainable insights, and human-guided support.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="space-y-4 max-w-4xl mx-auto w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Select Your Role to Access Console:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => handleRoleSelect(r)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/40 shadow-xl shadow-purple-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.badgeColor}`}>
                        {r.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition">
                        {r.subtitle}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{r.title}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
                      {r.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-purple-300 font-mono font-semibold">Demo Account</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-purple-600 text-white' : 'border border-slate-700 text-transparent'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLoginSubmit}
            className="mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-xl mx-auto space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">
                  Signing in as: <span className="text-purple-300">{roles.find((r) => r.id === selectedRole)?.subtitle}</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                {selectedRole.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Government / Authorized Email
                </label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Password / Demo Security Credential
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-950/50 transition active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In &amp; Launch Console &rarr;</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-900/50 text-[10px] text-purple-200 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Demo Mode Active:</strong> Clicking Sign In logs in instantly into the selected role console with full preloaded de-identified simulation data.
              </span>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto p-4 text-center text-[10px] text-slate-500 border-t border-slate-800/80">
        <p>
          Ministry of Home Affairs &amp; Ministry of Social Justice · Government of India · SPC AI Self-Promising Caretaker AI Platform
        </p>
      </footer>
    </div>
  );
};
