import React, { useState } from 'react';
import { Activity, ArrowRight, CheckCircle2, Search, Zap, Shield, BarChart, Code2 } from 'lucide-react';
import { BetaAccess } from './BetaAccess';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onAccessGranted: () => void;
}

export function LandingPage({ onAccessGranted }: LandingPageProps) {
  const [showBetaAccess, setShowBetaAccess] = useState(false);
  const { language, dir, t } = useLanguage();
  
  const isAr = language === 'ar';

  if (showBetaAccess) {
    return <BetaAccess onAccessGranted={onAccessGranted} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none mix-blend-screen" />
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white" dir="ltr">{t('nav.brand')}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 tracking-wider">Beta</span>
          </div>
          <button
            onClick={() => setShowBetaAccess(true)}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isAr ? 'تسجيل الدخول (بيتا)' : 'Login (Beta)'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
          {isAr ? (
            <>تحليل جودة الأكواد المولدة<br />بالذكاء الاصطناعي.</>
          ) : (
            <>Code Quality Analysis<br />for AI-Generated Projects.</>
          )}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('landing.subtitle')}
        </p>
        <button
          onClick={() => setShowBetaAccess(true)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-medium text-lg hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
        >
          {isAr ? 'الحصول على وصول مبكر' : 'Get Early Access'}
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.features.1.title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('landing.features.1.desc')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.features.2.title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('landing.features.2.desc')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.features.3.title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('landing.features.3.desc')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.features.4.title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('landing.features.4.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{isAr ? 'باقات واضحة وبسيطة' : 'Clear & Simple Pricing'}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{isAr ? 'اختر الخطة التي تناسب احتياجات مشروعك.' : 'Choose the plan that fits your project needs.'}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'البداية' : 'Starter'}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{isAr ? 'مثالي للمشاريع الصغيرة والأفراد.' : 'Perfect for small projects and individuals.'}</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-slate-900 dark:text-white font-mono">{isAr ? 'مجاناً' : 'Free'}</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                {isAr ? 'تصل إلى 10 فحوصات شهرياً' : 'Up to 10 scans per month'}
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                {isAr ? 'تحليل حزم (ZIP) حتى 50MB' : 'ZIP package analysis up to 50MB'}
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                {isAr ? 'تصدير PDF مبسط' : 'Simplified PDF export'}
              </li>
            </ul>
            <button
              onClick={() => setShowBetaAccess(true)}
              className="w-full py-3 px-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-colors"
            >
              {isAr ? 'ابدأ مجاناً' : 'Start for Free'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 -ml-4 -mt-4 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <h3 className="text-2xl font-bold text-white mb-2">{isAr ? 'برو (Pro)' : 'Pro'}</h3>
            <p className="text-slate-400 mb-6">{isAr ? 'للفرق البرمجية والشركات التقنية.' : 'For software teams and tech companies.'}</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white font-mono" dir="ltr">$29</span>
              <span className="text-slate-400">{isAr ? '/ شهرياً' : '/ month'}</span>
            </div>
            <ul className="space-y-4 mb-8 relative z-10">
              <li className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'فحوصات وتحليل بلا حدود' : 'Unlimited scans and analysis'}
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'تحليل أحجام مشاريع كبيرة (حتى 1GB)' : 'Large project analysis (up to 1GB)'}
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'سجل وتتبع التغييرات الزمني بلا حدود' : 'Unlimited historical tracking'}
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'تصدير تقارير بصيغ (ZIP, HTML)' : 'Export reports in ZIP, HTML'}
              </li>
            </ul>
            <button
              onClick={() => setShowBetaAccess(true)}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors relative z-10 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              {isAr ? 'الترقية إلى برو' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center">
        <p className="text-slate-500">{isAr ? '© 2026 TestPilot Beta. جميع الحقوق محفوظة.' : '© 2026 TestPilot Beta. All rights reserved.'}</p>
      </footer>
    </div>
  );
}
