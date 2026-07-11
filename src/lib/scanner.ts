import { simulateNetworkRequest } from './api';

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Info';
  category: 'Security' | 'Architecture' | 'Code Quality' | 'Dependencies' | 'Accessibility/UX';
  file?: string;
  line?: number;
  impact?: string;
  remediation?: string;
  proLogs?: {
    snippet: string;
    payload: string;
  };
  learnHub?: {
    problem: string;
    impact: string;
    solution: string;
  };
}

export interface OverviewMetrics {
  fileCount: number;
  linesOfCode: number;
  languages: string[];
  projectType: string;
  functionsCount: number;
  vulnerabilityCount: number;
  performanceScore: number;
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
    accessibility: number;
  };
  overview: OverviewMetrics;
  health: ProjectHealth;
  missingParts: string[];
  plan: DevelopmentPlan;
  issues: Issue[];
  assumptions: string[];
  runReadyVerdict: 'Runnable' | 'Not Runnable' | 'Conditional';
  rawText?: string;
}

export interface FileData {
  path: string;
  content: string;
}

export async function runScan(
  target: string, 
  files: FileData[] = [], 
  metrics?: { fileCount: number, linesOfCode: number }
): Promise<TestReport> {
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, files, metrics }),
    });

    if (response.ok) {
      const report = await response.json();
      return {
        ...report,
        id: Date.now().toString(),
        url: target,
        date: new Date().toISOString(),
      };
    } else {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to analyze code.");
    }
  } catch (e: any) {
    console.warn('Real analysis failed:', e);
    throw e;
  }


  // Fallback Professional Mock (Dynamic based on target name)
  await simulateNetworkRequest(null, 5000);
  
  const isBadTarget = target.toLowerCase().includes('vulnerable') || target.toLowerCase().includes('bad') || target.toLowerCase().includes('test');
  
  const scores = {
    security: isBadTarget ? 42 : 91,
    architecture: isBadTarget ? 55 : 89,
    codeQuality: isBadTarget ? 64 : 93,
    dependencies: isBadTarget ? 40 : 95,
    accessibility: isBadTarget ? 50 : 92
  };

  const issues: Issue[] = [];
  if (isBadTarget) {
    issues.push({
      id: 'GEN-01',
      title: 'Security Vulnerability Detected',
      description: 'The scan detected potential security flaws based on project structure patterns.',
      severity: 'Major',
      category: 'Security',
      impact: 'High probability of unauthorized system interaction.',
      remediation: 'Implement strict environment variable management and audit all third-party integrations.',
      proLogs: {
        snippet: 'process.env.SECRET_KEY || "default_unsafe_key"',
        payload: 'Exposed fallback secret key'
      },
      learnHub: {
        problem: 'Hardcoding or providing unsafe fallback values for secrets',
        impact: 'Attackers can exploit known default keys to breach the system.',
        solution: 'Use a robust secrets manager and fail fast if keys are missing in production.'
      }
    });
  }

  return {
    id: Date.now().toString(),
    url: target,
    date: new Date().toISOString(),
    scores,
    overview: {
      fileCount: files.length || (isBadTarget ? 42 : 128),
      linesOfCode: isBadTarget ? 2450 : 15300,
      languages: ['TypeScript', 'TSX', 'CSS', 'JSON'],
      projectType: 'React Application',
      functionsCount: isBadTarget ? 156 : 482,
      vulnerabilityCount: issues.length,
      performanceScore: isBadTarget ? 68 : 92,
    },
    health: {
      largeFiles: [],
      missingFiles: [],
      duplicateFiles: [],
      emptyFiles: []
    },
    missingParts: ['Unit Tests', 'CI/CD Automation'],
    plan: {
      fixNow: ['Patch detected vulnerabilities'],
      next: ['Refactor high-complexity modules'],
      later: ['Increase test coverage to >80%']
    },
    assumptions: ['Assumes target environment supports ES Modules'],
    runReadyVerdict: isBadTarget ? 'Not Runnable' : 'Runnable',
    issues
  };
}
