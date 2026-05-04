---
title: TCP/IP Stack — Practice Quiz
articleSlug: net-tcp-ip
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: tcp, three-way-handshake

Draw the TCP three-way handshake. What is each step for?

<!-- ANSWER -->
```
Client                    Server
  |                          |
  |──── SYN ────────────────►|  
  |     seq=x                |  Client says: "I want to connect, my initial seq is x"
  |                          |
  |◄─── SYN-ACK ────────────|  
  |     seq=y, ack=x+1       |  Server says: "OK, my seq is y, and I received up to x"
  |                          |
  |──── ACK ────────────────►|  
  |     ack=y+1              |  Client says: "Got it, I received up to y"
  |                          |
  |═══════ DATA ════════════ |  Connection established — data flows
```

**Purpose of each step:**
- **SYN:** Client initiates; establishes client's initial sequence number (ISN)
- **SYN-ACK:** Server accepts; establishes server's ISN; acknowledges client's ISN
- **ACK:** Client acknowledges server's ISN — both sides now know each other's sequence numbers

**Why 3 steps and not 2?**
Both sides need to prove they can send AND receive. Two messages only confirm one direction.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: tcp, udp, comparison

You're building a multiplayer first-person shooter game. Would you use TCP or UDP for player position updates? What about for chat messages? Justify each.

<!-- ANSWER -->
**Player position updates → UDP**

Reasons:
1. **Latency is everything** — a 100ms stale position ruins gameplay; TCP retransmission could delay by 200ms+
2. **Old data is worthless** — if position packet from t=100ms is lost, retransmitting it at t=200ms is useless; the player has moved
3. **Loss is acceptable** — a missing frame means a slightly jerky animation for ~16ms; the next update corrects it
4. **Application-level prediction** — games use client-side interpolation to smooth over missing packets

**Chat messages → TCP**

Reasons:
1. **Reliability required** — a lost chat message must be retransmitted; seeing "half a message" is unacceptable
2. **Ordering matters** — "you died" followed by "game over" must arrive in order
3. **Infrequent** — chat messages are rare, so TCP's overhead is negligible
4. **Content integrity** — corrupted text is unacceptable

**Hybrid approach (industry standard):**
Most games use UDP for game state (position, health, events) with their own reliability layer for critical events (kills, item pickups), and TCP/WebSocket for lobby, chat, and social features.
<!-- END -->

<!-- QUESTION -->
difficulty: Easy
tags: ip-addressing, cidr, subnetting

What does the CIDR notation `10.0.0.0/24` mean? How many usable host addresses does it provide?

<!-- ANSWER -->
**CIDR notation `10.0.0.0/24`:**
- The `/24` means the first **24 bits** are the network prefix
- The remaining **8 bits** are for host addresses
- 2⁸ = **256 total addresses**

**Address range:** `10.0.0.0` to `10.0.0.255`

**Usable hosts:** 256 − 2 = **254 hosts**
- `10.0.0.0` — Network address (reserved)
- `10.0.0.255` — Broadcast address (reserved)
- `10.0.0.1` to `10.0.0.254` — usable host addresses

**Common CIDR sizes:**

| CIDR | Hosts | Common Use |
|---|---|---|
| /32 | 1 | Single host (loopback, specific route) |
| /30 | 2 | Point-to-point links |
| /24 | 254 | Small office / subnet |
| /16 | 65,534 | Medium network |
| /8 | 16,777,214 | Large organization |
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: nat, connection, networking

Explain how NAT (Network Address Translation) works. What problem does it solve, and what problem does it create?

<!-- ANSWER -->
**How NAT works:**

A NAT router sits between a private network (192.168.x.x) and the internet. It maintains a **translation table** mapping (private IP + port) → (public IP + port).

```
Private network            NAT Router               Internet
192.168.1.10:52000 ──────► 203.0.113.5:45000 ──────► api.google.com:443
192.168.1.11:52001 ──────► 203.0.113.5:45001 ──────► api.google.com:443

Translation table:
45000 ↔ 192.168.1.10:52000
45001 ↔ 192.168.1.11:52001

Response from Google:
→ 203.0.113.5:45000 → NAT looks up table → forward to 192.168.1.10:52000
```

**Problem it solves:** IPv4 address exhaustion. One public IP can serve an entire home/office network.

**Problem it creates:** **NAT traversal** for peer-to-peer connections. Two NAT'd devices behind different routers can't directly initiate connections to each other — neither knows the other's private IP, and the router only forwards responses to existing outbound connections.

**Solutions for NAT traversal:**
- **STUN** — devices discover their public IP:port via a server
- **TURN** — relay server forwards traffic when direct connection fails
- **ICE** — tries multiple methods (STUN, TURN) to find the best path (used by WebRTC)
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: tcp-congestion, sliding-window

Explain TCP's sliding window mechanism and how it prevents a fast sender from overwhelming a slow receiver.

<!-- ANSWER -->
TCP uses two complementary controls:

**1. Flow Control (Receiver Window — rwnd):**
The receiver tells the sender how much buffer space it has available. The sender must not have more unacknowledged data than `rwnd`.

```
Receiver buffer: 64KB
→ Receiver: "rwnd = 64KB" (in every ACK)
→ Sender: won't send more than 64KB ahead of the last ACK

If receiver buffer fills:
→ Receiver: "rwnd = 0" (stop!)
→ Sender: pauses, sends periodic 1-byte probes until rwnd > 0
```

**2. Congestion Control (Congestion Window — cwnd):**
The sender also limits itself based on estimated network capacity.

```
Effective window = min(rwnd, cwnd)
```

**Congestion phases:**
```
Slow Start:
  cwnd starts at 1 MSS
  Each ACK → cwnd doubles (exponential growth)
  Until cwnd hits ssthresh (slow-start threshold)

Congestion Avoidance:
  Each RTT → cwnd increases by 1 MSS (linear growth)
  Until packet loss detected

On loss (triple duplicate ACK):
  ssthresh = cwnd / 2
  cwnd = ssthresh (Fast Recovery)
  Linear growth resumes

On timeout (more severe):
  ssthresh = cwnd / 2
  cwnd = 1 MSS (back to Slow Start!)
```

**Practical result:** TCP is "self-tuning" — it continuously probes for available bandwidth and backs off immediately when it detects congestion, acting as a fair sharing mechanism across millions of simultaneous connections.
<!-- END -->
