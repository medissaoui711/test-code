import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface IntegrationState {
  isConnected: boolean;
  username: string | null;
  loading: boolean;
}

export const IntegrationsSettings: React.FC = () => {
  const { dir } = useLanguage();

  const [driveState, setDriveState] = useState<IntegrationState>({
    isConnected: false,
    username: null,
    loading: false,
  });

  const [githubState, setGithubState] = useState<IntegrationState>({
    isConnected: false,
    username: null,
    loading: false,
  });

  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleConnectDrive = async () => {
    setDriveState((prev) => ({ ...prev, loading: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200)); 
      setDriveState({
        isConnected: true,
        username: 'user.name@gmail.com',
        loading: false,
      });
    } catch (error) {
      setDriveState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDisconnectDrive = () => {
    setDriveState({ isConnected: false, username: null, loading: false });
  };

  const handleConnectGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    setGithubState((prev) => ({ ...prev, loading: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setGithubState({
        isConnected: true,
        username: 'github_developer_vibe',
        loading: false,
      });
      setShowTokenInput(false);
      setGithubToken('');
    } catch (error) {
      setGithubState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDisconnectGithub = () => {
    setGithubState({ isConnected: false, username: null, loading: false });
  };

  return (
    <div className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] pb-12 font-sans" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            إعدادات الموصلات والربط
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base">
            قم بإدارة وتوصيل الخدمات الخارجية لتوسيع قدرات النظام ومزامنة ملفاتك ومستودعاتك برمجياً.
          </p>
        </header>

        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/70 shadow-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-[80px]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-blue-500 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5 5 0 00-4.591-2.941A1 1 0 0010 6c0-.07.01-.139.03-.208M9 15l3-3m0 0l3 3m-3-3v12" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">Google Drive</h3>
                    {driveState.isConnected ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700">
                        غير متصل
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    يسمح للنظام بجلب وتصفح المستندات والملفات عبر مسار <code className="text-xs text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800/60">/api/connectors/drive</code>.
                  </p>
                  {driveState.isConnected && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      الحساب المرتبط: {driveState.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:self-center relative z-10">
                {driveState.isConnected ? (
                  <button
                    onClick={handleDisconnectDrive}
                    className="w-full sm:w-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/50 shadow-sm"
                  >
                    إلغاء الربط
                  </button>
                ) : (
                  <button
                    onClick={handleConnectDrive}
                    disabled={driveState.loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                  >
                    {driveState.loading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : 'ربط الحساب عبر OAuth'}
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/70 shadow-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-[80px]" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">GitHub</h3>
                    {githubState.isConnected ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700">
                        غير متصل
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    استعراض وتضمين محتوى المستودعات العامة والخاصة عبر مكتبة <code className="text-xs text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800/60">@octokit/rest</code>.
                  </p>
                  {githubState.isConnected && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      الحساب النشط: @{githubState.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:self-center relative z-10">
                {githubState.isConnected ? (
                  <button
                    onClick={handleDisconnectGithub}
                    className="w-full sm:w-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/50 shadow-sm"
                  >
                    إلغاء الربط
                  </button>
                ) : (
                  !showTokenInput && (
                    <button
                      onClick={() => setShowTokenInput(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                    >
                      تهيئة الاتصال بـ Token
                    </button>
                  )
                )}
              </div>
            </div>

            {showTokenInput && !githubState.isConnected && (
              <form onSubmit={handleConnectGithub} className="mt-6 border-t border-zinc-200 dark:border-zinc-800/80 pt-5 animate-fadeIn relative z-10">
                <div className="max-w-md">
                  <label htmlFor="token" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    Personal Access Token (Classic / Fine-grained)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="token"
                      type="password"
                      required
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={githubState.loading}
                      className="shrink-0 inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-950 transition-colors hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 shadow-sm"
                    >
                      {githubState.loading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-zinc-950 border-t-transparent" />
                      ) : 'التحقق والربط'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(false)}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors shadow-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    ملاحظة: الـ Token يتم استخدامه للوصول الآمن للمستودعات الخاصة بك ولا نقوم بمشاركته خارج نطاق الـ API الخاص بالتطبيق.
                  </p>
                </div>
              </form>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};
