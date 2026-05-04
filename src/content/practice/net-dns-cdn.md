---
title: DNS & CDN — Practice Quiz
articleSlug: net-dns-cdn
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: dns, resolution

Walk through the complete DNS resolution for `api.example.com` starting from the browser. What is cached at each stage?

<!-- ANSWER -->
```
1. Browser cache
   → Has api.example.com been resolved recently? TTL not expired?
   → Hit: done. Miss: continue.

2. Operating System cache / /etc/hosts
   → OS maintains its own DNS cache (nscd on Linux, DNS Client on Windows)
   → Hit: done. Miss: continue.

3. Recursive Resolver (e.g., 8.8.8.8 or ISP's resolver)
   → Has it cached api.example.com? Hit: return to browser.
   → Cache miss: start iterative resolution.

4. Root Nameserver (13 root server clusters worldwide)
   → "I don't know api.example.com, but .com is served by these TLD servers: [list]"
   → Resolver caches this (TTL: typically 2 days)

5. .com TLD Nameserver
   → "I don't know api.example.com, but example.com is at ns1.example.com"
   → Resolver caches this (TTL: typically 24–48 hours)

6. example.com Authoritative Nameserver
   → "api.example.com = 203.0.113.5, TTL=300"
   → Resolver caches this for 300 seconds

7. Resolver returns 203.0.113.5 to OS
   OS caches it → Browser caches it → Connection begins
```

**Total latency:** 50–150ms on first lookup. Subsequent lookups from cache: <1ms.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: dns-records, cname, a-record

Why can't you use a CNAME record on the root/apex domain (e.g., `example.com`)? What are the alternatives?

<!-- ANSWER -->
**The RFC restriction:**
A CNAME record cannot coexist with any other DNS record at the same name. The root/apex domain **must** have an NS record (for nameserver delegation) and often an MX record (for email). If you added a CNAME, these records would be invalid — so CNAME is forbidden at the apex.

```
# INVALID — CNAME conflicts with NS and MX:
example.com.   CNAME   myapp.vercel.app.   ← ❌
example.com.   NS      ns1.example.com.    ← required!
example.com.   MX      mail.example.com.   ← required!
```

**Alternatives:**

**1. A/AAAA record** — look up the IP of the target and hardcode it. Problem: if the target IP changes, you must manually update.

**2. CNAME Flattening (ALIAS / ANAME)** — a proprietary extension supported by Cloudflare, Route 53, and others. The DNS provider resolves the CNAME target and returns its IP as an A record, transparently. This works at the apex.

```
# ALIAS (Cloudflare):
example.com.   ALIAS   myapp.vercel.app.   ← ✅ resolved to A record transparently
```

**3. Redirect subdomain** — point apex to `www` via A record; redirect `www` via CNAME.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: cdn, cache-control, performance

What is the difference between `max-age` and `s-maxage` in a Cache-Control header? When would you use both?

<!-- ANSWER -->
| Directive | Who respects it |
|---|---|
| `max-age=N` | **Both** browsers and CDN/proxy caches |
| `s-maxage=N` | **Only** CDN/proxy caches (overrides `max-age` for CDN) |

**Use both when** you want different TTLs for the CDN vs the browser:

```http
Cache-Control: public, max-age=60, s-maxage=86400
```

- **Browser** caches for 60 seconds (user sees fresh data within 1 minute of changes)
- **CDN** caches for 24 hours (reduces origin load significantly)

When the content changes, you **purge the CDN** via API. The CDN then refetches from origin and serves fresh. Meanwhile, browser caches expire naturally within 60 seconds.

**Private data:**
```http
Cache-Control: private, max-age=300
```
`private` tells CDN (and any proxy) NOT to cache this response. Only the end user's browser may cache it.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: cdn, cache-invalidation, deployment

How do you deploy a new version of a JavaScript bundle to production without users getting stale cached files?

<!-- ANSWER -->
**Problem:** If you deploy `app.js` and CDN has cached the old version for 1 year, users get the old code.

**Solution: Content-hashed filenames**

Modern bundlers (Vite, Webpack) include a hash of the file content in the filename:

```
app.a1b2c3d4.js   ← hash changes when content changes
app.e5f6a7b8.js   ← new deploy = new hash = new URL
```

**Caching strategy:**
```http
# Hashed assets — safe to cache forever
Cache-Control: public, max-age=31536000, immutable

# index.html — short TTL (it references hashed assets by name)
Cache-Control: public, max-age=0, must-revalidate
```

**Deployment flow:**
1. Build produces `app.e5f6a7b8.js` (new hash)
2. Deploy to CDN — old `app.a1b2c3d4.js` still served to current users (graceful)
3. Deploy new `index.html` pointing to `app.e5f6a7b8.js`
4. `index.html` has `max-age=0` so browsers always check for the latest
5. Browser fetches new `index.html` → sees new JS hash → fetches new bundle → cached for 1 year

**`immutable` directive:** Tells browsers "even if you think this is stale, don't revalidate — the URL guarantees the content is immutable."
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: anycast, cdn, routing

How does anycast routing work in a CDN? How is it different from GeoDNS, and what are the advantages?

<!-- ANSWER -->
**GeoDNS:**
Returns different DNS answers (different IPs) based on where the user's DNS resolver is located.

```
User in Tokyo → DNS query → resolver in Tokyo → GeoDNS sees resolver location
→ returns Tokyo edge IP: 104.16.1.1
User in London → returns London edge IP: 104.16.2.1
```

**Problem with GeoDNS:** The DNS resolver location ≠ user location. Corporate DNS resolvers might be centralized in one city. A user in Paris using a US company's resolver would get US IP addresses.

---

**Anycast:**
Every CDN edge location **announces the same IP address** via BGP. The internet's routing infrastructure (BGP) naturally routes packets to the **topologically nearest** node announcing that IP.

```
IP 1.1.1.1 announced by:
  - Cloudflare Los Angeles (AS 13335)
  - Cloudflare London (AS 13335)
  - Cloudflare Tokyo (AS 13335)
  - (200+ locations globally)

User in Tokyo → BGP picks shortest AS path → Tokyo PoP
User in London → BGP picks shortest AS path → London PoP
```

**Advantages of anycast over GeoDNS:**
1. **Works regardless of DNS resolver location** — routing is at the network layer, not DNS
2. **Automatic failover** — if Tokyo PoP goes down, BGP re-routes to Osaka in seconds
3. **DDoS absorption** — attack traffic is spread across all PoPs globally, not concentrated on one IP
4. **No DNS TTL lag** — failover happens instantly via BGP, not after DNS TTL expiry
<!-- END -->
