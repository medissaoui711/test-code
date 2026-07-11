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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none mix-blend-screen" />
      <div className="w-full max-w-md tech-panel overflow-hidden relative z-10">
        <div className="p-8 text-center bg-cyan-600 dark:bg-cyan-950 border-b border-cyan-700 dark:border-cyan-900 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-zinc-50/20 dark:bg-cyan-500/30 rounded-sm flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10 dark:border-cyan-400/20">
            <Activity className="w-8 h-8 text-white dark:text-cyan-300" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 relative z-10">TestPilot Beta</h1>
          <p className="text-cyan-100 dark:text-cyan-400 font-medium relative z-10">Early Access Program</p>
        </div>
        
        <div className="p-8">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-center leading-relaxed">
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
                className={`w-full px-4 py-3 text-center text-xl tracking-widest uppercase rounded-sm border font-mono ${error ? 'border-rose-300 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-900 dark:text-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:border-cyan-500 focus:ring-cyan-500 dark:focus:ring-cyan-400'} transition-colors placeholder-zinc-400 dark:placeholder-zinc-600`}
                placeholder="ENTER CODE"
                autoComplete="off"
              />
              {error && <p className="text-rose-600 dark:text-rose-400 text-sm text-center mt-2 font-medium">Invalid access code. Try "BETA2026"</p>}
            </div>

            <button
              type="submit"
              disabled={!code.trim()}
              className="w-full tech-button-primary py-4 text-sm font-bold uppercase tracking-widest"
            >
              Enter Beta
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 flex items-start gap-3 text-sm text-zinc-500">
            <ShieldAlert className="w-5 h-5 shrink-0 text-zinc-400" />
            <p>
              By entering the beta, you agree to our terms of use. Data is stored locally in your browser during this phase. Analytics are collected anonymously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
