---
title: Caching Strategies — Practice Quiz
articleSlug: hld-caching-strategies
difficulty: Intermediate
estimatedTime: 25 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: cache-aside, pattern

Implement a `getProduct(id)` function using the cache-aside (lazy loading) pattern with Redis.

<!-- ANSWER -->
```typescript
import { createClient } from 'redis';
import { db } from './database';

const redis = createClient();
await redis.connect();

const TTL = 3600; // 1 hour

async function getProduct(id: string): Promise<Product | null> {
  const cacheKey = `product:${id}`;

  // 1. Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached); // cache hit — fast path
  }

  // 2. Cache miss — fetch from database
  const product = await db.products.findById(id);
  if (!product) return null;

  // 3. Store in cache with TTL
  await redis.setEx(cacheKey, TTL, JSON.stringify(product));

  // 4. Return data
  return product;
}
```

**Key characteristics of cache-aside:**
- Application is responsible for reading/writing the cache
- Cache only contains data that has been requested at least once
- A cache failure falls back to the database gracefully
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: write-through, write-back, consistency

Compare write-through and write-back caching. When would you choose each, and what are the failure risks?

<!-- ANSWER -->
**Write-Through:**
```
Write → Cache AND Database (synchronously)
```
```typescript
async function updateUser(id: string, data: Partial<User>) {
  await Promise.all([
    db.users.update(id, data),
    redis.setEx(`user:${id}`, 3600, JSON.stringify(data))
  ]);
}
```
- **Pro:** Cache is always consistent with DB
- **Con:** Every write is slower (two writes per operation)
- **Risk:** If DB write fails after cache write → inconsistency (use transactions)
- **Choose when:** Consistency is critical; reads are frequent after writes

**Write-Back:**
```
Write → Cache only → [async, batched] → Database
```
- **Pro:** Very low write latency
- **Con:** Data loss if cache fails before flush
- **Choose when:** Write throughput is the bottleneck; small data loss is acceptable (analytics, counters)
- **Example:** Shopping cart views counter — write to Redis instantly, batch-flush to Postgres every minute
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: thundering-herd, cache-stampede

What is the "thundering herd" or "cache stampede" problem? Implement a solution using distributed locking.

<!-- ANSWER -->
**Problem:** When a popular cache key expires simultaneously, thousands of requests all find a cache miss and race to the database — hammering it at once.

```
Key expires at 12:00:00.000
12:00:00.001 — 10,000 requests check cache → all miss → all hit DB → DB overload!
```

**Solution — Distributed lock (only one fetches, others wait):**

```typescript
async function getWithLock<T>(
  redis: RedisClient,
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number
): Promise<T> {
  // Fast path — cache hit
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = `lock:${key}`;
  const lockTtl = 10; // 10 second max hold time

  // Try to acquire lock (NX = only if not exists)
  const acquired = await redis.set(lockKey, '1', { NX: true, EX: lockTtl });

  if (!acquired) {
    // Another request is already fetching — wait and retry
    await new Promise(r => setTimeout(r, 50 + Math.random() * 50));
    return getWithLock(redis, key, fetchFn, ttl);
  }

  try {
    const data = await fetchFn();
    await redis.setEx(key, ttl, JSON.stringify(data));
    return data;
  } finally {
    await redis.del(lockKey); // always release lock
  }
}
```

**Alternative:** `stale-while-revalidate` — serve stale data while asynchronously refreshing in the background. Zero user impact.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: eviction, LRU, LFU

Explain LRU and LFU cache eviction policies. Which does Redis use by default, and how can you configure it?

<!-- ANSWER -->
**LRU (Least Recently Used):**
Evicts the item that was last accessed the longest time ago.

```
Access log: A → B → C → D → A (cache full, need space)
→ Evict B (not accessed since B→C→D→A)
```

Best for: general-purpose caching where recently accessed data is likely to be accessed again.

**LFU (Least Frequently Used):**
Evicts the item accessed the fewest total times.

```
Counts: A=10, B=2, C=7, D=1
→ Evict D (lowest count)
```

Best for: stable "hot" data (e.g., homepage content) that must survive in cache even if it wasn't accessed recently.

**Redis configuration** (`redis.conf` or `CONFIG SET`):
```
# Policy options:
# noeviction      — return error when full (default)
# allkeys-lru     — LRU across all keys
# volatile-lru    — LRU only among keys with TTL
# allkeys-lfu     — LFU across all keys
# allkeys-random  — random eviction

maxmemory 2gb
maxmemory-policy allkeys-lru
```

**Redis default:** `noeviction` — Redis returns an error on writes when memory is full. Most production caches set `allkeys-lru`.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: cache-invalidation, distributed

Describe three cache invalidation strategies. Which is the hardest to implement correctly and why?

<!-- ANSWER -->
**1. TTL (Time-To-Live) Expiration:**
Every entry expires after N seconds. Simplest approach.
```typescript
redis.setEx(`user:${id}`, 300, JSON.stringify(user)); // expire in 5min
```
- Pro: Simple, no coordination needed
- Con: Stale data for up to TTL duration; cache churn if TTL is too short

**2. Event-Driven Invalidation:**
When source data changes, publish an event to invalidate relevant cache keys.
```typescript
async function updateUser(id: string, data: Partial<User>) {
  await db.users.update(id, data);
  await eventBus.publish('user.updated', { userId: id });
}

// Cache service subscribes
eventBus.on('user.updated', ({ userId }) => redis.del(`user:${userId}`));
```
- Pro: Near-instant consistency
- Con: Requires reliable event infrastructure; missed events = stale cache forever

**3. Cache Tags / Groups:**
Tag entries with logical groups; invalidate entire groups atomically.
```typescript
await cache.set(`post:42`, post, { tags: ['user:7:posts', 'post:42'] });
// User 7 updates their profile → invalidate all their posts
await cache.invalidateTag('user:7:posts');
```
- Pro: Can invalidate related groups of data atomically
- Con: Requires custom cache layer; most caches (Redis) don't natively support tags

**Hardest to implement: Event-driven invalidation** across a distributed system, because:
- Messages can be delivered out of order (invalidate before update, then update fills stale data)
- Network failures can cause missed invalidations
- Multiple services may cache the same data independently
- The **write-invalidate** vs **write-update** ordering is a classic distributed systems problem
<!-- END -->
