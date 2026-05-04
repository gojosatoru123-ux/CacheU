---
title: API Reference — Practice Quiz
articleSlug: api-reference
difficulty: Intermediate
estimatedTime: 15 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: createClient, setup

What is the minimum configuration required to create a client, and what does the `baseURL` option do?

<!-- ANSWER -->
The minimum required option is `apiKey`. All others are optional.

```typescript
import { createClient } from 'my-project';

// Minimum required
const client = createClient({ apiKey: process.env.API_KEY });

// With baseURL — useful for staging/production environments
const client = createClient({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.staging.example.com', // defaults to production
});
```

The `baseURL` sets the root URL for all API requests made by this client instance. Override it for staging environments, local development proxies, or testing.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: generic-types, typescript, get

The `client.get<T>()` method uses a TypeScript generic. Explain how the generic parameter `T` works and why it matters.

<!-- ANSWER -->
The generic `T` tells TypeScript what type the response data will be. Without it, the return type is `unknown`.

```typescript
// Without generic — response.data is unknown
const response = await client.get('/users/42');
response.data.name; // ❌ TypeScript error: Object is of type 'unknown'

// With generic — response.data is strongly typed
interface User {
  id: number;
  name: string;
  email: string;
}
const response = await client.get<User>('/users/42');
response.data.name; // ✅ TypeScript knows this is a string
response.data.nonExistent; // ❌ TypeScript error: property doesn't exist

// Array type
const listResponse = await client.get<User[]>('/users');
listResponse.data.map(u => u.name); // ✅ fully typed
```

**Why it matters:** Type safety at compile time. You catch mismatches between what the API returns and how your code uses it before running any code.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: error-handling, ClientError

Write error handling for a `client.post()` call that distinguishes between validation errors (400), auth errors (401), and unknown errors.

<!-- ANSWER -->
```typescript
import { createClient, ClientError } from 'my-project';

const client = createClient({ apiKey: process.env.API_KEY });

async function createUser(data: { name: string; email: string }) {
  try {
    const response = await client.post<User>('/users', data);
    return response.data;
  } catch (err) {
    if (err instanceof ClientError) {
      switch (err.status) {
        case 400:
          // Validation error — show field errors to the user
          console.error('Validation failed:', err.data?.errors);
          throw new ValidationError(err.data?.errors);

        case 401:
          // Not authenticated — redirect to login
          console.error('Authentication required');
          redirectToLogin();
          break;

        case 403:
          // Forbidden — user doesn't have permission
          throw new PermissionError('You cannot create users');

        case 429:
          // Rate limited — retry after delay
          const retryAfter = err.headers?.['retry-after'] ?? 60;
          await sleep(Number(retryAfter) * 1000);
          return createUser(data); // retry

        default:
          console.error(`API error ${err.status}:`, err.message);
          throw err;
      }
    }
    // Network error, timeout, etc.
    console.error('Network error:', err);
    throw err;
  }
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: pagination, cursor, list

Implement a utility function that uses the `client.list()` method to fetch ALL pages of results automatically, handling cursor-based pagination.

<!-- ANSWER -->
```typescript
async function fetchAll<T>(
  client: ReturnType<typeof createClient>,
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T[]> {
  const results: T[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const response = await client.list<T>(endpoint, {
      ...params,
      ...(cursor ? { cursor } : {}),
      limit: 100, // fetch max per page
    });

    results.push(...response.data);

    cursor = response.meta?.nextCursor ?? null;
    hasMore = Boolean(cursor);
  }

  return results;
}

// Usage
const allUsers = await fetchAll<User>(client, '/users', { role: 'active' });
console.log(`Fetched ${allUsers.length} users total`);
```

**Important:** Be careful with `fetchAll` on large datasets. For 1M+ records, prefer streaming or async iteration to avoid holding everything in memory.
<!-- END -->
