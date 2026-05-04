---
title: Contributing
description: Learn how to contribute to the project.
category: Community
order: 1
---

# Contributing

We love contributions! Here's how to get started.

## Getting Set Up

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

```bash
git clone https://github.com/your-username/my-project.git
cd my-project
pnpm install
```

3. Create a **feature branch**:

```bash
git checkout -b feat/my-awesome-feature
```

## Development Workflow

```bash
# Start the dev server
pnpm dev

# Run tests in watch mode
pnpm test --watch

# Lint and format
pnpm lint
pnpm format

# Type-check
pnpm typecheck
```

## Making Changes

### Code Style

We use Prettier for formatting and ESLint for linting. Run before committing:

```bash
pnpm lint:fix
pnpm format
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

```
feat: add user avatar support
fix: correct email validation regex
docs: update API reference for v2
chore: bump dependencies
test: add coverage for auth module
```

### Writing Tests

All new features must include tests. We aim for > 80% coverage:

```typescript
describe('myFeature', () => {
  it('does what it should', () => {
    expect(myFeature()).toBe(expectedResult);
  });
});
```

## Pull Requests

1. Push your branch to your fork
2. Open a PR against `main`
3. Fill in the PR template
4. Request a review from a maintainer

### PR Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Types check (`pnpm typecheck`)
- [ ] Docs updated if needed
- [ ] Changelog entry added

## Reporting Issues

Found a bug? Please include:

- Node.js and pnpm version
- Operating system
- Minimal reproduction steps
- Expected vs. actual behavior

## Community

- **Discord**: [discord.gg/my-project](https://discord.gg/my-project)
- **GitHub Discussions**: Ask questions and share ideas
- **Twitter**: [@CacheU](https://twitter.com/CacheU)

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/example/my-project/blob/main/CODE_OF_CONDUCT.md). Be respectful and constructive.
