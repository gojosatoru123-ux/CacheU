---
title: Concurrency & Multithreading
articleSlug: lld-concurrency
---

# Concurrency

## Core Concepts
### Process vs Thread
- Process: own memory
- Thread: shared memory
- Coroutine: same thread
### Race Condition
- Non-deterministic order
- Shared mutable state
- Need synchronization
### Parallelism vs Concurrency
- Concurrency: deal with many
- Parallelism: do many at once

## Synchronization
### Mutex
- Exclusive lock
- One thread at a time
- acquire / release
### Semaphore
- Count-based lock
- Limit concurrency
- Connection pools
### Read-Write Lock
- Many readers OK
- Writers need exclusive
- Read-heavy workloads

## Problems
### Deadlock
- Circular wait
- Four Coffman conditions
- Prevention: lock ordering
### Starvation
- Thread denied resources
- Fix: fair FIFO queues
### Livelock
- Active but no progress
- Fix: randomized backoff

## Patterns
### Actor Model
- No shared state
- Message passing only
- Erlang / Akka
### Thread Pool
- Reuse threads
- Bounded concurrency
- Task queues
### Async / Await
- Non-blocking IO
- Event loop
- Promise-based

## Memory Models
### Happens-Before
- Ordering guarantee
- Visibility across threads
### Atomic Operations
- Lock-free
- Compare-and-swap
- SharedArrayBuffer
