---
title: System Design Fundamentals — Practice Quiz
articleSlug: hld-system-design-basics
difficulty: Advanced
estimatedTime: 35 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: cap-theorem, distributed-systems

State the CAP theorem. Which two properties does a typical relational database prioritize, and which does Cassandra prioritize?

<!-- ANSWER -->
**CAP Theorem:** In a distributed system, you can only guarantee **two** of:
- **Consistency (C)** — every read returns the most recent write
- **Availability (A)** — every request gets a response (not necessarily current)
- **Partition Tolerance (P)** — system works despite network partition

Since **network partitions are unavoidable** in distributed systems, the real choice is between **CP** and **AP**.

| System | Choice | Trade-off |
|---|---|---|
| PostgreSQL / MySQL | **CP** (traditional single-node) | Not partition tolerant by design — avoid partitions through replication |
| Cassandra | **AP** | Tunable consistency; by default eventual consistency (sacrifices C for A) |
| Zookeeper | **CP** | Sacrifices availability (becomes unavailable during partition) |

**Traditional RDBMS:** On a single node they sidestep the CAP dilemma. When clustered (e.g., Galera Cluster for MySQL), they typically choose CP — a minority partition becomes unavailable.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: estimation, back-of-envelope

Design Twitter's storage layer. Estimate: how many tweets per day, per second, and how much storage is needed for 1 year of tweets?

<!-- ANSWER -->
**Given assumptions:**
- 300M daily active users
- 10% post a tweet per day → 30M tweets/day
- Average tweet: 300 bytes (text) + 200 bytes (metadata) = 500 bytes

**Calculations:**
```
Tweets/day    = 30,000,000
Tweets/second = 30M / 86,400 ≈ 350 TPS
Storage/day   = 30M × 500 bytes = 15 GB/day
Storage/year  = 15 GB × 365 ≈ 5.5 TB/year
```

**With media (30% of tweets have images, avg 200KB):**
```
Media/day = 9M tweets × 200KB = 1.8 TB/day
Media/year ≈ 657 TB/year
```

**Total: ~1.8 TB/day, ~660 TB/year**

This is why Twitter uses object storage (S3-compatible) for media and a sharded database for tweet metadata.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: scaling, vertical, horizontal

A startup's single server handles 500 RPS. After a viral launch, they need 50,000 RPS. Walk through the scaling journey step by step.

<!-- ANSWER -->
**Step 1 — Vertical scaling (quick win)**
Upgrade from 4 CPU / 16GB to 32 CPU / 128GB. This might take you from 500 to 5,000 RPS with no code changes, but it's expensive and hits a ceiling.

**Step 2 — Separate the database**
Move the DB to a dedicated server. App servers now use all CPU for requests rather than competing with DB.

**Step 3 — Add a load balancer + multiple app servers**
```
Internet → Load Balancer → [App Server 1, App Server 2, App Server N]
```
Each server handles ~5,000 RPS → 10 servers = 50,000 RPS.

**Step 4 — Add read replicas**
90% of DB queries are reads. Add 4 replicas; route reads there, writes to primary.

**Step 5 — Caching layer (Redis)**
Cache frequently read data. A 95% cache hit rate means 95% of reads never touch the DB.

**Step 6 — CDN for static assets**
Offload images, JS, CSS to CDN — reduces server load by 40-60%.

**Step 7 — Async queues for heavy operations**
Email, image processing, PDF generation go to a queue (e.g., Kafka). App responds immediately, worker processes async.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: stateless, stateful

What is the difference between a stateless and a stateful service? Why does statelessness make horizontal scaling easier?

<!-- ANSWER -->
**Stateless service:** The server does not store any state between requests. Each request contains everything needed to process it (auth token, request body, etc.).

**Stateful service:** The server maintains state between requests (e.g., in-memory session, WebSocket connection context).

**Why stateless scales better:**

```
Stateless:
  Request 1 → Server A ✅
  Request 2 → Server B ✅ (doesn't matter — no state needed)
  Request 3 → Server C ✅

Stateful:
  Request 1 → Server A (session created on A)
  Request 2 → Server B ❌ (can't find session — wrong server!)
  → Need sticky sessions or shared session store
```

With stateless services, you can:
- Add servers instantly without coordination
- Route any request to any server (random load balancing)
- Terminate any server without losing data

Use **JWT tokens** (self-contained, signed) instead of server-side sessions to keep services stateless.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: sharding, data-partitioning, consistent-hashing

Design a sharding strategy for a URL shortener (like bit.ly) that needs to store 10 billion short URLs. How would you handle hotspots and resharding?

<!-- ANSWER -->
**Scale estimation:**
```
10B URLs × 200 bytes = 2 TB total
Read: 100K RPS (reads >> writes)
Write: 1K RPS
```

**Shard key choice — hash of short URL:**
```
shard_id = murmurHash(shortUrl) % NUM_SHARDS
```
Short URLs are random 6-character codes, so hash distribution is even.

**Problem: Resharding**
If you start with 4 shards and grow to 8, half your data needs to move. Naively this requires downtime.

**Solution: Consistent Hashing**
Place shard nodes on a 0–2³² ring. Short URL hash maps to the nearest node clockwise. Adding a node only migrates ~1/N of the total data.

```
Ring: Shard1(0) → Shard2(1B) → Shard3(2B) → Shard4(3B) → back to 0
URL hash = 1.5B → goes to Shard3

Add Shard5 between Shard2 and Shard3:
Only URLs between 1B and 1.5B move to Shard5
```

**Hotspot mitigation:**
Viral short URLs (e.g., Super Bowl link) could overwhelm one shard. Solutions:
1. Cache hot URLs in Redis — cache hit means DB is never hit
2. Use **virtual nodes** (multiple ring positions per shard) for better balance
3. **Special-case hot URLs** — detect them and route to a dedicated read fleet
<!-- END -->
