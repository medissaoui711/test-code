export const SESSION_KEY = 'testpilot_session_id';
export const SESSION_EXPIRY_KEY = 'testpilot_session_expiry';
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';

  let sessionId = localStorage.getItem(SESSION_KEY);
  let expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

  // Check if session exists and is not expired
  if (sessionId && expiry && parseInt(expiry, 10) > Date.now()) {
    // Extend session on activity
    localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
    return sessionId;
  }

  // Clear any old data because session expired or doesn't exist
  clearSessionData(sessionId);

  // Create new session
  sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  localStorage.setItem(SESSION_KEY, sessionId);
  localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
  
  return sessionId;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  const sessionId = localStorage.getItem(SESSION_KEY);
  clearSessionData(sessionId);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

function clearSessionData(sessionId: string | null) {
  if (!sessionId) return;
  // In a real app this would be a DELETE /api/session
  sessionStorage.removeItem(`backend_reports_${sessionId}`);
  localStorage.removeItem(`testpilot_reports_${sessionId}`); // Clean up legacy
  localStorage.removeItem('testpilot_reports'); // Also clear legacy unstructured reports
}

// This function runs occasionally to clean up abandoned sessions
export function cleanupExpiredSessions() {
  if (typeof window === 'undefined') return;
  
  let expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (expiry && parseInt(expiry, 10) <= Date.now()) {
    clearSession();
  }
}
