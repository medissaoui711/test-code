import React from 'react';
import { Activity, LayoutDashboard, History, Search, HelpCircle, ListIcon, ShieldCheck, X, Moon, Sun, Monitor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, Theme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  currentReportId: string | null;
  onTabClick: (tab: any) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDesktopSidebarOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  currentReportId,
  onTabClick,
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktopSidebarOpen,
}) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, dir, t } = useLanguage();
  const isAr = language === 'ar';

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
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
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        <NavItem 
          icon={LayoutDashboard} 
          label={t('nav.home')} 
          active={activeTab === 'dashboard' && !currentReportId} 
          onClick={() => onTabClick('dashboard')}
          collapsed={!isDesktopSidebarOpen && !isSidebarOpen}
        />
        <NavItem 
          icon={Search} 
          label={t('dashboard.startScan')} 
          active={activeTab === 'runner'} 
          onClick={() => onTabClick('runner')}
          collapsed={!isDesktopSidebarOpen && !isSidebarOpen}
        />
        <NavItem 
          icon={History} 
          label={t('dashboard.recentScans')} 
          active={activeTab === 'history' && !currentReportId} 
          onClick={() => onTabClick('history')}
          collapsed={!isDesktopSidebarOpen && !isSidebarOpen}
        />
        <NavItem 
          icon={HelpCircle} 
          label={t('nav.howItWorks')} 
          active={activeTab === 'how-it-works'} 
          onClick={() => onTabClick('how-it-works')}
          collapsed={!isDesktopSidebarOpen && !isSidebarOpen}
        />
        <NavItem 
          icon={ListIcon} 
          label={t('nav.changelog')} 
          active={activeTab === 'changelog'} 
          onClick={() => onTabClick('changelog')}
          collapsed={!isDesktopSidebarOpen && !isSidebarOpen}
        />
        <NavItem 
          icon={ShieldCheck} 
          label={t('nav.legal')} 
          active={activeTab === 'legal'} 
          onClick={() => onTabClick('legal')}
          collapsed={!isDesktopSidebarOpen && !isSidebarOpen}
        />
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
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
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className={`w-full flex items-center justify-center py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${(isDesktopSidebarOpen || isSidebarOpen) ? 'px-4' : 'px-0'}`}
          title={(!isDesktopSidebarOpen && !isSidebarOpen) ? t('nav.switchLang') : undefined}
        >
          {(isDesktopSidebarOpen || isSidebarOpen) ? t('nav.switchLang') : (language === 'en' ? 'AR' : 'EN')}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center px-0' : 'px-3'} ${
      active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    }`}
    title={collapsed ? label : undefined}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!collapsed && <span className="truncate">{label}</span>}
  </button>
);
