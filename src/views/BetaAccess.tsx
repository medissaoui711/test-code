import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Activity } from 'lucide-react';

interface BetaAccessProps {
  onAccessGranted: () => void;
}

export function BetaAccess({ onAccessGranted }: BetaAccessProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === 'BETA2026') {
      localStorage.setItem('testpilot_beta_access', 'granted');
      onAccessGranted();
    } else {
      setError(true);
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none mix-blend-screen" />
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative z-10">
        <div className="p-8 text-center bg-indigo-600 dark:bg-indigo-950 border-b border-indigo-700 dark:border-indigo-900 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-white/20 dark:bg-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10 dark:border-indigo-400/20">
            <Activity className="w-8 h-8 text-white dark:text-indigo-300" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 relative z-10">TestPilot Beta</h1>
          <p className="text-indigo-100 dark:text-indigo-400 font-medium relative z-10">Early Access Program</p>
        </div>
        
        <div className="p-8">
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">
            Welcome to the TestPilot private beta. Please enter your invitation code to access the automated QA dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="sr-only">Access Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(false); }}
                className={`w-full px-4 py-3 text-center text-xl tracking-widest uppercase rounded-xl border font-mono ${error ? 'border-rose-300 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-900 dark:text-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400'} transition-colors placeholder-slate-400 dark:placeholder-slate-600`}
                placeholder="ENTER CODE"
                autoComplete="off"
              />
              {error && <p className="text-rose-600 dark:text-rose-400 text-sm text-center mt-2 font-medium">Invalid access code. Try "BETA2026"</p>}
            </div>

            <button
              type="submit"
              disabled={!code.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              Enter Beta
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3 text-sm text-slate-500">
            <ShieldAlert className="w-5 h-5 shrink-0 text-slate-400" />
            <p>
              By entering the beta, you agree to our terms of use. Data is stored locally in your browser during this phase. Analytics are collected anonymously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
