````md id="8m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: memento-pattern, lld, design-patterns

What is the Memento Design Pattern?

<!-- ANSWER -->
The Memento Design Pattern captures and stores an object's internal state so it can be restored later without exposing implementation details.

Purpose:

```text id="4m8qza"
Save and restore object state
````

Architecture:

```text
Originator → Memento ← Caretaker
```

Benefits:

| Benefit           | Explanation                   |
| ----------------- | ----------------------------- |
| State restoration | Undo previous changes         |
| Encapsulation     | Internal state remains hidden |
| Better recovery   | Restore historical snapshots  |

The Memento Pattern is a behavioral design pattern.

<!-- END -->

````id="5v1xke"

```md id="2n7qpd"
<!-- QUESTION -->
difficulty: Easy
tags: undo-redo, memento-pattern, lld

What problem does the Memento Pattern solve?

<!-- ANSWER -->
Applications often require undo or rollback functionality.

Without Memento:

```text id="6m2xqc"
Manual state tracking becomes complex
````

Problems:

* state corruption risks
* tight coupling
* difficult rollback logic

Memento solution:

```text id="uoeaqr"
Capture object snapshots safely
```

Benefits:

| Benefit              | Explanation            |
| -------------------- | ---------------------- |
| Undo support         | Restore earlier states |
| Cleaner architecture | Encapsulated snapshots |
| Easier rollback      | Controlled recovery    |

Memento simplifies historical state management.

<!-- END -->

````id="9x2vke"

```md id="4q7xwc"
<!-- QUESTION -->
difficulty: Easy
tags: memento-pattern, components, lld

What are the main components of the Memento Pattern?

<!-- ANSWER -->
The Memento Pattern contains:
- Originator
- Memento
- Caretaker

Responsibilities:

| Component | Purpose |
|---|---|
| Originator | Creates and restores state |
| Memento | Stores snapshot state |
| Caretaker | Manages saved mementos |

Architecture:

```text
Caretaker → Memento
Originator ↔ Memento
````

Example:

```text id="6p1qxt"
TextEditor → EditorMemento
```

The caretaker never modifies internal snapshot data directly.

<!-- END -->

````id="3x5vke"

```md id="1n8qpd"
<!-- QUESTION -->
difficulty: Medium
tags: text-editor, memento-pattern, lld

How is the Memento Pattern used in text editors?

<!-- ANSWER -->
Text editors commonly support:
- undo
- redo
- version history

Example workflow:

```text id="5m2xqc"
Type text → Save snapshot → Undo changes
````

Architecture:

```text id="8w4qza"
Editor → EditorMemento → HistoryManager
```

Benefits:

| Benefit                | Explanation                     |
| ---------------------- | ------------------------------- |
| Undo support           | Restore previous text           |
| Better user experience | Reliable editing history        |
| Encapsulation          | Internal editor state protected |

Applications like IDEs and document editors heavily use Memento.

<!-- END -->

````id="8w4qza"

```md id="5x1vyt"
<!-- QUESTION -->
difficulty: Medium
tags: snapshot-management, memento-pattern, software-design

What is stored inside a Memento object?

<!-- ANSWER -->
A Memento stores the internal snapshot state of an object.

Example:

```text id="clt6p5"
Document state:
- content
- cursor position
- formatting
````

Best practice:

```text id="2v7qwr"
Store only necessary restoration data
```

Benefits:

| Benefit             | Explanation             |
| ------------------- | ----------------------- |
| Efficient rollback  | Minimal recovery state  |
| Better memory usage | Smaller snapshots       |
| Encapsulation       | Internal details hidden |

Mementos should avoid exposing implementation details externally.

<!-- END -->

````id="2v7qwr"

```md id="9m3xpd"
<!-- QUESTION -->
difficulty: Medium
tags: memento-vs-command, design-patterns, lld

What is the difference between Memento and Command Design Patterns?

<!-- ANSWER -->
Memento stores object state snapshots.

Command stores executable operations.

Comparison:

| Memento | Command |
|---|---|
| Stores state | Stores actions |
| Focuses on rollback | Focuses on execution |
| Snapshot-based recovery | Operation-based undo |

Example Memento:

```text id="4q2xmc"
Save document snapshot
````

Example Command:

```text id="nh6dzq"
Execute DeleteCommand
```

Undo systems may combine both patterns together.

<!-- END -->

````id="7n1qxt"

```md id="3m5vke"
<!-- QUESTION -->
difficulty: Hard
tags: memory-management, memento-pattern, performance

What memory challenges exist in the Memento Pattern?

<!-- ANSWER -->
Frequent snapshot creation may consume large amounts of memory.

Example problem:

```text id="4v8qpd"
Saving entire document state after every keystroke
````

Potential issues:

| Issue                | Explanation                  |
| -------------------- | ---------------------------- |
| High memory usage    | Large snapshot storage       |
| Performance overhead | Frequent copying             |
| Scalability problems | Massive history accumulation |

Optimizations:

* differential snapshots
* snapshot compression
* limited history size

Example:

```text id="5w2qwc"
Store only changed content
```

Efficient snapshot management is critical in large systems.

<!-- END -->

````id="5w2qwc"

```md id="1x7vza"
<!-- QUESTION -->
difficulty: Hard
tags: transactional-systems, memento-pattern, backend-systems

How is the Memento Pattern useful in transactional systems?

<!-- ANSWER -->
Transactional systems often require rollback support during failures.

Example:

```text id="6m3qpd"
Database transaction rollback
````

Workflow:

```text id="2p8qza"
Save state → Apply changes → Restore on failure
```

Benefits:

| Benefit                | Explanation              |
| ---------------------- | ------------------------ |
| Failure recovery       | Restore consistent state |
| Safer transactions     | Reliable rollback        |
| Better fault tolerance | Reduced corruption risk  |

Memento concepts are widely used in:

* databases
* version control systems
* distributed workflows

<!-- END -->

````id="8p5vke"

```md id="6n2xpd"
<!-- QUESTION -->
difficulty: Hard
tags: encapsulation, memento-pattern, software-design

How does the Memento Pattern preserve encapsulation?

<!-- ANSWER -->
The Memento Pattern allows state restoration without exposing internal object details.

Without Memento:

```text id="1q8vza"
External systems directly modify object internals
````

With Memento:

```text id="rzdmjt"
Only Originator accesses internal state
```

Benefits:

| Benefit                | Explanation                   |
| ---------------------- | ----------------------------- |
| Better encapsulation   | Internal data protected       |
| Controlled restoration | Safer recovery                |
| Cleaner architecture   | Reduced external dependencies |

The caretaker only stores snapshots and cannot modify internal data directly.

<!-- END -->

````id="1q8vza"

```md id="9m4qwc"
<!-- QUESTION -->
difficulty: Hard
tags: memento-pattern, trade-offs, software-design

What are the trade-offs of using the Memento Pattern?

<!-- ANSWER -->
The Memento Pattern improves recovery and undo support but increases memory and snapshot complexity.

Advantages:

| Advantage | Explanation |
|---|---|
| Undo functionality | Restore previous states |
| Encapsulation | Hidden internal data |
| Better reliability | Safer rollback support |

Trade-offs:

| Trade-off | Explanation |
|---|---|
| Increased memory usage | Snapshot storage overhead |
| Snapshot management complexity | History maintenance |
| Performance costs | Frequent state copying |

Example:

```text id="7v2xpd"
Large object snapshots stored repeatedly
````

Memento works best when:

* rollback functionality is important
* object state changes frequently
* recovery mechanisms are required

<!-- END -->