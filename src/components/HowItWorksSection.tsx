import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { language, dir } = useLanguage();
  const isAr = language === 'ar';

  const steps = [
    {
      number: '01',
      title: isAr ? 'رفع المشروع أو الربط' : 'Upload or Connect',
      description: isAr 
        ? 'اسحب ملف الـ ZIP الخاص بك أو اربط مستودع GitHub/Drive بلمسة واحدة.'
        : 'Drag & drop your project ZIP or connect a GitHub repository/Google Drive with a single click.',
      icon: (
        <svg className="w-5 h-5 text-[var(--accent-cyber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      number: '02',
      title: isAr ? 'التشريح والفحص الذكي' : 'Dissect & Analyze',
      description: isAr
        ? 'يقوم الخادم بقراءة الملفات، تحليل البنية، وفحص الثغرات الأمنية ولغويات الكود.'
        : 'The server reads the files, analyzes architectural patterns, and scans for vulnerabilities and bugs.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: '03',
      title: isAr ? 'استخراج التقرير التنفيذي' : 'Executive Report',
      description: isAr
        ? 'تحصل فوراً على تقرير مفصل بنسبة جاهزية الكود مع حلول برمجية فورية للإصلاح.'
        : 'Instantly receive a detailed code health score with actionable remediation instructions.',
      icon: (
        <svg className="w-5 h-5 text-[var(--signal-pass)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-4 mb-12">
      {/* عنوان القسم الجانبي الناعم */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        <span className="h-px w-8 bg-[var(--border-grid)]"></span>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] font-mono">
          {isAr ? 'How it works / آلية العمل' : 'How it works'}
        </h3>
        <span className="h-px w-8 bg-[var(--border-grid)]"></span>
      </div>

      {/* حاوية الخطوات الثلاث */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative" dir={dir}>
        
        {/* الخطوط المتحركة الموصلة بين الخطوات (تظهر في الشاشات الكبيرة فقط) */}
        {isAr ? (
          <>
            <div className="hidden md:block absolute top-12 right-[22%] w-[18%] h-0.5 pointer-events-none">
              <svg className="w-full overflow-visible">
                <line 
                  x1="100%" y1="0" x2="0" y2="0" 
                  stroke="var(--border-grid)" strokeWidth="2" 
                />
                <line 
                  x1="100%" y1="0" x2="0" y2="0" 
                  stroke="var(--accent-cyber)" strokeWidth="2" 
                  strokeDasharray="6, 6" 
                  className="animate-flow-line" 
                />
              </svg>
            </div>

            <div className="hidden md:block absolute top-12 right-[61%] w-[18%] h-0.5 pointer-events-none">
              <svg className="w-full overflow-visible">
                <line 
                  x1="100%" y1="0" x2="0" y2="0" 
                  stroke="var(--border-grid)" strokeWidth="2" 
                />
                <line 
                  x1="100%" y1="0" x2="0" y2="0" 
                  stroke="#6366f1" strokeWidth="2" 
                  strokeDasharray="6, 6" 
                  className="animate-flow-line" 
                />
              </svg>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:block absolute top-12 left-[22%] w-[18%] h-0.5 pointer-events-none">
              <svg className="w-full overflow-visible">
                <line 
                  x1="0" y1="0" x2="100%" y2="0" 
                  stroke="var(--border-grid)" strokeWidth="2" 
                />
                <line 
                  x1="0" y1="0" x2="100%" y2="0" 
                  stroke="var(--accent-cyber)" strokeWidth="2" 
                  strokeDasharray="6, 6" 
                  className="animate-flow-line" 
                />
              </svg>
            </div>

            <div className="hidden md:block absolute top-12 left-[61%] w-[18%] h-0.5 pointer-events-none">
              <svg className="w-full overflow-visible">
                <line 
                  x1="0" y1="0" x2="100%" y2="0" 
                  stroke="var(--border-grid)" strokeWidth="2" 
                />
                <line 
                  x1="0" y1="0" x2="100%" y2="0" 
                  stroke="#6366f1" strokeWidth="2" 
                  strokeDasharray="6, 6" 
                  className="animate-flow-line" 
                />
              </svg>
            </div>
          </>
        )}

        {/* رسم كروت الخطوات */}
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center md:items-start text-center md:text-start relative group">
            
            {/* الدائرة العلوية الحاوية على الأيقونة والرقم الترتيبي */}
            <div className="flex items-center justify-center relative mb-4">
              <div className="h-12 w-12 rounded-[var(--radius-sharp)] border border-[var(--border-grid)] bg-[var(--bg-secondary)] flex items-center justify-center group-hover:border-[var(--text-secondary)] transition-colors duration-300">
                {step.icon}
              </div>
              <span className={`absolute -top-2 ${isAr ? '-right-2' : '-left-2'} font-mono text-[10px] font-bold bg-[var(--bg-primary)] border border-[var(--border-grid)] text-[var(--text-muted)] rounded-sm px-1 py-0.5`}>
                {step.number}
              </span>
            </div>

            {/* النصوص العناوين والشرح */}
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 font-sans">
              {step.title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[240px] font-sans">
              {step.description}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};
