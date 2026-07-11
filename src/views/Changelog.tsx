import React from 'react';
import { Sparkles, Bug, Wrench, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Changelog() {
  const { t, language, dir } = useLanguage();
  const isAr = language === 'ar';

  const updates = [
    {
      version: isAr ? 'v0.9.0 (إطلاق النسخة التجريبية)' : 'v0.9.0 (Beta Release)',
      date: isAr ? 'اليوم' : 'Today',
      icon: <Rocket className="w-5 h-5 text-cyan-600" />,
      changes: isAr ? [
        'إطلاق برنامج النسخة التجريبية (بيتا) للمستخدمين الأوائل.',
        'إضافة إمكانيات تصدير PDF مباشرة من واجهة التقرير.',
        'تطبيق ويدجت الملاحظات لجمع انطباعات المستخدمين المبكرة.',
        'تحسين تعيين مستويات الخطورة لجعل المشاكل التقنية أسهل للفهم لغير التقنيين.'
      ] : [
        'Launched the initial Beta program for early adopters.',
        'Added PDF Export capabilities directly from the report view.',
        'Implemented the Feedback Widget to gather early user impressions.',
        'Refined the severity mapping to make technical issues easier to understand for non-technical users.'
      ]
    },
    {
      version: isAr ? 'v0.8.5 (نسخة مرشحة للإطلاق)' : 'v0.8.5 (Release Candidate)',
      date: isAr ? 'الأسبوع الماضي' : 'Last Week',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      changes: isAr ? [
        'تقديم محرك "اقتراح الحل السريع" لترجمة الأخطاء المعقدة إلى مهام قابلة للتنفيذ.',
        'إضافة تتبع التوجه التاريخي على لوحة التحكم.',
        'تحسين تباين واجهة المستخدم والخطوط لقراءة أفضل.'
      ] : [
        'Introduced the "Quick Fix Suggestion" engine to translate complex errors into actionable tasks.',
        'Added historical trend tracking on the dashboard.',
        'Improved UI contrast and typography for better readability.'
      ]
    },
    {
      version: 'v0.8.0',
      date: isAr ? 'قبل أسبوعين' : '2 Weeks Ago',
      icon: <Bug className="w-5 h-5 text-rose-600" />,
      changes: isAr ? [
        'إصلاح خطأ حرج حيث كان الفحص يتوقف للمواقع ذات الذاكرة المؤقتة الكثيفة.',
        'حل مشكلة عدم تزامن سجل التخزين المحلي عبر عدة نوافذ.',
        'استقرار اتصالات واجهة برمجة تطبيقات محرك الاختبار.'
      ] : [
        'Fixed critical bug where the scanner would time out on heavily cached websites.',
        'Resolved issue with local storage history not syncing across multiple tabs.',
        'Stabilized the testing engine API connections.'
      ]
    },
    {
      version: isAr ? 'v0.5.0 (ألفا)' : 'v0.5.0 (Alpha)',
      date: isAr ? 'قبل شهر' : '1 Month Ago',
      icon: <Wrench className="w-5 h-5 text-amber-600" />,
      changes: isAr ? [
        'النموذج الأولي للوحة التحكم ومشغل الاختبار.',
        'دمج واجهة Lighthouse الأساسية.',
        'إثبات المفهوم لـ "مستكشف النتائج".'
      ] : [
        'Initial prototype of the Dashboard and Test Runner.',
        'Basic Lighthouse API integration.',
        'Proof-of-concept for the "Findings Explorer".'
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in" dir={dir}>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">{t('changelog.title')}</h1>
        <p className="text-lg text-zinc-600">{t('changelog.desc')}</p>
      </div>

      <div className="space-y-8">
        {updates.map((update, index) => (
          <div key={index} className="tech-panel p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-sm ${
                  index === 0 ? 'bg-cyan-50' : 
                  index === 1 ? 'bg-emerald-50' : 
                  index === 2 ? 'bg-rose-50' : 'bg-amber-50'
                }`}>
                  {update.icon}
                </div>
                <h2 className="text-xl font-bold text-zinc-900">{update.version}</h2>
              </div>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-3 py-1 font-mono text-xs uppercase tracking-widest">{update.date}</span>
            </div>
            
            <ul className="space-y-3">
              {update.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-700">
                  <span className="text-zinc-300 mt-1.5 shrink-0">•</span>
                  <span className="leading-relaxed">{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
