````md id="8m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: scaling, backend, performance-engineering

What is scaling in backend systems?

<!-- ANSWER -->
Scaling is the process of increasing a system's capacity to handle more users, requests, or data.

Example:

```text
More Users → More Server Load
````

Goal:

```text id="4m8qza"
Maintain performance under increasing traffic
```

Common scaling types:

| Type               | Purpose               |
| ------------------ | --------------------- |
| Vertical scaling   | Increase server power |
| Horizontal scaling | Add more servers      |

Scaling is essential for:

* high traffic applications
* SaaS platforms
* distributed systems

Modern backend systems are designed with scalability in mind.

<!-- END -->

````id="5v1xke"

```md id="2n7qpd"
<!-- QUESTION -->
difficulty: Easy
tags: vertical-scaling, infrastructure, backend

What is vertical scaling?

<!-- ANSWER -->
Vertical scaling increases the resources of a single server.

Examples:
- more CPU
- more RAM
- faster storage

Architecture:

```text id="6m2xqc"
Small Server → Bigger Server
````

Benefits:

| Benefit              | Explanation                  |
| -------------------- | ---------------------------- |
| Simpler architecture | Fewer distributed components |
| Easy upgrades        | Increase machine capacity    |

Limitations:

* hardware limits
* single point of failure
* expensive scaling

Vertical scaling is often the first scaling approach used in backend systems.

<!-- END -->

````id="9x2vke"

```md id="4q7xwc"
<!-- QUESTION -->
difficulty: Easy
tags: horizontal-scaling, distributed-systems, backend

What is horizontal scaling?

<!-- ANSWER -->
Horizontal scaling adds more servers to distribute workload across multiple machines.

Architecture:

```text id="6p1qxt"
Load Balancer
  ↓
Server 1
Server 2
Server 3
````

Benefits:

| Benefit            | Explanation                     |
| ------------------ | ------------------------------- |
| Better scalability | Add more servers easily         |
| Fault tolerance    | One server failure less harmful |
| High availability  | Distributed workload            |

Challenges:

* distributed coordination
* session handling
* data consistency

Horizontal scaling is fundamental in large-scale backend architectures.

<!-- END -->

````id="3x5vke"

```md id="1n8qpd"
<!-- QUESTION -->
difficulty: Medium
tags: load-balancing, networking, backend-performance

What is load balancing?

<!-- ANSWER -->
Load balancing distributes incoming traffic across multiple backend servers.

Example flow:

```text id="5m2xqc"
Client Requests → Load Balancer → Multiple Servers
````

Benefits:

| Benefit              | Explanation               |
| -------------------- | ------------------------- |
| Prevent overload     | Traffic distribution      |
| Improve availability | Redundant servers         |
| Better performance   | Parallel request handling |

Common load balancing strategies:

| Strategy          | Description               |
| ----------------- | ------------------------- |
| Round Robin       | Sequential distribution   |
| Least Connections | Fewest active connections |
| IP Hashing        | Client-based routing      |

Load balancers are critical for scalable backend systems.

<!-- END -->

````id="8w4qza"

```md id="5x1vyt"
<!-- QUESTION -->
difficulty: Medium
tags: caching, backend-performance, system-design

Why is caching important for backend performance?

<!-- ANSWER -->
Caching stores frequently accessed data temporarily for faster retrieval.

Instead of:

```text id="clt6p5"
Repeated Database Queries
````

systems use:

```text id="2v7qwr"
Cache → Fast Response
```

Benefits:

| Benefit              | Explanation             |
| -------------------- | ----------------------- |
| Reduced latency      | Faster responses        |
| Lower database load  | Fewer expensive queries |
| Improved scalability | Handle more traffic     |

Common cache systems:

* Redis
* Memcached
* CDN caches

Caching is one of the most effective backend performance optimizations.

<!-- END -->

````id="2v7qwr"

```md id="9m3xpd"
<!-- QUESTION -->
difficulty: Medium
tags: latency, backend-performance, networking

What is latency in backend systems?

