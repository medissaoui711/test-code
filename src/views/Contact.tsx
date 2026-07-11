import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send } from 'lucide-react';

export function Contact() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="tech-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-sm">
            <Send className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h2>
        </div>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {isAr ? 'الاسم' : 'Name'}
            </label>
            <input type="text" className="tech-input w-full" placeholder={isAr ? 'اسمك الكريم' : 'Your Name'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {isAr ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input type="email" className="tech-input w-full" placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {isAr ? 'الرسالة' : 'Message'}
            </label>
            <textarea rows={4} className="tech-input w-full" placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}></textarea>
          </div>
          <button className="tech-button-primary w-full sm:w-auto">
            {isAr ? 'إرسال الرسالة' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
