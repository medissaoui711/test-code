# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Multi-user, anonymous-first session isolation (`src/lib/session.ts`).
- Secure temporary session IDs generated cryptographically.
- Garbage collection utility (`cleanupExpiredSessions()`) for automated cleanup.
- Dark mode theme context and tailored Tailwind styling across all components.
- Arabic (RTL) comprehensive language support.
- Cyber-security aesthetic UI with Recharts integration for visualizing analysis trends.
- Documentation suite including Architecture, Security, and Contribution guidelines.
- Deployment and API documentation.

### Changed
- Refactored `Dashboard.tsx` and `ReportView.tsx` to handle dynamic theming (Dark/Light).
- Migrated legacy `testpilot_reports` local storage data to the new session-isolated format.

### Security
- Shifted architecture to Zero-Persistent-Storage for uploaded code.
- Removed permanent user profiles to enhance privacy and minimize data exposure.
