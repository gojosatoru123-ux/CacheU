---
title: HTTP & HTTPS
articleSlug: net-http-https
---

# HTTP & HTTPS

## HTTP Versions
### HTTP/1.1
- Text protocol
- One request per conn
- Head-of-line blocking
- 6-8 parallel conns
### HTTP/2
- Binary protocol
- Multiplexed streams
- Header compression
- Server push
### HTTP/3 (QUIC)
- UDP-based
- No TCP HOL blocking
- 0-RTT reconnection
- Connection migration

## TLS / HTTPS
### TLS 1.3
- 1 RTT handshake
- Forward secrecy
- ECDH key exchange
### Certificate chain
- Domain → CA → Root CA
- Trust store in browser
- Certificate pinning
### HSTS
- Force HTTPS
- Preload list
- 301 redirect avoidance

## Status Codes
### 2xx Success
- 200 OK
- 201 Created
- 204 No Content
### 3xx Redirect
- 301 Moved Permanently
- 302 Found (temp)
- 304 Not Modified
### 4xx Client Error
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests
### 5xx Server Error
- 500 Internal Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

## Key Headers
### Security
- Strict-Transport-Security
- Content-Security-Policy
- X-Frame-Options
- Permissions-Policy
### CORS
- Access-Control-Allow-Origin
- Preflight OPTIONS
- Access-Control-Max-Age
### Caching
- Cache-Control
- ETag
- Last-Modified
- Vary

## Methods
### Safe methods
- GET: read only
- HEAD: headers only
- OPTIONS: preflight
### Mutating methods
- POST: create
- PUT: replace
- PATCH: partial update
- DELETE: remove