<!-- ANSWER -->
Latency is the time required for a request to travel through a system and receive a response.

Example:

```text id="4q2xmc"
Client Request → Server Response = 120ms
````

Sources of latency:

* network delays
* database queries
* disk I/O
* processing time

Latency types:

| Type                | Explanation             |
| ------------------- | ----------------------- |
| Network latency     | Data transmission delay |
| Application latency | Backend processing time |
| Database latency    | Query execution delay   |

Reducing latency improves:

* user experience
* responsiveness
* system efficiency

Latency optimization is a major performance engineering goal.

<!-- END -->

````id="7n1qxt"

```md id="3m5vke"
<!-- QUESTION -->
difficulty: Hard
tags: database-scaling, sharding, distributed-systems

What is database sharding?

<!-- ANSWER -->
Database sharding splits data across multiple databases or servers.

Instead of:

```text id="4v8qpd"
One Large Database
````

systems use:

```text id="5w2qwc"
Shard 1
Shard 2
Shard 3
```

Benefits:

| Benefit              | Explanation                 |
| -------------------- | --------------------------- |
| Horizontal scaling   | Spread workload             |
| Improved performance | Smaller datasets per shard  |
| Higher capacity      | Support massive data growth |

Common sharding strategies:

* user ID ranges
* geographic partitioning
* hash-based partitioning

Sharding introduces complexity:

* cross-shard queries
* distributed transactions
* rebalancing

It is commonly used in very large-scale systems.

<!-- END -->

````id="5w2qwc"

```md id="1x7vza"
<!-- QUESTION -->
difficulty: Hard
tags: cdn, performance-engineering, web-infrastructure

What is a CDN and how does it improve performance?

<!-- ANSWER -->
A CDN (Content Delivery Network) distributes static content across geographically distributed servers.

Examples of cached content:
- images
- videos
- CSS files
- JavaScript

Architecture:

```text id="6m3qpd"
User → Nearest CDN Edge Server
````

Benefits:

| Benefit            | Explanation            |
| ------------------ | ---------------------- |
| Reduced latency    | Content served nearby  |
| Lower origin load  | Fewer backend requests |
| Better scalability | Distributed traffic    |

Popular CDN providers:

* Cloudflare
* Akamai
* Fastly

CDNs are critical for globally distributed applications.

<!-- END -->

````id="8p5vke"

```md id="6n2xpd"
<!-- QUESTION -->
difficulty: Hard
tags: throughput, backend-performance, system-design

What is throughput in backend systems?

<!-- ANSWER -->
Throughput measures how many operations or requests a system can process within a time period.

Example:

```text id="1q8vza"
10,000 requests per second
````

High throughput systems:

* process many concurrent requests
* optimize resource utilization
* scale efficiently

Factors affecting throughput:

| Factor               | Explanation          |
| -------------------- | -------------------- |
| CPU performance      | Faster processing    |
| Network bandwidth    | Faster communication |
| Efficient algorithms | Reduced computation  |
| Caching              | Lower backend load   |

Throughput is a key performance engineering metric.

<!-- END -->

````id="1q8vza"

```md id="9m4qwc"
<!-- QUESTION -->
difficulty: Hard
tags: bottlenecks, performance-engineering, backend-optimization

What is a bottleneck in backend performance engineering?

<!-- ANSWER -->
A bottleneck is the slowest component limiting overall system performance.

Example:

```text id="7v2xpd"
Fast API
↓
Slow Database
↓
Overall Slow System
````

Common bottlenecks:

* database queries
* disk I/O
* network bandwidth
* CPU-intensive tasks

Detection methods:

* profiling
* monitoring
* tracing

Benefits of bottleneck analysis:

| Benefit               | Explanation                 |
| --------------------- | --------------------------- |
| Targeted optimization | Focus on limiting factors   |
| Better scalability    | Remove performance barriers |
| Improved efficiency   | Balanced resource usage     |

Performance engineering focuses heavily on identifying and eliminating bottlenecks.

<!-- END -->