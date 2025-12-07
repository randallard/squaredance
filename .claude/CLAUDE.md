# Square Dance Caller Practice App - Development Guidelines

## Core Principles

### YAGNI (You Aren't Gonna Need It)
- Build only what's needed for current features
- Don't add functionality "just in case" it might be useful later
- Start simple, add complexity only when requirements demand it
- Resist over-engineering and premature abstraction

### KISS (Keep It Simple, Stupid)
- Favor simple, readable solutions over clever ones
- Minimize dependencies and complexity
- Clear code is better than concise code
- If it's hard to test, it's probably too complex

## Security

### Dependency Security
- Stay vigilant about supply chain attacks and malicious packages
- Be aware of recent incidents (e.g., npm package injection attacks)
- Regularly audit dependencies with `pnpm audit`
- Keep dependencies minimal - fewer dependencies = smaller attack surface
- Verify package authenticity before adding new dependencies
- Pin dependency versions and review updates carefully
- Use lock files (pnpm-lock.yaml) and commit them

### Code Security
- Avoid XSS vulnerabilities - sanitize any user input if displayed
- No eval() or Function() constructor with user input
- Be careful with dangerouslySetInnerHTML in React
- Follow OWASP top 10 guidelines

## Testing Standards

### High Test Coverage
- Maintain test coverage as high as possible (aim for >90%)
- Write tests first for complex logic (TDD when appropriate)
- Test all call transformations and formation detection
- Integration tests for sequence execution
- Use `pnpm test:coverage` to track coverage metrics

### Testing Strategy
- Unit tests: Individual call logic, position calculations, formation detection
- Integration tests: Call sequences, state management
- Visual/component tests: React components using Vitest + Testing Library
- Test edge cases: Invalid formations, impossible sequences, boundary conditions

## Git Workflow

### Branch Naming Conventions
All updates must use proper branch prefixes:
- `feature/` - New features and functionality
- `refactor/` - Code improvements without changing behavior
- `bugfix/` - Bug fixes and corrections

Examples:
- `feature/ocean-wave-detection`
- `feature/tutorial-mode`
- `refactor/call-execution-engine`
- `bugfix/dancer-position-calculation`

## Project-Specific Guidelines

### Code Organization
- Keep call definitions separate and composable
- Type everything strictly (TypeScript strict mode)
- Validate runtime data with Zod schemas
- Use CSS Modules for component styling

### Development Workflow
- Follow the stack from spaces-game-node (React 19, TypeScript 5.9, Vitest, Zod)
- Use pnpm for package management
- Run tests before committing
- Use ESLint + Prettier for code quality
- Always run `pnpm validate` before finishing a feature

## Architecture Patterns

### Data Storage
- Use localStorage for all user data persistence
- No external database (keep it simple and local)
- Implement backup/restore functionality for data portability
- All data must be validated with Zod schemas before saving/loading

### State Management
- Use custom hooks for localStorage integration (`useLocalStorage`)
- Follow React hooks patterns from spaces-game-node
- Keep state close to where it's used (avoid global state when possible)

### Component Structure
- Components in `src/components/` with co-located CSS Modules
- Export components from `src/components/index.ts`
- Separate logic into utility functions in `src/utils/`
- Keep components focused and testable

### File Organization
```
src/
  ├── components/       # React components with .module.css
  ├── hooks/            # Custom React hooks
  ├── schemas/          # Zod validation schemas
  ├── types/            # TypeScript type definitions
  ├── utils/            # Pure utility functions
  └── test/             # Test setup and helpers
```

### User Profile System
- Profile setup on first visit (WelcomeScreen)
- ProfileModal for editing profile and managing backups
- Store: name, stats, preferences, creation date
- All profile changes validated and persisted immediately

### Accessibility Requirements
- All interactive elements must have ARIA labels
- Modals must use role="dialog" and aria-modal="true"
- Form inputs must have associated labels
- Error messages must use role="alert"
- Support keyboard navigation
- Test with screen readers in mind

### Component Testing Pattern
- Test user interactions with userEvent from @testing-library/user-event
- Mock localStorage in test setup (see src/test/setup.ts)
- Test both success and error cases
- Verify accessibility attributes
- Test modal open/close behavior
- Check that callbacks are called with correct data
