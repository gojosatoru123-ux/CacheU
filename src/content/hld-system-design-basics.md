---
title: System Design Fundamentals
description: The essential vocabulary, trade-offs, and mental models you need to design any large-scale system.
category: High Level Design
order: 1
---

# System Design Fundamentals

System design is about making informed architectural choices given a set of requirements and constraints. There is no single right answer — it's always a set of trade-offs.

## The Four Non-Negotiables

Before designing anything, clarify these four dimensions:

1. **Scale** — How many users? Requests per second? Data volume?
2. **Latency** — What's acceptable response time? p50? p99?
3. **Availability** — 99.9%? 99.99%? (downtime per year in minutes)
4. **Consistency** — Can users see stale data temporarily?

---

## Back-of-the-Envelope Estimation

| Metric | Value |
|---|---|
| Requests/sec (read-heavy app) | 10K–100K RPS |
| DB read latency (SSD) | ~0.1ms |
| DB write latency | ~1ms |
| Network round trip (same DC) | ~0.5ms |
| Network round trip (cross-region) | ~100ms |
| Storage: 1M users × 1KB profile | ~1 GB |
| Bandwidth: 100K RPS × 1KB | ~100 MB/s |

**Example:** Design Twitter's timeline for 100M users.
- 100M users × 10 tweets/day = 1B tweets/day = ~12,000 tweets/sec
- If 1% of users are "celebrities" with 1M followers, fan-out is expensive
- Solution: hybrid push/pull model

---

## CAP Theorem

In a distributed system, you can only guarantee **two** of:

- **C**onsistency — every read gets the most recent write
- **A**vailability — every request gets a response (not necessarily the latest)
- **P**artition Tolerance — system continues despite network failures

Since network partitions are inevitable, you choose between **CP** or **AP**.

| System | Choice | Trade-off |
|---|---|---|
| Traditional RDBMS | CP | Sacrifices availability under partition |
| Cassandra | AP | Sacrifices strict consistency |
| Zookeeper | CP | Strong consistency, lower availability |
| DynamoDB | AP (configurable) | Tunable consistency |

---

## Vertical vs Horizontal Scaling

### Vertical Scaling (Scale Up)

Add more resources to the existing machine — more CPU, RAM, faster disk.

**Pros:** Simple, no code changes, low latency  
**Cons:** Has a ceiling, single point of failure, expensive at high end

### Horizontal Scaling (Scale Out)

Add more machines and distribute the load.

**Pros:** Virtually unlimited scale, fault tolerant  
**Cons:** Complexity — distributed state, network latency, coordination overhead

---

## The Request Lifecycle (Full Stack View)

```
Client
  ↓ DNS lookup
DNS Server → IP address
  ↓ TCP handshake
CDN (static assets cached here)
  ↓ cache miss
Load Balancer
  ↓ round-robin / least connections
API Server (stateless, horizontally scaled)
  ↓ cache check
Cache Layer (Redis)
  ↓ cache miss
Database (primary)
  ↓ async replication
Database Replicas (reads)
```

---

## Stateless vs Stateful Services

### Stateless

Each request contains everything needed to process it. Servers hold no session data.

```
Client → any API server → DB (source of truth)
```

- Easy to scale: add any number of servers
- Use JWT tokens (self-contained) instead of server-side sessions

### Stateful

The server holds state between requests (e.g., WebSocket connections, gaming servers).

- Harder to scale: need sticky sessions or state synchronization
- Use consistent hashing to route the same user to the same server

---

## Data Partitioning Strategies

### Horizontal Partitioning (Sharding)

Split rows across databases by a shard key.

```
User IDs 0–9M    → Shard 1
User IDs 9M–18M  → Shard 2
User IDs 18M+    → Shard 3
```

**Problems:**
- Hotspot shards if the key isn't evenly distributed
- Cross-shard queries are expensive
- Resharding is painful

### Consistent Hashing

Nodes and keys are placed on a ring. Keys go to the first node clockwise. Adding/removing a node only moves ~K/n keys (K = total keys, n = number of nodes).

### Vertical Partitioning

Split by columns — store user profile in one DB, user activity in another.

---

## Key Bottlenecks and Solutions

| Bottleneck | Symptoms | Solutions |
|---|---|---|
| DB reads | High query latency | Read replicas, caching |
| DB writes | Write throughput limit | Sharding, write batching, async writes |
| API throughput | High server CPU | Horizontal scaling, load balancing |
| Network | High data transfer costs | CDN, compression, edge computing |
| Storage | Disk full | Object storage (S3), cold/hot tiers |
