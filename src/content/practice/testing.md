---
title: Testing — Practice Quiz
articleSlug: testing
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: unit-test, vitest

What is the difference between a unit test and an integration test? Give one example of each.

<!-- ANSWER -->
**Unit test:** Tests a single function or class in isolation. All dependencies are mocked. Runs in milliseconds.

```typescript
// Unit test — pure function, no dependencies
it('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// Unit test with mock
it('sends welcome email when user is created', async () => {
  const mockEmailService = { send: vi.fn().mockResolvedValue(undefined) };
  const service = new UserService(mockEmailService);
  
  await service.createUser({ name: 'Alice', email: 'alice@example.com' });
  
  expect(mockEmailService.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: 'alice@example.com' })
  );
});
```

**Integration test:** Tests multiple components working together, usually with a real database, file system, or HTTP layer. Slower but catches issues unit tests miss.

```typescript
// Integration test — real database
it('creates user and retrieves them', async () => {
  await db.users.create({ name: 'Alice', email: 'alice@example.com' });
  const user = await db.users.findByEmail('alice@example.com');
  expect(user?.name).toBe('Alice');
});
```
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: mocking, vi, spies

Write a Vitest test that mocks a `fetchUserById` function and verifies the UI component calls it with the correct argument.

<!-- ANSWER -->
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import * as api from './api';

describe('UserProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches and displays the user with correct id', async () => {
    // Arrange — mock the API call
    const mockUser = { id: '42', name: 'Alice', email: 'alice@example.com' };
    vi.spyOn(api, 'fetchUserById').mockResolvedValue(mockUser);

    // Act — render the component
    render(<UserProfile userId="42" />);

    // Assert — API was called with correct argument
    expect(api.fetchUserById).toHaveBeenCalledOnce();
    expect(api.fetchUserById).toHaveBeenCalledWith('42');

    // Assert — rendered correctly
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    });
  });

  it('shows loading state before data arrives', () => {
    vi.spyOn(api, 'fetchUserById').mockReturnValue(new Promise(() => {})); // never resolves
    render(<UserProfile userId="1" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: test-coverage, testing-pyramid

Describe the testing pyramid. What percentage of tests should be unit, integration, and E2E? What is a common anti-pattern?

<!-- ANSWER -->
**The Testing Pyramid:**

```
           /\
          /  \    E2E Tests (~10%)
         /────\   Slow, brittle, expensive
        /      \  
       /────────\  Integration Tests (~20%)
      /          \ Medium speed, tests real boundaries
     /────────────\ 
    /              \ Unit Tests (~70%)
   /────────────────\ Fast, isolated, cheap
```

**Recommended distribution:**
- **70% Unit tests** — fast feedback, pinpoint failures, easy to write
- **20% Integration tests** — test DB queries, HTTP handlers, external service clients
- **10% E2E tests** — test critical user journeys (login, checkout, signup)

**Common anti-pattern: The Ice Cream Cone (inverted pyramid)**
```
    /──────────────────────────────\   E2E (70%) ← brittle, slow
   /────────────────────────────\
  /────────────────────────\       Integration (20%)
 /────────────────────\
/────────────────\         Unit (10%) ← "but they pass!"
```

Teams that rely on manual testing + E2E only:
- Get slow CI pipelines (30+ minutes)
- Can't pinpoint which component failed
- Tests are "flaky" (fail randomly due to network/timing)
- Developers avoid writing tests → bugs compound

**Fix:** Add unit tests first (fastest ROI), then integration, use E2E only for critical user flows.
<!-- END -->
