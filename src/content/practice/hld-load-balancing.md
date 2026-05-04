---
title: Load Balancing & Scaling — Practice Quiz
articleSlug: hld-load-balancing
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: algorithms, round-robin

Compare Round Robin and Least Connections load balancing. When would Least Connections outperform Round Robin?

<!-- ANSWER -->
**Round Robin:** Distributes requests in sequential order — request 1 to server A, request 2 to server B, etc.

**Least Connections:** Each new request goes to the server with the fewest active connections.

**Least Connections outperforms when:**
- Requests have **highly variable processing times** (some take 1ms, others take 5s)
- With Round Robin, slow requests pile up on their server while other servers sit idle
- Real-world example: a video transcoding endpoint mixed with lightweight `/health` endpoints

**Round Robin is fine when:**
- All requests cost roughly the same (e.g., a pure JSON API)
- Servers are homogeneous (same hardware)
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: layer4, layer7, load-balancing

A company wants to route `/api/v1/*` to its backend cluster, `/ws/*` to its WebSocket servers, and all other traffic to a static file CDN — all from the same domain. Which type of load balancer is needed and why?

<!-- ANSWER -->
**Layer 7 (Application Layer) load balancer** is required.

Layer 4 load balancers only see TCP/IP information (source/dest IP and port). They cannot inspect the HTTP URL path.

Layer 7 load balancers operate at the HTTP level and can route based on:
- URL path (`/api/v1/*`, `/ws/*`)
- HTTP headers (`Content-Type`, `Authorization`)
- Cookies
- Query parameters

**Example Nginx configuration:**
```nginx
upstream api_servers    { server api1:8080; server api2:8080; }
upstream ws_servers     { server ws1:8081; server ws2:8081; }

server {
  listen 443 ssl;

  location /api/v1/ {
    proxy_pass http://api_servers;
  }

  location /ws/ {
    proxy_pass http://ws_servers;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  location / {
    proxy_pass https://cdn.example.com;
  }
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: health-checks, availability

What should a well-designed `/health` endpoint check, and what HTTP status codes should it return?

<!-- ANSWER -->
A good `/health` endpoint checks **all critical dependencies** the service needs to function:

```typescript
app.get('/health', async (req, res) => {
  const checks = {
    status: 'healthy',
    database: 'unknown',
    cache: 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  try {
    await db.raw('SELECT 1');
    checks.database = 'connected';
  } catch {
    checks.database = 'disconnected';
  }

  try {
    await redis.ping();
    checks.cache = 'connected';
  } catch {
    checks.cache = 'disconnected';
  }

  const healthy = checks.database === 'connected' && checks.cache === 'connected';
  checks.status = healthy ? 'healthy' : 'degraded';
  
  res.status(healthy ? 200 : 503).json(checks);
});
```

| Status | Code | Meaning |
|---|---|---|
| All systems OK | `200 OK` | Load balancer keeps routing |
| Dependency failing | `503 Service Unavailable` | Load balancer removes from rotation |

**Note:** Some teams split into `/health/live` (process is running) and `/health/ready` (dependencies connected). Kubernetes uses both.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: auto-scaling, reactive, predictive

Design an auto-scaling policy for an e-commerce site that has predictable daily traffic patterns (low at night, peak at noon) AND unpredictable viral spikes. What metrics would you use and what are the scale-in/scale-out thresholds?

<!-- ANSWER -->
**Combined approach: Predictive + Reactive**

**Predictive scaling (scheduled):**
```
00:00–08:00 → minimum fleet (2 servers)
08:00–09:00 → pre-scale to 60% of peak (start at 8am before 9am ramp)
09:00–20:00 → maintain based on metrics
20:00–00:00 → gradual scale-down
```

**Reactive scaling (metric-based):**
```
Scale OUT if (any 2 minutes):
  - avg CPU > 70%
  - avg memory > 75%
  - avg response time p95 > 500ms
  - request queue depth > 1000

Scale IN if (stable for 10 minutes):
  - avg CPU < 30%
  - avg response time p95 < 100ms

Cooldown after scale-out: 3 minutes (avoid thrashing)
Cooldown after scale-in: 10 minutes
```

**Viral spike mitigation:**
- Keep a **warm pool** of pre-initialized servers that can join in <30s
- Use **circuit breakers** to shed load gracefully before scaling completes
- Set a **maximum fleet size** with a budget alarm

**Why p95 latency vs CPU:**
CPU can be high but still acceptable (batch work). High p95 latency directly affects users and is the better proxy for "the service is struggling."
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: session-affinity, sticky-sessions

Why do sticky sessions complicate scaling, and what is the preferred modern alternative?

<!-- ANSWER -->
**Sticky sessions** (session affinity) route every request from the same user to the same server using an IP hash or cookie.

**Problems with sticky sessions:**

1. **Uneven load** — a user doing a heavy operation monopolizes one server while others are idle
2. **Server failure loses sessions** — if a server dies, all its users lose their sessions (no failover)
3. **Deploy complexity** — you can't drain and restart a server without impacting users
4. **No true horizontal scaling** — you can't just add servers freely

**Modern alternative: Externalized session storage**

Move session data out of server memory into a shared store:

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
}));
```

Now any server can handle any user's request — sessions live in Redis, not server memory.

**Even better: Use JWT** (stateless tokens). No server-side storage at all.
<!-- END -->
