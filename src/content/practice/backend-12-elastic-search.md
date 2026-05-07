````md id="8m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: inverted-index, search-engines, elasticsearch

What is an inverted index?

<!-- ANSWER -->
An inverted index is a data structure used by search engines to map words to the documents that contain them.

Instead of storing:

```text
Document → Words
````

an inverted index stores:

```text id="4m8qza"
Word → Documents
```

Example:

| Word          | Documents  |
| ------------- | ---------- |
| backend       | Doc1, Doc3 |
| elasticsearch | Doc2       |
| database      | Doc1, Doc2 |

Benefits:

* extremely fast text search
* efficient keyword lookup
* scalable full-text indexing

Search engines like Elasticsearch rely heavily on inverted indexes.

<!-- END -->

````id="5v1xke"

```md id="2n7qpd"
<!-- QUESTION -->
difficulty: Easy
tags: elasticsearch, search, distributed-systems

What is Elasticsearch?

<!-- ANSWER -->
Elasticsearch is a distributed search and analytics engine optimized for fast full-text search.

It is built on:

```text id="6m2xqc"
Apache Lucene
````

Common Elasticsearch use cases:

* website search
* log analytics
* autocomplete
* monitoring dashboards

Architecture:

```text
Application → Elasticsearch Cluster
```

Key features:

| Feature                  | Purpose             |
| ------------------------ | ------------------- |
| Full-text search         | Fast keyword search |
| Distributed architecture | Horizontal scaling  |
| Near real-time indexing  | Fast updates        |
| REST APIs                | Easy integration    |

Elasticsearch is widely used in large-scale systems requiring powerful search capabilities.

<!-- END -->

````id="9x2vke"

```md id="4q7xwc"
<!-- QUESTION -->
difficulty: Easy
tags: full-text-search, elasticsearch, indexing

How does full-text search differ from normal database search?

<!-- ANSWER -->
Traditional databases are optimized for structured queries.

Full-text search engines are optimized for searching text content efficiently.

SQL example:

```sql
SELECT * FROM posts
WHERE title = 'Backend'
````

Full-text search example:

```text id="6p1qxt"
Find documents related to:
"backend scaling architecture"
```

Comparison:

| Database Search      | Full-Text Search         |
| -------------------- | ------------------------ |
| Exact matching       | Relevance-based matching |
| Slower text scanning | Optimized indexing       |
| Limited ranking      | Advanced scoring         |

Full-text search supports:

* fuzzy matching
* ranking
* stemming
* autocomplete

Elasticsearch is optimized specifically for these search workloads.

<!-- END -->

````id="3x5vke"

```md id="1n8qpd"
<!-- QUESTION -->
difficulty: Medium
tags: tokenization, indexing, elasticsearch

What is tokenization in search engines?

<!-- ANSWER -->
Tokenization is the process of breaking text into searchable units called tokens.

Example text:

```text
"Backend Search Engine"
````

Tokens:

```text id="5m2xqc"
backend
search
engine
```

Search engines tokenize data before indexing.

Benefits:

* efficient search
* keyword matching
* normalization

Additional processing may include:

| Process           | Purpose                 |
| ----------------- | ----------------------- |
| Lowercasing       | Case-insensitive search |
| Stemming          | Root word matching      |
| Stop-word removal | Ignore common words     |

Example:

```text id="8w4qza"
running → run
```

Tokenization is a fundamental part of search engine indexing.

<!-- END -->

````id="8w4qza"

```md id="5x1vyt"
<!-- QUESTION -->
difficulty: Medium
tags: shards, distributed-search, elasticsearch

What are shards in Elasticsearch?

<!-- ANSWER -->
Shards are smaller partitions of an Elasticsearch index distributed across multiple nodes.

Instead of storing all data on one server:

```text id="clt6p5"
Large Index → Multiple Shards
````

Benefits:

| Benefit            | Purpose                  |
| ------------------ | ------------------------ |
| Horizontal scaling | Spread data across nodes |
| Parallel search    | Faster querying          |
| Fault tolerance    | Redundancy support       |

Example:

```text id="2v7qwr"
Index:
  Shard 1
  Shard 2
  Shard 3
