import { SEO } from "../components/SEO";
import React, { useState } from 'react';
import { Activity, ArrowRight, CheckCircle2, Search, Zap, Shield, BarChart, Code2 } from 'lucide-react';
import { BetaAccess } from './BetaAccess';
import { Legal } from './Legal';
import { FAQ } from './FAQ';
import { Contact } from './Contact';
import { About } from './About';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onAccessGranted: () => void;
}

export function LandingPage({ onAccessGranted }: LandingPageProps) {
  const [showBetaAccess, setShowBetaAccess] = useState(false);
  const [activePage, setActivePage] = useState<null | 'legal' | 'faq' | 'contact' | 'about'>(null);
  const { language, dir, t } = useLanguage();
  
  const isAr = language === 'ar';

  if (showBetaAccess) {
    return <BetaAccess onAccessGranted={onAccessGranted} />;
          }

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none mix-blend-screen" />
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 cursor-pointer"
            onClick={() => setActivePage(null)}
          >
            <Activity className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white" dir="ltr">{t('nav.brand')}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 tracking-wider">Beta</span>
          </div>

          <button
            onClick={() => setShowBetaAccess(true)}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {isAr ? 'تسجيل الدخول (بيتا)' : 'Login (Beta)'}
          </button>
        </div>

      </nav>

      {activePage === 'legal' && <div className="relative z-10"><Legal /></div>}
      {activePage === 'faq' && <div className="relative z-10"><FAQ /></div>}
      {activePage === 'contact' && <div className="relative z-10"><Contact /></div>}
      {activePage === 'about' && <div className="relative z-10"><About /></div>}

      {activePage === null && (
        <>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
          {isAr ? (
            <>تحليل الكود المدعوم بـ <span className="text-cyan-600 dark:text-cyan-400">الذكاء الاصطناعي</span></>
          ) : (
            <>AI-Powered Code <span className="text-cyan-600 dark:text-cyan-400">Auditing</span></>
          )}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('landing.subtitle')}
        </p>
        <button
          onClick={() => setShowBetaAccess(true)}
          className="inline-flex items-center gap-4 tech-button-primary px-8 py-4 text-base font-bold uppercase tracking-widest"
        >
          {isAr ? 'الحصول على وصول مبكر' : 'Get Early Access'}
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/20 rounded-sm flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t('landing.features.1.title')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('landing.features.1.desc')}</p>
            </div>

            <div className="p-6 rounded-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-sm flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t('landing.features.2.title')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('landing.features.2.desc')}</p>
            </div>

            <div className="p-6 rounded-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-sm flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t('landing.features.3.title')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('landing.features.3.desc')}</p>
            </div>

            <div className="p-6 rounded-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-sm flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t('landing.features.4.title')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('landing.features.4.desc')}</p>
            </div>

          </div>

        </div>

      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{isAr ? 'باقات واضحة وبسيطة' : 'Clear & Simple Pricing'}</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{isAr ? 'اختر الخطة التي تناسب احتياجات مشروعك.' : 'Choose the plan that fits your project needs.'}</p>
        </div>


        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-sm p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{isAr ? 'البداية' : 'Starter'}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{isAr ? 'مثالي للمشاريع الصغيرة والأفراد.' : 'Perfect for small projects and individuals.'}</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-zinc-900 dark:text-white font-mono">{isAr ? 'مجاناً' : 'Free'}</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                {isAr ? 'تصل إلى 10 فحوصات شهرياً' : 'Up to 10 scans per month'}
              </li>
              <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                {isAr ? 'تحليل حزم (ZIP) حتى 50MB' : 'ZIP package analysis up to 50MB'}
              </li>
              <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                {isAr ? 'تصدير PDF مبسط' : 'Simplified PDF export'}
              </li>
            </ul>
            <button
              onClick={() => setShowBetaAccess(true)}
              className="w-full tech-button py-4 text-sm font-bold uppercase tracking-widest"
            >
              {isAr ? 'ابدأ مجاناً' : 'Start for Free'}
            </button>
          </div>


          {/* Pro Plan */}
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-sm p-8 border border-zinc-800 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 -ml-4 -mt-4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <h3 className="text-2xl font-bold text-white mb-2">{isAr ? 'برو (Pro)' : 'Pro'}</h3>
            <p className="text-zinc-400 mb-6">{isAr ? 'للفرق البرمجية والشركات التقنية.' : 'For software teams and tech companies.'}</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white font-mono" dir="ltr">$29</span>
              <span className="text-zinc-400">{isAr ? '/ شهرياً' : '/ month'}</span>
            </div>

            <ul className="space-y-4 mb-8 relative z-10">
              <li className="flex items-center gap-3 text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'فحوصات وتحليل بلا حدود' : 'Unlimited scans and analysis'}
              </li>
              <li className="flex items-center gap-3 text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'تحليل أحجام مشاريع كبيرة (حتى 1GB)' : 'Large project analysis (up to 1GB)'}
              </li>
              <li className="flex items-center gap-3 text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'سجل وتتبع التغييرات الزمني بلا حدود' : 'Unlimited historical tracking'}
              </li>
              <li className="flex items-center gap-3 text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {isAr ? 'تصدير تقارير بصيغ (ZIP, HTML)' : 'Export reports in ZIP, HTML'}
              </li>
            </ul>
            <button
              onClick={() => setShowBetaAccess(true)}
              className="w-full tech-button-primary py-4 text-sm font-bold uppercase tracking-widest relative z-10"
            >
              {isAr ? 'الترقية إلى برو' : 'Upgrade to Pro'}
            </button>
          </div>

        </div>

      </section>
      </>
      )}
      
      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-12 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">{isAr ? '© 2026 TestPilot Beta. جميع الحقوق محفوظة.' : '© 2026 TestPilot Beta. All rights reserved.'}</p>
          <div className="flex gap-4 sm:gap-6 text-sm text-zinc-600">
            <button onClick={() => setActivePage('about')} className="hover:text-zinc-900 transition-colors">
              {isAr ? 'من نحن' : 'About Us'}
            </button>
            <button onClick={() => setActivePage('faq')} className="hover:text-zinc-900 transition-colors">
              {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
            </button>
            <button onClick={() => setActivePage('contact')} className="hover:text-zinc-900 transition-colors">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </button>
            <button onClick={() => setActivePage('legal')} className="hover:text-zinc-900 transition-colors">
              {isAr ? 'شروط الاستخدام' : 'Terms of Use'}
            </button>
          </div>
        </div>
      </footer>
    </div>

    </>
  );
}
