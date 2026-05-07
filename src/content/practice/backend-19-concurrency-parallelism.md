````md id="8m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: concurrency, parallelism, backend

What is concurrency in backend systems?

<!-- ANSWER -->
Concurrency means multiple tasks make progress during overlapping time periods.

Tasks may:
- pause
- resume
- interleave execution

Example:

```text id="4m8qza"
Task A → Pause
Task B → Pause
Task A → Resume
````

Concurrency improves:

* responsiveness
* resource utilization
* scalability

Concurrency does not necessarily mean tasks run simultaneously.

<!-- END -->

````id="5v1xke"

```md id="2n7qpd"
<!-- QUESTION -->
difficulty: Easy
tags: parallelism, multicore-processing, backend

What is parallelism?

<!-- ANSWER -->
Parallelism means multiple tasks execute simultaneously using multiple CPU cores or processors.

Example:

```text id="6m2xqc"
CPU Core 1 → Task A
CPU Core 2 → Task B
````

Benefits:

| Benefit                | Explanation                 |
| ---------------------- | --------------------------- |
| Faster execution       | Multiple operations at once |
| Better CPU utilization | Use multicore processors    |
| Higher throughput      | More work completed         |

Parallelism requires hardware capable of simultaneous execution.

<!-- END -->

````id="9x2vke"

```md id="4q7xwc"
<!-- QUESTION -->
difficulty: Easy
tags: concurrency-vs-parallelism, backend, operating-systems

What is the difference between concurrency and parallelism?

<!-- ANSWER -->
Concurrency focuses on managing multiple tasks efficiently.

Parallelism focuses on executing tasks simultaneously.

Comparison:

| Concurrency | Parallelism |
|---|---|
| Tasks overlap | Tasks run simultaneously |
| Improves responsiveness | Improves execution speed |
| Can use single CPU core | Usually requires multiple cores |

Example:

```text id="6p1qxt"
Concurrency:
Task switching

Parallelism:
Tasks running together
````

A system can be:

* concurrent without parallelism
* parallel with concurrency

Both are important in modern backend systems.

<!-- END -->

````id="3x5vke"

```md id="1n8qpd"
<!-- QUESTION -->
difficulty: Medium
tags: multithreading, backend, operating-systems

What is multithreading?

<!-- ANSWER -->
Multithreading allows multiple threads to execute within a single process.

Example:

```text id="5m2xqc"
Process
 ├── Thread 1
 ├── Thread 2
 └── Thread 3
````

Benefits:

| Benefit               | Explanation             |
| --------------------- | ----------------------- |
| Concurrent execution  | Multiple tasks handled  |
| Shared memory         | Faster communication    |
| Better responsiveness | Non-blocking operations |

Common backend uses:

* web servers
* database systems
* background workers

Threads share process resources, which introduces synchronization challenges.

<!-- END -->

````id="8w4qza"

```md id="5x1vyt"
<!-- QUESTION -->
difficulty: Medium
tags: race-condition, concurrency, backend-bugs

What is a race condition?

<!-- ANSWER -->
A race condition occurs when multiple threads or processes access shared data simultaneously in an unsafe way.

Example:

```text id="clt6p5"
Thread A reads value = 5
Thread B reads value = 5
Both increment
Final value becomes incorrect
````

Problems caused:

* inconsistent data
* corrupted state
* unpredictable behavior

Common solutions:

| Solution          | Purpose          |
| ----------------- | ---------------- |
| Mutexes           | Exclusive access |
| Atomic operations | Safe updates     |
| Locks             | Synchronization  |

Race conditions are common concurrency bugs in backend systems.

<!-- END -->

````id="2v7qwr"

```md id="9m3xpd"
<!-- QUESTION -->
difficulty: Medium
tags: deadlock, synchronization, distributed-systems

What is a deadlock?

<!-- ANSWER -->
A deadlock occurs when multiple threads wait indefinitely for resources held by each other.

Example:

