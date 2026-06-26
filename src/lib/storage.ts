import { getSessionId } from './session';
import { TestReport } from './scanner';
import { simulateNetworkRequest } from './api';

/**
 * Simulates a backend storage queue for reports.
 * In a real application, these functions would be HTTP calls to an API.
 */

export async function saveReportToBackend(report: TestReport): Promise<TestReport[]> {
  const sessionId = getSessionId();
  const existing = await getReportsFromBackend();
  const updated = [report, ...existing];
  
  await simulateNetworkRequest(updated, 300);
  
  sessionStorage.setItem(`backend_reports_${sessionId}`, JSON.stringify(updated));
  return updated;
}

export async function getReportsFromBackend(): Promise<TestReport[]> {
  const sessionId = getSessionId();
  const saved = sessionStorage.getItem(`backend_reports_${sessionId}`);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse backend reports', e);
      return [];
    }
  }
  return [];
}

export async function clearBackendReports(): Promise<void> {
  const sessionId = getSessionId();
  sessionStorage.removeItem(`backend_reports_${sessionId}`);
}

export function migrateLegacyReports() {
  const sessionId = getSessionId();
  const legacySaved = localStorage.getItem('testpilot_reports');
  const legacySessionSaved = localStorage.getItem(`testpilot_reports_${sessionId}`);

  // Migrate from localStorage to sessionStorage (simulated backend)
  if (legacySessionSaved) {
    sessionStorage.setItem(`backend_reports_${sessionId}`, legacySessionSaved);
    localStorage.removeItem(`testpilot_reports_${sessionId}`);
  } else if (legacySaved) {
    sessionStorage.setItem(`backend_reports_${sessionId}`, legacySaved);
    localStorage.removeItem('testpilot_reports');
  }
}
