import { SEO } from "../components/SEO";
import React, { useState } from 'react';
import { Activity, ArrowRight, CheckCircle2, Search, Zap, Shield, BarChart, Code2, Terminal, Cpu, AlertTriangle, Layers, Disc, Globe, ChevronRight } from 'lucide-react';
import { BetaAccess } from './BetaAccess';
import { Legal } from './Legal';
import { FAQ } from './FAQ';
import { Contact } from './Contact';
import { About } from './About';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onAccessGranted: () => void;
}

function MockAuditConsole() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const files = [
    { name: "auth.ts", language: "typescript" },
    { name: "db.config.ts", language: "typescript" },
    { name: "server.js", language: "javascript" }
  ];

  const [activeFile, setActiveFile] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [issues, setIssues] = useState<any[]>([]);

  const handleScan = () => {
    setScanStatus('scanning');
    setIssues([]);
    setTimeout(() => {
      setScanStatus('done');
      setIssues([
        { id: 1, type: 'critical', msg: isAr ? 'تسريب مفتاح API سري في السطر 06' : 'Hardcoded API Secret in line 06' },
        { id: 2, type: 'warning', msg: isAr ? 'رابط قاعدة بيانات غير آمن' : 'Unencrypted Database connection' }
      ]);
    }, 1800);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-200 font-mono text-xs rounded-sm shadow-2xl overflow-hidden text-start">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500/80 rounded-none border border-rose-600" />
          <span className="w-2.5 h-2.5 bg-amber-500/80 rounded-none border border-amber-600" />
          <span className="w-2.5 h-2.5 bg-emerald-500/80 rounded-none border border-emerald-600" />
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider ml-2">sandbox://testpilot-analyzer</span>
        </div>
        <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>v1.0.4</span>
        </div>
      </div>

      {/* Workspace Split */}
      <div className="grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800 h-64">
        {/* Left: Files Panel */}
        <div className="p-3 space-y-1.5 col-span-1 bg-zinc-950">
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2 border-b border-zinc-800 pb-1">
            {isAr ? 'الملفات المتاحة' : 'Project Files'}
          </div>
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => {
                setActiveFile(idx);
                if (scanStatus === 'done') {
                  setScanStatus('idle');
                  setIssues([]);
                }
              }}
              className={`w-full flex items-center gap-1.5 px-2 py-1 text-[11px] rounded-[var(--radius-sharp)] transition-colors text-start ${
                activeFile === idx ? 'bg-zinc-800 text-cyan-400 font-semibold' : 'text-zinc-400 hover:bg-zinc-900/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
          <div className="pt-4">
            <button
              onClick={handleScan}
              disabled={scanStatus === 'scanning'}
              className="w-full py-1.5 px-2 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/80 text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded-[var(--radius-sharp)] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {scanStatus === 'scanning' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{isAr ? 'تحليل...' : 'Auditing...'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  <span>{isAr ? 'فحص الكود' : 'Audit'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Code Viewer & Output */}
        <div className="col-span-2 flex flex-col justify-between bg-zinc-900/20 relative">
          {/* Scanline overlay for active scan */}
          {scanStatus === 'scanning' && (
            <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none overflow-hidden z-20">
              <div className="w-full h-0.5 bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-scanline" />
            </div>
          )}

          <div className="p-4 overflow-y-auto flex-1 font-mono leading-relaxed text-[11px] text-zinc-400 select-none">
            {activeFile === 0 && (
              <pre className="text-start">
                <div><span className="text-zinc-600">01</span> <span className="text-rose-400">import</span> &#123; db &#125; <span className="text-rose-400">from</span> <span className="text-emerald-400">"./db"</span>;</div>
                <div><span className="text-zinc-600">02</span> </div>
                <div><span className="text-zinc-600">03</span> <span className="text-rose-400">export async function</span> <span className="text-cyan-400">login</span>(req, res) &#123;</div>
                <div><span className="text-zinc-600">04</span>   <span className="text-rose-400">const</span> token = req.headers.auth;</div>
                <div><span className="text-zinc-600">05</span>   <span className="text-zinc-500">// Check keys</span></div>
                <div><span className="text-zinc-600">06</span>   <span className="text-rose-400">const</span> secret = <span className="text-emerald-400 bg-rose-950/40 border-b border-rose-500/50 font-semibold px-1 text-rose-300">"sk_live_9a2f1b80d7c3"</span>;</div>
                <div><span className="text-zinc-600">07</span>   <span className="text-rose-400">return</span> db.verify(token, secret);</div>
                <div><span className="text-zinc-600">08</span> &#125;</div>
              </pre>
            )}
            {activeFile === 1 && (
              <pre className="text-start">
                <div><span className="text-zinc-600">01</span> <span className="text-rose-400">const</span> dbConfig = &#123;</div>
                <div><span className="text-zinc-600">02</span>   host: <span className="text-emerald-400 bg-amber-950/40 border-b border-amber-500/50 px-1 text-amber-300">"http://12.0.4.1/unsafe-db"</span>,</div>
                <div><span className="text-zinc-600">03</span>   port: 5432,</div>
                <div><span className="text-zinc-600">04</span>   ssl: <span className="text-amber-400">false</span></div>
                <div><span className="text-zinc-600">05</span> &#125;;</div>
              </pre>
            )}
            {activeFile === 2 && (
              <pre className="text-start">
                <div><span className="text-zinc-600">01</span> <span className="text-rose-400">const</span> express = require(<span className="text-emerald-400">"express"</span>);</div>
                <div><span className="text-zinc-600">02</span> <span className="text-rose-400">const</span> app = express();</div>
                <div><span className="text-zinc-600">03</span> </div>
                <div><span className="text-zinc-600">04</span> app.get(<span className="text-emerald-400">"/api"</span>, (req, res) =&gt; &#123;</div>
                <div><span className="text-zinc-600">05</span>   res.send(<span className="text-emerald-400">"STABLE"</span>);</div>
                <div><span className="text-zinc-600">06</span> &#125;);</div>
              </pre>
            )}
          </div>

          {/* Issue Log Panel */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-950/90 min-h-[75px] flex flex-col justify-center">
            {scanStatus === 'idle' && (
              <p className="text-[10px] text-zinc-500 italic text-center">
                {isAr ? 'اضغط على "فحص الكود" للتحقق من ثغرات الملف النشط.' : 'Click "Audit" to run the dynamic scanner.'}
              </p>
            )}
            {scanStatus === 'scanning' && (
              <div className="space-y-1">
                <p className="text-[10px] text-cyan-400 font-bold animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  {isAr ? 'جاري تحليل الأنماط والتحقق من التوقيعات...' : 'Parsing syntax trees & validating parameters...'}
                </p>
                <div className="w-full bg-zinc-850 h-1 overflow-hidden">
                  <div className="h-full bg-cyan-400 animate-[pulse_1s_infinite] w-2/3" />
                </div>
              </div>
            )}
            {scanStatus === 'done' && (
              <div className="space-y-1.5">
                {issues.map(issue => (
                  <div key={issue.id} className="flex items-start gap-2 text-[10px]">
                    {issue.type === 'critical' ? (
                      <span className="text-rose-400 border border-rose-500/30 bg-rose-500/10 px-1 py-0.2 rounded-[var(--radius-sharp)] font-bold shrink-0 uppercase">CRIT</span>
                    ) : (
                      <span className="text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1 py-0.2 rounded-[var(--radius-sharp)] font-bold shrink-0 uppercase">WARN</span>
                    )}
                    <span className="text-zinc-300 truncate">{issue.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onAccessGranted }: LandingPageProps) {
  const [activePage, setActivePage] = useState<null | 'legal' | 'faq' | 'contact' | 'about'>(null);
  const { language, dir, t } = useLanguage();
  
  const isAr = language === 'ar';

  const handleDirectAccess = () => {
    localStorage.setItem('testpilot_beta_access', 'granted');
    onAccessGranted();
  };

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans relative overflow-hidden" dir={dir}>
        {/* Subtly animated cybernetic grid background to set a futuristic vibe without being overdesigned */}
        <div className="absolute inset-0 cyber-grid-bg opacity-[0.06] dark:opacity-[0.2] pointer-events-none" />

        {/* Tactical Ambient Glow Effects */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-cyan-500/10 rounded-none blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-emerald-500/5 rounded-none blur-3xl pointer-events-none" />

        {/* Navigation */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-2.5 text-zinc-900 dark:text-white cursor-pointer select-none group"
              onClick={() => setActivePage(null)}
            >
              <div className="p-1.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group-hover:border-cyan-500/50 transition-colors rounded-[var(--radius-sharp)]">
                <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white" dir="ltr">
                  {t('nav.brand')}
                </span>
                <span className="text-[9px] text-zinc-400 font-mono tracking-wider mt-0.5 uppercase">SYSTEMS.UNIT</span>
              </div>
              <span className="px-1.5 py-0.5 border border-cyan-500/30 text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 rounded-[var(--radius-sharp)] tracking-widest uppercase">
                Beta
              </span>
            </div>

            <button
              onClick={handleDirectAccess}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-[var(--radius-sharp)] transition-all hover:border-zinc-900 dark:hover:border-zinc-50 active:scale-95 cursor-pointer"
            >
              {isAr ? 'دخول لوحة التحكم' : 'Enter Dashboard'}
            </button>
          </div>
        </nav>

        {activePage === 'legal' && <div className="relative z-10"><Legal /></div>}
        {activePage === 'faq' && <div className="relative z-10"><FAQ /></div>}
        {activePage === 'contact' && <div className="relative z-10"><Contact /></div>}
        {activePage === 'about' && <div className="relative z-10"><About /></div>}

        {activePage === null && (
          <>
            {/* Split/Asymmetric Hero Section */}
            <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Content Column */}
                <div className="lg:col-span-7 text-start space-y-6">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400 font-mono text-[10px] tracking-widest uppercase rounded-[var(--radius-sharp)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <span>{isAr ? 'بيئة آمنة للمطورين' : 'DEVELOPER SECURITY SUITE'}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.1]">
                    {isAr ? (
                      <>تحليل الكود المدعوم بـ <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-400 dark:from-cyan-400 dark:via-cyan-300 dark:to-emerald-300">الذكاء الاصطناعي</span></>
                    ) : (
                      <>AI-Powered Code <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-400 dark:from-cyan-400 dark:via-cyan-300 dark:to-emerald-300">Auditing Platform</span></>
                    )}
                  </h1>

                  <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                    {t('landing.subtitle')}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button
                      onClick={handleDirectAccess}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 tech-button-primary px-8 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer group"
                    >
                      <span>{isAr ? 'دخول فوري لوحة التحكم' : 'Instant Dashboard Access'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono px-1">
                      <span>[V_1.0.4]</span>
                      <span>•</span>
                      <span>{isAr ? 'متاح كبيتا مجانية للمطورين' : 'Beta open for devs'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Column - Simulated Terminal Scanner */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-cyan-400/10 dark:bg-cyan-400/5 blur-3xl pointer-events-none rounded-none" />
                  <div className="relative z-10">
                    <MockAuditConsole />
                  </div>
                </div>

              </div>
            </section>

            {/* Features System Grid */}
            <section className="py-16 bg-zinc-100/50 dark:bg-zinc-950/40 border-y border-zinc-200 dark:border-zinc-800 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-1.5 block">
                      [ {isAr ? 'مواصفات النظام' : 'SYSTEM_SPECIFICATIONS'} ]
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {isAr ? 'تحليل متقدم مدمج في أسلوب عملك' : 'Comprehensive Auditing Engine'}
                    </h2>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono border-l border-zinc-300 dark:border-zinc-800 pl-4">
                    {isAr ? 'التحليل الاستاتيكي • حظر الأخطاء • الأمان' : 'STATIC ANALYSIS • CREDENTIAL HARVEST PREVENTION • ENCRYPTED PIPELINE'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="group p-6 rounded-none bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all text-start relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-none">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest">
                          [SYS.01]
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {t('landing.features.1.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t('landing.features.1.desc')}
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="group p-6 rounded-none bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all text-start relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-none">
                          <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest">
                          [SYS.02]
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {t('landing.features.2.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t('landing.features.2.desc')}
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="group p-6 rounded-none bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all text-start relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-none">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest">
                          [SYS.03]
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {t('landing.features.3.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t('landing.features.3.desc')}
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="group p-6 rounded-none bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all text-start relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-none">
                          <BarChart className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-widest">
                          [SYS.04]
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {t('landing.features.4.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t('landing.features.4.desc')}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16 space-y-2">
                <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 tracking-widest uppercase block">
                  [ {isAr ? 'خطط الميزانية' : 'BUDGET_TIERS'} ]
                </span>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {isAr ? 'باقات واضحة ومباشرة' : 'Clear & Simple Pricing'}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  {isAr ? 'اختر الخطة التي تناسب حجم مشروعاتك ومتطلبات فريقك.' : 'Choose the plan that fits your project scope and workflow.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Starter Plan */}
                <div className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-none p-8 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between text-start relative group">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                          {isAr ? 'البداية' : 'Starter'}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {isAr ? 'مثالي للمشاريع الصغيرة والأفراد.' : 'Perfect for small projects & solo-developers.'}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">[ Tier_01 ]</span>
                    </div>

                    <div className="mb-8 flex items-baseline">
                      <span className="text-5xl font-bold text-zinc-900 dark:text-white font-mono tracking-tight">
                        {isAr ? 'مجاناً' : 'Free'}
                      </span>
                    </div>

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>{isAr ? 'تصل إلى 10 فحوصات شهرياً' : 'Up to 10 scans per month'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>{isAr ? 'تحليل حزم (ZIP) حتى 50MB' : 'ZIP package analysis up to 50MB'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>{isAr ? 'تصدير PDF مبسط' : 'Simplified PDF export'}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleDirectAccess}
                    className="w-full tech-button py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer mt-4"
                  >
                    {isAr ? 'ابدأ مجاناً' : 'Start for Free'}
                  </button>
                </div>

                {/* Pro Plan (Glowing Dark Accent Panel) */}
                <div className="bg-zinc-900 dark:bg-zinc-950 rounded-none p-8 border border-zinc-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between text-start relative overflow-hidden group shadow-lg">
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white">
                            {isAr ? 'برو (Pro)' : 'Pro'}
                          </h3>
                          <span className="px-1.5 py-0.2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-bold tracking-widest uppercase rounded-sm">
                            {isAr ? 'موصى به' : 'POPULAR'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          {isAr ? 'للفرق البرمجية والشركات التقنية.' : 'For software teams and tech companies.'}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-zinc-600">[ Tier_02 ]</span>
                    </div>

                    <div className="mb-8 flex items-baseline gap-1.5">
                      <span className="text-5xl font-bold text-white font-mono tracking-tight" dir="ltr">$29</span>
                      <span className="text-zinc-400 text-xs font-mono">{isAr ? '/ شهرياً' : '/ month'}</span>
                    </div>

                    <div className="h-px bg-zinc-850 mb-6" />

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isAr ? 'فحوصات وتحليل بلا حدود' : 'Unlimited scans and analysis'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isAr ? 'تحليل أحجام مشاريع كبيرة (حتى 1GB)' : 'Large project analysis (up to 1GB)'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isAr ? 'سجل وتتبع التغييرات الزمني بلا حدود' : 'Unlimited historical tracking'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isAr ? 'تصدير تقارير بصيغ (ZIP, HTML)' : 'Export reports in ZIP, HTML'}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleDirectAccess}
                    className="w-full tech-button-primary py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer mt-4"
                  >
                    {isAr ? 'الترقية إلى برو' : 'Upgrade to Pro'}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Footer */}
        <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/80 animate-pulse" />
              <span>{isAr ? '© 2026 بيتا تيسيت بايلوت. جميع الحقوق محفوظة.' : '© 2026 TestPilot Beta. All rights reserved.'}</span>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono justify-center">
              <button 
                onClick={() => setActivePage('about')} 
                className={`hover:text-cyan-500 transition-colors cursor-pointer ${activePage === 'about' ? 'text-cyan-500 font-bold' : ''}`}
              >
                {isAr ? '[ من نحن ]' : '[ About Us ]'}
              </button>
              <button 
                onClick={() => setActivePage('faq')} 
                className={`hover:text-cyan-500 transition-colors cursor-pointer ${activePage === 'faq' ? 'text-cyan-500 font-bold' : ''}`}
              >
                {isAr ? '[ الأسئلة الشائعة ]' : '[ FAQ ]'}
              </button>
              <button 
                onClick={() => setActivePage('contact')} 
                className={`hover:text-cyan-500 transition-colors cursor-pointer ${activePage === 'contact' ? 'text-cyan-500 font-bold' : ''}`}
              >
                {isAr ? '[ تواصل معنا ]' : '[ Contact Us ]'}
              </button>
              <button 
                onClick={() => setActivePage('legal')} 
                className={`hover:text-cyan-500 transition-colors cursor-pointer ${activePage === 'legal' ? 'text-cyan-500 font-bold' : ''}`}
              >
                {isAr ? '[ الشروط القانونية ]' : '[ Legal Terms ]'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
