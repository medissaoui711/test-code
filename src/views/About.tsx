import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Info } from 'lucide-react';

export function About() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="tech-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-sm">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isAr ? 'من نحن' : 'About Us'}
          </h2>
        </div>
        
        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
          <p>
            {isAr 
              ? 'TestPilot هو فريق شغوف ببناء أدوات متقدمة لتسهيل فحص وتطوير التطبيقات. نهدف إلى جعل جودة البرمجيات وأمانها في متناول جميع المطورين عبر تبسيط تعقيدات الفحص والتحليل.'
              : 'TestPilot is a passionate team dedicated to building advanced tools to facilitate application testing and development. We aim to make software quality and security accessible to all developers by simplifying the complexities of scanning and analysis.'}
          </p>
          <p>
            {isAr 
              ? 'رؤيتنا هي أن نصبح المعيار الأساسي للمطورين الذين يبحثون عن الأمان العالي والأداء المتميز في مشاريعهم.'
              : 'Our vision is to become the core standard for developers seeking high security and outstanding performance in their projects.'}
          </p>
        </div>
      </div>
    </div>
  );
}
