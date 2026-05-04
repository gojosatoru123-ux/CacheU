---
title: Caching Strategies
description: Cache-aside, write-through, write-back, TTL, eviction policies, and cache invalidation — the hardest problem in CS.
category: High Level Design
order: 3
---

# Caching Strategies

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Caching stores the result of expensive operations so they can be served quickly on subsequent requests.

## Why Cache?

| Without Cache | With Cache |
|---|---|
| DB query: 50ms | Cache hit: 0.1ms |
| 100K RPS → 100K DB queries | 100K RPS → 5K DB queries (95% hit rate) |
| DB saturates at scale | DB load stays manageable |

---

## Cache Read Strategies

### Cache-Aside (Lazy Loading)

The application manages the cache explicitly.

```
Read request:
  1. Check cache
  2a. Cache hit → return data
  2b. Cache miss → query DB → store in cache → return data
```

```typescript
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user)); // TTL: 1hr
  return user;
}
```

**Pros:** Only requested data is cached; cache failures don't break the system  
**Cons:** Cache miss penalty (2 round trips); possible stale data

---

### Read-Through

Cache sits in front of DB. Application always reads from cache; cache fetches from DB on miss.

```
App → Cache → (on miss) → DB
```

**Pros:** Simpler application code; cache always consistent with reads  
**Cons:** First request always misses; harder to control what gets cached

---

## Cache Write Strategies

### Write-Through

Data is written to cache and DB simultaneously.

```typescript
async function updateUser(id: string, data: Partial<User>) {
  await db.users.update(id, data);                               // write to DB
  await redis.setex(`user:${id}`, 3600, JSON.stringify(data));  // write to cache
}
```

**Pros:** Cache always up to date  
**Cons:** Every write hits both systems; increased write latency

---

### Write-Back (Write-Behind)

Data is written to cache first, then asynchronously flushed to DB.

```
Write → Cache → [async, batched] → DB
```

**Pros:** Very low write latency; can batch writes for efficiency  
**Cons:** Data loss risk if cache fails before flush; complex implementation

---

### Write-Around

Data is written directly to DB, bypassing cache.

```
Write → DB (cache not updated)
Read  → Cache miss → DB → Cache
```

**Best for:** Data that is written once and read rarely (e.g., logs, audit trails).

---

## Cache Eviction Policies

When the cache is full, which entries should be removed?

### LRU (Least Recently Used)

Remove the entry that was accessed least recently.

```
Access order: A → B → C → D → A
Cache full, evict: B (longest time since access)
```

**Best for:** Most workloads. Redis default.

---

### LFU (Least Frequently Used)

Remove the entry accessed the fewest times.

```
Counts: A=10, B=2, C=8, D=1
Cache full, evict: D (lowest count)
```

**Best for:** Workloads with stable "hot" data that must be retained.

---

### TTL (Time-To-Live)

Entries expire after a fixed duration regardless of access patterns.

```typescript
await redis.setex('session:abc123', 1800, JSON.stringify(session)); // expires in 30min
```

**Best for:** Session data, rate limit counters, one-time tokens.

---

## Cache Invalidation Patterns

### Event-Driven Invalidation

When data changes, publish an event. Cache subscribers delete or update relevant keys.

```
User updates profile
  → Publish event: user.updated { userId: '123' }
  → Cache service deletes: cache.del('user:123')
  → Next read repopulates from DB
```

### Cache Tags / Groups

Group cache entries by tags. Invalidate all entries with a given tag.

```typescript
// Store with tag
await cache.set('post:42', post, { tags: ['post', 'user:7'] });

// Invalidate all posts for user 7
await cache.invalidateTag('user:7');
```

### Versioned Keys

Instead of invalidating, bump a version counter. Old keys become orphaned and expire via TTL.

```typescript
const version = await redis.get('user:123:version'); // e.g., "5"
const data = await redis.get(`user:123:v${version}`);
```

---

## Thundering Herd Problem

When a popular cache key expires, thousands of requests hit the DB simultaneously.

**Solutions:**

1. **Probabilistic Early Expiration** — Randomly refresh before TTL expires
2. **Lock + Single Fetch** — Only one request fetches from DB; others wait
3. **Stale-While-Revalidate** — Serve stale data while refreshing in background

```typescript
async function getWithLock(key: string, fetchFn: () => Promise<unknown>) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = `lock:${key}`;
  const locked = await redis.set(lockKey, '1', 'NX', 'EX', 5); // 5s lock

  if (!locked) {
    // Another request is fetching — wait and retry
    await sleep(100);
    return getWithLock(key, fetchFn);
  }

  const data = await fetchFn();
  await redis.setex(key, 3600, JSON.stringify(data));
  await redis.del(lockKey);
  return data;
}
```

---

## Distributed Cache vs Local Cache

| | Local (in-process) | Distributed (Redis/Memcached) |
|---|---|---|
| Latency | Sub-millisecond | ~1ms |
| Consistency | Per-server only | Shared across all servers |
| Capacity | Limited by server RAM | Scales horizontally |
| Eviction on deploy | Yes (process restart) | No |
| Best for | Computed config, static data | Sessions, user data, rate limits |
