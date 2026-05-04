---
title: System Design Fundamentals
articleSlug: hld-system-design-basics
---

# System Design

## Requirements
### Scale
- Users count
- Requests per second
- Data volume
### Latency
- p50 / p99 targets
- Acceptable delay
- User perception
### Availability
- 99.9% = 8.7 hrs/yr down
- 99.99% = 52 min/yr down
- SLA contracts
### Consistency
- Strong vs eventual
- CAP theorem trade-off

## Scaling
### Vertical (Scale Up)
- More CPU / RAM
- Simple, no code change
- Has ceiling
### Horizontal (Scale Out)
- Add more servers
- Load balancer needed
- Stateless required
### Data Partitioning
- Horizontal sharding
- Vertical splitting
- Consistent hashing

## CAP Theorem
### Consistency
- Every read latest write
- RDBMS, Zookeeper
### Availability
- Always responds
- Cassandra, DynamoDB
### Partition Tolerance
- Survives network splits
- Always required
### CP vs AP choice
- CP: banking, inventory
- AP: social feeds, logs

## Architecture Layers
### CDN
- Static assets
- Edge caching
- GeoDNS routing
### Load Balancer
- Distribute traffic
- Health checks
- SSL termination
### Cache Layer
- Redis / Memcached
- Reduce DB load
- TTL management
### Database
- Primary + replicas
- Read / write split
- Async replication
### Message Queue
- Async processing
- Decouples services
- Kafka / SQS

## Estimation
### Storage math
- 1M users × 1KB = 1 GB
- Bytes → KB → MB → GB → TB
### Bandwidth math
- RPS × payload size
- CDN offloads majority
### Back-of-envelope
- Round numbers OK
- Orders of magnitude
- Identify bottlenecks
