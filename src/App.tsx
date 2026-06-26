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
import { useLanguage } from './contexts/LanguageContext';
import { useTheme, Theme } from './contexts/ThemeContext';
import { getSessionId, cleanupExpiredSessions, clearSession } from './lib/session';
import { saveReportToBackend, getReportsFromBackend, clearBackendReports, migrateLegacyReports } from './lib/storage';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HistoryList } from './components/HistoryList';

export default function App() {
  const [isBetaAccessGranted, setIsBetaAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'runner' | 'history' | 'how-it-works' | 'changelog' | 'legal'>('dashboard');
  const [reports, setReports] = useState<TestReport[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const { dir } = useLanguage();

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setCurrentReportId(null);
    setIsSidebarOpen(false); 
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden`} dir={dir}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeTab={activeTab}
        currentReportId={currentReportId}
        onTabClick={handleTabClick}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 bg-cyber-grid">
        <Header 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
          currentReportId={currentReportId}
          currentReportUrl={currentReport?.url}
          activeTab={activeTab}
        />
        
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
              <HistoryList 
                reports={reports}
                setReports={setReports}
                onViewReport={(id) => setCurrentReportId(id)}
              />
            )}
          </div>
        </div>
      </main>

      <FeedbackWidget />
    </div>
  );
}

