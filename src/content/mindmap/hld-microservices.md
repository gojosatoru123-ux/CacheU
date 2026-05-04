---
title: Microservices Architecture
articleSlug: hld-microservices
---

# Microservices

## vs Monolith
### Monolith advantages
- Simple to develop
- Easy transactions
- One codebase
- Cheaper initially
### Microservices advantages
- Independent deploy
- Team autonomy
- Tech flexibility
- Fault isolation
### When to split
- Clear domain boundaries
- Team ownership
- Scale bottlenecks

## Service Design
### Domain-Driven Design
- Bounded contexts
- Ubiquitous language
- Aggregate roots
### Single responsibility
- One domain per service
- Own its database
- Don't share schema
### API contracts
- REST or gRPC
- Versioning strategy
- OpenAPI / Protobuf

## Communication
### Synchronous
- HTTP REST
- gRPC (binary)
- Request-response
- Immediate feedback
### Asynchronous
- Message queues
- Kafka / RabbitMQ
- Fire and forget
- Multiple consumers
### Event Sourcing
- Immutable event log
- Rebuild state
- Audit trail

## Service Discovery
### Client-side
- Query registry
- Consul / Eureka
- Client load balances
### Server-side
- Load balancer queries
- Kubernetes Service
- DNS-based routing

## Resilience
### Circuit Breaker
- Stop calls to failing
- CLOSED → OPEN → HALF-OPEN
- Fast fail, prevent cascade
### Retry + Backoff
- Exponential backoff
- Jitter added
- Max retry limit
### Bulkhead
- Isolate resource pools
- Separate thread pools
- Limit blast radius
### Timeout
- Every remote call
- Fail fast
- Set by p99 latency

## Distributed Transactions
### Saga Pattern
- Choreography
- Orchestration
- Compensating txns
### Two-Phase Commit
- Coordinator node
- Blocking protocol
- Rarely used now

## Observability
### Distributed Tracing
- Trace ID propagation
- OpenTelemetry
- Jaeger / Zipkin
### Structured Logging
- JSON format
- TraceId in every log
- Correlation IDs
### Metrics
- Per-service dashboards
- Prometheus + Grafana
- RED method
