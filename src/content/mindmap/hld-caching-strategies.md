---
title: Caching Strategies
articleSlug: hld-caching-strategies
---

# Caching

## Read Strategies
### Cache-Aside
- App manages cache
- Check → miss → DB → store
- Lazy loading
- Resilient to failures
### Read-Through
- Cache in front of DB
- Auto-populates on miss
- Simpler app code
### Refresh-Ahead
- Proactive refresh
- Predict future access
- Avoids cold cache

## Write Strategies
### Write-Through
- Write cache + DB sync
- Always consistent
- Higher write latency
### Write-Back
- Write cache first
- Async flush to DB
- Low latency writes
- Risk of data loss
### Write-Around
- Skip cache on write
- Good for rare reads
- Log / audit data

## Eviction Policies
### LRU
- Least recently used
- General purpose
- Redis default
### LFU
- Least frequently used
- Stable hot data
- Better hit rate long-term
### TTL
- Time-based expiry
- Session data
- Rate limit counters
### FIFO
- First in first out
- Simple, predictable

## Cache Invalidation
### Event-driven
- Publish on data change
- Cache subscribes
- Near-instant freshness
### Versioned keys
- Bump version counter
- Old keys expire via TTL
- Zero coordination
### Cache tags
- Group by logical key
- Invalidate groups
- Custom cache layer

## Problems
### Thundering Herd
- Key expires → stampede
- Lock-based fetch
- Stale-while-revalidate
### Cache Poisoning
- Inject bad data
- Validate before store
- Signed cache keys
### Hot Keys
- One key overwhelmed
- Local copy per server
- Shard hot keys

## Architecture
### Local cache
- In-process memory
- Sub-millisecond
- Not shared
### Distributed cache
- Redis / Memcached
- ~1ms latency
- Shared across fleet
### Multi-level
- L1: local process
- L2: Redis cluster
- L3: Database
