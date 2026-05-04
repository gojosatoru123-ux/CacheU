---
title: TCP/IP Stack
description: The four-layer internet model, TCP connection lifecycle, UDP, congestion control, and how data travels across the internet.
category: Networking
order: 2
---

# TCP/IP Stack

The TCP/IP model is the foundational architecture of the internet, defining how data is packaged, addressed, transmitted, routed, and received.

## The Four-Layer Model

```
Application Layer   → HTTP, WebSocket, DNS, SMTP
Transport Layer     → TCP, UDP
Internet Layer      → IP, ICMP, ARP
Network Access      → Ethernet, Wi-Fi, fiber
```

Data travels DOWN the stack when sending, UP when receiving. Each layer adds its own header (encapsulation).

```
HTTP Request
  + TCP Header (source/dest port, seq number)
  + IP Header (source/dest IP address)
  + Ethernet Frame (source/dest MAC address)
  → sent over physical medium
```

---

## IP Addressing

### IPv4

32-bit address: `192.168.1.100`  
Notation: four octets (0–255) separated by dots  
Total addresses: ~4.3 billion (exhausted)

### IPv6

128-bit address: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`  
Total addresses: 3.4 × 10³⁸ (practically unlimited)

### Private IP Ranges (RFC 1918)

```
10.0.0.0/8       → 10.x.x.x        (corporate networks)
172.16.0.0/12    → 172.16–31.x.x   (Docker default)
192.168.0.0/16   → 192.168.x.x     (home routers)
```

### CIDR Notation

`10.0.0.0/24` means the first 24 bits are the network prefix → 256 addresses (10.0.0.0 to 10.0.0.255)

---

## TCP — Transmission Control Protocol

TCP provides **reliable, ordered, error-checked** delivery of data.

### Three-Way Handshake (Connection Setup)

```
Client                  Server
  |──── SYN ──────────►|    (I want to connect, seq=100)
  |◄─── SYN-ACK ───────|    (OK, my seq=200, ack=101)
  |──── ACK ──────────►|    (Got it, ack=201)
  |═══ Data Transfer ══|
```

### Four-Way Teardown (Connection Close)

```
Client                  Server
  |──── FIN ──────────►|
  |◄─── ACK ───────────|
  |◄─── FIN ───────────|
  |──── ACK ──────────►|
  (TIME_WAIT: 2×MSL before port reuse)
```

### TCP Features

**Sequence Numbers & ACKs:** Every byte has a sequence number. Receiver ACKs received bytes. Missing bytes are retransmitted.

**Flow Control (Sliding Window):** Receiver advertises how much buffer space it has. Sender doesn't exceed this.

```
Receiver: rwnd=65535 (I can buffer 65KB)
Sender: sends up to 65KB before waiting for ACK
```

**Congestion Control:** TCP detects network congestion and backs off.

| Algorithm | Phase | Behavior |
|---|---|---|
| Slow Start | Connection start | Exponentially increase window |
| Congestion Avoidance | Normal operation | Linearly increase window |
| Fast Retransmit | 3 duplicate ACKs | Retransmit without waiting for timeout |
| Fast Recovery | After retransmit | Halve window, linear growth |

---

## UDP — User Datagram Protocol

UDP provides **fast, connectionless, best-effort** delivery.

- No handshake, no ACKs, no ordering guarantee
- Much lower overhead than TCP
- Application handles reliability if needed

**Use cases:**

| Use Case | Why UDP |
|---|---|
| DNS queries | Single packet, response fits one datagram |
| Video streaming | Dropped frames OK, low latency matters more |
| Online gaming | Old position data useless, fresh data preferred |
| WebRTC (audio/video calls) | Latency critical, minor loss acceptable |
| HTTP/3 (QUIC) | Implements own reliability on top of UDP |

```typescript
// Node.js UDP socket
import dgram from 'dgram';
const socket = dgram.createSocket('udp4');

socket.send(Buffer.from('hello'), 8080, 'server.example.com', (err) => {
  if (err) console.error('Send failed:', err);
});
```

---

## Common Ports

| Port | Protocol | Service |
|---|---|---|
| 22 | TCP | SSH |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 27017 | TCP | MongoDB |

---

## NAT — Network Address Translation

Allows many private IPs to share one public IP.

```
Private Network         Router (NAT)          Internet
192.168.1.10:52000 ─►  203.0.113.5:45000 ──► api.example.com:443
192.168.1.11:52001 ─►  203.0.113.5:45001 ──► api.example.com:443
```

The router maintains a translation table to route responses back.

**Problem:** NAT breaks peer-to-peer connectivity (two NAT'd devices can't directly reach each other). WebRTC uses ICE/STUN/TURN to work around this.

---

## TCP vs UDP Decision Guide

```
Need guaranteed delivery?     → TCP
Sending large data?           → TCP
Real-time, latency-sensitive? → UDP
Can tolerate some packet loss? → UDP
Need ordering guarantee?      → TCP
Building on top of HTTP?      → TCP (HTTP/1.1 and 2)
Using modern QUIC/HTTP3?      → UDP (QUIC handles reliability)
```
