---
title: DNS & CDN
description: How DNS resolution works, record types, TTLs, and how CDNs cache and serve content from the edge.
category: Networking
order: 3
---

# DNS & CDN

DNS translates human-readable domain names to IP addresses. CDNs cache content close to users to reduce latency. Together they are the backbone of web performance.

## DNS — Domain Name System

### Resolution Chain

```
Browser: What is the IP for api.example.com?

1. Check browser cache → miss
2. Check OS cache → miss
3. Ask Recursive Resolver (ISP or 8.8.8.8)
   │
   ├── Ask Root Nameserver → "com. is served by .com TLD server at 192.5.6.30"
   │
   ├── Ask .com TLD Server → "example.com is served by ns1.example.com at 205.251.196.1"
   │
   └── Ask example.com Authoritative Server → "api.example.com = 203.0.113.5"

4. Recursive Resolver caches answer (per TTL)
5. Returns 203.0.113.5 to browser
6. Browser caches answer
```

Total time: 50–200ms on first lookup, <1ms from cache.

---

## DNS Record Types

### A Record

Maps a hostname to an IPv4 address.

```
api.example.com.    300    IN    A    203.0.113.5
```

### AAAA Record

Maps a hostname to an IPv6 address.

```
api.example.com.    300    IN    AAAA    2001:db8::5
```

### CNAME Record

Alias one name to another name (not an IP).

```
www.example.com.    300    IN    CNAME    example.com.
```

**Rule:** CNAME cannot coexist with other records on the same name. Never use CNAME on the root/apex domain.

### MX Record

Mail exchange — where to send email for this domain.

```
example.com.    3600    IN    MX    10    mail1.example.com.
example.com.    3600    IN    MX    20    mail2.example.com.
```

### TXT Record

Arbitrary text — used for domain ownership verification, SPF, DKIM.

```
example.com.    3600    IN    TXT    "v=spf1 include:_spf.google.com ~all"
```

### NS Record

Which nameservers are authoritative for this domain.

```
example.com.    86400    IN    NS    ns1.example.com.
example.com.    86400    IN    NS    ns2.example.com.
```

### SRV Record

Specifies a host and port for a specific service.

```
_https._tcp.example.com.    IN    SRV    0 5 443    api.example.com.
```

---

## DNS TTL Strategy

TTL controls how long records are cached.

| Scenario | Recommended TTL |
|---|---|
| Stable production records | 1 hour (3600s) |
| Preparing for migration | 5 minutes (300s) — lower before change |
| Disaster recovery records | 5–10 minutes |
| Internal / private DNS | 1 minute (60s) |

**Migration strategy:**
1. Lower TTL to 5 minutes (wait for old TTL to expire)
2. Make the DNS change
3. Raise TTL back to 1 hour after confirming

---

## GeoDNS

Route users to different IPs based on geographic location.

```
User in US     → DNS returns 54.204.x.x  (US East)
User in Europe → DNS returns 52.47.x.x   (EU West)
User in Asia   → DNS returns 52.220.x.x  (AP Southeast)
```

Used for: latency-based routing, compliance (data residency), disaster recovery failover.

---

## CDN — Content Delivery Network

A CDN is a globally distributed network of edge servers that cache content close to users.

### Without CDN

```
User (Tokyo) → 150ms → Origin Server (US Virginia) → 150ms → User
```

### With CDN

```
User (Tokyo) → 5ms → CDN Edge (Tokyo) → cache hit → User
User (Tokyo) → 5ms → CDN Edge (Tokyo) → cache miss → 150ms → Origin → cached → User
```

---

## CDN Caching Behavior

### Cache-Control Headers

The origin server tells CDN and browsers how to cache:

```http
Cache-Control: public, max-age=86400, s-maxage=604800
```

- `public` — can be cached by CDN and browsers
- `max-age=86400` — browser caches for 1 day
- `s-maxage=604800` — CDN caches for 1 week (overrides max-age for CDN)

```http
Cache-Control: private, max-age=3600
```

- `private` — CDN must not cache; only browser caches

### Cache Invalidation

```bash
# Cloudflare API — purge specific URL
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -d '{"files":["https://example.com/styles.css"]}'
```

---

## CDN Use Cases

### Static Assets

```
Bundle: app.a1b2c3d4.js → Cache-Control: public, max-age=31536000, immutable
```

Content-hashed filenames mean the URL changes when content changes → safe to cache forever.

### API Responses

```
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

Cache for 60 seconds; serve stale while revalidating for up to 5 minutes.

### Image Optimization

Modern CDNs (Cloudflare Images, Imgix, Fastly) resize and convert images on the fly:

```
https://cdn.example.com/photo.jpg?w=800&h=600&format=webp&quality=80
```

---

## Anycast Routing

CDN edge servers share the same IP address. BGP anycast routes requests to the topologically nearest server.

```
IP 104.16.0.0 announced by:
  - Los Angeles edge
  - London edge
  - Tokyo edge
  
User in Europe → BGP routes to London edge automatically
```

This is how Cloudflare, AWS CloudFront, and Fastly achieve global low latency without DNS-based routing.
