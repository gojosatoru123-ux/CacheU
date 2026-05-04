---
title: REST vs GraphQL vs gRPC
articleSlug: net-rest-graphql
---

# API Paradigms

## REST
### Core constraints
- Stateless requests
- Resource-based URLs
- Uniform interface
- Cacheable responses
### HTTP methods
- GET: read
- POST: create
- PUT: replace
- PATCH: partial update
- DELETE: remove
### Problems
- Over-fetching
- Under-fetching (N+1)
- Multiple round trips
### Versioning
- URL: /api/v1/
- Header: Accept version
- Query param: ?v=2
### Best for
- Public APIs
- Simple CRUD
- Third-party consumers

## GraphQL
### Core concepts
- Single endpoint
- Client defines shape
- Strongly typed schema
### Query types
- Query: read data
- Mutation: write data
- Subscription: real-time
### Advantages
- No over/under-fetching
- Self-documenting
- Introspection
### Disadvantages
- Complex caching
- N+1 without DataLoader
- Harder to secure
### DataLoader
- Batch DB queries
- Deduplicate loads
- Solves N+1 problem
### Best for
- Mobile apps
- Complex data graphs
- Diverse client needs

## gRPC
### Protocol Buffers
- Binary serialization
- Smaller than JSON
- Strongly typed .proto
### HTTP/2 features
- Multiplexed streams
- Header compression
- Persistent connections
### Streaming types
- Unary (one-to-one)
- Server streaming
- Client streaming
- Bidirectional
### Advantages
- Very fast (binary)
- Code generation
- Strong type safety
### Disadvantages
- No browser native
- Binary not readable
- Proto schema management
### Best for
- Internal microservices
- High-throughput systems
- Multi-language teams

## Comparison
### Performance
- gRPC: fastest
- REST: good
- GraphQL: good
### Developer experience
- REST: simple, familiar
- GraphQL: flexible queries
- gRPC: tooling required
### Caching
- REST: URL-based (easy)
- GraphQL: complex
- gRPC: no built-in
