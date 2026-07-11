import React from 'react';
import { TestReport } from '../lib/scanner';
import { LayoutDashboard, AlertTriangle, CheckCircle2, TrendingUp, Clock, Search, Code2, ShieldAlert, ShieldCheck, Activity, Upload, Link as LinkIcon, Github, HardDrive } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

import { HowItWorksSection } from '../components/HowItWorksSection';

interface DashboardProps {
  reports: TestReport[];
  onStartScan: (options?: { inputType: 'url' | 'file'; initialUrl?: string }) => void;
  onViewReport: (id: string) => void;
}

export function Dashboard({ reports, onStartScan, onViewReport }: DashboardProps) {
  const { t, language, dir } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';
  const [quickUrl, setQuickUrl] = React.useState('');

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tighter text-[var(--text-primary)] mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {isAr ? '[ أهلاً بك في TestPilot ]' : '[ WELCOME TO TESTPILOT ]'}
          </h1>
          <p className="text-[var(--text-secondary)] font-mono max-w-xl mx-auto text-sm md:text-base">
            {isAr ? 'ارفع مشروع الذكاء الاصطناعي الخاص بك لتشريحه وتحليله فوراً.' : 'Upload your AI project to dissect and analyze it instantly.'}
          </p>
        </div>

        {/* Drop Zone */}
        <div 
          onClick={() => onStartScan({ inputType: 'file' })} 
          className="w-full max-w-2xl border-2 border-dashed border-[var(--border-grid)] hover:border-[var(--accent-cyber)] bg-[var(--bg-secondary)] hover:bg-[var(--accent-cyber)]/5 transition-all duration-300 rounded-sm p-12 mb-6 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyber)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--bg-primary)] border border-[var(--border-grid)] group-hover:border-[var(--accent-cyber)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
              <Upload className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyber)] transition-colors" />
            </div>
            <p className="text-[var(--text-primary)] font-mono font-bold text-lg mb-2">
              {isAr ? 'اسحب ملف الـ ZIP الخاص بمشروعك هنا أو تصفح' : 'Drag & Drop your project ZIP here or browse'}
            </p>
            <p className="text-[var(--text-muted)] font-mono text-xs">
              {isAr ? 'يدعم ZIP، TS، JS، Python والمزيد' : 'Supports ZIP, TS, JS, Python and more'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full max-w-2xl mb-5">
          <div className="h-px bg-[var(--border-grid)] flex-1"></div>
          <span className="font-mono text-[var(--text-muted)] text-xs uppercase tracking-widest">- OR -</span>
          <div className="h-px bg-[var(--border-grid)] flex-1"></div>
        </div>

        {/* Quick Input Field */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 mb-8" dir="ltr">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyber)] transition-colors" />
            </div>
            <input 
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="https://github.com/username/repo" 
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-grid)] focus:border-[var(--accent-cyber)] text-[var(--text-primary)] font-mono text-sm pl-10 pr-4 py-4 rounded-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            />
          </div>
          <button 
            onClick={() => onStartScan({ inputType: 'url', initialUrl: quickUrl })}
            className="tech-button-primary uppercase font-mono tracking-widest text-sm whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all shrink-0 flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2 shrink-0" />
            <span dir={isAr ? "rtl" : "ltr"}>{isAr ? 'فحص سريع' : 'Quick Scan'}</span>
          </button>
        </div>

        {/* Quick Connect Cards */}
        <div className="w-full max-w-2xl">
          <p className="font-mono text-[var(--text-muted)] text-xs uppercase tracking-widest mb-3">
            -- {isAr ? 'الاتصال والفحص من' : 'Connect & Scan From'} --
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="ltr">
            <button onClick={() => onStartScan({ inputType: 'url' })} className="flex items-center justify-center gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border-grid)] hover:border-white transition-all group">
              <Github className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-white shrink-0" />
              <span className="font-mono text-sm font-bold text-[var(--text-secondary)] group-hover:text-white">GitHub Repos</span>
            </button>
            <button onClick={() => onStartScan({ inputType: 'file' })} className="flex items-center justify-center gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border-grid)] hover:border-blue-400 transition-all group">
              <HardDrive className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-blue-400 shrink-0" />
              <span className="font-mono text-sm font-bold text-[var(--text-secondary)] group-hover:text-blue-400">Google Drive</span>
            </button>
          </div>
        </div>

        <HowItWorksSection />
      </div>
    );
  }

  const latestReport = reports[0];
  const totalCritical = reports.reduce((acc, rep) => acc + rep.issues.filter(i => i.severity === 'Critical').length, 0);
  
  // Prepare data for the trend chart
  const trendData = [...reports].reverse().map(rep => ({
    name: new Date(rep.date).toLocaleDateString(),
    score: Math.round((rep.scores.security + rep.scores.codeQuality + rep.scores.architecture + rep.scores.dependencies) / 4)
  }));

  const renderRiskIndicator = (criticalCount: number) => {
    if (criticalCount > 0) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-500 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold tracking-widest">
          <ShieldAlert className="w-4 h-4" />
          AT RISK
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold tracking-widest">
        <ShieldCheck className="w-4 h-4" />
        SECURE
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={dir}>
      <div>
        <h1 className="text-2xl font-bold font-mono uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-3">
          {t('dashboard.commandCenter')}
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[var(--accent-cyber)] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 bg-[var(--accent-cyber)]"></span>
          </div>
        </h1>
        <p className="text-[var(--text-muted)] font-mono text-xs uppercase mt-2">{t('dashboard.globalSummary')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="tech-panel p-6 flex flex-col justify-between relative group hover:border-[var(--signal-fail)] transition-colors">
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="w-10 h-10 bg-[var(--bg-secondary)] border border-[var(--border-grid)] rounded-[var(--radius-sharp)] flex items-center justify-center group-hover:border-[var(--signal-fail)] group-hover:text-[var(--signal-fail)] transition-colors">
              <AlertTriangle className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--signal-fail)] transition-colors" />
            </div>
            <h3 className="font-mono text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{t('dashboard.criticalThreats')}</h3>
          </div>
          <div className="relative">
            <span className="text-5xl font-bold text-[var(--text-primary)] font-mono tracking-tighter">{totalCritical}</span>
            <span className="text-[10px] text-[var(--text-muted)] mx-2 uppercase tracking-widest font-mono">{t('dashboard.cumulative')}</span>
          </div>
        </div>

        <div className="tech-panel p-6 flex flex-col justify-between relative group hover:border-[var(--accent-cyber)] transition-colors">
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="w-10 h-10 bg-[var(--bg-secondary)] border border-[var(--border-grid)] rounded-[var(--radius-sharp)] flex items-center justify-center group-hover:border-[var(--accent-cyber)] group-hover:text-[var(--accent-cyber)] transition-colors">
              <Activity className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyber)] transition-colors" />
            </div>
            <h3 className="font-mono text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{t('dashboard.totalScans')}</h3>
          </div>
          <div className="relative">
            <span className="text-5xl font-bold text-zinc-900 dark:text-white font-mono tracking-tighter">{reports.length}</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 mx-2 uppercase tracking-widest font-mono">{t('dashboard.projects')}</span>
          </div>
        </div>

        <div className="tech-panel p-6 lg:col-span-2 relative group hover:border-emerald-500 transition-colors">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
              <TrendingUp className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">{t('dashboard.avgScore')}</h3>
          </div>
          <div className="h-24 w-full relative z-10" dir="ltr">
            {trendData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '0px', 
                      border: isDark ? '1px solid #27272a' : '1px solid #d4d4d8', 
                      backgroundColor: isDark ? '#09090b' : '#fafafa',
                      color: isDark ? '#f4f4f5' : '#18181b',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#06b6d4', fontWeight: 700 }}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="score" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ fill: '#09090b', stroke: '#06b6d4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 0, stroke: '#06b6d4', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center text-xs font-mono text-zinc-500 uppercase">{t('report.health.noLarge')}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="tech-panel flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-100 dark:bg-zinc-900/80">
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{t('dashboard.latestProject')}</h3>
            {latestReport && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 font-mono uppercase">
                <Clock className="w-3.5 h-3.5" />
                {new Date(latestReport.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
              </span>
            )}
          </div>
          {latestReport ? (
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <p className="font-mono font-bold text-zinc-900 dark:text-zinc-100 truncate text-lg" dir="ltr">{latestReport.url}</p>
                {renderRiskIndicator(latestReport.issues.filter(i => i.severity === 'Critical').length)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">{t('report.security')}</div>
                  <div className={`text-4xl font-bold font-mono tracking-tighter ${latestReport.scores.security < 50 ? 'text-rose-600 dark:text-rose-400' : latestReport.scores.security < 90 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {latestReport.scores.security}
                  </div>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">{t('report.codeQuality')}</div>
                  <div className={`text-4xl font-bold font-mono tracking-tighter ${latestReport.scores.codeQuality < 50 ? 'text-rose-600 dark:text-rose-400' : latestReport.scores.codeQuality < 90 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {latestReport.scores.codeQuality}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewReport(latestReport.id)}
                className="tech-button w-full font-mono uppercase text-xs tracking-widest"
              >
                {t('dashboard.viewReport')}
              </button>
            </div>
          ) : null}
        </div>

        <div className="tech-panel flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80">
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{t('dashboard.quickActions')}</h3>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={() => onStartScan()}
              className={`w-full p-4 border border-zinc-300 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors flex items-start gap-4 group ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-cyan-500 transition-colors">
                <Code2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-cyan-500" />
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{t('dashboard.startScan')}</h4>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">{t('dashboard.quickActionDesc')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
