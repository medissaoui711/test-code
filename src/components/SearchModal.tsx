import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Compass, CornerDownLeft, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TestReport } from '../lib/scanner';

interface SearchItem {
  id: string;
  type: 'page' | 'report';
  title: string;
  subtitle?: string;
  targetTab?: string;
  reportId?: string;
  icon: React.ReactNode;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: TestReport[];
  onNavigate: (tab: string, reportId?: string | null) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  reports,
  onNavigate,
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle global keydown events for opening/closing & navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search modal with CMD+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        // Since toggle is controlled outside, let the click handler in parent handle global event if needed
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable items
  const pages: SearchItem[] = [
    {
      id: 'page-dashboard',
      type: 'page',
      title: isAr ? 'لوحة التحكم' : 'Dashboard',
      subtitle: isAr ? 'الرئيسية ونظرة عامة على المشاريع' : 'Main overview of scanned projects',
      targetTab: 'dashboard',
      icon: <Compass className="w-4 h-4 text-cyan-500" />,
    },
    {
      id: 'page-runner',
      type: 'page',
      title: isAr ? 'فحص جديد' : 'Start New Scan',
      subtitle: isAr ? 'تحليل بنية المشروع واستخراج الثغرات' : 'Analyze project structure and find vulnerabilities',
      targetTab: 'runner',
      icon: <Search className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'page-history',
      type: 'page',
      title: isAr ? 'سجل الفحوصات' : 'Recent Scans History',
      subtitle: isAr ? 'استعراض التقارير السابقة ومقارنتها' : 'Browse and compare previous reports',
      targetTab: 'history',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'page-how-it-works',
      type: 'page',
      title: isAr ? 'آلية العمل' : 'How It Works',
      subtitle: isAr ? 'خطوات فحص الكود وتشريح الملفات' : 'Process of file dissection & scanning',
      targetTab: 'how-it-works',
      icon: <Compass className="w-4 h-4 text-pink-500" />,
    },
    {
      id: 'page-integrations',
      type: 'page',
      title: isAr ? 'التكامل والربط' : 'Integrations',
      subtitle: isAr ? 'ربط GitHub و Google Drive و Slack' : 'Connect GitHub, Google Drive, and Slack',
      targetTab: 'integrations',
      icon: <Compass className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'page-faq',
      type: 'page',
      title: isAr ? 'الأسئلة الشائعة' : 'FAQ',
      subtitle: isAr ? 'أجوبة على الأسئلة الشائعة حول الفحص والأمان' : 'Answers to common scanning questions',
      targetTab: 'faq',
      icon: <Compass className="w-4 h-4 text-violet-500" />,
    },
    {
      id: 'page-about',
      type: 'page',
      title: isAr ? 'من نحن' : 'About Us',
      subtitle: isAr ? 'تعرف على نظام فحص جودة كود الذكاء الاصطناعي' : 'Learn about our AI code health scanner',
      targetTab: 'about',
      icon: <Compass className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'page-contact',
      type: 'page',
      title: isAr ? 'تواصل معنا' : 'Contact Us',
      subtitle: isAr ? 'إرسال ملاحظات أو طلب دعم فني' : 'Send feedback or request technical support',
      targetTab: 'contact',
      icon: <Compass className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'page-changelog',
      type: 'page',
      title: isAr ? 'سجل التغييرات' : 'Changelog',
      subtitle: isAr ? 'آخر التحديثات والإصدارات البرمجية' : 'Latest updates and release notes',
      targetTab: 'changelog',
      icon: <Compass className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'page-legal',
      type: 'page',
      title: isAr ? 'الشروط القانونية والخصوصية' : 'Legal & Privacy',
      subtitle: isAr ? 'سياسات الأمان وحماية البيانات' : 'Security policies and data protection',
      targetTab: 'legal',
      icon: <Compass className="w-4 h-4 text-slate-500" />,
    },
  ];

  const reportItems: SearchItem[] = reports.map((report) => ({
    id: `report-${report.id}`,
    type: 'report',
    title: report.url,
    subtitle: `${isAr ? 'نقاط الجودة:' : 'Quality Score:'} ${report.scores.security}/100 • ${report.date}`,
    reportId: report.id,
    icon: <FileText className="w-4 h-4 text-cyan-400" />,
  }));

  const allItems = [...pages, ...reportItems];

  const filteredItems = allItems.filter((item) => {
    const searchStr = `${item.title} ${item.subtitle || ''}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'page' && item.targetTab) {
      onNavigate(item.targetTab);
    } else if (item.type === 'report' && item.reportId) {
      onNavigate('history', item.reportId);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      // Scroll into view
      const selectedEl = resultsContainerRef.current?.children[selectedIndex + 1] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      const selectedEl = resultsContainerRef.current?.children[selectedIndex - 1] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 md:px-0">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex flex-col max-h-[70vh] overflow-hidden relative z-10 font-sans"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800 relative">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm font-sans"
            placeholder={isAr ? 'ابحث عن الصفحات، التقارير أو الملفات...' : 'Search for pages, reports, or files...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded transition-colors"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800"
        >
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-zinc-500">
                {isAr ? 'لم يتم العثور على نتائج تطابق بحثك' : 'No results matching your query'}
              </p>
            </div>
          ) : (
            <>
              {/* Group headings are dynamically handled by item order */}
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isReport = item.type === 'report';
                
                // Show a clean visual divider before switching to report items
                const isFirstReport = isReport && (index === 0 || filteredItems[index - 1].type === 'page');

                return (
                  <React.Fragment key={item.id}>
                    {isFirstReport && (
                      <div className="px-3 py-2 text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
                        {isAr ? 'تقارير فحص المشاريع' : 'Project Scan Reports'}
                      </div>
                    )}
                    
                    {!isReport && index === 0 && (
                      <div className="px-3 py-2 text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
                        {isAr ? 'صفحات النظام والأقسام' : 'System Pages & Sections'}
                      </div>
                    )}

                    <button
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-start flex items-center justify-between p-3 transition-all duration-150 rounded-sm ${
                        isSelected
                          ? 'bg-zinc-800 border-l-2 border-[var(--accent-cyber)] text-white'
                          : 'hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-sm ${isSelected ? 'bg-zinc-900' : 'bg-zinc-800/30'}`}>
                          {item.icon}
                        </div>
                        <div className="min-w-0 text-start">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Select indicator */}
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                          <span>{isAr ? 'دخول' : 'Go'}</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded text-[9px]">↑↓</span>
              <span>{isAr ? 'للتنقل' : 'to navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[9px]">↵ Enter</span>
              <span>{isAr ? 'للاختيار' : 'to select'}</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <span className="bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded text-[9px]">Esc</span>
            <span>{isAr ? 'للإلغلاق' : 'to close'}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
