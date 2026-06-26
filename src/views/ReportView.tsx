import React, { useState } from 'react';
import { TestReport, Issue } from '../lib/scanner';
import { ArrowLeft, AlertOctagon, AlertTriangle, Info, CheckCircle2, Download, FileText, Wrench, ChevronDown, ChevronUp, HelpCircle, Activity, FileWarning, LayoutTemplate, ShieldAlert, CheckSquare, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ReportViewProps {
  report: TestReport;
  previousReport?: TestReport;
  onBack: () => void;
}

export function ReportView({ report, previousReport, onBack }: ReportViewProps) {
  const { t, language, dir } = useLanguage();
  const isAr = language === 'ar';
  
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');

  const filteredIssues = filter === 'All' 
    ? report.issues 
    : report.issues.filter(i => i.severity === filter);

  const securityIssues = filteredIssues.filter(i => i.category === 'Security' || i.category === 'Dependencies');
  const codeIssues = filteredIssues.filter(i => i.category === 'Code Quality' || i.category === 'Architecture');

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
    if (score < 90) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
  };

  const getScoreText = (score: number) => {
    if (score < 50) return isAr ? 'يحتاج لعمل جاد' : 'Needs Serious Work';
    if (score < 90) return isAr ? 'جيد، لكن يمكن تحسينه' : 'Good, but needs improvement';
    return isAr ? 'ممتاز' : 'Excellent';
  };

  const getScoreDiff = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff === 0) return null;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      text: diff > 0 ? `+${diff}` : `${diff}`
    };
  };

  const handleExport = () => {
    try {
      window.print();
    } catch (e) {
      alert(isAr ? 'يرجى فتح التطبيق في نافذة جديدة لطباعة التقرير.' : 'Please open the app in a new tab to print the report.');
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" dir={dir}>
      {/* Header Actions */}
      <div className="flex items-center justify-between print:hidden">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {isAr ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
        </button>
        <button 
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
        >
          <Download className="w-4 h-4" />
          {t('report.export')}
        </button>
      </div>

      {/* 1) Overview */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <div className={`absolute top-0 ${isAr ? 'right-0 -mr-32' : 'left-0 -ml-32'} w-64 h-64 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl -mt-32 opacity-50`}></div>
        <div className="p-8 md:p-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg text-indigo-700 dark:text-indigo-400">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t('report.overview')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.name')}</p>
              <p className="font-semibold text-slate-900 dark:text-white truncate font-mono" dir="ltr">{report.url}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.type')}</p>
              <p className="font-semibold text-slate-900 dark:text-white uppercase tracking-wide">{report.overview.projectType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.generalStatus')}</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {getScoreText(Math.round((report.scores.security + report.scores.architecture + report.scores.codeQuality + report.scores.dependencies) / 4))}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.files')}</p>
              <p className="font-semibold text-slate-900 dark:text-white font-mono">{report.overview.fileCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.loc')}</p>
              <p className="font-semibold text-slate-900 dark:text-white font-mono">{report.overview.linesOfCode.toLocaleString()}</p>
            </div>
            <div className="col-span-2 md:col-span-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('report.langs')}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {report.overview.languages.map(lang => (
                  <span key={lang} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider" dir="ltr">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            {[
              { label: t('report.security'), score: report.scores.security, prevScore: previousReport?.scores.security, tooltip: isAr ? "فحص الثغرات الأمنية والمفاتيح المكشوفة." : "Scanning for vulnerabilities and exposed keys." },
              { label: t('report.architecture'), score: report.scores.architecture, prevScore: previousReport?.scores.architecture, tooltip: isAr ? "تنظيم الملفات والفصل بين المكونات." : "File organization and separation of concerns." },
              { label: t('report.codeQuality'), score: report.scores.codeQuality, prevScore: previousReport?.scores.codeQuality, tooltip: isAr ? "مدى نظافة الكود وقابليته للصيانة." : "Code cleanliness and maintainability." },
              { label: t('report.dependencies'), score: report.scores.dependencies, prevScore: previousReport?.scores.dependencies, tooltip: isAr ? "تحديث المكتبات والتحقق من سلامتها." : "Checking for updated and secure libraries." },
            ].map((metric) => {
              const diff = getScoreDiff(metric.score, metric.prevScore);
              return (
                <div key={metric.label} className={`p-4 rounded-xl border relative group transition-colors ${getScoreColor(metric.score)}`}>
                  <div className="flex items-center gap-1.5 text-sm font-medium opacity-80 mb-1">
                    {metric.label}
                    <div className="relative group/tooltip hidden md:block">
                      <HelpCircle className="w-3.5 h-3.5 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 pointer-events-none text-center">
                        {metric.tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold font-mono">{metric.score}</div>
                    <div className="text-xs font-medium opacity-80 mb-1">{getScoreText(metric.score)}</div>
                  </div>
                  {diff && (
                    <div className={`absolute top-4 left-4 text-xs font-bold px-2 py-0.5 rounded-full font-mono ${diff.isPositive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`} dir="ltr">
                      {diff.text} pts
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2) Project Health */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('report.health')}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <HealthCard title={t('report.health.empty')} items={report.health.emptyFiles} emptyMsg={t('report.health.noEmpty')} />
          <HealthCard title={t('report.health.missing')} items={report.health.missingFiles} emptyMsg={t('report.health.noMissing')} />
          <HealthCard title={t('report.health.duplicate')} items={report.health.duplicateFiles} emptyMsg={t('report.health.noDuplicate')} />
          <HealthCard title={t('report.health.large')} items={report.health.largeFiles} emptyMsg={t('report.health.noLarge')} />
        </div>
      </section>

      {/* Findings Filters */}
      <div className="flex items-center justify-between print:hidden">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('report.filterTitle')}</h3>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg gap-1 overflow-x-auto border border-slate-300 dark:border-slate-700">
          {[
            { id: 'All', label: t('report.filter.all') },
            { id: 'Critical', label: t('report.filter.critical') },
            { id: 'High', label: t('report.filter.high') },
            { id: 'Medium', label: t('report.filter.medium') },
            { id: 'Low', label: t('report.filter.low') }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setFilter(level.id as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                filter === level.id 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3) Code Issues */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <FileWarning className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('report.issues')}</h2>
        </div>
        {codeIssues.length === 0 ? (
          <EmptyState message={t('report.issues.empty')} />
        ) : (
          codeIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
        )}
      </section>

      {/* 4) Security Findings */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-100 dark:bg-rose-500/10 rounded-lg text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('report.securityFindings')}</h2>
        </div>
        {securityIssues.length === 0 ? (
          <EmptyState message={t('report.security.empty')} />
        ) : (
          securityIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
        )}
      </section>

      {/* 5) Missing Parts */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('report.missing')}</h2>
        </div>
        {report.missingParts.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">{t('report.missing.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {report.missingParts.map((part, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 bg-orange-50/50 dark:bg-orange-500/5 p-3 rounded-lg border border-orange-100 dark:border-orange-500/20">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>{part}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 6) Development Plan */}
      <section className="bg-slate-900 dark:bg-slate-950 rounded-2xl text-white shadow-lg p-8 md:p-10 print:bg-white print:text-slate-900 print:border print:border-slate-200 border border-transparent dark:border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none mix-blend-screen" />
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 print:bg-indigo-100 print:text-indigo-700">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('report.plan')}</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          <PlanColumn title={t('report.plan.fixNow')} items={report.plan.fixNow} colorClass="border-rose-500/30 bg-rose-500/10 text-rose-100 print:bg-rose-50 print:text-slate-900 print:border-rose-200" titleClass="text-rose-400 print:text-rose-700" />
          <PlanColumn title={t('report.plan.next')} items={report.plan.next} colorClass="border-amber-500/30 bg-amber-500/10 text-amber-100 print:bg-amber-50 print:text-slate-900 print:border-amber-200" titleClass="text-amber-400 print:text-amber-700" />
          <PlanColumn title={t('report.plan.later')} items={report.plan.later} colorClass="border-emerald-500/30 bg-emerald-500/10 text-emerald-100 print:bg-emerald-50 print:text-slate-900 print:border-emerald-200" titleClass="text-emerald-400 print:text-emerald-700" />
        </div>
      </section>

    </div>
  );
}

function HealthCard({ title, items, emptyMsg }: { title: string, items: string[], emptyMsg: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{title}</h3>
      {items.length === 0 ? (
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          {emptyMsg}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item} className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-800 truncate" dir="ltr">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlanColumn({ title, items, colorClass, titleClass }: { title: string, items: string[], colorClass: string, titleClass: string }) {
  const { t } = useLanguage();
  return (
    <div className={`p-5 rounded-xl border ${colorClass}`}>
      <h3 className={`font-bold mb-4 ${titleClass}`}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm opacity-70">{t('report.plan.empty')}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0 opacity-60 shadow-[0_0_8px_currentColor]"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">{message}</h3>
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false);
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden print:border-slate-300 print:shadow-none print:break-inside-avoid transition-all">
      <div 
        className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors print:cursor-default print:bg-white"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-1 shrink-0">
          {getSeverityIcon(issue.severity)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight" dir="ltr">{issue.title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              issue.severity === 'Critical' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' :
              issue.severity === 'High' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' :
              issue.severity === 'Medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
              'bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600/30'
            }`}>
              {isAr ? 'أولوية ' : 'Priority '} {
                issue.severity === 'Critical' ? (isAr ? 'حرجة' : 'Critical') :
                issue.severity === 'High' ? (isAr ? 'عالية' : 'High') :
                issue.severity === 'Medium' ? (isAr ? 'متوسطة' : 'Medium') : (isAr ? 'منخفضة' : 'Low')
              }
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {
                issue.category === 'Security' ? (isAr ? 'الأمان' : 'Security') :
                issue.category === 'Architecture' ? (isAr ? 'البنية المعمارية' : 'Architecture') :
                issue.category === 'Code Quality' ? (isAr ? 'جودة الكود' : 'Code Quality') :
                issue.category === 'Dependencies' ? (isAr ? 'التبعيات' : 'Dependencies') : issue.category
              }
            </span>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 line-clamp-2 print:line-clamp-none mt-2">{issue.description}</p>
        </div>

        <div className="shrink-0 text-slate-400 dark:text-slate-500 print:hidden">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <div className={`px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 print:block ${expanded ? 'block' : 'hidden'}`}>
        <div className="mt-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{isAr ? 'التفاصيل (Findings):' : 'Findings:'}</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">{issue.description}</p>
          {issue.file && (
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm space-y-1">
              <li>
                {isAr ? 'تم رصد المشكلة في: ' : 'Found in: '}
                <span className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded" dir="ltr">
                  {issue.file}{issue.line ? `:${issue.line}` : ''}
                </span>
              </li>
            </ul>
          )}
        </div>
        
        <div className="mt-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm print:border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400 font-semibold print:text-slate-800">
            <Wrench className="w-5 h-5" />
            {isAr ? 'توصية مختصرة:' : 'Quick Recommendation:'}
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {generateQuickFix(issue, isAr)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to generate a friendly "quick fix" based on category/severity
function generateQuickFix(issue: Issue, isAr: boolean): string {
  if (issue.category === 'Security') {
    return isAr ? "شارك هذا مع فريق الأمان أو المطور: يجب إزالة أي مفاتيح سرية من الكود المصدري فوراً واستخدام متغيرات البيئة. وتأكد من تعقيم أي مدخلات لمنع ثغرات الحقن (Injection/XSS)." : "Share this with the security team or developer: Hardcoded secrets must be removed immediately and replaced with environment variables. Ensure all inputs are sanitized to prevent injection attacks.";
  }
  if (issue.category === 'Architecture') {
    return isAr ? "شارك هذا مع مهندس البرمجيات: يُنصح بإعادة هيكلة المجلدات لفصل واجهة المستخدم عن منطق الأعمال لتسهيل الصيانة المستقبلية وتقليل الترابط (Coupling)." : "Share this with a software engineer: Consider restructuring folders to separate UI from business logic, which facilitates future maintenance and reduces coupling.";
  }
  if (issue.category === 'Code Quality') {
    return isAr ? "شارك هذا مع المطورين: راجع الكود المكرر واستبدله بدوال مساعدة قابلة لإعادة الاستخدام، وقم بتنظيف المتغيرات غير المستخدمة لتقليل حجم الحزمة." : "Share this with developers: Review duplicate code and replace it with reusable helper functions, and clean up unused variables to reduce bundle size.";
  }
  if (issue.category === 'Dependencies') {
    return isAr ? "شارك هذا مع فريقك التقني: قم بتشغيل أوامر تحديث الحزم (مثل npm audit fix أو npm update) لتحديث المكتبات القديمة وسد الثغرات المكتشفة بها." : "Share this with your technical team: Run package update commands (e.g., npm audit fix or npm update) to upgrade outdated libraries and patch discovered vulnerabilities.";
  }
  
  return isAr ? "يرجى مشاركة هذه النتيجة المحددة مع فريق التطوير الخاص بك حتى يتمكنوا من التحقق منها وحلها في الكود المصدري." : "Please share this specific finding with your development team so they can verify and resolve it in the source code.";
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'Critical': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
    case 'High': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    case 'Medium': return <Info className="w-5 h-5 text-amber-600" />;
    case 'Low': return <CheckCircle2 className="w-5 h-5 text-slate-400" />;
    default: return null;
  }
}

