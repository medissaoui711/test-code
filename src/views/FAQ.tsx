import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  BookOpen,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'general' | 'security' | 'technical';
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  codeExample?: {
    lang: string;
    before: string;
    after: string;
  };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    questionAr: 'ما هي منصة TestPilot وكيف تعمل؟',
    questionEn: 'What is TestPilot and how does it work?',
    answerAr: 'منصة TestPilot هي أداة متقدمة مدعومة بالذكاء الاصطناعي مخصصة لمراجعة وتدقيق الشيفرة البرمجية (Code Auditing)، واكتشاف الثغرات الأمنية، وتحسين الأداء البرمجي. تقوم المنصة بتحليل الكود بشكل عميق وتقديم تقارير تفصيلية فورية مع حلول مقترحة لإعادة الهيكلة وتفادي الأخطاء البرمجية الشائعة.',
    answerEn: 'TestPilot is an advanced AI-powered platform designed for automated code auditing, vulnerability detection, and performance optimization. It performs deep static and semantic analysis of your files, delivering instant detailed reports alongside suggested refactoring solutions to prevent common bugs.'
  },
  {
    id: '2',
    category: 'general',
    questionAr: 'ما هي لغات البرمجة والبيئات التي تدعمها المنصة؟',
    questionEn: 'Which programming languages and environments are supported?',
    answerAr: 'تدعم المنصة مجموعة واسعة من اللغات والبيئات الأكثر شيوعاً في الصناعة البرمجية، بما في ذلك JavaScript, TypeScript, Python, Go, Rust, Java, C++, PHP والمزيد. بالإضافة إلى ذلك، نقوم بتدقيق ملفات التكوين (Configuration files) وملفات البنية التحتية كبرمجية (Infrastructure as Code - IaC).',
    answerEn: 'The platform supports a wide array of the most popular programming languages, including JavaScript, TypeScript, Python, Go, Rust, Java, C++, PHP, and more. Additionally, we audit configuration files and Infrastructure-as-Code (IaC) templates for optimal setup.'
  },
  {
    id: '3',
    category: 'security',
    questionAr: 'كيف تضمن منصة TestPilot خصوصية وأمان الشيفرة البرمجية الخاصة بي؟',
    questionEn: 'How does TestPilot ensure the security and privacy of my source code?',
    answerAr: 'الأمان وحفظ الخصوصية هما حجر الأساس في منصتنا. نحن لا نقوم بتخزين الكود الخاص بك بشكل دائم على خوادمنا أبداً. يتم معالجة وفحص الكود بشكل آمن في الذاكرة أثناء جلسة التحليل التفاعلية فقط، وتُحذف جميع البيانات وملفات الإدخال فور انتهاء العملية. كما يتم تشفير جميع الاتصالات بالكامل باستخدام بروتوكولات SSL/TLS القياسية.',
    answerEn: 'Security and privacy are our foundational principles. We never store your source code permanently. Code is processed securely in-memory during the active analysis session, and all transient files are completely purged from our workspace once the audit is complete. All network communication is fully encrypted using enterprise-grade SSL/TLS protocols.'
  },
  {
    id: '4',
    category: 'security',
    questionAr: 'هل يمكن لـ TestPilot اكتشاف الثغرات الأمنية المتقدمة مثل تصنيفات OWASP؟',
    questionEn: 'Can TestPilot detect advanced security vulnerabilities like OWASP risks?',
    answerAr: 'نعم، تم تدريب محرك الفحص ونماذج الذكاء الاصطناعي لدينا على قواعد قواعد بيانات الثغرات الشاملة وأشهر أنماط التهديد البرمجي بما في ذلك قائمة OWASP لأخطر ثغرات تطبيقات الويب (OWASP Top 10)، مثل حقن الاستعلامات (SQL Injection)، وتسريب البيانات، وإداراة الجلسات الضعيفة، واستعمال مكتبات غير آمنة.',
    answerEn: 'Yes, our scanning engine and specialized AI models are trained on comprehensive vulnerability databases and security patterns. We accurately detect OWASP Top 10 vulnerabilities, including SQL injection, cross-site scripting (XSS), weak session handling, credentials leakage, and deprecated or compromised package dependencies.',
    codeExample: {
      lang: 'typescript',
      before: '// ❌ Unsafe Code (Hardcoded credentials)\nconst apiKey = "sk_live_9a2f1b80d7c3";',
      after: '//  Safe Code (Using environment variables)\nconst apiKey = process.env.STRIPE_SECRET_KEY;'
    }
  },
  {
    id: '5',
    category: 'technical',
    questionAr: 'هل تتكامل المنصة مع خطوط الإنتاج والرفع التلقائي (CI/CD)؟',
    questionEn: 'Does the platform integrate with CI/CD deployment pipelines?',
    answerAr: 'نعم، كجزء من الميزات الاحترافية لخطط المطورين والشركات، نوفر وصولاً لواجهات برمجة التطبيقات (API keys) للتكامل المباشر مع أدوات التطوير الشهيرة مثل GitHub Actions, GitLab CI, و Bitbucket Pipelines، مما يسمح بإجراء الفحص البرمجي تلقائياً عند كل سحب كود (Pull Request).',
    answerEn: 'Yes, our platform is designed to fit right into your workflow. For developers and teams, we offer API keys and native plugins for continuous integration setups such as GitHub Actions, GitLab CI, and Bitbucket Pipelines. You can configure automatic security audits for every commit or pull request.'
  },
  {
    id: '6',
    category: 'technical',
    questionAr: 'ما هي المعايير والنسب التي يعتمد عليها تقييم جودة الكود؟',
    questionEn: 'What are the main metrics used to evaluate code quality?',
    answerAr: 'يعتمد الفحص على 4 معايير رئيسية: (1) الأمان: خلو الكود تماماً من الثغرات، (2) الأداء والسرعة: كفاءة استهلاك الذاكرة والعمليات، (3) قابلية الصيانة: سهولة التعديل والتمديد مستقبلاً، و (4) التوافقية: اتباع الممارسات المثالية وتنسيقات اللغة القياسية.',
    answerEn: 'The audit evaluates 4 core pillars: (1) Security (zero vulnerabilities detected), (2) Performance (optimal resource and execution speed), (3) Maintainability (readability, modularity, and clean styling), and (4) Standards Compatibility (compliance with language-specific conventions).'
  },
  {
    id: '7',
    category: 'general',
    questionAr: 'هل تقدم المنصة نصائح وحلول برمجية فورية أم تكتفي بالإشارة إلى الأخطاء؟',
    questionEn: 'Does the platform provide immediate code fixes or just flag the issues?',
    answerAr: 'المنصة لا تكتفي بوضع علامات على الأخطاء والتحذيرات؛ بل تقدم مقترحات برمجية تفصيلية وحلولاً مُعاداً هيكلتها بالكامل (Clean Refactored Code). يمكنك نسخ التعديلات الفورية وتطبيقها مباشرة في مشروعك لرفع الأمان والجودة بشكل لحظي.',
    answerEn: 'TestPilot goes beyond merely flagging bugs. It provides intelligent, actionable code suggestions and fully refactored snippets for each detected issue. You can instantly copy and paste these secure implementations directly into your IDE.'
  }
];

