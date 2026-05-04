---
title: HTTP & HTTPS
description: How HTTP/1.1, HTTP/2, and HTTP/3 work, TLS handshake, headers, status codes, and security best practices.
category: Networking
order: 1
---

# HTTP & HTTPS

HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. HTTPS adds TLS encryption to make it secure.

## HTTP/1.1

The version that dominated the web from 1997 to ~2015.

### Request Format

```
GET /users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbG...
```

### Response Format

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 83
Cache-Control: max-age=3600

{"id": 42, "name": "Alice", "email": "alice@example.com"}
```

### HTTP/1.1 Problems

- **Head-of-line blocking** — requests queue behind each other on a connection
- **No multiplexing** — browsers open 6–8 parallel TCP connections per domain to compensate
- **Redundant headers** — same headers sent with every request (cookies, auth, user-agent)
- **No server push** — server can't proactively send resources

---

## HTTP/2

Published in 2015, HTTP/2 solves the major HTTP/1.1 performance problems.

### Key Features

**Multiplexing** — Multiple requests and responses share a single TCP connection simultaneously.

```
Connection (single TCP):
  Stream 1: GET /styles.css  → 200 + CSS
  Stream 2: GET /app.js      → 200 + JS
  Stream 3: GET /api/user    → 200 + JSON
  (all in parallel)
```

**Header Compression (HPACK)** — Headers are compressed and deduplicated, reducing overhead by ~80%.

**Server Push** — Server proactively sends resources before the client requests them.

```
GET /index.html
← 200 index.html
← Push: /styles.css (before client asks)
← Push: /app.js
```

**Binary Protocol** — More efficient to parse than text-based HTTP/1.1.

---

## HTTP/3

HTTP/3 replaces TCP with **QUIC** (built on UDP).

### Why QUIC?

TCP head-of-line blocking still affected HTTP/2 at the transport layer — if one TCP packet is lost, all streams wait for retransmission.

QUIC implements independent streams at the transport layer:

```
Packet loss in stream 1:
  HTTP/2 over TCP: ALL streams stall
  HTTP/3 over QUIC: Only stream 1 stalls
```

**QUIC also provides:**
- Built-in TLS 1.3 (0-RTT reconnection for returning users)
- Faster connection establishment (1 RTT vs TCP's 3-way handshake + TLS)
- Connection migration (mobile users changing from WiFi to cellular keep the same connection)

---

## TLS Handshake (HTTPS)

TLS 1.3 handshake in 1 RTT:

```
Client                              Server
  |                                   |
  |──── ClientHello ─────────────────►|  (supported ciphers, random, key share)
  |                                   |
  |◄─── ServerHello ─────────────────|  (chosen cipher, certificate, key share)
  |◄─── {EncryptedExtensions}        |
  |◄─── {Certificate}               |
  |◄─── {CertificateVerify}         |
  |◄─── {Finished}                  |
  |                                   |
  |──── {Finished} ─────────────────►|
  |◄═══ Encrypted Data ══════════════|  (application data, 1-RTT total)
```

### Certificate Validation

1. Server sends its TLS certificate (domain name + public key + expiry)
2. Certificate is signed by a Certificate Authority (CA) the client trusts
3. Client verifies the signature chain up to a root CA
4. Client uses the server's public key to establish a shared secret (ECDH key exchange)

---

## HTTP Status Codes

### 2xx Success

| Code | Name | When |
|---|---|---|
| 200 | OK | Standard success |
| 201 | Created | Resource created (POST) |
| 204 | No Content | Success with no body (DELETE) |

### 3xx Redirection

| Code | Name | When |
|---|---|---|
| 301 | Moved Permanently | Domain redirect, SEO |
| 302 | Found | Temporary redirect |
| 304 | Not Modified | Client cache is still valid |

### 4xx Client Errors

| Code | Name | When |
|---|---|---|
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limited |

### 5xx Server Errors

| Code | Name | When |
|---|---|---|
| 500 | Internal Server Error | Unhandled exception |
| 502 | Bad Gateway | Upstream server error |
| 503 | Service Unavailable | Overloaded or maintenance |
| 504 | Gateway Timeout | Upstream server too slow |

---

## Important HTTP Headers

### Security Headers

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()
```

### CORS Headers

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Caching Headers

```http
Cache-Control: public, max-age=86400, stale-while-revalidate=3600
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```
