---
title: OOP Concepts
articleSlug: lld-oop-concepts
---

# OOP Concepts

## Encapsulation
### Hide internal state
- Private fields
- Public interface only
- Getters / setters
### Benefits
- Invariant enforcement
- Change internals freely
- Add side effects
### Anti-pattern
- Public fields
- Direct state mutation

## Inheritance
### IS-A relationship
- Extend parent class
- Override methods
- Call super()
### Abstract classes
- Partial implementation
- Force subclass methods
- Shared constructor
### Pitfalls
- Fragile base class
- Deep hierarchies
- Tight coupling

## Polymorphism
### Method overriding
- Runtime dispatch
- Liskov required
- Virtual methods
### Interface polymorphism
- Multiple types, one contract
- Dependency injection
- Testability
### Duck typing
- Structural typing
- TypeScript supports
- No explicit interface

## Abstraction
### Hide complexity
- Expose what matters
- Interface as contract
- Abstract classes
### Leaky abstractions
- Implementation bleeds
- Violates encapsulation
- Hard to change

## Composition
### HAS-A relationship
- Inject dependencies
- Favor over inheritance
- Runtime flexibility
### Mixins
- Cross-cutting behavior
- Type-safe in TS
- No diamond problem
### Benefits
- Swap implementations
- Isolated testability
- No hierarchy lock-in
