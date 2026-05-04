---
title: React Hooks — Practice Quiz
articleSlug: hooks
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: useState, useEffect, basics

What is the difference between `useState` and `useRef`? When would you use each?

<!-- ANSWER -->
| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render | ✅ Yes | ❌ No |
| Persists across renders | ✅ Yes | ✅ Yes |
| Mutable directly | ❌ No (use setter) | ✅ Yes (.current = x) |
| Use for | UI state | DOM refs, timers, previous values |

**`useState`** — any value that, when changed, should update the UI:
```tsx
const [count, setCount] = useState(0);
// setCount(1) → triggers re-render
```

**`useRef`** — values you need to persist but don't want to trigger re-renders:
```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// Timer ID (doesn't need to trigger re-render)
const timerRef = useRef<number | null>(null);
timerRef.current = setTimeout(() => { /* ... */ }, 1000);

// Previous value tracking
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; });
```
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: useEffect, dependencies, cleanup

Implement a `useWindowSize` custom hook that tracks the browser window dimensions. Include proper cleanup.

<!-- ANSWER -->
```tsx
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add listener
    window.addEventListener('resize', handleResize);

    // Cleanup — remove listener when component unmounts or effect re-runs
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // empty deps — run once on mount, cleanup on unmount

  return size;
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  return <div>{width < 768 ? 'Mobile' : 'Desktop'} — {width}×{height}</div>;
}
```

**Why cleanup matters:** If you don't remove the event listener, every time the component mounts a new listener is added. If the component unmounts and remounts 10 times, you'd have 10 listeners all calling `setSize` → memory leak + errors on unmounted components.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: custom-hook, useFetch, data-fetching

Build a `useFetch<T>` hook that handles loading, error, and data states. Include request cancellation with `AbortController`.

<!-- ANSWER -->
```tsx
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json() as T;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled && err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    // Cleanup: cancel in-flight request on URL change or unmount
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, trigger]);

  const refetch = useCallback(() => setTrigger(t => t + 1), []);

  return { data, loading, error, refetch };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error, refetch } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  if (error) return <button onClick={refetch}>Retry: {error.message}</button>;
  return <div>{user?.name}</div>;
}
```

**Why AbortController?** When the `userId` prop changes quickly (user navigates fast), the old request might return after the new one — showing stale data. Aborting the old request prevents this "race condition."
<!-- END -->
