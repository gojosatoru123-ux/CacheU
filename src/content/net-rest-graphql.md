---
title: REST vs GraphQL vs gRPC
description: Compare the three dominant API paradigms — design philosophy, trade-offs, and when to choose each.
category: Networking
order: 4
---

# REST vs GraphQL vs gRPC

Three API paradigms dominate modern distributed systems. Each has a distinct philosophy and is better suited to different use cases.

## REST — Representational State Transfer

REST treats everything as a resource identified by a URL.

### Core Constraints

1. **Stateless** — Each request contains everything needed (auth token, etc.)
2. **Resource-based** — URLs identify nouns, HTTP methods indicate actions
3. **Uniform interface** — Standard HTTP methods and status codes
4. **Cacheable** — Responses declare their cacheability

### Example

```http
# Get user
GET /users/42
→ 200 {"id":42,"name":"Alice","email":"alice@example.com"}

# Create order
POST /orders
{"userId":42,"items":[{"productId":1,"qty":2}]}
→ 201 {"orderId":999,"status":"pending"}

# Update status
PATCH /orders/999
{"status":"shipped"}
→ 200 {"orderId":999,"status":"shipped"}

# Delete
DELETE /orders/999
→ 204
```

### REST Problems

**Over-fetching:** Getting more data than needed.

```
GET /users/42 → returns 20 fields but you only need "name"
```

**Under-fetching (N+1):** Multiple requests needed for related data.

```
GET /orders/999         → { userId: 42 }
GET /users/42           → { name: "Alice" }
GET /products/1         → { name: "Widget" }
(3 round trips to render one order)
```

---

## GraphQL

GraphQL is a query language for APIs. Clients specify exactly what data they need.

### Schema

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  status: OrderStatus!
  items: [OrderItem!]!
  total: Float!
}

type Query {
  user(id: ID!): User
  order(id: ID!): Order
}

type Mutation {
  createOrder(userId: ID!, items: [OrderItemInput!]!): Order!
  updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!
}
```

### Query — fetch only what you need

```graphql
query GetOrderPage {
  order(id: "999") {
    id
    status
    total
    items {
      quantity
      product {
        name
        imageUrl
      }
    }
    user {
      name
    }
  }
}
```

One request, all related data, no over-fetching.

### Mutations

```graphql
mutation CreateOrder($userId: ID!, $items: [OrderItemInput!]!) {
  createOrder(userId: $userId, items: $items) {
    id
    status
    total
  }
}
```

### Subscriptions (Real-time)

```graphql
subscription OrderUpdates($orderId: ID!) {
  orderStatusChanged(orderId: $orderId) {
    status
    updatedAt
  }
}
```

### GraphQL Trade-offs

| Advantage | Disadvantage |
|---|---|
| No over/under-fetching | Complex caching (no URL-based) |
| Strongly typed schema | Higher server complexity |
| Self-documenting | N+1 problem without DataLoader |
| One endpoint | Harder to secure (any query possible) |
| Great for frontends with diverse data needs | Overkill for simple CRUD APIs |

### DataLoader (solving N+1 in GraphQL)

```typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids: readonly string[]) => {
  const users = await db.users.findMany({ where: { id: { in: [...ids] } } });
  return ids.map(id => users.find(u => u.id === id) ?? null);
});

// Now 100 concurrent user queries = 1 DB query (batched)
const resolvers = {
  Order: {
    user: (order) => userLoader.load(order.userId),
  }
};
```

---

## gRPC

gRPC is a high-performance RPC framework that uses Protocol Buffers and HTTP/2.

### Proto Definition

```protobuf
syntax = "proto3";

service OrderService {
  rpc GetOrder (GetOrderRequest) returns (Order);
  rpc CreateOrder (CreateOrderRequest) returns (Order);
  rpc StreamOrderUpdates (OrderId) returns (stream OrderUpdate);
}

message GetOrderRequest { string order_id = 1; }
message Order {
  string id = 1;
  string status = 2;
  float total = 3;
  string user_id = 4;
}
message OrderUpdate {
  string order_id = 1;
  string new_status = 2;
  int64 updated_at = 3;
}
```

### Generated Client (TypeScript)

```typescript
const client = new OrderServiceClient('order-service:50051', credentials.createInsecure());

// Unary call
const order = await promisify(client.getOrder.bind(client))({ order_id: '999' });

// Server streaming
const stream = client.streamOrderUpdates({ order_id: '999' });
stream.on('data', (update: OrderUpdate) => {
  console.log(`Status: ${update.new_status}`);
});
```

### gRPC Trade-offs

| Advantage | Disadvantage |
|---|---|
| Very fast (binary + HTTP/2) | Not human-readable |
| Strong typing via .proto | Limited browser support (use gRPC-Web) |
| Streaming built-in | Steeper learning curve |
| Code generation for all languages | Smaller ecosystem than REST |
| Great for internal microservices | Proto schema management overhead |

---

## Decision Guide

| Scenario | Recommended |
|---|---|
| Public API for third parties | REST |
| Mobile app with complex data needs | GraphQL |
| Internal microservice communication | gRPC |
| Simple CRUD web app | REST |
| Real-time features | GraphQL Subscriptions or WebSocket |
| High-throughput inter-service calls | gRPC |
| Rapid prototyping | REST |

---

## Side-by-Side Comparison

| | REST | GraphQL | gRPC |
|---|---|---|---|
| Protocol | HTTP/1.1 or 2 | HTTP/1.1 or 2 | HTTP/2 |
| Format | JSON (usually) | JSON | Protocol Buffers |
| Type system | OpenAPI (optional) | Schema required | Proto required |
| Caching | URL-based (great) | Complex | No built-in |
| Streaming | SSE / WebSocket | Subscriptions | Native |
| Browser support | ✅ Native | ✅ Native | ⚠️ gRPC-Web |
| Performance | Good | Good | Excellent |
