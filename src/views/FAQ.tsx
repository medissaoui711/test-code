import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { HelpCircle } from 'lucide-react';

export function FAQ() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="tech-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              {isAr ? 'ما هي هذه المنصة؟' : 'What is this platform?'}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {isAr 
                ? 'TestPilot هي منصة لتحليل الشيفرة وتقييم الأداء البرمجي والأمني للتطبيقات بخطوات بسيطة وفعالة.'
                : 'TestPilot is a platform for code analysis and evaluating the performance and security of applications in simple, effective steps.'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              {isAr ? 'هل بياناتي آمنة؟' : 'Is my data secure?'}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {isAr 
                ? 'نعم، نحن لا نحتفظ بأي شيفرات برمجية على خوادمنا بشكل دائم. يتم التحليل بشكل آني وتحذف البيانات بعد الانتهاء.'
                : 'Yes, we do not permanently store any source code on our servers. The analysis is done in real-time and data is deleted upon completion.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
