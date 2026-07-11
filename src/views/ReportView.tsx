import React, { useState, useRef } from 'react';
import { TestReport, Issue } from '../lib/scanner';
import { ArrowLeft, AlertTriangle, ShieldAlert, MousePointerClick, ChevronRight, CheckSquare, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ReportViewProps {
  report: TestReport;
  previousReport?: TestReport;
  onBack: () => void;
}

export function ReportView({ report, previousReport, onBack }: ReportViewProps) {
  const { t, language, dir } = useLanguage();
  const isAr = language === 'ar';
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportMD = () => {
    let md = `# TestPilot Report: ${report.url}\n\nDate: ${new Date(report.date).toISOString().split('T')[0]}\nStatus: ${report.runReadyVerdict}\nGlobal Score: ${report.scores.security}/100\n\n`;
    if (report.rawText) {
      md += `## Raw Output Fallback\n\n\`\`\`json\n${report.rawText}\n\`\`\``;
    } else {
      md += `## Vulnerabilities\n${report.issues.map(i => `- [${i.severity}] ${i.title}\n  File: ${i.file || 'Global'}\n  Impact: ${i.impact || i.learnHub?.impact}\n  Fix: ${i.remediation || i.learnHub?.solution}`).join('\n\n')}`;
    }
    const blob = new Blob(['\uFEFF' + md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.url.replace(/[^a-z0-9]/gi, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" dir={dir}>
      {/* Header Actions */}
      <div className="flex items-center justify-between print:hidden">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {isAr ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportPDF}
            className="tech-button-primary uppercase text-xs"
          >
            PDF
          </button>
          <button 
            onClick={handleExportMD}
            className="tech-button uppercase text-xs"
          >
            MD
          </button>
        </div>
      </div>

      <div className="tech-grid-layout space-y-8" ref={reportRef}>
        {/* 1. The Express Header */}
        <div className="tech-console mb-8 text-[var(--text-primary)]">
          <div className="pb-2 mb-2">
            {'================================================================================'}
            <br />
            {`[SYS.REPORT] TARGET: ${report.url}  |  DATE: ${new Date(report.date).toISOString().split('T')[0]}`}
            <br />
            {`STATUS: [ ${report.runReadyVerdict} ]  |  GLOBAL_SCORE: [ ${report.scores.security}/100 ] |  TIME_SAVED: ~4.5 HRS`}
            <br />
            {'================================================================================'}
          </div>
        </div>

        {report.rawText && (
          <div className="tech-console mb-8">
            <div className="text-[var(--signal-warn)] mb-4">{`>> [SYS.WARN] JSON PARSING FAILED. DISPLAYING RAW FALLBACK OUTPUT`}</div>
            <pre className="text-[var(--text-secondary)] whitespace-pre-wrap font-mono text-sm">
              {report.rawText}
            </pre>
          </div>
        )}

        {/* 2. PRO.EXPRESS_TERMINAL */}
        {!report.rawText && (
          <>
            <div className="tech-console mb-8">
              <div className="text-[var(--text-muted)] mb-4">{`>> [VULNERABILITY_LOG] ACTIVE // ONLY DISPLAYING CRITICAL & WARN`}</div>
          
          {report.issues.filter(i => i.severity === 'Critical' || i.severity === 'Major').map(issue => (
            <div key={issue.id} className="mb-6">
              <div className="text-[var(--signal-fail)]">{`[${issue.id}] TYPE: ${issue.title}`}</div>
              <div className="pl-4 border-l border-[var(--border-grid)] ml-2 mt-2 flex flex-col gap-1 text-[var(--text-secondary)]">
                <div>{`├─ FILE: ${issue.file || 'Global'} ${issue.line ? `: Line ${issue.line}` : ''}`}</div>
                {issue.proLogs?.snippet && <div>{`├─ CODESNIPPET: ${issue.proLogs.snippet}`}</div>}
                {issue.proLogs?.payload ? (
                  <div>{`└─ TARGET_PAYLOAD: ${issue.proLogs.payload}`}</div>
                ) : (
                  <div>{`└─ IMPACT: ${issue.impact}`}</div>
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 text-[var(--text-muted)]">
            {`>> [TERMINAL END] STATUS: ${report.issues.filter(i => i.severity === 'Critical' || i.severity === 'Major').length} FLAW(S) REQUIRING IMMEDIATE ROUTING.`}
          </div>
        </div>

        {/* 3. SYS.LEARN_HUB */}
        <div className="tech-panel p-6 mb-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 uppercase tracking-widest border-b border-[var(--border-grid)] pb-4">
            [ SYS.LEARN_HUB ]
          </h2>
          
          <div className="space-y-4">
            {report.issues.filter(i => i.learnHub).map((issue, idx) => (
              <LearnHubAccordion key={issue.id} issue={issue} isAr={isAr} defaultOpen={idx === 0} />
            ))}
          </div>
        </div>

        {/* 4. DEV_PLAN.MATRIX */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10 border border-[var(--border-grid)] p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-sharp)]">
          <PlanColumn 
            title={t('report.plan.fixNow') || 'FIX_NOW // فوراً'} 
            items={report.issues.filter(i => i.severity === 'Critical' || i.severity === 'Major').length === 0 ? [] : (report.plan?.fixNow || [])} 
            colorClass="border-[var(--signal-fail)] bg-[var(--signal-fail)]/10 text-[var(--signal-fail)]" 
            titleClass="text-[var(--signal-fail)]" 
            emptyMsg="[ STATUS: CLEAN // NO IMMEDIATE ACTION REQUIRED ]"
          />
          <PlanColumn 
            title={t('report.plan.next') || 'NEXT // لاحقاً'} 
            items={report.plan?.next || []} 
            colorClass="border-[var(--signal-warn)] bg-[var(--signal-warn)]/10 text-[var(--signal-warn)]" 
            titleClass="text-[var(--signal-warn)]" 
          />
          <PlanColumn 
            title={t('report.plan.later') || 'BACKLOG // مستقبلاً'} 
            items={report.plan?.later || []} 
            colorClass="border-[var(--signal-pass)] bg-[var(--signal-pass)]/10 text-[var(--signal-pass)]" 
            titleClass="text-[var(--signal-pass)]" 
          />
        </div>

        </>
        )}
      </div>
    </div>
  );
}

function LearnHubAccordion({ issue, isAr, defaultOpen = false }: { issue: Issue, isAr: boolean, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-[var(--border-grid)] rounded-[var(--radius-sharp)] bg-[var(--bg-primary)] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          {issue.category === 'Security' ? <ShieldAlert className="w-5 h-5 text-[var(--signal-warn)]" /> : <MousePointerClick className="w-5 h-5 text-[var(--accent-cyber)]" />}
          <span className="font-bold text-[var(--text-primary)]">
            {issue.category === 'Security' ? '💡 [ v ] شرح القضايا الأمنية (Security Breakdown)' : '🛠️ [ v ] شرح قضايا واجهة المستخدم (UX & Accessibility Breakdown)'}
            {' - '}
            <span className="text-[var(--text-secondary)] font-normal">{issue.title}</span>
          </span>
        </div>
        <ChevronRight className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      <div 
        className={`grid transition-[grid-template-rows,opacity] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-[var(--border-grid)] bg-[var(--bg-secondary)] space-y-4 text-sm font-sans">
            <div>
              <strong className="text-[var(--accent-cyber)]">{isAr ? 'المشكلة ببساطة:' : 'Problem:'}</strong>
              <p className="text-[var(--text-secondary)] mt-1">{issue.learnHub?.problem}</p>
            </div>
            <div>
              <strong className="text-[var(--signal-warn)]">{isAr ? 'لماذا هذا خطر؟ (الأثر):' : 'Impact:'}</strong>
              <p className="text-[var(--text-secondary)] mt-1">{issue.learnHub?.impact}</p>
            </div>
            <div>
              <strong className="text-[var(--signal-pass)]">{isAr ? 'كيف تحلها في ثوانٍ؟:' : 'Solution:'}</strong>
              <p className="text-[var(--text-secondary)] mt-1">{issue.learnHub?.solution}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanColumn({ title, items, colorClass, titleClass, emptyMsg }: { title: string, items: string[], colorClass: string, titleClass: string, emptyMsg?: string }) {
  return (
    <div className={`p-6 border rounded-[var(--radius-sharp)] ${colorClass} h-full`}>
      <h3 className={`font-bold font-mono tracking-widest uppercase mb-4 ${titleClass}`}>{title}</h3>
      {items.length === 0 ? (
        <p className={`text-sm opacity-70 font-mono ${titleClass}`}>{emptyMsg || '[ EMPTY ]'}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm font-mono leading-relaxed opacity-90">
              <span className="shrink-0 mt-0.5 opacity-50">{'>'}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
