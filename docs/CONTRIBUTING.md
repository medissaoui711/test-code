# 🤝 Contributing to TestPilot

First off, thank you for considering contributing to TestPilot! It's people like you that make TestPilot such a great tool for the community.

## 🚀 How Can I Contribute?

### Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements
- Open a new issue with a clear title and description.
- Explain why this enhancement would be useful to most users.

### Pull Requests
1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`npm run lint` and `npm run build`).
5. Issue that pull request!

## 💻 Development Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.

## 🎨 Coding Style

- We use **TypeScript**. Strict typing is enforced.
- **Tailwind CSS** is used for all styling. Avoid custom CSS unless absolutely necessary.
- Follow the established directory structure (e.g., placing business logic in `src/lib`, components in `src/components`).
- Ensure all new UI components support both Light and Dark modes.
- Ensure all new text is internationalized (i18n) via our Translation context.
