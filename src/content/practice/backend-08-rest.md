````md id="8m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: rest, api, architecture

What is a REST API?

<!-- ANSWER -->
A REST API (Representational State Transfer API) is an architectural style for designing network-based applications using HTTP.

REST APIs expose resources through URLs.

Example:

```http
GET /users
````

Resources are manipulated using HTTP methods:

| Method | Action   |
| ------ | -------- |
| GET    | Retrieve |
| POST   | Create   |
| PUT    | Replace  |
| PATCH  | Update   |
| DELETE | Remove   |

REST APIs are:

* stateless
* resource-oriented
* client-server based

Example response:

```json id="7m3xqc"
{
  "id": 1,
  "name": "Alex"
}
```

REST is the most widely used architecture for modern web APIs.

<!-- END -->

````id="5v1xke"

```md id="2n7qpd"
<!-- QUESTION -->
difficulty: Easy
tags: resources, rest, api-design

What are resources in REST architecture?

<!-- ANSWER -->
Resources are the core entities exposed by a REST API.

Examples:
- users
- products
- orders
- posts

Each resource has a unique URL.

Examples:

```http
/users
/products
/orders/42
````

REST APIs use nouns instead of verbs.

Good example:

```http id="4m8qza"
GET /users
```

Bad example:

```http id="1v7xpd"
GET /getUsers
```

Resources are manipulated using HTTP methods.

REST architecture revolves around clean resource-based design.

<!-- END -->

````id="9x2vke"

```md id="4q7xwc"
<!-- QUESTION -->
difficulty: Easy
tags: stateless, rest, backend

Why are REST APIs called stateless?

<!-- ANSWER -->
REST APIs are stateless because the server does not store client session state between requests.

Each request must contain all necessary information.

Example:

```http
Authorization: Bearer <token>
````

The server treats every request independently.

Benefits of statelessness:

| Benefit     | Explanation               |
| ----------- | ------------------------- |
| Scalability | Easier horizontal scaling |
| Reliability | Independent requests      |
| Simplicity  | No shared session state   |

Without statelessness:

* servers must track client sessions
* scaling becomes harder

REST statelessness improves distributed system architecture.

<!-- END -->

````id="6p1qxt"

```md id="7m9vza"
<!-- QUESTION -->
difficulty: Medium
tags: rest-principles, architecture, backend

What are the core principles of REST architecture?

<!-- ANSWER -->
REST architecture follows several key constraints.

Core REST principles:

| Principle | Description |
|---|---|
| Client-Server | Separation of concerns |
| Stateless | No server-side client state |
| Cacheable | Responses may be cached |
| Uniform Interface | Standardized communication |
| Layered System | Multiple intermediary layers |

Example layered architecture:

```text id="2k8qwr"
Client → Gateway → Service → Database
````

REST constraints improve:

* scalability
* maintainability
* interoperability

REST is an architectural style, not a protocol.

<!-- END -->

````id="3x5vke"

```md id="1n8qpd"
<!-- QUESTION -->
difficulty: Medium
tags: restful-routing, api-design, rest

What is RESTful routing?

<!-- ANSWER -->
RESTful routing maps HTTP methods to resource operations using predictable URL structures.

Example routes:

| Method | Route | Action |
|---|---|---|
| GET | /users | Fetch users |
| GET | /users/1 | Fetch user |
| POST | /users | Create user |
| PUT | /users/1 | Replace user |
| DELETE | /users/1 | Delete user |

Good RESTful route:

```http
DELETE /users/1
````

Bad route:

```http id="5m2xqc"
GET /deleteUser
```

RESTful routing improves:

* consistency
* readability
* API predictability

Most modern APIs follow RESTful routing conventions.

<!-- END -->

````id="8w4qza"

```md id="5x1vyt"
<!-- QUESTION -->
difficulty: Medium
tags: caching, rest, performance

Why is caching important in REST architecture?

<!-- ANSWER -->
Caching allows clients or intermediaries to reuse responses without repeatedly contacting the server.

Example flow:

