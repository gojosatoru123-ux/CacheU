````md id="7m2xqa"
<!-- QUESTION -->
difficulty: Easy
tags: serialization, deserialization, backend

What is serialization?

<!-- ANSWER -->
Serialization is the process of converting an in-memory object into a transferable or storable format.

Common serialization formats:
- JSON
- XML
- Protocol Buffers
- MessagePack

Example object:

```js
{
  name: "Alex",
  age: 25
}
````

Serialized JSON:

```json id="3q8vpa"
{
  "name": "Alex",
  "age": 25
}
```

Serialization is commonly used for:

* API responses
* caching
* file storage
* messaging systems

Benefits:

| Benefit          | Purpose                      |
| ---------------- | ---------------------------- |
| Data transfer    | Send over network            |
| Persistence      | Save to disk                 |
| Interoperability | Cross-language communication |

Serialization is essential in distributed systems and web applications.

<!-- END -->

````id="5v9kpd"

```md id="2p7xqe"
<!-- QUESTION -->
difficulty: Easy
tags: deserialization, backend, json

What is deserialization?

<!-- ANSWER -->
Deserialization is the process of converting serialized data back into an in-memory object.

Example JSON:

```json
{
  "name": "Alex",
  "age": 25
}
````

Deserialized object:

```js id="8m1vyt"
{
  name: "Alex",
  age: 25
}
```

Typical flow:

```text
Serialized Data → Deserialization → Application Object
```

Deserialization is used in:

* API request parsing
* database retrieval
* message queue consumers
* file loading

Common formats:

* JSON
* XML
* YAML
* binary protocols

Deserialization reconstructs usable application data from transmitted or stored formats.

<!-- END -->

````id="4n3qza"

```md id="9x1vke"
<!-- QUESTION -->
difficulty: Easy
tags: json, serialization, api

Why is JSON commonly used for serialization?

<!-- ANSWER -->
JSON (JavaScript Object Notation) is lightweight, readable, and language-independent.

Example:

```json
{
  "id": 1,
  "name": "Alex"
}
````

Advantages of JSON:

| Benefit                | Explanation               |
| ---------------------- | ------------------------- |
| Human-readable         | Easy to debug             |
| Lightweight            | Smaller payloads          |
| Language-independent   | Works across platforms    |
| Native browser support | Easy frontend integration |

JSON is widely used in:

* REST APIs
* configuration files
* microservices
* frontend-backend communication

Example HTTP response:

```http id="8q2vma"
Content-Type: application/json
```

JSON became the standard serialization format for modern web applications.

<!-- END -->

````id="6w7xpd"

```md id="1m9qzt"
<!-- QUESTION -->
difficulty: Medium
tags: serialization, networking, distributed-systems

Why is serialization important in distributed systems?

<!-- ANSWER -->
Distributed systems communicate across networks where objects cannot be transferred directly.

Serialization converts objects into transferable formats.

Example architecture:

```text
Service A → Serialized Data → Network → Service B
````

Without serialization:

* memory objects cannot cross processes
* services cannot communicate
* data cannot be persisted

Common distributed system uses:

* APIs
* message queues
* RPC frameworks
* caching systems

Popular serialization formats:

| Format           | Use Case                 |
| ---------------- | ------------------------ |
| JSON             | Web APIs                 |
| Protocol Buffers | High-performance RPC     |
| Avro             | Big data systems         |
| MessagePack      | Compact binary messaging |

Serialization is fundamental to service-to-service communication.

<!-- END -->

````id="3v5xmc"

```md id="8k2qwr"
<!-- QUESTION -->
difficulty: Medium
tags: binary-serialization, performance, backend

What is the difference between text-based and binary serialization?

<!-- ANSWER -->
Text-based serialization stores data in readable text formats.

Binary serialization stores data in compact binary form.

Comparison:

| Text-Based | Binary |
|---|---|
| Human-readable | Compact |
| Easier debugging | Faster parsing |
| Larger payloads | Smaller payloads |
| Example: JSON | Example: Protocol Buffers |

JSON example:

```json
{
  "name": "Alex"
}
````

Binary formats encode data as bytes.

Benefits of binary serialization:

* lower bandwidth usage
* faster serialization/deserialization
* better performance

Common binary formats:

| Format           | Usage                 |
| ---------------- | --------------------- |
| Protocol Buffers | gRPC                  |
| Avro             | Kafka                 |
| MessagePack      | High-performance APIs |

Binary serialization is commonly used in high-scale systems.

<!-- END -->

````id="5p1vxy"

```md id="7x4qpa"
<!-- QUESTION -->
difficulty: Medium
tags: serialization, api-design, backend

What problems can occur during serialization?

<!-- ANSWER -->
Serialization can fail due to unsupported or complex object structures.

