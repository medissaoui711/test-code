import React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (open: boolean) => void;
  currentReportId: string | null;
  currentReportUrl?: string;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
  currentReportId,
  currentReportUrl,
  activeTab,
}) => {
  const { language, dir, t } = useLanguage();
  const isAr = language === 'ar';

  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return t('nav.home');
      case 'runner': return t('dashboard.startScan');
      case 'history': return t('dashboard.recentScans');
      case 'how-it-works': return t('nav.howItWorks');
      case 'changelog': return t('nav.changelog');
      case 'legal': return t('nav.legal');
      default: return '';
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 md:px-6 shrink-0 print:hidden justify-between z-10 sticky top-0" dir={dir}>
      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium w-full">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className="hidden md:block p-2 mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline">{t('nav.brand')}</span>
        <ChevronRight className={`hidden sm:block w-4 h-4 mx-2 ${isAr ? 'rotate-180' : ''}`} />
        {currentReportId ? (
          <span className="text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">Report: {currentReportUrl}</span>
        ) : (
          <span className="text-slate-900 dark:text-white capitalize truncate">
            {getTabLabel()}
          </span>
        )}
      </div>
    </header>
  );
};
