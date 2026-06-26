# 🏗️ TestPilot Architecture

## The Anonymous-First Approach

TestPilot is designed as a **Multi-user, anonymous-first, session-isolated analysis workspace**. This architecture was chosen to eliminate onboarding friction while ensuring absolute data privacy and isolation for users analyzing potentially sensitive AI-generated code.

### 1. Identity Layer (Anonymous Sessions)

When a user accesses TestPilot for the first time:

- A unique `sessionId` (cryptographic UUID) is generated on the client side.
- This ID is securely stored in the browser's `localStorage` alongside an expiry timestamp.
- All subsequent API requests and local data operations are scoped to this `sessionId`.

### 2. Data Isolation Layer

- **Client-Side:** Reports and project histories are stored using composite keys (e.g., `testpilot_reports_${sessionId}`).
- **Server-Side:** Any temporary uploads or processing artifacts are tagged with the session ID. The system enforces strict access control, ensuring a session can only retrieve or mutate its own data.

### 3. Garbage Collection & Cleanup

- **Session Expiry:** Sessions have a TTL (Time-To-Live). The `cleanupExpiredSessions()` utility continuously monitors and purges expired sessions.
- **Data Sanitization:** When a session expires, all associated local data is permanently destroyed. On the server side, automated cron jobs aggressively purge processing artifacts older than 24 hours.

## Frontend Architecture

- **React 19 & Vite:** Leverages concurrent rendering and ultra-fast HMR.
- **Context API:** Manages global state such as Theme (Dark/Light) and i18n (English/Arabic RTL).
- **Tailwind CSS:** Utility-first styling with comprehensive dark mode support and responsive design targeting both mobile and high-density desktop displays.
- **Component Modularity:** Strict separation of concerns between Presentational components (`Dashboard.tsx`, `ReportView.tsx`) and Logic layers (`scanner.ts`, `session.ts`).

## Source Code Ingestion Strategy (GitHub Integration)

TestPilot supports analyzing both public and private repositories, but implements distinct security and ingestion strategies for each to strictly adhere to the principle of least privilege.

### 1. Public Repositories

- **Mechanism:** Direct URL ingestion.
- **Access:** No authentication required. The backend service fetches the contents via standard unauthenticated API limits or direct cloning.

### 2. Private Repositories

- **Anti-Pattern:** Traditional wide-scope OAuth is explicitly avoided due to its tendency to request overly broad permissions across all user repositories.
- **Mechanism:**
  - **Preferred:** GitHub App integration for production/SaaS setups, granting granular access to specific repositories.
  - **Alternative:** Fine-grained Personal Access Tokens (PATs) provided by the user for a single, isolated scan.
- **Security Posture:**
  - Tokens are **strictly `read-only`** for repository contents.
  - Tokens are transmitted to the backend, **never** stored in the frontend, and used ephemerally to clone the source code.
  - Once the analysis is complete, any reference to the token is dropped from active memory.
