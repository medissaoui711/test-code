import React, { useState } from 'react';
import { ChevronRight, Activity, Search, Settings, Moon, Sun, Monitor, Globe, HelpCircle, ListIcon, ShieldCheck, X, Menu, LayoutDashboard, History, Info, Send, User, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (open: boolean) => void;
  currentReportId: string | null;
  currentReportUrl?: string;
  activeTab: string;
  onTabClick: (tab: any) => void;
  onSearchClick: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentReportId,
  currentReportUrl,
  activeTab,
  onTabClick,
  onSearchClick,
  onLogout,
}) => {
  const { language, setLanguage, dir, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const isAr = language === 'ar';

  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return t('nav.home');
      case 'runner': return t('dashboard.startScan');
      case 'history': return t('dashboard.recentScans');
      case 'how-it-works': return t('nav.howItWorks');
      case 'changelog': return t('nav.changelog');
      case 'legal': return t('nav.legal');
      case 'about': return isAr ? 'من نحن' : 'About Us';
      case 'faq': return isAr ? 'الأسئلة الشائعة' : 'FAQ';
      case 'contact': return isAr ? 'تواصل معنا' : 'Contact Us';
      case 'integrations': return t('nav.integrations');
      case 'file-picker': return t('nav.filePicker');
      default: return '';
    }
  };

  return (
    <>
    <header className="h-16 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 md:px-6 shrink-0 print:hidden justify-between z-50 sticky top-0" dir={dir}>
      <div className="flex items-center text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-medium w-full">
        <span className="inline">{t('nav.brand')}</span>
        <span className="hidden sm:block mx-2 text-zinc-300 dark:text-zinc-700">/</span>
        {currentReportId ? (
          <span className="hidden sm:inline text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] md:max-w-md">Report: {currentReportUrl}</span>
        ) : (
          <span className="hidden sm:inline text-zinc-900 dark:text-zinc-100 truncate">
            {getTabLabel()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>SYS.ONLINE</span>
        </div>
        
        <div 
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer active:scale-95"
          title={isAr ? 'البحث عن الصفحات والمشاريع' : 'Search pages and projects'}
        >
          <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-500 transition-colors" />
          <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{isAr ? '⌘K للبحث' : 'CMD+K'}</span>
        </div>

        <div className="flex items-center md:hidden gap-1">
          <button 
            onClick={onSearchClick}
            className="p-2 text-zinc-500 hover:text-cyan-500 transition-colors"
            title={isAr ? 'البحث' : 'Search'}
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Avatar / Login Button */}
        <div className="relative flex items-center">
          {isLoggedIn ? (
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              title={isAr ? 'ملف المستخدم' : 'User Profile'}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&q=80"
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
              />
              <span className="hidden md:inline text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400 px-1">
                contacteinfo
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors active:scale-95 border border-cyan-500"
            >
              <User className="w-3 h-3" />
              <span>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
            </button>
          )}

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {isLoggedIn && showUserDropdown && (
              <>
                {/* Backdrop to close */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute ${isAr ? 'left-0' : 'right-0'} top-full mt-2 w-64 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 z-50`}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&q=80"
                      alt="User Avatar"
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
                    />
                    <div className="min-w-0 text-start">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {isAr ? 'المطور contacteinfo' : 'Developer contacteinfo'}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">
                        contacteinfo71@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono text-zinc-500">
                      <span>{isAr ? 'الحالة:' : 'Status:'}</span>
                      <span className="flex items-center gap-1 text-emerald-500">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        {isAr ? 'نشط' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono text-zinc-500">
                      <span>{isAr ? 'الدور:' : 'Role:'}</span>
                      <span className="text-cyan-500">{isAr ? 'مختبر بيتا' : 'Beta Tester'}</span>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setShowUserDropdown(false);
                      if (onLogout) {
                        onLogout();
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-950/20 transition-colors text-start"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {showSettings && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[100] backdrop-blur-sm" 
            onClick={() => setShowSettings(false)} 
          />
          <motion.div
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={`fixed top-0 bottom-0 w-72 bg-zinc-50 dark:bg-zinc-950 border-${isAr ? 'r' : 'l'} border-zinc-200 dark:border-zinc-800 shadow-2xl z-[110] flex flex-col ${isAr ? 'left-0' : 'right-0'}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{t('nav.settings')}</span>
              <button onClick={() => setShowSettings(false)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              <div className="px-4 pb-2">
                <p className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('nav.navigation')}</p>
              </div>
              <button onClick={() => { onTabClick('dashboard'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'dashboard' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-mono text-xs">{t('nav.home')}</span>
              </button>
              <button onClick={() => { onTabClick('runner'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'runner' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <Search className="w-5 h-5" />
                <span className="font-mono text-xs">{t('dashboard.startScan')}</span>
              </button>
              <button onClick={() => { onTabClick('history'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'history' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <History className="w-5 h-5" />
                <span className="font-mono text-xs">{t('dashboard.recentScans')}</span>
              </button>
              <button onClick={() => { onTabClick('integrations'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'integrations' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <Globe className="w-5 h-5" />
                <span className="font-mono text-xs">{t('nav.integrations')}</span>
              </button>
              <button onClick={() => { onTabClick('file-picker'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'file-picker' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <Search className="w-5 h-5" />
                <span className="font-mono text-xs">{t('nav.filePicker')}</span>
              </button>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4 mx-4" />

              <div className="px-4 pb-2">
                <p className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('nav.pages')}</p>
              </div>
              <button onClick={() => { onTabClick('how-it-works'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'how-it-works' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <HelpCircle className="w-5 h-5" />
                <span className="font-mono text-xs">{t('nav.howItWorks')}</span>
              </button>
              <button onClick={() => { onTabClick('changelog'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'changelog' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <ListIcon className="w-5 h-5" />
                <span className="font-mono text-xs">{t('nav.changelog')}</span>
              </button>
              <button onClick={() => { onTabClick('legal'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'legal' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <ShieldCheck className="w-5 h-5" />
                <span className="font-mono text-xs">{t('nav.legal')}</span>
              </button>
              <button onClick={() => { onTabClick('about'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'about' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <Info className="w-5 h-5" />
                <span className="font-mono text-xs">{isAr ? 'من نحن' : 'About Us'}</span>
              </button>
              <button onClick={() => { onTabClick('faq'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'faq' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <HelpCircle className="w-5 h-5" />
                <span className="font-mono text-xs">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
              </button>
              <button onClick={() => { onTabClick('contact'); setShowSettings(false); }} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-start ${activeTab === 'contact' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                <Send className="w-5 h-5" />
                <span className="font-mono text-xs">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
              </button>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4 mx-4" />
              
              <div className="px-4 pb-2">
                <p className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('nav.preferences')}</p>
              </div>
              <button
                onClick={() => { setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'); }}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-start"
              >
                {theme === 'light' ? <Sun className="w-5 h-5" /> : theme === 'dark' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                <span className="font-mono text-xs capitalize">{theme} Theme</span>
              </button>
              <button
                onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setShowSettings(false); }}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-start"
              >
                <Globe className="w-5 h-5" />
                <span className="font-mono text-xs">{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};
