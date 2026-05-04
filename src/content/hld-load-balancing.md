---
title: Load Balancing & Scaling
description: How load balancers work, algorithms they use, and strategies for horizontal scaling.
category: High Level Design
order: 2
---

# Load Balancing & Scaling

A load balancer distributes incoming traffic across multiple backend servers to prevent any single server from becoming a bottleneck.

## Why Load Balancing?

Without a load balancer:
- One server handles all traffic → single point of failure
- Can't scale without changing client configuration
- No way to do rolling deployments without downtime

With a load balancer:
- Traffic spread evenly across a fleet
- Unhealthy servers are automatically removed from rotation
- New servers can be added without downtime
- Zero-downtime deployments possible

---

## Load Balancing Algorithms

### Round Robin

Requests are distributed sequentially across servers.

```
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A (repeat)
```

**Best for:** Servers with equal capacity and similar request costs.

---

### Weighted Round Robin

Servers with more capacity receive proportionally more requests.

```
Server A (weight 3): gets 3 of every 5 requests
Server B (weight 2): gets 2 of every 5 requests
```

**Best for:** Heterogeneous fleet (mixed instance sizes).

---

### Least Connections

New requests go to the server with the fewest active connections.

**Best for:** Long-lived connections (WebSockets, file uploads) where request cost varies.

---

### IP Hash (Sticky Sessions)

The client's IP is hashed to consistently route them to the same server.

```
hash(client_ip) % num_servers = server_index
```

**Best for:** Stateful applications that store session data in memory.
**Problem:** Uneven distribution if clients have different request rates.

---

### Least Response Time

Routes to the server with the lowest average response time AND fewest connections.

**Best for:** Latency-sensitive services.

---

### Random with Two Choices (P2C)

Pick two random servers, route to the one with fewer connections. Achieves near-optimal balance with O(1) overhead.

**Best for:** Very large fleets where tracking all server loads is expensive.

---

## Layer 4 vs Layer 7 Load Balancing

### Layer 4 (Transport Layer)

Routes based on IP and TCP/UDP port. Does not inspect the content of packets.

- Extremely fast (no packet inspection)
- Can't route based on URL path, headers, or cookies
- Works for any TCP/UDP traffic

### Layer 7 (Application Layer)

Routes based on HTTP headers, URL paths, cookies, or request body.

- Can route `/api/*` to API servers and `/static/*` to CDN
- Can rewrite URLs, add headers, terminate TLS
- Slightly more overhead
- Examples: Nginx, HAProxy, AWS ALB

```
/api/users   → API server fleet
/api/orders  → Orders microservice
/images/*    → Image CDN
/ws/*        → WebSocket servers
```

---

## Health Checks

Load balancers continuously probe backend servers.

```http
GET /health HTTP/1.1
Host: server-a.internal

HTTP/1.1 200 OK
{"status":"healthy","db":"connected","cache":"connected"}
```

If a server fails health checks consecutively (e.g., 3 times), it's removed from rotation until it recovers.

---

## Auto Scaling

Automatically add or remove servers based on load.

### Reactive Scaling
```
if (avg_cpu > 70%) → add server
if (avg_cpu < 30%) → remove server
```

**Problem:** Slow to react — the spike has already hit by the time new servers are ready.

### Predictive Scaling

Use historical patterns to scale _before_ traffic spikes.

```
Every day at 9am traffic increases → start scaling at 8:50am
```

### Scale-Up Delay Strategies

- Keep a warm pool of pre-initialized servers
- Use container-based deployment (starts in seconds vs minutes for VMs)
- Design services to handle sudden 2x traffic gracefully

---

## Global Load Balancing (GeoDNS)

Route users to the nearest data center using DNS.

```
User in Europe → DNS returns EU data center IP
User in Asia   → DNS returns Asia-Pacific data center IP
User in US     → DNS returns US data center IP
```

**Tools:** AWS Route 53, Cloudflare, Akamai

---

## Connection Draining

When removing a server from rotation:
1. Stop sending new connections to it
2. Allow in-flight requests to complete (e.g., 30s window)
3. Then shut down the server

This enables zero-downtime rolling deployments.

---

## Common Pitfalls

| Mistake | Problem | Fix |
|---|---|---|
| No health checks | Dead servers get traffic | Add `/health` endpoint |
| Session data on server | Sticky sessions break scaling | Move session to Redis/DB |
| Single load balancer | New SPOF | Deploy LB in HA pair or use anycast |
| Cold start latency | First request to new server is slow | Warm up with synthetic traffic |
| Too-aggressive scaling | Thrashing (add then remove servers repeatedly) | Add cooldown periods |
