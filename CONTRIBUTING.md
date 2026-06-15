# Contributing to Shipyard Frontend

Thank you for your interest in contributing! This guide covers the frontend development workflow.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Start dev server**: `npm run dev`
5. **Create a branch**: `git checkout -b feat/your-feature-name`

## Branch Naming

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New feature | `feat/dashboard-sidebar` |
| `fix/` | Bug fix | `fix/responsive-layout` |
| `docs/` | Documentation | `docs/component-readme` |
| `style/` | Styling changes | `style/dark-mode-theme` |
| `refactor/` | Refactoring | `refactor/api-client` |

## Component Guidelines

- Place shared UI primitives in `components/ui/`
- Place feature-specific components in `components/<feature>/`
- Use TypeScript for all new components
- Co-locate component-specific types in the component file or a sibling `.types.ts`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(dashboard): add workflow status cards
fix(layout): correct sidebar z-index on mobile
```

## Pull Request Process

1. Run `npm run lint` and `npm run build` before submitting
2. Include screenshots for any UI changes
3. Update relevant README files
4. Request review from a maintainer
