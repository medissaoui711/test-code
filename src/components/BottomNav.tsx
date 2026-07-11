import React from 'react';
import { LayoutDashboard, Search, History, HelpCircle, ListIcon, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabClick }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.home') },
    { id: 'runner', icon: Search, label: t('dashboard.startScan') },
    { id: 'history', icon: History, label: t('dashboard.recentScans') },
    { id: 'integrations', icon: Globe, label: t('nav.integrations') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 z-50 px-2 pb-safe flex justify-around items-center h-16">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            activeTab === tab.id
              ? 'text-cyan-600 dark:text-cyan-400'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <tab.icon className={`w-5 h-5 transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
