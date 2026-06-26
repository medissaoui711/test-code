export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Security' | 'Architecture' | 'Code Quality' | 'Dependencies';
  file?: string;
  line?: number;
}

export interface OverviewMetrics {
  fileCount: number;
  linesOfCode: number;
  languages: string[];
  projectType: string;
}

export interface ProjectHealth {
  emptyFiles: string[];
  missingFiles: string[];
  duplicateFiles: string[];
  largeFiles: string[];
}

export interface DevelopmentPlan {
  fixNow: string[];
  next: string[];
  later: string[];
}

export interface TestReport {
  id: string;
  url: string; // can be URL or File Name
  date: string;
  scores: {
    security: number;
    architecture: number;
    codeQuality: number;
    dependencies: number;
  };
  overview: OverviewMetrics;
  health: ProjectHealth;
  missingParts: string[];
  plan: DevelopmentPlan;
  issues: Issue[];
}

export async function runScan(target: string): Promise<TestReport> {
  // Simulate network delay, unpacking, and processing time
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Generate a mock report based on the target name
  const isBadTarget = target.includes('bad') || target.includes('error');
  
  if (target === 'error.zip' || target === 'https://error.com') {
    throw new Error('الملف أو الرابط غير صالح. يرجى التأكد من أن الحزمة أو الرابط صحيح وقابل للوصول.');
  }

  const generateScore = (base: number) => isBadTarget ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 30) + 70;

  const scores = {
    security: generateScore(80),
    architecture: generateScore(75),
    codeQuality: generateScore(85),
    dependencies: generateScore(90)
  };

  const issues: Issue[] = [];

  // Mock Security Issues
  if (scores.security < 90) {
    issues.push({
      id: 'sec-1',
      title: 'مفاتيح سرية مكشوفة في الكود',
      description: 'تم العثور على مفاتيح API (API Keys) مكتوبة بشكل مباشر داخل ملفات الكود المصدرية. يجب نقل هذه المفاتيح إلى ملفات البيئة (.env).',
      severity: 'Critical',
      category: 'Security',
      file: 'src/config/api.ts',
      line: 12
    });
  }

  if (scores.security < 70) {
    issues.push({
      id: 'sec-2',
      title: 'ثغرة حقن نصوص (XSS)',
      description: 'يتم عرض مدخلات المستخدم مباشرة في واجهة المستخدم دون تعقيم (Sanitization)، مما قد يسمح بتنفيذ نصوص خبيثة.',
      severity: 'High',
      category: 'Security',
      file: 'src/components/UserInput.tsx',
      line: 45
    });
  }

  // Mock Architecture Issues
  if (scores.architecture < 90) {
    issues.push({
      id: 'arch-1',
      title: 'تداخل في بنية المجلدات',
      description: 'يوجد خلط بين ملفات واجهة المستخدم وملفات منطق الأعمال (Business Logic) في نفس المجلد، مما يصعب الصيانة.',
      severity: 'Medium',
      category: 'Architecture',
      file: 'src/app/main.ts'
    });
  }

  // Mock Code Quality Issues
  if (scores.codeQuality < 85) {
    issues.push({
      id: 'cq-1',
      title: 'تكرار كود برمجي (Code Duplication)',
      description: 'تم العثور على كود مكرر في عدة ملفات للتعامل مع طلبات الشبكة. يفضل إنشاء دالة مساعدة (Helper Function) موحدة.',
      severity: 'Medium',
      category: 'Code Quality',
      file: 'src/api/fetch.ts'
    });
    
    issues.push({
      id: 'cq-2',
      title: 'متغيرات غير مستخدمة',
      description: 'توجد متغيرات تم تعريفها في الكود ولكن لم يتم استخدامها إطلاقاً، مما يزيد من حجم الملفات بلا فائدة.',
      severity: 'Low',
      category: 'Code Quality',
      file: 'src/utils/helpers.ts',
      line: 8
    });
  }

  // Mock Dependencies Issues
  if (scores.dependencies < 95) {
    issues.push({
      id: 'dep-1',
      title: 'مكتبات قديمة تحتوي على ثغرات معروفة',
      description: 'المشروع يستخدم إصدارات قديمة من مكتبة مساعدة تحتوي على ثغرات أمنية مصححة في الإصدارات الأحدث. يرجى تحديث حزمة (package.json).',
      severity: 'High',
      category: 'Dependencies',
      file: 'package.json'
    });
  }

  const overview: OverviewMetrics = {
    fileCount: isBadTarget ? 42 : 128,
    linesOfCode: isBadTarget ? 2450 : 15300,
    languages: ['TypeScript', 'TSX', 'CSS', 'JSON'],
    projectType: 'React Single Page Application',
  };

  const health: ProjectHealth = {
    emptyFiles: isBadTarget ? ['src/utils/math.ts', 'src/components/Card.tsx'] : [],
    missingFiles: ['README.md', '.env.example'],
    duplicateFiles: isBadTarget ? ['src/hooks/useAuth.ts', 'src/lib/auth.ts'] : [],
    largeFiles: ['src/App.tsx (800 lines)'],
  };

  const missingParts = [
    'ملفات الاختبار (Unit Tests)',
    'توثيق المطورين (README.md غير مكتمل)',
    'إعدادات CI/CD للنشر التلقائي',
  ];

  const plan: DevelopmentPlan = {
    fixNow: [
      'الملفات الناقصة، الأخطاء الحرجة، الثغرات عالية الخطورة.',
    ],
    next: [
      'التكرار، الملفات الفارغة، التعقيد العالي، تحسين البنية.',
    ],
    later: [
      'التوثيق، الاختبارات، التحسينات الشكلية، إعادة التنظيم.',
    ]
  };

  return {
    id: Date.now().toString(),
    url: target,
    date: new Date().toISOString(),
    scores,
    overview,
    health,
    missingParts,
    plan,
    issues: issues.sort((a, b) => {
      const severityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return severityWeight[b.severity] - severityWeight[a.severity];
    })
  };
}