```text id="4q2xmc"
Thread A holds Lock 1
Waiting for Lock 2

Thread B holds Lock 2
Waiting for Lock 1
````

Result:

```text id="nh6dzq"
System stops progressing
```

Deadlock prevention techniques:

| Technique       | Explanation               |
| --------------- | ------------------------- |
| Lock ordering   | Consistent lock sequence  |
| Timeouts        | Abort long waits          |
| Reduced locking | Minimize shared resources |

Deadlocks are serious concurrency problems in backend systems.

<!-- END -->

````id="7n1qxt"

```md id="3m5vke"
<!-- QUESTION -->
difficulty: Hard
tags: asynchronous-programming, event-loop, backend

What is asynchronous programming?

<!-- ANSWER -->
Asynchronous programming allows tasks to run without blocking the main execution flow.

Instead of waiting:

```text id="4v8qpd"
Request → Wait → Response
````

systems continue processing other work:

```text id="5w2qwc"
Request → Background Wait → Continue Execution
```

Benefits:

| Benefit                | Explanation             |
| ---------------------- | ----------------------- |
| Better responsiveness  | Non-blocking operations |
| Higher scalability     | Handle many requests    |
| Efficient I/O handling | Reduce idle waiting     |

Common async operations:

* database queries
* API calls
* file I/O

Asynchronous programming is heavily used in high-performance backend systems.

<!-- END -->

````id="5w2qwc"

```md id="1x7vza"
<!-- QUESTION -->
difficulty: Hard
tags: event-loop, nodejs, concurrency

What is the event loop?

<!-- ANSWER -->
The event loop is a mechanism that manages asynchronous operations in event-driven systems.

Architecture:

```text id="6m3qpd"
Event Queue → Event Loop → Callback Execution
````

Behavior:

* executes tasks sequentially
* handles async callbacks
* avoids blocking operations

Example systems:

* Node.js
* browsers
* async runtimes

Benefits:

| Benefit               | Explanation                    |
| --------------------- | ------------------------------ |
| Efficient concurrency | Handle many I/O tasks          |
| Low memory overhead   | Fewer threads needed           |
| High scalability      | Massive concurrent connections |

The event loop is central to asynchronous backend architectures.

<!-- END -->

````id="8p5vke"

```md id="6n2xpd"
<!-- QUESTION -->
difficulty: Hard
tags: thread-safety, concurrency, backend-systems

What does thread-safe mean?

<!-- ANSWER -->
Thread-safe code behaves correctly when accessed by multiple threads concurrently.

Example unsafe scenario:

```text id="1q8vza"
Multiple threads modify shared variable simultaneously
````

Thread-safe techniques:

| Technique         | Purpose                     |
| ----------------- | --------------------------- |
| Mutexes           | Prevent simultaneous access |
| Immutable data    | Avoid modification          |
| Atomic operations | Safe concurrent updates     |

Benefits:

* predictable behavior
* consistent data
* reduced concurrency bugs

Thread safety is critical in:

* multithreaded servers
* shared caches
* concurrent applications

<!-- END -->

````id="1q8vza"

```md id="9m4qwc"
<!-- QUESTION -->
difficulty: Hard
tags: actor-model, distributed-systems, concurrency

What is the Actor Model in concurrent systems?

<!-- ANSWER -->
The Actor Model is a concurrency model where independent actors communicate using messages instead of shared memory.

Actor behavior:
- receive messages
- process state internally
- send messages to other actors

Architecture:

```text id="7v2xpd"
Actor A ↔ Actor B ↔ Actor C
````

Benefits:

| Benefit                   | Explanation             |
| ------------------------- | ----------------------- |
| Reduced shared-state bugs | No direct shared memory |
| Better scalability        | Independent actors      |
| Fault isolation           | Actor-level failures    |

Common actor-based systems:

* Akka
* Erlang
* Orleans

The Actor Model is widely used in distributed and concurrent backend systems.

<!-- END -->