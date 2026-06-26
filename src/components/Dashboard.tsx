import React from 'react';
import { TestReport } from '../lib/scanner';
import { LayoutDashboard, AlertTriangle, CheckCircle2, TrendingUp, Clock, Search, Code2, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  reports: TestReport[];
  onStartScan: () => void;
  onViewReport: (id: string) => void;
}

export function Dashboard({ reports, onStartScan, onViewReport }: DashboardProps) {
  const { t, language, dir } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(79,70,229,0.1)] dark:shadow-[0_0_40px_rgba(79,70,229,0.2)] border border-indigo-100 dark:border-indigo-500/20">
          <Code2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('dashboard.welcome')}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mb-10 leading-relaxed">
          {t('dashboard.desc')}
        </p>
        <button
          onClick={onStartScan}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 border border-indigo-500/50"
        >
          <Search className="w-5 h-5" />
          {isAr ? 'ابدأ فحص مشروعك الأول' : 'Start Your First Scan'}
        </button>
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
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold tracking-wide">
          <ShieldAlert className="w-3.5 h-3.5" />
          AT RISK
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5" />
        SECURE
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={dir}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {isAr ? 'المركز الأمني' : 'Security Command Center'}
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">{isAr ? 'ملخص جودة الكود والأمان عبر جميع المشاريع المفحوصة.' : 'Global overview of code quality and threat landscape across all scanned projects.'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent dark:from-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-4 relative">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-medium text-slate-700 dark:text-slate-300">{isAr ? 'مشاكل حرجة' : 'Critical Threats'}</h3>
          </div>
          <div className="relative">
            <span className="text-4xl font-bold text-slate-900 dark:text-white font-mono">{totalCritical}</span>
            <span className="text-sm text-slate-500 dark:text-slate-500 mx-2 uppercase tracking-wider">{isAr ? 'تراكمي' : 'Detected'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent dark:from-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-medium text-slate-700 dark:text-slate-300">{isAr ? 'إجمالي الفحوصات' : 'Total Scans'}</h3>
          </div>
          <div className="relative">
            <span className="text-4xl font-bold text-slate-900 dark:text-white font-mono">{reports.length}</span>
            <span className="text-sm text-slate-500 dark:text-slate-500 mx-2 uppercase tracking-wider">{isAr ? 'مشاريع' : 'Projects'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-medium text-slate-700 dark:text-slate-300">{isAr ? 'متوسط مؤشر الجودة الشامل' : 'Avg Global Quality Score'}</h3>
          </div>
          <div className="h-24 w-full relative z-10" dir="ltr">
            {trendData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: isDark ? '1px solid #334155' : 'none', 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                    itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center text-sm text-slate-400">{isAr ? 'لا توجد بيانات كافية للرسم البياني' : 'Not enough data for chart'}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
            <h3 className="font-semibold text-slate-900 dark:text-white">{isAr ? 'أحدث مشروع مفحوص' : 'Latest Scanned Project'}</h3>
            {latestReport && (
              <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-4 h-4" />
                {new Date(latestReport.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
              </span>
            )}
          </div>
          {latestReport ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <p className="font-medium text-slate-900 dark:text-white truncate text-lg" dir="ltr">{latestReport.url}</p>
                {renderRiskIndicator(latestReport.issues.filter(i => i.severity === 'Critical').length)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-700/50">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.security')}</div>
                  <div className={`text-2xl font-bold font-mono ${latestReport.scores.security < 50 ? 'text-rose-600 dark:text-rose-400' : latestReport.scores.security < 90 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {latestReport.scores.security}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-700/50">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.codeQuality')}</div>
                  <div className={`text-2xl font-bold font-mono ${latestReport.scores.codeQuality < 50 ? 'text-rose-600 dark:text-rose-400' : latestReport.scores.codeQuality < 90 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {latestReport.scores.codeQuality}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewReport(latestReport.id)}
                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex justify-center items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                {t('dashboard.viewReport')}
              </button>
            </div>
          ) : null}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <h3 className="font-semibold text-slate-900 dark:text-white">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={onStartScan}
              className={`w-full p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-start gap-4 group ${isAr ? 'text-right' : 'text-left'}`}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors">
                <Code2 className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors">{t('dashboard.startScan')}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{isAr ? 'ارفع حزمة ZIP أو أدخل رابط المستودع لفحصه واكتشاف الثغرات.' : 'Upload a ZIP or enter a repository URL to scan for vulnerabilities.'}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
