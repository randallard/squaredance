# Square Dance Caller Practice

A web application to help square dance callers practice sight calling and choreography.

## Features

- 👤 User profile with statistics tracking
- 📊 Session and call tracking
- 💾 Backup/restore functionality
- 🎨 Clean, accessible interface
- 🌓 Dark/light mode support

## Development

### Prerequisites

- Node.js >= 20.19.0
- pnpm >= 8.0.0

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type check
pnpm check

# Lint
pnpm lint

# Format code
pnpm format

# Run all validations
pnpm validate

# Build for production
pnpm build
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool
- **Vitest 3** - Testing framework
- **Zod** - Runtime validation
- **pnpm** - Package manager

## Architecture

- **localStorage** - All data persisted locally
- **No database** - Runs entirely client-side
- **Backup/Restore** - Import/export profile data as JSON
- **High test coverage** - Comprehensive test suite

## Deployment

The app is automatically deployed to GitHub Pages when changes are merged to `main`.

### CI/CD Workflow

1. **Pull Request** - Runs validation (type check, lint, tests)
2. **Merge to Main** - Builds and deploys to GitHub Pages

Live site: https://randallard.github.io/squaredance/

## Development Guidelines

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for:
- Code principles (YAGNI, KISS)
- Security guidelines
- Testing standards
- Git workflow
- Architecture patterns

## License

MIT