export function FAQ() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'security' | 'technical'>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    '1': true // Expand first item by default for great initial UX
  });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCategoryChange = (category: 'all' | 'general' | 'security' | 'technical') => {
    setSelectedCategory(category);
  };

  const filteredFAQ = useMemo(() => {
    return FAQ_DATA.filter(item => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const question = (isAr ? item.questionAr : item.questionEn).toLowerCase();
      const answer = (isAr ? item.answerAr : item.answerEn).toLowerCase();
      const matchesSearch = question.includes(searchLower) || answer.includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, isAr]);

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: BookOpen },
    { id: 'general', labelAr: 'المنصة والتشغيل', labelEn: 'Platform & Use', icon: Terminal },
    { id: 'security', labelAr: 'أمان البيانات', labelEn: 'Security & Privacy', icon: ShieldCheck },
    { id: 'technical', labelAr: 'المزايا التقنية', labelEn: 'Technical Integration', icon: Cpu },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      {/* Header & Title */}
      <div className="text-center mb-10 space-y-3">
        <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 tracking-widest uppercase block">
          [ {isAr ? 'مركز المعرفة ومساعدة المطورين' : 'DEVELOPER_KNOWLEDGE_CENTER'} ]
        </span>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="w-7 h-7 text-cyan-500" />
          {isAr ? 'الأسئلة الشائعة والاستفسارات' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          {isAr 
            ? 'كل ما تود معرفته عن منصة فحص الشيفرة وأمان البيانات والمزايا التقنية لـ TestPilot.' 
            : 'Everything you need to know about code auditing, compliance, data protection, and enterprise integrations.'}
        </p>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-4 mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن إجابة (مثال: أمان، لغات، تكامل)...' : 'Search for questions or topics (e.g., security, languages, API)...'}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-none text-zinc-800 dark:text-zinc-200 text-sm placeholder-zinc-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <span className="text-xs font-mono">[ {isAr ? 'مسح' : 'Clear'} ]</span>
            </button>
          )}
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-zinc-200 dark:border-zinc-800/80">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider border rounded-none transition-all active:scale-95 cursor-pointer ${
                  isActive 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-bold' 
                    : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4 min-h-[150px]">
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((item, index) => {
            const isExpanded = !!expandedItems[item.id];
            return (
              <div 
                key={item.id}
                className={`border transition-all duration-200 ${
                  isExpanded 
                    ? 'border-cyan-500/50 bg-zinc-50 dark:bg-cyan-500/[0.02]' 
                    : 'border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/20 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* FAQ Question Header */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-start gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 shrink-0">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                    <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                      isExpanded ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-800 dark:text-zinc-200'
                    }`}>
                      {isAr ? item.questionAr : item.questionEn}
                    </h3>
                  </div>
                  <div className="shrink-0 text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-500" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* FAQ Answer Body */}
                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-4 border-t border-dashed border-zinc-200 dark:border-zinc-800/80">
                    <p>{isAr ? item.answerAr : item.answerEn}</p>
                    
                    {/* Optional Beautiful Interactive Code Snippet comparison */}
                    {item.codeExample && (
                      <div className="bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-none overflow-hidden font-mono text-[11px] mt-3">
                        <div className="bg-zinc-900 px-3 py-1.5 border-b border-zinc-800 text-zinc-400 flex items-center justify-between">
                          <span>[CODE_RESOLUTION_AUDIT]</span>
                          <span className="text-[10px] uppercase text-zinc-600">{item.codeExample.lang}</span>
                        </div>
                        <div className="p-3.5 space-y-3 text-start">
                          <div className="text-rose-400 bg-rose-950/20 p-2 border-l border-rose-500">
                            <pre className="whitespace-pre-wrap">{item.codeExample.before}</pre>
                          </div>
                          <div className="text-emerald-400 bg-emerald-950/20 p-2 border-l border-emerald-500">
                            <pre className="whitespace-pre-wrap">{item.codeExample.after}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge Indicator */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        <span>CATEGORY:</span>
                        <span className="text-zinc-600 dark:text-zinc-300 uppercase">
                          {isAr ? (item.category === 'general' ? 'عام' : item.category === 'security' ? 'أمان' : 'ميزة تقنية') : item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400/80">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isAr ? 'تم التحقق من الدقة' : 'Verified Accurate'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty Search Results State */
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">
            <Filter className="w-8 h-8 text-zinc-400 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              {isAr ? 'لا توجد نتائج مطابقة لطلبك' : 'No matching questions found'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {isAr 
                ? 'جرب استخدام كلمات مفتاحية أخرى أو تصفح الأقسام مباشرة.' 
                : 'Try adjusting your search keywords or choosing a different category.'}
            </p>
          </div>
        )}
      </div>

      {/* Support CTA Callout */}
      <div className="mt-12 p-6 bg-zinc-100/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-start space-y-1">
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            {isAr ? 'ما زال لديك استفسار برمجى أو أمني؟' : 'Still have a specific question?'}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isAr 
              ? 'فريق المهندسين والخبراء الأمنيّين لدينا جاهز للرد على تساؤلاتك الدقيقة.' 
              : 'Our engineering and security response teams are standing by to provide in-depth support.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400 hidden lg:inline">[SEC_CHANNEL_OPEN]</span>
          <button 
            onClick={() => {
              // Smooth scroll or set tab to contact
              // Dispatch click to contact tab/footer link 
              const contactBtn = document.querySelector('footer button:nth-child(3)') as HTMLButtonElement;
              if (contactBtn) contactBtn.click();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-wider rounded-none transition-all active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'اتصل بنا' : 'Contact Support'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
