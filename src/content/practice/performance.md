---
title: Performance — Practice Quiz
articleSlug: performance
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: web-vitals, metrics

What are Core Web Vitals? Name three, what each measures, and what the "good" threshold is.

<!-- ANSWER -->
Core Web Vitals are Google's set of real-world performance metrics that directly impact user experience and SEO ranking.

| Metric | Full Name | Measures | Good Threshold |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | How long until the largest visible element loads | < 2.5 seconds |
| **FID** | First Input Delay | How long before the page responds to first interaction | < 100ms |
| **CLS** | Cumulative Layout Shift | How much the page visually shifts during loading | < 0.1 |
| **INP** | Interaction to Next Paint | Responsiveness to all user interactions (replaces FID) | < 200ms |

**Common causes and fixes:**
- **Poor LCP** → Large unoptimized hero images, slow server response; fix: compress images, use CDN, add `loading="eager"` and `fetchpriority="high"` to hero image
- **High CLS** → Images without dimensions, ads loading late; fix: always set `width` and `height` on `<img>`, reserve space for dynamic content
- **High FID/INP** → Heavy JavaScript blocking main thread; fix: code split, defer non-critical JS, use web workers
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: database, query-optimization, indexing

A query `SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC` is slow. What are three things you'd investigate and fix?

<!-- ANSWER -->
**1. Add a composite index:**
```sql
-- Without index: full table scan on every request
-- With index: instant B-tree lookup
CREATE INDEX idx_orders_status_created
ON orders (status, created_at DESC);
```

The composite index covers both the `WHERE` filter and the `ORDER BY` — one index scan instead of sort + filter.

**2. Avoid `SELECT *`:**
```sql
-- Bad: fetches all columns including large text/JSON fields
SELECT * FROM orders WHERE status = 'pending'

-- Good: fetch only what's needed
SELECT id, user_id, total, created_at FROM orders WHERE status = 'pending'
```

Smaller rows → less data transferred from DB → faster.

**3. Add pagination — never return unbounded results:**
```sql
-- Dangerous: could return millions of rows
SELECT id, total, created_at FROM orders WHERE status = 'pending' ORDER BY created_at DESC

-- Safe: cursor-based pagination
SELECT id, total, created_at FROM orders
WHERE status = 'pending'
  AND created_at < :cursor  -- cursor from previous page
ORDER BY created_at DESC
LIMIT 50;
```

**Bonus:** Use `EXPLAIN ANALYZE` to see the actual query plan and identify seq scans vs index scans.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: react, rendering, optimization

A React component re-renders every second because a parent updates. The component is expensive to render. What are three React optimization techniques and when to use each?

<!-- ANSWER -->
**1. `React.memo` — skip re-render if props haven't changed:**
```tsx
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
});

// Parent updates every second, but ExpensiveList only re-renders when `items` changes
```

**When:** Component renders the same output for the same props; parent re-renders frequently.

---

**2. `useMemo` — memoize expensive computed values:**
```tsx
function Dashboard({ orders }: { orders: Order[] }) {
  // Without useMemo: recalculated every render
  const revenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders] // only recalculate when orders changes
  );

  return <div>Total revenue: ${revenue}</div>;
}
```

**When:** Computing derived data from props/state is expensive (sorting, filtering large arrays, complex math).

---

**3. `useCallback` — stable function reference across renders:**
```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function reference every render → ExpensiveChild always re-renders
  const handleSubmit = useCallback((data: FormData) => {
    saveToApi(data);
  }, []); // stable reference

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild onSubmit={handleSubmit} /> {/* won't re-render on count change */}
    </>
  );
}
```

**When:** Passing callbacks to memoized child components. Without `useCallback`, new function reference on every render defeats `React.memo`.

**Warning:** Don't memoize everything blindly — it adds memory overhead and complexity. Profile first.
<!-- END -->
