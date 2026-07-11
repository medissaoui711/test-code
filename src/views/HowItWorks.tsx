import React from 'react';
import { Search, Zap, FileText, CheckCircle2, Code2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function HowItWorks() {
  const { t, language, dir } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in" dir={dir}>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">{t('howItWorks.title')}</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          {t('howItWorks.desc')}
        </p>
      </div>

      {/* Main Goal */}
      <div className="tech-panel p-8 mb-12 border-cyan-500/50 bg-cyan-500/5">
        <h2 className="text-2xl font-bold text-cyan-900 mb-4">{t('howItWorks.goal.title')}</h2>
        <ul className="space-y-3 text-cyan-800">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-cyan-600" />
            <span>{t('howItWorks.goal.1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-cyan-600" />
            <span>{t('howItWorks.goal.2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-cyan-600" />
            <span>{t('howItWorks.goal.3')}</span>
          </li>
        </ul>
      </div>

      {/* Audience */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">{t('howItWorks.audience.title')}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="tech-panel p-6">
            <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-sm">
                <Search className="w-5 h-5" />
              </span>
              {t('howItWorks.audience.public.title')}
            </h3>
            <ul className="space-y-3 text-zinc-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span>{t('howItWorks.audience.public.1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span>{t('howItWorks.audience.public.2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span>{t('howItWorks.audience.public.3')}</span>
              </li>
            </ul>
          </div>
          
          <div className="tech-panel p-6">
            <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-sm">
                <Code2 className="w-5 h-5" />
              </span>
              {t('howItWorks.audience.devs.title')}
            </h3>
            <ul className="space-y-3 text-zinc-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <span>{t('howItWorks.audience.devs.1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <span>{t('howItWorks.audience.devs.2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <span>{t('howItWorks.audience.devs.3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8 rounded-sm mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">{t('howItWorks.value.title')}</h2>
        <ul className="space-y-4 text-zinc-300">
          <li className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <span>{t('howItWorks.value.1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <span>{t('howItWorks.value.2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <span>{t('howItWorks.value.3')}</span>
          </li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="tech-panel p-8">
          <div className="w-12 h-12 bg-cyan-100 rounded-sm flex items-center justify-center mb-6">
            <Code2 className="w-6 h-6 text-cyan-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-3">{isAr ? '1. رفع المشروع' : '1. Upload Project'}</h3>
          <p className="text-zinc-600 leading-relaxed">
            {isAr ? 'المستخدم يرفع ملفًا مضغوطًا ZIP أو يدخل رابط المشروع. نتحقق من صحة الإدخال وحجم الملف لضمان الجاهزية.' : 'Upload a ZIP file or enter a project URL. We validate the input and file size to ensure readiness.'}
          </p>
        </div>

        <div className="tech-panel p-8">
          <div className="w-12 h-12 bg-rose-100 rounded-sm flex items-center justify-center mb-6">
            <Search className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-3">{isAr ? '2. الفك والتحضير' : '2. Extraction & Preparation'}</h3>
          <p className="text-zinc-600 leading-relaxed">
            {isAr ? 'يتم تفكيك الملفات داخل بيئة آمنة وتُفحص البنية العامة للمشروع. ثم نحدد الملفات المهمة كالواجهات والتقارير.' : 'Files are extracted in a secure environment and the project structure is inspected. We identify critical files like UI components and config.'}
          </p>
        </div>

        <div className="tech-panel p-8">
          <div className="w-12 h-12 bg-amber-100 rounded-sm flex items-center justify-center mb-6">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-3">{isAr ? '3. التحليل الشامل' : '3. Comprehensive Analysis'}</h3>
          <p className="text-zinc-600 leading-relaxed">
            {isAr ? 'نشغّل محرك الفحص لتحديد الثغرات وتصنيف المشاكل (حرج، عالي، متوسط) في مجالات الأمان وجودة الكود والبنية.' : 'We run the scanning engine to identify vulnerabilities and categorize issues (Critical, High, Medium) across security, code quality, and architecture.'}
          </p>
        </div>

        <div className="tech-panel p-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-sm flex items-center justify-center mb-6">
            <FileText className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-3">{isAr ? '4. التصدير والأرشفة' : '4. Export & Archiving'}</h3>
          <p className="text-zinc-600 leading-relaxed">
            {isAr ? 'نوفر ملخصاً تنفيذياً قابلاً للتصدير כـ PDF مع اقتراحات الحلول، بالإضافة لحفظ السجل للمقارنة لاحقاً.' : 'We provide an exportable executive summary as a PDF with suggested fixes, and save your scan history for future comparisons.'}
          </p>
        </div>
      </div>

      <div className="tech-panel p-8 md:p-12 text-center border-rose-500/30">
        <h2 className="text-2xl font-bold mb-4">{isAr ? 'ملاحظات هامة حول الأمان (البيتا)' : 'Important Security Notes (Beta)'}</h2>
        <div className={`max-w-2xl mx-auto space-y-4 text-zinc-300 text-sm ${isAr ? 'text-right' : 'text-left'}`}>
          <p>• <strong>{isAr ? 'الخصوصية:' : 'Privacy:'}</strong> {isAr ? 'جميع تحليلات الشفرة المصدرية أثناء فترة البيتا تتم ببيئة مؤقتة ومعزولة.' : 'All source code analysis during the beta period happens in an isolated, temporary environment.'}</p>
          <p>• <strong>{isAr ? 'البيانات:' : 'Data:'}</strong> {isAr ? 'لا نحتفظ بنسخ من كودك بعد انتهاء التقرير. التقارير تُخزن محلياً في متصفحك.' : 'We do not keep copies of your code after the report is generated. Reports are stored locally in your browser.'}</p>
          <p>• <strong>{isAr ? 'التحسين:' : 'Improvement:'}</strong> {isAr ? 'آراؤكم تصقل المنتج النهائي، استخدم أيقونة الرسائل للتواصل المباشر في حال واجهت أي أخطاء.' : 'Your feedback shapes the final product. Use the message icon to communicate directly if you encounter bugs.'}</p>
        </div>
      </div>
    </div>
  );
}
