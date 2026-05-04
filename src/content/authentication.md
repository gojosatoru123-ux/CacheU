---
title: Authentication
description: Secure your application with built-in authentication strategies.
category: Guides
order: 1
---

# Authentication

The project supports multiple authentication strategies out of the box.

## API Key Authentication

The simplest method — pass your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.example.com/v1/users
```

In code:

```typescript
const client = createClient({
  apiKey: process.env.API_KEY,
});
```

## OAuth 2.0

For user-delegated access, use the OAuth 2.0 flow:

```typescript
import { OAuthProvider } from 'my-project/auth';

const provider = new OAuthProvider({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  redirectUri: 'https://myapp.com/callback',
  scopes: ['read:users', 'write:posts'],
});

// Generate authorization URL
const authUrl = provider.getAuthorizationUrl();

// Exchange code for tokens
const tokens = await provider.exchangeCode(code);
```

## JWT Verification

Verify incoming JWTs in your server:

```typescript
import { verifyToken } from 'my-project/auth';

app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    req.user = await verifyToken(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

## Session Management

For web applications, use cookie-based sessions:

```typescript
import { sessionMiddleware } from 'my-project/auth';

app.use(sessionMiddleware({
  secret: process.env.SESSION_SECRET,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  secure: process.env.NODE_ENV === 'production',
}));
```

## Role-Based Access Control

```typescript
import { requireRole } from 'my-project/auth';

// Only admins can access this route
app.get('/admin', requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});
```
