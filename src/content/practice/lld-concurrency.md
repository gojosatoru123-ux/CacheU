---
title: Concurrency & Multithreading — Practice Quiz
articleSlug: lld-concurrency
difficulty: Advanced
estimatedTime: 30 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: race-condition, fundamentals

Define a race condition and give a concrete JavaScript example where one could occur.

<!-- ANSWER -->
A **race condition** occurs when the outcome of a computation depends on the unpredictable order in which two or more concurrent operations complete.

```javascript
// Vulnerable: two concurrent requests can both read balance=100
// and both pass the check, even if amount=90 each
let balance = 100;

async function withdraw(amount) {
  if (balance >= amount) {           // both read 100 — check passes for both
    await someAsyncOperation();
    balance -= amount;               // 100 - 90 = 10 → 10 - 90 = -80 ❌
  }
}

// Run two concurrent withdrawals
await Promise.all([withdraw(90), withdraw(90)]);
console.log(balance); // could be -80!
```

**Fix:** Serialize access using a mutex or optimistic locking with a version counter.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: mutex, synchronization

Implement a `withMutex` helper that takes a `Mutex` and an async function, acquires the lock, runs the function, and always releases it — even on error.

<!-- ANSWER -->
```typescript
class Mutex {
  private locked = false;
  private queue: Array<() => void> = [];

  async acquire(): Promise<() => void> {
    if (!this.locked) {
      this.locked = true;
      return () => this.release();
    }
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.locked = true;
        resolve(() => this.release());
      });
    });
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) { next(); }
    else { this.locked = false; }
  }
}

async function withMutex<T>(mutex: Mutex, fn: () => Promise<T>): Promise<T> {
  const release = await mutex.acquire();
  try {
    return await fn();
  } finally {
    release(); // always runs, even if fn() throws
  }
}

// Usage
const mutex = new Mutex();
let balance = 100;

async function safeWithdraw(amount: number) {
  await withMutex(mutex, async () => {
    if (balance >= amount) balance -= amount;
  });
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: deadlock, theory

Describe deadlock with a diagram and list the four Coffman conditions. Which one is easiest to prevent in practice?

<!-- ANSWER -->
```
Thread A: holds Lock-1, waits for Lock-2
Thread B: holds Lock-2, waits for Lock-1
→ Both blocked forever — deadlock!
```

**Four Coffman Conditions (ALL must hold for deadlock):**

1. **Mutual Exclusion** — Resources can only be used by one thread at a time
2. **Hold and Wait** — Thread holds a resource while waiting for another
3. **No Preemption** — Resources can't be forcibly taken from a thread
4. **Circular Wait** — Thread A waits for B's resource, B waits for A's resource

**Easiest to prevent:** **Circular Wait** — enforce a **global ordering** on locks. Always acquire locks in the same numeric/alphabetical order. If everyone acquires Lock-1 before Lock-2, circular wait is impossible.

```typescript
// Safe: always acquire in order [lockA, lockB]
await lockA.acquire();
await lockB.acquire(); // works — same order everywhere
```
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: semaphore, concurrency

Implement a bounded `AsyncQueue` that allows at most `maxConcurrent` items to be processed simultaneously, using a semaphore internally.

<!-- ANSWER -->
```typescript
class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<() => void> {
    if (this.permits > 0) {
      this.permits--;
      return () => this.release();
    }
    return new Promise(resolve => {
      this.queue.push(() => {
        this.permits--;
        resolve(() => this.release());
      });
    });
  }

  private release(): void {
    this.permits++;
    const next = this.queue.shift();
    if (next) { this.permits--; next(); }
  }
}

async function processConcurrently<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  maxConcurrent: number
): Promise<R[]> {
  const semaphore = new Semaphore(maxConcurrent);
  return Promise.all(
    items.map(async (item) => {
      const release = await semaphore.acquire();
      try {
        return await processor(item);
      } finally {
        release();
      }
    })
  );
}

// Process 100 items but max 5 at once
const results = await processConcurrently(
  Array.from({ length: 100 }, (_, i) => i),
  async (n) => { await sleep(100); return n * 2; },
  5
);
```
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: actor-model, concurrency

What is the key insight of the Actor Model that makes it avoid traditional concurrency problems like race conditions?

<!-- ANSWER -->
The Actor Model's key insight is: **share nothing, communicate via messages**.

Instead of multiple threads reading and writing shared memory (which requires locks and causes race conditions), each actor:
- Has its own **private state** that no other actor can directly access
- Communicates only by **sending messages** to other actors' mailboxes
- Processes messages **one at a time** (sequentially within the actor)

Because no state is shared, there's nothing to race on. Erlang and Akka are built on this model, and it's why distributed systems using message queues (Kafka, AMQP) naturally avoid many concurrency bugs.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: readers-writers, lock

Explain the Readers-Writers problem and when you'd use a Read-Write lock over a regular mutex.

<!-- ANSWER -->
**The Problem:** A shared resource (e.g., a database record) can safely support **multiple concurrent readers** (reading doesn't mutate state), but a **writer needs exclusive access** (it mutates state, so no reader or other writer can run simultaneously).

Using a plain mutex blocks all readers when any reader holds the lock — that's overly restrictive.

**Read-Write Lock solution:**
- Multiple goroutines/threads can hold the **read lock** simultaneously
- Only one can hold the **write lock**, and only when no readers hold the read lock

```typescript
// When to use over mutex:
// - Read-heavy workloads (e.g., configuration cache, in-memory lookup table)
// - Write is rare but reads are frequent
// - Example: 99% of the time you're reading config, 1% you're reloading it

class Config {
  private data: Record<string, string> = {};
  private rwLock = new ReadWriteLock();

  async get(key: string): Promise<string> {
    const release = await this.rwLock.readLock();
    try { return this.data[key]; }
    finally { release(); }
  }

  async reload(newData: Record<string, string>): Promise<void> {
    const release = await this.rwLock.writeLock();
    try { this.data = newData; }
    finally { release(); }
  }
}
```

**When NOT to use:** If reads and writes are equally frequent, the RW lock overhead isn't worth it — a mutex is simpler.
<!-- END -->
