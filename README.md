# 🛡️ TestPilot: AI Security & Code Analysis Dashboard

> **A multi-user, anonymous-first, session-isolated workspace for AI-generated code analysis.**

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TestPilot is an advanced, privacy-first cybersecurity and code-quality command center. Designed specifically to evaluate AI-generated codebases, it transforms complex static analysis and vulnerability scanning into actionable, prioritized intelligence for both developers and non-technical stakeholders.

## 🏗️ Architectural Philosophy

TestPilot is built on a **"Zero-Friction, Zero-Trust"** philosophy:
- **Anonymous-First Sessions:** Users instantly get an isolated workspace upon visit. No mandatory sign-ups, reducing friction while maintaining absolute data segregation.
- **Session-Isolated State:** Every project, report, and preference is strictly bound to a cryptographic local session.
- **Multi-Stage Storage:** Utilizing a hybrid approach with `sessionStorage` for transient backend-simulated data and `localStorage` for persistent non-sensitive preferences.
- **Transient Processing:** Any server-side data required for analysis is volatile and aggressively garbage-collected within a maximum of 24 hours. No persistent server-side profiles.

## ✨ Core Capabilities

- **Automated Threat Intelligence:** Deep code quality and vulnerability scanning tailored for AI-generated artifacts.
- **Severity-Based Triage:** Issues are classified deterministically (Critical, High, Medium, Low) to accelerate remediation.
- **Dark Mode & i18n:** Fully localized (English/Arabic RTL support) with a responsive, modern dark/light visual language.
- **Executive Reporting:** One-click PDF export generating board-ready summaries from technical data.
- **Client-Side Persistence:** Utilizing modern browser storage APIs synced with session identities for persistent, yet private, history.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/testpilot.git
   cd testpilot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 📂 Documentation

Dive deeper into our technical decisions and contribution guidelines:
- [Architecture Overview](docs/ARCHITECTURE.md) - Deep dive into the anonymous-first session management and state architecture.
- [Security Policy](docs/SECURITY.md) - Our commitment to data privacy and vulnerability reporting.
- [Contributing Guidelines](docs/CONTRIBUTING.md) - How to run tests, submit PRs, and follow our coding standards.

## 🛠️ Technology Stack

- **Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (Dark mode integrated), Recharts (Data visualization), Lucide React (Iconography)
- **State & Session:** Custom Context APIs, Cryptographic UUID Sessions, LocalStorage isolation

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
