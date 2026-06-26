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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.recentScans')}</h2>
        {reports.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            {t('dashboard.clearHistory')}
          </button>
        )}
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t('dashboard.noScans')}</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
          {reports.map((report) => (
            <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate" dir="ltr">{report.url}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(report.date).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 w-full sm:w-auto">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-rose-600 dark:text-rose-400">{report.issues.filter(i => i.severity === 'Critical').length}</span> Critical
                </div>
                <button
                  onClick={() => onViewReport(report.id)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
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
