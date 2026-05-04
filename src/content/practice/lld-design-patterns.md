---
title: Design Patterns — Practice Quiz
articleSlug: lld-design-patterns
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: creational, singleton

What problem does the Singleton pattern solve, and what is a common drawback of overusing it?

<!-- ANSWER -->
**Problem solved:** The Singleton pattern ensures a class has only **one instance** throughout the application's lifetime and provides a global access point to it. This is useful for shared resources like database connection pools, configuration managers, and loggers.

**Drawback:** Singletons introduce **global state**, which makes unit testing difficult because tests can't easily swap in a mock implementation. They also create hidden dependencies — callers don't know they're depending on the Singleton unless they look inside the implementation. Prefer **dependency injection** where possible.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: creational, builder

Implement a minimal `HttpRequestBuilder` class that supports `.url()`, `.method()`, `.header()`, and `.build()` using the Builder pattern.

<!-- ANSWER -->
```typescript
interface HttpRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
}

class HttpRequestBuilder {
  private _url = '';
  private _method: HttpRequest['method'] = 'GET';
  private _headers: Record<string, string> = {};

  url(url: string): this {
    this._url = url;
    return this;
  }

  method(method: HttpRequest['method']): this {
    this._method = method;
    return this;
  }

  header(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  build(): HttpRequest {
    if (!this._url) throw new Error('URL is required');
    return { url: this._url, method: this._method, headers: this._headers };
  }
}

const req = new HttpRequestBuilder()
  .url('https://api.example.com/users')
  .method('POST')
  .header('Content-Type', 'application/json')
  .header('Authorization', 'Bearer token123')
  .build();
```

Key point: each method returns `this` for **method chaining**. `build()` validates and constructs the final object.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: structural, adapter

In one sentence, what is the core job of the Adapter pattern?

<!-- ANSWER -->
The Adapter pattern **converts the interface of a class into another interface that clients expect**, allowing two incompatible interfaces to work together without modifying either one.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: behavioral, observer

Describe the Observer pattern and give two real-world examples of it in software systems.

<!-- ANSWER -->
**Pattern:** The Observer pattern defines a **one-to-many dependency** between objects. When the *subject* (observable) changes state, all registered *observers* are automatically notified and updated.

**Real-world examples:**
1. **Event listeners in the DOM** — `button.addEventListener('click', handler)`. The button is the subject; handler functions are observers. Multiple listeners can subscribe to the same event.
2. **Kafka/message queues** — A `order.placed` topic is the subject. Multiple consumer groups (billing, shipping, notifications) independently receive and process every event.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: behavioral, strategy, open-closed

A payment service currently uses `if/else` blocks to handle PayPal, Stripe, and Crypto payments. Refactor this to use the Strategy pattern, and explain how this relates to the Open/Closed Principle.

<!-- ANSWER -->
```typescript
// Before: violates Open/Closed — every new gateway requires editing this function
function processPayment(gateway: string, amount: number) {
  if (gateway === 'paypal') { /* PayPal logic */ }
  else if (gateway === 'stripe') { /* Stripe logic */ }
  else if (gateway === 'crypto') { /* Crypto logic */ }
}

// After: Strategy pattern
interface PaymentStrategy {
  pay(amount: number): Promise<{ transactionId: string }>;
}

class StripeStrategy implements PaymentStrategy {
  async pay(amount: number) {
    // Stripe SDK call
    return { transactionId: 'stripe_' + Date.now() };
  }
}

class PayPalStrategy implements PaymentStrategy {
  async pay(amount: number) {
    return { transactionId: 'pp_' + Date.now() };
  }
}

class CryptoStrategy implements PaymentStrategy {
  async pay(amount: number) {
    return { transactionId: 'btc_' + Date.now() };
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  
  setStrategy(strategy: PaymentStrategy) { this.strategy = strategy; }
  
  async charge(amount: number) {
    return this.strategy.pay(amount);
  }
}
```

**Open/Closed connection:** The `PaymentProcessor` class is **closed for modification** (you never edit it) but **open for extension** — adding a new payment gateway means creating a new class implementing `PaymentStrategy`, not touching any existing code.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: structural, decorator

How does the Decorator pattern differ from inheritance for extending behavior? Give one advantage of Decorator over inheritance.

<!-- ANSWER -->
**Inheritance** extends behavior at **compile time** — you must decide the full behavior when you define the class hierarchy. You also get tight coupling between parent and child.

**Decorator** extends behavior at **runtime** — you wrap objects dynamically and can combine multiple decorators in any order.

**Key advantage:** Decorators compose independently. With inheritance you'd need a class for every combination: `TimestampedLevelLogger`, `TimestampedColorLogger`, `LevelColorLogger`… that's exponential growth. With decorators you just nest:

```typescript
const logger = new ColorLogger(
  new LevelLogger(
    new TimestampLogger(new ConsoleLogger()),
    'INFO'
  ),
  'green'
);
```
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: patterns, factory

What is the difference between the Factory Method pattern and the Abstract Factory pattern?

<!-- ANSWER -->
| | Factory Method | Abstract Factory |
|---|---|---|
| Creates | One product | A **family** of related products |
| Mechanism | Override a method in a subclass | A separate factory object per product family |
| Use when | You want subclasses to decide what to create | You need to create related objects that must be used together |

**Example:** A `UIFactory` might be an Abstract Factory — `WindowsFactory` creates Windows-style buttons, checkboxes, and dialogs; `MacFactory` creates macOS-style ones. The client code works with the factory interface and never knows which OS it's running on.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: creational, patterns

Implement a simple **Object Pool** pattern for database connections. The pool should have a maximum size, hand out connections, and return them when done.

<!-- ANSWER -->
```typescript
class Connection {
  constructor(public id: number) {}
  query(sql: string) { return `Result from conn ${this.id}`; }
}

class ConnectionPool {
  private available: Connection[] = [];
  private inUse: Set<Connection> = new Set();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    // Pre-fill pool
    for (let i = 0; i < maxSize; i++) {
      this.available.push(new Connection(i));
    }
  }

  async acquire(): Promise<Connection> {
    if (this.available.length > 0) {
      const conn = this.available.pop()!;
      this.inUse.add(conn);
      return conn;
    }
    // Wait until one is released
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.available.length > 0) {
          clearInterval(interval);
          resolve(this.acquire());
        }
      }, 10);
    });
  }

  release(conn: Connection): void {
    if (!this.inUse.has(conn)) throw new Error('Connection not from this pool');
    this.inUse.delete(conn);
    this.available.push(conn);
  }
}

// Usage
const pool = new ConnectionPool(5);
const conn = await pool.acquire();
const result = conn.query('SELECT * FROM users');
pool.release(conn);
```

The Object Pool pattern is a **creational** pattern that reuses expensive-to-create objects instead of creating new ones each time.
<!-- END -->
