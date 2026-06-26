import React, { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, History, Search, FileText, ChevronRight, HelpCircle, ListIcon, ShieldCheck, Menu, X, Moon, Sun, Monitor } from 'lucide-react';
import { TestReport } from './lib/scanner';
import { Dashboard } from './components/Dashboard';
import { TestRunner } from './components/TestRunner';
import { ReportView } from './components/ReportView';
import { BetaAccess } from './components/BetaAccess';
import { HowItWorks } from './components/HowItWorks';
import { FeedbackWidget } from './components/FeedbackWidget';
import { LandingPage } from './components/LandingPage';
import { Changelog } from './components/Changelog';
import { Legal } from './components/Legal';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme, Theme } from './contexts/ThemeContext';
import { getSessionId, cleanupExpiredSessions, clearSession } from './lib/session';
import { saveReportToBackend, getReportsFromBackend, clearBackendReports, migrateLegacyReports } from './lib/storage';

export default function App() {
  const [isBetaAccessGranted, setIsBetaAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'runner' | 'history' | 'how-it-works' | 'changelog' | 'legal'>('dashboard');
  const [reports, setReports] = useState<TestReport[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile first: hidden by default
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const { theme, setTheme, isDark } = useTheme();

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Hide mobile overlay
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load history from local storage and check beta access
  useEffect(() => {
    cleanupExpiredSessions();
    const sessionId = getSessionId();

    const access = localStorage.getItem('testpilot_beta_access');
    if (access === 'granted') {
      setIsBetaAccessGranted(true);
    }

    // Migrate old localStorage reports to our new sessionStorage backed layer
    migrateLegacyReports();

    // Load reports from our "backend" (currently simulated via sessionStorage)
    getReportsFromBackend().then(savedReports => {
      setReports(savedReports);
    });
  }, []);

  const saveReport = async (report: TestReport) => {
    const sessionId = getSessionId();
    
    // Optimistic UI update
    setReports(prev => [report, ...prev]);
    setCurrentReportId(report.id);
    setActiveTab('history');
    
    // Save to backend
    await saveReportToBackend(report);
    
    // Mock analytics event
    console.log(`Analytics: [Event] Scan_Completed | Session: ${sessionId} | URL: ${report.url} | Score: ${report.scores.security}`);
  };

  const { language, setLanguage, dir, t } = useLanguage();
  const isAr = language === 'ar';

  if (!isBetaAccessGranted) {
    return <LandingPage onAccessGranted={() => setIsBetaAccessGranted(true)} />;
  }

  const currentReport = reports.find(r => r.id === currentReportId);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setCurrentReportId(null);
    setIsSidebarOpen(false); // Close mobile sidebar
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden`} dir={dir}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 h-full bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 flex flex-col print:hidden transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 w-64' : isAr ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isDesktopSidebarOpen ? 'md:w-64' : 'md:w-20'}
      `}>
        <div className={`h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 ${isDesktopSidebarOpen || isSidebarOpen ? 'justify-between' : 'justify-center px-2'}`}>
          {(isDesktopSidebarOpen || isSidebarOpen) && (
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-6 h-6 shrink-0" />
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">{t('nav.brand')}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 tracking-wider">Beta</span>
            </div>
          )}
          {!isDesktopSidebarOpen && !isSidebarOpen && (
            <div className="text-indigo-600 dark:text-indigo-400">
              <Activity className="w-8 h-8 shrink-0" />
            </div>
          )}
          {/* Mobile close button */}
          <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-3' : 'justify-center px-0'} ${
              activeTab === 'dashboard' && !currentReportId ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('nav.home') : undefined}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="truncate">{t('nav.home')}</span>}
          </button>
          <button
            onClick={() => handleTabClick('runner')}
            className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-3' : 'justify-center px-0'} ${
              activeTab === 'runner' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('dashboard.startScan') : undefined}
          >
            <Search className="w-5 h-5 shrink-0" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="truncate">{t('dashboard.startScan')}</span>}
          </button>
          <button
            onClick={() => handleTabClick('history')}
            className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-3' : 'justify-center px-0'} ${
              activeTab === 'history' && !currentReportId ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('dashboard.recentScans') : undefined}
          >
            <History className="w-5 h-5 shrink-0" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="truncate">{t('dashboard.recentScans')}</span>}
          </button>
          <button
            onClick={() => handleTabClick('how-it-works')}
            className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-3' : 'justify-center px-0'} ${
              activeTab === 'how-it-works' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('nav.howItWorks') : undefined}
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="truncate">{t('nav.howItWorks')}</span>}
          </button>
          <button
            onClick={() => handleTabClick('changelog')}
            className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-3' : 'justify-center px-0'} ${
              activeTab === 'changelog' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('nav.changelog') : undefined}
          >
            <ListIcon className="w-5 h-5 shrink-0" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="truncate">{t('nav.changelog')}</span>}
          </button>
          <button
            onClick={() => handleTabClick('legal')}
            className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-3' : 'justify-center px-0'} ${
              activeTab === 'legal' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('nav.legal') : undefined}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="truncate">{t('nav.legal')}</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              const themes: Theme[] = ['light', 'dark', 'system'];
              const next = themes[(themes.indexOf(theme) + 1) % 3];
              setTheme(next);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-4' : 'px-0'}`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? 'Toggle Theme' : undefined}
          >
            <ThemeIcon className="w-4 h-4" />
            {(isDesktopSidebarOpen || isSidebarOpen) && <span className="capitalize">{theme}</span>}
          </button>
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`w-full flex items-center justify-center py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-4' : 'px-0'}`}
            title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('nav.switchLang') : undefined}
          >
            {(isDesktopSidebarOpen || isSidebarOpen) ? t('nav.switchLang') : (language === 'en' ? 'AR' : 'EN')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 bg-cyber-grid">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 md:px-6 shrink-0 print:hidden justify-between z-10 sticky top-0">
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
              <span className="text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">Report: {currentReport?.url}</span>
            ) : (
              <span className="text-slate-900 dark:text-white capitalize truncate">
                {activeTab === 'dashboard' ? t('nav.home') : activeTab === 'runner' ? t('dashboard.startScan') : activeTab === 'history' ? t('dashboard.recentScans') : activeTab === 'how-it-works' ? t('nav.howItWorks') : activeTab === 'changelog' ? t('nav.changelog') : t('nav.legal')}
              </span>
            )}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 overflow-x-hidden relative z-0">
          <div className="max-w-7xl mx-auto w-full h-full">
            {currentReportId && currentReport ? (
              <ReportView 
                report={currentReport} 
                previousReport={reports.find(r => r.id !== currentReportId && r.url === currentReport.url)}
                onBack={() => setCurrentReportId(null)} 
              />
            ) : activeTab === 'dashboard' ? (
              <Dashboard reports={reports} onStartScan={() => setActiveTab('runner')} onViewReport={(id) => setCurrentReportId(id)} />
            ) : activeTab === 'runner' ? (
              <TestRunner onComplete={saveReport} />
            ) : activeTab === 'how-it-works' ? (
              <HowItWorks />
            ) : activeTab === 'changelog' ? (
              <Changelog />
            ) : activeTab === 'legal' ? (
              <Legal />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.recentScans')}</h2>
                  {reports.length > 0 && (
                    <button 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to clear all history?')) {
                          setReports([]);
                          await clearBackendReports();
                        }
                      }}
                      className="text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
                    >
                      Clear History
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
                            onClick={() => setCurrentReportId(report.id)}
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
            )}
          </div>
        </div>
      </main>

      <FeedbackWidget />
    </div>
  );
}
