---
title: Changelog
description: All notable changes to the project are documented here.
category: Community
order: 2
---

# Changelog

## v2.4.1 — 2024-12-01

### Bug Fixes

- Fixed edge case in `useQuery` where stale data was returned after token refresh
- Corrected TypeScript types for `createClient` options
- Fixed memory leak in `useIntersectionObserver` cleanup

## v2.4.0 — 2024-11-15

### New Features

- **`useKeyboard` hook** — Declarative keyboard shortcut management
- **Redis cache adapter** — Drop-in replacement for in-memory cache
- **CLI `generate` command** — Scaffold components, pages, and API routes
- Dark mode support via `next-themes` integration

### Improvements

- `useQuery` now supports optimistic updates
- Improved error messages for invalid configuration
- Bundle size reduced by 12% (tree-shaking improvements)
- TypeScript strict mode enabled across the codebase

### Breaking Changes

- `createClient` now requires `apiKey` instead of `token`
- `useQuery` `key` option is now required (was optional)

**Migration:**

```typescript
// Before
const client = createClient({ token: 'abc' });
// After
const client = createClient({ apiKey: 'abc' });
```

## v2.3.0 — 2024-10-01

### New Features

- **ORM layer** — Type-safe database queries with auto-migrations
- **Role-based access control** — `requireRole()` middleware
- **`useDebounce` hook** — Debounce rapidly-changing state
- CLI `db studio` command for visual database management

### Bug Fixes

- Fixed connection pool exhaustion under high load
- `useMutation` `onError` now receives the full error object

## v2.2.0 — 2024-09-01

### New Features

- OAuth 2.0 provider support
- JWT verification utilities
- `useLocalStorage` hook with cross-tab sync

## v2.1.0 — 2024-08-01

### New Features

- Initial `useQuery` and `useMutation` hooks
- API error handling with `ApiError` class
- Docker support with multi-stage builds

## v2.0.0 — 2024-07-01

### Breaking Changes

This is a major release with significant API changes. Please read the [migration guide](https://github.com/example/my-project/blob/main/MIGRATION.md).

- Complete rewrite in TypeScript
- New `createClient` API
- Improved tree-shaking support
