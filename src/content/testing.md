---
title: Testing
description: Write comprehensive tests with our testing utilities and helpers.
category: Guides
order: 4
---

# Testing

## Setup

Install testing dependencies:

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom
```

Configure Vitest in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, parseSlug } from '../lib/utils';

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });

  it('handles invalid dates', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow();
  });
});
```

## Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## API Tests

```typescript
import { createTestClient } from 'my-project/test';

describe('Users API', () => {
  const client = createTestClient({ apiKey: 'test-key' });

  it('fetches users', async () => {
    const users = await client.get<User[]>('/users');
    expect(users).toBeInstanceOf(Array);
    expect(users[0]).toHaveProperty('id');
  });

  it('creates a user', async () => {
    const user = await client.post<User>('/users', {
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(user.name).toBe('Test User');
  });
});
```

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage

# UI mode
pnpm test --ui
```

## Test Coverage

Aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%
