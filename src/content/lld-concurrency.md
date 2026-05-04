---
title: Concurrency & Multithreading
description: Understand race conditions, locks, thread pools, async patterns, and how to write safe concurrent code.
category: Low Level Design
order: 3
---

# Concurrency & Multithreading

Concurrency is about dealing with multiple things happening at once. Parallelism is about doing multiple things at once. Understanding both is critical for building high-performance systems.

## Core Concepts

### Process vs Thread vs Coroutine

| | Process | Thread | Coroutine |
|---|---|---|---|
| Memory | Own memory space | Shared with parent | Same thread |
| Overhead | High | Medium | Very low |
| Communication | IPC (pipes, sockets) | Shared memory | Direct |
| Crash isolation | Yes | No | No |

### The Race Condition

A race condition occurs when the outcome depends on the non-deterministic order of operations.

```typescript
// Unsafe: two requests can read balance simultaneously
let balance = 100;

async function withdraw(amount: number) {
  if (balance >= amount) {  // <- read
    await doSomeAsyncWork();
    balance -= amount;        // <- write: balance might have changed!
  }
}
```

---

## Synchronization Primitives

### Mutex (Mutual Exclusion Lock)

```typescript
class Mutex {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<() => void> {
    if (this.locked) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }
    this.locked = true;
    return () => {
      this.locked = false;
      this.queue.shift()?.();
    };
  }
}

const mutex = new Mutex();
async function safeWithdraw(amount: number) {
  const release = await mutex.acquire();
  try {
    if (balance >= amount) balance -= amount;
  } finally {
    release();
  }
}
```

### Semaphore

Limits concurrent access to a resource (e.g. max 5 DB connections at once).

```typescript
class Semaphore {
  private count: number;
  private queue: (() => void)[] = [];

  constructor(maxConcurrent: number) {
    this.count = maxConcurrent;
  }

  async acquire(): Promise<() => void> {
    if (this.count > 0) {
      this.count--;
    } else {
      await new Promise<void>(r => this.queue.push(r));
    }
    return () => {
      this.count++;
      this.queue.shift()?.();
    };
  }
}

const dbPool = new Semaphore(5);
async function queryDB(sql: string) {
  const release = await dbPool.acquire();
  try { return await db.query(sql); }
  finally { release(); }
}
```

---

## Common Concurrency Problems

### Deadlock

Two threads each hold a lock the other needs.

```
Thread A: holds Lock 1, waits for Lock 2
Thread B: holds Lock 2, waits for Lock 1  ← deadlock!
```

**Prevention:** Always acquire locks in the same order across all threads.

### Starvation

A thread is perpetually denied resources because other threads keep taking priority.

**Prevention:** Use fair locks (FIFO queues), or set timeouts.

### Livelock

Threads are active but making no progress — they keep reacting to each other.

**Prevention:** Add randomized backoff.

---

## The Actor Model

Instead of sharing memory, actors communicate only via messages. No locks needed.

```typescript
class Actor {
  private mailbox: unknown[] = [];
  private processing = false;

  send(message: unknown) {
    this.mailbox.push(message);
    if (!this.processing) this.process();
  }

  private async process() {
    this.processing = true;
    while (this.mailbox.length > 0) {
      const msg = this.mailbox.shift();
      await this.handle(msg);
    }
    this.processing = false;
  }

  protected async handle(msg: unknown) { /* override */ }
}
```

---

## Async Patterns

### Promise Pool (bounded concurrency)

```typescript
async function pooledMap<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  const executing = new Set<Promise<void>>();

  for (const item of items) {
    const p = fn(item).then(r => { results.push(r); });
    executing.add(p);
    p.finally(() => executing.delete(p));

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
```

### Read-Write Lock

Allow multiple concurrent readers, but exclusive writers.

```typescript
class ReadWriteLock {
  private readers = 0;
  private writing = false;
  private queue: (() => void)[] = [];

  async readLock(): Promise<() => void> {
    while (this.writing) await new Promise<void>(r => this.queue.push(r));
    this.readers++;
    return () => {
      this.readers--;
      if (this.readers === 0) this.queue.shift()?.();
    };
  }

  async writeLock(): Promise<() => void> {
    while (this.writing || this.readers > 0)
      await new Promise<void>(r => this.queue.push(r));
    this.writing = true;
    return () => {
      this.writing = false;
      this.queue.shift()?.();
    };
  }
}
```

---

## Memory Models

### Happens-Before Relationship

If operation A "happens-before" B, B sees the effects of A. Language memory models define what guarantees they make.

### Volatile / Atomic Operations

In Java, `volatile` ensures visibility across threads. In modern JS, `SharedArrayBuffer` + `Atomics` provides similar guarantees.

```javascript
const sab = new SharedArrayBuffer(4);
const arr = new Int32Array(sab);

// Thread 1
Atomics.store(arr, 0, 42);

// Thread 2
const val = Atomics.load(arr, 0); // guaranteed to see 42
```
