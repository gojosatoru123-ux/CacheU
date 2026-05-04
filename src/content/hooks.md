---
title: React Hooks
description: A collection of useful React hooks for data fetching, state management, and UI.
category: Reference
order: 3
---

# React Hooks

## `useQuery`

Fetch and cache data with automatic revalidation.

```typescript
import { useQuery } from 'my-project/hooks';

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useQuery(
    () => client.get<User>(`/users/${userId}`),
    { key: `user-${userId}`, staleTime: 60_000 }
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{data.name}</div>;
}
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | — | Cache key |
| `staleTime` | `number` | `0` | Milliseconds before data is stale |
| `retry` | `number` | `3` | Retry attempts on failure |
| `enabled` | `boolean` | `true` | Whether to fetch |

## `useMutation`

Perform write operations with optimistic updates.

```typescript
import { useMutation } from 'my-project/hooks';

function CreateUser() {
  const { mutate, loading, error } = useMutation(
    (data: NewUser) => client.post<User>('/users', data),
    {
      onSuccess: (user) => {
        toast.success(`Created ${user.name}`);
        router.push(`/users/${user.id}`);
      },
    }
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate(formData);
    }}>
      ...
    </form>
  );
}
```

## `useLocalStorage`

Persist state to localStorage with type safety.

```typescript
import { useLocalStorage } from 'my-project/hooks';

const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

## `useDebounce`

Debounce a rapidly-changing value.

```typescript
import { useDebounce } from 'my-project/hooks';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data } = useQuery(
    () => client.get('/search', { params: { q: debouncedQuery } }),
    { key: `search-${debouncedQuery}`, enabled: debouncedQuery.length > 2 }
  );

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## `useIntersectionObserver`

Detect when an element enters the viewport.

```typescript
import { useIntersectionObserver } from 'my-project/hooks';

function LazySection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div ref={ref}>
      {isIntersecting ? <HeavyComponent /> : <Skeleton />}
    </div>
  );
}
```

## `useKeyboard`

Handle keyboard shortcuts declaratively.

```typescript
import { useKeyboard } from 'my-project/hooks';

useKeyboard({
  'cmd+k': () => openCommandPalette(),
  'escape': () => closeModal(),
  'cmd+s': (e) => { e.preventDefault(); saveDocument(); },
});
```
