---
title: Performance
description: Optimize your app for speed with caching, lazy loading, and more.
category: Guides
order: 5
---

# Performance

## Code Splitting

Split your bundle by route to reduce initial load time:

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

## Caching Strategies

### HTTP Caching

Set cache headers for static assets:

```typescript
app.use('/static', express.static('public', {
  maxAge: '1y',
  immutable: true,
}));
```

### In-Memory Cache

```typescript
import { createCache } from 'my-project/cache';

const cache = createCache({ ttl: 60 * 1000 }); // 1 minute

async function getUser(id: string) {
  return cache.getOrSet(`user:${id}`, () => db.query.users.findFirst({
    where: eq(users.id, id),
  }));
}
```

### Redis Cache

```typescript
import { createRedisCache } from 'my-project/cache';

const cache = createRedisCache({
  url: process.env.REDIS_URL,
  prefix: 'myapp:',
  defaultTtl: 300,
});
```

## Database Query Optimization

```typescript
// BAD: N+1 problem
const posts = await db.select().from(postsTable);
for (const post of posts) {
  post.author = await db.select().from(users).where(eq(users.id, post.authorId)).then(r => r[0]);
}

// GOOD: Single query with join
const postsWithAuthors = await db
  .select()
  .from(postsTable)
  .leftJoin(users, eq(postsTable.authorId, users.id));
```

## Image Optimization

```tsx
import { Image } from 'my-project/ui';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>
```

## Performance Monitoring

```typescript
import { track } from 'my-project/analytics';

// Track Web Vitals
export function reportWebVitals(metric: WebVital) {
  track('web_vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
}
```

## Lighthouse Targets

| Metric | Target |
|--------|--------|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 90 |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
