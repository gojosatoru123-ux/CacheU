---
title: DNS & CDN
articleSlug: net-dns-cdn
---

# DNS & CDN

## DNS Resolution
### Hierarchy
- Root nameservers (13 clusters)
- TLD servers (.com, .io)
- Authoritative NS
- Recursive resolver
### Resolution steps
- Browser cache
- OS cache
- Recursive resolver
- Root → TLD → Auth
### Caching
- TTL controls lifespan
- Browser caches
- OS / resolver caches

## DNS Record Types
### A Record
- Hostname → IPv4
- Most common record
### AAAA Record
- Hostname → IPv6
### CNAME
- Alias to another name
- Not at apex domain
### MX Record
- Mail exchange server
- Priority value
### TXT Record
- Arbitrary text
- SPF, DKIM, verification
### NS Record
- Authoritative servers
- Delegation

## TTL Strategy
### Low TTL (60-300s)
- Pre-migration step
- Fast failover
- Higher DNS load
### High TTL (3600s+)
- Stable production
- Cache efficiency
- Slow changes
### Migration pattern
- Lower TTL first
- Make change
- Raise TTL after

## CDN Architecture
### Edge servers
- PoP worldwide
- Cache static assets
- Process at edge
### Origin server
- Source of truth
- CDN pulls from here
- Purge API
### Cache behavior
- s-maxage for CDN
- max-age for browser
- stale-while-revalidate

## CDN Features
### Content caching
- CSS / JS / images
- Content-hashed names
- Immutable directive
### Image optimization
- Resize on the fly
- WebP conversion
- Quality adjustment
### Security
- DDoS mitigation
- WAF rules
- Bot protection
### Edge computing
- Run code at edge
- Cloudflare Workers
- Vercel Edge Functions

## GeoDNS vs Anycast
### GeoDNS
- Different IPs by location
- DNS-level routing
- TTL lag on failover
### Anycast
- Same IP, many nodes
- BGP routes nearest
- Instant failover
- DDoS distribution
