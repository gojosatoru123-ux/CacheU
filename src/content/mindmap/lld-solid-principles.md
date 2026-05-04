---
title: SOLID Principles
articleSlug: lld-solid-principles
---

# SOLID Principles

## S — Single Responsibility
### One reason to change
- Separate concerns
- Smaller classes
### Anti-pattern
- God object
- Mixed concerns
### Benefits
- Easier testing
- Clear ownership

## O — Open / Closed
### Open for extension
- Add via subclass
- Use interfaces
### Closed for modification
- No editing existing
- Stable contracts
### How to achieve
- Strategy pattern
- Polymorphism

## L — Liskov Substitution
### Subtypes substitutable
- Honors base contract
- No exceptions thrown
### Classic violation
- Square extends Rectangle
- Penguin extends Bird
### Fix
- Use interfaces
- Composition over inheritance

## I — Interface Segregation
### Thin interfaces
- Many small interfaces
- Role-based splitting
### Fat interface (bad)
- Forces stub methods
- Unused dependencies
### Benefits
- No forced coupling
- Clean implementations

## D — Dependency Inversion
### Depend on abstractions
- Interfaces not classes
- High-level modules
### Dependency Injection
- Constructor injection
- Interface as contract
### Benefits
- Testable with mocks
- Swap implementations
