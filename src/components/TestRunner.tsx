import React, { useState } from 'react';
import { Search, Loader2, Upload, FileArchive, Link as LinkIcon, Code2 } from 'lucide-react';
import { runScan, TestReport } from '../lib/scanner';
import { useLanguage } from '../contexts/LanguageContext';

interface TestRunnerProps {
  onComplete: (report: TestReport) => void;
}

export function TestRunner({ onComplete }: TestRunnerProps) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Pass either url or file name to the scanner
      const target = inputType === 'url' ? url : (file ? file.name : 'Unknown File');
      const report = await runScan(target);

      clearInterval(progressInterval);
      onComplete(report);
    } catch (err: any) {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('testrunner.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {t('testrunner.desc')}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'url' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <LinkIcon className="w-5 h-5" />
            {t('testrunner.urlTab')}
          </button>
          <button
            type="button"
            onClick={() => setInputType('file')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'file' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Upload className="w-5 h-5" />
            {t('testrunner.zipTab')}
          </button>
        </div>

        <form onSubmit={handleScan} className="relative z-10">
          {inputType === 'url' ? (
            <div className="relative mb-6">
              <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="url"
                id="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                dir="ltr"
                className={`block w-full ${isAr ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-4 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-shadow disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-600 font-mono`}
                placeholder={t('testrunner.urlPlaceholder')}
              />
            </div>
          ) : (
            <div className="mb-6">
              <label 
                className={`block border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isScanning ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer'}`}
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
                    <FileArchive className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-3" />
                    <span className="font-medium text-slate-900 dark:text-white font-mono" dir="ltr">{file.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); setFile(null); }} 
                      className="mt-4 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      disabled={isScanning}
                    >
                      {isAr ? 'إزالة الملف' : 'Remove File'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
                    <span className="font-medium text-slate-900 dark:text-white">{t('testrunner.zipPrompt')}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('testrunner.zipFormat')}</span>
                  </div>
                )}
              </label>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-700 dark:text-rose-400 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isScanning || (inputType === 'url' ? !url : !file)}
            className="w-full flex justify-center py-4 px-4 border border-indigo-500/50 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)] text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isScanning ? (
              <span className="flex items-center">
                <Loader2 className={`w-5 h-5 ${isAr ? 'ml-2' : 'mr-2'} animate-spin`} />
                {t('testrunner.scanning')}
              </span>
            ) : (
              t('testrunner.startScan')
            )}
          </button>
        </form>

        {isScanning && (
          <div className="mt-8 text-center animate-in fade-in duration-500 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Code2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{isAr ? 'جاري التحليل والفحص' : 'Scanning & Analyzing'}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">{progressText}</p>
            <div className="mt-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full animate-pulse relative" style={{ width: '60%' }}>
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white/50 dark:to-white/20 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-wider font-bold">{isAr ? 'قد تستغرق العملية وقتاً بناءً على حجم المشروع' : 'This may take some time depending on project size'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
