import React from 'react';
import { History, FileText } from 'lucide-react';
import { TestReport } from '../lib/scanner';
import { useLanguage } from '../contexts/LanguageContext';
import { clearBackendReports } from '../lib/storage';

interface HistoryListProps {
  reports: TestReport[];
  setReports: React.Dispatch<React.SetStateAction<TestReport[]>>;
  onViewReport: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ reports, setReports, onViewReport }) => {
  const { language, t } = useLanguage();

  const handleClearHistory = async () => {
    if (window.confirm(t('dashboard.clearHistoryConfirm'))) {
      setReports([]);
      await clearBackendReports();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('dashboard.recentScans')}</h2>
        {reports.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="tech-button border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300"
          >
            {t('dashboard.clearHistory')}
          </button>
        )}
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-12 tech-panel">
          <History className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{t('dashboard.noScans')}</h3>
        </div>
      ) : (
        <div className="tech-panel divide-y divide-zinc-200 dark:divide-zinc-800">
          {reports.map((report) => (
            <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-white truncate" dir="ltr">{report.url}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{new Date(report.date).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 w-full sm:w-auto">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-rose-600 dark:text-rose-400">{report.issues.filter(i => i.severity === 'Critical').length}</span> Critical
                </div>
                <button
                  onClick={() => onViewReport(report.id)}
                  className="tech-button text-xs font-mono"
                >
                  {t('dashboard.viewReport')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
