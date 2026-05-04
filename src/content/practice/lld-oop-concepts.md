---
title: OOP Concepts — Practice Quiz
articleSlug: lld-oop-concepts
difficulty: Beginner
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: encapsulation, access-modifiers

What is encapsulation, and why is making all class fields `public` an anti-pattern?

<!-- ANSWER -->
**Encapsulation** is the bundling of data and the methods that operate on that data into a single unit (class), while restricting direct access to the internal state from outside.

**Why `public` fields are an anti-pattern:**
1. Any code can mutate the field directly, bypassing validation
2. You can't enforce invariants (e.g., `balance >= 0`)
3. If you later change the storage format, all callers break
4. Can't add side effects (logging, events) to a field assignment

```typescript
// Bad — public field
class BankAccount { public balance = 0; }
const acc = new BankAccount();
acc.balance = -1000000; // No validation — anything goes!

// Good — encapsulated
class BankAccount {
  private _balance: number = 0;
  
  get balance() { return this._balance; }
  
  deposit(amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this._balance += amount;
    this.log(`Deposited ${amount}`);
  }
  
  private log(msg: string) { console.log(msg); }
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: inheritance, polymorphism

Write a `Shape` hierarchy with `Circle`, `Rectangle`, and `Triangle`, all implementing a `perimeter()` method. Then write a function that uses polymorphism to print the perimeter of any shape.

<!-- ANSWER -->
```typescript
abstract class Shape {
  abstract perimeter(): number;
  abstract name(): string;
  
  describe(): string {
    return `${this.name()} has perimeter ${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  name() { return 'Circle'; }
  perimeter() { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) { super(); }
  name() { return 'Rectangle'; }
  perimeter() { return 2 * (this.width + this.height); }
}

class Triangle extends Shape {
  constructor(private a: number, private b: number, private c: number) { super(); }
  name() { return 'Triangle'; }
  perimeter() { return this.a + this.b + this.c; }
}

// Polymorphic function — works for ANY Shape
function printPerimeters(shapes: Shape[]): void {
  shapes.forEach(s => console.log(s.describe()));
}

printPerimeters([
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4, 5)
]);
// Circle has perimeter 31.42
// Rectangle has perimeter 20.00
// Triangle has perimeter 12.00
```
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: composition, inheritance

What does "favor composition over inheritance" mean, and why?

<!-- ANSWER -->
It means: instead of building complex behavior through class hierarchies (`class A extends B extends C`), build it by composing objects that each handle one responsibility.

**Why:**
1. **Flexibility** — You can swap a component at runtime; you can't swap a parent class
2. **Avoids fragile base class** — Changes to a parent can silently break all children
3. **Avoids the diamond problem** — Multiple inheritance ambiguity is sidestepped
4. **Better testability** — Composed components can be individually unit-tested

```typescript
// Inheritance — what if a FlyingFishCar needs to fly AND swim AND drive?
class Vehicle { drive() {} }
class Boat extends Vehicle { swim() {} }
class FlyingBoat extends Boat { fly() {} }
// ...class explosion!

// Composition — mix and match behaviors freely
interface Drivable { drive(): void; }
interface Swimmable { swim(): void; }
interface Flyable { fly(): void; }

class Car implements Drivable { drive() { console.log('vroom'); } }

class FlyingBoat implements Drivable, Swimmable, Flyable {
  private driveEngine = new Car();
  drive() { this.driveEngine.drive(); }
  swim() { console.log('splash'); }
  fly() { console.log('whoosh'); }
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: abstraction, abstract-class, interface

When would you use an `abstract class` vs an `interface` in TypeScript?

<!-- ANSWER -->
| | `interface` | `abstract class` |
|---|---|---|
| Contains implementation | ❌ No | ✅ Yes (partial) |
| Multiple inheritance | ✅ Yes | ❌ No (single extend) |
| Constructor | ❌ No | ✅ Yes |
| Fields with defaults | ❌ No | ✅ Yes |

**Use `interface` when:**
- You're defining a contract only (no shared code)
- A class should be able to implement multiple interfaces
- You're defining a shape for plain objects

**Use `abstract class` when:**
- You have shared implementation that subclasses should inherit
- You want to enforce a constructor signature
- Some methods are fully implemented, some are abstract

```typescript
// Good interface use — pure contract
interface Serializable {
  toJSON(): string;
  fromJSON(json: string): this;
}

// Good abstract class use — shared behavior + abstract hook
abstract class BaseRepository<T> {
  async findAll(): Promise<T[]> {
    const raw = await this.fetchAll(); // delegates to subclass
    return raw.map(r => this.deserialize(r));
  }
  
  protected abstract fetchAll(): Promise<unknown[]>;
  protected abstract deserialize(raw: unknown): T;
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: mixins, typescript, composition

Implement two TypeScript mixins: `Timestamped` (adds `createdAt`, `updatedAt`, `touch()`) and `SoftDeletable` (adds `deletedAt`, `softDelete()`, `isDeleted`). Apply both to a `Post` class.

<!-- ANSWER -->
```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<Base extends Constructor>(Base: Base) {
  return class extends Base {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    
    touch(): void {
      this.updatedAt = new Date();
    }
  };
}

function SoftDeletable<Base extends Constructor>(Base: Base) {
  return class extends Base {
    deletedAt: Date | null = null;
    
    get isDeleted(): boolean {
      return this.deletedAt !== null;
    }
    
    softDelete(): void {
      this.deletedAt = new Date();
      if ('touch' in this && typeof (this as any).touch === 'function') {
        (this as any).touch();
      }
    }
  };
}

class Post {
  constructor(
    public title: string,
    public content: string
  ) {}
}

// Apply both mixins
const TimestampedSoftDeletablePost = SoftDeletable(Timestamped(Post));
type PostWithMixins = InstanceType<typeof TimestampedSoftDeletablePost>;

const post = new TimestampedSoftDeletablePost('Hello World', 'My first post');
console.log(post.createdAt);  // Date
console.log(post.isDeleted);  // false

post.softDelete();
console.log(post.isDeleted);  // true
console.log(post.deletedAt);  // Date
console.log(post.updatedAt);  // updated by touch()
```
<!-- END -->
