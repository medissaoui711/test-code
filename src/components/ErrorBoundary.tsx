import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Log to local storage for beta monitoring
    try {
      const logs = JSON.parse(localStorage.getItem('testpilot_error_logs') || '[]');
      logs.push({
        date: new Date().toISOString(),
        error: error.message,
        stack: errorInfo.componentStack
      });
      localStorage.setItem('testpilot_error_logs', JSON.stringify(logs.slice(-50))); // keep last 50
    } catch (e) {
      // Ignore
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-zinc-50 p-8 rounded-sm shadow-sm border border-zinc-200 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 mb-2">عذراً، حدث خطأ غير متوقع</h1>
            <p className="text-zinc-600 mb-6">لقد قمنا بتسجيل هذا الخطأ للبحث فيه وسنعمل على إصلاحه قريباً. يرجى تحديث الصفحة للمحاولة مرة أخرى.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cyan-600 text-white font-medium rounded-sm hover:bg-cyan-700 transition-colors"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
