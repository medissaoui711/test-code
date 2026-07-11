import React, { useState } from 'react';
import { Search, Loader2, Upload, FileArchive, Link as LinkIcon, Code2 } from 'lucide-react';
import { runScan, TestReport, FileData } from '../lib/scanner';
import { useLanguage } from '../contexts/LanguageContext';
import JSZip from 'jszip';

interface TestRunnerProps {
  onComplete: (report: TestReport) => void;
  initialType?: 'url' | 'file';
  initialUrl?: string;
}

export function TestRunner({ onComplete, initialType = 'url', initialUrl = '' }: TestRunnerProps) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [inputType, setInputType] = useState<'url' | 'file'>(initialType);
  const [url, setUrl] = useState(initialUrl);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setInputType(initialType);
    setUrl(initialUrl);
    
    if (initialType === 'url' && initialUrl) {
      setIsScanning(true);
      setError(null);
      setProgressText(t('testrunner.step1'));

      const autoScan = async () => {
        try {
          const progressSteps = [
            t('testrunner.step1'),
            t('testrunner.step2'),
            t('testrunner.step3'),
            t('testrunner.step4')
          ];

          let stepIndex = 0;
          const progressInterval = setInterval(() => {
            stepIndex++;
            if (stepIndex < progressSteps.length) {
              setProgressText(progressSteps[stepIndex]);
            }
          }, 3000);

          const report = await runScan(initialUrl);
          clearInterval(progressInterval);
          onComplete(report);
        } catch (err: any) {
          console.error(err);
          setError(err.message || (isAr ? 'حدث خطأ أثناء فحص المشروع.' : 'An error occurred during project scanning.'));
        } finally {
          setIsScanning(false);
        }
      };
      autoScan();
    }
  }, [initialType, initialUrl]);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputType === 'url' && !url) return;
    if (inputType === 'file' && !file) return;

    setIsScanning(true);
    setError(null);
    setProgressText(t('testrunner.step1'));

    try {
      const progressSteps = [
        t('testrunner.step1'),
        t('testrunner.step2'),
        t('testrunner.step3'),
        t('testrunner.step4')
      ];

      let stepIndex = 0;
      const progressInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < progressSteps.length) {
          setProgressText(progressSteps[stepIndex]);
        }
      }, 3000);

      if (inputType === 'file' && file) {
        setProgressText(isAr ? 'جاري فك ضغط الملف وقراءة الكود...' : 'Unpacking & Reading Code...');
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        const filePromises: Promise<void>[] = [];
        const files: FileData[] = [];
        let totalFilesCount = 0;
        let totalLinesCount = 0;

        zipContent.forEach((path, zipFile) => {
          if (!zipFile.dir && !path.includes('node_modules') && !path.includes('.git')) {
            totalFilesCount++;
            const promise = zipFile.async('string').then(content => {
              totalLinesCount += content.split('\n').length;
              // Only send source files and reasonable sizes for AI analysis
              if (content.length < 100000 && (
                path.endsWith('.ts') || 
                path.endsWith('.tsx') || 
                path.endsWith('.js') || 
                path.endsWith('.jsx') || 
                path.endsWith('.json') || 
                path.endsWith('.md') || 
                path.endsWith('.py') ||
                path.includes('requirements.txt') ||
                path.includes('Dockerfile') ||
                path.includes('env')
              )) {
                // Prioritize core files (config, models, entry points)
                const isPriority = 
                  path.includes('config') || 
                  path.includes('main') || 
                  path.includes('app') || 
                  path.includes('server') || 
                  path.includes('models') ||
                  path.includes('schema');
                
                if (isPriority) {
                  files.unshift({ path, content });
                } else {
                  files.push({ path, content });
                }
              }
            });
            filePromises.push(promise);
          }
        });

        await Promise.all(filePromises);
        
        // Pass the REAL metrics to the scanner
        const report = await runScan(file.name, files.slice(0, 50), {
          fileCount: totalFilesCount,
          linesOfCode: totalLinesCount
        });

        clearInterval(progressInterval);
        onComplete(report);
      } else {
        // For URL input, we still rely on fallback/simulated metrics for now
        const report = await runScan(url);
        clearInterval(progressInterval);
        onComplete(report);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isAr ? 'حدث خطأ أثناء فحص المشروع.' : 'An error occurred during project scanning.'));
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError(isAr ? 'يرجى رفع ملف بصيغة ZIP فقط.' : 'Please upload a ZIP file only.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-mono uppercase tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">{t('testrunner.title')}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm uppercase">
          {t('testrunner.desc')}
        </p>
      </div>

      <div className="tech-panel p-6 relative group transition-colors">
        <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex gap-4 mb-8 border-b border-[var(--border-grid)] pb-6">
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={inputType === 'url' ? 'tech-button-primary' : 'tech-button'}
          >
            <LinkIcon className="w-4 h-4" />
            {t('testrunner.urlTab')}
          </button>
          <button
            type="button"
            onClick={() => setInputType('file')}
            className={inputType === 'file' ? 'tech-button-primary' : 'tech-button'}
          >
            <Upload className="w-4 h-4" />
            {t('testrunner.zipTab')}
          </button>
        </div>

        <form onSubmit={handleScan} className="relative z-10">
          {inputType === 'url' ? (
            <div className="relative mb-6">
              <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                <Search className="h-5 w-5 text-[var(--accent-cyber)]" />
              </div>
              <input
                type="text"
                id="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                dir="ltr"
                className={`tech-input w-full ${isAr ? 'pr-12 text-right' : 'pl-12 text-left'} py-4 font-mono text-sm uppercase disabled:opacity-50`}
                placeholder={t('testrunner.urlPlaceholder')}
              />
            </div>
          ) : (
            <div className="mb-8">
              <label 
                className={`block border border-dashed border-[var(--border-grid)] p-10 text-center transition-colors rounded-[var(--radius-sharp)] ${isScanning ? 'bg-[var(--bg-secondary)] cursor-not-allowed opacity-50' : 'bg-[var(--bg-primary)] hover:border-[var(--accent-cyber)] cursor-pointer'}`}
              >
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".zip" 
                  className="hidden" 
                  disabled={isScanning}
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileArchive className="w-12 h-12 text-[var(--accent-cyber)] mb-4" />
                    <span className="font-bold font-mono text-lg tracking-tight text-[var(--text-primary)]" dir="ltr">{file.name}</span>
                    <span className="text-xs text-[var(--text-muted)] mt-2 font-mono uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); setFile(null); }} 
                      className="tech-button mt-6 text-xs"
                      disabled={isScanning}
                    >
                      {isAr ? 'إزالة الملف' : 'Remove File'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                    <span className="font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">{t('testrunner.zipPrompt')}</span>
                    <span className="text-xs text-[var(--text-muted)] mt-2 font-mono uppercase">{t('testrunner.zipFormat')}</span>
                  </div>
                )}
              </label>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-[var(--bg-secondary)] border-l-4 border-[var(--signal-fail)] text-[var(--signal-fail)] font-mono text-sm font-bold uppercase tracking-wide rounded-r-[var(--radius-sharp)]">
              [ERROR] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isScanning || (inputType === 'url' ? !url : !file)}
            className="w-full tech-button-primary py-4 text-base tracking-[0.2em] font-bold group disabled:opacity-50 disabled:pointer-events-none"
          >
            {isScanning ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('testrunner.scanning')}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Code2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('testrunner.startScan')}
              </span>
            )}
          </button>
        </form>

        {isScanning && (
          <div className="mt-10 text-center animate-in fade-in duration-300 relative z-10 border-t border-[var(--border-grid)] pt-8">
            <div className="inline-flex items-center justify-center gap-2 mb-6 bg-[var(--bg-secondary)] border border-[var(--accent-cyber)] px-4 py-2 text-[var(--accent-cyber)] font-mono text-xs font-bold uppercase tracking-widest rounded-[var(--radius-sharp)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyber)] animate-pulse" />
              SYS.SCANNING
            </div>
            
            <h3 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase tracking-widest">{isAr ? 'جاري التحليل والفحص' : 'Scanning & Analyzing'}</h3>
            <p className="text-[var(--text-muted)] mt-2 font-mono text-sm uppercase">{progressText}</p>
            <div className="mt-8 tech-progress-block relative overflow-hidden">
              <div className="tech-progress-chunk w-[10%] animate-scanline absolute left-0" style={{animation: 'scan 2s ease-in-out infinite'}} />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-6 uppercase font-mono tracking-[0.3em] font-bold">{isAr ? 'قد تستغرق العملية وقتاً بناءً على حجم المشروع' : 'This may take some time depending on project size'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
