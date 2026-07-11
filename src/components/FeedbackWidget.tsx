import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    // Simulate sending feedback
    console.log("Feedback submitted:", feedback);
    
    // Track usage (mock analytics)
    console.log("Analytics: [Event] Feedback_Submitted");

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback('');
      }, 300);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 md:bottom-6 ${isAr ? 'left-6' : 'right-6'} w-14 h-14 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 border border-transparent hover:border-cyan-500 shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center z-40 group`}
        aria-label="Send Feedback"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="tech-panel w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
                {t('feedback.title')}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 mb-2">{t('feedback.thankYou')}</h4>
                  <p className="text-zinc-600">{t('feedback.thankYouDesc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-sm text-zinc-600 mb-4">
                    {t('feedback.desc')}
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t('feedback.placeholder')}
                    className="w-full h-32 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:border-cyan-500 resize-none mb-4 transition-colors"
                    required
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="tech-button font-mono text-xs uppercase"
                    >
                      {t('feedback.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={!feedback.trim()}
                      className="tech-button-primary font-mono text-xs uppercase"
                    >
                      {t('feedback.send')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
