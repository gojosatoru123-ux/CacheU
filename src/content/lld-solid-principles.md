---
title: SOLID Principles
description: Deep dive into SOLID principles with TypeScript examples and real-world anti-patterns to avoid.
category: Low Level Design
order: 2
---

# SOLID Principles

SOLID is an acronym for five design principles that make software more maintainable, extensible, and understandable. Each principle addresses a different kind of complexity.

## S — Single Responsibility Principle

> A class should have only one reason to change.

**Anti-pattern:**

```typescript
class UserService {
  saveUser(user: User) { /* DB logic */ }
  sendWelcomeEmail(user: User) { /* Email logic */ }
  generateReport(users: User[]) { /* Report logic */ }
}
```

This class changes when the DB changes, when emails change, and when reports change — three reasons.

**Correct:**

```typescript
class UserRepository { saveUser(user: User) { /* DB only */ } }
class EmailService { sendWelcomeEmail(user: User) { /* Email only */ } }
class ReportGenerator { generateReport(users: User[]) { /* Reports only */ } }
```

---

## O — Open/Closed Principle

> Software entities should be open for extension but closed for modification.

**Anti-pattern:**

```typescript
function getDiscount(customerType: string, price: number): number {
  if (customerType === 'regular') return price * 0.05;
  if (customerType === 'premium') return price * 0.10;
  if (customerType === 'vip') return price * 0.20;
  return 0;
}
```

Every new customer type requires modifying this function.

**Correct:**

```typescript
interface DiscountStrategy {
  calculate(price: number): number;
}

class RegularDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.05; }
}

class PremiumDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.10; }
}

class VIPDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.20; }
}

function getDiscount(strategy: DiscountStrategy, price: number): number {
  return strategy.calculate(price);
}
```

New discount types are added without touching existing code.

---

## L — Liskov Substitution Principle

> Objects of a subtype must be substitutable for objects of the supertype without altering program correctness.

**Anti-pattern:**

```typescript
class Rectangle {
  constructor(public width: number, public height: number) {}
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  set width(w: number) { this._width = this._height = w; }
  set height(h: number) { this._width = this._height = h; }
}

function doubleWidth(rect: Rectangle) {
  rect.width = rect.width * 2;
  // For Square this also changes height — LSP violated!
}
```

**Correct:** Don't force Square to inherit from Rectangle. Use a shared `Shape` interface instead.

```typescript
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  area() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(public side: number) {}
  area() { return this.side * this.side; }
}
```

---

## I — Interface Segregation Principle

> No client should be forced to depend on methods it does not use.

**Anti-pattern:**

```typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() { /* ok */ }
  eat() { throw new Error('Robots do not eat'); } // forced!
  sleep() { throw new Error('Robots do not sleep'); } // forced!
}
```

**Correct:**

```typescript
interface Workable { work(): void; }
interface Eatable { eat(): void; }
interface Sleepable { sleep(): void; }

class Human implements Workable, Eatable, Sleepable {
  work() { /* ... */ }
  eat() { /* ... */ }
  sleep() { /* ... */ }
}

class Robot implements Workable {
  work() { /* ... */ }
}
```

---

## D — Dependency Inversion Principle

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Anti-pattern:**

```typescript
class OrderService {
  private db = new MySQLDatabase(); // hard-coded dependency

  placeOrder(order: Order) {
    this.db.save(order);
  }
}
```

**Correct:**

```typescript
interface Database {
  save(data: unknown): void;
}

class MySQLDatabase implements Database {
  save(data: unknown) { /* MySQL logic */ }
}

class MongoDatabase implements Database {
  save(data: unknown) { /* Mongo logic */ }
}

class OrderService {
  constructor(private db: Database) {} // injected

  placeOrder(order: Order) {
    this.db.save(order);
  }
}

// Easy to swap or mock in tests
const service = new OrderService(new MySQLDatabase());
```

---

## Summary Table

| Principle | Keyword | Key Question |
|---|---|---|
| Single Responsibility | Focus | Does this class have one reason to change? |
| Open/Closed | Extend | Can I add behavior without editing existing code? |
| Liskov Substitution | Substitutability | Can subtypes be used everywhere supertypes are? |
| Interface Segregation | Thin interfaces | Are clients forced to depend on unused methods? |
| Dependency Inversion | Abstractions | Do high-level modules depend on abstractions? |
