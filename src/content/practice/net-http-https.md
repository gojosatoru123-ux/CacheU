---
title: HTTP & HTTPS — Practice Quiz
articleSlug: net-http-https
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: http2, multiplexing

What is the head-of-line blocking problem in HTTP/1.1, and how does HTTP/2 solve it?

<!-- ANSWER -->
**HTTP/1.1 Head-of-Line Blocking:**
HTTP/1.1 is strictly sequential on each TCP connection — the next request can't be sent until the previous response is fully received. To compensate, browsers open 6–8 parallel TCP connections per domain, but this is wasteful.

```
HTTP/1.1 connection:
  → GET /styles.css
  ← 200 styles.css (wait...)
  → GET /app.js       ← blocked until styles.css is done!
  ← 200 app.js
```

**HTTP/2 solution — Multiplexing:**
HTTP/2 splits all communication into independent **streams** over a **single TCP connection**. Each stream has an ID. Responses can arrive in any order, interleaved.

```
HTTP/2 connection (1 TCP):
  → Stream 1: GET /styles.css
  → Stream 2: GET /app.js    ← sent immediately, not blocked
  → Stream 3: GET /api/data
  ← Stream 2: app.js (arrived first)
  ← Stream 3: data
  ← Stream 1: styles.css
```

**Note:** TCP-level head-of-line blocking still exists in HTTP/2 (a lost TCP packet blocks all streams). HTTP/3 with QUIC solves this.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: tls, https, handshake

At a high level, describe the TLS 1.3 handshake. How many round trips does it take, and what happens in each?

<!-- ANSWER -->
TLS 1.3 completes in **1 Round Trip Time (1-RTT)**:

**RTT 1 — Client → Server: `ClientHello`**
- Supported cipher suites
- Client random nonce
- Key share (client's half of the key exchange, using ECDH)

**RTT 1 — Server → Client: `ServerHello` + encrypted data**
- Chosen cipher suite
- Server random nonce
- Server's key share (other half of ECDH)
- The shared secret can now be derived by BOTH sides
- The rest is already encrypted:
  - `{Certificate}` — server's identity
  - `{CertificateVerify}` — proof the server has the private key
  - `{Finished}` — MAC over the handshake transcript

**RTT 1 — Client → Server: `{Finished}`**
- Client verifies the certificate chain
- Client sends its Finished message
- Application data can now flow in BOTH directions

**0-RTT (Session Resumption):**
For returning clients, TLS 1.3 supports 0-RTT — the client can send application data in the very first message using a pre-shared key from the previous session.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: status-codes, http

A client sends a valid request but the resource has permanently moved. Which status code should the server return, and what header must accompany it?

<!-- ANSWER -->
**`301 Moved Permanently`** — the resource has permanently moved to a new URL.

The response **must** include a `Location` header pointing to the new URL:

```http
HTTP/1.1 301 Moved Permanently
Location: https://new.example.com/resource
Cache-Control: max-age=31536000
```

**Behavior:**
- Browsers automatically follow the redirect
- Search engines transfer page rank (SEO juice) to the new URL
- Browsers cache the redirect (so it happens locally on future requests without hitting the server)

**vs 302 Found (temporary):**
- `302` — redirect may change; browsers follow but don't cache long-term; search engines don't transfer rank

**vs 308 Permanent Redirect:**
- `308` — like `301` but guarantees the HTTP method is preserved (useful for POST redirects)
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: cors, security, headers

Explain CORS. Why does the browser enforce it, and what is a preflight request?

<!-- ANSWER -->
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts JavaScript from making HTTP requests to a different origin than the page was served from.

**Why:** The Same-Origin Policy prevents malicious scripts on `evil.com` from reading your `bank.com` data by making authenticated requests with your cookies.

**Preflight request:** For non-simple requests (PUT, DELETE, custom headers, JSON body), the browser first sends an `OPTIONS` request to check if the server allows the cross-origin request:

```http
OPTIONS /api/users HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

**Server response (allow):**
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

If the preflight succeeds, the browser sends the actual request. If the server doesn't respond with appropriate CORS headers, the browser blocks the request — the server never even sees it.

**`Access-Control-Max-Age`:** Caches the preflight result so browsers don't need to preflight every single request.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: caching, etag, cache-control

Design the caching strategy for a REST API that serves user profiles. The profiles change rarely but must be fresh within 60 seconds. Implement the server-side headers and client-side conditional request logic.

<!-- ANSWER -->
**Strategy:** `Cache-Control` with short `max-age` + `ETag` for conditional requests.

**Server response:**
```typescript
app.get('/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).end();

  // Generate ETag from content hash
  const etag = `"${createHash('md5').update(JSON.stringify(user)).digest('hex')}"`;

  // Conditional request — If-None-Match
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified — save bandwidth!
  }

  res
    .set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    .set('ETag', etag)
    .set('Last-Modified', user.updatedAt.toUTCString())
    .json(user);
});
```

**What each directive does:**
- `max-age=60` — Cache is fresh for 60 seconds; no request needed
- `stale-while-revalidate=300` — After 60s, serve stale data immediately AND revalidate in background; up to 300s stale is acceptable
- `ETag` — Content fingerprint; client sends `If-None-Match` on revalidation
- `304 Not Modified` — Server says "your cache is still valid, no body needed" → saves bandwidth

**Client flow:**
```
t=0s   → GET /users/42 → 200 + body + ETag + max-age=60
t=30s  → served from cache (no network request)
t=61s  → cache stale, but stale-while-revalidate: serve stale immediately
         + background: GET /users/42 with If-None-Match:"abc123"
t=61s  → server: nothing changed → 304 Not Modified (no body)
         cache refreshed, user never experienced a delay
```
<!-- END -->
