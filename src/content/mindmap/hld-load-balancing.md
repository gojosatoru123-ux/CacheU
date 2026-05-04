---
title: Load Balancing & Scaling
articleSlug: hld-load-balancing
---

# Load Balancing

## Algorithms
### Round Robin
- Sequential distribution
- Equal capacity assumed
- Simple to implement
### Weighted Round Robin
- Proportional to capacity
- Heterogeneous fleet
- Weight assignment
### Least Connections
- Fewest active conns
- Variable request cost
- WebSocket / uploads
### IP Hash
- Sticky sessions
- Same client → same server
- Stateful apps
### P2C (Power of Two)
- Pick 2 random servers
- Route to less loaded
- O(1) overhead

## Layer 4 vs Layer 7
### Layer 4 (Transport)
- IP + port only
- No content inspection
- Very fast
- Any TCP/UDP
### Layer 7 (Application)
- HTTP-aware routing
- URL path routing
- Header inspection
- Cookie-based routing
- SSL termination

## Health Checks
### Active checks
- Poll /health endpoint
- HTTP 200 = healthy
- 503 = remove from pool
### Passive checks
- Monitor real traffic
- Error rate threshold
- Latency threshold
### What to check
- Database connected
- Cache reachable
- Dependencies up

## Auto Scaling
### Reactive
- CPU / memory threshold
- Add server on spike
- Remove when quiet
### Predictive
- Historical patterns
- Pre-scale before peak
- ML-based forecasting
### Scale-out strategies
- Warm pool ready
- Container fast start
- Grace period

## Session Management
### Sticky sessions
- IP hash routing
- Cookie-based affinity
- Breaks scaling
### Externalized sessions
- Redis session store
- Any server handles
- Stateless servers
### JWT tokens
- Self-contained
- No server state
- Best for APIs

## Global Load Balancing
### GeoDNS
- Route by location
- DNS-level routing
- TTL lag exists
### Anycast
- Same IP, many nodes
- BGP routes nearest
- DDoS absorption
