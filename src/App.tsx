import React, { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, History, Search, FileText, ChevronRight, HelpCircle, ListIcon, ShieldCheck, Menu, X, Moon, Sun, Monitor } from 'lucide-react';
import { TestReport } from './lib/scanner';
import { Dashboard } from './views/Dashboard';
import { TestRunner } from './views/TestRunner';
import { ReportView } from './views/ReportView';
import { BetaAccess } from './views/BetaAccess';
import { HowItWorks } from './views/HowItWorks';
import { FeedbackWidget } from './components/FeedbackWidget';
import { LandingPage } from './views/LandingPage';
import { Changelog } from './views/Changelog';
import { Legal } from './views/Legal';
import { FAQ } from './views/FAQ';
import { Contact } from './views/Contact';
import { About } from './views/About';
import { IntegrationsSettings } from './views/IntegrationsSettings';
import { FilePickerDashboard } from './views/FilePicker';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme, Theme } from './contexts/ThemeContext';
import { getSessionId, cleanupExpiredSessions, clearSession } from './lib/session';
import { saveReportToBackend, getReportsFromBackend, clearBackendReports, migrateLegacyReports } from './lib/storage';
import { AnimatePresence } from 'framer-motion';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HistoryList } from './components/HistoryList';
import { SearchModal } from './components/SearchModal';

import { BottomNav } from './components/BottomNav';
import { SEO } from "./components/SEO";

export default function App() {
  const [isBetaAccessGranted, setIsBetaAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'runner' | 'history' | 'integrations' | 'file-picker' | 'how-it-works' | 'changelog' | 'legal' | 'faq' | 'contact' | 'about'>('dashboard');
  const [reports, setReports] = useState<TestReport[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [runnerInitialType, setRunnerInitialType] = useState<'url' | 'file'>('url');
  const [runnerInitialUrl, setRunnerInitialUrl] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { dir } = useLanguage();

  // Handle responsive sidebar behavior is no longer needed since it's collapsible on all screens

  // Load history from local storage and check beta access
  useEffect(() => {
    cleanupExpiredSessions();

    const access = localStorage.getItem('testpilot_beta_access');
    if (access === 'granted') {
      setIsBetaAccessGranted(true);
    }

    migrateLegacyReports();

    getReportsFromBackend().then(savedReports => {
      setReports(savedReports);
    });

    // Global keyboard shortcut for Search Modal (CMD+K or Ctrl+K)
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const saveReport = async (report: TestReport) => {
    const sessionId = getSessionId();
    
    setReports(prev => [report, ...prev]);
    setCurrentReportId(report.id);
    setActiveTab('history');
    
    await saveReportToBackend(report);
    
    console.log(`Analytics: [Event] Scan_Completed | Session: ${sessionId} | URL: ${report.url} | Score: ${report.scores.security}`);
  };

  if (!isBetaAccessGranted) {
    return <LandingPage onAccessGranted={() => setIsBetaAccessGranted(true)} />;
  }

  const currentReport = reports.find(r => r.id === currentReportId);

  const handleStartScan = (options?: { inputType: 'url' | 'file'; initialUrl?: string }) => {
    if (options) {
      setRunnerInitialType(options.inputType);
      setRunnerInitialUrl(options.initialUrl || '');
    } else {
      setRunnerInitialType('url');
      setRunnerInitialUrl('');
    }
    setActiveTab('runner');
    setCurrentReportId(null);
    if (window.innerWidth < 768) {
      setIsDesktopSidebarOpen(false);
    }
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setCurrentReportId(null);
    if (window.innerWidth < 768) {
      setIsDesktopSidebarOpen(false);
    }
  };

  return (
    <>

      <SEO />
    <div className={`flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative overflow-hidden`} dir={dir}>
      <Sidebar 
        activeTab={activeTab}
        currentReportId={currentReportId}
        onTabClick={handleTabClick}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)] cyber-grid-bg transition-all duration-500 ease-in-out">
        <Header 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
          currentReportId={currentReportId}
          currentReportUrl={currentReport?.url}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onSearchClick={() => setIsSearchOpen(true)}
          onLogout={() => {
            localStorage.removeItem('testpilot_beta_access');
            setIsBetaAccessGranted(false);
          }}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 overflow-x-hidden relative z-0">
          <div className="max-w-7xl mx-auto w-full h-full">
            {currentReportId && currentReport ? (
              <ReportView 
                report={currentReport} 
                previousReport={reports.find(r => r.id !== currentReportId && r.url === currentReport.url)}
                onBack={() => setCurrentReportId(null)} 
              />
            ) : activeTab === 'dashboard' ? (
              <Dashboard reports={reports} onStartScan={handleStartScan} onViewReport={(id) => setCurrentReportId(id)} />
            ) : activeTab === 'runner' ? (
              <TestRunner onComplete={saveReport} initialType={runnerInitialType} initialUrl={runnerInitialUrl} />
            ) : activeTab === 'how-it-works' ? (
              <HowItWorks />
            ) : activeTab === 'changelog' ? (
              <Changelog />
            ) : activeTab === 'legal' ? (
              <Legal />
            ) : activeTab === 'faq' ? (
              <FAQ />
            ) : activeTab === 'contact' ? (
              <Contact />
            ) : activeTab === 'about' ? (
              <About />
            ) : activeTab === 'integrations' ? (
              <IntegrationsSettings />
            ) : activeTab === 'file-picker' ? (
              <FilePickerDashboard />
            ) : (
              <HistoryList 
                reports={reports}
                setReports={setReports}
                onViewReport={(id) => setCurrentReportId(id)}
              />
            )}
          </div>

        </div>

      </main>
      <BottomNav activeTab={activeTab} onTabClick={handleTabClick} />
      <FeedbackWidget />
      
      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            reports={reports}
            onNavigate={(tab, reportId) => {
              if (reportId) {
                setCurrentReportId(reportId);
                setActiveTab('history');
              } else {
                handleTabClick(tab);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
