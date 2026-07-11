import React, { useState } from 'react';
import { Activity, LayoutDashboard, History, Search, HelpCircle, ListIcon, ShieldCheck, X, Moon, Sun, Monitor, Settings, ChevronRight, ChevronLeft, Globe, Send, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, Theme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  currentReportId: string | null;
  onTabClick: (tab: any) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  currentReportId,
  onTabClick,
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
}) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, dir, t } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const isAr = language === 'ar';

  const isCollapsed = !isDesktopSidebarOpen;
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.home') },
    { id: 'runner', icon: Search, label: t('dashboard.startScan') },
    { id: 'history', icon: History, label: t('dashboard.recentScans') },
  ];

  return (
    <aside className={`relative z-50 h-full bg-zinc-50 dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col print:hidden transition-all duration-300 ease-in-out shrink-0
      ${isDesktopSidebarOpen ? 'w-64' : 'w-16 md:w-20'}
    `}>
      <div className={`h-16 flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4 transition-all duration-300 relative ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 overflow-hidden"
          >
            <Activity className="w-6 h-6 shrink-0" />
            <span className="font-mono font-bold tracking-widest text-sm uppercase truncate">{t('nav.brand')}</span>
          </motion.div>
        ) : (
          <Activity className="w-6 h-6 text-zinc-900 dark:text-zinc-100 shrink-0" />
        )}
        
        <button 
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className={`p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors 
            ${isCollapsed ? `absolute ${isAr ? '-left-3' : '-right-3'} top-20 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex z-50` : ''}`}
        >
          {isCollapsed ? (isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : (isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)}
        </button>
      </div>
      
      <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'} py-6 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide`}>
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            active={activeTab === item.id} 
            onClick={() => onTabClick(item.id)}
            collapsed={isCollapsed}
          />
        ))}
        
        {!isCollapsed && (
          <div className="pt-4 space-y-1">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mx-4 my-4" />
            <NavItem icon={HelpCircle} label={t('nav.howItWorks')} active={activeTab === 'how-it-works'} onClick={() => onTabClick('how-it-works')} collapsed={false} />
            <NavItem icon={ListIcon} label={t('nav.changelog')} active={activeTab === 'changelog'} onClick={() => onTabClick('changelog')} collapsed={false} />
            <NavItem icon={ShieldCheck} label={t('nav.legal')} active={activeTab === 'legal'} onClick={() => onTabClick('legal')} collapsed={false} />
            <NavItem icon={Info} label={isAr ? 'من نحن' : 'About Us'} active={activeTab === 'about'} onClick={() => onTabClick('about')} collapsed={false} />
            <NavItem icon={HelpCircle} label={isAr ? 'الأسئلة الشائعة' : 'FAQ'} active={activeTab === 'faq'} onClick={() => onTabClick('faq')} collapsed={false} />
            <NavItem icon={Send} label={isAr ? 'تواصل معنا' : 'Contact Us'} active={activeTab === 'contact'} onClick={() => onTabClick('contact')} collapsed={false} />
          </div>
        )}
      </nav>

      <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1 relative`}>
        <AnimatePresence>
          {showSettings && isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSettings && isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: isAr ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, x: isAr ? -6 : 6 }}
              exit={{ opacity: 0, scale: 0.95, x: isAr ? 10 : -10 }}
              className={`absolute bottom-0 z-50 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-xl p-2 w-64 ${isAr ? 'right-full mr-2' : 'left-full ml-2'}`}
            >
              <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 mb-1">
                <p className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('nav.settings')}</p>
              </div>
              <div className="space-y-1">
                <button onClick={() => { onTabClick('how-it-works'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{t('nav.howItWorks')}</span>
                </button>
                <button onClick={() => { onTabClick('changelog'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <ListIcon className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{t('nav.changelog')}</span>
                </button>
                <button onClick={() => { onTabClick('legal'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <ShieldCheck className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{t('nav.legal')}</span>
                </button>
                <button onClick={() => { onTabClick('about'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <Info className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{isAr ? 'من نحن' : 'About Us'}</span>
                </button>
                <button onClick={() => { onTabClick('faq'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                </button>
                <button onClick={() => { onTabClick('contact'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <Send className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                </button>
                <button onClick={() => { onTabClick('integrations'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{t('nav.integrations')}</span>
                </button>
                <button onClick={() => { onTabClick('file-picker'); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start">
                  <Search className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{t('nav.filePicker')}</span>
                </button>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start"
                >
                  <ThemeIcon className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs capitalize">{theme} Theme</span>
                </button>
                <button
                  onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setShowSettings(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-start"
                >
                  <Activity className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-xs">{language === 'en' ? 'العربية' : 'English'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-full flex items-center gap-3 py-2 text-sm font-medium transition-all duration-200 relative z-50 ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${showSettings ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/50'}`}
        >
          <Settings className={`w-4 h-4 shrink-0 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
          {!isCollapsed && <span className="flex-1 text-start truncate font-mono text-xs uppercase">{t('nav.settings')}</span>}
          {!isCollapsed && <ChevronRight className={`w-3 h-3 transition-transform ${showSettings ? (isAr ? '-rotate-90' : 'rotate-90') : ''}`} />}
        </button>

        {!isCollapsed && showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1 mt-2 px-2"
          >
            <button
              onClick={() => { onTabClick('integrations'); setShowSettings(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t('nav.integrations')}</span>
            </button>
            <button
              onClick={() => { onTabClick('file-picker'); setShowSettings(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('nav.filePicker')}</span>
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <ThemeIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{theme} Theme</span>
            </button>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </motion.div>
        )}
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

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-2 transition-all duration-200 group relative ${collapsed ? 'justify-center px-0' : 'px-4'} ${
        active 
          ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900' 
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`}
    >
      {active && !collapsed && (
        <div className={`absolute ${isAr ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-cyan-500`} />
      )}
      
      <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
      {!collapsed && (
        <span className="truncate font-mono text-xs uppercase tracking-wider">
          {active ? `[ ${label} ]` : label}
        </span>
      )}
      
      {collapsed && (
        <div className={`absolute ${isAr ? 'right-full mr-3' : 'left-full ml-3'} px-2 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-mono font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] hidden md:block border border-zinc-700 dark:border-zinc-300`}>
          {label}
        </div>
      )}
    </button>
  );
};
