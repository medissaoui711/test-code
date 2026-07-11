import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CloudFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string;
}

export const FilePickerDashboard: React.FC = () => {
  const { dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'drive' | 'github'>('drive');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [driveFiles, setDriveFiles] = useState<CloudFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderHistory, setFolderHistory] = useState<string[]>(['root']);

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [repoContents, setRepoContents] = useState<CloudFile[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');

  const fetchDriveFiles = async (folderId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockData: Record<string, CloudFile[]> = {
        root: [
          { id: 'f1', name: 'المستندات التقنية للمشروع', type: 'folder' },
          { id: 'f2', name: 'التصاميم ونماذج واجهة المستخدم', type: 'folder' },
          { id: 'doc_1', name: 'Software_Architecture.pdf', type: 'file', mimeType: 'application/pdf', size: '2.4 MB' },
          { id: 'sheet_1', name: 'Financial_Budget_2026.xlsx', type: 'file', mimeType: 'spreadsheet', size: '1.1 MB' },
        ],
        f1: [
          { id: 'doc_2', name: 'API_Specification_v2.md', type: 'file', mimeType: 'text/markdown', size: '45 KB' },
          { id: 'doc_3', name: 'Database_Schema.png', type: 'file', mimeType: 'image/png', size: '820 KB' },
        ],
        f2: [
          { id: 'img_1', name: 'App_Dark_Theme_Mockup.fig', type: 'file', mimeType: 'figma', size: '14 MB' },
        ]
      };
      setDriveFiles(mockData[folderId] || []);
    } catch (error) {
      console.error("Error fetching drive files", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGitHubRepos = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const mockRepos: GitHubRepo[] = [
        { id: 101, name: 'vibe-coding-platform', full_name: 'user/vibe-coding-platform', private: true, description: 'The core AI assistant engine backend.' },
        { id: 102, name: 'unicode-cleaner-web', full_name: 'user/unicode-cleaner-web', private: false, description: 'Production code for unicode utilities.' },
        { id: 103, name: 'react-dark-ui-tokens', full_name: 'user/react-dark-ui-tokens', private: false, description: 'Tailwind CSS design tokens for slate themes.' },
      ];
      setRepos(mockRepos);
    } catch (error) {
      console.error("Error fetching GitHub repos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepoContents = async (repoFullName: string, path: string = '') => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const mockContents: CloudFile[] = [
        { id: 'src', name: 'src', type: 'folder' },
        { id: 'pub', name: 'public', type: 'folder' },
        { id: 'pkg', name: 'package.json', type: 'file', size: '1.8 KB' },
        { id: 'ts', name: 'tsconfig.json', type: 'file', size: '420 Bytes' },
        { id: 'readme', name: 'README.md', type: 'file', size: '3.2 KB' },
      ];
      setRepoContents(mockContents);
    } catch (error) {
      console.error("Error fetching repo contents", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'drive') {
      fetchDriveFiles(currentFolderId);
    } else if (activeTab === 'github' && !selectedRepo) {
      fetchGitHubRepos();
    }
  }, [activeTab, currentFolderId, selectedRepo]);

  const handleFolderClick = (folderId: string) => {
    setFolderHistory((prev) => [...prev, folderId]);
    setCurrentFolderId(folderId);
  };

  const handleDriveBack = () => {
    if (folderHistory.length > 1) {
      const newHistory = [...folderHistory];
      newHistory.pop();
      const prevFolder = newHistory[newHistory.length - 1];
      setFolderHistory(newHistory);
      setCurrentFolderId(prevFolder);
    }
  };

  const handleRepoClick = (repoFullName: string) => {
    setSelectedRepo(repoFullName);
    setCurrentPath('');
    fetchRepoContents(repoFullName, '');
  };

  const handleImportFile = async (file: CloudFile) => {
    try {
      alert(`جاري استيراد ومعالجة الملف: ${file.name} ...`);
      
      let base64Buffer = '';

      if (activeTab === 'github') {
        const repoFullName = selectedRepo || '';
        const owner = repoFullName.split('/')[0];
        const repo = repoFullName.split('/')[1];
        
        try {
          const githubRes = await fetch('/api/connectors/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              owner,
              repo,
              path: file.name, // The mock path doesn't have the full path, but for demonstration we'll use name
            })
          });
          const githubData = await githubRes.json();
          if (githubData.content) {
            base64Buffer = githubData.content.replace(/\n/g, '');
          } else {
            throw new Error(githubData.error || "محتوى الملف غير موجود");
          }
        } catch (e: any) {
          console.warn("GitHub fetch failed, falling back to mock buffer", e);
          base64Buffer = btoa(`Simulated GitHub content for ${file.name}. const a = 1;`);
        }
      } else {
        try {
          const driveRes = await fetch('/api/connectors/drive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileId: file.id,
              accessToken: 'MOCK_TOKEN' // Using a mock token for UI demonstration
            })
          });
          const driveData = await driveRes.json();
          if (driveData.fileBuffer) {
            base64Buffer = driveData.fileBuffer;
          } else {
            throw new Error(driveData.error || "لم يتم إرجاع المحتوى");
          }
        } catch (e: any) {
          console.warn("Drive fetch failed, falling back to mock buffer", e);
          base64Buffer = btoa(`Simulated Drive document content for ${file.name}. Meeting notes and architecture diagrams.`);
        }
      }

      const res = await fetch('/api/parser/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileBuffer: base64Buffer
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`✅ تمت المعالجة بنجاح!\nعدد الكلمات: ${data.wordCount}\nمقتطف: ${data.extractedText.substring(0, 100)}...`);
      } else {
        const errorData = await res.json();
        alert(`❌ خطأ في المعالجة: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error importing file:", error);
      alert("حدث خطأ أثناء محاولة الاتصال بخدمة المعالجة.");
    }
  };

  const filteredFiles = (activeTab === 'drive' ? driveFiles : repoContents).filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] pb-12 font-sans selection:bg-indigo-500/30" dir={dir}>
      <div className="max-w-5xl mx-auto border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-sm">
        
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex bg-white dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto shadow-sm">
            <button
              onClick={() => { setActiveTab('drive'); setSelectedRepo(null); }}
              className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'drive' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              Google Drive
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'github' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              GitHub Repositories
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="البحث في الملفات والمجلدات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-10 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-600 text-xs">⌘K</span>
          </div>
        </div>

        <div className="px-6 py-3 bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-900 flex items-center text-xs text-zinc-500 dark:text-zinc-400 gap-2">
          <span>الموقع الحالي:</span>
          {activeTab === 'drive' ? (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 dark:text-zinc-500">My Drive</span>
              {folderHistory.length > 1 && (
                <>
                  <span className="text-zinc-400 dark:text-zinc-700">/</span>
                  <button onClick={handleDriveBack} className="text-blue-600 dark:text-blue-400 hover:underline">المجلد السابق</button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 dark:text-zinc-500">GitHub</span>
              {selectedRepo && (
                <>
                  <span className="text-zinc-400 dark:text-zinc-700">/</span>
                  <button onClick={() => setSelectedRepo(null)} className="text-indigo-600 dark:text-indigo-400 hover:underline">المستودعات</button>
                  <span className="text-zinc-400 dark:text-zinc-700">/</span>
                  <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">{selectedRepo}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-6 min-h-[380px]">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-center gap-4 p-3 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/40 dark:bg-zinc-900/40 animate-pulse">
                  <div className="h-9 w-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'github' && !selectedRepo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleRepoClick(repo.full_name)}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white/30 dark:bg-zinc-900/30 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer transition-all duration-200 group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm md:text-base">
                      {repo.name}
                    </h4>
                    {repo.private && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">خاص</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{repo.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-zinc-500">لا يوجد ملفات أو مجلدات تطابق البحث الحالي.</p>
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => file.type === 'folder' && activeTab === 'drive' ? handleFolderClick(file.id) : null}
                    className={`flex items-center justify-between py-3 px-2 rounded-lg transition-colors group ${file.type === 'folder' && activeTab === 'drive' ? 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/20'}`}
                  >
                    <div className="flex items-center gap-3.5">
                      {file.type === 'folder' ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-amber-500">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      <div>
                        <span className={`text-sm font-medium ${file.type === 'folder' ? 'text-zinc-900 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {file.name}
                        </span>
                        {file.size && <p className="text-[11px] text-zinc-500 mt-0.5">{file.size}</p>}
                      </div>
                    </div>

                    <div>
                      {file.type === 'file' ? (
                        <button 
                          onClick={() => handleImportFile(file)}
                          className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm"
                        >
                          استيراد للمنصة
                        </button>
                      ) : (
                        activeTab === 'drive' && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors pl-2">فتح ➔</span>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
