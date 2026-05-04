---
title: API Reference
description: Complete API reference for all exported functions and types.
category: Reference
order: 1
---

# API Reference

## Core Functions

### `createClient(options)`

Creates a new client instance with the given options.

```typescript
import { createClient } from 'my-project';

const client = createClient({
  apiKey: process.env.API_KEY,
  baseUrl: 'https://api.example.com',
  timeout: 5000,
});
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your API key |
| `baseUrl` | `string` | No | Base URL for requests |
| `timeout` | `number` | No | Request timeout in ms |

**Returns:** `Client`

---

### `client.get<T>(path, options?)`

Performs a GET request.

```typescript
const users = await client.get<User[]>('/users', {
  params: { page: 1, limit: 20 },
});
```

### `client.post<T>(path, body, options?)`

Performs a POST request.

```typescript
const newUser = await client.post<User>('/users', {
  name: 'Jane Doe',
  email: 'jane@example.com',
});
```

### `client.put<T>(path, body, options?)`

Performs a PUT request to update a resource.

### `client.delete(path, options?)`

Deletes a resource at the given path.

## Types

### `User`

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}
```

### `ApiError`

```typescript
class ApiError extends Error {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}
```

## Error Handling

All methods throw `ApiError` on non-2xx responses:

```typescript
try {
  const user = await client.get<User>('/users/999');
} catch (err) {
  if (err instanceof ApiError && err.statusCode === 404) {
    console.log('User not found');
  }
}
```
