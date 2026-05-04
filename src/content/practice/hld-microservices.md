---
title: Microservices Architecture — Practice Quiz
articleSlug: hld-microservices
difficulty: Advanced
estimatedTime: 30 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: monolith, microservices, trade-offs

Name three advantages of a monolith over microservices. When is a monolith the right choice?

<!-- ANSWER -->
**Advantages of monolith:**
1. **Simpler development** — One codebase, one deploy, one language, one debugging session
2. **No network latency** — In-process function calls are nanoseconds; network calls add milliseconds
3. **Easier transactions** — ACID transactions across the entire data model with no distributed transaction complexity
4. **Simpler testing** — Integration tests can run against one process; no service mocking needed

**When monolith is right:**
- Early-stage startup (< 5 engineers, < 1M users) — the overhead of microservices slows iteration
- Domain boundaries aren't yet clear — premature decomposition creates wrong boundaries
- Team doesn't have operational expertise for distributed systems
- The "system" is inherently simple and unlikely to need independent scaling

> Martin Fowler's **monolith-first** rule: Start with a well-structured monolith. Extract services only when you have evidence that a specific component needs independent scaling or team ownership.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: service-communication, sync, async

An e-commerce checkout service needs to: (1) charge the customer, (2) reserve inventory, (3) send a confirmation email. Which of these should be synchronous vs asynchronous, and why?

<!-- ANSWER -->
**Synchronous (blocking, user waits for response):**
- ✅ **(1) Charge the customer** — The user must know immediately if payment succeeded or failed. The checkout cannot complete without it. Failure requires showing an error and not completing the order.
- ✅ **(2) Reserve inventory** — Must happen before confirming the order. If out of stock, user must be told now.

**Asynchronous (fire and forget, user doesn't wait):**
- ✅ **(3) Send confirmation email** — Email delivery takes time, may retry on failure, and the user doesn't need to wait for it before seeing "order confirmed." Email failure shouldn't block or fail the checkout.

```
Checkout Service:
  1. charge(paymentToken) → SYNC → fail fast if declined
  2. reserveInventory(items) → SYNC → fail fast if out of stock
  3. order.confirmed event → ASYNC queue
     → Email Service (picks up from queue, sends email)
     → Analytics Service (logs conversion)
     → Loyalty Service (awards points)
```
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: saga, distributed-transactions

Implement a simple Saga orchestrator for a 3-step order flow: `chargePayment → reserveInventory → scheduleShipping`. Include compensating transactions for rollback.

<!-- ANSWER -->
```typescript
interface SagaStep<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
  compensate(input: TInput, result: TOutput): Promise<void>;
}

class OrderSaga {
  private steps: Array<{
    name: string;
    execute: () => Promise<unknown>;
    compensate: () => Promise<void>;
  }> = [];
  private completed: typeof this.steps = [];

  addStep(name: string, execute: () => Promise<unknown>, compensate: () => Promise<void>) {
    this.steps.push({ name, execute, compensate });
    return this;
  }

  async execute(): Promise<void> {
    for (const step of this.steps) {
      try {
        await step.execute();
        this.completed.push(step);
        console.log(`✅ ${step.name} succeeded`);
      } catch (err) {
        console.error(`❌ ${step.name} failed — rolling back`);
        await this.compensate();
        throw new Error(`Saga failed at step: ${step.name}`);
      }
    }
  }

  private async compensate(): Promise<void> {
    for (const step of [...this.completed].reverse()) {
      try {
        await step.compensate();
        console.log(`↩️ ${step.name} compensated`);
      } catch (err) {
        console.error(`⚠️ Compensation for ${step.name} failed — manual intervention needed`);
      }
    }
  }
}

// Usage
async function placeOrder(orderId: string) {
  let paymentId: string;
  let reservationId: string;

  const saga = new OrderSaga()
    .addStep(
      'Charge Payment',
      async () => { paymentId = await paymentService.charge(orderId); },
      async () => { await paymentService.refund(paymentId!); }
    )
    .addStep(
      'Reserve Inventory',
      async () => { reservationId = await inventoryService.reserve(orderId); },
      async () => { await inventoryService.release(reservationId!); }
    )
    .addStep(
      'Schedule Shipping',
      async () => { await shippingService.schedule(orderId); },
      async () => { await shippingService.cancel(orderId); }
    );

  await saga.execute();
}
```
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: circuit-breaker, resilience

Explain the three states of a Circuit Breaker and when each transition occurs.

<!-- ANSWER -->
A Circuit Breaker wraps calls to a dependency and tracks failures.

```
CLOSED ──(failures ≥ threshold)──► OPEN ──(timeout elapsed)──► HALF-OPEN
  ▲                                                                  │
  └──────────────(success)──────────────────────────────────────────┘
  HALF-OPEN ──(failure)──► OPEN
```

**CLOSED (normal operation):**
- All requests pass through to the dependency
- Failures are counted
- If failures hit the threshold (e.g., 5 in 10 seconds) → **trip to OPEN**

**OPEN (dependency is broken):**
- ALL requests are immediately rejected without calling the dependency
- Returns an error or fallback response instantly
- After a timeout (e.g., 30 seconds) → transition to **HALF-OPEN**
- Purpose: give the broken service time to recover; prevent cascading failures

**HALF-OPEN (testing recovery):**
- Allow a single test request through
- If it succeeds → reset to **CLOSED** (service recovered)
- If it fails → reset to **OPEN** (not recovered yet, try again after timeout)

**Real benefit:** Without a circuit breaker, every request to a broken service waits for the full timeout (e.g., 30s) before failing. With a circuit breaker, failures after the trip are instant → no thread exhaustion → no cascading failures.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: api-gateway, service-mesh

What is the difference between an API Gateway and a Service Mesh?

<!-- ANSWER -->
| | API Gateway | Service Mesh |
|---|---|---|
| Position | Edge (between client and services) | Internal (between services) |
| Handles | North-South traffic (external → internal) | East-West traffic (service ↔ service) |
| Main concerns | Auth, rate limiting, routing, SSL termination | mTLS, load balancing, tracing, circuit breaking |
| Examples | Kong, AWS API Gateway, Nginx | Istio, Linkerd, Envoy |
| Visibility | Auth tokens, HTTP headers | Network-level metrics per service pair |

**API Gateway:** The front door. Every external request enters here. It authenticates, rate-limits, and routes to the right backend service.

**Service Mesh:** The internal communication layer. Each service has a sidecar proxy (e.g., Envoy) that intercepts all service-to-service traffic, enforces mTLS, collects metrics, and provides circuit breaking — without any changes to the service code itself.

They're **complementary**, not alternatives. Large deployments typically have both.
<!-- END -->
