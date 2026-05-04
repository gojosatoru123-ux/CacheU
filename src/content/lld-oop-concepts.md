---
title: OOP Concepts Deep Dive
description: Master encapsulation, inheritance, polymorphism, and composition with practical TypeScript patterns.
category: Low Level Design
order: 4
---

# OOP Concepts Deep Dive

Object-Oriented Programming organizes code around objects that encapsulate both data and behavior. Mastering its four pillars and knowing when to use composition over inheritance is essential for clean design.

## The Four Pillars

### 1. Encapsulation

Hide implementation details and expose only what's necessary.

```typescript
class BankAccount {
  private _balance: number;
  private _transactions: string[] = [];

  constructor(initialBalance: number) {
    if (initialBalance < 0) throw new Error('Balance cannot be negative');
    this._balance = initialBalance;
  }

  get balance(): number { return this._balance; }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Deposit must be positive');
    this._balance += amount;
    this._transactions.push(`+${amount}`);
  }

  withdraw(amount: number): void {
    if (amount > this._balance) throw new Error('Insufficient funds');
    this._balance -= amount;
    this._transactions.push(`-${amount}`);
  }
}
```

The internal `_balance` and `_transactions` are not directly accessible — callers use the public API.

---

### 2. Inheritance

A child class inherits state and behavior from a parent class.

```typescript
abstract class Animal {
  constructor(protected name: string) {}
  abstract sound(): string;
  describe() { return `${this.name} says ${this.sound()}`; }
}

class Dog extends Animal {
  sound() { return 'woof'; }
  fetch() { return `${this.name} fetches the ball!`; }
}

class Cat extends Animal {
  sound() { return 'meow'; }
}

const dog = new Dog('Rex');
console.log(dog.describe()); // "Rex says woof"
console.log(dog.fetch());    // "Rex fetches the ball!"
```

**Warning:** Deep inheritance hierarchies become brittle. Prefer shallow hierarchies or composition.

---

### 3. Polymorphism

Objects of different classes respond to the same interface in different ways.

```typescript
interface Drawable {
  draw(): string;
}

class Circle implements Drawable {
  constructor(private radius: number) {}
  draw() { return `○ Circle(r=${this.radius})`; }
}

class Rectangle implements Drawable {
  constructor(private w: number, private h: number) {}
  draw() { return `□ Rect(${this.w}x${this.h})`; }
}

class Triangle implements Drawable {
  draw() { return `△ Triangle`; }
}

function renderAll(shapes: Drawable[]) {
  shapes.forEach(s => console.log(s.draw()));
}

renderAll([new Circle(5), new Rectangle(3, 4), new Triangle()]);
```

---

### 4. Abstraction

Expose the essential features of an object, hiding the complex implementation.

```typescript
abstract class DataStore {
  // Public interface — how callers interact
  async save(key: string, value: unknown): Promise<void> {
    const serialized = this.serialize(value);
    await this.write(key, serialized);
  }

  async load<T>(key: string): Promise<T> {
    const raw = await this.read(key);
    return this.deserialize<T>(raw);
  }

  // Implementation details — subclasses define
  protected abstract write(key: string, data: string): Promise<void>;
  protected abstract read(key: string): Promise<string>;
  protected serialize(v: unknown): string { return JSON.stringify(v); }
  protected deserialize<T>(s: string): T { return JSON.parse(s); }
}
```

---

## Composition Over Inheritance

> Favor object composition over class inheritance — Gang of Four

**Inheritance problem:** The "fragile base class" — changes to a parent break all children.

```typescript
// Inheritance approach — brittle
class Vehicle { startEngine() { /* ... */ } }
class Car extends Vehicle { /* inherits startEngine */ }
class ElectricCar extends Car { 
  startEngine() { /* has to override — not really an engine! */ }
}
```

**Composition approach:**

```typescript
interface Engine { start(): void; }

class GasEngine implements Engine { start() { console.log('Vroom'); } }
class ElectricMotor implements Engine { start() { console.log('Whirr'); } }

class Car {
  constructor(
    private engine: Engine,
    private name: string
  ) {}

  start() {
    console.log(`${this.name}: `);
    this.engine.start();
  }
}

const tesla = new Car(new ElectricMotor(), 'Tesla');
const bmw = new Car(new GasEngine(), 'BMW');
```

---

## Mixins

Mixins allow sharing behavior across unrelated classes without inheritance.

```typescript
type Constructor<T = {}> = new (...args: unknown[]) => T;

function Timestamped<Base extends Constructor>(Base: Base) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();
    touch() { this.updatedAt = new Date(); }
  };
}

function Serializable<Base extends Constructor>(Base: Base) {
  return class extends Base {
    toJSON() { return JSON.stringify(this); }
  };
}

class User {
  constructor(public name: string, public email: string) {}
}

const TimestampedSerializableUser = Serializable(Timestamped(User));
const user = new TimestampedSerializableUser('Alice', 'alice@example.com');
console.log(user.createdAt); // Date
console.log(user.toJSON());  // JSON string
```

---

## Key Principles Summary

| Concept | Purpose | Anti-pattern |
|---|---|---|
| Encapsulation | Hide complexity | Public fields everywhere |
| Inheritance | Reuse behavior | Deep hierarchies (>3 levels) |
| Polymorphism | Interchangeable implementations | Long `instanceof` chains |
| Abstraction | Define contracts | Leaking implementation details |
| Composition | Flexible behavior assembly | Overusing inheritance |
