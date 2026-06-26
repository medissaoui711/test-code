# 🛡️ Security Policy

At TestPilot, security and data privacy are foundational. Since our platform analyzes source code, we treat all uploaded data with the highest level of confidentiality.

## Data Handling & Privacy

1. **Transient Processing:** Any code or URL submitted for analysis is processed in-memory or on ephemeral storage. 
2. **Zero Persistent Storage:** We do not retain server-side copies of your source code, scan results, or personal profiles beyond a maximum 24-hour processing window.
3. **Session Isolation:** All historical data is stored locally in your browser, sandboxed by a unique, anonymous session ID.

## Anti-Reverse Engineering & Application Protection

While it is impossible to prevent reverse engineering of frontend code with 100% certainty, TestPilot employs a defense-in-depth architectural strategy to minimize risks:

### 1. Frontend Security
- **Minification & Build Optimization:** The production build is heavily minified.
- **No Source Maps:** Source maps are explicitly disabled in the production build (`sourcemap: false`) to prevent exposing the original code structure.
- **Secret Management:** Absolutely **no** sensitive logic, real API keys, or credentials are hardcoded or stored in the frontend codebase.

### 2. Backend Security (Architecture)
- **Server-Side Logic:** All sensitive business logic, proprietary analysis engines, and critical rulesets are strictly maintained on the backend. The frontend remains a lightweight, clear presentation layer.
- **Secure Secret Storage:** All third-party tokens and API keys are stored in secure server-side environments.
- **API Proxies:** Sensitive third-party API requests are routed through backend proxies rather than executed directly from the browser.
- **Short-Lived Tokens:** When required, the system utilizes short-lived access tokens.

### 3. Operational Protection
- **Rate Limiting:** Backend endpoints are protected against brute-force and abuse.
- **Input Validation:** Strict sanitization and validation of all inputs on both the frontend and backend.

**Core Philosophy:** "What is sensitive does not go to the browser. What is visible in the browser is minimized to be difficult to understand, but the true security lies in the backend architecture."

## Reporting a Vulnerability

If you discover a security vulnerability in TestPilot, please do not disclose it publicly. Instead, report it to our security team immediately.

- **Email:** security@testpilot.example.com
- **Response Time:** We aim to acknowledge all reports within 48 hours and provide a timeline for a fix.

Please include detailed steps to reproduce the vulnerability. We appreciate your efforts to keep TestPilot secure!
