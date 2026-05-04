---
title: TCP/IP Stack
articleSlug: net-tcp-ip
---

# TCP/IP Stack

## Four Layers
### Application Layer
- HTTP, DNS, SMTP
- WebSocket, gRPC
- Port numbers
### Transport Layer
- TCP: reliable
- UDP: fast, lossy
- Ports 0–65535
### Internet Layer
- IP addressing
- Routing between nets
- ICMP ping/traceroute
### Network Access
- Ethernet, Wi-Fi
- MAC addresses
- Physical medium

## IP Addressing
### IPv4
- 32-bit addresses
- ~4.3B total
- Exhausted in 2011
### IPv6
- 128-bit addresses
- 3.4 × 10³⁸ total
- Slow adoption
### CIDR Notation
- /24 = 256 addresses
- /16 = 65K addresses
- Subnet masks
### Private ranges
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

## TCP
### Three-way handshake
- SYN → SYN-ACK → ACK
- Establish ISN both sides
- ~1.5 RTT cost
### Reliability
- Sequence numbers
- ACK every segment
- Retransmit on loss
### Flow control
- Receiver window (rwnd)
- Sender respects limit
- Zero window pause
### Congestion control
- Slow start
- Congestion avoidance
- Fast retransmit
- CUBIC / BBR algorithms

## UDP
### Connectionless
- No handshake
- No ACKs
- No ordering
### Use cases
- DNS queries
- Video streaming
- Online games
- WebRTC calls
- HTTP/3 (QUIC)

## NAT
### How it works
- Many private → one public IP
- Port translation table
- Stateful mappings
### Problems
- P2P connectivity
- Server hosting
### Solutions
- UPnP port mapping
- STUN / TURN
- IPv6 (no NAT needed)