Common problems:

| Problem | Explanation |
|---|---|
| Circular references | Object references itself |
| Unsupported types | Functions/sockets cannot serialize |
| Large payloads | Increased bandwidth usage |
| Version mismatch | Schema incompatibility |

Example circular reference:

```js id="2m7qvc"
const user = {}
user.self = user
````

This may cause:

```text id="9v5xqd"
Infinite recursion
```

Other issues:

* precision loss
* encoding problems
* security risks
* performance overhead

Best practices:

* validate schemas
* avoid unnecessary fields
* use versioned contracts
* choose efficient formats

<!-- END -->

````id="4q8mzt"

```md id="2n7vke"
<!-- QUESTION -->
difficulty: Hard
tags: insecure-deserialization, security, backend

What is insecure deserialization?

<!-- ANSWER -->
Insecure deserialization occurs when untrusted serialized data is deserialized without proper validation.

Attackers may exploit this to:
- execute arbitrary code
- manipulate application logic
- escalate privileges
- trigger denial of service

Dangerous flow:

```text
Untrusted Input → Deserialization → Code Execution
````

Example risk:

```text id="6k3vpa"
Attacker modifies serialized object payload
```

Potential impacts:

| Impact                | Description           |
| --------------------- | --------------------- |
| RCE                   | Remote code execution |
| Authentication bypass | Tampered objects      |
| Data manipulation     | Altered object state  |

Vulnerable technologies historically included:

* Java serialization
* PHP object injection
* .NET BinaryFormatter

Best practices:

* never trust serialized input
* validate schemas
* avoid native object deserialization
* prefer safer formats like JSON

<!-- END -->

````id="9m2xwc"

```md id="6v1qpd"
<!-- QUESTION -->
difficulty: Hard
tags: protobuf, grpc, serialization

Why do systems like gRPC use Protocol Buffers instead of JSON?

<!-- ANSWER -->
Protocol Buffers (Protobuf) are compact binary serialization formats optimized for performance.

Comparison:

| JSON | Protocol Buffers |
|---|---|
| Human-readable | Binary format |
| Larger payloads | Smaller payloads |
| Slower parsing | Faster parsing |
| Flexible schema | Strong schema definition |

Example Protobuf schema:

```proto id="3q7xpt"
message User {
  string name = 1;
  int32 age = 2;
}
````

Advantages:

* lower network usage
* faster serialization
* strong typing
* backward compatibility

gRPC uses Protobuf because distributed systems require:

* high throughput
* low latency
* efficient communication

Binary serialization becomes important at large scale.

<!-- END -->

````id="1x8qza"

```md id="5m3vke"
<!-- QUESTION -->
difficulty: Hard
tags: schema-evolution, serialization, distributed-systems

What is schema evolution in serialization systems?

<!-- ANSWER -->
Schema evolution refers to safely changing serialized data structures over time while maintaining compatibility.

Example problem:

```text
Old Service ↔ New Service
````

If schemas differ:

* deserialization may fail
* fields may be missing
* services may break

Example:

Version 1:

```json
{
  "name": "Alex"
}
```

Version 2:

```json id="8v2qyt"
{
  "firstName": "Alex",
  "lastName": "Smith"
}
```

Serialization systems handle evolution using:

* optional fields
* field numbering
* backward compatibility rules

Formats with schema evolution support:

| Format           | Feature               |
| ---------------- | --------------------- |
| Protocol Buffers | Field numbering       |
| Avro             | Schema registry       |
| Thrift           | Version compatibility |

Schema evolution is critical in microservices and distributed systems.

<!-- END -->

````id="7p4xmc"

```md id="3w1qza"
<!-- QUESTION -->
difficulty: Hard
tags: serialization-performance, backend, optimization

How does serialization impact backend performance?

<!-- ANSWER -->
Serialization affects:
- CPU usage
- memory usage
- network bandwidth
- response latency

Performance costs occur during:

```text
Object → Serialization → Network → Deserialization
````

Large or inefficient payloads increase:

* response times
* server load
* bandwidth consumption

Example inefficient payload:

```json id="9q8vxt"
{
  "unusedField1": "...",
  "unusedField2": "...",
  "unusedField3": "..."
}
```

Optimization techniques:

| Technique        | Benefit                    |
| ---------------- | -------------------------- |
| Smaller payloads | Reduced bandwidth          |
| Binary formats   | Faster parsing             |
| Compression      | Lower transfer size        |
| Selective fields | Reduced serialization cost |

Common optimizations:

* pagination
* field filtering
* compression
* efficient serialization libraries

Serialization performance becomes critical in:

* microservices
* high-throughput APIs
* real-time systems
* distributed architectures

<!-- END -->