```

Elasticsearch distributes shards automatically across cluster nodes.

Sharding enables Elasticsearch to scale to massive datasets.

<!-- END -->

````id="2v7qwr"

```md id="9m3xpd"
<!-- QUESTION -->
difficulty: Medium
tags: replicas, fault-tolerance, elasticsearch

What are replica shards in Elasticsearch?

<!-- ANSWER -->
Replica shards are copies of primary shards used for fault tolerance and read scalability.

Example:

```text
Primary Shard → Replica Shard
````

Benefits:

| Benefit                 | Explanation               |
| ----------------------- | ------------------------- |
| High availability       | Survive node failures     |
| Better read performance | Distribute search queries |
| Redundancy              | Prevent data loss         |

Example cluster:

```text id="4q2xmc"
Node A → Primary
Node B → Replica
```

If a node fails:

* replicas can become primaries
* search continues without downtime

Replica shards are essential for production Elasticsearch clusters.

<!-- END -->

````id="7n1qxt"

```md id="3m5vke"
<!-- QUESTION -->
difficulty: Hard
tags: relevance-scoring, search-ranking, elasticsearch

How does Elasticsearch rank search results?

<!-- ANSWER -->
Elasticsearch ranks results using relevance scoring algorithms.

The goal is to return:

```text id="4v8qpd"
Most relevant documents first
````

Factors affecting ranking:

| Factor                     | Purpose                        |
| -------------------------- | ------------------------------ |
| Term frequency             | Word repetition importance     |
| Inverse document frequency | Rare words weighted higher     |
| Field length               | Shorter fields may rank better |
| Query matching             | Closer matches score higher    |

Example:

```text
Query:
"backend search"
```

Documents containing both words rank higher.

Elasticsearch uses advanced ranking algorithms derived from Lucene such as:

```text id="5w2qwc"
BM25
```

Relevance scoring is a core reason search engines outperform traditional databases for text search.

<!-- END -->

````id="5w2qwc"

```md id="1x7vza"
<!-- QUESTION -->
difficulty: Hard
tags: autocomplete, elasticsearch, search-systems

How does autocomplete work in Elasticsearch?

<!-- ANSWER -->
Autocomplete predicts search results as users type partial queries.

Example:

```text
User types:
"elas"
````

Suggestions:

```text id="6m3qpd"
elasticsearch
elastic cloud
elastic index
```

Techniques used:

| Technique            | Purpose                   |
| -------------------- | ------------------------- |
| Prefix matching      | Match starting characters |
| N-grams              | Partial token matching    |
| Completion suggester | Fast suggestions          |

Benefits:

* faster search experience
* improved usability
* reduced typing effort

Autocomplete requires optimized indexing strategies for low-latency suggestions.

<!-- END -->

````id="8p5vke"

```md id="6n2xpd"
<!-- QUESTION -->
difficulty: Hard
tags: near-real-time-search, elasticsearch, indexing

Why is Elasticsearch called a near real-time search engine?

<!-- ANSWER -->
Elasticsearch is called near real-time because indexed documents become searchable within a short delay instead of instantly.

Typical delay:

```text id="1q8vza"
~1 second
````

Process:

```text
Document Indexed
↓
Refresh Operation
↓
Searchable
```

Why delay exists:

* optimize indexing performance
* batch updates efficiently
* reduce expensive disk operations

Example:

```text id="9m4qwc"
Insert document → searchable shortly after
```

Near real-time indexing balances:

* search speed
* indexing throughput
* cluster efficiency

This makes Elasticsearch highly efficient for large-scale search systems.

<!-- END -->

````id="1q8vza"

```md id="9m4qwc"
<!-- QUESTION -->
difficulty: Hard
tags: elasticsearch-vs-sql, system-design, search-architecture

Why should Elasticsearch not fully replace relational databases?

<!-- ANSWER -->
Elasticsearch is optimized for search workloads, not transactional consistency.

Comparison:

| Relational Database | Elasticsearch |
|---|---|
| ACID transactions | Search optimization |
| Strong consistency | Near real-time indexing |
| Complex joins | Full-text search |
| Source of truth | Search layer |

Problems if Elasticsearch becomes primary database:
- weaker transactional guarantees
- complex updates
- synchronization challenges

Common architecture:

```text id="7v2xpd"
Application → Database → Elasticsearch Sync
````

Database stores:

* authoritative business data

Elasticsearch stores:

* searchable indexed data

Most production systems use both together.

<!-- END -->