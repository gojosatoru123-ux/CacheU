---
title: Design Patterns
description: A practical guide to the most essential Gang of Four design patterns with real-world examples.
category: Low Level Design
order: 1
---

# Design Patterns

Design patterns are reusable solutions to commonly occurring problems in software design. They are not finished code — they are templates for how to solve a problem in many different situations.

## Creational Patterns

Creational patterns deal with object creation mechanisms.

### Singleton

Ensures a class has only one instance and provides a global access point.

```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private constructor(private url: string) {}

  static getInstance(url: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(url);
    }
    return DatabaseConnection.instance;
  }

  query(sql: string) { /* ... */ }
}
```

**Use when:** You need exactly one shared resource — a logger, config manager, or connection pool.

**Pitfalls:** Global state makes testing harder. Prefer dependency injection where possible.

---

### Factory Method

Defines an interface for creating an object, but lets subclasses decide which class to instantiate.

```typescript
abstract class Notification {
  abstract send(message: string): void;
}

class EmailNotification extends Notification {
  send(message: string) { console.log(`Email: ${message}`); }
}

class SMSNotification extends Notification {
  send(message: string) { console.log(`SMS: ${message}`); }
}

function createNotification(type: 'email' | 'sms'): Notification {
  if (type === 'email') return new EmailNotification();
  return new SMSNotification();
}
```

---

### Builder

Constructs complex objects step by step, allowing the same construction process to create different representations.

```typescript
class QueryBuilder {
  private table = '';
  private conditions: string[] = [];
  private limitVal = 100;

  from(table: string): this { this.table = table; return this; }
  where(condition: string): this { this.conditions.push(condition); return this; }
  limit(n: number): this { this.limitVal = n; return this; }

  build(): string {
    const where = this.conditions.length ? `WHERE ${this.conditions.join(' AND ')}` : '';
    return `SELECT * FROM ${this.table} ${where} LIMIT ${this.limitVal}`;
  }
}

const query = new QueryBuilder()
  .from('users')
  .where('age > 18')
  .where('active = true')
  .limit(50)
  .build();
```

---

## Structural Patterns

Structural patterns explain how to assemble objects into larger structures.

### Adapter

Converts one interface to another that clients expect.

```typescript
// Legacy payment system
class LegacyPayment {
  makePayment(amount: number, currency: string) { /* ... */ }
}

// Modern interface
interface PaymentProcessor {
  pay(amountInCents: number): void;
}

class LegacyPaymentAdapter implements PaymentProcessor {
  constructor(private legacy: LegacyPayment) {}

  pay(amountInCents: number) {
    this.legacy.makePayment(amountInCents / 100, 'USD');
  }
}
```

---

### Decorator

Adds behavior to objects dynamically without modifying the original class.

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(message); }
}

class TimestampLogger implements Logger {
  constructor(private inner: Logger) {}
  log(message: string) {
    this.inner.log(`[${new Date().toISOString()}] ${message}`);
  }
}

class LevelLogger implements Logger {
  constructor(private inner: Logger, private level: string) {}
  log(message: string) {
    this.inner.log(`[${this.level}] ${message}`);
  }
}

const logger = new LevelLogger(new TimestampLogger(new ConsoleLogger()), 'INFO');
logger.log('Server started'); // [INFO] [2024-01-01T...] Server started
```

---

## Behavioral Patterns

Behavioral patterns are about communication between objects.

### Observer

Defines a one-to-many dependency so that when one object changes, all dependents are notified.

```typescript
type Handler<T> = (data: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private handlers: Partial<{ [K in keyof Events]: Handler<Events[K]>[] }> = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    (this.handlers[event] ??= []).push(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers[event]?.forEach(h => h(data));
  }
}
```

---

### Strategy

Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

```typescript
interface SortStrategy<T> {
  sort(data: T[]): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] { /* bubble sort */ return data; }
}

class QuickSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] { /* quick sort */ return data; }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}
  setStrategy(s: SortStrategy<T>) { this.strategy = s; }
  sort(data: T[]) { return this.strategy.sort(data); }
}
```

---

## Choosing the Right Pattern

| Problem | Pattern |
|---|---|
| Need exactly one instance | Singleton |
| Object creation is complex | Factory / Builder |
| Incompatible interfaces | Adapter |
| Add features without subclassing | Decorator |
| Notify multiple objects of changes | Observer |
| Swap algorithms at runtime | Strategy |
