---
title: REST vs GraphQL vs gRPC — Practice Quiz
articleSlug: net-rest-graphql
difficulty: Intermediate
estimatedTime: 25 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: rest, http-methods

Map each CRUD operation to the correct HTTP method and status code. What is the difference between PUT and PATCH?

<!-- ANSWER -->
| Operation | HTTP Method | Success Status | Body |
|---|---|---|---|
| Create | POST | `201 Created` | New resource |
| Read (collection) | GET | `200 OK` | Array |
| Read (one) | GET | `200 OK` | Object |
| Replace (full update) | PUT | `200 OK` | Updated resource |
| Partial update | PATCH | `200 OK` | Updated resource |
| Delete | DELETE | `204 No Content` | Empty |

**PUT vs PATCH:**
- **PUT** — replace the entire resource. You send all fields; any omitted fields are cleared/reset to defaults.
- **PATCH** — partial update. You send only the fields you want to change; omitted fields are untouched.

```http
# PUT /users/42 — replaces entire user
{"name":"Alice","email":"alice@new.com","role":"admin","phone":"555-1234"}

# PATCH /users/42 — only updates email
{"email":"alice@new.com"}
```

Use PATCH for most updates (safer, smaller payload). Use PUT when you explicitly want idempotent full replacement (e.g., config files).
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: graphql, overfetching, underfetching

Describe over-fetching and under-fetching in REST. Write a GraphQL query that solves both problems for a blog post page that needs: post title, author name, and the first 3 comments with their author names.

<!-- ANSWER -->
**Over-fetching:** REST endpoint returns more data than needed.
```
GET /posts/42 → returns 20 fields (title, body, createdAt, tags, views, likes...)
But you only need: title, author.name
```

**Under-fetching (N+1):** One endpoint doesn't return related data, requiring additional requests.
```
GET /posts/42           → { title, authorId: 7 }
GET /users/7            → { name: "Alice" }         ← extra request
GET /posts/42/comments  → [{ authorId: 3 }, ...]    ← extra request
GET /users/3            → { name: "Bob" }            ← extra request per comment!
```

**GraphQL — one query, exactly the data needed:**
```graphql
query BlogPostPage($postId: ID!) {
  post(id: $postId) {
    title
    author {
      name
    }
    comments(first: 3) {
      text
      author {
        name
      }
    }
  }
}
```

**Response — nothing extra:**
```json
{
  "post": {
    "title": "Understanding GraphQL",
    "author": { "name": "Alice" },
    "comments": [
      { "text": "Great post!", "author": { "name": "Bob" } },
      { "text": "Very helpful", "author": { "name": "Carol" } }
    ]
  }
}
```

One HTTP request. Exactly the fields requested.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: graphql, dataloader, n+1

What is the N+1 problem in GraphQL, and how does DataLoader solve it?

<!-- ANSWER -->
**N+1 problem:** When resolving a list of N items that each need a related resource, you end up with 1 query for the list + N queries for related data.

```graphql
query {
  posts(first: 100) {  # 1 query for 100 posts
    title
    author {            # 100 separate queries for 100 authors!
      name              # total = 101 queries
    }
  }
}
```

**DataLoader solution:** Batch and deduplicate all loads within a single tick of the event loop.

```typescript
import DataLoader from 'dataloader';

// Batch function: receives array of IDs, returns array of results (same order)
const userLoader = new DataLoader(async (ids: readonly string[]) => {
  console.log(`Fetching ${ids.length} users in one query`);
  const users = await db.users.findMany({
    where: { id: { in: [...ids] } }
  });
  // DataLoader requires results in the same order as input IDs
  return ids.map(id => users.find(u => u.id === id) ?? null);
});

// Resolver — calls load(), not a DB query directly
const resolvers = {
  Post: {
    author: (post: Post) => userLoader.load(post.authorId),
  }
};

// Result: 100 posts → 100 userLoader.load() calls
// DataLoader batches them → 1 DB query: SELECT * FROM users WHERE id IN (1,2,...,100)
// Total: 2 queries instead of 101
```

DataLoader also **deduplicates** — if multiple posts share the same author, that author is only fetched once.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: grpc, protobuf, advantages

What are the main advantages of gRPC over REST+JSON for internal microservice communication?

<!-- ANSWER -->
| | REST + JSON | gRPC + Protobuf |
|---|---|---|
| Serialization | Text-based JSON | Binary (Protocol Buffers) |
| Payload size | Larger | ~5–10× smaller |
| Parse speed | Slower | Much faster |
| Type safety | Optional (OpenAPI) | Required (.proto file) |
| Code generation | Partial | Full (all languages) |
| Streaming | SSE/WebSocket (custom) | Native (4 types) |
| Browser support | ✅ Native | ⚠️ Requires gRPC-Web |

**Key advantages for internal services:**

1. **Performance** — Binary serialization + HTTP/2 multiplexing = significantly lower latency and CPU
2. **Strong typing** — The `.proto` schema is the contract; breaking changes are caught at codegen time, not runtime
3. **Code generation** — Auto-generated clients for Go, Java, Python, Node, etc. from the same `.proto` file
4. **Streaming** — Native support for server streaming, client streaming, and bidirectional streaming
5. **Smaller payloads** — Important at scale (millions of inter-service calls/sec)
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: api-design, rest, versioning

Design an API versioning strategy for a public REST API. Compare URL versioning, header versioning, and query parameter versioning — which would you choose and why?

<!-- ANSWER -->
**Three approaches:**

**1. URL versioning:** `/api/v1/users`, `/api/v2/users`
```http
GET /api/v2/users/42
```
- ✅ Visible, easy to test in browser, easy to document
- ✅ Can cache v1 and v2 separately at CDN
- ❌ "Dirty" URL — version is not a resource property
- ❌ Breaking change requires path updates everywhere

**2. Header versioning:** `Accept: application/vnd.myapi.v2+json`
```http
GET /api/users/42
Accept: application/vnd.myapi.v2+json
```
- ✅ Clean URLs
- ✅ RESTful (version is about representation, not resource)
- ❌ Hard to test in browser
- ❌ Headers not visible in CDN cache keys by default (need `Vary` header)

**3. Query parameter:** `/api/users/42?version=2`
```http
GET /api/users/42?version=2
```
- ✅ Easy to test, works in browser
- ❌ Version mixed with query state
- ❌ CDN caching is awkward

**Recommendation:** **URL versioning** for public APIs.

Reasons:
- Discoverability — developers can type it in a browser
- Clear cache keys — CDN naturally caches `/v1/*` and `/v2/*` separately
- Explicit contract — clients must opt into v2 deliberately
- Used by all major public APIs: Stripe (`/v1/`), GitHub (`/v3/`), Twilio (`/2010-04-01/`)

**Strategy:**
```
v1  → maintained for 12+ months after v2 launch
v2  → current stable
v3  → preview/beta
```
Deprecation: announce 6 months before, send `Deprecation: Tue, 01 Jan 2025 00:00:00 GMT` header in v1 responses.
<!-- END -->