```text
Client → Cache → Server
````

Benefits of caching:

| Benefit            | Purpose                  |
| ------------------ | ------------------------ |
| Faster responses   | Reduced latency          |
| Lower server load  | Fewer requests           |
| Better scalability | Reduced backend pressure |

REST APIs use caching headers:

```http
Cache-Control: max-age=3600
```

Other caching headers:

| Header        | Purpose             |
| ------------- | ------------------- |
| ETag          | Resource versioning |
| Expires       | Expiration time     |
| Last-Modified | Change tracking     |

Caching is a major REST performance optimization.

<!-- END -->

````id="2v7qwr"

```md id="9m3xpd"
<!-- QUESTION -->
difficulty: Hard
tags: hateoas, rest, api-design

What is HATEOAS in REST architecture?

<!-- ANSWER -->
HATEOAS (Hypermedia As The Engine Of Application State) means REST APIs provide links for navigating resources dynamically.

Example response:

```json
{
  "id": 1,
  "name": "Alex",
  "links": {
    "orders": "/users/1/orders"
  }
}
````

The client discovers actions through API responses instead of hardcoding URLs.

Benefits:

| Benefit                 | Explanation            |
| ----------------------- | ---------------------- |
| Self-discoverable APIs  | Dynamic navigation     |
| Reduced client coupling | Flexible API evolution |

Example:

```text id="1k9vke"
API responses guide the client.
```

Many modern REST APIs partially implement HATEOAS, though full adoption is uncommon.

<!-- END -->

````id="4q2xmc"

```md id="6p8qza"
<!-- QUESTION -->
difficulty: Hard
tags: layered-architecture, rest, backend

What is the layered system constraint in REST architecture?

<!-- ANSWER -->
REST allows systems to be composed of multiple intermediary layers between client and server.

Example architecture:

```text
Client
  ↓
CDN
  ↓
Load Balancer
  ↓
API Gateway
  ↓
Backend Services
````

Clients do not need to know:

* how many layers exist
* where data originates
* internal infrastructure details

Benefits:

| Benefit     | Explanation                |
| ----------- | -------------------------- |
| Scalability | Independent layers         |
| Security    | Gateway enforcement        |
| Flexibility | Infrastructure abstraction |

Common REST layers:

* caching layers
* reverse proxies
* gateways
* authentication services

Layered architecture improves modularity and scalability.

<!-- END -->

````id="7n1qxt"

```md id="3m5vke"
<!-- QUESTION -->
difficulty: Hard
tags: rest-vs-graphql, api-architecture, backend

What is the difference between REST and GraphQL?

<!-- ANSWER -->
REST exposes multiple resource-based endpoints.

GraphQL exposes a single flexible query endpoint.

Comparison:

| REST | GraphQL |
|---|---|
| Multiple endpoints | Single endpoint |
| Fixed response structure | Client-defined responses |
| Over-fetching possible | Precise data fetching |
| HTTP-driven | Query-driven |

REST example:

```http
GET /users/1
````

GraphQL example:

```graphql id="4v8qpd"
{
  user(id: 1) {
    name
  }
}
```

REST advantages:

* simpler caching
* easier HTTP semantics
* mature ecosystem

GraphQL advantages:

* flexible queries
* reduced over-fetching
* efficient frontend data fetching

Both are widely used API architectures.

<!-- END -->

````id="5w2qwc"

```md id="1x7vza"
<!-- QUESTION -->
difficulty: Hard
tags: microservices, rest, distributed-systems

Why are REST APIs commonly used in microservices architectures?

<!-- ANSWER -->
REST APIs provide a standardized and lightweight communication mechanism between services.

Example architecture:

```text id="6m3qpd"
Frontend → API Gateway → Microservices
````

Benefits for microservices:

| Benefit              | Explanation               |
| -------------------- | ------------------------- |
| Language-independent | Works across technologies |
| HTTP-based           | Universally supported     |
| Stateless            | Easier scaling            |
| Simple integration   | Standard web tooling      |

REST APIs are commonly used for:

* service communication
* public APIs
* mobile backends
* frontend integration

Challenges:

* network latency
* versioning complexity
* distributed failures

Despite alternatives like gRPC, REST remains dominant in microservice ecosystems.

<!-- END -->